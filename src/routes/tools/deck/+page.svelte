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

	onMount(() => {
		main = data.parameters.main || localStorage.getItem("main") as string || "";
		nennation = data.parameters.nation || "";
		mode = data.parameters.mode || localStorage.getItem("mode") as string || "";
	});

	async function nen() {
        downloadable = false;
		pushHistory(`?main=${main}&nation=${nennation}&mode=${mode}`)
		progress = '';
        const xml = await parseXML(`https://www.nationstates.net/cgi-bin/api.cgi?q=cards+deck;nationname=${nennation}`, main);
        dl = Array.from(new Set((xml.CARDS.DECK.CARD as Card[]).map((card) => mode === "Signal" ? `${card.CARDID},${card.SEASON}` : card.CARDID))).join('\n')
        downloadable = true;
        progress += `<p>Finished processing</p>`
	}
</script>

<ToolContent toolTitle="Deck to IDs" caption={"Turn a deck into a text file of card ids, duplicates ignored."} />

<div class="lg:w-[1024px] lg:max-w-5xl flex flex-col lg:flex-row gap-8 break-normal">
	<form on:submit|preventDefault={() => nen()} class="flex flex-col gap-8">
		<Input text={`User Agent`} bind:bindValue={main} forValue="main" required={true} />
		<Input text={`Nation`} bind:bindValue={nennation} forValue="nennation" required={true} />
		<Select name="Output Format" bind:mode={mode} options={["Signal", "IDs"]} />
        <Buttons downloadButton={true} bind:downloadable={downloadable} bind:content={dl} name="Deck" type="txt" />
	</form>
	<Terminal bind:progress={progress} />
</div>
