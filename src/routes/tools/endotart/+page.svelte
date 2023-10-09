<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { parseXML, sleep } from '$lib/globals';
	import Head from '$lib/component/Head.svelte';
	import { loadLocalStorage } from '$lib/loadLocalStorage';
	import Terminal from '$lib/component/Terminal.svelte';
	import Buttons from '$lib/component/Buttons.svelte';
	import Input from '$lib/component/Input.svelte';
	import Textarea from '$lib/component/Textarea.svelte';
	import type { Nation, Region } from '$lib/types';
	const abortController = new AbortController();
	let progress = "";
	let main = "";
	let endotartnation = '';
	let stopped = false;
	let stoppable = false;
	let immune = "";
	let limit: number | undefined = undefined;
	onMount(() => ({ main, endotartnation, limit } = loadLocalStorage(["stationMain", "stationEndotartNation", "stationEndotartLimit"])));
	onDestroy(() => abortController.abort() );
	async function findWA() {
		progress = "";
		stoppable = true;
		stopped = false;
		const whiteList = immune ? immune.split('\n').map(nation => nation.toLowerCase().replace(' ', '_')) : [];
        const regionalXML: Nation = await parseXML(`https://www.nationstates.net/cgi-bin/api.cgi?nation=${endotartnation}&q=endorsements+region+wa`, main)
        if (regionalXML.NATION.UNSTATUS === "Non-member") {
            progress += `<p class="text-red-400">${endotartnation} is not in the WA.</p>`
			return;
        }
        await sleep(700)
        progress += `<p>Searching for the nations in ${regionalXML.NATION.REGION} not being endorsed by ${endotartnation}</p>`
        const wamems: Region = await parseXML(`https://www.nationstates.net/cgi-bin/api.cgi?region=${regionalXML.NATION.REGION}&q=wanations`, main)
        const regionalWA = wamems.REGION.UNNATIONS.split(',')
        for (let i = 0; i < regionalWA.length; i++) {
			if (abortController.signal.aborted || stopped) {
				break;
			}
            await sleep(700);
            const xml: Nation = await parseXML(`https://www.nationstates.net/cgi-bin/api.cgi?nation=${regionalWA[i]}&q=endorsements+name`, main)
            const endorsers = String(xml.NATION.ENDORSEMENTS).includes(',') ? xml.NATION.ENDORSEMENTS.split(',') : [xml.NATION.ENDORSEMENTS];
			if (regionalWA[i] === endotartnation.toLowerCase().replaceAll(' ', '_')) {
				progress += `<p class="text-yellow-400 font-extralight">${i+1}/${regionalWA.length} <a class="underline" href="https://nationstates.net/nation=${regionalWA[i]}"}>${regionalWA[i]}</a> is the endotart nation.</p>`
			} else if (limit) {
				if (whiteList.includes(regionalWA[i])) {
					progress += `<p class="text-yellow-400 font-extralight">${i+1}/${regionalWA.length} <a class="underline" href="https://nationstates.net/nation=${regionalWA[i]}"}>${regionalWA[i]}</a> is in your immune nations.</p>`
				} else if (endorsers.length < limit && !endorsers.includes(endotartnation.toLowerCase().replaceAll(' ', '_')) && regionalWA[i] !== endotartnation.toLowerCase().replaceAll(' ', '_')) {
					progress += `<p class="text-green-400">${i+1}/${regionalWA.length} <a class="underline" href="https://nationstates.net/nation=${regionalWA[i]}"}>${regionalWA[i]}</a> is not being endorsed by ${endotartnation}.</p>`
				} else if (endorsers.length > limit) {
					progress += `<p class="text-red-400 font-extralight">${i+1}/${regionalWA.length} <a class="underline" href="https://nationstates.net/nation=${regionalWA[i]}"}>${regionalWA[i]}</a> has more than ${limit} endorsements.</p>`
				} else {
					progress += `<p class="text-red-400 font-extralight">${i+1}/${regionalWA.length} <a class="underline" href="https://nationstates.net/nation=${regionalWA[i]}"}>${regionalWA[i]}</a> is already endorsed by ${endotartnation}.</p>`
				}
			} else {
				if (!endorsers.includes(endotartnation.toLowerCase().replaceAll(' ', '_')) && regionalWA[i] !== endotartnation.toLowerCase().replaceAll(' ', '_')) {
					progress += `<p class="text-green-400">${i+1}/${regionalWA.length} <a class="underline" href="https://nationstates.net/nation=${regionalWA[i]}"}>${regionalWA[i]}</a> is not being endorsed by ${endotartnation}.</p>`
				} else {
					progress += `<p class="text-red-400 font-extralight">${i+1}/${regionalWA.length} <a class="underline" href="https://nationstates.net/nation=${regionalWA[i]}"}>${regionalWA[i]}</a> is already endorsed by ${endotartnation}.</p>`
				}
			}
            await sleep(700);
        }
		progress += `<p>Finished searching ${regionalXML.NATION.REGION} for nations not being endorsed by ${endotartnation}</p>`
		stoppable = false;
	}
</script>

<Head title={"Hare - Endotarting"} description={"Specify a nation and get all the regionmates they are not endorsing."} />

<h1 class="text-4xl mb-2">Endotarting</h1>
<p class="text-xs mb-4">
	A <a href="https://github.com/nsupc/UPC-3PO" target="_blank" rel="noreferrer noopener">UPC-3PO</a> command rewritten in JavaScript by Kractero
<p class="mb-16">Specify a nation and get all the regionmates they are not endorsing.</p>

<div class="lg:w-[1024px] lg:max-w-5xl flex flex-col lg:flex-row gap-8 break-normal">
	<form on:submit|preventDefault={findWA} class="flex flex-col gap-8">
		<Input text="User Agent" bind:bindValue={main} forValue="main" required={true} />
		<Input text="Endotart Nation" bind:bindValue={endotartnation} forValue="endotartnation" required={true} />
		<Input text="Endorse Limit" bind:bindValue={limit} forValue="limit" required={false} />
		<Textarea text="Immune Nations" bind:bindValue={immune} forValue="immune" />
		<Buttons>
			<button
				type="button"
				disabled={!stoppable}
				on:click={() => { {
					stoppable = false;
					stopped = true;
				} }}
				class="bg-red-500 rounded-md px-4 py-2 transition duration-300 hover:bg-red-300 disabled:opacity-20 disabled:hover:bg-red-500"
			>
				Stop
			</button>
		</Buttons>
	</form>
	<Terminal bind:progress={progress} />
</div>
