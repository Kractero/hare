<script lang="ts">
    export let title: string;
    export let description: string;
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
    <script async src="https://nakiri.vercel.app/script.js" data-website-id="c3f1d5ce-9d0d-4a17-902f-41e13b841005"></script>
</svelte:head>