<script lang="ts">
    export let downloadable = false;
    export let content: Array<string> | string = "";
    import { handleDownload } from '$lib/helpers/download';
	import { htmlContent } from '$lib/helpers/htmlContent';
	import { sort, style } from '$lib/helpers/sortFunctionString';
    export let type = "html"
    export let name = ""
</script>

<button disabled={!downloadable} type="button" on:click={() => handleDownload(type, Array.isArray(content) ? content : name === "Gold Retriever" ? htmlContent(content, style, sort) : htmlContent(content), name)}
    class="bg-green-500 rounded-md px-4 py-2 transition duration-300 hover:bg-green-300 disabled:opacity-20 disabled:hover:bg-green-500">
    Download
</button>