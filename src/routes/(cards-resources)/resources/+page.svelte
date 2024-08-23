<script lang="ts">
	import Filterer from '$lib/components/Filterer.svelte'
	import Head from '$lib/components/Head.svelte'
	import Post from '$lib/components/Post.svelte'
	import Card from '$lib/components/ResourceCard.svelte'
	import ResourceSelect from '$lib/components/ResourceSelect.svelte'
	import projects from '$lib/data/projects.json'
	import { filter } from '$lib/store'

	import type { PageData } from './$types'

	export let data: PageData
	let non_md = [
		{
			title: 'Containerise',
			author: 'Racoda',
			url: 'https://www.nationstates.net/page=dispatch/id=1383002',
			keywords: ['guides'],
			description: 'Containers? What? Why? A detailed guide.',
		},
		{
			title: 'North Pacific Cards Guide',
			author: 'The Northern light',
			url: 'https://www.nationstates.net/page=dispatch/id=1301085',
			keywords: ['guides'],
			description: 'Interested in Building Your Dream Deck?',
		},
		{
			title: 'West Pacific Cards Guide',
			author: 'The West Pacific',
			url: 'https://www.nationstates.net/page=dispatch/id=1399925',
			keywords: ['guides'],
			description: "The West Pacific's guide to Trading Cards",
		},
	]
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
	description={'Hub of NationStates guides and search tools, utilities, and scripts.'}
/>

<div class="mb-20">
	<h2 class="mb-1 text-center text-3xl font-bold text-textprimary">Guides</h2>

	<p class="mb-16 text-center text-lg lg:w-auto">
		Various guides for setting up tools and prerequisites.
	</p>

	<div class="grid max-w-lg grid-cols-2 justify-center gap-4 lg:max-w-5xl">
		{#each data.posts as post}
			<Post author={post.author} description={post.description} title={post.title} url={post.url} />
		{/each}
		{#each non_md as post}
			<Post author={post.author} description={post.description} title={post.title} url={post.url} />
		{/each}
	</div>
</div>

<div>
	<h2 class="mb-1 text-center text-3xl font-bold text-textprimary">Resources</h2>

	<p class="mb-16 text-center text-lg lg:w-auto">
		Filter and search various NationStates cards tools.
	</p>

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
</div>
