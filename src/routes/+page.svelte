<script>
	import { tools } from '$lib/tools';
	import Tool from '$lib/component/Tool.svelte';
	import Head from '$lib/component/Head.svelte';
	let searchTerm = '';
</script>

<Head title={"Hare"} description={"Humble Automated Runner for Executing nationstates scripts. A central location to run NationStates scripts."} />

<div class="lg:w-[1024px] md:max-w-5xl mb-12">
	<h1 class="text-textprimary font-bold tracking-wide text-4xl mb-4">Hare (ハレ)</h1>
	<p class="font-extralight tracking-tight mb-1">A central location to run NationStates scripts.</p>
	<p class="font-extralight tracking-tight text-[0.7rem]">Most of these scripts require containerise, and some require accompanying userscripts.</p>
	<p class="font-extralight tracking-tight text-[0.7rem]">If you do not have them, read more
		<a class="underline font-bold" href="https://kractero.github.io/cards-resources/guides/prereqs" rel="noreferrer noopener" target="_blank">here</a>, or
		visit the repo link on each page.
	</p>
</div>

<input
	bind:value={searchTerm}
	class="text-black p-1 w-auto rounded-md border border-black dark:border-none"
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
		<Tool slug={tool.slug} tool={tool.name} description={tool.description} />
	{/each}
</div>
