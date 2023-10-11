<script>
	import Head from '$lib/component/Head.svelte';
	import Tools from '$lib/component/Tools.svelte';
	import Linkbar from '$lib/component/Linkbar.svelte';
	let searchTerm = '';
</script>

<Head title={"Hare"} description={"Humble Automated Runner for Executing nationstates scripts. A central location to run NationStates scripts."} />

<div class="lg:w-[1024px] md:max-w-5xl mb-12">
	<h1 class="text-textprimary font-bold tracking-wide text-4xl mb-4">Hare (ハレ)</h1>
	<p class="font-extralight tracking-tight mb-1">A central location for NationStates scripts.</p>
	<Linkbar />
</div>

<Tools bind:searchTerm={searchTerm} />