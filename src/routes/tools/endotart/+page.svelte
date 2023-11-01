<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { parseXML, parser, sleep } from '$lib/helpers/utils';
	import Terminal from '$lib/component/Terminal.svelte';
	import Buttons from '$lib/component/Buttons.svelte';
	import Input from '$lib/component/Input.svelte';
	import Textarea from '$lib/component/Textarea.svelte';
	import type { NSNation, Nation, Region } from '$lib/types';
	import Select from '$lib/component/Select.svelte';
	const abortController = new AbortController();
	import type { PageData } from './$types';
	import { pushHistory } from '$lib/helpers/utils';
	import ToolContent from '$lib/component/ToolContent.svelte';
	export let data: PageData;
	let progress = "";
	let stopped = false;
	let stoppable = false;

	let source: string;
	let main: string;
	let endotarter: string;
	let immune: string;
	let limit: string;
	onMount(() => {
		main = data.parameters.main || localStorage.getItem("main") as string || "";
		endotarter = data.parameters.endotarter || localStorage.getItem("endotartEndotarter") as string || "";
		immune = data.parameters.immune ? data.parameters.immune.replaceAll(',', '\n') : localStorage.getItem("endotartImmune") as string || "";
		limit = data.parameters.limit || localStorage.getItem("endotartLimit") as string || "";
 		source = data.parameters.source || localStorage.getItem("endotartSource") as string || "XML";
	});
	onDestroy(() => abortController.abort() );
	async function endotart() {
		pushHistory(`?main=${main}${limit ? `&limit=${limit}` : ""}&nation=${endotarter}&source=${source}${immune ? `&immune=${immune.replaceAll('\n', ',')}` : ""}`);
		progress = "<p>Initiating Endotart...</p>";
		stoppable = true;
		stopped = false;
		const whiteList = immune ? immune.split('\n').map(nation => nation.toLowerCase().replace(' ', '_')) : [];

        const regionalXML: Nation = await parseXML(`https://www.nationstates.net/cgi-bin/api.cgi?nation=${endotarter}&q=endorsements+region+wa`, main)
		if (!regionalXML.NATION) progress += `<p class="text-red-400">Error finding ${endotarter}!</p>`
		if ((regionalXML as Nation).NATION.UNSTATUS === "Non-member") {
            progress += `<p class="text-red-400">${endotarter} is not in the WA.</p>`
			return;
        }
        await sleep(700)

        progress += `<p>Searching for the nations in ${regionalXML.NATION.REGION} not being endorsed by ${endotarter}, using the ${source}</p>`
		if (whiteList.length > 0) {
			progress += `<p>Nations immune to endocap: ${whiteList.map((region) => region.trim()).join(', ')}</p>`;
		}
		const wamems: Region = await parseXML(`https://www.nationstates.net/cgi-bin/api.cgi?region=${regionalXML.NATION.REGION}&q=wanations`, main)
        const regionalWA = wamems.REGION.UNNATIONS.split(',')
		let xml;
		let NAME;
		let ENDORSEMENTS;

		if (source === "XML") {
			const currentDate = new Date();
			const utcMinus7Date = new Date(currentDate.getTime() - 7 * 60 * 60 * 1000);
			utcMinus7Date.setDate(utcMinus7Date.getDate() - 1);
			const date = utcMinus7Date.toISOString().slice(0, 10);
			progress += `<p>Requesting ${date} national dump.</p>`
			const nationRes = await fetch(`https://raw.githubusercontent.com/Kractero/region-dump-xml/main/data/${date}-Nations.xml`, {
				method: "GET"
			});
			if (nationRes.status === 404) {
				progress += `<p class="text-yellow-400">Could not find ${date} national dump, defaulting to the API.</p>`
				source = "API";
			} else {
				progress += `<p class="text-green-400">Found ${date} national dump.</p>`
				progress += `<p>Parsing dump for endotarting...</p>`
				const regionText = await nationRes.text()
				xml = parser.parse(regionText)
			}
		}

        for (let i = 0; i < regionalWA.length; i++) {
			if (abortController.signal.aborted || stopped) {
				break;
			}

			if (source === "API") {
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
				if (endotarter.toLowerCase().replaceAll(' ', '_') === String(NAME).toLowerCase().replaceAll(' ', '_')) {
					progress += `<p class="text-yellow-400 font-extralight">${i+1}/${regionalWA.length} <a target="_blank" rel="noreferrer noopener" class="underline" href="https://nationstates.net/nation=${regionalWA[i]}"}>${regionalWA[i]}</a> is the endotart nation.</p>`
				} else if (limit) {
					if (whiteList.includes(regionalWA[i])) {
						progress += `<p class="text-yellow-400 font-extralight">${i+1}/${regionalWA.length} <a target="_blank" rel="noreferrer noopener" class="underline" href="https://nationstates.net/nation=${regionalWA[i]}"}>${regionalWA[i]}</a> is in your immune nations.</p>`
					} else if (ENDORSEMENTS.length < Number(limit) && !ENDORSEMENTS.includes(endotarter.toLowerCase().replaceAll(' ', '_')) && regionalWA[i] !== endotarter.toLowerCase().replaceAll(' ', '_')) {
						progress += `<p class="text-green-400">${i+1}/${regionalWA.length} <a target="_blank" rel="noreferrer noopener" class="underline" href="https://nationstates.net/nation=${regionalWA[i]}"}>${regionalWA[i]}</a> is not being endorsed by ${endotarter}.</p>`
					} else if (ENDORSEMENTS.length > Number(limit)) {
						progress += `<p class="text-red-400 font-extralight">${i+1}/${regionalWA.length} <a target="_blank" rel="noreferrer noopener" class="underline" href="https://nationstates.net/nation=${regionalWA[i]}"}>${regionalWA[i]}</a> has more than ${limit} endorsements.</p>`
					} else {
						progress += `<p class="text-red-400 font-extralight">${i+1}/${regionalWA.length} <a target="_blank" rel="noreferrer noopener" class="underline" href="https://nationstates.net/nation=${regionalWA[i]}"}>${regionalWA[i]}</a> is already endorsed by ${endotarter}.</p>`
					}
				} else {
					if (!ENDORSEMENTS.includes(endotarter.toLowerCase().replaceAll(' ', '_')) && regionalWA[i] !== endotarter.toLowerCase().replaceAll(' ', '_')) {
						progress += `<p class="text-green-400">${i+1}/${regionalWA.length} <a target="_blank" rel="noreferrer noopener" class="underline" href="https://nationstates.net/nation=${regionalWA[i]}"}>${regionalWA[i]}</a> is not being endorsed by ${endotarter}.</p>`
					} else {
						progress += `<p class="text-red-400 font-extralight">${i+1}/${regionalWA.length} <a target="_blank" rel="noreferrer noopener" class="underline" href="https://nationstates.net/nation=${regionalWA[i]}"}>${regionalWA[i]}</a> is already endorsed by ${endotarter}.</p>`
					}
				}
			}
        }
		progress += `<p>Finished searching ${regionalXML.NATION.REGION} for nations not being endorsed by ${endotarter}</p>`
		stoppable = false;
	}
</script>

<ToolContent toolTitle="Endotarting" caption="Specify a nation and get all the regionmates they are not endorsing."/>

<div class="lg:w-[1024px] lg:max-w-5xl flex flex-col lg:flex-row gap-8 break-normal">
	<form on:submit|preventDefault={endotart} class="flex flex-col gap-8">
		<Input text="User main" bind:bindValue={main} forValue="main" required={true} />
		<Input text="Endotart Nation" bind:bindValue={endotarter} forValue="endotarter" required={true} />
		<Input text="Endorse Limit" bind:bindValue={limit} forValue="limit" required={false} />
		<Select name="Source" bind:mode={source} options={["XML", "API"]} />
		<Textarea text="Immune Nations" bind:bindValue={immune} forValue="immune" />
		<Buttons stopButton={true} bind:stopped={stopped} bind:stoppable={stoppable} />
	</form>
	<Terminal bind:progress={progress} />
</div>