<script lang="ts">
	import { non_md } from '$lib/helpers/md'

	import Post from './Post.svelte'

	interface Props {
		data: Record<string, any>
	}

	let { data }: Props = $props()

	const posts = Object.values(data)
		.flat()
		.filter(post => !!post.description)
</script>

<div class="my-20 w-auto max-w-lg min-[712px]:w-[712px] md:max-w-3xl lg:max-w-5xl">
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
