<script lang="ts">
	interface Props {
		slug: string
		tool: string
		description: string
	}

	let { slug = '', tool = '', description = '' }: Props = $props()
</script>

<a
	href={slug}
	target={slug.includes('https') ? '_blank' : '_self'}
	rel="noreferrer noopener"
	class="mb-12 flex w-60 flex-col items-start rounded-sm border border-border bg-secondary p-4 transition duration-200 hover:scale-105 hover:shadow-lg">
	<div class="font-semi-bold flex items-center text-xl">
		<img class="mr-2" alt={tool} src={`/${tool}.png`} />
		{tool}
	</div>
	<p class="mt-2 text-sm text-primary/75">{description}</p>
</a>
