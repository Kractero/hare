<script lang="ts">
	interface Props {
		slug: string
		tool: string
		description: string
		image: string
	}

	let { slug = '', tool = '', description = '', image = '' }: Props = $props()
</script>

<a
	href={slug}
	target={slug.includes('https') ? '_blank' : '_self'}
	rel="noreferrer noopener"
	class="border-border bg-secondary mb-12 flex w-60 flex-col items-start rounded-sm border p-4 transition duration-200 hover:scale-105 hover:shadow-lg">
	<div class="font-semi-bold flex items-center text-xl">
		<span class="mr-2 text-[36px]">{image}</span>
		{tool}
	</div>
	<p class="text-primary/75 mt-2 text-sm">{description}</p>
</a>
