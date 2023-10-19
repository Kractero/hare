<script lang="ts">
	import { keywords } from '$lib/cards-resources/projects';
	import { filter } from '$lib/cards-resources/store';
</script>

<div class="max-w-lg lg:max-w-5xl p-4 flex flex-wrap gap-4 mb-8">
	<button
		on:click={(e) => {
			filter.set('All');
		}}
		class={`rounded-xl p-2 ${!$filter || $filter === 'All' ? 'bg-tertiary' : 'bg-content'}`}
	>
		<p class="text-label">All</p>
	</button>
	{#each keywords() as keyword}
		<button
			on:click={(e) => {
				filter.set(keyword.keyword);
			}}
			class={`rounded-xl p-2 ${$filter === keyword.keyword ? 'bg-tertiary' : 'bg-content'}`}
		>
			<p class="text-label">{keyword.keyword} ({keyword.count})</p>
		</button>
	{/each}
</div>
