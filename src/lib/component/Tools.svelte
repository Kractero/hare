<script lang="ts">
	import { tools } from '$lib/tools';
	import Tool from '$lib/component/Tool.svelte';
    export let searchTerm: string;
</script>

<input
	bind:value={searchTerm}
	class="text-black p-1 w-full rounded-md border border-black dark:border-none"
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
