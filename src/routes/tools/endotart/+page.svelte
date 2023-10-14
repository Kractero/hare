<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { parseXML, parser, sleep } from '$lib/globals';
	import Head from '$lib/component/Head.svelte';
	import { loadLocalStorage } from '$lib/loadLocalStorage';
	import Terminal from '$lib/component/Terminal.svelte';
	import Buttons from '$lib/component/Buttons.svelte';
	import Input from '$lib/component/Input.svelte';
	import Textarea from '$lib/component/Textarea.svelte';
	import type { NSNation, Nation, Region } from '$lib/types';
	import Select from '$lib/component/Select.svelte';
	const abortController = new AbortController();
	let progress = "";
	let main = "";
	let endotartnation = '';
	let stopped = false;
	let stoppable = false;
	let immune = "";
	let endotartsource = "XML";
	let limit: number | undefined = undefined;
	onMount(() => ({ main, endotartnation, limit, endotartsource } = loadLocalStorage(["stationMain", "stationEndotartNation", "stationEndotartLimit", "stationEndotartSource"])));
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

        progress += `<p>Searching for the nations in ${regionalXML.NATION.REGION} not being endorsed by ${endotartnation}, using the ${endotartsource}</p>`
        const wamems: Region = await parseXML(`https://www.nationstates.net/cgi-bin/api.cgi?region=${regionalXML.NATION.REGION}&q=wanations`, main)
        const regionalWA = wamems.REGION.UNNATIONS.split(',')
		let xml;
		let NAME;
		let ENDORSEMENTS;

		if (endotartsource === "XML") {
			const currentDate = new Date();
			const utcMinus7Date = new Date(currentDate.getTime() - 7 * 60 * 60 * 1000);
			utcMinus7Date.setDate(utcMinus7Date.getDate() - 1);
			const date = utcMinus7Date.toISOString().slice(0, 10);
			progress += `<p>Requesting ${date} national dump.</p>`
			const nationRes = await fetch(`https://raw.githubusercontent.com/Kractero/region-dump-xml/main/data/${date}-Nations.xml`, {
				method: "GET"
			});
			if (nationRes.status === 404) {
				progress += `<p>Could not find ${date} national dump, defaulting to the API.</p>`
				endotartsource = "API";
			} else {
				const regionText = await nationRes.text()
				xml = parser.parse(regionText)
				progress += `<p>Found ${date} national dump.</p>`
			}
		}

        for (let i = 0; i < regionalWA.length; i++) {
			if (abortController.signal.aborted || stopped) {
				break;
			}

			if (endotartsource === "API") {
				await sleep(700);
				xml = await parseXML(`https://www.nationstates.net/cgi-bin/api.cgi?nation=${regionalWA[i]}&q=endorsements+name`, main) as Nation
				NAME = String(xml.NATION.NAME);
				ENDORSEMENTS = String(xml.NATION.ENDORSEMENTS).includes(',') ? xml.NATION.ENDORSEMENTS.split(',') : [xml.NATION.ENDORSEMENTS];
				await sleep(700);
			} else {
				const nations = (xml.NATIONS.NATION as Array<NSNation>).filter(nation => String(nation.NAME).toLowerCase().replace(/ /g, '_') === (regionalWA[i].toLowerCase()));
				if (nations.length > 0) {
					({ NAME, ENDORSEMENTS } = nations[0])
				} else {
					progress += `<p class="text-yellow-400">${i+1}/${regionalWA.length} ${regionalWA[i]} not found, likely not in the dump yet`
				}
			}

			if (NAME && ENDORSEMENTS) {
				if (endotartnation.toLowerCase().replaceAll(' ', '_') === String(NAME).toLowerCase().replaceAll(' ', '_')) {
					progress += `<p class="text-yellow-400 font-extralight">${i+1}/${regionalWA.length} <a class="underline" href="https://nationstates.net/nation=${regionalWA[i]}"}>${regionalWA[i]}</a> is the endotart nation.</p>`
				} else if (limit) {
					if (whiteList.includes(regionalWA[i])) {
						progress += `<p class="text-yellow-400 font-extralight">${i+1}/${regionalWA.length} <a class="underline" href="https://nationstates.net/nation=${regionalWA[i]}"}>${regionalWA[i]}</a> is in your immune nations.</p>`
					} else if (ENDORSEMENTS.length < limit && !ENDORSEMENTS.includes(endotartnation.toLowerCase().replaceAll(' ', '_')) && regionalWA[i] !== endotartnation.toLowerCase().replaceAll(' ', '_')) {
						progress += `<p class="text-green-400">${i+1}/${regionalWA.length} <a class="underline" href="https://nationstates.net/nation=${regionalWA[i]}"}>${regionalWA[i]}</a> is not being endorsed by ${endotartnation}.</p>`
					} else if (ENDORSEMENTS.length > limit) {
						progress += `<p class="text-red-400 font-extralight">${i+1}/${regionalWA.length} <a class="underline" href="https://nationstates.net/nation=${regionalWA[i]}"}>${regionalWA[i]}</a> has more than ${limit} endorsements.</p>`
					} else {
						progress += `<p class="text-red-400 font-extralight">${i+1}/${regionalWA.length} <a class="underline" href="https://nationstates.net/nation=${regionalWA[i]}"}>${regionalWA[i]}</a> is already endorsed by ${endotartnation}.</p>`
					}
				} else {
					if (!ENDORSEMENTS.includes(endotartnation.toLowerCase().replaceAll(' ', '_')) && regionalWA[i] !== endotartnation.toLowerCase().replaceAll(' ', '_')) {
						progress += `<p class="text-green-400">${i+1}/${regionalWA.length} <a class="underline" href="https://nationstates.net/nation=${regionalWA[i]}"}>${regionalWA[i]}</a> is not being endorsed by ${endotartnation}.</p>`
					} else {
						progress += `<p class="text-red-400 font-extralight">${i+1}/${regionalWA.length} <a class="underline" href="https://nationstates.net/nation=${regionalWA[i]}"}>${regionalWA[i]}</a> is already endorsed by ${endotartnation}.</p>`
					}
				}
			}
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
		<div class="flex gap-4 justify-between max-w-lg">
			<label class="w-24" for="mode">Source</label>
            <Select bind:mode={endotartsource} options={["XML", "API"]} />
		</div>
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
