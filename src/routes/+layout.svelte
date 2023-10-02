<script>
	import ViewTransition from './navigation.svelte';
	import '../app.css';
	import Header from '../component/Header.svelte';
</script>

<svelte:head>
	<title>Hare</title>
	<meta name="description" content="A central location to run NationStates scripts." />
</svelte:head>

<div class="max-w-xs sm:max-w-5xl flex flex-col p-4 relative">
	<ViewTransition />
	<Header />
	<slot />
</div>
