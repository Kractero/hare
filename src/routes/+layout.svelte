<script>
	import ViewTransition from './navigation.svelte';
    import { base } from "$app/paths";
    import "../app.css";
	import Header from '../component/Header.svelte';
</script>

<svelte:head>
  <title>Cards Resources</title>
  <meta name="description" content="List of resources and guides for NationStates trading cards" />
</svelte:head>

<div class="max-w-5xl flex flex-col">
	<ViewTransition />
    <Header />
	<slot />
</div>