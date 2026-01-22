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

function normalizeString(str: string | number): string {
    return canonicalize(String(str))
}

export function ruleRequiresAdvancedData(rule: Rule): boolean {
    if (!rule.enabled) return false
    const advancedAttributes: Attribute[] = ['Region', 'Flag', 'Bid', 'Owner Count']
    return rule.conditions.some(c => advancedAttributes.includes(c.attribute))
}

export function evaluateCondition(
    condition: Condition,
    card: Card,
    advancedData?: { region?: string; flag?: string; bid?: number; owners?: number }
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
    advancedData?: { region?: string; flag?: string; bid?: number; owners?: number }
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
