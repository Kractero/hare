<script lang="ts">
	import DownloadButton from './buttons/DownloadButton.svelte'
	import Button from './ui/button/button.svelte'

	export let stoppable: boolean = false
	export let downloadButton = false
	export let downloadable = false
	export let content: Array<string> | string = ''
	export let type = ''
	export let name = ''
	export let stopped = false
	export let stopButton = false
</script>

<div class="mx-auto mb-4 flex max-w-lg flex-wrap justify-center gap-x-2 gap-y-4">
	<Button disabled={stoppable} class="mx-auto w-max" variant="default" type="submit">Start</Button>
	{#if downloadButton === true}
		<DownloadButton bind:downloadable bind:content {type} {name} />
	{/if}
	{#if stopButton === true}
		<Button
			disabled={!stoppable}
			on:click={() => {
				{
					stoppable = false
					stopped = true
				}
			}}
			class="mx-auto w-max"
			variant="destructive"
			type="button">Stop</Button>
	{/if}
	<slot />
</div>
