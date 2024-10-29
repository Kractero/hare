<script lang="ts">
	import projects from '$lib/data/projects.json'
	import { filter } from '$lib/store'

	import Badge from './ui/badge/badge.svelte'

	const keywords = () => {
		let frequency: { [key: string]: number } = {}

		projects.forEach(project => {
			project.keywords.forEach(keyword => {
				if (frequency[keyword]) {
					frequency[keyword]++
				} else {
					frequency[keyword] = 1
				}
			})
		})

		const frequencyArr = Object.entries(frequency).map(([keyword, count]) => ({ keyword, count }))
		frequencyArr.sort((a, b) => b.count - a.count)

		return frequencyArr
	}
</script>

<div class="mx-auto mt-8 flex max-w-lg flex-wrap gap-4 p-4 lg:max-w-5xl">
	<Badge variant={!$filter || $filter === 'All' ? 'default' : 'secondary'} class="rounded-md p-2">
		<button
			onclick={e => {
				filter.set('All')
			}}
		>
			All
		</button></Badge
	>
	{#each keywords() as keyword}
		<Badge variant={$filter === keyword.keyword ? 'default' : 'secondary'} class="rounded-md p-2">
			<button
				onclick={e => {
					filter.set(keyword.keyword)
				}}
			>
				{keyword.keyword} ({keyword.count})
			</button>
		</Badge>
	{/each}
</div>
