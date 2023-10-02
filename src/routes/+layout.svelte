<script>
	import ViewTransition from './navigation.svelte';
	import '../app.css';
	import Header from '$lib/component/Header.svelte';
</script>

<div class="max-w-xs sm:max-w-5xl flex flex-col p-4 relative">
	<ViewTransition />
	<Header />
	<slot />
</div>