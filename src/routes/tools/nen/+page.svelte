<script lang="ts">
	import { onMount } from 'svelte';
	import { parser, sleep } from '$lib/globals';
	import Head from '$lib/component/Head.svelte';
	let progress: string[] = [];
	let main = '';
	onMount(() => {
		main = localStorage.getItem('stationEndotartNENNation') || '';
	});
	async function findWA(main: string) {
		const response = await fetch(`https://www.nationstates.net/cgi-bin/api.cgi?nation=${main}&q=endorsements+region+wa`, {
			headers: {
				'User-Agent': main
			}
		});
        const text = await response.text();
        const xml = parser.parse(text)
        if (xml.NATION.UNSTATUS === "Non-member") {
            progress = [`${main} is not in the WA.`]
			return;
        }
		await sleep(700);
		progress = [...progress, `Searching for the nations in ${xml.NATION.REGION} not endorseding ${main}`]
        const wamems = await fetch(`https://www.nationstates.net/cgi-bin/api.cgi?region=${xml.NATION.REGION}&q=wanations`)
		const text2 = await wamems.text();
		const xml2 = parser.parse(text2);
        const mainEndorsers = xml.NATION.ENDORSEMENTS.split(',');
        progress = xml2.REGION.UNNATIONS.split(',').filter((member: string) => !mainEndorsers.includes(member) && member !== main.toLowerCase().replace(' ', '_'));
	}
</script>

<Head title={"Hare - Not Endorsing Nations"} description={"Specify a nation and get all the regionmates not endorsing them."} />

<h1 class="text-4xl mb-2">Not Endorsing Nation</h1>
<p class="text-xs mb-4">
	A UPC-3PO command rewritten in JavaScript by Kractero
<p class="mb-16">Specify a nation and get all the regionmates not endorsing them.</p>

<div class="lg:w-[1024px] lg:max-w-5xl flex flex-col lg:flex-row gap-8 break-normal">
	<form on:submit|preventDefault={() => findWA(main)} class="flex flex-col gap-8">
		<div class="flex gap-4 justify-between max-w-lg">
			<label class="w-24" for="main">Nation</label>
			<input
				required
				id="main"
				bind:value={main}
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
        {#if progress}
			{#each progress as member}
                {#if member.includes("Searching for the nations in") || !member.includes("is not in the WA")}
                    <p>{member}</p>
                {:else}
					<p><a class="underline" href={`https://nationstates.net/nation=${member}`}>{member}</a> is not endorsing {main}.</p>
                {/if}
            {/each}
		{/if}
    </pre>
</div>
