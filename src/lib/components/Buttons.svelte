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

<div class="mx-auto flex w-max max-w-lg flex-wrap justify-center gap-2">
	<Button class="mx-auto w-max" variant="default" type="submit">Start</Button>
	{#if downloadButton === true}
		<DownloadButton bind:downloadable bind:content type="html" name="Creator" />
	{/if}
	{#if stopButton === true}
		<button
			type="button"
			disabled={!stoppable}
			on:click={() => {
				{
					stoppable = false
					stopped = true
				}
			}}
			class="rounded-md bg-red-500 px-4 py-2 transition duration-300 hover:bg-red-300 disabled:opacity-20 disabled:hover:bg-red-500"
		>
			Stop
		</button>
	{/if}
	<slot />
</div>
