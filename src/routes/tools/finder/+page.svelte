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
	import Terminal from '$lib/components/Terminal.svelte'
	import ToolContent from '$lib/components/ToolContent.svelte'
	import Button from '$lib/components/ui/button/button.svelte'
	import { parseXML } from '$lib/helpers/parser'
	import { checkUserAgent, pushHistory, urlParameters } from '$lib/helpers/utils'
	import type { Card } from '$lib/types'

	const abortController = new AbortController()
	let domain = ''
	let info = $state<Array<{ text: string; color?: string }>>([])
	let progress = $state<Array<{ text: string; color?: string }>>([])
	let content: Array<{ url: string; tableText: string; linkStyle?: string }> = $state([])
	let downloadable = $state(false)
	let stoppable = $state(false)
	let stopped = $state(false)
	let main = $state('')
	let puppets = $state('')
	let finderlist = $state('')
	let mode = $state('Gift')
	let password = $state('')
	let giftee = $state('')
	let errors: Array<{ field: string | number; message: string }> = $state([])
	let giftLegendaries = $state(true)
	let giftOverMVValue = $state(10)
	let findMode = $state('Specific Cards')

	onMount(() => {
		domain = `https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net`
		main = page.url.searchParams.get('main') || (localStorage.getItem('main') as string) || ''
		puppets = (localStorage.getItem('puppets') as string) || ''
		finderlist = (localStorage.getItem('finderList') as string) || ''
		password = (localStorage.getItem('password') as string) || ''
		mode = page.url.searchParams.get('mode') || (localStorage.getItem('finderMode') as string) || 'Gift'
		giftee = page.url.searchParams.get('giftee') || (localStorage.getItem('finderGiftee') as string) || ''
		giftLegendaries = page.url.searchParams.has('giftLegendaries')
			? page.url.searchParams.get('giftLegendaries') === 'true'
			: localStorage.getItem('giftLegendaries') !== null
				? localStorage.getItem('giftLegendaries') === 'true'
				: true

		giftOverMVValue = parseFloat(
			page.url.searchParams.get('giftOverMVValue') || localStorage.getItem('giftOverMVValue') || '10'
		)
		findMode = page.url.searchParams.get('findMode') || localStorage.getItem('findMode') || 'Specific Cards'
	})
	onDestroy(() => abortController.abort())

	async function onSubmit(e: Event) {
		e.preventDefault()
		pushHistory(
			`?main=${main}&mode=${mode}${giftee ? `&giftee=${giftee}` : ''}&findMode=${findMode}${findMode === 'General' ? `&giftLegendaries=${giftLegendaries}&giftOverMVValue=${giftOverMVValue}` : ''}`
		)
		errors = checkUserAgent(main)
		if (errors.length > 0) return
		downloadable = false
		stoppable = true
		stopped = false
		content = []
		progress = []
		const puppetList = puppets.split('\n').map(puppet => {
			if (puppet.includes(',')) {
				const [nation, nationSpecificPassword] = puppet.split(',')
				return {
					nation: nation.toLowerCase().replaceAll(' ', '_'),
					nationSpecificPassword: nationSpecificPassword,
				}
			} else {
				return { nation: puppet.toLowerCase().replaceAll(' ', '_') }
			}
		})
		info = [{ text: `Initiating Finder...` }]
		let findCount = 0
		let failedGiftCount = 0

		const giftedCards = new Set()
		const soldCards = new Set()

		async function gift(cnx: string, nsp: string | undefined, nation: string, id: string, season: string, cg: string) {
			let token = ''
			const url = `${domain}/cgi-bin/api.cgi?nation=${nation}&cardid=${id}&season=${season}&to=${giftee}&mode=`
			const prepare = await parseXML(`${url}prepare&c=giftcard`, main, cnx ? '' : nsp ? nsp : password, cnx || '')

			if (!cnx) cnx = prepare['x-pin'] || ''

			token = prepare.NATION.SUCCESS

			const gift = await parseXML(`${url}execute&c=giftcard&token=${token}`, main, '', cnx)

			if (gift.NATION && gift.NATION.ERROR) {
				progress = [...progress, { text: `${nation} failed to gift ${id} to ${giftee}`, color: 'red' }]
				content.push({
					url: `${domain}/page=deck/container=${nation}/nation=${nation}/card=${id}/season=${season}/gift=1?${urlParameters('Finder', main)}&giftto=${cg.toLowerCase().replaceAll(' ', '_')}`,
					tableText: `Link to ${nation}`,
				})
				failedGiftCount++
			} else {
				progress = [...progress, { text: `${nation} gifted ${id} to ${giftee}`, color: 'green' }]
				giftedCards.add(id)
			}

			return cnx
		}

		if (findMode === 'Specific Cards') {
			const toFind = finderlist.split('\n')
			const matches = toFind.map(matcher => matcher.split(','))
			info = [...info, { text: `Finding -> ${toFind.length} cards...` }]
			if (matches.length < puppetList.length) {
				info = [...info, { text: `More puppets than cards, proceeding...` }]
				for (let i = 0; i < matches.length; i++) {
					progress = [...progress, { text: `Processing card ${i + 1}/${matches.length} cards` }]
					if (mode === 'Gift One' && giftedCards.size > 0 && toFind.length > 0 && giftedCards.size === toFind.length) {
						progress = [
							...progress,
							{ text: `All cards provided have been gifted, skipping remaining puppets`, color: 'blue' },
						]
						break
					}
					if (mode === 'Sell One' && soldCards.size > 0 && toFind.length > 0 && soldCards.size === toFind.length) {
						progress = [
							...progress,
							{ text: `All cards provided have been sold, skipping remaining puppets`, color: 'blue' },
						]
						break
					}
					if (abortController.signal.aborted || stopped) {
						break
					}
					const card = matches[i]
					const matchSeason = card[1]
					const matchGiftee = card[2]
					const cardInfo = await parseXML(
						`https://www.nationstates.net/cgi-bin/api.cgi?q=card+owners;cardid=${card[0]};season=${matchSeason}`,
						main
					)
					const owners = cardInfo.CARD.OWNERS
					const id = cardInfo.CARD.CARDID
					const season = cardInfo.CARD.SEASON

					if (!owners) continue

					let ownerArr: string[] = Array.isArray(owners.OWNER) ? owners.OWNER : [owners.OWNER]
					let processedOwners = new Set<string>()

					for (let i = 0; i < ownerArr.length; i++) {
						const owner = ownerArr[i]
						if (processedOwners.has(owner)) continue
						const matchedPuppet = puppetList.find(puppet => puppet.nation === String(owner))
						if (matchedPuppet) {
							let frequency = ownerArr.filter(o => o === owner).length
							processedOwners.add(owner)
							if (giftedCards.has(id) && mode === 'Gift One') {
								progress = [...progress, { text: `Already gifted ${id}`, color: 'blue' }]
								continue
							}
							if (soldCards.has(id) && mode === 'Sell One') {
								progress = [...progress, { text: `Already sold ${id}`, color: 'blue' }]
								continue
							}

							let currentNationXPin = ''
							const { nation, nationSpecificPassword } = matchedPuppet

							const xmlDocument = await parseXML(`${domain}/cgi-bin/api.cgi?nationname=${nation}&q=cards+deck`, main)

							let cards: Array<Card> = xmlDocument.CARDS.DECK.CARD
							cards = cards ? (Array.isArray(cards) ? cards : [cards]) : []

							for (let i = 0; i < frequency; i++) {
								let currGiftee = matchGiftee || giftee

								if (matchSeason && matchSeason !== String(season)) {
									progress = [...progress, { text: `Found ${id} but not right season.`, color: 'blue' }]
								} else {
									if (mode.includes('Gift')) {
										currentNationXPin = await gift(
											currentNationXPin,
											nationSpecificPassword,
											nation,
											id,
											season,
											currGiftee
										)
									} else {
										progress = [...progress, { text: `${nation} owns ${id}, adding sell link!`, color: 'green' }]
										content.push({
											url: `${domain}/page=deck/container=${nation}/nation=${nation}/card=${id}/season=${season}${urlParameters('Finder', main)}`,
											tableText: `Link to ${nation}`,
										})
										soldCards.add(id)
									}
									findCount++
								}
							}
						}
					}
				}
			} else {
				info = [...info, { text: `More cards than puppets, proceeding...` }]
				for (let i = 0; i < puppetList.length; i++) {
					if (mode === 'Gift One' && giftedCards.size > 0 && toFind.length > 0 && giftedCards.size === toFind.length) {
						progress = [
							...progress,
							{ text: `All cards provided have been gifted, skipping remaining puppets`, color: 'blue' },
						]
						continue
					}
					if (mode === 'Sell One' && soldCards.size > 0 && toFind.length > 0 && soldCards.size === toFind.length) {
						progress = [
							...progress,
							{ text: `All cards provided have been sold, skipping remaining puppets`, color: 'blue' },
						]
						break
					}

					let currentNationXPin = ''
					const { nation, nationSpecificPassword } = puppetList[i]

					if (abortController.signal.aborted || stopped) {
						break
					}

					try {
						progress = [...progress, { text: `Processing ${nation} ${i + 1}/${puppetList.length} puppets` }]
						const xmlDocument = await parseXML(`${domain}/cgi-bin/api.cgi?nationname=${nation}&q=cards+deck`, main)
						let cards: Array<Card> = xmlDocument.CARDS.DECK.CARD
						cards = cards ? (Array.isArray(cards) ? cards : [cards]) : []
						const matches = toFind.map(matcher => matcher.split(','))
						if (cards && cards.length > 0) {
							for (let j = 0; j < cards.length; j++) {
								if (abortController.signal.aborted || stopped) {
									break
								}
								const id = cards[j].CARDID
								const season = cards[j].SEASON

								if (giftedCards.has(id) && mode === 'Gift One') {
									progress = [...progress, { text: `Already gifted ${id}`, color: 'blue' }]
									continue
								}
								if (soldCards.has(id) && mode === 'Sell One') {
									progress = [...progress, { text: `Already sold ${id}`, color: 'blue' }]
									continue
								}
								let matchingEntries = matches.filter(match => match[0] === String(id))

								if (matchingEntries.length > 0) {
									for (let entry of matchingEntries) {
										const matchSeason = entry[1]
										const matchGiftee = entry[2]
										let currGiftee = matchGiftee || giftee
										if (matchSeason && matchSeason !== String(season)) {
											progress = [...progress, { text: `${nation} found ${id} but not right season.`, color: 'blue' }]
										} else {
											if (mode.includes('Gift')) {
												currentNationXPin = await gift(
													currentNationXPin,
													nationSpecificPassword,
													nation,
													id,
													season,
													currGiftee
												)
											} else {
												progress = [...progress, { text: `${nation} owns ${id}!`, color: 'green' }]
												content.push({
													url: `${domain}/page=deck/container=${nation}/nation=${nation}/card=${id}/season=${season}?${urlParameters('Finder', main)}`,
													tableText: `Link to ${nation}`,
												})
												soldCards.add(id)
											}
											findCount++
										}
									}
								}
							}
						} else {
							progress = [...progress, { text: `It is likely ${nation} has 0 cards, skipping!`, color: 'blue' }]
						}
					} catch (err) {
						progress = [...progress, { text: `Error processing ${nation} with ${err}`, color: 'red' }]
					}
				}
			}
		} else if (findMode === 'General') {
			let conditions = []
			if (giftLegendaries) conditions.push('legendaries')
			if (giftOverMVValue) conditions.push(`cards over ${giftOverMVValue} MV`)
			info = [...info, { text: `Finding ${conditions.join(', ')}` }]
			for (let i = 0; i < puppetList.length; i++) {
				let currentNationXPin = ''
				const { nation, nationSpecificPassword } = puppetList[i]

				if (abortController.signal.aborted || stopped) {
					break
				}

				try {
					progress = [...progress, { text: `Processing ${nation} ${i + 1}/${puppetList.length} puppets` }]
					const xmlDocument = await parseXML(`${domain}/cgi-bin/api.cgi?nationname=${nation}&q=cards+deck`, main)
					let cards: Array<Card> = xmlDocument.CARDS.DECK.CARD
					cards = cards ? (Array.isArray(cards) ? cards : [cards]) : []
					if (cards && cards.length > 0) {
						let filteredCards: Card[] = []

						if (giftLegendaries) {
							filteredCards = [...filteredCards, ...cards.filter(card => card.CATEGORY === 'legendary')]
						}

						filteredCards = [
							...filteredCards,
							...cards.filter(card => parseFloat(card.MARKET_VALUE) >= giftOverMVValue),
						]

						for (let j = 0; j < filteredCards.length; j++) {
							if (abortController.signal.aborted || stopped) {
								break
							}
							const id = filteredCards[j].CARDID
							const season = filteredCards[j].SEASON

							if (mode.includes('Gift')) {
								currentNationXPin = await gift(currentNationXPin, nationSpecificPassword, nation, id, season, giftee)
							} else {
								progress = [...progress, { text: `${nation} owns ${id}, adding to sell!`, color: 'green' }]
								content.push({
									url: `${domain}/page=deck/container=${nation}/nation=${nation}/card=${id}/season=${season}?${urlParameters('Finder', main)}`,
									tableText: `Link to ${nation}`,
								})
								soldCards.add(id)
							}
							findCount++
						}
					} else {
						progress = [...progress, { text: `It is likely ${nation} has 0 cards, skipping!`, color: 'blue' }]
					}
				} catch (err) {
					progress = [...progress, { text: `Error processing ${nation} with ${err}`, color: 'red' }]
				}
			}
		}
		progress = [
			...progress,
			{
				text: `Finished processing, found ${findCount} uniques, ${mode === 'Gift' ? `with ${failedGiftCount} failed gifts` : `on mode ${mode}.`}`,
				color: 'green',
			},
		]
		downloadable = true
		stoppable = false
	}

	async function fetchPreset(name: string) {
		const presets: {
			[key: string]: string | { [key: string]: string }
		} = await import('$lib/data/finderPresets.json')

		finderlist = presets[name] as string
	}
</script>

<ToolContent
	toolTitle="Finder"
	icon="🔎"
	caption="Find which of the specified nations have which of the specified cards."
	author="Kractero"
	link="https://github.com/Kractero/cards-utilities/blob/main/finder.py"
	additional={`<p class="mb-2">
	Supports two modes - gifting specific cards based on their id,season, or generally gifting legendaries and cards over a certain mv.
	</p>
	<p class="mb-2">
	When gifting specific cards, you can specify the nation to gift to with CARDID,SEASON,GIFTTO instead of CARDID,SEASON on each line.
	GIFTTO will overrule the Gift To nation if provided. SEASON must be provided.
</p>
<p class="mb-2">
	For optimal use, you should use the
	<a class="underline" href="https://raw.githubusercontent.com/Kractero/userscripts/refs/heads/main/finderJDJDefault.user.js" target="_blank" rel="noreferrer noopener">
		finder gift default
	</a>
	userscript when gifting.
</p>
<p class="text-xs mb-16">
	Password input for gifting is optional and will be disabled if the puppet list includes a comma for nation,password.
</p>`} />

<div class="flex flex-col gap-8 break-normal lg:w-[1024px] lg:max-w-5xl lg:flex-row">
	<form onsubmit={onSubmit} class="flex flex-col gap-8">
		<InputCredentials
			bind:errors
			bind:main
			bind:puppets
			bind:password
			authenticated={mode.includes('Gift') ? true : false} />
		{#if mode.includes('Gift')}
			<FormInput label={'Gift To'} bind:bindValue={giftee} id="giftee" required={true} />
		{/if}
		<FormSelect bind:bindValue={findMode} id="findMode" items={['Specific Cards', 'General']} label="Behavior" />
		{#if findMode === 'Specific Cards'}
			<div class="-mb-6 flex flex-col">
				<p class="text-muted-foreground mb-1 text-center font-light">Presets</p>
				<div class="flex flex-wrap justify-center">
					<Button tabindex={-1} onclick={() => fetchPreset('Legendaries')} variant={'outline'}>Legendaries</Button>
					<Button tabindex={-1} onclick={() => fetchPreset('Fauzjhia')} variant={'outline'}>Fauzjhia</Button>
					<Button tabindex={-1} onclick={() => fetchPreset('Mikeswill')} variant={'outline'}>Mikeswill</Button>
					<Button tabindex={-1} onclick={() => fetchPreset('Apexiala')} variant={'outline'}>Apexiala</Button>
					<Button tabindex={-1} onclick={() => fetchPreset('Dr_Hooves')} variant={'outline'}>Dr Hooves</Button>
				</div>
			</div>
			<FormTextArea bind:bindValue={finderlist} label={'Cards to Find'} id="finderlist" required />
		{:else if findMode === 'General'}
			<FormCheckbox bind:checked={giftLegendaries} id="giftlegendaries" label="Gift Legends" />
			<FormInput bind:bindValue={giftOverMVValue} id="giftOverMVValue" label="Gift Over MV" />
		{/if}
		<FormSelect
			bind:bindValue={mode}
			id="mode"
			items={findMode === 'Specific Cards' ? ['Gift', 'Sell', 'Gift One', 'Sell One'] : ['Gift', 'Sell']}
			label="Gift Behavior" />
		<div class="flex max-w-lg justify-center gap-2">
			<Buttons
				stopButton={true}
				bind:stopped
				bind:stoppable
				downloadButton={true}
				bind:downloadable
				bind:content
				type="html"
				name="Finder">
				<OpenButton bind:progress bind:openNewLinkArr={content} />
			</Buttons>
		</div>
	</form>
	<Terminal bind:progress bind:info />
</div>
