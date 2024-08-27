<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte'
	import { handleDownload, htmlContent } from '$lib/helpers/builders'

	export let downloadable = false
	export let content: Array<string> | string = ''

	export let type = 'html'
	export let name
</script>

<Button
	variant="secondary"
	type="button"
	class="myx-auto w-max bg-lime-400 text-primary-foreground hover:bg-lime-400/80 disabled:bg-lime-800 disabled:text-secondary-foreground"
	disabled={!downloadable}
	on:click={() =>
		handleDownload(
			name,
			type === 'txt' || Array.isArray(content) ? content : htmlContent(content, name)
		)}>Download</Button
>
