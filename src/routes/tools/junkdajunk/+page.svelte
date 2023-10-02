<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { parser, sleep } from '../../../globals';
	import { handleDownload } from '$lib/download';
	import { htmlContent } from '$lib/htmlContent';
	import InputCredentials from '../../../component/InputCredentials.svelte';
	import Terminal from '../../../component/Terminal.svelte';
	const abortController = new AbortController();
	let progress: Array<string> = [];
	let main = '';
	let puppets = '';
	let regions = '';
	let mode = 'Gift';
	let openNewLinkArr: Array<string> = [];
	let counter = 0;
	let junkHtml = '';
	let downloadable = false;
	const rarities: { [key: string]: number } = {
		common: 0.5,
		uncommon: 1,
		rare: 1,
		'ultra-rare': 1,
		epic: 1
	};
	onMount(() => {
		puppets = localStorage.getItem('stationPuppets') || '';
		main = localStorage.getItem('stationMain') || '';
		regions = localStorage.getItem('stationRegionalWhitelist') || '';
		mode = localStorage.getItem('stationJDJDefault') || '';
		rarities.common = Number(localStorage.getItem('stationJDJCommon')) || 0.5;
		rarities.uncommon = Number(localStorage.getItem('stationJDJUncommon')) || 1;
		rarities.rare = Number(localStorage.getItem('stationJDJRare')) || 1;
		rarities['ultra-rare'] = Number(localStorage.getItem('stationJDJUltraRare')) || 1;
        rarities.epic = Number(localStorage.getItem('stationJDJEpic')) || 1;
	});
	onDestroy(() => abortController.abort());

	async function junkDaJunk(main: string, puppets: string) {
		let puppetsList = puppets.split('\n');
		progress = [...progress, `Initiating JunkDaJunk...`];
		const whiteList = regions.split('\n');
		progress = [
			...progress,
			`Whitelisting regions: ${whiteList.map((region) => region.trim()).join(', ')}`
		];
		const rarityArr = Object.entries(rarities);
		for (let i = 0; i < rarityArr.length; i++) {
			progress = [...progress, `${rarityArr[i][0]} junk threshold at ${rarityArr[i][1]}`];
		}
		for (let i = 0; i < puppetsList.length; i++) {
			let nation = puppetsList[i].toLowerCase().replaceAll(' ', '_');
			if (abortController.signal.aborted) {
				break;
			}
			try {
				await sleep(700);
				progress = [...progress, `---------------------------`];
				progress = [...progress, `Processing ${nation} ${i + 1}/${puppetsList.length} puppets`];
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
					await sleep(700);
					const response = await fetch(
						`https://www.nationstates.net/cgi-bin/api.cgi/?cardid=${id}&season=${season}&q=card+markets+info`,
						{
							headers: {
								'User-Agent': main
							}
						}
					);
					const xml = await response.text();
					const xmlDocument = parser.parse(xml);
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

					let junk = false;

					if (rarities.hasOwnProperty(category) && highestBid < rarities[category]) {
						junk = true;
					}
					if (parseFloat(marketValue) >= 10) junk = false;

					if (region) {
						if (whiteList.includes(region)) {
							junk = false;
						}
					}

					if (junk) {
						progress = [
							...progress,
							`${i + 1}/${
								cards.length
							} -> Junking S${season} ${category.toUpperCase()} ${id} with mv ${marketValue} and highest bid ${highestBid}`
						];
						openNewLinkArr = [
							...openNewLinkArr,
							`https://www.nationstates.net/container=${nation}/nation=${nation}/page=ajax3/a=junkcard/card=${id}/season=${season}/User_agent=${main}Script=JunkDaJunk/Author_Email=NSWA9002@gmail.com/Author_discord=9003/Author_main_nation=9003/autoclose=1`
						];
						junkHtml += `<tr><td><p>${i + 1} of ${
							cards.length
						}</p></td><td><p><a target="_blank" href="https://www.nationstates.net/container=${nation}/nation=${nation}/page=ajax3/a=junkcard/card=${id}/season=${season}/User_agent=${main}Script=JunkDaJunk/Author_Email=NSWA9002@gmail.com/Author_discord=9003/Author_main_nation=9003/autoclose=1\n">Link to Card</a></p></td></tr>\n`;
					} else {
						progress = [
							...progress,
							`${i + 1}/${cards.length} -> ${
								mode === 'Gift' ? 'Gifting' : 'Selling'
							} ${category.toUpperCase()} ${id} with mv ${marketValue} and highest bid ${highestBid}`
						];
						openNewLinkArr = [
							...openNewLinkArr,
							`https://www.nationstates.net/page=deck/container=${nation}/nation=${nation}/card=${id}/season=${season}/${
								mode === 'Gift' ? 'gift=1/' : ''
							}User_agent=${main}Script=JunkDaJunk/Author_Email=NSWA9002@gmail.com/Author_discord=9003/Author_main_nation=9003/autoclose=1`
						];
						junkHtml += `<tr><td><p>${i + 1} of ${
							cards.length
						}</p></td><td><p><a target="_blank" href="https://www.nationstates.net/page=deck/container=${nation}/nation=${nation}/card=${id}/season=${season}/${
							mode === 'Gift' ? 'gift=1/' : ''
						}User_agent=${main}Script=JunkDaJunk/Author_Email=NSWA9002@gmail.com/Author_discord=9003/Author_main_nation=9003/autoclose=1\n">Link to Card</a></p></td></tr>\n`;
					}
				}
			} catch (err) {
				progress = [...progress, `Error processing ${nation} with ${err}`];
			}
		}
		progress = [...progress, `Finished processing`];
		downloadable = true;
	}
</script>

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
		<InputCredentials bind:main bind:puppets authenticated={false} />
		<div class="flex gap-4 justify-between max-w-lg">
			<label class="w-24" for="regions">Regional Whitelist</label>
			<textarea
				name="regions"
				id="regions"
				rows="10"
				bind:value={regions}
				class="text-right text-black p-2 max-w-xs rounded-md border border-black dark:border-none"
			/>
		</div>
		<div class="flex gap-4 justify-between max-w-lg">
			<label class="w-24" for="pup">Rarity Threshold</label>
			<div class="flex flex-col gap-4">
				<div class="flex items-center gap-4 justify-between max-w-lg">
					<label class="w-24" for="common">Common</label>
					<input
						name="common"
						required
						id="common"
						bind:value={rarities.common}
						class="text-black p-1 w-20 rounded-md border border-black dark:border-none"
					/>
				</div>
				<div class="flex items-center gap-4 justify-between max-w-lg">
					<label class="w-24" for="uncommon">Uncommon</label>
					<input
						name="uncommon"
						required
						id="uncommon"
						bind:value={rarities.uncommon}
						class="text-black p-1 w-20 rounded-md border border-black dark:border-none"
					/>
				</div>
				<div class="flex items-center gap-4 justify-between max-w-lg">
					<label class="w-24" for="rare">Rare</label>
					<input
						name="rare"
						required
						id="rare"
						bind:value={rarities.rare}
						class="text-black p-1 w-20 rounded-md border border-black dark:border-none"
					/>
				</div>
				<div class="flex items-center gap-4 justify-between max-w-lg">
					<label class="w-24" for="ultra-rare">Ultra-Rare</label>
					<input
						name="ultra-rare"
						required
						id="ultra-rare"
						bind:value={rarities['ultra-rare']}
						class="text-black p-1 w-20 rounded-md border border-black dark:border-none"
					/>
				</div>
				<div class="flex items-center gap-4 justify-between max-w-lg">
					<label class="w-24" for="epic">Epic</label>
					<input
						name="epic"
						required
						id="epic"
						bind:value={rarities.epic}
						class="text-black p-1 w-20 rounded-md border border-black dark:border-none"
					/>
				</div>
			</div>
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
		<div class="max-w-lg flex justify-center gap-2">
			<button
				type="submit"
				class="bg-green-500 rounded-md px-4 py-2 transition duration-300 hover:bg-green-300"
			>
				Start
			</button>
			<button
				disabled={progress.length === 0}
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
		</div>
	</form>
	<Terminal bind:progress={progress} />
</div>