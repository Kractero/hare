<script lang="ts">
    export let name: string;
    export let mode: string;
    export let options: string[] = [];
    export let showModal = false;
    export let modalType = "";
    export let items: any = [];
    async function determineModalShow(e: MouseEvent) {
        const target = ((e.target) as EventTarget & HTMLElement)
        if (target.nodeName === "OPTION") {
            if (target.getAttribute('value') === "Choose") {
                showModal = true
                modalType = name;
            } else {
                items = []
            }
        }
    }
</script>

<div class="flex gap-4 justify-between max-w-lg">
    <label class="w-24" for={mode}>{name}</label>
    <div class="flex gap-4 justify-between max-w-lg">
        <select
            name={mode}
            id={mode}
            bind:value={mode}
            on:click={(e) => determineModalShow(e)}
            class="text-black p-1 w-max rounded-md border border-black data-[theme=Dark]:border-none"
        >
            {#each options as option}
                <option value={option} selected>{option}</option>
            {/each}
        </select>
    </div>
</div>