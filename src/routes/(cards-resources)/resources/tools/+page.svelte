<script lang="ts">
	import Filterer from '$lib/components/Filterer.svelte'
	import Card from '$lib/components/ResourceCard.svelte'
	import ResourceSelect from '$lib/components/ResourceSelect.svelte'
	import projects from '$lib/data/projects.json'
	import { filter } from '$lib/store'

	let sort = $state('Last Updated (desc)')
	let author = $state('All')
	let category = $state('All')

	const authorsArray = ['All', ...projects.map(project => project.author).sort()]
	const authors = new Set(authorsArray)
	const categoriesArray = ['All', ...projects.map(project => project.category).sort()]
	const categories = new Set(categoriesArray)
</script>

<div>
	<h2 class="mb-1 text-center text-3xl font-bold">Resources</h2>

	<p class="mb-16 text-center text-lg lg:w-auto">Filter and search various NationStates cards tools.</p>

	<div class="flex items-center">
		<Filterer />
		<div class="max-h-3xl mx-auto flex w-max flex-col items-end gap-4">
			<ResourceSelect
				bind:bindValue={sort}
				label="Sort By"
				items={['Last Update (asc)', 'Last Update (desc)', 'Creation (asc)', 'Creation (desc)']} />

			<ResourceSelect bind:bindValue={author} label="Author" items={Array.from(authors)} />
			<ResourceSelect bind:bindValue={category} label="Categories" items={Array.from(categories)} />
		</div>
	</div>

	<div class="my-8 grid max-w-5xl grid-cols-1 justify-center gap-4 min-[980px]:grid-cols-2">
		{#each projects
			.filter(project => {
				if ($filter && $filter !== 'All') {
					return project.keywords.includes($filter)
				} else {
					return project
				}
			})
			.filter(project => {
				if (author !== 'All') {
					return project.author === author
				} else {
					return project
				}
			})
			.filter(project => {
				if (category !== 'All') {
					return project.category === category
				} else {
					return project
				}
			})
			.sort((a, b) => {
				const dateA = new Date(a.lastUpdate).getTime()
				const dateB = new Date(b.lastUpdate).getTime()
				const creationA = new Date(a.created).getTime()
				const creationB = new Date(b.created).getTime()

				switch (sort) {
					case 'Last Update (asc)':
						return dateA - dateB
					case 'Last Update (desc)':
						return dateB - dateA
					case 'Creation (asc)':
						return creationA - creationB
					case 'Creation (desc)':
						return creationB - creationA
					default:
						return dateB - dateA
				}
			}) as project}
			<Card
				name={project.name}
				author={project.author}
				authorUrl={project.authorUrl}
				url={project.url}
				keywords={project.keywords}
				description={project.description}
				category={project.category}
				lastUpdate={project.lastUpdate}
				created={project.created} />
		{/each}
	</div>
</div>
