<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { parseXML } from '$lib/helpers/utils';
	import Buttons from '$lib/component/Buttons.svelte';
	import Input from '$lib/component/Input.svelte';
	import Terminal from '$lib/component/Terminal.svelte';
	import Textarea from '$lib/component/Textarea.svelte';
	import { pushHistory } from '$lib/helpers/utils';
	import Select from '$lib/component/Select.svelte';
	import ToolContent from '$lib/component/ToolContent.svelte';
	import { page } from '$app/stores';

	const abortController = new AbortController();
	let progress = '';
	let stoppable = false;
	let stopped = false;
	let main = '';
	let content = '';
	let cardIds = '';
	let mode = '';
	let collectionsOrDecks = '';
	let asksBidsNation = '';
	let cardsCount = 0;
	let downloadable = false;
	onMount(() => {
		main = $page.url.searchParams.get('main') || (localStorage.getItem('main') as string) || '';
		cardIds = (localStorage.getItem('signalCardIds') as string) || '';
		collectionsOrDecks = (localStorage.getItem('signalCollectionsOrDecks') as string) || '';
		asksBidsNation = (localStorage.getItem('signalAsksBidsNation') as string) || '';
		mode =
			$page.url.searchParams.get('mode') ||
			(localStorage.getItem('signalMode') as string) ||
			'Collection';
	});
	onDestroy(() => abortController.abort());

	async function signal() {
		pushHistory(`?main=${main}&mode=${mode}`);
		downloadable = false;
		let cards = cardIds.split('\n');
		let noMatch: Array<string> = [];
		let iterator: Array<{ [key: string]: any }> = [];
		progress = 'Initiating Queries...';
		if (mode === 'Collection' || mode === 'Deck') {
			const collectionsOrDecksArr = collectionsOrDecks.split('\n');
			for (let i = 0; i < collectionsOrDecksArr.length; i++) {
				const endpoint =
					mode === 'Collection'
						? `https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net/cgi-bin/api.cgi?q=cards+${`collection;collectionid=${collectionsOrDecksArr[i]}`}`
						: `https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net/cgi-bin/api.cgi?q=cards+${`deck;nationname=${collectionsOrDecksArr[i]}`}`;
				const xml = await parseXML(endpoint, main);
				if (mode === 'Collection' && !(xml.CARDS.COLLECTION && xml.CARDS.COLLECTION.DECK.CARD)) {
					progress += `<p class="text-red-400">Something is wrong with ${collectionsOrDecks[i]}!</p>`;
					return;
				}
				if (mode === 'Deck' && !(xml.CARDS.DECK && xml.CARDS.DECK.CARD)) {
					progress += `<p class="text-red-400">Something is wrong with ${collectionsOrDecks[i]}!</p>`;
					return;
				}
				if (mode === 'Collection') {
					const collectionCards = xml.CARDS.COLLECTION.DECK.CARD;
					iterator = [...iterator, ...collectionCards];
				} else {
					const deckCards = xml.CARDS.DECK.CARD;
					iterator = [...iterator, ...deckCards];
				}
			}
		} else {
			const xml = await parseXML(
				`https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net/cgi-bin/api.cgi?q=cards+asksbids;nationname=${asksBidsNation}`,
				main
			);
			if (mode.includes('Asks')) {
				if (!xml.CARDS.ASKS) {
					progress += `<p class="text-red-400">${asksBidsNation} has no active asks</p>`;
				} else {
					const asks = Array.isArray(xml.CARDS.ASKS.ASK)
						? xml.CARDS.ASKS.ASK
						: [xml.CARDS.ASKS.ASK];
					iterator = mode.includes('Bids') ? [...iterator, ...asks] : asks;
				}
			}
			if (mode.includes('Bids')) {
				if (!xml.CARDS.BIDS) {
					progress += `<p class="text-red-400">${asksBidsNation} has no active bids</p>`;
				} else {
					const bids = Array.isArray(xml.CARDS.BIDS.BID)
						? xml.CARDS.BIDS.BID
						: [xml.CARDS.BIDS.BID];
					iterator = mode.includes('Asks') ? [...iterator, ...bids] : bids;
				}
			}
		}
		iterator = [...new Set(iterator)];
		cards.forEach((card) => {
			let season = card.split(',')[1];
			let id = card.split(',')[0];
			progress += `<p>Searching card ${id} from season ${season}...`;
			for (let iteratorCard of iterator) {
				if (iteratorCard.SEASON === Number(season) && iteratorCard.CARDID === Number(id)) return;
			}
			noMatch.push(card);
			content += `<tr><td><p>${
				cardsCount + 1
			}</p></td><td><p><a target="_blank" href="https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net/page=deck/card=${id}/season=${season}User_agent=${main}/Script=Signal/Generated_by=Signal/Author_discord=scrambleds/Author_main_nation=Kractero/">Link to Card</a></p></td></tr>\n`;
			cardsCount++;
			progress += `<p class="text-green-400">Card ${id} from season ${season} not found within the provided parameters.</p>`;
		});
		progress += `<p>Finished processing, ${cardsCount} cards found.</p>`;
		downloadable = true;
		stoppable = false;
	}
</script>

<ToolContent
	toolTitle="Signal"
	caption="Given card ids, provide decks, collections, or check asks for bids for what's missing. Sideroca compatible."
/>

<div class="lg:w-[1024px] lg:max-w-5xl flex flex-col lg:flex-row gap-8 break-normal">
	<form on:submit|preventDefault={() => signal()} class="flex flex-col gap-8">
		<Input text={`User Agent`} bind:bindValue={main} forValue="main" required={true} />
		<Textarea text="Card IDs" bind:bindValue={cardIds} forValue="cardIds" required />
		<Select
			name="Behavior"
			bind:mode
			options={['Collection', 'Deck', 'Asks', 'Bids', 'Asks and Bids']}
		/>
		{#if mode === 'Asks' || mode === 'Bids' || mode === 'Asks and Bids'}
			<Input text={`Nation`} bind:bindValue={asksBidsNation} forValue="nation" required={true} />
		{:else}
			<Textarea text={mode} bind:bindValue={collectionsOrDecks} forValue="mode" required />
		{/if}
		<Buttons
			stopButton={true}
			bind:stopped
			bind:stoppable
			downloadButton={true}
			bind:downloadable
			bind:content
			name="Queries"
		/>
	</form>
	<Terminal bind:progress />
</div>
