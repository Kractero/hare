<script>
	export let slug = '';
	export let tool = '';
	export let description = '';
</script>

<a
	href={slug}
	target={slug.includes('https') ? '_blank' : '_self'}
	rel="noreferrer noopener"
	class="text-cardprimarytext mb-16 rounded-sm bg-content w-60 p-4 flex flex-col items-start border border-black transition duration-200 hover:shadow-lg hover:scale-105"
>
	<div class="flex items-center text-xl font-semi-bold">
		<img class="mr-2" alt={tool} src={`/${tool}.png`} />
		{tool}
	</div>
	<p class="text-cardsecondarytext text-sm mt-2">{description}</p>
</a>