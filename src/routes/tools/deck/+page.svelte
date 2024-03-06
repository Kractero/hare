<script lang="ts">
	import { onMount } from 'svelte';
	import { parseXML } from '$lib/helpers/utils';
	import Buttons from '$lib/component/Buttons.svelte';
	import Input from '$lib/component/Input.svelte';
	import Terminal from '$lib/component/Terminal.svelte';
	import type { PageData } from './$types';
	import { pushHistory } from '$lib/helpers/utils';
	import ToolContent from '$lib/component/ToolContent.svelte';
	import type { Card } from '$lib/types';
	import Select from '$lib/component/Select.svelte';
	export let data: PageData;
	let progress = "";
	let main = '';
	let nennation = '';
	let downloadable = false;
	let dl = ""
	let mode = "Signal"
	let type = "Deck"
	let duplicates = "Skip"

	onMount(() => {
		main = data.parameters.main || localStorage.getItem("main") as string || "";
		nennation = data.parameters.nation || "";
		mode = data.parameters.mode || localStorage.getItem("deckMode") as string || "";
		duplicates = data.parameters.duplicates || localStorage.getItem("deckDuplicates") as string || "Skip";
		type = data.parameters.type || localStorage.getItem("deckCollMode") as string || "Deck";
	});

	async function nen() {
		downloadable = false;
		pushHistory(`?main=${main}&nation=${nennation}&mode=${mode}&type=${type}`)
		progress = '';
		if (type.toLowerCase() === "deck") {
			const xml = await parseXML(`https://${localStorage.getItem("connectionUrl") || "www"}.nationstates.net/cgi-bin/api.cgi?q=cards+deck;nationname=${nennation}`, main);
			let deckObj: Array<Card> = xml.CARDS.DECK.CARD;
			deckObj = deckObj ? Array.isArray(deckObj) ? deckObj : [deckObj] : []
			if (duplicates === "Skip") {
				dl = Array.from(new Set((deckObj as Card[]).map((card) => mode === "Signal" ? `${card.CARDID},${card.SEASON}` : card.CARDID))).join('\n')
			} else {
				dl = Array.from(deckObj as Card[]).map((card) => mode === "Signal" ? `${card.CARDID},${card.SEASON}` : card.CARDID).join('\n')
			}
		} else {
			const xml = await parseXML(`https://${localStorage.getItem("connectionUrl") || "www"}.nationstates.net/cgi-bin/api.cgi?q=cards+collection;collectionid=${nennation}`, main);
			let collObj: Array<Card> = xml.CARDS.COLLECTION.DECK.CARD
			collObj = collObj ? Array.isArray(collObj) ? collObj : [collObj] : []
			if (duplicates === "Skip") {
				dl = Array.from(new Set((collObj as Card[]).map((card) => mode === "Signal" ? `${card.CARDID},${card.SEASON}` : card.CARDID))).join('\n')
			} else {
				dl = Array.from(collObj as Card[]).map((card) => mode === "Signal" ? `${card.CARDID},${card.SEASON}` : card.CARDID).join('\n')
			}
		}
		downloadable = true;
		progress += `<p>Finished processing</p>`
	}
</script>

<ToolContent toolTitle="Deck to IDs" caption={"Turn a deck into a text file of card ids, duplicates ignored."} />

<div class="lg:w-[1024px] lg:max-w-5xl flex flex-col lg:flex-row gap-8 break-normal">
	<form on:submit|preventDefault={() => nen()} class="flex flex-col gap-8">
		<Input text={`User Agent`} bind:bindValue={main} forValue="main" required={true} />
		<Input text={type.toLowerCase() === "deck" ?  `Nation` : 'Collection'} bind:bindValue={nennation} forValue="nennation" required={true} />
		<Select name="Type" bind:mode={type} options={["Deck", "Collection"]} />
		<Select name="Duplicates" bind:mode={duplicates} options={["Skip", "Include"]} />
		<Select name="Output Format" bind:mode={mode} options={["Signal", "IDs"]} />
        <Buttons downloadButton={true} bind:downloadable={downloadable} bind:content={dl} name="Deck" type="txt" />
	</form>
	<Terminal bind:progress={progress} />
</div>
