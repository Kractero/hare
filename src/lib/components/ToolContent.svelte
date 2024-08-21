<script lang="ts">
	import Head from './Head.svelte'

	export let toolTitle: string
	export let author: string = ''
	export let link: string = ''
	export let originalBlurb: string = ''
	export let caption: string
	export let additional: string = ''
</script>

<Head title={`Hare - ${toolTitle}`} description={caption} />

<div class="flex items-center gap-4">
	<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-4xl">{toolTitle}</h1>
	<img src={`/${toolTitle}.png`} alt={toolTitle} />
</div>
<p class="mt-3 border-l-2 pl-6 italic">
	{#if author}
		<a class="underline" href={link} target="_blank" rel="noreferrer noopener">
			Original by {author}
		</a>
		{#if originalBlurb}
			, {originalBlurb}
		{/if}
	{/if}
</p>
<p class={`mb-1 leading-7 ${author && 'mt-6'} ${!additional && 'mb-16'}`}>{caption}</p>
{#if additional}
	{@html additional}
{/if}
