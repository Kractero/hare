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
	import { pushHistory } from '$lib/helpers/utils';
	import Checkbox from '$lib/component/Checkbox.svelte';
	import ToolContent from '$lib/component/ToolContent.svelte';
	import OpenButton from '$lib/component/OpenButton.svelte';
	import { page } from '$app/stores';

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
	let flagwhitelist = '';
	let mode = 'Gift';
	let password = '';
	let owners = '';
	let cardcount = '';
	let raritiesMV: {[key: string]: number} = {
		common: 0.5,
		uncommon: 1,
		rare: 1,
		'ultra-rare': 1,
		epic: 1,
	};
	let raritiesLowestBid: {[key: string]: number } = {
		common: 1,
		uncommon: 1,
		rare: 1,
		'ultra-rare': 1,
		epic: 1,
	};
	let skipseason = '';
	let skipexnation = false;
	let sellContent = '';
	let finderlist = '';

	onMount(() => {
		main = $page.url.searchParams.get('main') || localStorage.getItem("main") as string || "";
		puppets = localStorage.getItem("gotissuesPuppets") as string || "";
		password = localStorage.getItem("password") as string || "";
		mode = $page.url.searchParams.get('mode') || localStorage.getItem("finderMode") as string || "Gift";
		regionalwhitelist = $page.url.searchParams.get('regions')?.replaceAll(',', '\n') || localStorage.getItem("junkdajunkRegionalWhitelist") as string || "";
		flagwhitelist = $page.url.searchParams.get('flags')?.replaceAll(',', '\n') || localStorage.getItem("junkdajunkFlagWhitelist") as string || "";
		finderlist = $page.url.searchParams.get('ids')?.replaceAll(',', '\n') || localStorage.getItem("junkdajunkFinderList") as string || "";
		giftee = $page.url.searchParams.get('giftee') || localStorage.getItem("finderGiftee") as string || "";
		raritiesMV = localStorage.getItem("junkdajunkRarities") ? JSON.parse(localStorage.getItem("junkdajunkRarities") as string) : {
            common: 0.5,
            uncommon: 1,
            rare: 1,
            'ultra-rare': 1,
            epic: 1,
        }
		raritiesLowestBid = localStorage.getItem("junkdajunkRaritiesBid")
			? JSON.parse(localStorage.getItem("junkdajunkRaritiesBid") as string)
			: localStorage.getItem("junkdajunkRarities")
				? JSON.parse(localStorage.getItem("junkdajunkRarities") as string)
				: {
					common: 0.5,
					uncommon: 1,
					rare: 1,
					'ultra-rare': 1,
					epic: 1,
        };
		owners = $page.url.searchParams.get('owners') || localStorage.getItem("junkdajunkOwnerCount") as string || "";
		cardcount = $page.url.searchParams.get('cardcount') || localStorage.getItem("junkdajunkCardCount") as string || "";
		skipseason = $page.url.searchParams.get('skipseason') || localStorage.getItem("junkdajunkOmittedSeasons") as string || "";
		skipexnation = ($page.url.searchParams.get('skipexnation') === 'true') || (localStorage.getItem("junkdajunkExnation") === 'true') || false;
	});
	onDestroy(() => abortController.abort());

	async function junkDaJunk(main: string, puppets: string) {
		pushHistory(`?main=${main}&mode=${mode}${giftee ? `&giftee=${giftee}` : ""}${owners ? `&owners=${owners}` : ""}${cardcount ? `&cardcount=${cardcount}` : ""}${regionalwhitelist ? `&regions=${regionalwhitelist.replaceAll('\n', ',')}` : ""}${flagwhitelist ? `&flags=${flagwhitelist.replaceAll('\n', ',')}` : ""}${finderlist ? `&ids=${finderlist.replaceAll('\n', ',')}` : ""}${skipseason ? `&skipseason=${skipseason}` : ""}${skipexnation ? `&skipexnation=${skipexnation}` : ""}`)
		downloadable = false;
		stoppable = true;
		stopped = false;
		progress = '';
		junkHtml = '';
		sellContent = '';
		const interimSells = [];
		let puppetList = puppets.split('\n');
		let failedGiftCount = 0;
		const whiteList = regionalwhitelist ? regionalwhitelist.split('\n') : [];
		if (whiteList.length > 0) {
			progress += `<p>Whitelisting regions: ${whiteList.map((region) => region.trim()).join(', ')}</p>`;
		}
		const fwhiteList = flagwhitelist ? flagwhitelist.split('\n') : [];
		if (fwhiteList.length > 0) {
			progress += `<p>Whitelisting regions: ${fwhiteList.map((flag) => flag.trim()).join(', ')}</p>`;
		}
		const toFind = finderlist ? finderlist.split('\n') : [];
		if (toFind.length > 0) {
			progress += `<p>Whitelisting cards: ${toFind.map((flag) => flag.trim()).join(', ')}</p>`;
		}
		const findSplit = finderlist.split('\n').map(matcher => matcher.split(','))
		if (skipseason.length > 0) {
			progress += `<p>Skipping seasons:`
			for (let i = 0; i < skipseason.length; i++) {
				progress += `${i + 1} `
			}
		}
		if (skipexnation === true) {
			progress += `<p>Skipping s1 exnations</p>`
		}
		const rarityArr = Object.entries(raritiesMV);
		for (let i = 0; i < rarityArr.length; i++) {
			progress += `<p>${rarityArr[i][0]} junk threshold at ${rarityArr[i][1]}</p>`;
		}
		const rarityLowestBidArr = Object.entries(raritiesLowestBid);
		for (let i = 0; i < rarityLowestBidArr.length; i++) {
			progress += `<p>${rarityLowestBidArr[i][0]} junk threshold at ${rarityLowestBidArr[i][1]}</p>`;
		}
		progress += `<p class="font-bold">Initiating JunkDaJunk...</p>`;

		let currCard = 1;
		let currSellCard = 1;
		for (let i = 0; i < puppetList.length; i++) {
			let currentNationXPin = ""
			let nation = puppetList[i];
			let nationSpecificPassword = "";
			if (nation.includes(',')) {
				nation = puppetList[i].split(',')[0];
				nationSpecificPassword = puppetList[i].split(',')[1];
			}
			if (abortController.signal.aborted || stopped) {
				break;
			}
			nation = nation.toLowerCase().replaceAll(' ', '_');
			try {
				await sleep(600);
				progress += `<p class="font-semibold">Processing ${nation} ${i + 1}/${puppetList.length} puppets</p>`;
				const xmlDocument = await parseXML(`https://${localStorage.getItem("connectionUrl") || "www"}.nationstates.net/cgi-bin/api.cgi/?nationname=${nation}&q=cards+deck`, main);
				let cards: Array<Card> = xmlDocument.CARDS.DECK.CARD;
					cards = cards ? Array.isArray(cards) ? cards : [cards] : []
				if (cards && cards.length > 0 && cards.length > Number(cardcount)) {
					for (let i = 0; i < cards.length; i++) {
						const id = cards[i].CARDID;
						const season = cards[i].SEASON;
						if (abortController.signal.aborted || stopped) {
							break;
						}
						await sleep(600);
						const xmlDocument = await parseXML(`https://${localStorage.getItem("connectionUrl") || "www"}.nationstates.net/cgi-bin/api.cgi/?cardid=${id}&season=${season}&q=card+markets+info+owners`, main);
						const card: Card = xmlDocument.CARD
						const cardOwners = Array.isArray(card.OWNERS.OWNER) ? new Set(card.OWNERS.OWNER) : new Set([card.OWNERS.OWNER]);
						const category = card.CATEGORY;
						const marketValue = card.MARKET_VALUE;
						const region = String(card.REGION);
						const flag = String(card.FLAG)
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
						fwhiteList.forEach(whitelistedFlag => {
							if (flag.includes(whitelistedFlag)) {
								junk = false;
								reason = `<span class="text-blue-400">Flag is whitelisted ${flag}</span>`
							}
						})
						findSplit.forEach((findid) => {
							const matchSeason = findid[1];
							if (findid[0] === String(id)) {
								if (matchSeason) {
									if (matchSeason === String(season)) {
										junk = false;
										reason = `<span class="text-blue-400">is whitelisted card ${findid[0]} season ${season}</span>`
									}
								} else {
									junk = false;
									reason = `<span class="text-blue-400">is whitelisted card ${findid}</span>`
								}
							}
						})
						if (skipseason.includes(String(season))) {
							junk = false;
							reason = `<span class="text-blue-400">is ignored season ${season}</span>`
						}
						if (owners && Number(owners) > cardOwners.size) {
							junk = false;
							reason = `<span class="text-blue-400">has less owners than ${owners}</span>`
						}
						if (raritiesMV.hasOwnProperty(category) && Number(raritiesMV[category]) === -1) {
							junk = false;
							reason = `<span class="text-blue-400">category set to gift</span>`
						}
						if (raritiesMV.hasOwnProperty(category) && parseFloat(marketValue) >= Number(raritiesMV[category])) {
							junk = false;
							reason = `<span class="text-blue-400">has mv exceeding threshold</span>`
						}
						if (raritiesLowestBid.hasOwnProperty(category) && highestBid >= Number(raritiesLowestBid[category])) {
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
								`https://${localStorage.getItem("connectionUrl") || "www"}.nationstates.net/container=${nation}/nation=${nation}/page=ajax3/a=junkcard/card=${id}/season=${season}/User_agent=${main}Script=JunkDaJunk/Author_discord=scrambleds/Author_main_nation=Kractero/autoclose=1`
							];
							junkHtml += `<tr><td><p>${nation} | ${i + 1} of ${
								cards.length
							} (${currCard})</p></td><td><p><a target="_blank" href="https://${localStorage.getItem("connectionUrl") || "www"}.nationstates.net/container=${nation}/nation=${nation}/page=ajax3/a=junkcard/card=${id}/season=${season}/User_agent=${main}Script=JunkDaJunk/Author_discord=scrambleds/Author_main_nation=Kractero/autoclose=1\n">Link to Card</a></p></td></tr>\n`;
							currCard = currCard + 1;
						} else {
							if (mode === "Gift") {
								let giftto = giftee;
								findSplit.forEach((findid) => {
									const matchGiftee = findid[2];
									if (findid[0] === String(id)) {
										if (matchGiftee) giftto = matchGiftee
									}
								});

								let token = ""
								await sleep(600);
								const headers: {[key: string]: string} = {
									'User-Agent': main,
								}
								if (currentNationXPin) headers['X-Pin'] = currentNationXPin
								else headers['X-Password'] = nationSpecificPassword ? nationSpecificPassword : password
								const prepare = await fetch(
									`https://${localStorage.getItem("connectionUrl") || "www"}.nationstates.net/cgi-bin/api.cgi/?nation=${nation}&cardid=${id}&season=${season}&to=${giftto}&mode=prepare&c=giftcard`, {headers: headers}
								);
								if (!currentNationXPin) currentNationXPin = prepare.headers.get('x-pin') || "";
								const text = await prepare.text()
								const xml = parser.parse(text)
								token = xml.NATION.SUCCESS
								await sleep(600);
								const gift = await fetch(
									`https://${localStorage.getItem("connectionUrl") || "www"}.nationstates.net/cgi-bin/api.cgi/?nation=${nation}&cardid=${id}&season=${season}&to=${giftto}&mode=execute&c=giftcard&token=${token}`,
									{
										headers: {
											'User-Agent': main,
											'X-Pin': currentNationXPin
										}
									}
								);
								if (gift.status === 200) {
									let successfulGift = true
									await sleep(600);
									const verify = await parseXML(`https://${localStorage.getItem("connectionUrl") || "www"}.nationstates.net/cgi-bin/api.cgi/?nationname=${nation}&q=cards+deck`, main);
									let verifyCards: Array<Card> = verify.CARDS.DECK.CARD;
									verifyCards = verifyCards ? Array.isArray(verifyCards) ? verifyCards : [verifyCards] : []
									if (verifyCards && verifyCards.length > 0) {
										let ids = verifyCards.map(card => card.CARDID)
										for (let i = 0; i < ids.length; i++) {
											if (ids[i] === id) {
												successfulGift = false
												interimSells.push(
													`https://${localStorage.getItem("connectionUrl") || "www"}.nationstates.net/page=deck/container=${nation}/nation=${nation}/card=${id}/season=${season}/gift=1/User_agent=${main}Script=Finder/Author_discord=scrambleds/Author_main_nation=Kractero?giftto=${giftto}`
												);
												sellContent += `<tr><td><p>${nation} | ${failedGiftCount + 1} (${currSellCard})</p></td><td><p><a target="_blank" href="https://${localStorage.getItem("connectionUrl") || "www"}.nationstates.net/page=deck/container=${nation}/nation=${nation}/card=${id}/season=${season}/gift=1/User_agent=${main}Script=Finder/Author_discord=scrambleds/Author_main_nation=Kractero?giftto=${giftto}\n">Link to Card</a></p></td></tr>\n`;
												currSellCard = currSellCard + 1;
												progress += `<p class="text-red-400">${nation} failed to gift ${id} to ${giftto}`;
												failedGiftCount++;
											}
										}
									}
									if (successfulGift) progress += `<p class="text-green-400">${nation} gifted ${id} to ${giftto}`;
								} else {
									progress += `<p>${i + 1}/${
										cards.length
									} -> <span class="text-red-400">Failed to gift ${id} to ${giftto}</span>`;
								}
							} else {
								progress += `<p>${i + 1}/${
									cards.length
								} -> Skipping ${id} - ${reason}!`;
								if (mode === 'Sell') {
									interimSells.push(
										`https://${localStorage.getItem("connectionUrl") || "www"}.nationstates.net/page=deck/container=${nation}/nation=${nation}/card=${id}/season=${season}/User_agent=${main}Script=JunkDaJunk/Author_discord=scrambleds/Author_main_nation=Kractero`
									);
									sellContent += `<tr><td><p>${nation} | ${i + 1} of ${
										cards.length
									} (${currSellCard})</p></td><td><p><a target="_blank" href="https://${localStorage.getItem("connectionUrl") || "www"}.nationstates.net/page=deck/container=${nation}/nation=${nation}/card=${id}/season=${season}/User_agent=${main}Script=JunkDaJunk/Author_discord=scrambleds/Author_main_nation=Kractero\n">Link to Card</a></p></td></tr>\n`;
									currSellCard = currSellCard + 1;
								}
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
		progress += `<p>Finished processing ${puppetList.length} nations, adding ${currCard + currSellCard} to sheet.</p>`;
		downloadable = true;
		stoppable = false;
	}
</script>

<ToolContent toolTitle="JunkDaJunk" caption={"An even faster way to junk cards with JavaScript."} author="9003" originalBlurb="rewritten in JS for browser use by Kractero" link="https://github.com/jmikk/Card-Proccessor" additional={`<p class="text-xs mb-4">
	The card id whitelist can specify season as well with CARDID,SEASON,GIFTTO instead of just CARDID on each line.
	GIFTTO will overrule the Gift To nation if provided but to providee GIFTTO a season must be provided.
	The regional whitelist indicates regions to skip when deciding to junk cards. The card count threshold only runs Junking
	analyzing on specified nations that have over a certain amount of cards. The owner count threshold will indicate cards to skip
	that have less than the specified amount. The rarity threshold dictates when to skip based on the card's rarity and market value.
</p>
<p class="mb-2">
	For optimal use, you should use the
	<a class="underline" href="https://github.com/Kractero/userscripts/blob/main/gift.user.js" target="_blank" rel="noreferrer noopener">
		finder gift default
	</a>
	userscript when gifting.
</p>
<p class="text-xs mb-2">
	Password input is optional and will be disabled if the puppet list includes a comma for nation,password.
</p>
<h2 class="text-xl mb-16">
	Hare does not junk cards, it generates a html file of cards to junk.
</h2>`}/>

<div class="lg:w-[1024px] lg:max-w-5xl flex flex-col lg:flex-row gap-8 break-normal">
	<form on:submit|preventDefault={() => junkDaJunk(main, puppets)} class="flex flex-col gap-8">
		<InputCredentials bind:main bind:puppets bind:password authenticated={mode === "Gift" ? true : false} />
		{#if mode === "Gift"}
			<Input text={`Gift To`} bind:bindValue={giftee} forValue="giftee" required={true} />
		{/if}
		<Textarea text="Card ID Whitelist" bind:bindValue={finderlist} forValue="find" />
		<Textarea text="Regional Whitelist" bind:bindValue={regionalwhitelist} forValue="regions" />
		<Textarea text="Flag Whitelist" bind:bindValue={flagwhitelist} forValue="flags" />
		<Input text={`Card Count Threshold`} bind:bindValue={cardcount} forValue="card" />
		<Input text={`Owner Count Threshold`} bind:bindValue={owners} forValue="owner" />
		<div class="flex gap-4 justify-between max-w-lg">
			<p class="w-24">Rarity Market Value Threshold</p>
			<Rarities bind:rarities={raritiesMV} />
		</div>
		<div class="flex gap-4 justify-between max-w-lg">
			<p class="w-24">Rarity Lowest Bid Value Threshold</p>
			<Rarities bind:rarities={raritiesLowestBid} />
		</div>
		<Checkbox bind:omittedSeasons={skipseason} />
		<div class="flex flex-col lg:flex-row gap-4 justify-between max-w-lg">
            <p class="w-24">Skip S1 Exnation</p>
			<input on:change={() => skipexnation = !skipexnation} checked={skipexnation} class="m-1" type="checkbox" />
		</div>
        <Select name="Behavior" bind:mode={mode} options={['Gift', 'Sell', 'Exclude']} />
		<Buttons stopButton={true} bind:stopped={stopped} bind:stoppable={stoppable} downloadButton={true} bind:downloadable={downloadable} bind:content={junkHtml} name="junkDaJunk" >
			<OpenButton bind:counter={counter} bind:progress={progress} bind:openNewLinkArr={openNewLinkArr} />
		</Buttons>
	</form>
	<Terminal bind:progress={progress} />
</div>
