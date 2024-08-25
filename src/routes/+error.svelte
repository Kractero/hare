<script>
	import { page } from '$app/stores'
</script>

<div class="max:w-[496px] flex flex-col items-center gap-4 lg:w-[1024px] lg:max-w-5xl">
	<h1 class="max-w-lg text-xl font-medium text-destructive">Ugh. I really tried. I'm sorry.</h1>

	<img class="mx-auto w-full max-w-[496px] lg:max-w-max" alt="error" src="/hare.gif" />

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
</div>
