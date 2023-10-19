<script lang="ts">
	import { handleDownload } from '$lib/helpers/download';
	import { htmlContent } from '$lib/helpers/htmlContent';
	import { nsIterator } from '$lib/helpers/txtIterator';
	import { onMount } from 'svelte';
	import InputCredentials from '$lib/component/InputCredentials.svelte';
	import Terminal from '$lib/component/Terminal.svelte';
	import Head from '$lib/component/Head.svelte';
	import Buttons from '$lib/component/Buttons.svelte';
	import type { PageData } from './$types';
	import { pushHistory } from '$lib/helpers/utils';
	export let data: PageData;
	let progress = '';
	let puppets = '';
	let main = '';
	let content: string;
	let downloadable = false;
	onMount(() => { main = data.parameters.main || localStorage.getItem("main") as string || ""; });
	async function login(puppets: string) {
		pushHistory(`?main=${main}`)
		downloadable = false;
		content = (await nsIterator(puppets, 'Login Sheet', main)) as string;
		progress = `<p>Finished processing!</p>`;
		downloadable = true;
	}
</script>

<Head title={"Hare - Login Sheet"} description={"Generate links to help you quickly log back into containers."} />

<h1 class="text-4xl mb-2">Login Sheet</h1>
<p class="text-xs mb-1">
	<a class="underline" href="https://github.com/Kractero/cards-utilities/tree/main/log_into_containers" target="_blank" rel="noreferrer noopener">
		Original by Kractero
	</a>
</p>
<p class="text-xs mb-4">
	For optimal use, this script is intended to be used with
	<a class="underline" href="https://github.com/Kractero/cards-utilities/raw/main/log_into_containers/autologautoclose.user.js" target="_blank" rel="noreferrer noopener">
		autocloser
	</a> and
	<a class="underline" href="https://github.com/Kractero/cards-utilities/blob/main/log_into_containers/autolog.user.js" target="_blank" rel="noreferrer noopener">
		autolog
	</a> which does require configuration which you can read about in the repository.
</p>
<p class="mb-16">Generate links to help you quickly log back into containers.</p>

<div class="lg:w-[1024px] lg:max-w-5xl flex flex-col lg:flex-row gap-8 break-normal">
	<form on:submit|preventDefault={() => login(puppets)} class="flex flex-col gap-8">
		<InputCredentials bind:main bind:puppets authenticated={false} />
		<Buttons>
			<button disabled={!downloadable} type="button" on:click={() => handleDownload('html', htmlContent(content), 'Login Sheet')}
				class="bg-green-500 rounded-md px-4 py-2 transition duration-300 hover:bg-green-300 disabled:opacity-20 disabled:hover:bg-green-500">
				Download
			</button>
		</Buttons>
	</form>
	<Terminal bind:progress={progress} />
</div>
