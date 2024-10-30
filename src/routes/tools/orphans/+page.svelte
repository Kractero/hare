<script lang="ts">
	import { onDestroy, onMount } from 'svelte'
	import { page } from '$app/stores'
	import Buttons from '$lib/components/Buttons.svelte'
	import UserAgent from '$lib/components/formFields/UserAgent.svelte'
	import FormInput from '$lib/components/FormInput.svelte'
	import Terminal from '$lib/components/Terminal.svelte'
	import ToolContent from '$lib/components/ToolContent.svelte'
	import { parseXML } from '$lib/helpers/parser'
	import { checkUserAgent, pushHistory, urlParameters } from '$lib/helpers/utils'

	const abortController = new AbortController()

	let domain = ''
	let progress = $state('')
	let stoppable = $state(false)
	let stopped = $state(false)
	let downloadable = $state(true)
	let main = $state('')
	let deck = $state('')
	let content = $state('')
	let errors: Array<{ field: string | number; message: string }> = $state([])
	// let collections = '';
	onMount(() => {
		domain = `https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net`
		main = $page.url.searchParams.get('main') || (localStorage.getItem('main') as string) || ''
		deck = $page.url.searchParams.get('deck') || (localStorage.getItem('orphansDeck') as string) || ''
		// collections = $page.url.searchParams.get('collections') || localStorage.getItem("orphansCollection") as string || "";
	})
	onDestroy(() => abortController.abort())

	async function onSubmit(e: Event) {
		e.preventDefault()
		// ${collections ? `&collections=${collections}` : ""}
		pushHistory(`?main=${main}${deck ? `&deck=${deck}` : ''}`)
		errors = checkUserAgent(main)
		if (errors.length > 1) return
		stoppable = true
		stopped = false
		downloadable = false
		content = ''
		progress = `<p class="font-bold">Initiating Orphans...</p>`
		let collectionList: string[] = []
		// let collectionList = collections.split('\n');

		// if (collectionList[0] === "") {
		//   const collections = await parseXML(`${domain}/cgi-bin/api.cgi?q=cards+collections;nationname=${deckList[0]}`, main)
		//   if (collections.CARDS.COLLECTIONS) {
		//     if (Array.isArray(collections.CARDS.COLLECTIONS.COLLECTION)) {
		//       collectionList = collections.CARDS.COLLECTIONS.COLLECTION.map((collection: { COLLECTIONID: number; }) => collection.COLLECTIONID)
		//     } else {
		//       collectionList = [collections.CARDS.COLLECTIONS.COLLECTION.COLLECTIONID]
		//     }
		//   }
		//   await sleep(600)
		// }

		const collections = await parseXML(`${domain}/cgi-bin/api.cgi?q=cards+collections;nationname=${deck}`, main)
		if (collections.CARDS.COLLECTIONS) {
			if (Array.isArray(collections.CARDS.COLLECTIONS.COLLECTION)) {
				collectionList = collections.CARDS.COLLECTIONS.COLLECTION.map(
					(collection: { COLLECTIONID: number }) => collection.COLLECTIONID
				)
			} else {
				collectionList = [collections.CARDS.COLLECTIONS.COLLECTION.COLLECTIONID]
			}
		}

		const collectionCards: Array<{ CARDID: number; SEASON: number }> = []
		for (let i = 0; i < collectionList.length; i++) {
			progress += `<p>Computing collection ${collectionList[i]}</p>`
			const cards = await parseXML(
				`${domain}/cgi-bin/api.cgi?q=cards+collection;collectionid=${collectionList[i]}`,
				main
			)
			if (cards.CARDS && cards.CARDS.COLLECTION && cards.CARDS.COLLECTION.DECK && cards.CARDS.COLLECTION.DECK.CARD) {
				if (Array.isArray(cards.CARDS.COLLECTION.DECK.CARD)) {
					cards.CARDS.COLLECTION.DECK.CARD.forEach((card: { CARDID: number; SEASON: number }) => {
						if (
							card.CARDID &&
							card.SEASON &&
							!collectionCards.some(
								existingCard => existingCard.CARDID === card.CARDID && existingCard.SEASON === card.SEASON
							)
						) {
							collectionCards.push({ CARDID: card.CARDID, SEASON: card.SEASON })
						}
					})
				} else {
					collectionCards.push({
						CARDID: cards.CARDS.COLLECTION.DECK.CARD.CARDID,
						SEASON: cards.CARDS.COLLECTION.DECK.CARD.SEASON,
					})
				}
			}
		}

		const deckCards: Array<{ CARDID: number; SEASON: number }> = []
		const cards = await parseXML(`${domain}/cgi-bin/api.cgi?q=cards+deck;nationname=${deck}`, main)
		progress += `<p>Computing deck of ${deck}</p>`
		if (cards.CARDS && cards.CARDS.DECK && cards.CARDS.DECK.CARD) {
			if (Array.isArray(cards.CARDS.DECK.CARD)) {
				cards.CARDS.DECK.CARD.forEach((card: { CARDID: number; SEASON: number }) => {
					if (
						card.CARDID &&
						card.SEASON &&
						!deckCards.some(existingCard => existingCard.CARDID === card.CARDID && existingCard.SEASON === card.SEASON)
					) {
						deckCards.push({ CARDID: card.CARDID, SEASON: card.SEASON })
					}
				})
			} else {
				deckCards.push({
					CARDID: cards.CARDS.DECK.CARD.CARDID,
					SEASON: cards.CARDS.DECK.CARD.SEASON,
				})
			}
		}

		const cardsNotInCollection = deckCards.filter(card => {
			return !collectionCards.some(
				collectionCard => collectionCard.CARDID === card.CARDID && collectionCard.SEASON === card.SEASON
			)
		})

		cardsNotInCollection.forEach(card => {
			content += `<tr><td><p>S${card.SEASON} ${card.CARDID}</p></td><td><p><a target="_blank" href="${domain}/page=deck/card=${card.CARDID}/season=${card.SEASON}?${urlParameters('Orphans', main)}">Link to Card</a></p></td></tr>\n`
		})

		progress += `<p>Found ${cardsNotInCollection.length} cards not in a collection</p>`
		downloadable = true
		stoppable = false
	}
</script>

<ToolContent toolTitle="Orphans" caption="Get a list of cards not in any collection." />

<div class="flex flex-col gap-8 break-normal lg:w-[1024px] lg:max-w-5xl lg:flex-row">
	<form onsubmit={onSubmit} class="flex flex-col gap-8">
		<UserAgent bind:errors bind:main />
		<FormInput bind:bindValue={deck} id="deck" label="Deck" required />
		<!-- <Textarea text="Collections" bind:bindValue={collections} forValue="collections" /> -->
		<Buttons
			stopButton={true}
			bind:stopped
			bind:stoppable
			downloadButton={true}
			bind:downloadable
			bind:content
			name="orphans"
		/>
	</form>
	<Terminal bind:progress />
</div>
