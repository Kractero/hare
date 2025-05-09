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
	import { beforeUnload, checkUserAgent, pushHistory, urlParameters } from '$lib/helpers/utils'
	import type { Card } from '$lib/types'

	const abortController = new AbortController()

	let dialogOpen = $state(false)
	let domain = ''
	let progress = $state('')
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
	let checkMode = $state('Advanced')
	let raritiesMV: {
		common: number
		uncommon: number
		rare: number
		'ultra-rare': number
		epic: number
	} = $state({
		common: 0.5,
		uncommon: 1,
		rare: 1,
		'ultra-rare': 1,
		epic: 1,
	})
	let raritiesLowestBid: {
		common: number
		uncommon: number
		rare: number
		'ultra-rare': number
		epic: number
	} = $state({
		common: 1,
		uncommon: 1,
		rare: 1,
		'ultra-rare': 1,
		epic: 1,
	})
	let skipseason: string[] = $state([])
	let skipexnation = $state(false)
	let sellContent: Array<{ url: string; tableText: string; linkStyle?: string }> = $state([])
	let finderlist = $state('')
	let jdjtransfer = $state('-1')
	let errors: Array<{ field: string | number; message: string }> = $state([])

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
		checkMode = page.url.searchParams.get('mode') || (localStorage.getItem('jdjCheckMode') as string) || 'Advanced'
		regionalwhitelist =
			page.url.searchParams.get('regions')?.replaceAll(',', '\n') ||
			(localStorage.getItem('junkdajunkRegionalWhitelist') as string) ||
			''
		flagwhitelist =
			page.url.searchParams.get('flags')?.replaceAll(',', '\n') ||
			(localStorage.getItem('junkdajunkFlagWhitelist') as string) ||
			''
		finderlist =
			page.url.searchParams.get('ids')?.replaceAll(',', '\n') ||
			(localStorage.getItem('junkdajunkFinderList') as string) ||
			''
		giftee = page.url.searchParams.get('giftee') || (localStorage.getItem('finderGiftee') as string) || ''
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
		jdjtransfer =
			page.url.searchParams.get('jdjtransfer') || (localStorage.getItem('junkdajunkTransferBank') as string) || '-1'
	})
	onDestroy(() => abortController.abort())

	async function onSubmit(e: Event) {
		if (downloadable) {
			dialogOpen = true
			return
		}
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
		content = []
		sellContent = []
		let puppetList = puppets.split('\n')
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
		if (skipseason) {
			progress += `<p>Skipping seasons: ${skipseason}`
		}
		if (skipexnation === true) {
			progress += `<p>Skipping s1 exnations</p>`
		}
		for (let i = 0; i < Object.entries(raritiesMV).length; i++) {
			progress += `<p>${Object.entries(raritiesMV)[i][0]} junk threshold at ${Object.entries(raritiesMV)[i][1]}</p>`
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
				const xmlDocument = await parseXML(`${domain}/cgi-bin/api.cgi?nationname=${nation}&q=cards+deck+info`, main)
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
						const marketValue = cards[i].MARKET_VALUE
						const category = cards[i].CATEGORY
						if (abortController.signal.aborted || stopped) {
							break
						}

						let junk = true
						let reason = ''

						if (skipseason.includes(String(season))) {
							junk = false
							reason = `<span class="text-blue-400">is ignored season ${season}</span>`
						}

						if (category !== 'legendary' && raritiesMV[category] && Number(raritiesMV[category]) === -1) {
							junk = false
							reason = `<span class="text-blue-400">category set to gift</span>`
						}
						if (
							category !== 'legendary' &&
							raritiesMV[category] &&
							parseFloat(marketValue) >= Number(raritiesMV[category])
						) {
							junk = false
							reason = `<span class="text-blue-400">has mv exceeding threshold</span>`
						}

						if (category === 'legendary') {
							junk = false
							reason = `<span class="text-blue-400">Legendary card</span>`
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

							fwhiteList.forEach(whitelistedFlag => {
								if (flag.includes(whitelistedFlag)) {
									junk = false
									reason = `<span class="text-blue-400">Flag is whitelisted ${flag}</span>`
								}
							})
							if (owners && Number(owners) > cardOwners.size) {
								junk = false
								reason = `<span class="text-blue-400">has less owners than ${owners}</span>`
							}
							if (
								category !== 'legendary' &&
								raritiesLowestBid[category] &&
								highestBid >= Number(raritiesLowestBid[category])
							) {
								junk = false
								reason = `<span class="text-blue-400">has high bid</span>`
							}
							if (!region && skipexnation) {
								junk = false
								reason = `<span class="text-blue-400">S1 exnation</span>`
							}

							if (region && whiteList.includes(region)) {
								junk = false
								reason = `<span class="text-blue-400">is in whitelisted ${region}</span>`
							}
						}

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

						if (junk) {
							progress += `<p>${i + 1}/${
								cards.length
							} -> Junking S${season} ${category.toUpperCase()} ${id} with mv ${marketValue}</p>`
							content.push({
								url: `${domain}/container=${nation}/nation=${nation}/page=ajax3/a=junkcard/card=${id}/season=${season}?${urlParameters('junkDaJunk', main)}&autoclose=1`,
								tableText: `Link to Junk`,
							})
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
								const prepare = await parseXML(
									`${domain}/cgi-bin/api.cgi?nation=${nation}&cardid=${id}&season=${season}&to=${giftto}&mode=prepare&c=giftcard`,
									main,
									currentNationXPin ? '' : nationSpecificPassword ? nationSpecificPassword : password,
									currentNationXPin || ''
								)

								if (!currentNationXPin) currentNationXPin = prepare['x-pin'] || ''

								token = prepare.NATION.SUCCESS

								const gift = await parseXML(
									`${domain}/cgi-bin/api.cgi?nation=${nation}&cardid=${id}&season=${season}&to=${giftto}&mode=execute&c=giftcard&token=${token}`,
									main,
									'',
									currentNationXPin
								)

								if (gift.NATION && gift.NATION.ERROR) {
									sellContent.push({
										url: `${domain}/page=deck/container=${nation}/nation=${nation}/card=${id}/season=${season}/gift=1?${urlParameters('JunkDaJunk', main)}&giftto=${giftto.toLowerCase().replaceAll(' ', '_')}`,
										tableText: `Link to Card`,
									})
									progress += `<p>${i + 1}/${
										cards.length
									} -> <span class="text-red-400">${nation} failed to gift ${id} to ${giftto} - ${reason}</span></p>`
									currSellCard = currSellCard + 1
								} else {
									progress += `<p>${i + 1}/${
										cards.length
									} -> <span class="text-green-400">${nation} gifted ${id} to ${giftto} - ${reason}</span></p>`
								}
							} else {
								progress += `<p>${i + 1}/${cards.length} -> Skipping ${id} - ${reason}!</p>`
								if (mode === 'Sell') {
									sellContent.push({
										url: `${domain}/page=deck/container=${nation}/nation=${nation}/card=${id}/season=${season}/jdj=view?${urlParameters('junkDaJunk', main)}`,
										tableText: `Link to Card`,
									})
									currSellCard = currSellCard + 1
								}
							}
						}
					}
				} else {
					if (cards && cards.length > 0 && cardcount)
						progress += `<p class="text-blue-400">${nation} has less cards than ${cardcount}, skipping!</p>`
					else progress += `<p class="text-blue-400">It is likely ${nation} has 0 cards, skipping!</p>`
				}
			} catch (err) {
				progress += `<p class="text-red-400">Error processing ${nation} with ${err}</p>`
			}
		}
		content = [...content, ...sellContent]
		progress += `<p>Finished processing ${puppetList.length} nations, adding ${currCard + currSellCard} to sheet.</p>`
		downloadable = true
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
		<p class="text-xs mb-4">
			The <span class="bold">Advanced</span> mode is what you are used to, and can check flags, regions, owner count, bids, exnation status (for s1s).
			<span class="bold">Simple</span> skips all of those and only checks ids, rarity, mv, and seasons. Simple is faster while advanced is more targeted.
		</p>
		<p class="text-xs mb-4">
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
			userscript when gifting. When gifting, password input is optional and will be disabled if the puppet list includes a comma for nation,password.
		</p>
		<h2 class="text-xl mb-16">
			Hare does not junk cards, it generates a html file of cards to junk.
		</h2>
	`} />

<div class="flex flex-col gap-8 break-normal lg:w-[1024px] lg:max-w-5xl lg:flex-row">
	<form onsubmit={onSubmit} class="flex flex-col gap-8">
		<InputCredentials bind:errors bind:main bind:puppets bind:password authenticated={mode === 'Gift' ? true : false} />
		{#if mode === 'Gift'}
			<FormInput label={'Gift To'} bind:bindValue={giftee} id="giftee" required={true} />
		{/if}
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
			<p class="w-24">Rarity Market Value Threshold</p>
			<Rarities bind:rarities={raritiesMV} />
		</div>
		{#if checkMode === 'Advanced'}
			<div class="flex max-w-lg justify-between gap-4">
				<p class="w-24">Rarity Lowest Bid Value Threshold</p>
				<Rarities bind:rarities={raritiesLowestBid} />
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
		<FormInput label={'Maximum Bank Threshold'} bind:bindValue={jdjtransfer} id="jdjtransfer" required={true} />
		<FormSelect bind:bindValue={mode} id="mode" items={['Gift', 'Sell', 'Exclude']} label="Behavior" />
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
	<Terminal bind:progress />
</div>
