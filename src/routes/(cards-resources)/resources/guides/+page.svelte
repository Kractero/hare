<script lang="ts">
	import Head from '$lib/components/Head.svelte'
	import Post from '$lib/components/Post.svelte'

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
</script>

<Head title={'Hare - Guides'} description={'Various guides for NationStates cards.'} />

<div class="mb-20">
	<h2 class="mb-1 text-center text-3xl font-bold">Guides</h2>

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
