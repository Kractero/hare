<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { parser, sleep } from '$lib/globals';
	import Head from '$lib/component/Head.svelte';
	import { loadLocalStorage } from '$lib/loadLocalStorage';
	import Terminal from '$lib/component/Terminal.svelte';
	import Buttons from '$lib/component/Buttons.svelte';
	import Input from '$lib/component/Input.svelte';
	const abortController = new AbortController();
	let progress = "";
	let main = "";
	let endotartnation = '';
	let stopped = false;
	let stoppable = false;
	let limit: number | undefined = undefined;
	onMount(() => ({main, endotartnation, limit} = loadLocalStorage(["stationMain", "stationEndotartNation", "stationEndotartLimit"])));
	onDestroy(() => abortController.abort() );
	async function findWA(endotartation: string) {
		progress = "";
		stoppable = true;
		stopped = false;
        const regionresponse = await fetch(`https://www.nationstates.net/cgi-bin/api.cgi?nation=${endotartnation}&q=endorsements+region+wa`, {
			headers: {
				'User-Agent': main
			}
		});
        const regiontext = await regionresponse.text();
        const regionalXML = parser.parse(regiontext)
        if (regionalXML.NATION.UNSTATUS === "Non-member") {
            progress += `<p class="text-red-400">${endotartnation} is not in the WA.</p>`
			return;
        }
        await sleep(700)
        progress += `<p>Searching for the nations in ${regionalXML.NATION.REGION} not being endorsed by ${endotartnation}</p>`
        const wamems = await fetch(`https://www.nationstates.net/cgi-bin/api.cgi?region=${regionalXML.NATION.REGION}&q=wanations`)
		const text2 = await wamems.text();
		const xml2 = parser.parse(text2);
        const regionalWA = xml2.REGION.UNNATIONS.split(',')
        for (let i = 0; i < regionalWA.length; i++) {
			if (abortController.signal.aborted || stopped) {
				break;
			}
            await sleep(700);
            const response = await fetch(`https://www.nationstates.net/cgi-bin/api.cgi?nation=${regionalWA[i]}&q=endorsements+name`, {
                headers: {
                    'User-Agent': main
                }
            });
            const text = await response.text();
            const xml = parser.parse(text)
            const endorsers = String(xml.NATION.ENDORSEMENTS).includes(',') ? xml.NATION.ENDORSEMENTS.split(',') : [xml.NATION.ENDORSEMENTS];
			if (limit) {
				if (endorsers.length < limit && !endorsers.includes(endotartnation.toLowerCase().replaceAll(' ', '_')) && regionalWA[i] !== endotartnation.toLowerCase().replaceAll(' ', '_')) {
					progress += `<p class="text-green-400">${i}/${regionalWA.length} <a class="underline" href="https://nationstates.net/nation=${regionalWA[i]}"}>${regionalWA[i]}</a> is not being endorsed by ${endotartnation}.</p>`
				} else if (endorsers.length > limit) {
					progress += `<p class="text-red-400 font-extralight text-xs">${i}/${regionalWA.length} <a class="underline" href="https://nationstates.net/nation=${regionalWA[i]}"}>${regionalWA[i]}</a> has more than ${limit} endorsements.</p>`
				} else {
					progress += `<p class="text-red-400 font-extralight text-xs">${i}/${regionalWA.length} <a class="underline" href="https://nationstates.net/nation=${regionalWA[i]}"}>${regionalWA[i]}</a> is already endorsed by ${endotartnation}.</p>`
				}
			} else {
				if (!endorsers.includes(endotartnation.toLowerCase().replaceAll(' ', '_')) && regionalWA[i] !== endotartnation.toLowerCase().replaceAll(' ', '_')) {
					progress += `<p class="text-green-400">${i}/${regionalWA.length} <a class="underline" href="https://nationstates.net/nation=${regionalWA[i]}"}>${regionalWA[i]}</a> is not being endorsed by ${endotartnation}.</p>`
				} else {
					progress += `<p class="text-red-400 font-extralight text-xs">${i}/${regionalWA.length} <a class="underline" href="https://nationstates.net/nation=${regionalWA[i]}"}>${regionalWA[i]}</a> is already endorsed by ${endotartnation}.</p>`
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
	<form on:submit|preventDefault={() => findWA(endotartnation)} class="flex flex-col gap-8">
		<Input text="User Agent" bind:bindValue={main} forValue="main" required={true} />
		<Input text="Endotart Nation" bind:bindValue={endotartnation} forValue="endotartnation" required={true} />
		<Input text="Endorse Limit" bind:bindValue={limit} forValue="limit" required={false} />
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
