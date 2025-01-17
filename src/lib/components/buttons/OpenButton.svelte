<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte'

	interface Props {
		progress?: string
		openNewLinkArr?: Array<string>
	}

	let { progress = $bindable(''), openNewLinkArr = $bindable([]) }: Props = $props()
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
		window.open(openNewLinkArr[0], '_blank')
		openNewLinkArr.splice(0, 1)
	}}
	onclick={(e: any) => {
		if (e.pointerType === 'mouse') {
			if (openNewLinkArr.length === 0) {
				return
			}
			window.open(openNewLinkArr[0], '_blank')
			openNewLinkArr.splice(0, 1)
		}
	}}>
	Open Available Link
</Button>
