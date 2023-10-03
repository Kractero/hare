<script lang="ts">
	import { handleDownload } from '$lib/download';
	import { nsIterator } from '$lib/txtIterator';
	import { onMount } from 'svelte';
	import Head from '$lib/component/Head.svelte';
	import { loadLocalStorage } from '$lib/loadLocalStorage';
	import Terminal from '$lib/component/Terminal.svelte';
	import Buttons from '$lib/component/Buttons.svelte';
	let progress = "";
	let puppets = '';
	let content: Array<string>;
	let downloadable = false;
	onMount(() => ({puppets} = loadLocalStorage(["stationPuppets"])));

	async function containerise(puppets: string) {
		downloadable = false;
		content = (await nsIterator(puppets, 'Container Rules')) as Array<string>;
		progress = `<p>Finished processing</p>`;
		progress += `<p>NATION RULES</p>`
		progress += content[0]
		progress += `<p>CONTAINER RULES</p>`
		progress += content[1]
		downloadable = true;
	}
</script>

<Head title={"Hare - Container Rules"} description={"Generate containerise rules."} />

<h1 class="text-4xl mb-2">Containerise Rules</h1>
<p class="mb-2">Generate containerise rules.</p>
<p class="mb-16 text-xs">
	SHILL: This is unnecessary if you use my
	<a
		class="underline"
		href="https://addons.mozilla.org/en-US/firefox/addon/cardtainers/"
		rel="noreferrer noopener"
		target="_blank"
	>
		Cardtainers
	</a>
	add-on, which will automatically create rules that match nations, whether you prefer container or nation.
</p>

<div class="lg:w-[1024px] lg:max-w-5xl flex flex-col lg:flex-row gap-8 break-normal">
	<form on:submit|preventDefault={() => containerise(puppets)} class="flex flex-col gap-8">
		<div class="flex gap-4 justify-between max-w-lg">
			<label class="w-24" for="pup">Puppets</label>
			<textarea
				required
				id="pup"
				rows="10"
				bind:value={puppets}
				class="text-black p-1 w-96 rounded-md border border-black dark:border-none"
			/>
		</div>
		<Buttons>
			<button disabled={!downloadable} on:click={() => handleDownload('txt', content, '')}
				class="bg-green-500 rounded-md px-4 py-2 transition duration-300 hover:bg-green-300 disabled:opacity-20 disabled:hover:bg-green-500">
				Download
			</button>
		</Buttons>
	</form>
	<Terminal bind:progress={progress} />
</div>
