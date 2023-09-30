<script lang="ts">
	import { onDestroy } from 'svelte';
	import { abortController, parser, sleep } from '../../../globals';
	import { handleDownload } from '$lib/download';
	import { htmlContent } from '$lib/htmlContent';
	import InputCredentials from '../../../component/InputCredentials.svelte';

	let progress: Array<string> = [];
	let main = '';
	let puppets = '';

	onDestroy(() => abortController.abort());

	async function junkDaJunk(main: string, puppets: string) {
		let junkHtml = '';
		let puppetsList = puppets.split('\n');
		let openNewLinkArr = [];
		for (let i = 0; i < puppetsList.length; i++) {
			let nation = puppetsList[i].toLowerCase().replaceAll(' ', '_');
			if (abortController.signal.aborted) {
				break;
			}
			try {
				await sleep(700);
				progress = [...progress, `Processing ${nation} ${i + 1}/${puppetsList.length}`];
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
                    console.log(xmlDocument)
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
					const categoryThresholds: {[key: string]: number} = {
						common: 0.5,
						uncommon: 1,
						rare: 1,
						'ultra-rare': 1,
						epic: 1
					};

					if (
						categoryThresholds.hasOwnProperty(category) &&
						highestBid < categoryThresholds[category]
					) {
						junk = true;
					}
					if (parseFloat(marketValue) >= 10) junk = false;

					// if (region) {
					//   region = region.textContent
					//   if (region === "Testregionia") {
					//     junk = false
					//   }
					// }

					if (junk) {
						progress = [...progress, `${i + 1}/${
							cards.length
						} -> Junking S${season} ${id} with mv ${marketValue} and highest bid ${highestBid}, rarity ${category}`];
						openNewLinkArr.push(
							`https://www.nationstates.net/container=${nation}/nation=${nation}/page=ajax3/a=junkcard/card=${id}/season=${season}/User_agent=${main}Script=JunkDaJunk/Author_Email=NSWA9002@gmail.com/Author_discord=9003/Author_main_nation=9003/autoclose=1`
						);
						junkHtml += `<tr><td><p>${i + 1} of ${cards.length}</p></td><td><p><a target="_blank" href="https://www.nationstates.net/container=${nation}/nation=${nation}/page=ajax3/a=junkcard/card=${id}/season=${season}/User_agent=${main}Script=JunkDaJunk/Author_Email=NSWA9002@gmail.com/Author_discord=9003/Author_main_nation=9003/autoclose=1\n">Link to Card</a></p></td></tr>\n`;
					} else {
						progress = [...progress, `${i + 1}/${
							cards.length
						} -> Gifting ${id} with mv ${marketValue} and highest bid ${highestBid}, rarity ${category}`];
						openNewLinkArr.push(
							`https://www.nationstates.net/page=deck/container=${nation}/nation=${nation}/card=${id}/season=${season}/gift=1/User_agent=${main}Script=JunkDaJunk/Author_Email=NSWA9002@gmail.com/Author_discord=9003/Author_main_nation=9003/autoclose=1`
						);
						junkHtml += `<tr><td><p>${i + 1} of ${cards.length}</p></td><td><p><a target="_blank" href="https://www.nationstates.net/page=deck/container=${nation}/nation=${nation}/card=${id}/season=${season}/gift=1/User_agent=${main}Script=JunkDaJunk/Author_Email=NSWA9002@gmail.com/Author_discord=9003/Author_main_nation=9003/autoclose=1\n">Link to Card</a></p></td></tr>\n`;
					}
				}
			} catch (err) {
				progress = [...progress, `Error processing ${nation} with ${err}`];
			}
		}
		progress = [...progress, `Finished processing`];
		handleDownload('html', htmlContent(junkHtml), 'junkDaJunk');
	}
</script>

<h1 class="text-4xl mb-2">JunkDaJunk</h1>
<p class="mb-16">An even faster way to junk cards with python.</p>

<div class="lg:w-[1024px] lg:max-w-5xl flex flex-col lg:flex-row gap-8">
    <form on:submit={() => junkDaJunk(main, puppets)} class="flex flex-col gap-8">
        <InputCredentials bind:main={main} bind:puppets={puppets} />
    </form>
    <pre class="flex-1 p-2 whitespace-pre-wrap bg-black dark:bg-gray-50 text-white dark:text-black font-medium font-mono inline-block">
        {#if progress && progress[0]}
            {#each progress as update}
                <p>{update}</p>
            {/each}
        {/if}
    </pre>
</div>