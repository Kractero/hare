<script lang="ts">
	import { onMount } from 'svelte'
	import { page } from '$app/state'

	onMount(() => {
		const slug = page.params.slug

		if (slug) {
			window.location.href = `/resources/guides/${slug}`
		}
	})
</script>

<img class="mx-auto w-full max-w-[496px] lg:max-w-max" alt="error" src="/hare.gif" />
