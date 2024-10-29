<script lang="ts">
	import DownloadButton from './buttons/DownloadButton.svelte'
	import Button from './ui/button/button.svelte'

	interface Props {
		stoppable?: boolean;
		downloadButton?: boolean;
		downloadable?: boolean;
		content?: Array<string> | string;
		type?: string;
		name?: string;
		stopped?: boolean;
		stopButton?: boolean;
		children?: import('svelte').Snippet;
	}

	let {
		stoppable = $bindable(false),
		downloadButton = false,
		downloadable = $bindable(false),
		content = $bindable(''),
		type = '',
		name = '',
		stopped = $bindable(false),
		stopButton = false,
		children
	}: Props = $props();
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
	{@render children?.()}
</div>
