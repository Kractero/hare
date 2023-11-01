<script lang="ts">
	import { handleDownload } from '$lib/helpers/download';
	import { htmlContent } from '$lib/helpers/htmlContent';
	import { nsIterator } from '$lib/helpers/txtIterator';
	import Terminal from '$lib/component/Terminal.svelte';
	import Buttons from '$lib/component/Buttons.svelte';
	import Textarea from '$lib/component/Textarea.svelte';
	import ToolContent from '$lib/component/ToolContent.svelte';
	let progress = "";
	let content: string;
	let downloadable = false;

	let puppets = '';
	async function login(puppets: string) {
		downloadable = false;
		content = (await nsIterator(puppets, 'Creator')) as string;
		progress = "<p>Finished processing</p>"
		downloadable = true;
	}
</script>

<ToolContent toolTitle="Creator Assistant" author="Kractero" link="https://github.com/Kractero/cards-utilities/tree/main/creation_assistant" caption="Generate a sheet that has links for nation creation that works with the provided userscripts." additional={`<p class="text-xs mb-16">
	For optimal use, this script is intended to be used with
	<a class="underline" href="https://github.com/Kractero/cards-utilities/blob/main/creation_assistant/creator.user.js" target="_blank" rel="noreferrer noopener">
		creator
	</a> which does require configuration which you can read about in the repository.
</p>`}/>

<div class="lg:w-[1024px] lg:max-w-5xl flex flex-col lg:flex-row gap-8 break-normal">
	<form on:submit|preventDefault={() => login(puppets)} class="flex flex-col gap-8">
		<Textarea text="Puppets" bind:bindValue={puppets} forValue="pup" required />
		<Buttons>
			<button disabled={!downloadable} type="button" on:click={() => handleDownload('html', htmlContent(content), 'Creator')}
				class="bg-green-500 rounded-md px-4 py-2 transition duration-300 hover:bg-green-300 disabled:opacity-20 disabled:hover:bg-green-500">
				Download
			</button>
		</Buttons>
	</form>
	<Terminal bind:progress={progress} />
</div>
