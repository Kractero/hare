<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { parseXML, sleep } from '$lib/helpers/utils';
	import Terminal from '$lib/component/Terminal.svelte';
	import Buttons from '$lib/component/Buttons.svelte';
	import { pushHistory } from '$lib/helpers/utils';
	import ToolContent from '$lib/component/ToolContent.svelte';
	import { page } from '$app/stores';
	import Input from '$lib/component/Input.svelte';
	// import Textarea from '$lib/component/Textarea.svelte';
	const abortController = new AbortController();
	let progress = "";
	let stoppable = false;
	let stopped = false;
  let downloadable = true;
	let main = '';
	let deck = '';
  let content = '';
	// let collections = '';
	onMount(() => {
		main = $page.url.searchParams.get('main') || localStorage.getItem("main") as string || "";
    deck = $page.url.searchParams.get('deck') || localStorage.getItem("orphansDeck") as string || "";
    // collections = $page.url.searchParams.get('collections') || localStorage.getItem("orphansCollection") as string || "";
	});
	onDestroy(() => abortController.abort());

	async function gotIssues() {
    // ${collections ? `&collections=${collections}` : ""}
		pushHistory(`?main=${main}${deck ? `&deck=${deck}` : ""}`)
		stoppable = true;
		stopped = false;
    downloadable = false;
    content = ""
		progress = `<p class="font-bold">Initiating Orphans...</p>`;
    let collectionList: string[] = []
    // let collectionList = collections.split('\n');

    // if (collectionList[0] === "") {
    //   const collections = await parseXML(`https://www.nationstates.net/cgi-bin/api.cgi?q=cards+collections;nationname=${deckList[0]}`, main)
    //   if (collections.CARDS.COLLECTIONS) {
    //     if (Array.isArray(collections.CARDS.COLLECTIONS.COLLECTION)) {
    //       collectionList = collections.CARDS.COLLECTIONS.COLLECTION.map((collection: { COLLECTIONID: number; }) => collection.COLLECTIONID)
    //     } else {
    //       collectionList = [collections.CARDS.COLLECTIONS.COLLECTION.COLLECTIONID]
    //     }
    //   }
    //   await sleep(600)
    // }

    const collections = await parseXML(`https://www.nationstates.net/cgi-bin/api.cgi?q=cards+collections;nationname=${deck}`, main)
    if (collections.CARDS.COLLECTIONS) {
      if (Array.isArray(collections.CARDS.COLLECTIONS.COLLECTION)) {
        collectionList = collections.CARDS.COLLECTIONS.COLLECTION.map((collection: { COLLECTIONID: number; }) => collection.COLLECTIONID)
      } else {
        collectionList = [collections.CARDS.COLLECTIONS.COLLECTION.COLLECTIONID]
      }
    }
    await sleep(600)

    const collectionCards: Array<{CARDID: number, SEASON: number}> = [];
    for (let i = 0; i < collectionList.length; i++) {
        progress += `<p>Computing collection ${collectionList[i]}</p>`
        const cards = await parseXML(`https://www.nationstates.net/cgi-bin/api.cgi?q=cards+collection;collectionid=${collectionList[i]}`, main);
        await sleep(600)
        if (cards.CARDS && cards.CARDS.COLLECTION && cards.CARDS.COLLECTION.DECK && cards.CARDS.COLLECTION.DECK.CARD) {
            if (Array.isArray(cards.CARDS.COLLECTION.DECK.CARD)) {
              cards.CARDS.COLLECTION.DECK.CARD.forEach((card: {CARDID: number, SEASON: number}) => {
                  if (card.CARDID && card.SEASON && !collectionCards.some(existingCard => existingCard.CARDID === card.CARDID && existingCard.SEASON === card.SEASON)) {
                      collectionCards.push({CARDID: card.CARDID, SEASON: card.SEASON});
                  }
              });
            } else {
              collectionCards.push({CARDID: cards.CARDS.COLLECTION.DECK.CARD.CARDID, SEASON: cards.CARDS.COLLECTION.DECK.CARD.SEASON});
            }
        }
    }

    const deckCards: Array<{CARDID: number, SEASON: number}> = [];
    const cards = await parseXML(`https://www.nationstates.net/cgi-bin/api.cgi?q=cards+deck;nationname=${deck}`, main);
    progress += `<p>Computing deck of ${deck}</p>`
    await sleep(600)
    if (cards.CARDS && cards.CARDS.DECK && cards.CARDS.DECK.CARD) {
      if (Array.isArray(cards.CARDS.DECK.CARD)) {
        cards.CARDS.DECK.CARD.forEach((card: {CARDID: number, SEASON: number}) => {
            if (card.CARDID && card.SEASON && !deckCards.some(existingCard => existingCard.CARDID === card.CARDID && existingCard.SEASON === card.SEASON)) {
                deckCards.push({CARDID: card.CARDID, SEASON: card.SEASON});
            }
        });
      } else {
        deckCards.push({CARDID: cards.CARDS.DECK.CARD.CARDID, SEASON: cards.CARDS.DECK.CARD.SEASON});
      }
    }

    const cardsNotInCollection = deckCards.filter((card) => {
      return !collectionCards.some(
        (collectionCard) =>
          collectionCard.CARDID === card.CARDID &&
          collectionCard.SEASON === card.SEASON
      );
    });

    cardsNotInCollection.forEach(card => {
      content += `<tr><td><p>S${card.SEASON} ${card.CARDID}</p></td><td><p><a target="_blank" href="https://www.nationstates.net/page=deck/card=${card.CARDID}/season=${card.SEASON}/User_agent=${main}/Script=Orphans/Generated_by=Orphans/Author_discord=scrambleds/Author_main_nation=Kractero/">Link to Card</a></p></td></tr>\n`;
    })

		progress += `<p>Found ${cardsNotInCollection.length} cards not in a collection</p>`;
		downloadable = true;
		stoppable = false;
	}
</script>

<ToolContent toolTitle="Orphans" caption="Get a list of cards not in any collection." />

<div class="lg:w-[1024px] lg:max-w-5xl flex flex-col lg:flex-row gap-8 break-normal">
	<form
		on:submit|preventDefault={() => gotIssues()}
		class="flex flex-col gap-8"
	>
    <Input text={`User Agent`} bind:bindValue={main} forValue="main" required={true} />
    <Input text="Deck" bind:bindValue={deck} forValue="deck" />
    <!-- <Textarea text="Collections" bind:bindValue={collections} forValue="collections" /> -->
		<Buttons stopButton={true} bind:stopped={stopped} bind:stoppable={stoppable} downloadButton={true} bind:downloadable={downloadable} bind:content={content} name="oirphans" />
	</form>
	<Terminal bind:progress={progress} />
</div>