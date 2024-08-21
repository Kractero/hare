<script lang="ts">
	export let progress: string | string[];
</script>

<pre
	class="whitespace-pre-wrapfont-mono focus-visible:ring-ringy inline-block w-full flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium ring-offset-background">{@html progress ||
		''}</pre>
