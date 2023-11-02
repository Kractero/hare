<script lang="ts">
    export let title: string;
    export let description: string;
    import { onMount } from "svelte";
	onMount(() => {
        if (window.location.href.includes('config')) alert("Older version of the site detected. Config page exempt from redirect.")
        else {
            alert("Older version of site detected!!! PLEASE VISIT https://hare.vercel.app in the future!!! Redirecting...(visit /config to copy configuration over.)")
            if (window.location.hostname === "kractero.github.io") window.location.href = "https://hare.vercel.app" + window.location.pathname.replace('/hare', '')
        }
	})
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
    <script async src="https://nakiri.vercel.app/script.js" data-website-id="c3f1d5ce-9d0d-4a17-902f-41e13b841005"></script>
</svelte:head>
