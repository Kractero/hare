<script>
	import ViewTransition from './navigation.svelte'

	import '../app.css'

	import Header from '$lib/components/Header.svelte'
	import { ModeWatcher } from 'mode-watcher'
</script>

<ModeWatcher />
<div
	class="relative mx-auto flex max-w-xs flex-col p-4 min-[385px]:max-w-sm min-[450px]:max-w-md min-[500px]:max-w-lg sm:max-w-5xl">
	<ViewTransition />
	<Header />
	<slot />
</div>
