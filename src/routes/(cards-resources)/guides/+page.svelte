<script lang="ts">
	import Head from '$lib/components/Head.svelte'

	import type { PageData } from './$types'

	export let data: PageData
	let non_md = [
		{
			name: 'Containerise',
			author: 'Racoda',
			url: 'https://www.nationstates.net/page=dispatch/id=1383002',
			keywords: ['guides'],
			description: 'Containers? What? Why? A detailed guide.',
		},
		{
			name: 'North Pacific Cards Guide',
			author: 'The Northern light',
			url: 'https://www.nationstates.net/page=dispatch/id=1301085',
			keywords: ['guides'],
			description: 'Interested in Building Your Dream Deck?',
		},
		{
			name: 'West Pacific Cards Guide',
			author: 'The West Pacific',
			url: 'https://www.nationstates.net/page=dispatch/id=1399925',
			keywords: ['guides'],
			description: "The West Pacific's guide to Trading Cards",
		},
		{
			name: 'Transfer Guide',
			author: 'Queen Yuno',
			url: 'https://www.nationstates.net/page=dispatch/id=1146418',
			keywords: ['guides', 'puppets', 'transfers', 'bank'],
			description: 'Guide to transferring bank from puppets.',
		},
	]
</script>

<Head
	title={'Hare - Guides'}
	description={'Various guides/posts for setting up tools and prerequisites.'}
/>

<h2 class="mb-1 text-center text-3xl font-bold text-textprimary">Guides</h2>

<p class="mb-16 text-center text-lg lg:w-auto">
	Various guides for setting up tools and prerequisites.
</p>

<div class="flex max-w-lg flex-wrap justify-center gap-4 lg:max-w-5xl">
	{#each data.posts as post}
		<a href={`/guides/${post.url}`}>
			<div class="w-80 rounded-xl bg-content p-4 text-center lg:w-72">
				<h3 class="mb-1 text-2xl font-semibold text-cardprimarytext">{post.title}</h3>
				<p class="mb-2 text-xs text-cardsecondarytext">{post.author}</p>
				<p class="text-sm text-cardsecondarytext">{post.description}</p>
			</div>
		</a>
	{/each}
	{#each non_md as post}
		<a href={post.url} rel="noopener noreferrer" target="_blank">
			<div class="w-80 rounded-xl bg-content p-4 text-center lg:w-72">
				<h3 class="mb-1 text-2xl font-semibold text-cardprimarytext">{post.name}</h3>
				<p class="mb-2 text-xs text-cardsecondarytext">{post.author}</p>
				<p class="text-sm text-cardsecondarytext">{post.description}</p>
			</div>
		</a>
	{/each}
</div>
