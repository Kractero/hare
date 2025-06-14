<script lang="ts">
	interface Props {
		url: string
		title: string
		author?: string
		description: string
	}

	let { url, title, author = '', description }: Props = $props()
</script>

<div class="group relative">
	<a
		href={`${url}`}
		target={`${url.includes('nationstates')} ? "_blank" : "_self"}`}
		class="border-border group-hover:bg-secondary mx-auto block rounded border py-4 pr-8 transition-colors duration-300 ease-in-out">
		<p class="px-2 font-semibold">
			{title}
		</p>
		{#if author}
			<p class="text-muted-foreground mb-2 px-2 text-xs font-light">{author}</p>
		{/if}
		<p class="px-2 text-sm">{description}</p>
	</a>
</div>
