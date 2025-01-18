<script lang="ts">
	import { onDestroy, onMount } from 'svelte'
	import { page } from '$app/state'
	import Buttons from '$lib/components/Buttons.svelte'
	import OpenButton from '$lib/components/buttons/OpenButton.svelte'
	import FormInput from '$lib/components/FormInput.svelte'
	import FormSelect from '$lib/components/FormSelect.svelte'
	import FormTextArea from '$lib/components/FormTextArea.svelte'
	import InputCredentials from '$lib/components/InputCredentials.svelte'
	import Terminal from '$lib/components/Terminal.svelte'
	import ToolContent from '$lib/components/ToolContent.svelte'
	import Button from '$lib/components/ui/button/button.svelte'
	import { parser, parseXML } from '$lib/helpers/parser'
	import { checkUserAgent, pushHistory, urlParameters } from '$lib/helpers/utils'
	import type { Card } from '$lib/types'

	const abortController = new AbortController()
	let domain = ''
	let progress = $state('')
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

	onMount(() => {
		domain = `https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net`
		main = page.url.searchParams.get('main') || (localStorage.getItem('main') as string) || ''
		puppets = (localStorage.getItem('puppets') as string) || ''
		finderlist = (localStorage.getItem('finderList') as string) || ''
		password = (localStorage.getItem('password') as string) || ''
		mode = page.url.searchParams.get('mode') || (localStorage.getItem('finderMode') as string) || 'Gift'
		giftee = page.url.searchParams.get('giftee') || (localStorage.getItem('finderGiftee') as string) || ''
	})
	onDestroy(() => abortController.abort())

	async function onSubmit(e: Event) {
		e.preventDefault()
		pushHistory(`?main=${main}&mode=${mode}${giftee ? `&giftee=${giftee}` : ''}`)
		errors = checkUserAgent(main)
		if (errors.length > 0) return
		downloadable = false
		stoppable = true
		stopped = false
		content = []
		let puppetList = puppets.split('\n').map(puppet => puppet.toLowerCase().replaceAll(' ', '_'))
		progress = '<p>Initiating Finder...</p>'
		const toFind = finderlist.split('\n')
		const matches = toFind.map(matcher => matcher.split(','))
		progress += `<p>Finding -> ${toFind.map(card => card.trim()).join(', ')}</p>`
		let findCount = 0
		let failedGiftCount = 0

		const giftedCards = new Set()

		async function processGift(
			nation: string,
			cardId: string,
			season: string,
			giftee: string,
			currentNationXPin: string,
			nationSpecificPassword: string
		) {
			let token = ''
			const headers: { [key: string]: string } = { 'User-Agent': main }

			if (currentNationXPin) headers['X-Pin'] = currentNationXPin
			else headers['X-Password'] = nationSpecificPassword ? nationSpecificPassword : password

			const prepare = await fetch(
				`${domain}/cgi-bin/api.cgi?nation=${nation}&cardid=${cardId}&season=${season}&to=${giftee}&mode=prepare&c=giftcard`,
				{ headers: headers }
			)
			if (!currentNationXPin) currentNationXPin = prepare.headers.get('x-pin') || ''

			const text = await prepare.text()
			const xml = parser.parse(text)
			token = xml.NATION.SUCCESS

			const gift = await parseXML(
				`${domain}/cgi-bin/api.cgi?nation=${nation}&cardid=${cardId}&season=${season}&to=${giftee}&mode=execute&c=giftcard&token=${token}`,
				main,
				'',
				currentNationXPin
			)

			if (gift.NATION && gift.NATION.ERROR) {
				progress += `<p class="text-red-400">${nation} failed to gift ${cardId} to ${giftee}</p>`
				failedGiftCount++
			} else {
				progress += `<p class="text-green-400">${nation} gifted ${cardId} to ${giftee}</p>`
				giftedCards.add(cardId)
			}
		}

		if (matches.length < puppetList.length) {
			progress += `<p>More puppets than cards, proceeding...</p>`
			for (let i = 0; i < matches.length; i++) {
				if (mode === 'Gift One' && giftedCards.size > 0 && toFind.length > 0 && giftedCards.size === toFind.length) {
					progress += `<p class="text-blue-400">All cards provided have been gifted, skipping remaining puppets`
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
					'Card Info'
				)
				const owners = cardInfo.CARD.OWNERS
				const id = cardInfo.CARD.CARDID
				const season = cardInfo.CARD.SEASON

				if (!owners) continue

				let ownerArr: string[] = Array.isArray(owners.OWNER) ? owners.OWNER : [owners.OWNER]
				let matchedOwners = new Map()

				ownerArr.forEach(owner => {
					if (puppetList.includes(owner)) {
						if (matchedOwners.has(owner)) {
							matchedOwners.set(owner, matchedOwners.get(owner) + 1)
						} else {
							matchedOwners.set(owner, 1)
						}
					}
				})

				for (const [name, frequency] of matchedOwners.entries()) {
					if (giftedCards.has(id) && mode === 'Gift One') {
						progress += `<p class="text-blue-400">Already gifted ${id}.`
						continue
					}
					let currentNationXPin = ''
					let nationSpecificPassword = ''
					let nation = name
					const xmlDocument = await parseXML(`${domain}/cgi-bin/api.cgi?nationname=${nation}&q=cards+deck`, main)
					let cards: Array<Card> = xmlDocument.CARDS.DECK.CARD
					cards = cards ? (Array.isArray(cards) ? cards : [cards]) : []

					for (let i = 0; i < frequency; i++) {
						let currGiftee = matchGiftee || giftee
						if (matchSeason && matchSeason !== String(season)) {
							progress += `<p class="text-blue-400">Found ${id} but not right season.`
						} else {
							if (mode.includes('Gift')) {
								await processGift(nation, id, season, currGiftee, currentNationXPin, nationSpecificPassword)
							} else {
								progress += `<p class="text-green-400">${nation} owns ${id}!`
								content.push({
									url: `${domain}/page=deck/container=${nation}/nation=${nation}/card=${id}/season=${season}/gift=1?${urlParameters('Finder', main)}&giftto=${currGiftee}`,
									tableText: `Link to ${nation}`,
								})
							}
							findCount++
						}
					}
				}
			}
		} else {
			progress += `<p>More cards than puppets, proceeding...</p>`
			for (let i = 0; i < puppetList.length; i++) {
				if (mode === 'Gift One' && giftedCards.size > 0 && toFind.length > 0 && giftedCards.size === toFind.length) {
					progress += `<p class="text-blue-400">All cards provided have been gifted, skipping remaining puppets`
					continue
				}
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
					progress += `<p>Processing ${nation} ${i + 1}/${puppetList.length} puppets</p>`
					const xmlDocument = await parseXML(`${domain}/cgi-bin/api.cgi?nationname=${nation}&q=cards+deck`, main)
					let cards: Array<Card> = xmlDocument.CARDS.DECK.CARD
					cards = cards ? (Array.isArray(cards) ? cards : [cards]) : []
					const matches = toFind.map(matcher => matcher.split(','))
					if (cards && cards.length > 0) {
						for (let j = 0; j < cards.length; j++) {
							const id = cards[j].CARDID
							const season = cards[j].SEASON
							if (giftedCards.has(id) && mode === 'Gift One') {
								progress += `<p class="text-blue-400">Already gifted ${id}.`
								continue
							}
							let matchingEntries = matches.filter(match => match[0] === String(id))
							if (matchingEntries.length > 0) {
								for (let entry of matchingEntries) {
									const matchSeason = entry[1]
									const matchGiftee = entry[2]
									let currGiftee = matchGiftee || giftee
									if (matchSeason && matchSeason !== String(season)) {
										progress += `<p class="text-blue-400">Found ${id} but not right season.`
									} else {
										if (mode.includes('Gift')) {
											await processGift(nation, id, season, currGiftee, currentNationXPin, nationSpecificPassword)
										} else {
											progress += `<p class="text-green-400">${nation} owns ${id}!`
											content.push({
												url: `${domain}/page=deck/container=${nation}/nation=${nation}/card=${id}/season=${season}/gift=1?${urlParameters('Finder', main)}&giftto=${currGiftee}`,
												tableText: `Link to ${nation}`,
											})
										}
										findCount++
									}
								}
							}
						}
					} else {
						progress += `<p class="text-blue-400">It is likely ${nation} has 0 cards, skipping!`
					}
				} catch (err) {
					progress += `<p class="text-red-400">Error processing ${nation} with ${err}</p>`
				}
			}
		}
		progress += `<p>Finished processing, found ${findCount} uniques, ${mode === 'Gift' ? `with ${failedGiftCount} failed gifts` : `on mode ${mode}.`}</p>`
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
	caption="Find which of the specified nations have which of the specified cards."
	author="Kractero"
	link="https://github.com/Kractero/cards-utilities/blob/main/finder.py"
	additional={`<p class="mb-2">
	You can specify season and nation to gift with CARDID,SEASON,GIFTTO instead of just CARDID on each line.
	GIFTTO will overrule the Gift To nation if provided. If you are providing GIFTTO, SEASON must be provided.
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
		<div class="-mb-6 flex flex-col">
			<p class="mb-1 text-center font-light text-muted-foreground">Presets</p>
			<div class="mx-auto">
				<Button onclick={() => fetchPreset('Legendaries')} variant={'outline'} class="mx-auto">Legendaries</Button>
				<Button onclick={() => fetchPreset('Fauzjhia')} variant={'outline'} class="mx-auto">Fauzjhia</Button>
				<Button onclick={() => fetchPreset('Mikeswill')} variant={'outline'} class="mx-auto">Mikeswill</Button>
				<Button onclick={() => fetchPreset('Apexiala')} variant={'outline'} class="mx-auto">Apexiala</Button>
				<Button onclick={() => fetchPreset('Dr_Hooves')} variant={'outline'} class="mx-auto">Dr Hooves</Button>
			</div>
		</div>
		<FormTextArea bind:bindValue={finderlist} label={'Cards to Find'} id="finderlist" required />
		<FormSelect bind:bindValue={mode} id="mode" items={['Gift', 'Sell', 'Gift One']} label="Behavior" />
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
	<Terminal bind:progress />
</div>
