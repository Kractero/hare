<script lang="ts">
	interface Props {
		url: string
		title: string
		author: string
		description: string
	}

	let { url, title, author, description }: Props = $props()
</script>

<div class="group relative">
	<a
		href={`${url.includes('https') ? url : `/resources/guides/${url}`}`}
		class="mx-auto block border-b border-border py-4 pr-8 transition-colors duration-300 ease-in-out group-hover:bg-secondary">
		<p class="px-2 font-semibold">
			{title} -
			<span class="text-xs font-light text-muted-foreground">{author}</span>
		</p>
		<p class="px-2 text-sm">{description}</p>
	</a>
</div>
