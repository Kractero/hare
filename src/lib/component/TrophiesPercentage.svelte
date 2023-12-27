<script lang="ts">
  export let trophy: string;
  export let qualifier: string;
  export let end: string;
  export let selectedItems: string[] = []
	export let excludedItems: string[] = []
</script>

<button type="button" on:click={() => {
  if (selectedItems.includes(`${trophy}-${qualifier}`)) {
    selectedItems = selectedItems.filter(ex => ex !== `${trophy}-${qualifier}`)
    return
  }
  selectedItems = [...selectedItems, `${trophy}-${qualifier}`]
  excludedItems = excludedItems.filter(ex => ex !== trophy)
}} class={`${selectedItems.includes(`${trophy}-${qualifier}`) ? "opacity-100" : "opacity-25"}`}>{end}</button>