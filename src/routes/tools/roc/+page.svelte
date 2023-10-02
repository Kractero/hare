<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { parser, sleep } from '$lib/globals';
	import Head from '$lib/component/Head.svelte';
	const abortController = new AbortController();
	let progress: Array<string> = [];
	let main = '';
	let top = 100;
	let days = 30;
	let content = '';
	onMount(() => {
		main = localStorage.getItem('stationMain') || '';
		top = Number(localStorage.getItem('stationTop')) || 100;
		days = Number(localStorage.getItem('stationDays')) || 30;
	});

	onDestroy(() => abortController.abort());
	async function rateOfChange(main: string) {
		let names = [];
		let ratesOfChange = [];
		for (let i = 0; i < top / 20; i++) {
			let start = 1 + i * 20;
			if (abortController.signal.aborted) {
				break;
			}
			const response = await fetch(
				`https://www.nationstates.net/cgi-bin/api.cgi?q=censusranks&scale=86&start=${start}`,
				{
					headers: {
						'User-Agent': main
					}
				}
			);
			const text = await response.text();
			const xml = parser.parse(text);
			names = xml.WORLD.CENSUSRANKS.NATIONS.NATION.map((nation: { NAME: string }) => nation.NAME);
			await sleep(700);
		}
		names = names.slice(0, top);
		const currentTimestamp = Math.floor(Date.now() / 1000);
		const fromTimestamp = currentTimestamp - days * 24 * 60 * 60;
		for (let i = 0; i < names.length; i++) {
			const nation = names[i];
			if (abortController.signal.aborted) {
				break;
			}
			progress = [...progress, `Evaluating ${nation}, ${i + 1}/${names.length}`];
			const response = await fetch(
				`https://www.nationstates.net/cgi-bin/api.cgi?nation=${nation};q=census;scale=86;mode=history;from=${fromTimestamp}`,
				{
					headers: {
						'User-Agent': main
					}
				}
			);
			const text = await response.text();
			const xml = parser.parse(text);
			const point = xml.NATION.CENSUS.SCALE.POINT;
			if (Array.isArray(point)) {
				const timestamps = point.map((point) => point.TIMESTAMP);
				const scores = point.map((point) => point.SCORE);
				const maxTimestamp = Math.max(...timestamps);
				const minTimestamp = Math.min(...timestamps);
				const maxScore = scores[timestamps.indexOf(maxTimestamp)];
				const minScore = scores[timestamps.indexOf(minTimestamp)];
				const rateOfChange = ((maxScore - minScore) / days).toFixed(2);
				ratesOfChange.push([nation, rateOfChange]);
			} else {
				ratesOfChange.push([nation, point.SCORE]);
			}
			await sleep(700);
		}
		const fallers = ratesOfChange.slice().sort((a, b) => a[1] - b[1]);
		const risers = ratesOfChange.slice().sort((a, b) => b[1] - a[1]);
		content += `TOP ${top} over ${days} days\n`;
		content += `---------------------------\n`;
		for (let i = 0; i < ratesOfChange.length; i++) {
			content += `${i + 1}/${names.length} ${ratesOfChange[i][0]} | Rate of Change: ${
				ratesOfChange[i][1]
			}\n`;
		}
		content += `---------------------------\n`;
		content += `Fastest Growing of the top ${top}\n`;
		content += `---------------------------\n`;
		for (let i = 0; i < fallers.length; i++) {
			content += `${i + 1}/${names.length} ${fallers[i][0]} | Rate of Change: ${fallers[i][1]}\n`;
		}
		content += `---------------------------\n`;
		content += `Declining of the top ${top}\n`;
		content += `---------------------------\n`;
		for (let i = 0; i < risers.length; i++) {
			content += `${i + 1}/${names.length} ${risers[i][0]} | Rate of Change: ${risers[i][1]}\n`;
		}
	}
</script>

<Head title={"Hare - Rate of Change"} description={"Calculate the rate of change in deck value for the top X NS players, over X days."} />

<h1 class="text-4xl mb-2">Rate of Change</h1>
<p class="text-xs mb-2">
	<a class="underline" href="https://github.com/Thorn1000/NS-RoC" target="_blank" rel="noreferrer noopener">
		Original by Thorn1000
	</a>, rewritten in JS for browser use by Kractero</p>
<p class="mb-16">
	Calculate the rate of change in deck value for the top X NS players, over X days.
</p>

<div class="lg:w-[1024px] lg:max-w-5xl flex flex-col lg:flex-row gap-8 break-normal">
	<form on:submit|preventDefault={() => rateOfChange(main)} class="flex flex-col gap-8">
		<div class="flex gap-4 justify-between max-w-lg">
			<label class="w-24" for="main">User Agent</label>
			<input
				required
				id="main"
				bind:value={main}
				class="text-black p-1 max-w-xs rounded-md border border-black dark:border-none"
			/>
		</div>
		<div class="flex gap-4 justify-between max-w-lg">
			<label class="w-24" for="main">Top {top}</label>
			<input
				required
				id="main"
				bind:value={top}
				class="text-black p-1 max-w-xs rounded-md border border-black dark:border-none"
			/>
		</div>
		<div class="flex gap-4 justify-between max-w-lg">
			<label class="w-24" for="main">Over {days} Days</label>
			<input
				required
				id="main"
				bind:value={days}
				class="text-black p-1 max-w-xs rounded-md border border-black dark:border-none"
			/>
		</div>
		<div class="max-w-lg flex justify-center">
			<button
				type="submit"
				class="bg-green-500 rounded-md px-4 py-2 transition duration-300 hover:bg-green-300"
			>
				Start
			</button>
		</div>
	</form>
	<pre
		class="flex-1 p-2 whitespace-pre-wrap bg-black dark:bg-gray-50 text-white dark:text-black font-medium font-mono inline-block">
        {#if progress && progress[0]}
			{#each progress as update}
				<p>{update}</p>
			{/each}
            {content}
		{/if}
    </pre>
</div>
