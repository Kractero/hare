<script lang="ts">
	import { filter } from '$lib/store'

	import Badge from './ui/badge/badge.svelte'

	interface Props {
		name: string
		author: string
		category: string
		url: string
		description: string
		lastUpdate: string
		keywords: Array<string>
		created: string
		authorUrl: string
	}

	let { name, author, category, url, description, lastUpdate, keywords, created, authorUrl }: Props = $props()

	function timeAgo(date: string) {
		const now = new Date()
		const createdDate = new Date(date)

		const yearsDiff = now.getFullYear() - createdDate.getFullYear()
		const monthsDiff = now.getMonth() - createdDate.getMonth()
		const daysDiff = now.getDate() - createdDate.getDate()

		let years = yearsDiff
		let months = monthsDiff
		let days = daysDiff

		if (days < 0) {
			months -= 1
			days += new Date(now.getFullYear(), now.getMonth(), 0).getDate()
		}
		if (months < 0) {
			years -= 1
			months += 12
		}

		const yearsStr = years > 0 ? `${years} year${years > 1 ? 's' : ''} ` : ''
		const monthsStr = months > 0 ? `${months} month${months > 1 ? 's' : ''} ` : ''
		const daysStr = days > 0 ? `${days} day${days > 1 ? 's' : ''} ` : ''

		return `${yearsStr}${monthsStr}${years < 1 && months < 1 ? daysStr : ''} ago`.trim()
	}
</script>

<div
	class="flex max-w-full flex-col gap-4 rounded-xl bg-secondary p-4 transition duration-200 hover:scale-105 hover:shadow-lg md:p-6"
>
	<p class="-mb-1 flex flex-wrap items-center gap-2">{category}</p>
	<a href={url} target="_blank">
		<h2 class="break-words text-3xl font-bold">{name}</h2>
	</a>
	<a class="text-base font-light text-secondary-foreground" href={authorUrl} target="_blank">{author} </a>
	<p class="text-sm text-muted-foreground">last updated {timeAgo(lastUpdate)}</p>
	<p class="break-words">
		{description}
	</p>
	<div class="mb-auto">
		<div class="flex flex-wrap gap-2">
			{#each keywords as word}
				<Badge class="rounded-md">
					<button onclick={() => filter.set(word)}>{word} </button>
				</Badge>
			{/each}
		</div>
	</div>
	<div class="flex w-full flex-col justify-between min-[460px]:flex-row sm:items-end sm:gap-6">
		<p class="text-sm text-muted-foreground">created {timeAgo(created)}</p>
	</div>
</div>
