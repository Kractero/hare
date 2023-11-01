<script lang="ts">
	import Head from "./Head.svelte";
    export let toolTitle: string;
    export let author: string = "";
    export let link: string = "";
    export let originalBlurb: string = "";
    export let caption: string;
    export let additional: string = "";
</script>
<Head title={`Hare - ${toolTitle}`} description={caption} />

<h1 class="text-4xl mb-2">{toolTitle}</h1>
<p class="text-xs mb-1">
	{#if author}
        <a class="underline" href={link} target="_blank" rel="noreferrer noopener">
            Original by {author}
        </a>
        {#if originalBlurb}
        , {originalBlurb}
        {/if}
    {/if}
</p>
<p class={`${additional ? "mb-2" : "mb-16"}`}>{caption}</p>
{#if additional}
    {@html additional}
{/if}