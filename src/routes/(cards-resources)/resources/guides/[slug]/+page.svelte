<script lang="ts">
	import Head from '$lib/components/Head.svelte'

	import type { PageData } from './$types'

	interface Props {
		data: PageData
	}

	let { data }: Props = $props()
</script>

<Head title={`Hare - Guides | ${data.post.title}`} description={data.post.description} />

<div>
	<article class="prose mx-auto mb-24 max-w-lg p-4 dark:prose-invert md:max-w-3xl lg:max-w-5xl">
		<header>
			<h1>{data.post.title}</h1>
			<h4>{data.post.author}</h4>
		</header>
		<div class="mt-4">
			<data.component />
		</div>
	</article>
</div>
