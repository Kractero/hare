<script lang="ts">
	import { nsIterator } from '$lib/helpers/txtIterator';
	import Terminal from '$lib/component/Terminal.svelte';
	import Buttons from '$lib/component/Buttons.svelte';
	import Textarea from '$lib/component/Textarea.svelte';
	import ToolContent from '$lib/component/ToolContent.svelte';
	import Input from '$lib/component/Input.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { pushHistory } from '$lib/helpers/utils';
	let progress = "";
	let content: string;
	let downloadable = false;
	let puppets = '';
	let main = '';

	onMount(async () => {
		main = $page.url.searchParams.get('main') || localStorage.getItem("main") as string || "";
	});

	async function login(puppets: string) {
		pushHistory(`?main=${main}`);
		downloadable = false;
		content = (await nsIterator(puppets, 'Creator')) as string;
		progress = "<p>Finished processing</p>"
		downloadable = true;
	}
</script>

<ToolContent toolTitle="Creator Assistant" author="Kractero" link="https://github.com/Kractero/cards-utilities/tree/main/creation_assistant" caption="Generate a sheet that has links for nation creation that works with the provided userscripts." additional={`<p class="text-xs mb-16">
	For optimal use, this script is intended to be used with
	<a class="underline" href="https://github.com/Kractero/userscripts/raw/main/nationCreator.user.js" target="_blank" rel="noreferrer noopener">
		creator
	</a> which does require configuration which you can read about in the repository.
</p>`}/>

<div class="lg:w-[1024px] lg:max-w-5xl flex flex-col lg:flex-row gap-8 break-normal">
	<form on:submit|preventDefault={() => login(puppets)} class="flex flex-col gap-8">
		<Input text={`User Agent`} bind:bindValue={main} forValue="main" required={true} />
		<Textarea text="Puppets" bind:bindValue={puppets} forValue="pup" required />
		<Buttons downloadButton={true} bind:downloadable={downloadable} bind:content={content} type="html" name="Creator" />
	</form>
	<Terminal bind:progress={progress} />
</div>
