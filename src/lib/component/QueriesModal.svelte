<script lang="ts">

	import Input from "./Input.svelte";
	import Select from "./Select.svelte";
	import TrophiesPercentage from "./TrophiesPercentage.svelte";

  export let title: string;
	export let addenddum: string;
	export let items: string[];
	export let searchable: boolean = false
	let bool: string = "and"
	let searchValue = "";

	export let selectedItems: string[] = []
	if (selectedItems.length === items.length) selectedItems = []
</script>

<h2>{title}</h2>

<p>{addenddum}</p>

{#if (selectedItems.length === 0 || selectedItems.length === items.length)}
<p>Query: <span class="text-xs italic">everything is implicitly included</span></p>
{:else}
<p>Query: {title.toLowerCase()}={selectedItems.join(bool === "or" ? '|' : ",")}</p>
{/if}

{#if searchable}
	{#if title === "Trophies"}
		<Select name="Boolean" options={["or", "and"]} bind:mode={bool} />
	{/if}

	<Input bind:bindValue={searchValue} forValue={title} text={`${title}` } />
      {#if searchValue}
				{#each items.filter(badge => badge.includes(searchValue.toLowerCase().replaceAll(' ', '_'))) as item}
					<div class="flex">
						<p>{item}</p>
						{#if title !== "Trophies"}
						<button type="button" on:click={() => {
							if (selectedItems.includes(item)) {
								selectedItems = selectedItems.filter(ex => ex !== item)
							} else {
								selectedItems = [...selectedItems, item]
							}
						}} class={`${selectedItems.includes(item) ? "opacity-100" : "opacity-25"}`}>✅</button>
						{/if}
					</div>
					{#if title === "Trophies"}
						<div class="flex gap-2">
							<TrophiesPercentage trophy={item} end={'1st'} qualifier={'1t'} bind:selectedItems={selectedItems} />
							<TrophiesPercentage trophy={item} end={'1%'} qualifier={'1'} bind:selectedItems={selectedItems} />
							<TrophiesPercentage trophy={item} end={'5%'} qualifier={'5'} bind:selectedItems={selectedItems} />
							<TrophiesPercentage trophy={item} end={'10%'} qualifier={'10'} bind:selectedItems={selectedItems} />
						</div>
					{/if}
				{/each}
			{/if}
{:else}

{#each items as item}
	<div class="flex">
		<p>{item}</p>
		<button type="button" on:click={() => {
			if (selectedItems.includes(item)) {
				selectedItems = selectedItems.filter(ex => ex !== item)
			} else {
				selectedItems = [...selectedItems, item]
			}
		}} class={`${selectedItems.includes(item) ? "opacity-100" : "opacity-25"}`}>✅</button>
	</div>
{/each}

{/if}