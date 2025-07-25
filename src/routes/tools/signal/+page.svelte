<script lang="ts">
	import { onDestroy, onMount } from 'svelte'
	import { page } from '$app/state'
	import Buttons from '$lib/components/Buttons.svelte'
	import UserAgent from '$lib/components/formFields/UserAgent.svelte'
	import FormInput from '$lib/components/FormInput.svelte'
	import FormSelect from '$lib/components/FormSelect.svelte'
	import FormTextArea from '$lib/components/FormTextArea.svelte'
	import Terminal from '$lib/components/Terminal.svelte'
	import ToolContent from '$lib/components/ToolContent.svelte'
	import { parseXML } from '$lib/helpers/parser'
	import { checkUserAgent, pushHistory, urlParameters } from '$lib/helpers/utils'

	const abortController = new AbortController()

	let domain = ''
	let progress = $state<Array<{ text: string; color?: string }>>([])
	let stoppable = $state(false)
	let stopped = $state(false)
	let main = $state('')
	let content: Array<{ url: string; tableText: string; linkStyle?: string }> = $state([])
	let cardIds = $state('')
	let mode = $state('')
	let collectionsOrDecks = $state('')
	let asksBidsNation = $state('')
	let cardsCount = 0
	let downloadable = $state(false)
	let errors: Array<{ field: string | number; message: string }> = $state([])

	onMount(() => {
		domain = `https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net`
		main = page.url.searchParams.get('main') || (localStorage.getItem('main') as string) || ''
		cardIds = (localStorage.getItem('signalCardIds') as string) || ''
		collectionsOrDecks = (localStorage.getItem('signalCollectionsOrDecks') as string) || ''
		asksBidsNation = (localStorage.getItem('signalAsksBidsNation') as string) || ''
		mode = page.url.searchParams.get('mode') || (localStorage.getItem('signalMode') as string) || 'Collection'
	})
	onDestroy(() => abortController.abort())

	async function onSubmit(e: Event) {
		e.preventDefault()
		pushHistory(`?main=${main}&mode=${mode}`)
		errors = checkUserAgent(main)
		if (errors.length > 0) return
		downloadable = false
		let cards = cardIds.split('\n')
		let noMatch: Array<string> = []
		let iterator: Array<{ [key: string]: any }> = []
		progress = [{ text: `'Initiating Signal...'` }]
		if (mode === 'Collection' || mode === 'Deck') {
			const collectionsOrDecksArr = collectionsOrDecks.split('\n')
			for (let i = 0; i < collectionsOrDecksArr.length; i++) {
				const endpoint =
					mode === 'Collection'
						? `${domain}/cgi-bin/api.cgi?q=cards+${`collection;collectionid=${collectionsOrDecksArr[i]}`}`
						: `${domain}/cgi-bin/api.cgi?q=cards+${`deck;nationname=${collectionsOrDecksArr[i]}`}`
				const xml = await parseXML(endpoint, main)
				if (mode === 'Collection' && !(xml.CARDS.COLLECTION && xml.CARDS.COLLECTION.DECK.CARD)) {
					progress = [...progress, { text: `Something is wrong with ${collectionsOrDecks[i]}!`, color: 'red' }]
					return
				}
				if (mode === 'Deck' && !(xml.CARDS.DECK && xml.CARDS.DECK.CARD)) {
					progress = [...progress, { text: `Something is wrong with ${collectionsOrDecks[i]}!`, color: 'red' }]
					return
				}
				if (mode === 'Collection') {
					const collectionCards = xml.CARDS.COLLECTION.DECK.CARD
					iterator = [...iterator, ...collectionCards]
				} else {
					const deckCards = xml.CARDS.DECK.CARD
					iterator = [...iterator, ...deckCards]
				}
			}
		} else {
			const xml = await parseXML(`${domain}/cgi-bin/api.cgi?q=cards+asksbids;nationname=${asksBidsNation}`, main)
			if (mode.includes('Asks')) {
				if (!xml.CARDS.ASKS) {
					progress = [...progress, { text: `${asksBidsNation} has no active asks`, color: 'red' }]
				} else {
					const asks = Array.isArray(xml.CARDS.ASKS.ASK) ? xml.CARDS.ASKS.ASK : [xml.CARDS.ASKS.ASK]
					iterator = mode.includes('Bids') ? [...iterator, ...asks] : asks
				}
			}
			if (mode.includes('Bids')) {
				if (!xml.CARDS.BIDS) {
					progress = [...progress, { text: `${asksBidsNation} has no active bids`, color: 'red' }]
				} else {
					const bids = Array.isArray(xml.CARDS.BIDS.BID) ? xml.CARDS.BIDS.BID : [xml.CARDS.BIDS.BID]
					iterator = mode.includes('Asks') ? [...iterator, ...bids] : bids
				}
			}
		}
		iterator = [...new Set(iterator)]
		cards.forEach(card => {
			let season = card.split(',')[1]
			let id = card.split(',')[0]
			progress = [...progress, { text: `Searching card ${id} from season ${season}...` }]
			for (let iteratorCard of iterator) {
				if (iteratorCard.SEASON === Number(season) && iteratorCard.CARDID === Number(id)) return
			}
			noMatch.push(card)
			content.push({
				url: `${domain}/page=deck/card=${id}/season=${season}?${urlParameters('Signal', main)}`,
				tableText: `Link to Card ${id} Season ${season}`,
			})
			cardsCount++
			progress = [
				...progress,
				{ text: `Card ${id} from season ${season} not found within the provided parameters.`, color: 'green' },
			]
		})
		progress = [...progress, { text: `Finished processing, ${cardsCount} cards found.` }]
		downloadable = true
		stoppable = false
	}
</script>

<ToolContent
	toolTitle="Signal"
	icon="📶"
	caption="Given card ids, provide decks, collections, or check asks for bids for what's missing." />

<div class="flex flex-col gap-8 break-normal lg:w-[1024px] lg:max-w-5xl lg:flex-row">
	<form onsubmit={onSubmit} class="flex flex-col gap-8">
		<UserAgent bind:errors bind:main />
		<FormTextArea label="Card IDs" bind:bindValue={cardIds} id="cardIds" required />
		<FormSelect
			id="mode"
			label="Behavior"
			bind:bindValue={mode}
			items={['Collection', 'Deck', 'Asks', 'Bids', 'Asks and Bids']} />
		{#if mode === 'Asks' || mode === 'Bids' || mode === 'Asks and Bids'}
			<FormInput label={`Nation`} bind:bindValue={asksBidsNation} id="nation" required={true} />
		{:else}
			<FormTextArea label={mode} bind:bindValue={collectionsOrDecks} id="mode" required />
		{/if}
		<Buttons
			stopButton={true}
			bind:stopped
			bind:stoppable
			downloadButton={true}
			bind:downloadable
			bind:content
			name="Queries" />
	</form>
	<Terminal bind:progress />
</div>
