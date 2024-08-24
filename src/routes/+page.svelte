<script>
	import Head from '$lib/components/Head.svelte'
	import Linkbar from '$lib/components/Linkbar.svelte'
	import Tool from '$lib/components/Tool.svelte'
	import externalTools from '$lib/data/external-tools.json'
	import tools from '$lib/data/tools.json'

	let searchTerm = ''
</script>

<Head
	title={'Hare'}
	description={'Humble Automated Runner for Executing nationstates scripts. A central location to run NationStates scripts.'}
/>

<div class="mb-12 grid grid-cols-12 items-center justify-between md:max-w-5xl lg:w-[1024px]">
	<div class="col-span-full flex flex-col gap-2 lg:col-span-6">
		<h1 class="mb-4 text-center text-5xl font-bold tracking-tight lg:text-left">
			A central location for NationStates scripts.
		</h1>
		<p class="text-center font-extralight tracking-tight lg:text-left">
			The sweetest soda is the drink of intellectuals.
		</p>
		<Linkbar />
	</div>
	<div class="col-span-full mx-auto max-lg:hidden lg:col-span-6">
		<img src="hare2.jpg" alt="hare" />
	</div>
</div>

<!-- <p class="mb-2">Search</p>
<input
	bind:value={searchTerm}
	class="mb-16 w-full rounded-md border border-black p-1 text-black dark:border-none dark:bg-neutral-200"
/> -->

<div class="mx-auto flex w-full flex-wrap justify-around">
	{#each tools.filter(project => {
		if (searchTerm) {
			return project.description.toLowerCase().includes(searchTerm.toLowerCase()) || project.name
					.toLowerCase()
					.includes(searchTerm.toLowerCase())
		} else {
			return project
		}
	}) as tool}
		<Tool slug={`/tools/${tool.slug}`} tool={tool.name} description={tool.description} />
	{/each}
</div>

<h2 class="mb-4 text-2xl font-semibold">Non-Scripts</h2>
<div class="mx-auto flex w-full flex-wrap justify-around">
	{#each externalTools.filter(project => {
		if (searchTerm) {
			return project.description.toLowerCase().includes(searchTerm.toLowerCase()) || project.name
					.toLowerCase()
					.includes(searchTerm.toLowerCase())
		} else {
			return project
		}
	}) as tool}
		<Tool
			slug={tool.slug.includes('https') ? tool.slug : `/resources/${tool.slug}`}
			tool={tool.name}
			description={tool.description}
		/>
	{/each}
</div>
