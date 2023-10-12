<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { parseXML, sleep } from '$lib/globals';
	import Head from '$lib/component/Head.svelte';
	import { loadLocalStorage } from '$lib/loadLocalStorage';
	import Buttons from '$lib/component/Buttons.svelte';
	import Input from '$lib/component/Input.svelte';
	import Terminal from '$lib/component/Terminal.svelte';
	import type { Census, Nation } from '$lib/types';
	import Textarea from '$lib/component/Textarea.svelte';
	import type { PageData } from './$types';
	import { loadStorage } from '$lib/loadStorage';
	import { pushHistory } from '$lib/helpers/utils';
	export let data: PageData;
	const abortController = new AbortController();
	let progress = '';
	let stoppable = false;
	let stopped = false;
	let main = '';
	let top = "100";
	let days = "30";
	let specific = '';
	onMount(() => {
		main = data.parameters.main || loadStorage("useragent") as string || "";
		top = data.parameters.top || loadStorage("rocTop") as string || "100";
		days = data.parameters.days || loadStorage("rocDays") as string || "30";
		specific = loadStorage("rocSpecific") as string || "";
	});

	async function rateOfChange(main: string) {
		pushHistory(`?main=${main}&top=${top}&days=${days}`)
		stopped = false;
		stoppable = true;
		let names: any[] = [];
		type rocTuple = [string, number];
		let ratesOfChange: Array<rocTuple> = [];
		progress = '';
		if (!specific) {
			for (let i = 0; i < Math.ceil(Number(top) / 20); i++) {
				let start = 1 + i * 20;
				if (abortController.signal.aborted) {
					break;
				}
				const xml: Census = await parseXML(`https://www.nationstates.net/cgi-bin/api.cgi?q=censusranks&scale=86&start=${start}`, main);
				names = names.concat(xml.WORLD.CENSUSRANKS.NATIONS.NATION.map(nation => nation.NAME));
				await sleep(700);
			}
			names = names.slice(0, Number(top));
		} else {
			names = specific.split('\n')
		}
		const currentTimestamp = Math.floor(Date.now() / 1000);
		const fromTimestamp = currentTimestamp - Number(days) * 24 * 60 * 60;
		for (let j = 0; j < names.length; j++) {
			const nation = names[j];
			if (abortController.signal.aborted || stopped) {
				break;
			}
			progress += `<p>Evaluating ${nation}, ${j+1}/${names.length}</p>`;
			const xml: Nation = await parseXML(`https://www.nationstates.net/cgi-bin/api.cgi?nation=${nation};q=census;scale=86;mode=history;from=${fromTimestamp}`, main);
			const point = xml.NATION.CENSUS.SCALE.POINT;
			if (Array.isArray(point)) {
				const timestamps = point.map((point) => Number(point.TIMESTAMP));
				const scores = point.map((point) => Number(point.SCORE));
				const [maxTimestamp, minTimestamp] = [Math.max(...timestamps), Math.min(...timestamps)];
				const [maxScore, minScore] = [scores[timestamps.indexOf(maxTimestamp)], scores[timestamps.indexOf(minTimestamp)]];
				const rateOfChange = ((maxScore - minScore) / Number(days)).toFixed(2);
				ratesOfChange.push([nation, Number(rateOfChange)]);
			} else {
				ratesOfChange.push([nation, Number(point.SCORE)]);
			}
			await sleep(700);
		}
		const fallers = ratesOfChange.slice().sort((a, b) => a[1] - b[1]);
		const risers = ratesOfChange.slice().sort((a, b) => b[1] - a[1]);
		progress = ""
		progress += `<p class="font-bold">${specific ? "Specific nations" : `TOP ${names.length}`} over ${days} days</p>`;
		for (let i = 0; i < ratesOfChange.length; i++) {
			progress += `<p>${i + 1}/${ratesOfChange.length} ${ratesOfChange[i][0]} | Rate of Change: ${ratesOfChange[i][1]}</p>`;
		}
		progress += "\n"
		if (names.length > 1) {
			progress += `<p class="font-bold">Fastest growing of the ${specific ? "specified nations" : `top ${names.length}`}</p>`;
			for (let i = 0; i < risers.length; i++) {
				progress += `<p>${i + 1}/${risers.length} ${risers[i][0]} | Rate of Change: ${risers[i][1]}</p>`;
			}
			progress += "\n"
			progress += `<p class="font-bold">Slowest growing of the ${specific ? "specified nations" : `top ${names.length}`}</p>`;
			for (let i = 0; i < fallers.length; i++) {
				progress += `<p>${i + 1}/${fallers.length} ${fallers[i][0]} | Rate of Change: ${fallers[i][1]}</p>`;
			}
		}
		stoppable = false;
	}
</script>

<Head title={"Hare - Rate of Change"} description={"Calculate the rate of change in deck value for the top X NS players, over X days."} />

<h1 class="text-4xl mb-2">Rate of Change</h1>
<p class="text-xs mb-2">
	<a class="underline" href="https://github.com/Thorn1000/NS-RoC" target="_blank" rel="noreferrer noopener">
		Original by Thorn1000
	</a>, rewritten in JS for browser use by Kractero</p>
<p class="mb-1">
	Calculate the rate of change in deck value for the top X NS players, over X days.
</p>
<p class="text-xs mb-16">
	Specific indicates to search for specific nation's RoC, and is enabled only when top is empty.
</p>

<div class="lg:w-[1024px] lg:max-w-5xl flex flex-col lg:flex-row gap-8 break-normal">
	<form on:submit|preventDefault={() => rateOfChange(main)} class="flex flex-col gap-8">
		<Input text={`User Agent`} bind:bindValue={main} forValue="main" required={true} />
		<Input text={`Top ${top}`} bind:bindValue={top} forValue="top" required={true} disabled={specific !== ""} />
		<Textarea text="Specific" bind:bindValue={specific} forValue="specific" required disabled={top !== ""} />
		<Input text={`Over ${days} days`} bind:bindValue={days} forValue="days" required={true} />
		<Buttons>
			<button
				type="button"
				disabled={!stoppable}
				on:click={() => { 
					stopped = true;
					stoppable = false; 
				}}
				class="bg-red-500 rounded-md px-4 py-2 transition duration-300 hover:bg-red-300 disabled:opacity-20 disabled:hover:bg-red-500"
			>
				Stop
			</button>
		</Buttons>
	</form>
	<Terminal bind:progress={progress} />
</div>
