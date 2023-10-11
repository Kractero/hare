<script>
	import Head from '$lib/component/Head.svelte';
	import Tools from '$lib/component/Tools.svelte';
	let searchTerm = '';
</script>

<Head title={"Hare"} description={"Browser-ready tools with Hare."} />
<div class="lg:w-[1024px] md:max-w-5xl mb-12">
<Tools bind:searchTerm={searchTerm} />
</div>