<script lang="ts">
	import { handleDownload } from '$lib/download';
	import { nsIterator } from '$lib/txtIterator';
	import { onMount } from 'svelte';
	let progress: Array<string> = [];
	let puppets = '';
	let content: Array<string>;

	onMount(() => {
		puppets = localStorage.getItem('stationPuppets') || '';
	});

	async function containerise(puppets: string) {
		content = (await nsIterator(puppets, 'Container Rules')) as Array<string>;
		progress = [...progress, `Finished processing`];
		handleDownload('txt', content, '');
	}
</script>

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
		<div class="max-w-lg flex justify-center">
			<button
				type="submit"
				class="bg-green-300 rounded-md px-4 py-2 transition duration-300 hover:bg-green-500"
			>
				Start
			</button>
		</div>
	</form>
	<pre
		class="flex-1 p-2 whitespace-pre-wrap bg-black dark:bg-gray-50 text-white dark:text-black font-medium font-mono inline-block">
        {#if content && content[0]}
			<p>NATION RULES</p>
            <p>{content[0]}</p>
            <p>CONTAINER RULES</p>
            <p>{content[1]}</p>
		{/if}
    </pre>
</div>
