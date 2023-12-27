<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import Buttons from '$lib/component/Buttons.svelte';
	import Terminal from '$lib/component/Terminal.svelte';
	import type { PageData } from './$types';
	import { pushHistory } from '$lib/helpers/utils';
	import ToolContent from '$lib/component/ToolContent.svelte';
	import Select from '$lib/component/Select.svelte';
	import Modal from '$lib/component/Modal.svelte';
	import { trophies, trophiesDict } from '$lib/data/trophies';
	import { badges, badgesDict } from '$lib/data/badges';
	import { categories } from '$lib/data/categories';
	import Textarea from '$lib/component/Textarea.svelte';
	import QueriesModal from '$lib/component/QueriesModal.svelte';
	import { flags } from '$lib/data/flags';
	let showModal = false;
	let modalType = '';
	export let data: PageData;
	const abortController = new AbortController();
	let progress = '';
	let stoppable = false;
	let stopped = true;
	let mode = 'Cards';
	let trophySelection = 'All';
	let badgeSelection = 'All';
	let categorySelection = 'All';
	let raritiesSelection = 'All';
	let flagSelection = 'All';
  let compare = 'None'
  let compareValue = ''
	let exnation = false;

  let selectedTrophies: string[] = []
  let selectedBadges: string[] = []
  let selectedFlags: string[] = []
  let selectedCategories: string[] = []
  let selectedRarities: string[] = []
	let mottos = '';
	let names = '';
	let types = '';
	let rarities = ['Common', 'Uncommon', 'Rare', 'Ultra-Rare', 'Epic', 'Legendary'];

	let seasonIncluder: number[] = [1, 2, 3]
	function cbChange(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		if (e.currentTarget.checked) {
      seasonIncluder = [...seasonIncluder, Number(e.currentTarget.id)];
    }
		else {
      seasonIncluder = seasonIncluder.filter((season) => season !== Number(e.currentTarget.id))
    };
	}

  function selDeterminer(orig: string[], param: string[]) {
    return (orig.length === param.length || param.length === 0) ? "All" : param.includes('sans') ? "Zero" : "Choose"
  }

  function selectionCompute(selector: string, orig: string[], param: string[]) {
    if (selector === "All") return orig
    if (selector === "Zero") return ["sans"]
    return param
  }

	onMount(() => {
    mode = (data.parameters.mode && data.parameters.mode[0].toUpperCase() + data.parameters.mode.slice(1)) || "Cards";
    seasonIncluder = data.parameters.season ? data.parameters.season.split(',').map(num => Number(num)) : [1, 2, 3]
    selectedTrophies = data.parameters.trophies ? data.parameters.trophies.split(',') : []
    trophySelection = selDeterminer(trophies, selectedTrophies)
    selectedBadges = data.parameters.badges ? data.parameters.badges.split(',') : []
    badgeSelection = selDeterminer(badges, selectedBadges)
    selectedFlags = data.parameters.flags ? data.parameters.flags.split(',') : []
    flagSelection = selDeterminer(flags, selectedFlags)
    selectedCategories = data.parameters.categories ? data.parameters.categories.split(',') : []
    categorySelection = selDeterminer(categories, selectedCategories)
    selectedRarities = data.parameters.cardcategory ? data.parameters.cardcategory.split(',') : []
    raritiesSelection = selDeterminer(rarities, selectedRarities)
	});
	onDestroy(() => abortController.abort());

	async function lastactivity() {
    let season = (seasonIncluder.length === 3 ? "" : seasonIncluder.join(','))
    selectedTrophies = selectionCompute(trophySelection, trophies, selectedTrophies)
    let mappedTrophies = selectedTrophies.length !== trophies.length ? selectedTrophies.map(trophy => {
      let base = trophy.slice(0, trophy.indexOf('-')).toLowerCase()
      return `${trophiesDict[base]}${trophy.slice(trophy.indexOf('-'))}`
    }) : trophies
    selectedBadges = selectionCompute(badgeSelection, badges, selectedBadges)
    let mappedBadges = selectedBadges.length !== badges.length ? selectedBadges.map(badge => {
      return badgesDict[badge] ? badgesDict[badge] : badge.toLowerCase()
    }) : badges
    selectedCategories = selectionCompute(categorySelection, categories, selectedCategories)
    let fmtgov = selectedCategories.length !== categories.length ? selectedCategories.map(category => {
      return category.toLowerCase().replaceAll(' ', '-')
    }) : categories
    selectedFlags = selectionCompute(flagSelection, flags, selectedFlags)
    let fmtflag = selectedFlags.length !== flags.length ? selectedFlags.map(flag => flag.toLowerCase()) : flags
    selectedRarities = selectionCompute(raritiesSelection, rarities, selectedRarities)
    let fmtrare = selectedRarities.length !== rarities.length ? selectedRarities.map(rarity => rarity.toLowerCase()) : rarities
    const query = `${season ? `&season=${season}` : ""}${fmtrare.length !== rarities.length ? `&cardcategory=${fmtrare.join(',')}` : ""}${mappedTrophies.length !== trophies.length ? `&trophies=${mappedTrophies.join(',')}` : ""}${mappedBadges.length !== badges.length ? `&badges=${mappedBadges.join(',')}` : ""}${fmtgov.length !== categories.length ? `&categories=${fmtgov.join(',')}` : ""}${fmtflag.length !== flags.length ? `&flags=${fmtflag.join(',')}` : ""}`
    pushHistory(`?mode=${mode.toLowerCase()}${query}`)
    const getCards = await fetch(`https://api.sideroca.com/${mode.toLowerCase()}?${query}`)
  }
</script>

<ToolContent toolTitle="Wiz" caption="Query all your nations for their last logged in date." />

<div class="lg:w-[1024px] lg:max-w-5xl flex flex-col lg:flex-row gap-8 break-normal">
	<form on:submit|preventDefault={async () => await lastactivity()} class="flex flex-col gap-8">
		<Select name={'Mode'} options={['Cards', 'Collections']} bind:mode={mode} />
		<div class="flex gap-4 justify-between max-w-lg">
			<label class="w-24" for={mode}>Seasons</label>
			<div>
				<div class="m-1 flex gap-1">
					<label for="1">S1</label>
					<input
						class="m-1"
						checked={seasonIncluder.includes(1)}
						on:change={cbChange}
						type="checkbox"
						id="1"
					/>
				</div>
				<div class="m-1 flex gap-1">
					<label for="2">S2</label>
					<input
						class="m-1"
						checked={seasonIncluder.includes(2)}
						on:change={cbChange}
						type="checkbox"
						id="2"
					/>
				</div>
				<div class="m-1 flex gap-1">
					<label for="3">S3</label>
					<input
						class="m-1"
						checked={seasonIncluder.includes(3)}
						on:change={cbChange}
						type="checkbox"
						id="3"
					/>
				</div>
			</div>
		</div>
		<Select
			name={'Trophies'}
			options={['All', 'Zero', 'Choose']}
			bind:mode={trophySelection}
			bind:showModal
			bind:modalType
      bind:items={selectedTrophies}
		/>
		<Select
			name={'Badges'}
			options={['All', 'Zero', 'Choose']}
			bind:mode={badgeSelection}
			bind:showModal
			bind:modalType
		/>
		<Select
			name={'Categories'}
			options={['All', 'Choose']}
			bind:mode={categorySelection}
			bind:showModal
			bind:modalType
		/>
		<Select
			name={'Rarities'}
			options={['All', 'Choose']}
			bind:mode={raritiesSelection}
			bind:showModal
			bind:modalType
		/>
		<div class="flex gap-4 justify-between max-w-lg">
			<label class="w-24" for={mode}>Ex-Nation (s1)</label>
			<div>
				<div class="m-1 flex gap-1">
					<label for="1">S1</label>
					<input
						class="m-1"
						checked={false}
						on:change={() => (exnation = !exnation)}
						type="checkbox"
						id="1"
					/>
				</div>
			</div>
		</div>
		<Select
			name={'Flags'}
			options={['All', 'Choose']}
			bind:mode={flagSelection}
			bind:showModal
			bind:modalType
		/>
		<Textarea text="Motto" bind:bindValue={mottos} forValue="motto" />
		<Textarea text="Name" bind:bindValue={names} forValue="name" />
		<Textarea text="Type" bind:bindValue={types} forValue="type" />
    <Select name={'Compare'} options={['None', 'Deck', 'Collection']} bind:mode={compare} />
    {#if compare === "Deck"}
      <Textarea text="Deck" bind:bindValue={compareValue} forValue="deck" />
    {:else if compare === "Collection"}
		  <Textarea text="Collection" bind:bindValue={compareValue} forValue="coll" />
		{/if}
    <Modal bind:showModal>
			{#if modalType === 'Trophies'}
				<QueriesModal
					title="Trophies"
					searchable={true}
					addenddum={''}
					items={trophies}
					bind:selectedItems={selectedTrophies}
				/>
			{:else if modalType === 'Badges'}
				<QueriesModal
					title="Badges"
					addenddum={''}
					items={badges}
					bind:selectedItems={selectedBadges}
				/>
			{:else if modalType === 'Categories'}
				<QueriesModal
					title="categories"
					addenddum={''}
					items={categories}
					bind:selectedItems={selectedCategories}
				/>
			{:else if modalType === 'Rarities'}
				<QueriesModal
					title="Rarities"
					addenddum={'Having all rarities excluded is equal to having all rarities included.'}
					items={rarities}
					bind:selectedItems={selectedRarities}
				/>
			{:else if modalType === 'Flags'}
				<QueriesModal
					title="Flags"
					addenddum={'Having all rarities excluded is equal to having all rarities included.'}
					items={flags}
					searchable={true}
					bind:selectedItems={selectedFlags}
				/>
			{/if}
		</Modal>

		<Buttons stopButton={true} bind:stopped bind:stoppable />
	</form>
	<Terminal bind:progress />
</div>
