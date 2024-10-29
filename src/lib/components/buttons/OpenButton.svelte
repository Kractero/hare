<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte'

	interface Props {
		progress?: string;
		counter?: number;
		openNewLinkArr?: Array<string>;
	}

	let { progress = '', counter = $bindable(0), openNewLinkArr = [] }: Props = $props();
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
