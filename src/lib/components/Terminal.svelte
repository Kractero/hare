<script lang="ts">
	export let progress: string | string[]
</script>

<pre
	class="focus-visible:ring-ringy inline-block w-full flex-1 whitespace-pre-wrap rounded-md border border-input bg-background px-3 py-2 font-mono text-sm font-medium ring-offset-background">{@html progress ||
		''}</pre>
