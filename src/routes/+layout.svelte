<script>
	import '../app.css'

	import { onMount } from 'svelte'
	import Header from '$lib/components/Header.svelte'
	import { log } from '$lib/helpers/utils'
	import { ModeWatcher } from 'mode-watcher'

	onMount(() => {
		log()
		window.addEventListener('sveltekit:navigation-end', () => log())
	})

	/**
	 * @typedef {Object} Props
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let { children } = $props()
</script>

<ModeWatcher />
<div
	class="relative mx-auto flex max-w-xs flex-col p-4 min-[385px]:max-w-sm min-[450px]:max-w-md min-[500px]:max-w-lg sm:max-w-5xl">
	<Header />
	{@render children?.()}
</div>
