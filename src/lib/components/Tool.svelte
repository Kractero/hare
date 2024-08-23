<script>
	export let slug = ''
	export let tool = ''
	export let description = ''
</script>

<a
	href={slug}
	target={slug.includes('https') ? '_blank' : '_self'}
	rel="noreferrer noopener"
	class="mb-16 flex w-60 flex-col items-start rounded-sm border border-black bg-content p-4 text-cardprimarytext transition duration-200 hover:scale-105 hover:shadow-lg"
>
	<div class="font-semi-bold flex items-center text-xl">
		<img class="mr-2" alt={tool} src={`/${tool}.png`} />
		{tool}
	</div>
	<p class="mt-2 text-sm text-cardsecondarytext">{description}</p>
</a>
