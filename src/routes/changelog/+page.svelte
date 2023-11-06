<script>
	import ToolContent from "$lib/component/ToolContent.svelte";
	import { changelog } from "$lib/data/changelog";
</script>
<ToolContent toolTitle="Changelog" caption="A Hare Changelog" />

<div class="lg:w-[1024px] lg:max-w-5xl flex flex-col justify-between gap-8 break-normal mb-4">
    {#each changelog as day}
        <div>
            <h2 class="font-bold text-3xl mb-2">{day.date}</h2>
            {#if day.changes.features}
                <p class="mb-2 font-semibold text-xl">Features</p>

                {#each day.changes.features as feature}
                    <p class="mb-1">{feature[0]}</p>
                    <ul class="list-disc ml-4 mb-4 text-sm">
                        <li>{feature[1]}</li>
                    </ul>
                {/each}
            {/if}
            {#if day.changes.fixes}
                <p class="mb-2 font-semibold text-xl">Fixes</p>

                {#each day.changes.fixes as fix}
                    <p class="mb-1">{fix[0]}</p>
                    <ul class="list-disc ml-4 mb-4 text-sm">
                        <li>{fix[1]}</li>
                    </ul>
                {/each}
            {/if}
        </div>
    {/each}
</div>