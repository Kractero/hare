<script lang="ts">
    export let title: string;
    export let description: string;
    import { PUBLIC_LOGGING_SCRIPT, PUBLIC_LOG_ID } from '$env/static/public';
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
    <script async src={PUBLIC_LOGGING_SCRIPT} data-website-id={PUBLIC_LOG_ID}></script>
</svelte:head>