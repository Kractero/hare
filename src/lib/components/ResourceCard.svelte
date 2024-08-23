<script lang="ts">
	import { timeAgo } from '$lib/helpers/builders'
	import { filter } from '$lib/store'

	import Badge from './ui/badge/badge.svelte'

	export let name: string
	export let author: string
	export let category: string
	export let url: string
	export let description: string
	export let lastUpdate: string
	export let keywords: Array<string>
	export let created: string
	export let authorUrl: string
</script>

<article
	class="flex max-w-full flex-col gap-4 rounded-xl p-4 hover:shadow-lg dark:bg-neutral-800 md:p-6"
>
	<p class="-mb-1 flex flex-wrap items-center gap-2">{category}</p>
	<a href={url} target="_blank">
		<h2 class="break-words text-3xl font-bold">{name}</h2>
	</a>
	<a class="text-base font-light text-secondary-foreground" href={authorUrl} target="_blank"
		>{author}
	</a>
	<p class="text-sm text-muted-foreground">last updated {timeAgo(lastUpdate)}</p>
	<p class="break-words">
		{description}
	</p>
	<div class="mb-auto">
		<div class="flex flex-wrap gap-2">
			{#each keywords as word}
				<Badge class="rounded-md">
					<button on:click={() => filter.set(word)}>{word} </button>
				</Badge>
			{/each}
		</div>
	</div>
	<div class="flex w-full flex-col justify-between min-[460px]:flex-row sm:items-end sm:gap-6">
		<p class="text-sm text-muted-foreground">created {timeAgo(created)}</p>
	</div>
</article>
