<script lang="ts">
	import { handleDownload } from '$lib/download';
	import { htmlContent } from '$lib/htmlContent';
	import { nsIterator } from '$lib/txtIterator';
	import { onMount } from 'svelte';
	import InputCredentials from '../../../component/InputCredentials.svelte';
	let progress: Array<string> = [];
	let puppets = '';
	let main = '';
	let content: string;
	onMount(() => {
		puppets = localStorage.getItem('stationPuppets') || '';
		main = localStorage.getItem('stationMain') || '';
	});
	async function login(puppets: string) {
		content = (await nsIterator(puppets, 'Login Sheet', main)) as string;
		progress = [...progress, `Finished processing`];
		handleDownload('html', htmlContent(content), 'Login Sheet');
	}
</script>

<h1 class="text-4xl mb-2">Login Sheet</h1>
<p class="mb-16">Generate links to help you quickly log back into containers.</p>

<div class="lg:w-[1024px] lg:max-w-5xl flex flex-col lg:flex-row gap-8 break-normal">
	<form on:submit|preventDefault={() => login(puppets)} class="flex flex-col gap-8">
		<InputCredentials bind:main bind:puppets authenticated={false} />
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
			<p>{content}</p>
		{/if}
    </pre>
</div>
