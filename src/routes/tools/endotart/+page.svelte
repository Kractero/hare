<script lang="ts">
	import { onMount } from 'svelte';
	import { parser, sleep } from '$lib/globals';
	import Head from '$lib/component/Head.svelte';
	let progress: string[] = [];
	let main = '';
	let limit = 0;
    onMount(() => {
		limit = Number(localStorage.getItem('stationEndotartLimit')) || 0;
		main = localStorage.getItem('stationEndotartNation') || '';
	});
	async function findWA(main: string) {
        const regionresponse = await fetch(`https://www.nationstates.net/cgi-bin/api.cgi?nation=${main}&q=endorsements+region+wa`, {
			headers: {
				'User-Agent': main
			}
		});
        const regiontext = await regionresponse.text();
        const regionalXML = parser.parse(regiontext)
        if (regionalXML.NATION.UNSTATUS === "Non-member") {
            progress = [`${main} is not in the WA.`]
			return;
        }
        await sleep(700)
        progress = [...progress, `Searching for the nations in ${regionalXML.NATION.REGION} not being endorsed by ${main}`]
        const wamems = await fetch(`https://www.nationstates.net/cgi-bin/api.cgi?region=${regionalXML.NATION.REGION}&q=wanations`)
		const text2 = await wamems.text();
		const xml2 = parser.parse(text2);
        const regionalWA = xml2.REGION.UNNATIONS.split(',')
        for (let i = 0; i < regionalWA.length; i++) {
            await sleep(700);
            const response = await fetch(`https://www.nationstates.net/cgi-bin/api.cgi?nation=${regionalWA[i]}&q=endorsements+name`, {
                headers: {
                    'User-Agent': main
                }
            });
            const text = await response.text();
            const xml = parser.parse(text)
            const endorsers = xml.NATION.ENDORSEMENTS.split(',');
            if (endorsers.length < limit && !endorsers.includes(main.toLowerCase().replaceAll(' ', '_')) && regionalWA[i] !== main.toLowerCase().replaceAll(' ', '_')) {
                progress = [...progress, regionalWA[i]]
            }
            await sleep(700);
        }
	}
</script>

<Head title={"Hare - Endotarting"} description={"Specify a nation and get all the regionmates they are not endorsing."} />

<h1 class="text-4xl mb-2">Endotarting</h1>
<p class="text-xs mb-4">
	A <a href="https://github.com/nsupc/UPC-3PO" target="_blank" rel="noreferrer noopener">UPC-3PO</a> command rewritten in JavaScript by Kractero
<p class="mb-16">Specify a nation and get all the regionmates they are not endorsing.</p>

<div class="lg:w-[1024px] lg:max-w-5xl flex flex-col lg:flex-row gap-8 break-normal">
	<form on:submit|preventDefault={() => findWA(main)} class="flex flex-col gap-8">
		<div class="flex gap-4 justify-between max-w-lg">
			<label class="w-24" for="main">Nation</label>
			<input
				required
				id="main"
				bind:value={main}
				class="text-right text-black p-1 max-w-xs rounded-md border border-black dark:border-none"
			/>
		</div>
		<div class="flex gap-4 justify-between max-w-lg">
			<label class="w-24" for="limit">Endorse Limit</label>
			<input
				required
				id="limit"
				bind:value={limit}
				class="text-right text-black p-1 max-w-xs rounded-md border border-black dark:border-none"
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
                {#if member.includes("Searching for the nations in")}
                    <p>{member}</p>
                {:else}
                    <p><a class="underline" href={`https://nationstates.net/nation=${member}`}>{member}</a> is not being endorsed by {main}.</p>
                {/if}
            {/each}
		{/if}
    </pre>
</div>
