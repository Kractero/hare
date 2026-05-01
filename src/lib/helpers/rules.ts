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
    bid?: number
    owners?: number
}

function normalizeString(str: string | number): string {
    return canonicalize(String(str))
}

export function isRegionCacheableCondition(condition: Condition): boolean {
    return condition.attribute === 'Region' && ['=', '!=', 'in list', 'not in list'].includes(condition.operator)
}

export function getRuleRegionCacheKeys(rule: Rule): string[] {
    const regions = new Set<string>()

    rule.conditions.forEach(condition => {
        if (!isRegionCacheableCondition(condition)) return

        const values = condition.operator === 'in list' || condition.operator === 'not in list'
            ? condition.value.split(/[\n,]+/)
            : [condition.value]

        values.map(region => canonicalize(region)).filter(Boolean).forEach(region => regions.add(region))
    })

    return [...regions]
}

export function ruleRequiresCardDetails(rule: Rule): boolean {
    if (!rule.enabled) return false
    return rule.conditions.some(c => ['Flag', 'Bid', 'Owner Count'].includes(c.attribute) || (c.attribute === 'Region' && !isRegionCacheableCondition(c)))
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
            if (isRegionCacheableCondition(condition) && advancedData?.regionCardIds) {
                const cardId = Number(card.CARDID)
                const inRegion = (region: string) => advancedData.regionCardIds?.get(canonicalize(region))?.has(cardId) || false

                if (operator === '=') return inRegion(value)
                if (operator === '!=') return !inRegion(value)

                const list = value.split(/[\n,]+/).map(s => canonicalize(s)).filter(Boolean)
                const inAnyRegion = list.some(region => advancedData.regionCardIds?.get(region)?.has(cardId))
                return operator === 'in list' ? inAnyRegion : !inAnyRegion
            }

            cardValue = advancedData?.region?.toLowerCase() || ''
            value = value.toLowerCase()
            break
        case 'Flag':
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
            if (attribute === 'Season' || attribute === 'Card ID' || attribute === 'Owner Count' || attribute === 'Bid' || attribute === 'Market Value') {
                return Number(cardValue) === Number(value)
            }
            return String(cardValue).toLowerCase() === String(value).toLowerCase()
        case '!=':
            if (attribute === 'Season' || attribute === 'Card ID' || attribute === 'Owner Count' || attribute === 'Bid' || attribute === 'Market Value') {
                return Number(cardValue) !== Number(value)
            }
            return normalizeString(cardValue) !== normalizeString(value)
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
        case 'in list': {
            // Use newlines or commas to separate for lists
            const list = value.split(/[\n,]+/).map(s => normalizeString(s)).filter(Boolean)
            return list.includes(normalizeString(cardValue))
        }
        case 'not in list': {
            const list = value.split(/[\n,]+/).map(s => normalizeString(s)).filter(Boolean)
            return !list.includes(normalizeString(cardValue))
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
