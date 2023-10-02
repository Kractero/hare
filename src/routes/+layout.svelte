<script>
	import ViewTransition from './navigation.svelte';
	import '../app.css';
	import Header from '$lib/component/Header.svelte';
	import Head from '$lib/component/Head.svelte';
</script>

<Head title={"Hare"} description={"Humble Automated Runner for Executing nationstates scripts. A central location to run NationStates scripts."} />

<div class="max-w-xs sm:max-w-5xl flex flex-col p-4 relative">
	<ViewTransition />
	<Header />
	<slot />
</div>