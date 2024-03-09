<script lang="ts">
    export let text: string;
    export let bindValue: string | number | undefined;
    export let forValue: string;
    export let required: boolean = false;
    export let disabled: boolean = false;
</script>

<div class="flex gap-4 justify-between max-w-lg">
    <label class="w-24" for={forValue}>
        {text}
        {#if text === "User Agent"}
            <span class="text-xs">(Main nation)</span>
        {/if}
    </label>
    <input
        required={required}
        id={forValue}
        bind:value={bindValue}
        disabled={disabled}
        class="text-right text-black p-2 max-w-xs rounded-md border border-black dark:border-none dark:bg-neutral-300"
    />
</div>