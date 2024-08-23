<script lang="ts">
	export let url: string
	export let title: string
	export let author: string
	export let description: string
</script>

<div class="group relative">
	<a
		href={`/guides/${url}`}
		class="mx-auto block border-b border-neutral-200 py-4 pr-8 transition-colors duration-300 ease-in-out group-hover:bg-neutral-200 dark:border-neutral-800 group-hover:dark:bg-neutral-800"
	>
		<p class="px-2 font-semibold">
			{title} -
			<span class="text-xs font-light text-muted-foreground">{author}</span>
		</p>
		<p class="px-2 text-sm">{description}</p>
	</a>
</div>
