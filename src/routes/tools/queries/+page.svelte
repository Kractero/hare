<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { parseXML, sleep } from '$lib/helpers/utils';
	import Buttons from '$lib/component/Buttons.svelte';
	import Terminal from '$lib/component/Terminal.svelte';
	import type { PageData } from './$types';
	import { pushHistory } from '$lib/helpers/utils';
	import ToolContent from '$lib/component/ToolContent.svelte';
	import Select from '$lib/component/Select.svelte';
	import Modal from '$lib/component/Modal.svelte';
	import { trophies } from '$lib/data/trophies';
	let showModal = false;
	export let data: PageData;
    const abortController = new AbortController();
	let puppets = '';
	let progress = "";
	let stoppable = false;
	let stopped = true;
  let mode = "Cards"
  let seasons = "All"
  let trophySelection = "All"
  let trophySearcher = ""
  let trophyTracker: {"parameters": Array<string>, "exclusions": Array<string>} = {
    "parameters": [],
    "exclusions": []
  }
  let trophyBool = "Or"
  $: {
    showModal = trophySelection === "Choose"
  }
  let seasonIncluder = [1, 2, 3]
  function cbChange(e: Event & { currentTarget: EventTarget & HTMLInputElement; }) {
    console.log(e.currentTarget.checked)
		if (e.currentTarget.checked) seasonIncluder = [...seasonIncluder, (Number(e.currentTarget.id))]
		else seasonIncluder = seasonIncluder.filter(season => season !== Number(e.currentTarget.id))
	}
	onMount(() => {
		puppets = localStorage.getItem("puppets") as string || "";
	});
    onDestroy(() => abortController.abort());

	async function lastactivity() {

	}
</script>

<ToolContent toolTitle="Wiz" caption="Query all your nations for their last logged in date." />

<div class="lg:w-[1024px] lg:max-w-5xl flex flex-col lg:flex-row gap-8 break-normal">
	<form
		on:submit|preventDefault={async () => await lastactivity()}
		class="flex flex-col gap-8"
	>
    <Select name={"Mode"} options={["Cards", "Collections"]} bind:mode={mode} />
    <div class="flex gap-4 justify-between max-w-lg">
      <label class="w-24" for={mode}>Seasons</label>
      <div>
        <div class="m-1 flex gap-1">
          <label for="1">S1</label>
          <input class="m-1" checked={seasonIncluder.includes(1)} on:change={cbChange} type="checkbox" id="1" />
        </div>
        <div class="m-1 flex gap-1">
          <label for="2">S2</label>
          <input class="m-1" checked={seasonIncluder.includes(2)} on:change={cbChange} type="checkbox" id="2" />
        </div>
        <div class="m-1 flex gap-1">
          <label for="3">S3</label>
          <input class="m-1" checked={seasonIncluder.includes(3)} on:change={cbChange} type="checkbox" id="3" />
        </div>
      </div>
    </div>
    <Select name={"Trophies"} options={["All", "Zero", "Choose"]} bind:mode={trophySelection} />
    <button on:click={() => (showModal = true)}> show modal </button>

<Modal bind:showModal>
  <p>Search and Choose Trophies</p>

  <Select name="Boolean" options={["Or", "And"]} bind:mode={trophyBool} />

  <p>Currently selected trophies:
    {trophyTracker.parameters.length === 0
      ? "All trophies"
      : trophyTracker.parameters.join(trophyBool)}
    {trophyTracker.exclusions.length > 0
      ? `, excluding ${trophyTracker.exclusions.join(', ')}`
      : ""}
  </p>

  <input class="p-2" placeholder="Search Trophies" type="search" bind:value={trophySearcher} />
  {#if trophySearcher}
    {#each trophies.filter(trophy => trophy.includes(trophySearcher)) as trophy}
      <div class="flex">
        <p>{trophy}</p>
        <div class="flex gap-2">
          <button on:click={() => {
            if (trophyTracker.exclusions.includes(trophy)) {
              trophyTracker.exclusions = trophyTracker.exclusions.filter(ex => ex !== trophy)
            } else {
              trophyTracker.parameters = trophyTracker.parameters.filter(ex => !ex.includes(trophy))
              trophyTracker.exclusions = [...trophyTracker.exclusions, trophy]
            }
          }} class={`${trophyTracker.exclusions.includes(trophy) ? "opacity-100" : "opacity-25"}`}>❌</button>
          <button on:click={() => {
            if (trophyTracker.parameters.includes(`${trophy}-1t`)) {
              trophyTracker.parameters = trophyTracker.parameters.filter(ex => ex !== `${trophy}-1t`)
              return
            }
            trophyTracker.parameters = [...trophyTracker.parameters, `${trophy}-1t`]
            trophyTracker.exclusions = trophyTracker.exclusions.filter(ex => ex !== trophy)
          }} class={`${trophyTracker.exclusions.includes(trophy) ? "opacity-100" : "opacity-25"}`}>1st</button>
          <button on:click={() => {
            if (trophyTracker.parameters.includes(`${trophy}-1`)) {
              trophyTracker.parameters = trophyTracker.parameters.filter(ex => ex !== `${trophy}-1`)
              return
            }
            trophyTracker.parameters = [...trophyTracker.parameters, `${trophy}-1`]
            trophyTracker.exclusions = trophyTracker.exclusions.filter(ex => ex !== trophy)
          }} class={`${trophyTracker.exclusions.includes(trophy) ? "opacity-100" : "opacity-25"}`}>1%</button>
          <button on:click={() => {
            if (trophyTracker.parameters.includes(`${trophy}-5`)) {
              trophyTracker.parameters = trophyTracker.parameters.filter(ex => ex !== `${trophy}-5`)
              return
            }
            trophyTracker.parameters = [...trophyTracker.parameters, `${trophy}-5`]
            trophyTracker.exclusions = trophyTracker.exclusions.filter(ex => ex !== trophy)
          }} class={`${trophyTracker.exclusions.includes(trophy) ? "opacity-100" : "opacity-25"}`}>5%</button>
          <button on:click={() => {
            if (trophyTracker.parameters.includes(`${trophy}-10`)) {
              trophyTracker.parameters = trophyTracker.parameters.filter(ex => ex !== `${trophy}-10`)
              return
            }
            trophyTracker.parameters = [...trophyTracker.parameters, `${trophy}-10`]
            trophyTracker.exclusions = trophyTracker.exclusions.filter(ex => ex !== trophy)
          }} class={`${trophyTracker.exclusions.includes(trophy) ? "opacity-100" : "opacity-25"}`}>10%</button>
        </div>
      </div>
    {/each}
  {/if}

</Modal>

		<Buttons stopButton={true} bind:stopped={stopped} bind:stoppable={stoppable} />
	</form>
	<Terminal bind:progress={progress} />
</div>
