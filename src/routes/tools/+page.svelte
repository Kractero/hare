<script lang="ts">
	import Tool from '$lib/components/Tool.svelte'
	import externalTools from '$lib/data/external-tools.json'
	import tools from '$lib/data/tools.json'
</script>

<div class="mx-auto flex w-full flex-wrap justify-around">
	{#each tools as tool}
		<Tool slug={`/tools/${tool.slug}`} tool={tool.name} description={tool.description} image={tool.image} />
	{/each}
</div>

<h2 class="mx-auto mb-4 text-2xl font-semibold">Non-Scripts</h2>
<div class="mx-auto flex w-full flex-wrap justify-around">
	{#each externalTools as tool}
		<Tool
			slug={tool.slug.includes('https') ? tool.slug : `/resources/${tool.slug}`}
			tool={tool.name}
			description={tool.description}
			image={tool.image} />
	{/each}
</div>
