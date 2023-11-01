<script lang="ts">
    export let stoppable: boolean = false;
    export let downloadButton = false;
    export let downloadable = false;
    export let content: Array<string> | string = "";
    export let type = "";
    export let name = "";
    export let stopped = false
    export let stopButton = false;
	import DownloadButton from './DownloadButton.svelte';
</script>

<div class="max-w-lg flex flex-wrap justify-center gap-2">
    <button
        disabled={stoppable}
        type="submit"
        class="bg-green-500 rounded-md px-4 py-2 transition duration-300 hover:bg-green-300 disabled:opacity-20 disabled:hover:bg-green-700"
    >
        Start
    </button>
    {#if downloadButton === true}
        <DownloadButton bind:downloadable={downloadable} bind:content={content} bind:type={type} bind:name={name} />
    {/if}
    {#if stopButton === true}
        <button
            type="button"
            disabled={!stoppable}
            on:click={() => { {
                stoppable = false;
                stopped = true;
            } }}
            class="bg-red-500 rounded-md px-4 py-2 transition duration-300 hover:bg-red-300 disabled:opacity-20 disabled:hover:bg-red-500"
        >
            Stop
        </button>
    {/if}
    <slot />
</div>