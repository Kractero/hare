<script lang="ts">
	import { handleDownload } from '$lib/download';
	import { htmlContent } from '$lib/htmlContent';
	import { nsIterator } from '$lib/txtIterator';
	import { onMount } from 'svelte';
	import InputCredentials from '$lib/component/InputCredentials.svelte';
	import Terminal from '$lib/component/Terminal.svelte';
	import Head from '$lib/component/Head.svelte';
	import { loadLocalStorage } from '$lib/loadLocalStorage';
	import Buttons from '$lib/component/Buttons.svelte';
	let progress = "";
	let puppets = '';
	let main = '';
	let content: string;
	let downloadable = false;
	onMount(() => ({puppets, main} = loadLocalStorage(["stationPuppets", "stationMain"])));
	async function login(puppets: string) {
		downloadable = false;
		content = (await nsIterator(puppets, 'Creator', main)) as string;
		progress = "<p>Finished processing</p>"
		downloadable = true;
	}
</script>

<Head title={"Hare - Creator Assitant"} description={"Generate a sheet that has links for nation creation that works with the provided userscripts."} />

<h1 class="text-4xl mb-2">Creator Assistant</h1>
<p class="text-xs mb-1">
	<a class="underline" href="https://github.com/Kractero/cards-utilities/tree/main/creation_assistant" target="_blank" rel="noreferrer noopener">
		Original by Kractero
	</a>
</p>
<p class="text-xs mb-4">
	For optimal use, this script is intended to be used with
	<a class="underline" href="https://github.com/Kractero/cards-utilities/blob/main/creation_assistant/creator.user.js" target="_blank" rel="noreferrer noopener">
		creator
	</a> which does require configuration which you can read about in the repository.
</p>
<p class="mb-16">Generate a sheet that has links for nation creation that works with the provided userscripts.</p>

<div class="lg:w-[1024px] lg:max-w-5xl flex flex-col lg:flex-row gap-8 break-normal">
	<form on:submit|preventDefault={() => login(puppets)} class="flex flex-col gap-8">
		<InputCredentials bind:main bind:puppets authenticated={false} />
		<Buttons>
			<button disabled={!downloadable} on:click={() => handleDownload('html', htmlContent(content), 'Creator')}
				class="bg-green-500 rounded-md px-4 py-2 transition duration-300 hover:bg-green-300 disabled:opacity-20 disabled:hover:bg-green-500">
				Download
			</button>
		</Buttons>
	</form>
	<Terminal bind:progress={progress} />
</div>
