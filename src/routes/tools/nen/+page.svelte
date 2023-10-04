<script lang="ts">
	import { onMount } from 'svelte';
	import { parser, sleep } from '$lib/globals';
	import Head from '$lib/component/Head.svelte';
	import { loadLocalStorage } from '$lib/loadLocalStorage';
	import Buttons from '$lib/component/Buttons.svelte';
	import Input from '$lib/component/Input.svelte';
	import Terminal from '$lib/component/Terminal.svelte';
	let progress = "";
	let main = '';
	let nennation = '';

	onMount(() => ({main, nennation} = loadLocalStorage(["stationMain", "stationNENNation"])));

	async function findWA() {
		progress = '';
		const response = await fetch(`https://www.nationstates.net/cgi-bin/api.cgi?nation=${nennation}&q=endorsements+region+wa`, {
			headers: {
				'User-Agent': main
			}
		});
        const text = await response.text();
        const xml = parser.parse(text)
        if (xml.NATION.UNSTATUS === "Non-member") {
            progress += `<p class="text-red-400">${nennation} is not in the WA.</p>`
			return;
        }
		await sleep(700);
		progress += `<p">Searching for the nations in ${xml.NATION.REGION} not endorsing ${nennation}</p>`
        const wamems = await fetch(`https://www.nationstates.net/cgi-bin/api.cgi?region=${xml.NATION.REGION}&q=wanations`)
		const text2 = await wamems.text();
		const xml2 = parser.parse(text2);
        const mainEndorsers = xml.NATION.ENDORSEMENTS.split(',');
    	xml2.REGION.UNNATIONS.split(',').filter((member: string) => !mainEndorsers.includes(member) && member !== nennation.toLowerCase().replace(' ', '_')).forEach((member: string) => {
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
	<form on:submit|preventDefault={() => findWA()} class="flex flex-col gap-8">
		<Input text={`User Agent`} bind:bindValue={main} forValue="main" required={true} />
		<Input text={`Nation to Check`} bind:bindValue={nennation} forValue="nennation" required={true} />
		<Buttons />
	</form>
	<Terminal bind:progress={progress} />
</div>
