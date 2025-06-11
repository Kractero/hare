<script lang="ts">
	import Footer from '$lib/components/Footer.svelte'
	import Head from '$lib/components/Head.svelte'
	import Tool from '$lib/components/Tool.svelte'
	import Button from '$lib/components/ui/button/button.svelte'
	import externalTools from '$lib/data/external-tools.json'
	import tools from '$lib/data/tools.json'

	let searchTerm = ''
</script>

<Head
	title={'Hare'}
	description={'Humble Automated Runner for Executing nationstates scripts. A central location to run NationStates scripts.'} />

<div class="mb-12 grid grid-cols-12 items-center justify-between md:max-w-5xl lg:w-[1024px]">
	<div class="col-span-full flex flex-col gap-2 lg:col-span-6">
		<h1 class="mb-4 text-center text-5xl font-bold tracking-tight lg:text-left">
			A central location for NationStates scripts.
		</h1>
		<p class="text-center font-light tracking-tight lg:text-left">Caffeine... I need more caffeine...</p>
		<div class="mx-auto my-4 flex flex-1 flex-wrap items-center gap-1 lg:mx-0">
			<Button href="/" variant={'secondary'}>
				<span class="text-base">Home</span>
			</Button>
			<Button href="/changelog" variant={'secondary'}>
				<span class="text-base">Changelog</span>
			</Button>
			<Button href="/resources" variant={'secondary'}>
				<span class="text-base">Resources</span>
			</Button>
		</div>
	</div>
	<div class="col-span-full mx-auto max-lg:hidden lg:col-span-6">
		<picture class="w-[512px]">
			<source srcset="hare2.webp" type="image/webp" />
			<source srcset="hare2.jpg" type="image/jpeg" />
			<img src="hare2.jpg" alt="Hare" />
		</picture>
	</div>
</div>

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
		<Tool slug={`/tools/${tool.slug}`} tool={tool.name} description={tool.description} image={tool.image} />
	{/each}
</div>

<h2 class="mx-auto mb-4 text-2xl font-semibold">Non-Scripts</h2>
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
			image={tool.image} />
	{/each}
</div>

<Footer />
