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
	let cardIDs = '';
	let mode = 'Gift';
	let openNewLinkArr: Array<string> = [];
	let counter = 0;
	let junkHtml = '';
    let downloadable = false;
	onMount(() => {
		puppets = localStorage.getItem('stationPuppets') || '';
		main = localStorage.getItem('stationMain') || '';
        cardIDs = localStorage.getItem('stationFinderList') || '';
        mode = localStorage.getItem('stationFinderDefault') || '';
	});
	onDestroy(() => abortController.abort());

	async function finder(main: string, puppets: string) {
		let puppetsList = puppets.split('\n');
		progress = [...progress, `Initiating Finder...`];
		for (let i = 0; i < puppetsList.length; i++) {
			let nation = puppetsList[i].toLowerCase().replaceAll(' ', '_');
			if (abortController.signal.aborted) {
				break;
			}
			try {
				await sleep(700);
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
                const matches = cardIDs.split('\n')
				for (let j = 0; j < cards.length; j++) {
					const id = cards[j].CARDID;
                    const season = cards[j].SEASON
                    if (matches.includes(String(id))) {
                        progress = [
                            ...progress,
                            `${j + 1}/${
                                cards.length
                            } of ${puppetsList} -> Found S${season} ${id} on ${puppetsList[i]}`
                        ];
                        openNewLinkArr = [
                            ...openNewLinkArr,
                            `https://www.nationstates.net/container=${nation}/nation=${nation}/page=ajax3/a=junkcard/card=${id}/season=${season}/User_agent=${main}Script=finder/Author_Email=NSWA9002@gmail.com/Author_discord=9003/Author_main_nation=9003/autoclose=1`
                        ];
                        junkHtml += `<tr><td><p>${i + 1} of ${
                            cards.length
                        }</p></td><td><p><a target="_blank" href="https://www.nationstates.net/page=deck/container=${nation}/nation=${nation}/card=${id}/season=${season}/${
                            mode === 'Gift' ? 'gift=1/' : ''
                        }User_agent=${main}Script=finder/Author_Email=NSWA9002@gmail.com/Author_discord=9003/Author_main_nation=9003/autoclose=1\n">Link to Card</a></p></td></tr>\n`;
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

<h1 class="text-4xl mb-2">Finder</h1>
<p class="text-xs mb-4">
	<a class="underline" href="https://github.com/Kractero/cards-utilities/blob/main/finder.py" target="_blank" rel="noreferrer noopener">
		Kractero
	</a>
<p class="mb-16">
	Find which of the specified nations have which of the specified cards.
</p>

<div class="lg:w-[1024px] lg:max-w-5xl flex flex-col lg:flex-row gap-8 break-normal">
	<form on:submit|preventDefault={() => finder(main, puppets)} class="flex flex-col gap-8">
		<InputCredentials bind:main bind:puppets authenticated={false} />
		<div class="flex gap-4 justify-between max-w-lg">
			<label class="w-24" for="regions">Card IDs to Find</label>
			<textarea
				name="regions"
				id="regions"
				rows="10"
				bind:value={cardIDs}
				class="text-right text-black p-2 max-w-xs rounded-md border border-black dark:border-none"
			/>
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
				<option value="View">View</option>
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
			<button disabled={!downloadable} type="button" on:click={() => handleDownload('html', htmlContent(junkHtml), 'finder')}
				class="bg-green-500 rounded-md px-4 py-2 transition duration-300 hover:bg-green-300 disabled:opacity-20 disabled:hover:bg-green-500">
				Download
			</button>
		</div>
	</form>
	<Terminal bind:progress={progress} />
</div>
