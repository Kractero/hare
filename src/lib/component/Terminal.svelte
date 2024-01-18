<script lang="ts">
    export let progress: string | string[];
</script>

<pre class="flex-1 p-2 whitespace-pre-wrap bg-black Dark:bg-gray-50 text-white Dark:text-black font-medium font-mono inline-block">{@html progress || ""}</pre>