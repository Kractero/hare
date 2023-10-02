<script>
	import { tools } from '$lib/tools';
	import Tool from '../component/Tool.svelte';
	let searchTerm = '';
</script>

<div class="w-[1024px] max-w-5xl mb-12">
	<h1 class="text-textprimary font-bold tracking-wide text-4xl mb-4">Hare (ハレ)</h1>
	<p class="font-extralight tracking-tight">A central location to run NationStates scripts.</p>
</div>

<input
	bind:value={searchTerm}
	class="text-black p-1 w-auto rounded-md border border-black dark:border-none"
/>

<div class="grid grid-cols-4">
	{#each tools.filter((project) => {
		if (searchTerm) {
			return project.description.toLowerCase().includes(searchTerm.toLowerCase()) || project.name
					.toLowerCase()
					.includes(searchTerm.toLowerCase());
		} else {
			return project;
		}
	}) as tool}
		<Tool slug={tool.slug} tool={tool.name} description={tool.description} />
	{/each}
</div>
