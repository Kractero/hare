<script lang="ts">
	import { onDestroy, onMount } from 'svelte'
	import { page } from '$app/state'
	import Buttons from '$lib/components/Buttons.svelte'
	import OpenButton from '$lib/components/buttons/OpenButton.svelte'
	import FormCheckbox from '$lib/components/FormCheckbox.svelte'
	import FormInput from '$lib/components/FormInput.svelte'
	import FormSelect from '$lib/components/FormSelect.svelte'
	import FormTextArea from '$lib/components/FormTextArea.svelte'
	import InputCredentials from '$lib/components/InputCredentials.svelte'
	import RuleDashboard from '$lib/components/junkdajunk/rules/RuleDashboard.svelte'
	import Rarities from '$lib/components/Rarities.svelte'
	import Terminal from '$lib/components/Terminal.svelte'
	import ToolContent from '$lib/components/ToolContent.svelte'
	import * as AlertDialog from '$lib/components/ui/alert-dialog'
	import Button from '$lib/components/ui/button/button.svelte'
	import { cardListEntryMatches, parseCardList } from '$lib/helpers/cardList'
	import { giftCard } from '$lib/helpers/gift'
	import { parseXML, sleep } from '$lib/helpers/parser'
	import {
		evaluateRule,
		getRuleFlagCacheKeys,
		getRuleRegionCacheKeys,
		getRuleSummary,
		isRegionCacheableCondition,
		ruleNeedsCardDetailsForCard,
		type Action,
		type AdvancedRuleData,
		type Rule,
	} from '$lib/helpers/rules'
	import {
		beforeUnload,
		canonicalize,
		checkUserAgent,
		defaultPrices,
		pushHistory,
		urlParameters,
	} from '$lib/helpers/utils'
	import type { Card, Prices } from '$lib/types'

	const abortController = new AbortController()

	let dialogOpen = $state(false)
	let domain = ''
	let info = $state<Array<{ text: string; color?: string }>>([])
	let progress = $state<Array<{ text: string; color?: string }>>([])
	let junkCounter = $state('')
	let content: Array<{ url: string; tableText: string; linkStyle?: string }> = $state([])
	let stoppable = $state(false)
	let stopped = $state(false)
	let downloadable = $state(false)
	let main = $state('')
	let giftee = $state('')
	let puppets = $state('')
	let regionalwhitelist = $state('')
	let flagwhitelist = $state('')
	let mode = $state('Gift')
	let password = $state('')
	let owners = $state('')
	let cardcount = $state('')
	let junkMethod = $state('API')
	let checkMode = $state('Advanced')
	let raritiesMV: Prices = $state(defaultPrices)
	let raritiesLowestBid: Prices = $state(defaultPrices)
	let raritiesMVSell: Prices = $state(defaultPrices)
	let raritiesLowestBidSell: Prices = $state(defaultPrices)
	let skipseason: string[] = $state([])
	let skipexnation = $state(false)
	let sellContent: Array<{ url: string; tableText: string; linkStyle?: string }> = $state([])
	let finderlist = $state('')
	// let jdjtransfer = $state('-1')
	let errors: Array<{ field: string | number; message: string }> = $state([])
	let junkUpTo = $state('-1')
	let configMode = $state('Classic')
	let rules: Rule[] = $state([])
	let rulesLoaded = $state(false)

	type KotamaCardList = {
		cards?: Array<{ id: number }>
	}

	const cardSeasons = ['1', '2', '3', '4']

	$effect(() => {
		if (rulesLoaded) localStorage.setItem('junkdajunkRules', JSON.stringify(rules))
	})

	$effect(() => {
		if (rulesLoaded) localStorage.setItem('junkdajunkConfigMode', configMode)
	})

	onMount(() => {
		domain = `https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net`
		main = page.url.searchParams.get('main') || (localStorage.getItem('main') as string) || ''
		puppets = (localStorage.getItem('gotissuesPuppets') as string) || ''
		password = (localStorage.getItem('password') as string) || ''
		mode =
			page.url.searchParams.get('mode') ||
			(localStorage.getItem('jdjMode') as string) ||
			(localStorage.getItem('finderMode') as string) ||
			'Gift'
		checkMode = page.url.searchParams.get('checkMode') || (localStorage.getItem('jdjCheckMode') as string) || 'Advanced'
		junkMethod = page.url.searchParams.get('junk') || (localStorage.getItem('junkMethod') as string) || 'API'
		regionalwhitelist =
			page.url.searchParams.get('regions')?.replaceAll(',', '\n') ||
			(localStorage.getItem('junkdajunkRegionalWhitelist') as string) ||
			''
		flagwhitelist =
			page.url.searchParams.get('flags')?.replaceAll(',', '\n') ||
			(localStorage.getItem('junkdajunkFlagWhitelist') as string) ||
			''
		finderlist = (localStorage.getItem('junkdajunkFinderList') as string) || ''
		giftee =
			page.url.searchParams.get('giftee')?.split(',').join('\n') ||
			(localStorage.getItem('finderGiftee') as string) ||
			''
		raritiesMV = localStorage.getItem('junkdajunkRarities')
			? JSON.parse(localStorage.getItem('junkdajunkRarities') as string)
			: defaultPrices
		raritiesLowestBid = localStorage.getItem('junkdajunkRaritiesBid')
			? JSON.parse(localStorage.getItem('junkdajunkRaritiesBid') as string)
			: localStorage.getItem('junkdajunkRarities')
				? JSON.parse(localStorage.getItem('junkdajunkRarities') as string)
				: defaultPrices
		raritiesMVSell = localStorage.getItem('junkdajunkRaritiesSell')
			? JSON.parse(localStorage.getItem('junkdajunkRaritiesSell') as string)
			: defaultPrices
		raritiesLowestBidSell = localStorage.getItem('junkdajunkRaritiesBidSell')
			? JSON.parse(localStorage.getItem('junkdajunkRaritiesBidSell') as string)
			: defaultPrices
		owners = page.url.searchParams.get('owners') || (localStorage.getItem('junkdajunkOwnerCount') as string) || ''
		cardcount = page.url.searchParams.get('cardcount') || (localStorage.getItem('junkdajunkCardCount') as string) || ''
		const validSeasons = new Set(cardSeasons)
		const rawSeasons = page.url.searchParams.get('skipseason') ?? localStorage.getItem('junkdajunkOmittedSeasons') ?? ''
		skipseason = Array.from(new Set(rawSeasons.split(',').filter(s => validSeasons.has(s))))
		skipexnation =
			page.url.searchParams.get('skipexnation') === 'true' ||
			localStorage.getItem('junkdajunkExnation') === 'true' ||
			false
		junkUpTo = page.url.searchParams.get('junkUpTo') || (localStorage.getItem('junkUpTo') as string) || '-1'
		configMode = localStorage.getItem('junkdajunkConfigMode') || 'Classic'
		try {
			const savedRules = localStorage.getItem('junkdajunkRules')
			if (savedRules) rules = JSON.parse(savedRules)
		} catch (e) {
			console.error('Failed to load rules', e)
		} finally {
			rulesLoaded = true
		}
	})
	onDestroy(() => abortController.abort())

	async function fetchKotamaCardIds(clause: string, season: string): Promise<Set<string>> {
		const params = new URLSearchParams({
			select: 'min',
			clauses: clause,
			ua: main,
			limit: '252525252525',
			from: `S${season}`,
		})
		const response = await fetch(`https://kotama.kractero.com/api?${params}`, {
			signal: abortController.signal,
		})
		if (!response.ok) throw new Error(`Kotama returned ${response.status} for ${clause}`)
		const data: KotamaCardList = await response.json()
		return new Set((data.cards || []).map(card => `${Number(card.id)},${season}`))
	}

	async function fetchKotamaCardIdCache(
		entries: { key: string; clause: string }[]
	): Promise<Map<string, Set<string>>> {
		const cardIds = new Map<string, Set<string>>()
		if (entries.length === 0) return cardIds

		progress = [...progress, { text: `Fetching card IDs for ${entries.length} checks...` }]

		for (const { key, clause } of entries) {
			const ids = new Set<string>()
			for (const season of cardSeasons) {
				if (abortController.signal.aborted || stopped) break
				const seasonalIds = await fetchKotamaCardIds(clause, season)
				seasonalIds.forEach(id => ids.add(id))
				await sleep(0.6)
			}
			if (abortController.signal.aborted || stopped) break
			cardIds.set(key, ids)
			progress = [...progress, { text: `Cached ${ids.size} cards for ${key}` }]
		}

		return cardIds
	}

	function sortCardIds(cardIds: string[]): string[] {
		return cardIds.sort((a, b) => {
			const [aId, aSeason] = a.split(',').map(Number)
			const [bId, bSeason] = b.split(',').map(Number)
			return aSeason - bSeason || aId - bId
		})
	}

	function rewriteRegionRulesWithCardIds(sourceRules: Rule[], regionCardIds: Map<string, Set<string>>): Rule[] {
		let changed = false

		const rewrittenRules = sourceRules.map(rule => {
			if (!rule.enabled) return rule
			const originalSummary = getRuleSummary(rule)
			let ruleChanged = false

			const conditions = rule.conditions.map(condition => {
				if (!isRegionCacheableCondition(condition)) return condition

				const regions = ['in list', 'not in list'].includes(condition.operator)
					? condition.value.split(/[\n,]+/).map(value => canonicalize(value)).filter(Boolean)
					: [canonicalize(condition.value)]
				const ids = new Set<string>()
				regions.forEach(region => regionCardIds.get(region)?.forEach(id => ids.add(id)))
				changed = true
				ruleChanged = true

				return {
					...condition,
					attribute: 'Card ID' as const,
					operator: ['=', 'in list'].includes(condition.operator) ? 'in list' as const : 'not in list' as const,
					value: sortCardIds([...ids]).join('\n'),
				}
			})

			return ruleChanged ? { ...rule, name: rule.name || originalSummary, conditions } : rule
		})

		return changed ? rewrittenRules : sourceRules
	}

	function findCommaSeparatedCardIdRule(rulesToCheck: Rule[]): number | undefined {
		const ruleIndex = rulesToCheck.findIndex(
			rule =>
				rule.enabled &&
				rule.conditions.some(condition => {
					if (condition.attribute !== 'Card ID' || !['in list', 'not in list'].includes(condition.operator)) return false
					return condition.value
						.split('\n')
						.map(line => line.trim())
						.filter(Boolean)
						.some(line => {
							const parts = line.split(',').map(part => part.trim()).filter(Boolean)
							return parts.length > 1 && !(parts.length === 2 && cardSeasons.includes(parts[1]))
						})
				})
		)
		return ruleIndex === -1 ? undefined : ruleIndex
	}

	async function onSubmit(e: Event) {
		if (downloadable) {
			dialogOpen = true
			return
		}
		e.preventDefault()
		pushHistory(
			`?main=${main}&mode=${mode}&junkMethod=${junkMethod}&checkMode=${checkMode}${giftee ? `&giftee=${giftee.split('\n').join(',')}` : ''}${owners ? `&owners=${owners}` : ''}${cardcount ? `&cardcount=${cardcount}` : ''}${regionalwhitelist ? `&regions=${regionalwhitelist.replaceAll('\n', ',')}` : ''}${flagwhitelist ? `&flags=${flagwhitelist.replaceAll('\n', ',')}` : ''}${skipseason && skipseason.length > 0 ? `&skipseason=${skipseason}` : ''}${skipexnation ? `&skipexnation=${skipexnation}` : ''}${junkUpTo ? `&junkUpTo=${junkUpTo}` : ''}`
		)
		errors = checkUserAgent(main)
		if (errors.length > 0) return
		window.addEventListener('beforeunload', beforeUnload)
		downloadable = false
		stoppable = true
		stopped = false
		progress = []
		info = []
		content = []
		sellContent = []
		let puppetList = puppets.split('\n')
		const newInfo = []

		newInfo.push({ text: `Initiating JunkDaJunk with ${checkMode} ${junkMethod} ${mode}` })

		const regionalWhitelist = regionalwhitelist ? regionalwhitelist.split('\n').map(region => canonicalize(region)) : []
		if (regionalWhitelist.length > 0) {
			newInfo.push({ text: `Whitelisting regions: ${regionalWhitelist.map(region => region.trim()).join(', ')}` })
		}
		const flagWhitelist = flagwhitelist ? flagwhitelist.split('\n') : []
		if (flagWhitelist.length > 0) {
			newInfo.push({ text: `Whitelisting flags: ${flagWhitelist.map(flag => flag.trim()).join(', ')}` })
		}

		if (finderlist) {
			const count = finderlist.split('\n').filter(Boolean).length
			if (count > 0) {
				newInfo.push({ text: `Whitelisting cards: ${count} cards whitelisted` })
			}
		}

		if (skipseason && skipseason.length > 0) newInfo.push({ text: `Skipping seasons: ${skipseason}` })

		if (skipexnation === true) newInfo.push({ text: `Skipping s1 exnations` })

		// for (const [rarity, threshold] of Object.entries(raritiesMV))
		// 	newInfo.push({ text: `${rarity} junk threshold at ${threshold}` })

		// for (const [rarity, bid] of Object.entries(raritiesLowestBid))
		// 	newInfo.push({ text: `${rarity} junk threshold at ${bid}` })

		const findSplit = parseCardList(finderlist)
		const whitelistSet = new Set(findSplit.map(f => `${f.id},${f.season || ''}`))

		info = newInfo

		if (configMode === 'Rules') {
			const commaSeparatedRuleIndex = findCommaSeparatedCardIdRule(rules)
			if (commaSeparatedRuleIndex !== undefined) {
				info = [
					...info,
					{
						text: `Rule ${commaSeparatedRuleIndex + 1} looks like it uses comma-separated Card ID values. Put one card per line, optionally as id,season.`,
						color: 'red',
					},
				]
				stoppable = false
				window.removeEventListener('beforeunload', beforeUnload)
				return
			}
		}

		let junkedCards = 0
		let giftedCards = 0
		let actionCount = 0
		let currCard = 0
		let currSellCard = 0
		let regionCardIds = new Map<string, Set<string>>()
		let flagCardIds = new Map<string, Set<string>>()

		let gifteeQueue = giftee
			.split('\n')
			.map(name => name.trim())
			.filter(Boolean)

		try {
			if (configMode === 'Rules') {
				const enabledRules = rules.filter(r => r.enabled)
				const regions = [...new Set(enabledRules.flatMap(getRuleRegionCacheKeys))]
				const flags = [...new Set(enabledRules.flatMap(getRuleFlagCacheKeys))]
				regionCardIds = await fetchKotamaCardIdCache(
					regions.map(r => ({ key: r, clause: `region-IS-${r.replaceAll('_', ' ')}` }))
				)
				rules = rewriteRegionRulesWithCardIds(rules, regionCardIds)
				flagCardIds = await fetchKotamaCardIdCache(flags.map(f => ({ key: f, clause: `flag-IS-${f}` })))
			} else if (regionalWhitelist.length > 0) {
				regionCardIds = await fetchKotamaCardIdCache(
					regionalWhitelist.map(r => ({ key: r, clause: `region-IS-${r.replaceAll('_', ' ')}` }))
				)
				if (flagWhitelist.length > 0) {
					flagCardIds = await fetchKotamaCardIdCache(flagWhitelist.map(f => ({ key: f, clause: `flag-IS-${f}` })))
				}
			}
		} catch (err) {
			info = [...info, { text: `Error fetching cached card lists: ${err}`, color: 'red' }]
			stoppable = false
			window.removeEventListener('beforeunload', beforeUnload)
			return
		}

		for (let i = 0; i < puppetList.length; i++) {
			let currentNationXPin = ''
			let nation = puppetList[i]
			let nationSpecificPassword = ''
			if (nation.includes(',')) {
				nation = puppetList[i].split(',')[0]
				nationSpecificPassword = puppetList[i].split(',')[1]
			}
			if (abortController.signal.aborted || stopped) {
				break
			}
			nation = nation.toLowerCase().replaceAll(' ', '_')
			try {
				progress = [...progress, { text: `Processing ${nation} ${i + 1}/${puppetList.length} puppets` }]
				const xmlDocument = await parseXML(`${domain}/cgi-bin/api.cgi?nationname=${nation}&q=cards+deck+info`, main)
				let cards: Array<Card> = xmlDocument.CARDS.DECK.CARD
				cards = cards ? (Array.isArray(cards) ? cards : [cards]) : []
				if (cards && cards.length > 0 && (configMode === 'Rules' || cards.length > Number(cardcount))) {
					const giftQueue = []
					for (let j = 0; j < cards.length; j++) {
						if (Number(junkUpTo) !== -1 && actionCount >= Number(junkUpTo)) break

						const id = cards[j].CARDID
						const season = cards[j].SEASON
						const marketValue = cards[j].MARKET_VALUE
						const category = cards[j].CATEGORY
						if (abortController.signal.aborted || stopped) {
							break
						}

						let junk = true
						let sell = true
						let reason = ''
						let giftTarget = ''

						if (whitelistSet.has(`${id},${season}`)) {
							progress = [
								...progress,
								{ text: `${j + 1}/${cards.length} -> Skipping S${season} ${id} - whitelisted`, color: 'blue' },
							]
							continue
						}

						if (configMode === 'Rules') {
							let advancedDataFetched = false
							let advancedData: AdvancedRuleData = { regionCardIds, flagCardIds }
							let matchedActions: Action[] = []
							let matchedRuleSummary = ''

							for (const rule of rules) {
								if (!rule.enabled) continue

								if (ruleNeedsCardDetailsForCard(rule, cards[j], advancedData) && !advancedDataFetched) {
									// only fetch full card details if JDJ hits a rule that needs data not covered by caches
									// skips requests if earlier rules already matched
									const cardDetailsXml = await parseXML(
										`${domain}/cgi-bin/api.cgi?cardid=${id}&season=${season}&q=card+markets+info+owners`,
										main
									)
									const card: Card = cardDetailsXml.CARD
									const cardOwners = Array.isArray(card.OWNERS.OWNER)
										? new Set(card.OWNERS.OWNER)
										: new Set([card.OWNERS.OWNER])
									const region = String(card.REGION)
									const flag = String(card.FLAG)
									let highestBid = 0
									const markets = card.MARKETS ? card.MARKETS.MARKET : []
									if (Array.isArray(markets)) {
										markets.forEach(market => {
											if (market.TYPE === 'bid') {
												const price = parseFloat(market.PRICE)
												if (price > highestBid) {
													highestBid = price
												}
											}
										})
									} else {
										if (markets && markets.TYPE === 'bid') {
											const price = parseFloat(markets.PRICE)
											if (price > highestBid) {
												highestBid = price
											}
										}
									}

									advancedData = {
										regionCardIds,
										flagCardIds,
										region,
										flag,
										bid: highestBid,
										owners: cardOwners.size,
									}
									advancedDataFetched = true
								}

								const { matched, actions } = evaluateRule(cards[j], rule, advancedData)
								if (matched) {
									matchedActions.push(...actions)
									// Capture rule summary for logging
									matchedRuleSummary = getRuleSummary(rule) + ` (Rule ${rules.indexOf(rule) + 1})`
									// First match wins: stop processing subsequent rules immediately.
									break
								}
							}

							let shouldJunk = false
							let shouldSell = false
							let explicitNothing = false
							giftTarget = ''

							for (const action of matchedActions) {
								if (action.type === 'Junk') shouldJunk = true
								if (action.type === 'Sell') shouldSell = true
								if (action.type === 'Nothing') explicitNothing = true
								if (action.type === 'Gift') giftTarget = action.target || ''
							}

							if (explicitNothing && !giftTarget && !shouldJunk && !shouldSell) {
								progress = [
									...progress,
									{
										text: `${j + 1}/${cards.length} -> S${season} ${category.toUpperCase()} ${id} Rule matched: ${matchedRuleSummary} - Explicitly ignored`,
										color: 'gray',
									},
								]
								junk = false
								sell = false
							} else if (giftTarget) {
								progress = [
									...progress,
									{
										text: `${j + 1}/${cards.length} -> S${season} ${category.toUpperCase()} ${id} Rule matched: ${matchedRuleSummary} - Gift to ${giftTarget}${shouldSell ? ' and Sell' : ''}`,
										color: 'green',
									},
									{
										text: 'Added to gift queue',
										color: 'gray',
									},
								]
								giftQueue.push({
									gift: `${domain}/cgi-bin/api.cgi?nation=${nation}&cardid=${id}&season=${season}`,
									sell: `${domain}/page=deck/container=${nation}/nation=${nation}/card=${id}/season=${season}/gift=1?${urlParameters('JunkDaJunk', main)}`,
									fail: `${nation} failed to gift ${id}`,
									success: `${nation} gifted ${id} to ${giftTarget}`,
									overrideGiftee: giftTarget,
								})
								// Don't junk if gifting
								junk = false
								sell = shouldSell
								if (sell) reason = `Rule matched: ${matchedRuleSummary} - Sell`
							} else if (shouldJunk) {
								junk = true
								reason = `Rule matched: ${matchedRuleSummary} - Junk`
							} else if (shouldSell) {
								sell = true
								reason = `Rule matched: ${matchedRuleSummary} - Sell`
								junk = false
							} else {
								progress = [
									...progress,
									{
										text: `${j + 1}/${cards.length} -> Skipping S${season} ${category.toUpperCase()} ${id} - No matching actions`,
										color: 'gray',
									},
								]
								junk = false
								sell = false
							}
						} else {
							// CLASSIC LOGIC
							const conditions = [
								{
									check: () => skipseason.includes(String(season)),
									reason: `is ignored season ${season}`,
								},
								{
									check: () => category === 'legendary',
									reason: `Legendary card`,
								},
								{
									check: () => category !== 'legendary' && raritiesMV[category] && Number(raritiesMV[category]) === -1,
									reason: `category set to gift`,
								},
								{
									check: () => regionCardIds.size > 0 && [...regionCardIds.values()].some(set => set.has(`${Number(id)},${season}`)),
									reason: `is in whitelisted region`,
								},
								{
									check: () => flagCardIds.size > 0 && [...flagCardIds.values()].some(set => set.has(`${Number(id)},${season}`)),
									reason: `is in whitelisted flag`,
								},
								{
									check: () =>
										category !== 'legendary' &&
										raritiesMV[category] &&
										parseFloat(marketValue) >= Number(raritiesMV[category]),
									reason: `has mv exceeding threshold`,
								},
							]

							for (const { check, reason: r } of conditions) {
								if (check()) {
									junk = false
									reason = `${r}`
									break
								}
							}

							if (junk === true && checkMode === 'Advanced') {
								const cardDetailsXml = await parseXML(
									`${domain}/cgi-bin/api.cgi?cardid=${id}&season=${season}&q=card+markets+info+owners`,
									main
								)
								const card: Card = cardDetailsXml.CARD
								const cardOwners = Array.isArray(card.OWNERS.OWNER)
									? new Set(card.OWNERS.OWNER)
									: new Set([card.OWNERS.OWNER])
								const region = String(card.REGION)
								const flag = String(card.FLAG)
								let highestBid = 0
								const markets = card.MARKETS ? card.MARKETS.MARKET : []
								if (Array.isArray(markets)) {
									markets.forEach(market => {
										if (market.TYPE === 'bid') {
											const price = parseFloat(market.PRICE)
											if (price > highestBid) {
												highestBid = price
											}
										}
									})
								} else {
									if (markets.TYPE === 'bid') {
										const price = parseFloat(markets.PRICE)
										if (price > highestBid) {
											highestBid = price
										}
									}
								}

								const advancedConditions = [
									{
										check: () => owners && Number(owners) > cardOwners.size,
										reason: `has less owners than ${owners}`,
									},
									{
										check: () =>
											category !== 'legendary' &&
											raritiesLowestBid[category] &&
											highestBid >= Number(raritiesLowestBid[category]),
										reason: `has high bid`,
									},
								]

								for (const { check, reason: r } of advancedConditions) {
									if (check()) {
										junk = false
										reason = `${r}`
										break
									}
								}

								if (category !== 'legendary' && mode === 'Gift and Sell') {
									if (highestBid >= raritiesLowestBid[category] || parseFloat(marketValue) >= raritiesMV[category]) {
										junk = false
										reason = `matches gift conditions`
									} else if (
										highestBid >= raritiesLowestBidSell[category] ||
										parseFloat(marketValue) >= raritiesMVSell[category]
									) {
										sell = false
										reason = `matches sale conditions`
									}
								}
							}

							findSplit.forEach(findid => {
								if (cardListEntryMatches(findid, id, season)) {
									junk = false
									reason = findid.season
										? `is whitelisted card ${findid.id} season ${season}`
										: `is whitelisted card ${findid.id}`
								}
							})
						}

						if (junk && sell) {
							if (junkMethod === 'Manual') {
								progress = [
									...progress,
									{
										text: `${j + 1}/${
											cards.length
										} -> Adding to junk sheet S${season} ${category.toUpperCase()} ${id} with mv ${marketValue}`,
									},
								]
								content.push({
									url: `${domain}/container=${nation}/nation=${nation}/page=ajax3/a=junkcard/card=${id}/season=${season}?${urlParameters('junkDaJunk', main)}&autoclose=1`,
									tableText: `Link to Junk`,
								})
								currCard = currCard + 1
							} else {
								progress = [
									...progress,
									{
										text: `${j + 1}/${
											cards.length
										} -> Junking S${season} ${category.toUpperCase()} ${id} with mv ${marketValue}`,
									},
								]
								let token = ''
								const url = `${domain}/cgi-bin/api.cgi?nation=${nation}&cardid=${id}&season=${season}&mode=`
								const prepare = await parseXML(
									`${url}prepare&c=junkcard`,
									main,
									currentNationXPin ? '' : nationSpecificPassword ? nationSpecificPassword : password,
									currentNationXPin || ''
								)

								if (!currentNationXPin) currentNationXPin = prepare['x-pin'] || ''

								token = prepare.NATION.SUCCESS

								const junkResponse = await parseXML(
									`${url}execute&c=junkcard&token=${token}`,
									main,
									'',
									currentNationXPin
								)

								if (junkResponse.NATION && junkResponse.NATION.ERROR) {
									info = [...info, { text: `${nation} failed to junk ${id}, adding to sheet`, color: 'red' }]
									content.push({
										url: `${domain}/container=${nation}/nation=${nation}/page=ajax3/a=junkcard/card=${id}/season=${season}?${urlParameters('junkDaJunk', main)}&autoclose=1`,
										tableText: `Link to Junk`,
									})
									currCard = currCard + 1
								} else {
									junkedCards = junkedCards + 1
									actionCount = actionCount + 1
									junkCounter =
										junkMethod === 'API'
											? `API has junked ${junkedCards}. API has gifted ${giftedCards}. API has processed ${junkedCards + giftedCards} in total.`
											: ''
								}
							}
						} else {
							if (configMode === 'Rules') {
								if (sell) {
									if (!giftTarget) {
										progress = [
											...progress,
											{
												text: `${j + 1}/${cards.length} -> Skipping S${season} ${category.toUpperCase()} ${id} - ${reason}!`,
												color: 'blue',
											},
										]
									}
									const activeNation = giftTarget ? giftTarget : nation
									sellContent.push({
										url: `${domain}/page=deck/container=${activeNation}/nation=${activeNation}/card=${id}/season=${season}/jdj=view?${urlParameters('junkDaJunk', main)}`,
										tableText: `Link to Card`,
									})
									currSellCard = currSellCard + 1
								}
							} else {
								// Classic Mode
								if (mode === 'Gift' || (mode === 'Gift and Sell' && sell === true)) {
									let giftto = gifteeQueue[0]
									findSplit.forEach(findid => {
										const matchGiftee = findid.extra[0]
										if (findid.id === String(id)) {
											if (matchGiftee) giftto = matchGiftee
										}
									})
									progress = [
										...progress,
										{
											text: `${j + 1}/${cards.length} -> Giftable card ${id} moved to gift queue - ${reason}`,
											color: 'blue',
										},
									]
									giftQueue.push({
										gift: `${domain}/cgi-bin/api.cgi?nation=${nation}&cardid=${id}&season=${season}`,
										sell: `${domain}/page=deck/container=${nation}/nation=${nation}/card=${id}/season=${season}/gift=1?${urlParameters('JunkDaJunk', main)}`,
										fail: `${nation} failed to gift ${id}`,
										success: `${nation} gifted ${id} - ${reason}`,
									})
								} else {
									progress = [
										...progress,
										{ text: `${j + 1}/${cards.length} -> Skipping ${id} - ${reason}!`, color: 'blue' },
									]
									if (mode === 'Sell' || mode === 'Gift and Sell') {
										sellContent.push({
											url: `${domain}/page=deck/container=${nation}/nation=${nation}/card=${id}/season=${season}/jdj=view?${urlParameters('junkDaJunk', main)}`,
											tableText: `Link to Card`,
										})
										currSellCard = currSellCard + 1
									}
								}
							}
						}
					}
					progress = [...progress, { text: `Processing gift queue of size ${giftQueue.length}...` }]
					for (let k = 0; k < giftQueue.length; k++) {
						if (abortController.signal.aborted || stopped) break

						const { gift: url, success, fail, overrideGiftee } = giftQueue[k]

						let attemptGiftee = configMode === 'Rules' && overrideGiftee ? overrideGiftee : gifteeQueue[0] || ''
						if (!attemptGiftee) {
							info = [...info, { text: `No available giftees remaining. Stopping gifting.`, color: 'red' }]
							break
						}

						const {
							cnx: newXpin,
							giftee: cg,
							fail: failureReason,
						} = await giftCard({
							url,
							main,
							cnx: currentNationXPin,
							nsp: nationSpecificPassword,
							password,
							specificGiftee: attemptGiftee,
						})

						currentNationXPin = newXpin

						if (failureReason === 'no capacity' || fail === `No such nation: "${cg}".`) {
							progress = [
								...progress,
								{ text: `${k + 1}/${giftQueue.length} -> ${fail} - ${failureReason}`, color: 'red' },
							]
							gifteeQueue.shift()
							k--
							continue
						}

						if (failureReason) {
							sellContent.push({
								url: giftQueue[k].sell,
								tableText: `Link to Card`,
							})
							progress = [
								...progress,
								{
									text: `${k + 1}/${giftQueue.length} -> ${fail} - ${failureReason} to ${attemptGiftee}`,
									color: 'red',
								},
							]
							currSellCard++
						} else {
							actionCount++
							progress = [
								...progress,
								{ text: `${k + 1}/${giftQueue.length} -> ${success} to ${attemptGiftee}`, color: 'green' },
							]
							giftedCards++
							junkCounter =
								junkMethod === 'API'
									? `API has junked ${junkedCards}. API has gifted ${giftedCards}. API has processed ${junkedCards + giftedCards} in total.`
									: ''
						}
					}
				} else {
					if (cards && cards.length > 0 && cardcount)
						progress = [...progress, { text: `${nation} has less cards than ${cardcount}, skipping!`, color: 'blue' }]
					else progress = [...progress, { text: `It is likely ${nation} has 0 cards, skipping!`, color: 'blue' }]
				}
			} catch (err) {
				info = [...info, { text: `Error processing ${nation} with ${err}`, color: 'red' }]
			}
		}
		content = [...content, ...sellContent]
		progress = [
			...progress,
			{
				text: `Finished processing ${puppetList.length} nations, junked ${junkedCards}, gifted ${giftedCards}, and added ${currCard + currSellCard} to sheet.`,
				color: 'green',
			},
		]
		if (content.length > 0) downloadable = true
		stoppable = false
		window.removeEventListener('beforeunload', beforeUnload)
	}

	async function fetchPreset(name: string) {
		if (name === 'S1CTE') {
			const { default: raw } = await import('$lib/data/s1cte.txt?raw')
			const nations = raw
				.split('\n')
				.filter(Boolean)
				.map(id => `${id},1`)

			// Append this to any existing card id whitelist to not overwrite
			const existing = new Set(finderlist.split('\n').filter(Boolean))
			const merged = [...existing, ...nations.filter(nation => !existing.has(nation))]
			finderlist = merged.join('\n')
			return
		}
	}
</script>

<AlertDialog.Root bind:open={dialogOpen}>
	<AlertDialog.Trigger />
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>You have a downloadable junk sheet available.</AlertDialog.Title>
			<AlertDialog.Description>
				You have a downloadable junk sheet available and restarting will clear this sheet and restart.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action
				onclick={e => {
					downloadable = false
					dialogOpen = false
					onSubmit(e)
				}}>Continue</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

<ToolContent
	toolTitle="JunkDaJunk"
	icon="🗑️"
	caption={'An even faster way to junk cards with JavaScript.'}
	author="9003"
	originalBlurb="rewritten in JS for browser use by Kractero"
	link="https://github.com/jmikk/Card-Proccessor"
	additional={`
		<p class="mt-2 mb-16">
			<a class="underline" href="/resources/guides/junkdajunk" target="_blank">
				Link to JunkDaJunk settings guide
			</a>
		</p>
	`} />

<div class="flex flex-col gap-8 break-normal lg:w-5xl lg:max-w-5xl lg:flex-row">
	<form onsubmit={onSubmit} class="flex flex-col gap-8">
		<InputCredentials bind:errors bind:main bind:puppets bind:password authenticated={true} />
		<FormSelect bind:bindValue={configMode} id="configMode" items={['Classic', 'Rules']} label="Configuration Mode" />

		{#if configMode === 'Rules'}
			<RuleDashboard bind:rules />
			<FormSelect bind:bindValue={junkMethod} id="junkMethod" items={['API', 'Manual']} label="Junk Mode" />
			<FormInput label={'Process Up To'} bind:bindValue={junkUpTo} id="junkUpTo" required={true} />
		{:else}
			{#if mode === 'Gift' || mode === 'Gift and Sell'}
				<FormTextArea label={'Gift To'} bind:bindValue={giftee} id="giftee" required={true} />
			{/if}
			<FormSelect bind:bindValue={junkMethod} id="junkMethod" items={['API', 'Manual']} label="Junk Mode" />
			<FormSelect bind:bindValue={checkMode} id="checkMode" items={['Advanced', 'Simple']} label="Mode" />
			<div class="-mb-6 flex flex-col">
				<p class="text-muted-foreground mb-1 text-center font-light">Presets</p>
				<div class="flex flex-wrap justify-center">
					<Button tabindex={-1} onclick={() => fetchPreset('S1CTE')} variant="outline">S1 CTE</Button>
				</div>
			</div>
			<FormTextArea bind:bindValue={finderlist} label={'Card ID Whitelist'} id="finderlist" />
			<FormTextArea bind:bindValue={regionalwhitelist} label={'Regional Whitelist'} id="regions" />
			<FormTextArea bind:bindValue={flagwhitelist} label={'Flag Whitelist'} id="flags" />
			<FormInput label={'Card Count Threshold'} bind:bindValue={cardcount} id="cardcount" />
			{#if checkMode === 'Advanced'}
				<FormInput label={'Owner Count Threshold'} bind:bindValue={owners} id="owners" />
			{/if}
			<div class="flex max-w-lg justify-between gap-4">
				<Rarities
					label={`Rarity Market Value Threshold${mode === 'Gift and Sell' ? ' Gifting' : ''}`}
					bind:rarities={raritiesMV} />
			</div>
			{#if checkMode === 'Advanced'}
				<div class="flex max-w-lg justify-between gap-4">
					<Rarities
						label={`Rarity Lowest Bid Value Threshold${mode === 'Gift and Sell' ? ' Gifting' : ''}`}
						bind:rarities={raritiesLowestBid} />
				</div>
			{/if}
			{#if mode === 'Gift and Sell'}
				<div class="flex max-w-lg justify-between gap-4">
					<Rarities
						label={`Rarity Market Value Threshold${mode === 'Gift and Sell' ? ' Selling' : ''}`}
						bind:rarities={raritiesMVSell} />
				</div>

				<div class="flex max-w-lg justify-between gap-4">
					<Rarities
						label={`Rarity Lowest Bid Value Threshold${mode === 'Gift and Sell' ? ' Selling' : ''}`}
						bind:rarities={raritiesLowestBidSell} />
				</div>
			{/if}
			<FormSelect
				type="multiple"
				bind:bindValue={skipseason}
				id="skipseason"
				items={['1', '2', '3', '4']}
				label="Skip Seasons?" />
			<FormInput label={'Process Up To'} bind:bindValue={junkUpTo} id="junkUpTo" required={true} />
			<FormSelect
				bind:bindValue={mode}
				id="mode"
				items={checkMode === 'Advanced' ? ['Gift', 'Sell', 'Gift and Sell', 'Exclude'] : ['Gift', 'Sell', 'Exclude']}
				label="Behavior" />
		{/if}
		<Buttons
			stopButton={true}
			bind:stopped
			bind:stoppable
			downloadButton={true}
			bind:downloadable
			bind:content
			name="junkDaJunk">
			<OpenButton bind:progress bind:openNewLinkArr={content} {stopped} {stoppable} />
		</Buttons>
	</form>
	<Terminal bind:progress bind:info bind:continuousUpdate={junkCounter} />
</div>
