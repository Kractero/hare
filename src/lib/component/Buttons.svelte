<script lang="ts">
    export let stoppable: boolean = false;
</script>

<div class="max-w-lg flex flex-wrap justify-center gap-2">
    <button
        disabled={stoppable}
        type="submit"
        class="bg-green-500 rounded-md px-4 py-2 transition duration-300 hover:bg-green-300 disabled:opacity-20 disabled:hover:bg-green-700"
    >
        Start
    </button>
    <slot />
</div>