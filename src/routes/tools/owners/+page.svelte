<script lang="ts">
	import { onMount } from 'svelte';
	import { parseXML, sleep } from '$lib/helpers/utils';
	import Head from '$lib/component/Head.svelte';
	import Buttons from '$lib/component/Buttons.svelte';
	import Input from '$lib/component/Input.svelte';
	import Terminal from '$lib/component/Terminal.svelte';
	import type { Nation } from '$lib/types';
	import type { PageData } from './$types';
	import { pushHistory } from '$lib/helpers/utils';
	export let data: PageData;
	let progress = "";
	let main = '';
	let id = '';
    let season = '';

	// onMount(() => {
	// 	main = data.parameters.main || localStorage.getItem("main") as string || "";
	// 	nennation = data.parameters.nennation || localStorage.getItem("nenNation") as string || "";
	// });

	async function nen() {
		// pushHistory(`?main=${main}&nennation=${nennation}`)
		progress = '';
        progress += `<p">Searching for the owners of Season ${season} ${id}</p>`
        const xml = await parseXML(`https://www.nationstates.net/cgi-bin/api.cgi?q=card+owners;cardid=${id};season=${season}`, main);
		await sleep(700);
        const owners: Array<string> = xml.CARD.OWNERS.OWNER
        const counts: {[key: string]: number} = {};

        owners.forEach(owner => {
            if (counts[owner]) {
            counts[owner] += 1;
            } else {
            counts[owner] = 1;
            }
        });

        const ownersSorted = Object.keys(counts)
            .map(owner => ({ owner, count: counts[owner] }))
            .sort((a, b) => b.count - a.count);

        ownersSorted.forEach(owner => {
            progress += `<p><a class="underline" href="https://nationstates.net/nation=${owner.owner}" target="_blank" rel="noreferrer noopener">${owner.owner}</a> owns ${owner.count}</p>`
        })
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
		<Input text={`Card ID`} bind:bindValue={id} forValue="id" required={true} />
        <Input text={`Season`} bind:bindValue={season} forValue="season" required={true} />
		<Buttons />
	</form>
	<Terminal bind:progress={progress} />
</div>
