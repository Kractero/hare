<script lang="ts">
	import Aside from '$lib/components/Aside.svelte'
	import Head from '$lib/components/Head.svelte'

	import type { PageData } from './$types'

	interface Props {
		data: PageData
	}

	let { data }: Props = $props()
</script>

<Head title={`Hare - Guides | ${data.post.title}`} description={data.post.description!} />

<div class="relative py-6 lg:gap-10 lg:py-10">
	<article class="prose dark:prose-invert mx-auto mb-24 max-w-lg p-4 md:max-w-3xl lg:max-w-5xl">
		<header>
			<h1>{data.post.title}</h1>
			<h4>{data.post.author}</h4>
		</header>
		<div class="mt-4">
			<data.component />
		</div>
	</article>
</div>
