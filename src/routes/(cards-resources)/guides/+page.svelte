<script lang="ts">
	import Head from '$lib/component/Head.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
	let non_md = [
		{
			"name": "Containerise",
			"author": "Racoda",
			"url": "https://www.nationstates.net/page=dispatch/id=1383002",
			"keywords": ["guides"],
			"description": "Containers? What? Why? A detailed guide."
		},
		{
			"name": "North Pacific Cards Guide",
			"author": "The Northern light",
			"url": "https://www.nationstates.net/page=dispatch/id=1301085",
			"keywords": ["guides"],
			"description": "Interested in Building Your Dream Deck?"
		},
		{
			"name": "West Pacific Cards Guide",
			"author": "The West Pacific",
			"url": "https://www.nationstates.net/page=dispatch/id=1399925",
			"keywords": ["guides"],
			"description": "The West Pacific's guide to Trading Cards"
		},
		{
			"name": "Transfer Guide",
			"author": "Queen Yuno",
			"url": "https://www.nationstates.net/page=dispatch/id=1146418",
			"keywords": ["guides", "puppets", "transfers", "bank"],
			"description": "Guide to transferring bank from puppets."
		}
	]
</script>

<Head title={"Hare - Guides"} description={"Various guides/posts for setting up tools and prerequisites."} />

<h2 class="text-textprimary text-3xl font-bold mb-1 text-center">Guides</h2>

<p class="text-lg mb-16 lg:w-auto text-center">
	Various guides for setting up tools and prerequisites.
</p>

<div class="flex flex-wrap gap-4 max-w-lg justify-center lg:max-w-5xl">
	{#each data.posts as post}
		<a href={`/guides/${post.url}`}>
			<div class="text-center bg-content rounded-xl p-4 w-80 lg:w-72">
				<h3 class="text-cardprimarytext text-2xl font-semibold mb-1">{post.title}</h3>
				<p class="text-cardsecondarytext text-xs mb-2">{post.author}</p>
				<p class="text-cardsecondarytext text-sm">{post.description}</p>
			</div>
		</a>
	{/each}
	{#each non_md as post}
		<a href={post.url} rel="noopener noreferrer" target="_blank">
			<div class="text-center bg-content rounded-xl p-4 w-80 lg:w-72">
				<h3 class="text-cardprimarytext text-2xl font-semibold mb-1">{post.name}</h3>
				<p class="text-cardsecondarytext text-xs mb-2">{post.author}</p>
				<p class="text-cardsecondarytext text-sm">{post.description}</p>
			</div>
		</a>
	{/each}
</div>