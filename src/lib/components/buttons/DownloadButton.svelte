<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte'
	import { handleDownload } from '$lib/helpers/download'
	import { htmlContent } from '$lib/helpers/htmlContent'

	export let downloadable = false
	export let content: Array<string> | string = ''

	export let type = 'html'
	export let name
</script>

<Button
	variant="default"
	type="button"
	class="mx-auto w-max"
	disabled={!downloadable}
	on:click={() =>
		handleDownload(
			name,
			type === 'txt' || Array.isArray(content) ? content : htmlContent(content, name)
		)}>Download</Button
>
