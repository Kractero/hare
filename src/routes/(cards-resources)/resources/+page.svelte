<script lang="ts">
	import { filter } from '$lib/cards-resources/store'
	import Filterer from '$lib/components/Filterer.svelte'
	import Head from '$lib/components/Head.svelte'
	import Card from '$lib/components/ResourceCard.svelte'
	import ResourceSelect from '$lib/components/ResourceSelect.svelte'
	import projects from '$lib/data/projects.json'

	let sort = 'Last Updated (desc)'
	let author = 'All'
	let category = 'All'

	const authorsArray = ['All', ...projects.map(project => project.author).sort()]
	const authors = new Set(authorsArray)
	const categoriesArray = ['All', ...projects.map(project => project.category).sort()]
	const categories = new Set(categoriesArray)
</script>

<Head
	title={'Hare - Resources'}
	description={'Searchable hub of NationStates tools, utilies, and scripts.'}
/>

<ResourceSelect
	bind:bindValue={sort}
	label="Sort By"
	items={['Last Update (asc)', 'Last Update (desc)', 'Creation (asc)', 'Creation (asc)']}
/>

<ResourceSelect bind:bindValue={author} label="Author" items={Array.from(authors)} />
<ResourceSelect bind:bindValue={category} label="Categories" items={Array.from(categories)} />

<Filterer />

<div class="my-8 grid max-w-5xl grid-cols-2 justify-center gap-4 lg:grid-cols-3">
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
					return 0
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
			created={project.created}
		/>
	{/each}
</div>
