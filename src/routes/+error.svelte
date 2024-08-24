<script>
	import { page } from '$app/stores'
</script>

<h1 class="max-w-lg text-xl font-medium text-destructive">Ugh. I really tried. I'm sorry.</h1>
{#if $page?.error}
	<div class="my-4">
		{#if $page?.status}
			<p class="max-w-lg text-base font-medium text-destructive">Page status: {$page?.status}</p>
		{/if}
		{#if $page?.error?.message}
			<p class="max-w-lg text-base font-medium text-destructive">
				Error message: {$page?.error?.message}
			</p>
		{/if}
	</div>
{/if}

<video controls autoplay loop>
	<source src="/error.mp4" type="video/mp4" />
</video>
