<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte'

	export let progress = ''
	export let counter = 0
	export let openNewLinkArr: Array<string> = []
</script>

<Button
	disabled={!progress}
	type="button"
	variant={'default'}
	on:click={() => {
		if (counter > openNewLinkArr.length - 1) {
			return
		}
		window.open(openNewLinkArr[counter], '_blank')
		counter++
	}}
>
	Open Available Link
</Button>
