<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { parser, sleep } from '$lib/globals';
	import { handleDownload } from '$lib/download';
	import { htmlContent } from '$lib/htmlContent';
	import InputCredentials from '$lib/component/InputCredentials.svelte';
	import Terminal from '$lib/component/Terminal.svelte';
	import Head from '$lib/component/Head.svelte';
	import Rarities from '$lib/component/Rarities.svelte';
	import { loadLocalStorage } from '$lib/loadLocalStorage';
	import Input from '$lib/component/Input.svelte';
	import Buttons from '$lib/component/Buttons.svelte';
	const abortController = new AbortController();
	let progress: "";
	let main = '';
	let giftee = '';
	let puppets = '';
	let regionalwhitelist = '';
	let mode = 'Gift';
	let password = '';
	let ownercount = '';
	let openNewLinkArr: Array<string> = [];
	let counter = 0;
	let junkHtml = '';
	let stoppable = false;
	let stopped = false;
	let downloadable = false;
	let rarities: { [key: string]: number } = {
		common: 0.5,
		uncommon: 1,
		rare: 1,
		'ultra-rare': 1,
		epic: 1
	};
	onMount(() => (
		{puppets, main, password, giftee, regionalwhitelist, mode, rarities, ownercount} = 
			loadLocalStorage(
				["stationPuppets", "stationMain", "stationPassword",  "stationGiftee", 
					"stationRegionalWhitelist", "stationJDJDefault", "stationJDJ", "stationOwnerCount"
				]))
	)
	onDestroy(() => abortController.abort());

	async function junkDaJunk(main: string, puppets: string) {
		downloadable = false;
		stoppable = true;
		stopped = false;
		progress = '';
		let puppetsList = puppets.split('\n');
		const whiteList = regionalwhitelist ? regionalwhitelist.split('\n') : [];
		if (whiteList.length > 0) {
			progress += `<p>Whitelisting regions: ${whiteList.map((region) => region.trim()).join(', ')}</p>`;
		}
		const rarityArr = Object.entries(rarities);
		for (let i = 0; i < rarityArr.length; i++) {
			progress += `<p>${rarityArr[i][0]} junk threshold at ${rarityArr[i][1]}</p>`;
		}
		progress += `<p class="font-bold">Initiating JunkDaJunk...</p>`;
		for (let i = 0; i < puppetsList.length; i++) {
			let currentNationXPin = ""
			let nation = puppetsList[i].toLowerCase().replaceAll(' ', '_');
			if (abortController.signal.aborted || stopped) {
				break;
			}
			try {
				await sleep(700);
				progress += `<p class="font-semibold">Processing ${nation} ${i + 1}/${puppetsList.length} puppets</p>`;
				const response = await fetch(
					`https://www.nationstates.net/cgi-bin/api.cgi/?nationname=${nation}&q=cards+deck`,
					{
						headers: {
							'User-Agent': main
						}
					}
				);
				const xml = await response.text();
				const xmlDocument = parser.parse(xml);
				const cards = xmlDocument.CARDS.DECK.CARD;
				for (let i = 0; i < cards.length; i++) {
					const id = cards[i].CARDID;
					const season = cards[i].SEASON;
					if (abortController.signal.aborted || stopped) {
						break;
					}
					await sleep(700);
					const response = await fetch(
						`https://www.nationstates.net/cgi-bin/api.cgi/?cardid=${id}&season=${season}&q=card+markets+info+owners`,
						{
							headers: {
								'User-Agent': main
							}
						}
					);
					const xml = await response.text();
					const xmlDocument = parser.parse(xml);
					const owners = new Set(xmlDocument.CARD.OWNERS.OWNER)
					const category = xmlDocument.CARD.CATEGORY;
					const marketValue = xmlDocument.CARD.MARKET_VALUE;
					const region = xmlDocument.CARD.REGION;

					let highestBid = 0;
					const markets = xmlDocument.CARD.MARKETS ? xmlDocument.CARD.MARKETS.MARKET : [];

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

					if (ownercount && Number(ownercount) < owners.size) {
						junk = false;
						reason = `, has less owners than ${ownercount}`
					}

					if (rarities.hasOwnProperty(category) && highestBid > rarities[category]) {
						junk = false;
						reason = `, has high bid.`
					}
					if (parseFloat(marketValue) > 10) {
						junk = false;
						reason = `, MV over 10.`
					};

					if (region && whiteList.includes(region)) {
						junk = false;
						reason = `, is in whitelisted ${region}.`
					}

					if (junk) {
						progress += `<p>${i + 1}/${
								cards.length
							} -> Junking S${season} ${category.toUpperCase()} ${id} with mv ${marketValue} and highest bid ${highestBid}</p>`;
						openNewLinkArr = [
							...openNewLinkArr,
							`https://www.nationstates.net/container=${nation}/nation=${nation}/page=ajax3/a=junkcard/card=${id}/season=${season}/User_agent=${main}Script=JunkDaJunk/Author_Email=NSWA9002@gmail.com/Author_discord=9003/Author_main_nation=9003/autoclose=1`
						];
						junkHtml += `<tr><td><p>${i + 1} of ${
							cards.length
						}</p></td><td><p><a target="_blank" href="https://www.nationstates.net/container=${nation}/nation=${nation}/page=ajax3/a=junkcard/card=${id}/season=${season}/User_agent=${main}Script=JunkDaJunk/Author_Email=NSWA9002@gmail.com/Author_discord=9003/Author_main_nation=9003/autoclose=1\n">Link to Card</a></p></td></tr>\n`;
					} else {
						if (mode === "Gift") {
							let token = ""
							const prepare = await fetch(
								`https://www.nationstates.net/cgi-bin/api.cgi/?nation=${nation}&cardid=${id}&season=${season}&to=${giftee}&mode=prepare&c=giftcard`,
								{
									headers: {
										'User-Agent': main,
										'X-Password': currentNationXPin ? currentNationXPin : password
									}
								}
							);
							if (!currentNationXPin) currentNationXPin = prepare.headers.get('x-pin') || "";
							const text = await prepare.text()
							const xml = parser.parse(text)
							token = xml.NATION.SUCCESS
							
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
								progress += `<p class="text-green-400">${i + 1}/${cards.length} -> Gifted S${season} ${category.toUpperCase()} ${id} with mv ${marketValue} and highest bid ${highestBid}${reason}</p>`;
							}
						} else {
							progress += `<p class="text-green-400">${i + 1}/${cards.length} -> Selling S${season} ${category.toUpperCase()} ${id} with mv ${marketValue} and highest bid ${highestBid}${reason}</p>`;
							openNewLinkArr = [
								...openNewLinkArr,
								`https://www.nationstates.net/page=deck/container=${nation}/nation=${nation}/card=${id}/season=${season}/User_agent=${main}Script=JunkDaJunk/Author_Email=NSWA9002@gmail.com/Author_discord=9003/Author_main_nation=9003/autoclose=1`
							];
							junkHtml += `<tr><td><p>${i + 1} of ${
								cards.length
							}</p></td><td><p><a target="_blank" href="https://www.nationstates.net/page=deck/container=${nation}/nation=${nation}/card=${id}/season=${season}/User_agent=${main}Script=JunkDaJunk/Author_Email=NSWA9002@gmail.com/Author_discord=9003/Author_main_nation=9003/autoclose=1\n">Link to Card</a></p></td></tr>\n`;
						}
					}
				}
			} catch (err) {
				progress += `<p class="text-red-400">Error processing ${nation} with ${err}</p>`;
			}
		}
		progress += `<p>Finished processing</p>`;
		downloadable = true;
		stoppable = false;
	}
</script>

<Head title={"Hare - JunkDaJunk"} description={"An even faster way to junk cards with JavaScript."} />

<h1 class="text-4xl mb-2">JunkDaJunk</h1>
<p class="text-xs mb-4">
	<a class="underline" href="https://github.com/jmikk/Card-Proccessor" target="_blank" rel="noreferrer noopener">
		Original by 9003
	</a>, rewritten in JS for browser use by Kractero</p>
<p class="mb-16">
	An even faster way to junk and gift/sell cards with <span class="line-through">python</span> JavaScript.
</p>

<div class="lg:w-[1024px] lg:max-w-5xl flex flex-col lg:flex-row gap-8 break-normal">
	<form on:submit|preventDefault={() => junkDaJunk(main, puppets)} class="flex flex-col gap-8">
		<InputCredentials bind:main bind:puppets authenticated={mode === "Gift" ? true : false} />
		{#if mode === "Gift"}
			<Input text={`Gift To`} bind:bindValue={giftee} forValue="giftee" required={true} />
		{/if}
		<div class="flex gap-4 justify-between max-w-lg">
			<label class="w-24" for="regions">Regional Whitelist</label>
			<textarea
				name="regions"
				id="regions"
				rows="10"
				bind:value={regionalwhitelist}
				class="text-right text-black p-2 max-w-xs rounded-md border border-black dark:border-none"
			/>
		</div>
		<Input text={`Owner Threshold`} bind:bindValue={ownercount} forValue="owner" />
		<div class="flex gap-4 justify-between max-w-lg">
			<p class="w-24">Rarity Threshold</p>
			<Rarities bind:rarities={rarities} />
		</div>
		<div class="flex gap-4 justify-between max-w-lg">
			<label class="w-24" for="mode">Mode</label>
			<select
				name="mode"
				id="mode"
				bind:value={mode}
				class="text-black p-1 w-16 rounded-md border border-black dark:border-none"
			>
				<option value="Gift" selected>Gift</option>
				<option value="Sell">Sell</option>
			</select>
		</div>
		<Buttons>
			<button
				type="button"
				disabled={!stoppable}
				on:click={() => { {
					stoppable = false;
					stopped = true;
				} }}
				class="bg-red-500 rounded-md px-4 py-2 transition duration-300 hover:bg-red-300 disabled:opacity-20 disabled:hover:bg-red-500"
			>
				Stop
			</button>
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
			<button disabled={!downloadable} on:click={() => handleDownload('html', htmlContent(junkHtml), 'junkDaJunk')}
				class="bg-green-500 rounded-md px-4 py-2 transition duration-300 hover:bg-green-300 disabled:opacity-20 disabled:hover:bg-green-500">
				Download
			</button>
		</Buttons>
	</form>
	<Terminal bind:progress={progress} />
</div>
