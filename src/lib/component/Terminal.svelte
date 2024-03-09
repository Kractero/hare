<script lang="ts">
    export let progress: string | string[];
</script>

<pre class="flex-1 p-2 whitespace-pre-wrap bg-black dark:bg-neutral-300 text-white dark:text-black font-medium font-mono inline-block">{@html progress || ""}</pre>