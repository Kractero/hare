<script lang="ts">
	import { onMount } from 'svelte';
	import { parseXML, sleep } from '$lib/globals';
	import Head from '$lib/component/Head.svelte';
	import Buttons from '$lib/component/Buttons.svelte';
	import Input from '$lib/component/Input.svelte';
	import Terminal from '$lib/component/Terminal.svelte';
	import type { Nation } from '$lib/types';
	import type { PageData } from './$types';
	import { loadStorage } from '$lib/loadStorage';
	import { pushHistory } from '$lib/helpers/utils';
	export let data: PageData;
	let progress = "";
	let main = '';
	let nennation = '';

	onMount(() => {
		main = data.parameters.main || loadStorage("useragent") as string || "";
		nennation = data.parameters.nennation || loadStorage("nenNation") as string || "";
	});

	async function nen() {
		pushHistory(`?main=${main}&nennation=${nennation}`)
		progress = '';
        const xml: Nation = await parseXML(`https://www.nationstates.net/cgi-bin/api.cgi?nation=${nennation}&q=endorsements+region+wa`, main);
        if (xml.NATION.UNSTATUS === "Non-member") {
            progress += `<p class="text-red-400">${nennation} is not in the WA.</p>`
			return;
        }
		await sleep(700);
		progress += `<p">Searching for the nations in ${xml.NATION.REGION} not endorsing ${nennation}</p>`
        const wamems = await parseXML(`https://www.nationstates.net/cgi-bin/api.cgi?region=${xml.NATION.REGION}&q=wanations`, main)
        const mainEndorsers = xml.NATION.ENDORSEMENTS.split(',');
    	wamems.REGION.UNNATIONS.split(',').filter((member: string) => !mainEndorsers.includes(member) && member !== nennation.toLowerCase().replace(' ', '_')).forEach((member: string) => {
			progress += `<p><a class="underline" href="https://nationstates.net/nation=${member}">${member}</a> is not endorsing ${nennation}.</p>`
		});
		progress += `<p>Finished processing</p>`
	}
</script>

<Head title={"Hare - Not Endorsing Nations"} description={"Specify a nation and get all the regionmates not endorsing them."} />

<h1 class="text-4xl mb-2">Not Endorsing Nation</h1>
<p class="text-xs mb-4">
	A UPC-3PO command rewritten in JavaScript by Kractero
<p class="mb-16">Specify a nation and get all the regionmates not endorsing them.</p>

<div class="lg:w-[1024px] lg:max-w-5xl flex flex-col lg:flex-row gap-8 break-normal">
	<form on:submit|preventDefault={() => nen()} class="flex flex-col gap-8">
		<Input text={`User Agent`} bind:bindValue={main} forValue="main" required={true} />
		<Input text={`Nation to Check`} bind:bindValue={nennation} forValue="nennation" required={true} />
		<Buttons />
	</form>
	<Terminal bind:progress={progress} />
</div>
