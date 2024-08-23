<script>
	import ViewTransition from './navigation.svelte'

	import '../app.css'

	import Header from '$lib/component/Header.svelte'
	import { ModeWatcher } from 'mode-watcher'
</script>

<ModeWatcher />
<div class="relative flex max-w-xs flex-col p-4 sm:max-w-5xl">
	<ViewTransition />
	<Header />
	<slot />
</div>
