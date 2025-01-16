<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte'

	interface Props {
		progress?: string
		counter?: number
		openNewLinkArr?: Array<string>
	}

	let { progress = $bindable(''), counter = $bindable(0), openNewLinkArr = $bindable([]) }: Props = $props()
</script>

<Button
	disabled={!progress || openNewLinkArr.length === 0}
	type="button"
	variant={'default'}
	onkeyup={e => {
		if (e.key !== 'Enter') return
		if (counter > openNewLinkArr.length - 1) {
			return
		}
		window.open(openNewLinkArr[counter], '_blank')
		counter++
	}}
	onclick={(e: any) => {
		if (e.pointerType === 'mouse') {
			if (counter > openNewLinkArr.length - 1) {
				return
			}
			window.open(openNewLinkArr[counter], '_blank')
			counter++
		}
	}}>
	Open Available Link
</Button>
