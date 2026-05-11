import type { Card } from '$lib/types'
import { canonicalize } from '$lib/helpers/utils'

export type Attribute =
    | 'Rarity'
    | 'Season'
    | 'Market Value'
    | 'Bid'
    | 'Region'
    | 'Flag'
    | 'Card ID'
    | 'Owner Count'

export type Operator =
    | '='
    | '!='
    | '>'
    | '>='
    | '<'
    | '<='
    | 'contains'
    | 'does not contain'
    | 'in list'
    | 'not in list'
    | 'starts with'
    | 'ends with'

export type ActionType = 'Gift' | 'Junk' | 'Sell' | 'Nothing'

export interface Condition {
    id: string
    attribute: Attribute
    operator: Operator
    value: string
}

export interface Action {
    id: string
    type: ActionType
    target?: string
}

export interface Rule {
    id: string
    enabled: boolean
    name?: string
    conditions: Condition[]
    combinator: 'AND' | 'OR'
    actions: Action[]
}

export interface AdvancedRuleData {
    region?: string
    regionCardIds?: Map<string, Set<number>>
    flag?: string
    flagCardIds?: Map<string, Set<number>>
    bid?: number
    owners?: number
}

function normalizeString(str: string | number): string {
    return canonicalize(String(str))
}

const LIST_OPERATORS = new Set<Operator>(['in list', 'not in list'])
const CACHEABLE_OPERATORS = new Set<Operator>(['=', '!=', 'in list', 'not in list'])
const NUMERIC_ATTRIBUTES = new Set<Attribute>(['Season', 'Card ID', 'Owner Count', 'Bid', 'Market Value'])
const DETAIL_ATTRIBUTES = new Set<Attribute>(['Bid', 'Owner Count'])

function splitConditionValues(value: string): string[] {
    return value.split(/[\n,]+/)
}

function collectCacheKeys(
    rule: Rule,
    isCacheableCondition: (condition: Condition) => boolean,
    normalize: (value: string) => string
): string[] {
    const keys = new Set<string>()

    rule.conditions.forEach(condition => {
        if (!isCacheableCondition(condition)) return

        const values = LIST_OPERATORS.has(condition.operator)
            ? splitConditionValues(condition.value)
            : [condition.value]

        values.map(normalize).filter(Boolean).forEach(value => keys.add(value))
    })

    return [...keys]
}

function evaluateCachedMembership(
    cardId: number,
    operator: Operator,
    value: string,
    normalize: (value: string) => string,
    cacheMap?: Map<string, Set<number>>
): boolean | undefined {
    if (!cacheMap || !CACHEABLE_OPERATORS.has(operator)) return undefined

    const hasValue = (key: string) => cacheMap.get(normalize(key))?.has(cardId) || false
    if (operator === '=') return hasValue(value)
    if (operator === '!=') return !hasValue(value)

    const matchesAny = splitConditionValues(value).map(normalize).filter(Boolean).some(hasValue)
    return operator === 'in list' ? matchesAny : !matchesAny
}

export function isRegionCacheableCondition(condition: Condition): boolean {
    return condition.attribute === 'Region' && CACHEABLE_OPERATORS.has(condition.operator)
}

export function isFlagCacheableCondition(condition: Condition): boolean {
    return condition.attribute === 'Flag' && CACHEABLE_OPERATORS.has(condition.operator)
}

export function getRuleRegionCacheKeys(rule: Rule): string[] {
    return collectCacheKeys(rule, isRegionCacheableCondition, canonicalize)
}

export function getRuleFlagCacheKeys(rule: Rule): string[] {
    return collectCacheKeys(rule, isFlagCacheableCondition, flag => flag.trim())
}

export function ruleRequiresCardDetails(rule: Rule): boolean {
    if (!rule.enabled) return false
    return rule.conditions.some(conditionRequiresCardDetails)
}

function conditionRequiresCardDetails(condition: Condition): boolean {
    return DETAIL_ATTRIBUTES.has(condition.attribute)
        || (condition.attribute === 'Region' && !isRegionCacheableCondition(condition))
        || (condition.attribute === 'Flag' && !isFlagCacheableCondition(condition))
}

export function ruleNeedsCardDetailsForCard(rule: Rule, card: Card, advancedData?: AdvancedRuleData): boolean {
    if (!ruleRequiresCardDetails(rule)) return false

    const cheapConditions = rule.conditions.filter(c => !conditionRequiresCardDetails(c))
    if (cheapConditions.length === 0) return true

    if (rule.combinator === 'AND') {
        return cheapConditions.every(c => evaluateCondition(c, card, advancedData))
    }

    return !cheapConditions.some(c => evaluateCondition(c, card, advancedData))
}

export function evaluateCondition(
    condition: Condition,
    card: Card,
    advancedData?: AdvancedRuleData
): boolean {
    let { attribute, operator, value } = condition
    let cardValue: string | number | undefined

    switch (attribute) {
        case 'Rarity':
            cardValue = card.CATEGORY
            break
        case 'Season':
            cardValue = Number(card.SEASON)
            break
        case 'Market Value':
            cardValue = parseFloat(card.MARKET_VALUE)
            break
        case 'Card ID':
            cardValue = Number(card.CARDID)
            break
        case 'Region':
            const regionMatch = evaluateCachedMembership(Number(card.CARDID), operator, value, canonicalize, advancedData?.regionCardIds)
            if (regionMatch !== undefined) return regionMatch

            cardValue = advancedData?.region?.toLowerCase() || ''
            value = value.toLowerCase()
            break
        case 'Flag':
            const flagMatch = evaluateCachedMembership(Number(card.CARDID), operator, value, flag => flag.trim(), advancedData?.flagCardIds)
            if (flagMatch !== undefined) return flagMatch

            cardValue = advancedData?.flag || ''
            break
        case 'Bid':
            cardValue = advancedData?.bid || 0
            break
        case 'Owner Count':
            cardValue = advancedData?.owners || 0
            break
    }

    if (cardValue === undefined) return false

    switch (operator) {
        case '=':
            return NUMERIC_ATTRIBUTES.has(attribute)
                ? Number(cardValue) === Number(value)
                : String(cardValue).toLowerCase() === String(value).toLowerCase()
        case '!=':
            return NUMERIC_ATTRIBUTES.has(attribute)
                ? Number(cardValue) !== Number(value)
                : normalizeString(cardValue) !== normalizeString(value)
        case '>':
            return Number(cardValue) > Number(value)
        case '>=':
            return Number(cardValue) >= Number(value)
        case '<':
            return Number(cardValue) < Number(value)
        case '<=':
            return Number(cardValue) <= Number(value)
        case 'contains':
            return normalizeString(cardValue).includes(normalizeString(value))
        case 'does not contain':
            return !normalizeString(cardValue).includes(normalizeString(value))
        case 'in list':
        case 'not in list': {
            // Use newlines or commas to separate for lists
            const list = splitConditionValues(value).map(s => normalizeString(s)).filter(Boolean)
            const inList = list.includes(normalizeString(cardValue))
            return operator === 'in list' ? inList : !inList
        }
        case 'starts with':
            return normalizeString(cardValue).startsWith(normalizeString(value))
        case 'ends with':
            return normalizeString(cardValue).endsWith(normalizeString(value))
        default:
            return false
    }
}

export function evaluateRule(
    card: Card,
    rule: Rule,
    advancedData?: AdvancedRuleData
): { matched: boolean; actions: Action[] } {
    if (!rule.enabled) return { matched: false, actions: [] }

    // No conditions -> always apply
    if (rule.conditions.length === 0) return { matched: true, actions: rule.actions }

    const results = rule.conditions.map(c => evaluateCondition(c, card, advancedData))

    let matched = false
    if (rule.combinator === 'AND') {
        matched = results.every(r => r)
    } else {
        matched = results.some(r => r)
    }

    return matched ? { matched: true, actions: rule.actions } : { matched: false, actions: [] }
}

export function getRuleSummary(rule: Rule): string {
    if (rule.name) return rule.name
    if (rule.conditions.length === 0) return 'Always applies'

    const parts = rule.conditions.map(c => {
        let val = c.value
        if (c.attribute === 'Rarity' && !val) val = '(any)'
        if ((c.attribute === 'Market Value' || c.attribute === 'Bid') && val && !isNaN(parseFloat(val))) {
            val = parseFloat(val).toFixed(2)
        }
        return `${c.attribute} ${c.operator === '!=' ? '≠' : c.operator} ${val}`
    })

    return parts.join(rule.combinator === 'AND' ? ' AND ' : ' OR ')
}
