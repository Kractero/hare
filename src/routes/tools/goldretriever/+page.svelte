<script lang="ts">
	import { handleDownload } from '$lib/download';
	import { htmlContent } from '$lib/htmlContent';
	import { onDestroy, onMount } from 'svelte';
	import InputCredentials from '../../../component/InputCredentials.svelte';
	import { parser, sleep } from '../../../globals';
	import { sort } from '$lib/sortFunctionString';
	import { style } from '$lib/sortFunctionString';
	import Terminal from '../../../component/Terminal.svelte';
	const abortController = new AbortController();
	let progress: Array<string> = [];
	let main = '';
	let puppets = '';
	let password = '';
	let downloadable = false;
	let content = `<tr><th>Nation</th><th class='sort' data-order='none'>Bank</th><th class='sort' data-order='none'>Deck Value</th><th class='sort' data-order='none'>Junk Value</th><th class='sort' data-order='none'>Card Count</th></tr>\n`;

	onMount(() => {
		puppets = localStorage.getItem('stationPuppets') || '';
		main = localStorage.getItem('stationMain') || '';
		// password = localStorage.getItem("stationPassword") || ""
	});

	onDestroy(() => abortController.abort());

	async function goldRetriever(main: string, puppets: string, password?: string) {
		let userAgent = `${main} Gotissues Written by 9003, Email NSWA9002@gmail.com,discord: 9003, NSNation 9003`;
		let puppetList = puppets.split('\n');
		for (let i = 0; i < puppetList.length; i++) {
			let nation = puppetList[i];
			if (!password) {
				nation = puppetList[i].split(',')[0];
				password = puppetList[i].split(',')[1];
			}
			if (abortController.signal.aborted) {
				break;
			}
			const nation_formatted = nation.toLowerCase().replaceAll(' ', '_');
			try {
				await sleep(700);
				progress = [...progress, `Processing ${nation} ${i + 1}/${puppetList.length}`];
				const response = await fetch(
					'https://www.nationstates.net/cgi-bin/api.cgi/?nationname=' +
						nation +
						'&q=cards+deck+info',
					{
						method: 'GET',
						headers: {
							'User-Agent': userAgent
							// "X-Password": password ? password.replace(" ", "_") : "",
						}
					}
				);
				const xml = await response.text();
				const xmlObj = parser.parse(xml);
				const deck = {
					nation: nation,
					bank: 0,
					deckValue: 0,
					junkValue: 0,
					cardCount: 0
				};

				const categoryCounts: { [key: string]: number } = {};
				if (xmlObj.CARDS.DECK.CARD) {
					const deckObj = xmlObj.CARDS.DECK.CARD;
					for (let i = 0; i < deckObj.length; i++) {
						const category = deckObj[i].CATEGORY;
						if (categoryCounts[category]) {
							categoryCounts[category] += 1;
						} else {
							categoryCounts[category] = 1;
						}
					}
					deck.junkValue =
						(categoryCounts.legendary || 0) * 1 +
						(categoryCounts.epic || 0) * 0.5 +
						(categoryCounts.common || 0) * 0.01 +
						(categoryCounts.uncommon || 0) * 0.05 +
						(categoryCounts['ultra-rare'] || 0) * 0.2;

					deck.bank = xmlObj.CARDS.INFO.BANK;
					deck.deckValue = xmlObj.CARDS.INFO.DECK_VALUE;
					deck.cardCount = xmlObj.CARDS.INFO.NUM_CARDS;
				}
				content += `<tr><td><a target='_blank' href='https://www.nationstates.net/container=${nation_formatted}/nation=${nation_formatted}'>${deck.nation}</a></td><td><a target='_blank' href='https://www.nationstates.net/page=deck/container=${nation_formatted}/nation=${nation_formatted}/value_deck=1'>${deck.bank}</a></td><td><a target='_blank' href='https://www.nationstates.net/page=deck/container=${nation_formatted}/nation=${nation_formatted}/value_deck=1'>${deck.deckValue}</a></td><td><a target='_blank' href='https://www.nationstates.net/page=deck/container=${nation_formatted}/nation={container_url}'>${deck.junkValue}</a></td><td><a target='_blank' href='https://www.nationstates.net/container=${nation_formatted}/nation=${nation_formatted}'>${deck.cardCount}</a></td></tr>\n`;
			} catch (err) {
				progress = [...progress, `Error processing ${nation} with ${err}`];
			}
		}
		progress = [...progress, `Finished processing`];
		downloadable = true;
	}
</script>

<h1 class="text-4xl mb-2">Gold Retriever</h1>
<p class="text-xs mb-4">
	<a class="underline" href="https://colab.research.google.com/drive/1Rrd20eBdX-MvLkUHJGHhIdJP3SrjPbtE" target="_blank" rel="noreferrer noopener">
		Original by ValentineZ
	</a> (python in Google Colab), 
	<a href="https://dithpri.github.io/goldretriever-web/" target="_blank" rel="noreferrer noopener">
		rewritten by Racoda in TypeScript
	</a>, rewritten also
	in JavaScript by Kractero
</p>
<p class="mb-16">Get deck value, junk value, and more of all your puppets.</p>

<div class="lg:w-[1024px] lg:max-w-5xl flex flex-col lg:flex-row gap-8 break-normal">
	<form
		on:submit|preventDefault={() => goldRetriever(main, puppets, password)}
		class="flex flex-col gap-8"
	>
		<InputCredentials bind:main bind:puppets bind:password authenticated={false} />
		<div class="max-w-lg flex justify-center gap-2">
			<button
				type="submit"
				class="bg-green-500 rounded-md px-4 py-2 transition duration-300 hover:bg-green-300"
			>
				Start
			</button>
			<button disabled={!downloadable} on:click={() => handleDownload('html', htmlContent(content, style, sort), 'Gold Retriever')}
				class="bg-green-500 rounded-md px-4 py-2 transition duration-300 hover:bg-green-300 disabled:opacity-20 disabled:hover:bg-green-500">
				Download
			</button>
		</div>
	</form>
	<Terminal bind:progress={progress} />
</div>
