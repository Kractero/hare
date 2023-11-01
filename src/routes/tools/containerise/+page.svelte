<script lang="ts">
	import { nsIterator } from '$lib/helpers/txtIterator';
	import Terminal from '$lib/component/Terminal.svelte';
	import Buttons from '$lib/component/Buttons.svelte';
	import Textarea from '$lib/component/Textarea.svelte';
	import ToolContent from '$lib/component/ToolContent.svelte';
	let progress = "";
	let puppets = '';
	let content: Array<string>;
	let downloadable = false;

	async function containerise() {
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

<ToolContent toolTitle="Container Rules" caption="Generate container rules" additional={`<p class="mb-16 text-xs">
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
</p>`} />

<div class="lg:w-[1024px] lg:max-w-5xl flex flex-col lg:flex-row gap-8 break-normal">
	<form on:submit|preventDefault={() => containerise()} class="flex flex-col gap-8">
		<Textarea text="Puppets" bind:bindValue={puppets} forValue="pup" required />
		<Buttons downloadButton={true} bind:downloadable={downloadable} bind:content={content} type="txt" />
	</form>
	<Terminal bind:progress={progress} />
</div>
