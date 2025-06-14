<script lang="ts">
	import Post from './Post.svelte'

	interface Props {
		data: Record<string, any>
	}

	let { data }: Props = $props()

	const posts = Object.values(data)
		.flat()
		.filter(post => !!post.description)

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

<div class="my-20">
	<h2 class="mb-1 text-center text-3xl font-bold">Guides</h2>

	<p class="mb-16 text-center text-lg lg:w-auto">Various guides for setting up tools and prerequisites.</p>

	<div class="mx-auto grid max-w-lg grid-cols-1 justify-center gap-4 sm:grid-cols-2 lg:max-w-5xl">
		{#each posts as post}
			<ul class="space-y-1">
				<Post author={post.author} description={post.description} title={post.title} url={post.url} />
			</ul>
		{/each}
		{#each non_md as post}
			<Post author={post.author} description={post.description} title={post.title} url={post.url} />
		{/each}
	</div>
</div>
