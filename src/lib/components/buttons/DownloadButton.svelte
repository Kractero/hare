<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte'
	import { handleDownload, htmlContent } from '$lib/helpers/builders'

	interface Props {
		downloadable?: boolean
		content?: Array<{ url: string; tableText: string; linkStyle?: string } | string> | string
		type?: string
		name: any
	}

	let { downloadable = $bindable(false), content = $bindable([]), type = 'html', name }: Props = $props()

	const getContentForDownload = () => {
		if (typeof content === 'string') {
			return htmlContent(content, name)
		}
		if (Array.isArray(content)) {
			return htmlContent(content as Array<{ url: string; tableText: string; linkStyle?: string }>, name)
		}
		return ''
	}
</script>

<Button
	variant="secondary"
	type="button"
	class="myx-auto w-max bg-lime-400 text-primary-foreground hover:bg-lime-400/80 disabled:bg-lime-800 disabled:text-secondary-foreground"
	disabled={!downloadable}
	onclick={() => handleDownload(name, type === 'txt' ? (content as Array<string>) : getContentForDownload())}
	>Download</Button>
