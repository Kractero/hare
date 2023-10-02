<script lang="ts">
	import { onMount } from 'svelte';
	import InputCredentials from '$lib/component/InputCredentials.svelte';
	import { parser } from '$lib/globals';
	import Head from '$lib/component/Head.svelte';
	let progress: Array<string> = [];
	let puppets = '';
	let main = '';
	let content: string;
	onMount(() => {
		puppets = localStorage.getItem('stationPuppets') || '';
		main = localStorage.getItem('stationMain') || '';
	});
	async function findWA(main: string, puppets: string) {
		const puppetsList = puppets.split('\n');
		const response = await fetch(`https://www.nationstates.net/cgi-bin/api.cgi?wa=1&q=members`, {
			headers: {
				'User-Agent': main
			}
		});
		const text = await response.text();
		const xml = parser.parse(text);
		const members = xml.WA.MEMBERS.split(',');
		for (let i = 0; i < puppetsList.length; i++) {
			if (members.includes(puppetsList[i].toLowerCase().replace(' ', '_'))) {
				content = puppetsList[i];
			}
		}
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
        {#if content}
			<p>I found your WA on <a href={`https://nationstates.net/nation=${content}`}>{content}</a
				>.</p>
		{/if}
    </pre>
</div>
