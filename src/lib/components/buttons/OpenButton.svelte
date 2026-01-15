<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte'

	interface Props {
		progress?: Array<{ text: string; color?: string }>
		openNewLinkArr?: Array<{ url: string; tableText: string; linkStyle?: string }>
	}

	let { progress = $bindable([]), openNewLinkArr = $bindable([]) }: Props = $props()

	let openedCount = $state(0)
</script>

<Button
	disabled={!progress || openNewLinkArr.length === 0}
	type="button"
	variant={'default'}
	onkeyup={e => {
		if (e.key !== 'Enter') return
		if (openNewLinkArr.length === 0) {
			return
		}
		window.open(openNewLinkArr[0].url, '_blank')
		openedCount++
		openNewLinkArr.splice(0, 1)
	}}
	onclick={(e: any) => {
		if (e.pointerType === 'mouse') {
			if (openNewLinkArr.length === 0) {
				return
			}
			window.open(openNewLinkArr[0].url, '_blank')
			openedCount++
			openNewLinkArr.splice(0, 1)
		}
	}}>
	Open Available Link {openNewLinkArr.length > 0 ? `(${openedCount} / ${openNewLinkArr.length})` : ''}
</Button>
