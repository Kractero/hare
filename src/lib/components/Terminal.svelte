<script lang="ts">
	export let progress: string | string[]
</script>

<pre
	class="focus-visible:ring-ringy inline-block w-full max-w-[496px] flex-1 whitespace-pre-wrap rounded-md border border-input bg-secondary px-3 py-2 font-mono text-sm font-medium ring-offset-background lg:max-w-5xl">{@html progress ||
		''}</pre>
