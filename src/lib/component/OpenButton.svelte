<script lang="ts">
    export let progress = "";
    export let counter = 0;
    export let openNewLinkArr: Array<string> = []
</script>

<button
    disabled={!progress}
    type="button"
    on:click={() => {
        if (counter > openNewLinkArr.length - 1) {
            return;
        }
        window.open(openNewLinkArr[counter], '_blank');
        counter++;
    }}
    class="bg-green-500 rounded-md px-4 py-2 transition duration-300 hover:bg-green-300 disabled:opacity-20 disabled:hover:bg-green-500"
    >
    Open Available Link
</button>