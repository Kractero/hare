<script>
	import ViewTransition from './navigation.svelte'

	import '../app.css'

	import Header from '$lib/components/Header.svelte'
	import { ModeWatcher } from 'mode-watcher'
</script>

<ModeWatcher />
<div
	class="relative flex w-full max-w-xs flex-col min-[385px]:max-w-sm min-[385px]:p-4 min-[470px]:max-w-md min-[550px]:max-w-lg sm:max-w-5xl"
>
	<ViewTransition />
	<Header />
	<slot />
</div>
