<script lang="ts">
	import { onMount } from 'svelte';
	import InputCredentials from '$lib/component/InputCredentials.svelte';
	import { parser } from '$lib/globals';
	import Head from '$lib/component/Head.svelte';
	import { loadLocalStorage } from '$lib/loadLocalStorage';
	import Buttons from '$lib/component/Buttons.svelte';
	import Terminal from '$lib/component/Terminal.svelte';
	let progress = "";
	let puppets = '';
	let main = '';
	onMount(() => ({puppets, main} = loadLocalStorage(["stationPuppets", "stationMain"])));
	async function findWA(main: string, puppets: string) {
		progress = '';
		const puppetsList = puppets.split('\n');
		const response = await fetch(`https://www.nationstates.net/cgi-bin/api.cgi?wa=1&q=members`, {
			headers: {
				'User-Agent': main
			}
		});
		const text = await response.text();
		const xml = parser.parse(text);
		const members = xml.WA.MEMBERS.split(',');
		puppetsList.forEach(puppet => {
			if (members.includes(puppet.toLowerCase().replace(' ', '_'))) {
				progress = `<p>I found your WA on <a href="https://nationstates.net/nation=${puppet}">${puppet}</a>.</p>`;
			}
		})
	}
</script>

<Head title={"Hare - Where's My WA"} description={"Specify your puppets and this script will find which one is in the WA."} />

<h1 class="text-4xl mb-2">Where's My WA</h1>
<p class="text-xs mb-4">
	<a class="underline" href="https://github.com/jmikk/WheresMyWA" target="_blank" rel="noreferrer noopener">
		Original by 9003
	</a>, rewritten in JS for browser use by Kractero</p>
<p class="mb-16">Specify your puppets and this script will find which one is in the WA.</p>

<div class="lg:w-[1024px] lg:max-w-5xl flex flex-col lg:flex-row gap-8 break-normal">
	<form on:submit|preventDefault={() => findWA(main, puppets)} class="flex flex-col gap-8">
		<InputCredentials bind:main bind:puppets authenticated={false} />
		<Buttons />
	</form>
	<Terminal bind:progress={progress} />
</div>
