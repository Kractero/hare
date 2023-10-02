<script lang="ts">
    export let progress: string[];
</script>

<pre
    class="flex-1 p-2 whitespace-pre-wrap bg-black dark:bg-gray-50 text-white dark:text-black font-medium font-mono inline-block">
    {#if progress && progress[0]}
        {#each progress as update}
            <p>{update}</p>
        {/each}
    {/if}
</pre>