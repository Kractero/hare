<script>
	import '../app.css'

	import Header from '$lib/components/Header.svelte'
	import { ModeWatcher } from 'mode-watcher'

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
