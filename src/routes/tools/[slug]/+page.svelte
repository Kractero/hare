<script>
	import { tools } from '$lib/tools';
	/** @type {import('./$types').PageData} */
	export let data;

    let credentials = false;
    tools.forEach(tool => {
        if (tool.name === data.tool.name) {
            credentials = tool.credentials
        }
    })
</script>

<h1>{data.tool.name}</h1>
<p>{credentials}</p>