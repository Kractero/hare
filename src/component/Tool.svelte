<script>
	export let slug = '';
	export let tool = '';
	export let description = '';
	import { base } from "$app/paths";
</script>

<a
	href={`${base}/tools/${slug}`}
	class="text-cardprimarytext mt-16 rounded-sm bg-content w-60 p-4 flex flex-col items-start border border-black transition duration-200 hover:shadow-lg hover:scale-105"
>
	<div class="flex items-center text-xl font-semi-bold">
		<img alt={tool} src={`${tool}.png`} />
		{tool}
	</div>
	<p class="text-cardsecondarytext text-sm">{description}</p>
</a>
