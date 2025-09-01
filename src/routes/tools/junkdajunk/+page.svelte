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
	import Rarities from '$lib/components/Rarities.svelte'
	import Terminal from '$lib/components/Terminal.svelte'
	import ToolContent from '$lib/components/ToolContent.svelte'
	import * as AlertDialog from '$lib/components/ui/alert-dialog'
	import { parseXML } from '$lib/helpers/parser'
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
		giftee = page.url.searchParams.get('giftee') || (localStorage.getItem('finderGiftee') as string) || ''
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
		if (page.url.searchParams.get('skipseason') !== null) {
			if (
				(page.url.searchParams.get('skipseason') as string) === "Don't Skip" ||
				(page.url.searchParams.get('skipseason') as string) === 'Skip Offseasons'
			) {
				alert(`${page.url.searchParams.get('skipseason')} is no longer in use, please change it`)
				skipseason = []
			} else {
				skipseason = [page.url.searchParams.get('skipseason') as string]
			}
		} else if (localStorage.getItem('junkdajunkOmittedSeasons')) {
			if (
				localStorage.getItem('junkdajunkOmittedSeasons') === "Don't Skip" ||
				localStorage.getItem('junkdajunkOmittedSeasons') === 'Skip Offseasons'
			) {
				alert(`${localStorage.getItem('junkdajunkOmittedSeasons')} is no longer in use, please change it`)
				skipseason = []
			} else {
				skipseason = [localStorage.getItem('junkdajunkOmittedSeasons') as string]
			}
		} else {
			skipseason = []
		}
		skipexnation =
			page.url.searchParams.get('skipexnation') === 'true' ||
			localStorage.getItem('junkdajunkExnation') === 'true' ||
			false
		// jdjtransfer =
		// 	page.url.searchParams.get('jdjtransfer') || (localStorage.getItem('junkdajunkTransferBank') as string) || '-1'
		junkUpTo = page.url.searchParams.get('junkUpTo') || (localStorage.getItem('junkUpTo') as string) || '-1'
	})
	onDestroy(() => abortController.abort())

	async function onSubmit(e: Event) {
		if (downloadable) {
			dialogOpen = true
			return
		}
		e.preventDefault()
		pushHistory(
			`?main=${main}&mode=${mode}&junkMethod=${junkMethod}&checkMode=${checkMode}${giftee ? `&giftee=${giftee}` : ''}${owners ? `&owners=${owners}` : ''}${cardcount ? `&cardcount=${cardcount}` : ''}${regionalwhitelist ? `&regions=${regionalwhitelist.replaceAll('\n', ',')}` : ''}${flagwhitelist ? `&flags=${flagwhitelist.replaceAll('\n', ',')}` : ''}${skipseason && skipseason.length > 0 ? `&skipseason=${skipseason}` : ''}${skipexnation ? `&skipexnation=${skipexnation}` : ''}${junkUpTo ? `&junkUpTo=${junkUpTo}` : ''}`
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
		const toFind = finderlist ? finderlist.split('\n') : []
		if (toFind.length > 0) {
			newInfo.push({ text: `Whitelisting cards: ${toFind.length} cards whitelisted` })
		}

		if (skipseason && skipseason.length > 0) newInfo.push({ text: `Skipping seasons: ${skipseason}` })

		if (skipexnation === true) newInfo.push({ text: `Skipping s1 exnations` })

		// for (const [rarity, threshold] of Object.entries(raritiesMV))
		// 	newInfo.push({ text: `${rarity} junk threshold at ${threshold}` })

		// for (const [rarity, bid] of Object.entries(raritiesLowestBid))
		// 	newInfo.push({ text: `${rarity} junk threshold at ${bid}` })

		const findSplit = finderlist.split('\n').map(matcher => matcher.split(','))

		info = newInfo

		let junkedCards = 0
		let giftedCards = 0
		let actionCount = 0
		let currCard = 0
		let currSellCard = 0
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
				// let nationalBank = xmlDocument.CARDS.INFO.BANK
				// if (Number(jdjtransfer) !== -1 && nationalBank >= Number(jdjtransfer)) {
				// 	progress = [...progress, { text: `Skipping ${nation} as they exceed ${jdjtransfer} bank.`, color: 'blue' }]
				// 	continue
				// }
				let cards: Array<Card> = xmlDocument.CARDS.DECK.CARD
				cards = cards ? (Array.isArray(cards) ? cards : [cards]) : []
				if (cards && cards.length > 0 && cards.length > Number(cardcount)) {
					const giftQueue = []
					for (let i = 0; i < cards.length; i++) {
						if (Number(junkUpTo) !== -1 && actionCount >= Number(junkUpTo)) break

						const id = cards[i].CARDID
						const season = cards[i].SEASON
						const marketValue = cards[i].MARKET_VALUE
						const category = cards[i].CATEGORY
						if (abortController.signal.aborted || stopped) {
							break
						}

						let junk = true
						let sell = true
						let reason = ''

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
							const xmlDocument = await parseXML(
								`${domain}/cgi-bin/api.cgi?cardid=${id}&season=${season}&q=card+markets+info+owners`,
								main
							)
							const card: Card = xmlDocument.CARD
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
									check: () => flagWhitelist.some(f => flag.includes(f)),
									reason: `Flag is whitelisted ${flag}`,
								},
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
								{
									check: () => !region && skipexnation,
									reason: `S1 exnation`,
								},
								{
									check: () => region && regionalWhitelist.includes(canonicalize(region)),
									reason: `is in whitelisted ${region}`,
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
							const matchSeason = findid[1]
							if (findid[0] === String(id)) {
								if (matchSeason) {
									if (matchSeason === String(season)) {
										junk = false
										reason = `is whitelisted card ${findid[0]} season ${season}`
									}
								} else {
									junk = false
									reason = `is whitelisted card ${findid}`
								}
							}
						})

						if (junk && sell) {
							if (junkMethod === 'Manual') {
								progress = [
									...progress,
									{
										text: `${i + 1}/${
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
										text: `${i + 1}/${
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

								const junk = await parseXML(`${url}execute&c=junkcard&token=${token}`, main, '', currentNationXPin)

								if (junk.NATION && junk.NATION.ERROR) {
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
							if (mode === 'Gift' || (mode === 'Gift and Sell' && sell === true)) {
								let giftto = giftee
								findSplit.forEach(findid => {
									const matchGiftee = findid[2]
									if (findid[0] === String(id)) {
										if (matchGiftee) giftto = matchGiftee
									}
								})
								progress = [
									...progress,
									{
										text: `${i + 1}/${cards.length} -> Giftable card ${id} moved to gift queue - ${reason}`,
										color: 'blue',
									},
								]
								giftQueue.push({
									gift: `${domain}/cgi-bin/api.cgi?nation=${nation}&cardid=${id}&season=${season}&to=${giftto}`,
									sell: `${domain}/page=deck/container=${nation}/nation=${nation}/card=${id}/season=${season}/gift=1?${urlParameters('JunkDaJunk', main)}&giftto=${giftto.toLowerCase().replaceAll(' ', '_')}`,
									fail: `${nation} failed to gift ${id} to ${giftto} - ${reason}`,
									success: `${nation} gifted ${id} to ${giftto} - ${reason}`,
								})
							} else {
								progress = [
									...progress,
									{ text: `${i + 1}/${cards.length} -> Skipping ${id} - ${reason}!`, color: 'blue' },
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
					progress = [...progress, { text: `Processing gift queue of size ${giftQueue.length}...` }]
					for (let i = 0; i < giftQueue.length; i++) {
						if (abortController.signal.aborted || stopped) {
							break
						}

						let token = ''
						const url = giftQueue[i].gift
						const prepare = await parseXML(
							`${url}&mode=prepare&c=giftcard`,
							main,
							currentNationXPin ? '' : nationSpecificPassword ? nationSpecificPassword : password,
							currentNationXPin || ''
						)

						if (!currentNationXPin) currentNationXPin = prepare['x-pin'] || ''

						token = prepare.NATION.SUCCESS

						const gift = await parseXML(`${url}&mode=execute&c=giftcard&token=${token}`, main, '', currentNationXPin)

						if (gift.NATION && gift.NATION.ERROR) {
							sellContent.push({
								url: giftQueue[i].sell,
								tableText: `Link to Card`,
							})
							progress = [...progress, { text: `${i + 1}/${giftQueue.length} -> ${giftQueue[i].fail}`, color: 'red' }]
							currSellCard = currSellCard + 1
						} else {
							actionCount = actionCount + 1
							progress = [
								...progress,
								{ text: `${i + 1}/${giftQueue.length} -> ${giftQueue[i].success}`, color: 'green' },
							]
							giftedCards = giftedCards + 1
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
				text: `Finished processing ${puppetList.length} nations, junking ${junkedCards}, gifting ${giftedCards}, and adding ${currCard + currSellCard} to sheet.`,
				color: 'green',
			},
		]
		if (content.length > 0) downloadable = true
		stoppable = false
		window.removeEventListener('beforeunload', beforeUnload)
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

<div class="flex flex-col gap-8 break-normal lg:w-[1024px] lg:max-w-5xl lg:flex-row">
	<form onsubmit={onSubmit} class="flex flex-col gap-8">
		<InputCredentials bind:errors bind:main bind:puppets bind:password authenticated={true} />
		{#if mode === 'Gift' || mode === 'Gift and Sell'}
			<FormInput label={'Gift To'} bind:bindValue={giftee} id="giftee" required={true} />
		{/if}
		<FormSelect bind:bindValue={junkMethod} id="junkMethod" items={['API', 'Manual']} label="Junk Mode" />
		<FormSelect bind:bindValue={checkMode} id="checkMode" items={['Advanced', 'Simple']} label="Mode" />
		<FormTextArea bind:bindValue={finderlist} label={'Card ID Whitelist'} id="finderlist" />
		{#if checkMode === 'Advanced'}
			<FormTextArea bind:bindValue={regionalwhitelist} label={'Regional Whitelist'} id="regions" />
			<FormTextArea bind:bindValue={flagwhitelist} label={'Flag Whitelist'} id="flags" />
		{/if}
		<FormInput label={'Card Count Threshold'} bind:bindValue={cardcount} id="cardcount" />
		{#if checkMode === 'Advanced'}
			<FormInput label={'Owner Count Threshold'} bind:bindValue={owners} id="owners" />
		{/if}
		<!-- {#if mode === 'Sell' || mode === 'Exclude'}
			<FormInput
				label={'Gift Override'}
				subTitle="Always gift over this (optional)"
				bind:bindValue={giftOverride}
				id="giftoverride" />
		{/if} -->
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
		{#if checkMode === 'Advanced'}
			<FormCheckbox bind:checked={skipexnation} id="skipexnation" label="Skip Exnation" />
		{/if}
		<!-- <FormInput label={'Maximum Bank Threshold'} bind:bindValue={jdjtransfer} id="jdjtransfer" required={true} /> -->
		<FormInput label={'Process Up To'} bind:bindValue={junkUpTo} id="junkUpTo" required={true} />
		<FormSelect
			bind:bindValue={mode}
			id="mode"
			items={checkMode === 'Advanced' ? ['Gift', 'Sell', 'Gift and Sell', 'Exclude'] : ['Gift', 'Sell', 'Exclude']}
			label="Behavior" />
		<Buttons
			stopButton={true}
			bind:stopped
			bind:stoppable
			downloadButton={true}
			bind:downloadable
			bind:content
			name="junkDaJunk">
			<OpenButton bind:progress bind:openNewLinkArr={content} />
		</Buttons>
	</form>
	<Terminal bind:progress bind:info bind:continuousUpdate={junkCounter} />
</div>
