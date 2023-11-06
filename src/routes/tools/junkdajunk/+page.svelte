<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { parseXML, parser, sleep } from '$lib/helpers/utils';
	import InputCredentials from '$lib/component/InputCredentials.svelte';
	import Terminal from '$lib/component/Terminal.svelte';
	import Rarities from '$lib/component/Rarities.svelte';
	import Input from '$lib/component/Input.svelte';
	import Buttons from '$lib/component/Buttons.svelte';
	const abortController = new AbortController();
	import type { Card } from '$lib/types';
	import Select from '$lib/component/Select.svelte';
	import Textarea from '$lib/component/Textarea.svelte';
	import type { PageData } from './$types';
	import { pushHistory } from '$lib/helpers/utils';
	import Checkbox from '$lib/component/Checkbox.svelte';
	import ToolContent from '$lib/component/ToolContent.svelte';
	import OpenButton from '$lib/component/OpenButton.svelte';
	export let data: PageData;
	let progress: "";
	let openNewLinkArr: Array<string> = [];
	let counter = 0;
	let junkHtml = '';
	let stoppable = false;
	let stopped = false;
	let downloadable = false;
	let main = '';
	let giftee = '';
	let puppets = '';
	let regionalwhitelist = '';
	let mode = 'Gift';
	let password = '';
	let owners = '';
	let cardcount = '';
	let rarities: {[key: string]: number};
	let skipseason = '';
	let skipexnation = false;
	let sellContent = '';
	
	onMount(() => {
		main = data.parameters.main || localStorage.getItem("main") as string || "";
		puppets = localStorage.getItem("gotissuesPuppets") as string || "";
		password = localStorage.getItem("password") as string || "";
		mode = data.parameters.mode || localStorage.getItem("finderMode") as string || "Gift";
		regionalwhitelist = data.parameters.regions?.replaceAll(',', '\n') || localStorage.getItem("junkdajunkRegionalWhitelist") as string || "";
		giftee = data.parameters.giftee || localStorage.getItem("finderGiftee") as string || "";
		rarities = localStorage.getItem("junkdajunkRarities") ? JSON.parse(localStorage.getItem("junkdajunkRarities") as string) : {
            common: 0.5,
            uncommon: 1,
            rare: 1,
            'ultra-rare': 1,
            epic: 1,
        }
		owners = data.parameters.owners || localStorage.getItem("junkdajunkOwnerCount") as string || "";
		cardcount = data.parameters.cardcount || localStorage.getItem("junkdajunkCardCount") as string || "";
		skipseason = data.parameters.skipseason || localStorage.getItem("junkdajunkOmittedSeasons") as string || "";
		skipexnation = (data.parameters.skipexnation === 'true') || (localStorage.getItem("junkdajunkExnation") === 'true') || false;
	});
	onDestroy(() => abortController.abort());

	async function junkDaJunk(main: string, puppets: string) {
		pushHistory(`?main=${main}&mode=${mode}${giftee ? `&giftee=${giftee}` : ""}${owners ? `&owners=${owners}` : ""}${cardcount ? `&cardcount=${cardcount}` : ""}${regionalwhitelist ? `&regions=${regionalwhitelist.replaceAll('\n', ',')}` : ""}${skipseason ? `&skipseason=${skipseason}` : ""}${skipexnation ? `&skipexnation=${skipexnation}` : ""}`)
		downloadable = false;
		stoppable = true;
		stopped = false;
		progress = '';
		junkHtml = '';
		sellContent = '';
		const interimSells = [];
		let puppetsList = puppets.split('\n');
		const whiteList = regionalwhitelist ? regionalwhitelist.split('\n') : [];
		if (whiteList.length > 0) {
			progress += `<p>Whitelisting regions: ${whiteList.map((region) => region.trim()).join(', ')}</p>`;
		}
		if (skipseason.length > 0) {
			progress += `<p>Skipping seasons:`
			for (let i = 0; i < skipseason.length; i++) {
				progress += `${i + 1} `
			}
		}
		if (skipexnation === true) {
			progress += `<p>Skipping s1 exnations</p>`
		}
		const rarityArr = Object.entries(rarities);
		for (let i = 0; i < rarityArr.length; i++) {
			progress += `<p>${rarityArr[i][0]} junk threshold at ${rarityArr[i][1]}</p>`;
		}
		progress += `<p class="font-bold">Initiating JunkDaJunk...</p>`;
		for (let i = 0; i < puppetsList.length; i++) {
			let currentNationXPin = ""
			let nation = puppetsList[i];
			if (!password) {
				nation = puppetsList[i].split(',')[0];
				password = puppetsList[i].split(',')[1];
			}
			if (abortController.signal.aborted || stopped) {
				break;
			}
			nation = nation.toLowerCase().replaceAll(' ', '_');
			try {
				await sleep(700);
				progress += `<p class="font-semibold">Processing ${nation} ${i + 1}/${puppetsList.length} puppets</p>`;
				const xmlDocument = await parseXML(`https://www.nationstates.net/cgi-bin/api.cgi/?nationname=${nation}&q=cards+deck`, main);
				let cards: Array<Card> = xmlDocument.CARDS.DECK.CARD;
					cards = cards ? Array.isArray(cards) ? cards : [cards] : []
				if (cards && cards.length > 0 && cards.length > Number(cardcount)) {
					for (let i = 0; i < cards.length; i++) {
						const id = cards[i].CARDID;
						const season = cards[i].SEASON;
						if (abortController.signal.aborted || stopped) {
							break;
						}
						await sleep(700);
						const xmlDocument = await parseXML(`https://www.nationstates.net/cgi-bin/api.cgi/?cardid=${id}&season=${season}&q=card+markets+info+owners`, main);
						const card: Card = xmlDocument.CARD
						const owners = new Set(card.OWNERS.OWNER)
						const category = card.CATEGORY;
						const marketValue = card.MARKET_VALUE;
						const region = String(card.REGION);

						let highestBid = 0;
						const markets = card.MARKETS ? card.MARKETS.MARKET : [];
						if (Array.isArray(markets)) {
							markets.forEach((market) => {
								if (market.TYPE === 'bid') {
									const price = parseFloat(market.PRICE);
									if (price > highestBid) {
										highestBid = price;
									}
								}
							});
						} else {
							if (markets.TYPE === 'bid') {
								const price = parseFloat(markets.PRICE);
								if (price > highestBid) {
									highestBid = price;
								}
							}
						}

						let junk = true;
						let reason = ""
						if (skipseason.includes(String(season))) {
							junk = false;
							reason = `<span class="text-blue-400">is ignored season ${season}</span>`
						}
						if (owners && Number(owners) < owners.size) {
							junk = false;
							reason = `<span class="text-blue-400">has less owners than ${owners}</span>`
						}
						if (rarities.hasOwnProperty(category) && highestBid > rarities[category]) {
							junk = false;
							reason = `<span class="text-blue-400">has high bid</span>`
						}
						if (parseFloat(marketValue) > 10) {
							junk = false;
							reason = `<span class="text-blue-400">MV over 10</span>`
						};
						if (!region && skipexnation) {
							junk = false;
							reason = `<span class="text-blue-400">S1 exnation</span>`
						}
						if (region && whiteList.includes(region)) {
							junk = false;
							reason = `<span class="text-blue-400">is in whitelisted ${region}</span>`
						}
						if (junk) {
							progress += `<p>${i + 1}/${
									cards.length
								} -> Junking S${season} ${category.toUpperCase()} ${id} with mv ${marketValue} and highest bid ${highestBid}</p>`;
							openNewLinkArr = [
								...openNewLinkArr,
								`https://www.nationstates.net/container=${nation}/nation=${nation}/page=ajax3/a=junkcard/card=${id}/season=${season}/User_agent=${main}Script=JunkDaJunk/Author_discord=scrambleds/Author_main_nation=Kractero/autoclose=1`
							];
							junkHtml += `<tr><td><p>${i + 1} of ${
								cards.length
							}</p></td><td><p><a target="_blank" href="https://www.nationstates.net/container=${nation}/nation=${nation}/page=ajax3/a=junkcard/card=${id}/season=${season}/User_agent=${main}Script=JunkDaJunk/Author_discord=scrambleds/Author_main_nation=Kractero/autoclose=1\n">Link to Card</a></p></td></tr>\n`;
						} else {
							if (mode === "Gift") {
								let token = ""
								await sleep(700);
								const headers: {[key: string]: string} = {
									'User-Agent': main,
								}
								if (currentNationXPin) headers['X-Pin'] = currentNationXPin
								else headers['X-Password'] = password
								const prepare = await fetch(
									`https://www.nationstates.net/cgi-bin/api.cgi/?nation=${nation}&cardid=${id}&season=${season}&to=${giftee}&mode=prepare&c=giftcard`, {headers: headers}
								);
								if (!currentNationXPin) currentNationXPin = prepare.headers.get('x-pin') || "";
								const text = await prepare.text()
								const xml = parser.parse(text)
								token = xml.NATION.SUCCESS
								await sleep(700);
								const gift = await fetch(
									`https://www.nationstates.net/cgi-bin/api.cgi/?nation=${nation}&cardid=${id}&season=${season}&to=${giftee}&mode=execute&c=giftcard&token=${token}`,
									{
										headers: {
											'User-Agent': main,
											'X-Pin': currentNationXPin
										}
									}
								);
								if (gift.status === 200) {
									progress += `<p>${i + 1}/${
										cards.length
									} -> <span class="text-green-400">Gifted ${id} to ${giftee}</span>`;
								} else {
									progress += `<p>${i + 1}/${
										cards.length
									} -> <span class="text-red-400">Failed to gift ${id} to ${giftee}</span>`;
								}
							} else {
								progress += `<p>${i + 1}/${
									cards.length
								} -> Skipping ${id} - ${reason}!`;
								interimSells.push(
									`https://www.nationstates.net/page=deck/container=${nation}/nation=${nation}/card=${id}/season=${season}/User_agent=${main}Script=JunkDaJunk/Author_discord=scrambleds/Author_main_nation=Kractero/autoclose=1`
								);
								sellContent += `<tr><td><p>${i + 1} of ${
									cards.length
								}</p></td><td><p><a target="_blank" href="https://www.nationstates.net/page=deck/container=${nation}/nation=${nation}/card=${id}/season=${season}/User_agent=${main}Script=JunkDaJunk/Author_discord=scrambleds/Author_main_nation=Kractero/autoclose=1\n">Link to Card</a></p></td></tr>\n`;
							}
						}
					}
				} else {
					if (cards && cards.length > 0 && cardcount) progress += `<p class="text-blue-400">${nation} has less cards than ${cardcount}, skipping!`
					else progress += `<p class="text-blue-400">It is likely ${nation} has 0 cards, skipping!`
				}
			} catch (err) {
				progress += `<p class="text-red-400">Error processing ${nation} with ${err}</p>`;
			}
		}
		junkHtml = junkHtml + sellContent;
		progress += `<p>Finished processing</p>`;
		downloadable = true;
		stoppable = false;
	}
</script>

<ToolContent toolTitle="JunkDaJunk" caption={"An even faster way to junk cards with JavaScript."} author="9003" originalBlurb="rewritten in JS for browser use by Kractero" link="https://github.com/jmikk/Card-Proccessor" additional={`<p class="text-xs mb-4 max-w-sm">
	The regional whitelist indicates regions to skip when deciding to junk cards. The card count threshold only runs Junking
	analyzing on specified nations that have over a certain amount of cards. The owner count threshold will indicate cards to skip
	that have less than the specified amount. The rarity threshold dictates when to skip based on the card's rarity and market value.
</p>
<p class="text-xs mb-16">
	Password input is optional and will be disabled if the puppet list includes a comma for nation,password.
</p>`}/>

<div class="lg:w-[1024px] lg:max-w-5xl flex flex-col lg:flex-row gap-8 break-normal">
	<form on:submit|preventDefault={() => junkDaJunk(main, puppets)} class="flex flex-col gap-8">
		<InputCredentials bind:main bind:puppets bind:password authenticated={mode === "Gift" ? true : false} />
		{#if mode === "Gift"}
			<Input text={`Gift To`} bind:bindValue={giftee} forValue="giftee" required={true} />
		{/if}
		<Textarea text="Regional Whitelist" bind:bindValue={regionalwhitelist} forValue="regions" />
		<Input text={`Card Count Threshold`} bind:bindValue={cardcount} forValue="card" />
		<Input text={`Owner Count Threshold`} bind:bindValue={owners} forValue="owner" />
		{#if rarities}
			<div class="flex gap-4 justify-between max-w-lg">
				<p class="w-24">Rarity Threshold</p>
				<Rarities bind:rarities={rarities} />
			</div>
		{/if}
		<Checkbox bind:omittedSeasons={skipseason} />
		<div class="flex flex-col lg:flex-row gap-4 justify-between max-w-lg">
            <p class="w-24">Skip S1 Exnation</p>
			<input on:change={() => skipexnation = !skipexnation} checked={skipexnation} class="m-1" type="checkbox" />
		</div>
        <Select name="Behavior" bind:mode={mode} options={['Gift', 'Sell']} />
		<Buttons stopButton={true} bind:stopped={stopped} bind:stoppable={stoppable} downloadButton={true} bind:downloadable={downloadable} bind:content={junkHtml} name="junkDaJunk" >
			<OpenButton bind:counter={counter} bind:progress={progress} bind:openNewLinkArr={openNewLinkArr} />
		</Buttons>
	</form>
	<Terminal bind:progress={progress} />
</div>