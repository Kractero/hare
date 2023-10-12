<script lang="ts">
    export let rarities: any;
</script>

<div class="flex flex-col gap-4">
    <div class="flex items-center gap-4 justify-between max-w-lg">
        <label class="w-24" for="common">Common</label>
        <input
            name="common"
            required
            id="common"
            bind:value={rarities.common}
            class="text-black p-1 w-20 rounded-md border border-black dark:border-none"
        />
    </div>
    <div class="flex items-center gap-4 justify-between max-w-lg">
        <label class="w-24" for="uncommon">Uncommon</label>
        <input
            name="uncommon"
            required
            id="uncommon"
            bind:value={rarities.uncommon}
            class="text-black p-1 w-20 rounded-md border border-black dark:border-none"
        />
    </div>
    <div class="flex items-center gap-4 justify-between max-w-lg">
        <label class="w-24" for="rare">Rare</label>
        <input
            name="rare"
            required
            id="rare"
            bind:value={rarities.rare}
            class="text-black p-1 w-20 rounded-md border border-black dark:border-none"
        />
    </div>
    <div class="flex items-center gap-4 justify-between max-w-lg">
        <label class="w-24" for="ultra-rare">Ultra-Rare</label>
        <input
            name="ultra-rare"
            required
            id="ultra-rare"
            bind:value={rarities['ultra-rare']}
            class="text-black p-1 w-20 rounded-md border border-black dark:border-none"
        />
    </div>
    <div class="flex items-center gap-4 justify-between max-w-lg">
        <label class="w-24" for="epic">Epic</label>
        <input
            name="epic"
            required
            id="epic"
            bind:value={rarities.epic}
            class="text-black p-1 w-20 rounded-md border border-black dark:border-none"
        />
    </div>
</div>