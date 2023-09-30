<script>
	import { tools } from "$lib/tools";
import Tool from "../component/Tool.svelte";

</script>
<div class="w-[1024px] max-w-5xl">
    <h1 class="text-textprimary font-bold tracking-wide text-4xl mb-4">NationStates Station</h1>
    <p class="font-extralight tracking-tight">A central location to run NationStates scripts.</p>
</div>
<div class="grid grid-cols-4">
    {#each tools as tool}
        <Tool tool={tool.name} description={tool.description} />
    {/each}
</div>