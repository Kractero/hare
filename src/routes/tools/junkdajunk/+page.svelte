<script lang="ts">
	import { onDestroy, onMount } from 'svelte'
	import { page } from '$app/stores'
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
	import { parser, parseXML } from '$lib/helpers/parser'
	import { beforeUnload, checkUserAgent, pushHistory, urlParameters } from '$lib/helpers/utils'
	import type { Card } from '$lib/types'

	const abortController = new AbortController()

	let domain = ''
	let progress = $state('')
	let openNewLinkArr: Array<string> = $state([])
	let counter = $state(0)
	let junkHtml = $state('')
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
	let raritiesMV: { [key: string]: number } = $state({
		common: 0.5,
		uncommon: 1,
		rare: 1,
		'ultra-rare': 1,
		epic: 1,
	})
	let raritiesLowestBid: { [key: string]: number } = $state({
		common: 1,
		uncommon: 1,
		rare: 1,
		'ultra-rare': 1,
		epic: 1,
	})
	let skipseason = $state("Don't Skip")
	let skipexnation = $state(false)
	let sellContent = ''
	let finderlist = $state('')
	let jdjtransfer = $state('-1')
	let errors: Array<{ field: string | number; message: string }> = $state([])

	onMount(() => {
		domain = `https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net`
		main = $page.url.searchParams.get('main') || (localStorage.getItem('main') as string) || ''
		puppets = (localStorage.getItem('gotissuesPuppets') as string) || ''
		password = (localStorage.getItem('password') as string) || ''
		mode =
			$page.url.searchParams.get('mode') ||
			(localStorage.getItem('jdjMode') as string) ||
			(localStorage.getItem('finderMode') as string) ||
			'Gift'
		regionalwhitelist =
			$page.url.searchParams.get('regions')?.replaceAll(',', '\n') ||
			(localStorage.getItem('junkdajunkRegionalWhitelist') as string) ||
			''
		flagwhitelist =
			$page.url.searchParams.get('flags')?.replaceAll(',', '\n') ||
			(localStorage.getItem('junkdajunkFlagWhitelist') as string) ||
			''
		finderlist =
			$page.url.searchParams.get('ids')?.replaceAll(',', '\n') ||
			(localStorage.getItem('junkdajunkFinderList') as string) ||
			''
		giftee = $page.url.searchParams.get('giftee') || (localStorage.getItem('finderGiftee') as string) || ''
		raritiesMV = localStorage.getItem('junkdajunkRarities')
			? JSON.parse(localStorage.getItem('junkdajunkRarities') as string)
			: {
					common: 0.5,
					uncommon: 1,
					rare: 1,
					'ultra-rare': 1,
					epic: 1,
				}
		raritiesLowestBid = localStorage.getItem('junkdajunkRaritiesBid')
			? JSON.parse(localStorage.getItem('junkdajunkRaritiesBid') as string)
			: localStorage.getItem('junkdajunkRarities')
				? JSON.parse(localStorage.getItem('junkdajunkRarities') as string)
				: {
						common: 0.5,
						uncommon: 1,
						rare: 1,
						'ultra-rare': 1,
						epic: 1,
					}
		owners = $page.url.searchParams.get('owners') || (localStorage.getItem('junkdajunkOwnerCount') as string) || ''
		cardcount = $page.url.searchParams.get('cardcount') || (localStorage.getItem('junkdajunkCardCount') as string) || ''
		skipseason =
			$page.url.searchParams.get('skipseason') ||
			(localStorage.getItem('junkdajunkOmittedSeasons') as string) ||
			"Don't Skip"
		skipexnation =
			$page.url.searchParams.get('skipexnation') === 'true' ||
			localStorage.getItem('junkdajunkExnation') === 'true' ||
			false
		jdjtransfer =
			$page.url.searchParams.get('jdjtransfer') || (localStorage.getItem('junkdajunkTransferBank') as string) || '-1'
	})
	onDestroy(() => abortController.abort())

	async function onSubmit(e: Event) {
		e.preventDefault()
		pushHistory(
			`?main=${main}&mode=${mode}${giftee ? `&giftee=${giftee}` : ''}${owners ? `&owners=${owners}` : ''}${cardcount ? `&cardcount=${cardcount}` : ''}${regionalwhitelist ? `&regions=${regionalwhitelist.replaceAll('\n', ',')}` : ''}${flagwhitelist ? `&flags=${flagwhitelist.replaceAll('\n', ',')}` : ''}${finderlist ? `&ids=${finderlist.replaceAll('\n', ',')}` : ''}${skipseason ? `&skipseason=${skipseason}` : ''}${skipexnation ? `&skipexnation=${skipexnation}` : ''}`
		)
		errors = checkUserAgent(main)
		if (errors.length > 0) return
		window.addEventListener('beforeunload', beforeUnload)
		downloadable = false
		stoppable = true
		stopped = false
		progress = ''
		junkHtml = ''
		sellContent = ''
		const interimSells = []
		let puppetList = puppets.split('\n')
		let failedGiftCount = 0
		const whiteList = regionalwhitelist ? regionalwhitelist.split('\n') : []
		if (whiteList.length > 0) {
			progress += `<p>Whitelisting regions: ${whiteList.map(region => region.trim()).join(', ')}</p>`
		}
		const fwhiteList = flagwhitelist ? flagwhitelist.split('\n') : []
		if (fwhiteList.length > 0) {
			progress += `<p>Whitelisting regions: ${fwhiteList.map(flag => flag.trim()).join(', ')}</p>`
		}
		const toFind = finderlist ? finderlist.split('\n') : []
		if (toFind.length > 0) {
			progress += `<p>Whitelisting cards: ${toFind.map(flag => flag.trim()).join(', ')}</p>`
		}
		const findSplit = finderlist.split('\n').map(matcher => matcher.split(','))
		if (skipseason.length > 0) {
			progress += `<p>Skipping seasons:`
			for (let i = 0; i < skipseason.length; i++) {
				progress += `${i + 1} `
			}
		}
		if (skipexnation === true) {
			progress += `<p>Skipping s1 exnations</p>`
		}
		const rarityArr = Object.entries(raritiesMV)
		for (let i = 0; i < rarityArr.length; i++) {
			progress += `<p>${rarityArr[i][0]} junk threshold at ${rarityArr[i][1]}</p>`
		}
		const rarityLowestBidArr = Object.entries(raritiesLowestBid)
		for (let i = 0; i < rarityLowestBidArr.length; i++) {
			progress += `<p>${rarityLowestBidArr[i][0]} junk threshold at ${rarityLowestBidArr[i][1]}</p>`
		}
		progress += `<p class="font-bold">Initiating JunkDaJunk...</p>`

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
				progress += `<p class="font-semibold">Processing ${nation} ${i + 1}/${puppetList.length} puppets</p>`
				const xmlDocument = await parseXML(`${domain}/cgi-bin/api.cgi/?nationname=${nation}&q=cards+deck+info`, main)
				let nationalBank = xmlDocument.CARDS.INFO.BANK
				if (Number(jdjtransfer) !== -1 && nationalBank >= Number(jdjtransfer)) {
					progress += `<p>Skipping ${nation} as they exceed <span class="text-blue-400">${jdjtransfer}</span> bank.</p>`
					continue
				}
				let cards: Array<Card> = xmlDocument.CARDS.DECK.CARD
				cards = cards ? (Array.isArray(cards) ? cards : [cards]) : []
				if (cards && cards.length > 0 && cards.length > Number(cardcount)) {
					for (let i = 0; i < cards.length; i++) {
						const id = cards[i].CARDID
						const season = cards[i].SEASON
						if (abortController.signal.aborted || stopped) {
							break
						}
						const xmlDocument = await parseXML(
							`${domain}/cgi-bin/api.cgi/?cardid=${id}&season=${season}&q=card+markets+info+owners`,
							main
						)
						const card: Card = xmlDocument.CARD
						const cardOwners = Array.isArray(card.OWNERS.OWNER)
							? new Set(card.OWNERS.OWNER)
							: new Set([card.OWNERS.OWNER])
						const category = card.CATEGORY
						const marketValue = card.MARKET_VALUE
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

						let junk = true
						let reason = ''
						fwhiteList.forEach(whitelistedFlag => {
							if (flag.includes(whitelistedFlag)) {
								junk = false
								reason = `<span class="text-blue-400">Flag is whitelisted ${flag}</span>`
							}
						})
						findSplit.forEach(findid => {
							const matchSeason = findid[1]
							if (findid[0] === String(id)) {
								if (matchSeason) {
									if (matchSeason === String(season)) {
										junk = false
										reason = `<span class="text-blue-400">is whitelisted card ${findid[0]} season ${season}</span>`
									}
								} else {
									junk = false
									reason = `<span class="text-blue-400">is whitelisted card ${findid}</span>`
								}
							}
						})

						if (
							(skipseason === 'Skip Offseasons' && [1, 2].includes(Number(season))) ||
							(skipseason === '1' && Number(season) === 1) ||
							(skipseason === '2' && Number(season) === 2)
						) {
							junk = false
							reason = `<span class="text-blue-400">is ignored season ${season}</span>`
						}

						if (owners && Number(owners) > cardOwners.size) {
							junk = false
							reason = `<span class="text-blue-400">has less owners than ${owners}</span>`
						}
						if (raritiesMV.hasOwnProperty(category) && Number(raritiesMV[category]) === -1) {
							junk = false
							reason = `<span class="text-blue-400">category set to gift</span>`
						}
						if (raritiesMV.hasOwnProperty(category) && parseFloat(marketValue) >= Number(raritiesMV[category])) {
							junk = false
							reason = `<span class="text-blue-400">has mv exceeding threshold</span>`
						}
						if (raritiesLowestBid.hasOwnProperty(category) && highestBid >= Number(raritiesLowestBid[category])) {
							junk = false
							reason = `<span class="text-blue-400">has high bid</span>`
						}
						if (parseFloat(marketValue) > 10) {
							junk = false
							reason = `<span class="text-blue-400">MV over 10</span>`
						}
						if (!region && skipexnation) {
							junk = false
							reason = `<span class="text-blue-400">S1 exnation</span>`
						}
						if (region && whiteList.includes(region)) {
							junk = false
							reason = `<span class="text-blue-400">is in whitelisted ${region}</span>`
						}
						if (junk) {
							progress += `<p>${i + 1}/${
								cards.length
							} -> Junking S${season} ${category.toUpperCase()} ${id} with mv ${marketValue} and highest bid ${highestBid}</p>`
							openNewLinkArr = [
								...openNewLinkArr,
								`${domain}/container=${nation}/nation=${nation}/page=ajax3/a=junkcard/card=${id}/season=${season}?${urlParameters('junkDaJunk', main)}&autoclose=1`,
							]
							junkHtml += `<tr><td><p>${nation} | ${i + 1} of ${
								cards.length
							} (${currCard + 1})</p></td><td><p><a target="_blank" href="${domain}/container=${nation}/nation=${nation}/page=ajax3/a=junkcard/card=${id}/season=${season}?${urlParameters('junkDaJunk', main)}&autoclose=1">Link to Card</a></p></td></tr>\n`
							currCard = currCard + 1
						} else {
							if (mode === 'Gift') {
								let giftto = giftee
								findSplit.forEach(findid => {
									const matchGiftee = findid[2]
									if (findid[0] === String(id)) {
										if (matchGiftee) giftto = matchGiftee
									}
								})

								let token = ''
								const headers: { [key: string]: string } = {
									'User-Agent': main,
								}
								if (currentNationXPin) headers['X-Pin'] = currentNationXPin
								else headers['X-Password'] = nationSpecificPassword ? nationSpecificPassword : password
								const prepare = await fetch(
									`${domain}/cgi-bin/api.cgi/?nation=${nation}&cardid=${id}&season=${season}&to=${giftto}&mode=prepare&c=giftcard`,
									{ headers: headers }
								)
								if (!currentNationXPin) currentNationXPin = prepare.headers.get('x-pin') || ''
								const text = await prepare.text()
								const xml = parser.parse(text)
								token = xml.NATION.SUCCESS
								const gift = await fetch(
									`${domain}/cgi-bin/api.cgi/?nation=${nation}&cardid=${id}&season=${season}&to=${giftto}&mode=execute&c=giftcard&token=${token}`,
									{
										headers: {
											'User-Agent': main,
											'X-Pin': currentNationXPin,
										},
									}
								)
								if (gift.status === 200) {
									let successfulGift = true
									const verify = await parseXML(`${domain}/cgi-bin/api.cgi/?nationname=${nation}&q=cards+deck`, main)
									let verifyCards: Array<Card> = verify.CARDS.DECK.CARD
									verifyCards = verifyCards ? (Array.isArray(verifyCards) ? verifyCards : [verifyCards]) : []
									if (verifyCards && verifyCards.length > 0) {
										let ids = verifyCards.map(card => card.CARDID)
										for (let i = 0; i < ids.length; i++) {
											if (ids[i] === id) {
												successfulGift = false
												interimSells.push(
													`${domain}/page=deck/container=${nation}/nation=${nation}/card=${id}/season=${season}/gift=1?${urlParameters('junkDaJunk', main)}&giftto=${giftto}`
												)
												sellContent += `<tr><td><p>${nation} | ${failedGiftCount + 1} (${currSellCard})</p></td><td><p><a target="_blank" href="${domain}/page=deck/container=${nation}/nation=${nation}/card=${id}/season=${season}/gift=1?${urlParameters('junkDaJunk', main)}&giftto=${giftto}">Link to Card</a></p></td></tr>\n`
												currSellCard = currSellCard + 1
												progress += `<p class="text-red-400">${nation} failed to gift ${id} to ${giftto}`
												failedGiftCount++
											}
										}
									}
									if (successfulGift) progress += `<p class="text-green-400">${nation} gifted ${id} to ${giftto}`
								} else {
									progress += `<p>${i + 1}/${
										cards.length
									} -> <span class="text-red-400">Failed to gift ${id} to ${giftto}</span>`
								}
							} else {
								progress += `<p>${i + 1}/${cards.length} -> Skipping ${id} - ${reason}!`
								if (mode === 'Sell') {
									interimSells.push(
										`${domain}/page=deck/container=${nation}/nation=${nation}/card=${id}/season=${season}?${urlParameters('junkDaJunk', main)}`
									)
									sellContent += `<tr><td><p>${nation} | ${i + 1} of ${
										cards.length
									} (${currSellCard + 1})</p></td><td><p><a target="_blank" href="${domain}/page=deck/container=${nation}/nation=${nation}/card=${id}/season=${season}?${urlParameters('junkDaJunk', main)}">Link to Card</a></p></td></tr>\n`
									currSellCard = currSellCard + 1
								}
							}
						}
					}
				} else {
					if (cards && cards.length > 0 && cardcount)
						progress += `<p class="text-blue-400">${nation} has less cards than ${cardcount}, skipping!`
					else progress += `<p class="text-blue-400">It is likely ${nation} has 0 cards, skipping!`
				}
			} catch (err) {
				progress += `<p class="text-red-400">Error processing ${nation} with ${err}</p>`
			}
		}
		junkHtml = junkHtml + sellContent
		progress += `<p>Finished processing ${puppetList.length} nations, adding ${currCard + currSellCard} to sheet.</p>`
		downloadable = true
		stoppable = false
		window.removeEventListener('beforeunload', beforeUnload)
	}
</script>

<ToolContent
	toolTitle="JunkDaJunk"
	caption={'An even faster way to junk cards with JavaScript.'}
	author="9003"
	originalBlurb="rewritten in JS for browser use by Kractero"
	link="https://github.com/jmikk/Card-Proccessor"
	additional={`<p class="text-xs mb-4">
	The card id whitelist can specify season as well with CARDID,SEASON,GIFTTO instead of just CARDID on each line.
	GIFTTO will overrule the Gift To nation if provided but to providee GIFTTO a season must be provided.
	The regional whitelist indicates regions to skip when deciding to junk cards. The card count threshold only runs Junking
	analyzing on specified nations that have over a certain amount of cards. The owner count threshold will indicate cards to skip
	that have less than the specified amount. The rarity threshold dictates when to skip based on the card's rarity and market value.
	The maximum bank threshold tells JDJ to skip the nation if it exceeds a certain bank amount (-1 means don't skip at any amount).
</p>
<p class="mb-2">
	For optimal use, you should use the
	<a class="underline" href="https://github.com/Kractero/userscripts/blob/main/finderJDJDefault.user.js" target="_blank" rel="noreferrer noopener">
		finder gift default
	</a>
	userscript when gifting.
</p>
<p class="text-xs mb-2">
	Password input is optional and will be disabled if the puppet list includes a comma for nation,password.
</p>
<h2 class="text-xl mb-16">
	Hare does not junk cards, it generates a html file of cards to junk.
</h2>`} />

<div class="flex flex-col gap-8 break-normal lg:w-[1024px] lg:max-w-5xl lg:flex-row">
	<form onsubmit={onSubmit} class="flex flex-col gap-8">
		<InputCredentials bind:errors bind:main bind:puppets bind:password authenticated={mode === 'Gift' ? true : false} />
		{#if mode === 'Gift'}
			<FormInput label={'Gift To'} bind:bindValue={giftee} id="giftee" required={true} />
		{/if}
		<FormTextArea bind:bindValue={finderlist} label={'Card ID Whitelist'} id="finderlist" />
		<FormTextArea bind:bindValue={regionalwhitelist} label={'Regional Whitelist'} id="regions" />
		<FormTextArea bind:bindValue={flagwhitelist} label={'Flag Whitelist'} id="flags" />
		<FormInput label={'Card Count Threshold'} bind:bindValue={cardcount} id="cardcount" />
		<FormInput label={'Owner Count Threshold'} bind:bindValue={owners} id="owners" />
		<div class="flex max-w-lg justify-between gap-4">
			<p class="w-24">Rarity Market Value Threshold</p>
			<Rarities bind:rarities={raritiesMV} />
		</div>
		<div class="flex max-w-lg justify-between gap-4">
			<p class="w-24">Rarity Lowest Bid Value Threshold</p>
			<Rarities bind:rarities={raritiesLowestBid} />
		</div>
		<FormSelect
			bind:bindValue={skipseason}
			id="skipseason"
			items={["Don't Skip", 'Skip Offseasons', '1', '2']}
			label="Skip Seasons?" />
		<FormCheckbox bind:checked={skipexnation} id="skipexnation" label="Skip Exnation" />
		<FormInput label={'Maximum Bank Threshold'} bind:bindValue={jdjtransfer} id="jdjtransfer" required={true} />
		<FormSelect bind:bindValue={mode} id="mode" items={['Gift', 'Sell', 'Exclude']} label="Behavior" />
		<Buttons
			stopButton={true}
			bind:stopped
			bind:stoppable
			downloadButton={true}
			bind:downloadable
			bind:content={junkHtml}
			name="junkDaJunk">
			<OpenButton bind:counter bind:progress bind:openNewLinkArr />
		</Buttons>
	</form>
	<Terminal bind:progress />
</div>
