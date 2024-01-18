<script>
	import Head from '$lib/component/Head.svelte';
	import Linkbar from '$lib/component/Linkbar.svelte';
	import { otherHareTools, tools } from '$lib/data/tools';
	import Tool from '$lib/component/Tool.svelte';
	let searchTerm = '';
</script>

<Head title={"Hare"} description={"Humble Automated Runner for Executing nationstates scripts. A central location to run NationStates scripts."} />

<div class="lg:w-[1024px] md:max-w-5xl mb-12">
	<h1 class="text-textprimary font-bold tracking-wide text-4xl mb-4">Hare (ハレ)</h1>
	<p class="font-extralight tracking-tight mb-1">A central location for NationStates scripts.</p>
	<Linkbar />
</div>

<input
	bind:value={searchTerm}
	class="text-black p-1 w-full rounded-md border border-black dark:border-none mb-16"
/>

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
	{#each tools.filter((project) => {
		if (searchTerm) {
			return project.description.toLowerCase().includes(searchTerm.toLowerCase()) || project.name
					.toLowerCase()
					.includes(searchTerm.toLowerCase());
		} else {
			return project;
		}
	}) as tool}
		<Tool slug={`/tools/${tool.slug}`} tool={tool.name} description={tool.description} />
	{/each}
</div>

<h2 class="text-2xl font-semibold mb-4">Non-Scripts</h2>
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
	{#each otherHareTools.filter((project) => {
		if (searchTerm) {
			return project.description.toLowerCase().includes(searchTerm.toLowerCase()) || project.name
					.toLowerCase()
					.includes(searchTerm.toLowerCase());
		} else {
			return project;
		}
	}) as tool}
		<Tool slug={tool.slug.includes('https') ? tool.slug : `/resources/${tool.slug}`} tool={tool.name} description={tool.description} />
	{/each}
</div>