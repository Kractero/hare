<script lang="ts">
	import Head from '$lib/component/Head.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<Head title={`Hare - Guides | ${data.post.title}`} description={data.post.description} />

<div>
	<article class="prose prose-stone data-[theme=Dark]:prose-invert max-w-lg md:max-w-3xl lg:max-w-5xl p-4 mb-24">
		<header>
			<h1>{data.post.title}</h1>
			<h4>{data.post.author}</h4>
		</header>
		<div class="mt-4">
			<svelte:component this={data.component} />
		</div>
	</article>
</div>
