<script lang="ts">
	import Button from './ui/button/button.svelte'
</script>

<div class="my-4 flex flex-1 flex-wrap items-center gap-1">
	<Button href="/" variant={'secondary'}>
		<span class="text-base">Home</span>
	</Button>
	<Button href="/changelog" variant={'secondary'}>
		<span class="text-base">Changelog</span>
	</Button>
	<Button href="/resources" variant={'secondary'}>
		<span class="text-base">Resources</span>
	</Button>
</div>
