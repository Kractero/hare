<script lang="ts">
    export let name: string;
    export let mode: string;
    export let options: string[] = [];
</script>

<div class="flex gap-4 justify-between max-w-lg">
    <label class="w-24" for={mode}>{name}</label>
    <div class="flex gap-4 justify-between max-w-lg">
        <select
            name={mode}
            id={mode}
            bind:value={mode}
            class="text-black p-1 w-max rounded-md border border-black dark:border-none"
        >
            {#each options as option}
                <option value={option} selected>{option}</option>
            {/each}
        </select>
    </div>
</div>