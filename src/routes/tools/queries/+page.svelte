<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import Buttons from '$lib/component/Buttons.svelte';
	import Terminal from '$lib/component/Terminal.svelte';
	import type { PageData } from './$types';
	import { parseXML, pushHistory, sleep } from '$lib/helpers/utils';
	import ToolContent from '$lib/component/ToolContent.svelte';
	import Select from '$lib/component/Select.svelte';
	import Modal from '$lib/component/Modal.svelte';
	import { trophies, trophiesDict } from '$lib/data/trophies';
	import { badges, badgesDict } from '$lib/data/badges';
	import { categories } from '$lib/data/categories';
	import Textarea from '$lib/component/Textarea.svelte';
	import QueriesModal from '$lib/component/QueriesModal.svelte';
	import { flags } from '$lib/data/flags';

	export let data: PageData;

	// ported from card queries
	interface Card {
		id: number;
		season: number;
		name: string;
		type: string;
		motto: string;
		category: string;
		region: string;
		flag: string;
		cardcategory: string;
		description: string;
		badges: { [key: string]: string } | string;
		trophies: { [key: string]: string } | string;
		inCollection?: boolean;
	}
  function downloadCSV(data: Card[], filename: string) {
    const csvData = convertJSONToCSV(data);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
  function convertJSONToCSV(jsonData: Card[]) {
	const headers = Object.keys(jsonData[0]);
	const csvRows = [];
	csvRows.push(headers.join(','));
	jsonData.forEach((row) => {
			const values = headers.map((header) => {
					let value = row[header as keyof Card];
					if (typeof value === 'object') {
						value = JSON.stringify(value);
					}
					const escapedValue = String(value).replace(/"/g, '""');
					return `"${escapedValue}"`;
			});
			csvRows.push(values.join(','));
	});
	return csvRows.join('\n');
}

	let showModal = false;
	let modalType = '';
	const abortController = new AbortController();
	let progress = '';
	let stoppable = false;
	let stopped = true;
  let downloadable = false;

	// Selectors for card mode this could prob be a dictionary
	let mode = 'Cards';
	let trophySelection = 'All';
	let badgeSelection = 'All';
	let categorySelection = 'All';
	let raritiesSelection = 'All';
	let flagSelection = 'All';
	let compare = 'None';
	let exnation = false;
	let selectedTrophies: string[] = [];
	let selectedBadges: string[] = [];
	let selectedFlags: string[] = [];
	let selectedCategories: string[] = [];
	let selectedRarities: string[] = [];
	let mottos: string = '';
	let names = '';
	let types = '';
	let rarities = ['Common', 'Uncommon', 'Rare', 'Ultra-Rare', 'Epic', 'Legendary'];

  let cardList: Array<Card> = [];
  let query = "";

	// Collection + card params
	let decks = '';
	let collections = '';

	let seasonIncluder: number[] = [1, 2, 3];
	function seasonChange(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		if (e.currentTarget.checked) seasonIncluder = [...seasonIncluder, Number(e.currentTarget.id)];
		else seasonIncluder = seasonIncluder.filter((season) => season !== Number(e.currentTarget.id));
	}

	// determines status of checkbox on mount
	function selDeterminer(orig: string[], param: string[]) {
		return orig.length === param.length || param.length === 0
			? 'All'
			: param.includes('sans')
				? 'Zero'
				: 'Choose';
	}

	// determines what trophies are selected on submission
	function selectionCompute(selector: string, orig: string[], param: string[]) {
		if (selector === 'All') return orig;
		if (selector === 'Zero') return ['sans'];
		return param;
	}

	onMount(() => {
		mode = data.parameters.mode
			? data.parameters.mode[0].toUpperCase() + data.parameters.mode.slice(1)
			: 'Cards';
		seasonIncluder = data.parameters.season
			? data.parameters.season.split(',').map((num) => Number(num))
			: [1, 2, 3];
		selectedTrophies = data.parameters.trophies ? data.parameters.trophies.split(',') : [];
		trophySelection = selDeterminer(trophies, selectedTrophies);
		selectedBadges = data.parameters.badges ? data.parameters.badges.split(',') : [];
		badgeSelection = selDeterminer(badges, selectedBadges);
		selectedFlags = data.parameters.flag ? data.parameters.flag.split(',') : [];
		flagSelection = selDeterminer(flags, selectedFlags);
		selectedCategories = data.parameters.categories ? data.parameters.categories.split(',') : [];
		categorySelection = selDeterminer(categories, selectedCategories);
		selectedRarities = data.parameters.cardcategory ? data.parameters.cardcategory.split(',') : [];
		raritiesSelection = selDeterminer(rarities, selectedRarities);
		mottos = data.parameters.motto ? data.parameters.motto.replace(',', '\n') : '';
		names = data.parameters.name ? data.parameters.name.replace(',', '\n') : '';
		types = data.parameters.type ? data.parameters.type.replace(',', '\n') : '';
		exnation = Object.keys(data.parameters).includes('exnation');
		decks = data.parameters.deck ? data.parameters.deck.replace(',', '\n') : '';
		collections = data.parameters.collection ? data.parameters.collection.replace(',', '\n') : '';
	});
	onDestroy(() => abortController.abort());

	async function lastactivity() {
		stopped = false;
		stoppable = true;
    downloadable = false;
    progress = "";
    cardList = []
    let deckCards: Array<{ CARDID: string; SEASON: number; CATEGORY: string }> = [];
    let collectionCards: Array<{ CARDID: string; SEASON: number; CATEGORY: string }> = [];
    if (decks) {
      for (let deck of decks.split('\n')) {
        if (abortController.signal.aborted || stopped) {
          break;
        }
        progress += `<p>Gathering cards in ${deck}'s deck'</p>`;
        const cardsReq = await parseXML(
          `https://www.nationstates.net/cgi-bin/api.cgi?q=cards+${`deck;nationname=${deck}`}`,
          'Kractero'
        );
        if (!(cardsReq.CARDS.DECK && cardsReq.CARDS.DECK.CARD)) {
          progress += `<p class="text-red-400">Something is wrong with ${deck}'s deck'</p>`;
          throw new Error('Something is wrong with the collection or deck you gave');
        }
        cardsReq.CARDS.DECK.CARD.forEach(
          (card: { CARDID: string; SEASON: number; CATEGORY: string }) => {
            for (let obj of deckCards) {
              if (obj.CARDID === card.CARDID && obj.SEASON === card.SEASON) return;
            }
            deckCards.push(card);
          }
        );
        await sleep(700);
      }
    }
    if (collections) {
      for (let collection of collections.split('\n')) {
        if (abortController.signal.aborted || stopped) {
          break;
        }
        progress += `<p>Gathering cards in collection ${collection}</p>`;
        const cardsReq = await parseXML(
          `https://www.nationstates.net/cgi-bin/api.cgi?q=cards+${`collection;collectionid=${collection}`}`,
          'Kractero'
        );
        if (
          !(cardsReq.CARDS.COLLECTION && cardsReq.CARDS.COLLECTION.DECK.CARD) &&
          !(cardsReq.CARDS.DECK && cardsReq.CARDS.DECK.CARD)
        ) {
          progress += `<p class="text-red-400">Something is wrong with collection ${collection}</p>`;
          throw new Error('Something is wrong with the collection or deck you gave');
        }
        cardsReq.CARDS.COLLECTION.DECK.CARD.forEach(
          (card: { CARDID: string; SEASON: number; CATEGORY: string }) => {
            for (let obj of collectionCards) {
              if (obj.CARDID === card.CARDID && obj.SEASON === card.SEASON) return;
            }
            collectionCards.push(card);
          }
        );
        await sleep(700);
      }
    }
    if (mode === 'Cards') {
      let season = seasonIncluder.length === 3 ? '' : seasonIncluder.join(',');
      selectedTrophies = selectionCompute(trophySelection, trophies, selectedTrophies);
      let mappedTrophies =
        selectedTrophies.length !== trophies.length
          ? selectedTrophies.map((trophy) => {
              let base = trophy.slice(0, trophy.indexOf('-')).toLowerCase();
              return `${trophiesDict[base]}${trophy.slice(trophy.indexOf('-'))}`;
            })
          : trophies;
      selectedBadges = selectionCompute(badgeSelection, badges, selectedBadges);
      let mappedBadges =
        selectedBadges.length !== badges.length
          ? selectedBadges.map(badge => badge.toLowerCase().replaceAll(' ', '_'))
          : badges;
      selectedCategories = selectionCompute(categorySelection, categories, selectedCategories);
      let fmtgov =
        selectedCategories.length !== categories.length
          ? selectedCategories.map((category) => {
              return category.toLowerCase().replaceAll(' ', '-');
            })
          : categories;
      selectedFlags = selectionCompute(flagSelection, flags, selectedFlags);
      let fmtflag =
        selectedFlags.length !== flags.length
          ? selectedFlags.map((flag) => flag.toLowerCase())
          : flags;
      selectedRarities = selectionCompute(raritiesSelection, rarities, selectedRarities);
      let fmtrare =
        selectedRarities.length !== rarities.length
          ? selectedRarities.map((rarity) => rarity.toLowerCase())
          : rarities;
      let motto = !Array.isArray(mottos) ? mottos.replace('\n', ',') : '';
      let name = !Array.isArray(names) ? names.replace('\n', ',') : '';
      let type = !Array.isArray(types) ? types.replace('\n', ',') : '';
      query = `${season ? `&season=${season}` : ''}${motto ? `&motto=${motto}` : ''}${
        name ? `&name=${name}` : ''
      }${type ? `&type=${type}` : ''}${
        fmtrare.length !== rarities.length ? `&cardcategory=${fmtrare.join(',')}` : ''
      }${
        mappedTrophies.length !== trophies.length ? `&trophies=${mappedTrophies.join(',')}` : ''
      }${mappedBadges.length !== badges.length ? `&badges=${mappedBadges.join(',')}` : ''}${
        fmtgov.length !== categories.length ? `&categories=${fmtgov.join(',')}` : ''
      }${fmtflag.length !== flags.length ? `&flag=${fmtflag.join(',')}` : ''}${
        exnation === true ? `&exnation` : ''
      }`;
      pushHistory(`?mode=${mode.toLowerCase()}${query}`);
      progress += `<p class="text-blue-400">Evaluating ${query.slice(1)} with mode ${mode}...</p>`;
      if (abortController.signal.aborted || stopped) return;
      const cards = await fetch(`https://api.sideroca.com/${mode.toLowerCase()}?${query.slice(1)}`);
      const cardsJson = await cards.json();
      cardList = await Promise.all(
        (cardsJson.cards as Card[]).map(async (nation) => {
          let inCollection = undefined;
          if (collectionCards.length > 0) {
            inCollection = collectionCards.some(
              (collectionCard: { CARDID: any; SEASON: any }) =>
                collectionCard.CARDID === Number(nation.id) &&
                collectionCard.SEASON === nation.season
            );
          }
          if (deckCards.length > 0) {
            inCollection = deckCards.some(
              (collectionCard: { CARDID: any; SEASON: any }) =>
                collectionCard.CARDID === Number(nation.id) &&
                collectionCard.SEASON === nation.season
            );
          }
          return { ...nation, inCollection };
        })
      );
    }
    if (mode === 'Collections') {
      let deck = !Array.isArray(decks) ? decks.replace('\n', ',') : '';
      let collection = !Array.isArray(collections) ? collections.replace('\n', ',') : '';
      pushHistory(`?mode=${mode.toLowerCase()}${`&deck=${deck}`}${`&collection=${collection}`}`);
      query = `${`&deck=${deck}`}${`&collection=${collection}`}`
      if (abortController.signal.aborted || stopped) return;
      progress += `<p class="text-blue-400">Evaluating ${query} with mode ${mode}...</p>`;
      const cardsNotInCollection = deckCards.filter((card) => {
        return !collectionCards.some(
          (collectionCard) =>
            collectionCard.CARDID === card.CARDID && collectionCard.SEASON === card.SEASON
        );
      });
      const getCards = await fetch(
        `https://api.sideroca.com/collection?${`&deck=${deck}`}${`&collection=${collection}`}`,
        {
          signal: abortController.signal,
          body: JSON.stringify(cardsNotInCollection),
          method: 'POST'
        }
      );
      const cardsJson = await getCards.json();
      cardList = cardsJson.cards;
    }
    cardList = cardList.sort((a, b) => {
      if (a.inCollection && !b.inCollection) return 1;
      if (!a.inCollection && b.inCollection) return -1;
      if (a.inCollection && b.inCollection) {
        if (a.id === b.id) return 0;
        return a.id > b.id ? 1 : -1;
      }
      return a.id > b.id ? 1 : -1;
    });
    progress += `<p class="text-green-400">${query.slice(1)} with mode ${mode} computed and ready to download.</p>`;
    progress += `<p>Visit the <a class="text-blue-400 underline" target="_blank" rel="noreferrer noopener" href="https://sideroca.com/query?${query}">corresponding Sideroca page</a></p>`;
    downloadable = true;
    stopped = true;
		stoppable = false;
	}
</script>

<ToolContent toolTitle="Sideroca" caption="Hare embedded card queries interface." additional={`<p class="text-xs mb-16">
	Visit
	<a class="underline" href="https://sideroca.com" target="_blank" rel="noreferrer noopener">
		Sideroca
	</a>
  for the original frontend.
</p>`}/>

<div class="lg:w-[1024px] lg:max-w-5xl flex flex-col lg:flex-row gap-8 break-normal">
	<form on:submit|preventDefault={async () => await lastactivity()} class="flex flex-col gap-8">
		<Select name={'Mode'} options={['Cards', 'Collections']} bind:mode />
		{#if mode === 'Cards'}
			<div class="flex gap-4 justify-between max-w-lg">
				<label class="w-24" for={mode}>Seasons</label>
				<div>
					<div class="m-1 flex gap-1">
						<label for="1">S1</label>
						<input
							class="m-1"
							checked={seasonIncluder.includes(1)}
							on:change={seasonChange}
							type="checkbox"
							id="1"
						/>
					</div>
					<div class="m-1 flex gap-1">
						<label for="2">S2</label>
						<input
							class="m-1"
							checked={seasonIncluder.includes(2)}
							on:change={seasonChange}
							type="checkbox"
							id="2"
						/>
					</div>
					<div class="m-1 flex gap-1">
						<label for="3">S3</label>
						<input
							class="m-1"
							checked={seasonIncluder.includes(3)}
							on:change={seasonChange}
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
							checked={exnation}
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
			{#if compare === 'Deck'}
				<Textarea text="Deck" bind:bindValue={decks} forValue="deck" />
			{:else if compare === 'Collection'}
				<Textarea text="Collection" bind:bindValue={collections} forValue="coll" />
			{/if}
			<Modal bind:showModal>
				{#if modalType === 'Trophies'}
					<QueriesModal
						title="Trophies"
						searchable={true}
						addenddum={''}
						items={trophies.map(trophy => trophy.toLowerCase().replaceAll(' ', '_'))}
						bind:selectedItems={selectedTrophies}
					/>
				{:else if modalType === 'Badges'}
					<QueriesModal
						title="Badges"
						addenddum={''}
						items={badges.map(badge => badge.toLowerCase().replaceAll(' ', '_'))}
						bind:selectedItems={selectedBadges}
					/>
				{:else if modalType === 'Categories'}
					<QueriesModal
						title="categories"
						addenddum={''}
						items={categories.map(category => category.toLowerCase().replaceAll(' ', '_'))}
						bind:selectedItems={selectedCategories}
					/>
				{:else if modalType === 'Rarities'}
					<QueriesModal
						title="Rarities"
						addenddum={'Having all rarities excluded is equal to having all rarities included.'}
						items={rarities.map(rarity => rarity.toLowerCase())}
						bind:selectedItems={selectedRarities}
					/>
				{:else if modalType === 'Flags'}
					<QueriesModal
						title="Flags"
						addenddum={'Having all rarities excluded is equal to having all rarities included.'}
						items={flags.map(flag => flag.toLowerCase())}
						searchable={true}
						bind:selectedItems={selectedFlags}
					/>
				{/if}
			</Modal>
		{:else if mode === 'Collections'}
			<Textarea text="Deck" bind:bindValue={decks} forValue="deck" required />
			<Textarea text="Collections" bind:bindValue={collections} forValue="deck" required />
		{/if}

		<Buttons stopButton={true} bind:stopped bind:stoppable />
    <button disabled={!downloadable} type="button" on:click={() => {
        if (cardList.length > 0) {
          const filename = `${query}.csv`;
          downloadCSV(cardList, filename);
        }
    }}
      class="bg-green-500 rounded-md px-4 py-2 transition duration-300 hover:bg-green-300 disabled:opacity-20 disabled:hover:bg-green-500">
      Download
  </button>
	</form>
	<Terminal bind:progress />
</div>
