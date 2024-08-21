<script lang="ts">
	// import { PUBLIC_LOG_ID, PUBLIC_LOGGING_SCRIPT } from '$env/static/public'

	export let title: string
	export let description: string
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<!-- <script async src={PUBLIC_LOGGING_SCRIPT} data-website-id={PUBLIC_LOG_ID}></script> -->
</svelte:head>
