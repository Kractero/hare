<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div>
	<article class="prose prose-stone dark:prose-invert max-w-lg md:max-w-3xl lg:max-w-5xl p-4 mb-24">
		<header>
			<h1>{data.post.title}</h1>
			<h4>{data.post.author}</h4>
		</header>
		<div class="mt-4">
			<svelte:component this={data.component} />
		</div>
	</article>
</div>
