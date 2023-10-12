<script lang="ts">
	import { handleDownload } from '$lib/helpers/download';
	import { htmlContent } from '$lib/helpers/htmlContent';
	import { onDestroy, onMount } from 'svelte';
	import InputCredentials from '$lib/component/InputCredentials.svelte';
	import { parseXML, sleep } from '$lib/helpers/utils';
	import { sort, style } from '$lib/helpers/sortFunctionString';
	import Terminal from '$lib/component/Terminal.svelte';
	import Head from '$lib/component/Head.svelte';
	import Buttons from '$lib/component/Buttons.svelte';
	import type { PageData } from './$types';
	import { pushHistory } from '$lib/helpers/utils';
	export let data: PageData;
	import type { Card, Issue } from '$lib/types';
	import Select from '$lib/component/Select.svelte';
	const abortController = new AbortController();
	let progress = "";
	let downloadable = false;
	let content = `<tr><th>Nation</th><th class='sort' data-order='none'>Bank</th><th class='sort' data-order='none'>Deck Value</th><th class='sort' data-order='none'>Junk Value</th><th class='sort' data-order='none'>Card Count</th></tr>\n`;
	let stoppable = false;
	let stopped = false;
	let main = '';
	let puppets = '';
	let password = '';
	let mode: string;
	
	onMount(() => {
		main = data.parameters.main || localStorage.getItem("main") as string || "";
		puppets = localStorage.getItem("puppets") as string || "";
		password = localStorage.getItem("password") as string || "";
		mode = data.parameters.mode || localStorage.getItem("goldretrieverMode") as string || "Include";
	});

	onDestroy(() => abortController.abort());

	async function goldRetriever() {
		pushHistory(`?main=${main}&mode=${mode}`)
		downloadable = false;
		stoppable = true;
		stopped = false;
		let puppetList = puppets.split('\n');
		let totals = {
			bank: 0,
			deckValue: 0,
			junkValue: 0,
			cardCount: 0,
			issues: 0,
			packs: 0
		}
		for (let i = 0; i < puppetList.length; i++) {
			let nation = puppetList[i];
			if (mode === "Include" && !password) {
				nation = puppetList[i].split(',')[0];
				password = puppetList[i].split(',')[1];
			}
			if (abortController.signal.aborted || stopped) {
				break;
			}
			const nation_formatted = nation.toLowerCase().replaceAll(' ', '_');
			try {
				await sleep(700);
				progress += `<p>Processing ${nation} ${i + 1}/${puppetList.length}</p>`;
				const deckInfo = await parseXML(`https://www.nationstates.net/cgi-bin/api.cgi/?nationname=${nation}&q=cards+deck+info`, main)
				const deck = {
					nation: nation,
					bank: 0,
					deckValue: 0,
					junkValue: 0,
					cardCount: 0,
					issues: 0,
					packs: 0
				};

				const categoryCounts: { [key: string]: number } = {};
				if (deckInfo.CARDS.DECK.CARD) {
					const deckObj: Array<Card> = deckInfo.CARDS.DECK.CARD;
					for (let i = 0; i < deckObj.length; i++) {
						const category = deckObj[i].CATEGORY;
						if (categoryCounts[category]) {
							categoryCounts[category] += 1;
						} else {
							categoryCounts[category] = 1;
						}
					}
					deck.junkValue =
						Number(((categoryCounts.legendary || 0) * 1 +
						(categoryCounts.epic || 0) * 0.5 +
						(categoryCounts.common || 0) * 0.01 +
						(categoryCounts.uncommon || 0) * 0.05 +
						(categoryCounts['ultra-rare'] || 0) * 0.2).toFixed(2));

					deck.bank = deckInfo.CARDS.INFO.BANK;
					deck.deckValue = deckInfo.CARDS.INFO.DECK_VALUE;
					deck.cardCount = deckInfo.CARDS.INFO.NUM_CARDS;
				}
				if (mode === "Include") {
					await sleep(700);
					const issuesAndPacks = await parseXML(`https://www.nationstates.net/cgi-bin/api.cgi/?nation=${nation}&q=issues+packs`, main, password.replaceAll(' ', '_'));
					const packs = issuesAndPacks.NATION.PACKS;
					const issues: Issue = issuesAndPacks.NATION.ISSUES.ISSUE || []
					if (issues && !Array.isArray(issues)) {
						deck.issues = 1;
					} else {
						deck.issues = issues.length
					}
					deck.packs = packs;
				}

				totals.bank = totals.bank + deck.bank
				totals.deckValue = totals.deckValue + deck.deckValue
				totals.junkValue = totals.junkValue + deck.junkValue
				totals.cardCount = totals.cardCount + deck.cardCount
				totals.issues = totals.issues + deck.issues;
				totals.packs = totals.packs + deck.packs;
				content += `<tr><td><a target='_blank' href='https://www.nationstates.net/container=${nation_formatted}/nation=${nation_formatted}'>${deck.nation}</a></td><td><a target='_blank' href='https://www.nationstates.net/page=deck/container=${nation_formatted}/nation=${nation_formatted}/value_deck=1'>${deck.bank}</a></td><td><a target='_blank' href='https://www.nationstates.net/page=deck/container=${nation_formatted}/nation=${nation_formatted}/value_deck=1'>${deck.deckValue}</a></td><td><a target='_blank' href='https://www.nationstates.net/page=deck/container=${nation_formatted}/nation={container_url}'>${deck.junkValue}</a></td><td><a target='_blank' href='https://www.nationstates.net/container=${nation_formatted}/nation=${nation_formatted}'>${deck.cardCount}</a></td></tr>\n`;
			} catch (err) {
				progress += `<p class="text-red-400">Error processing ${nation} with ${err}</p>`;
			}
		}
		progress += `<p>Finished processing! You have a cumulative ${totals.bank.toFixed(2)} bank, ${totals.deckValue.toFixed(2)} deckValue, ${totals.junkValue.toFixed(2)} junk value, and ${totals.cardCount} cards. ${mode === "Include" ? `${totals.issues} issues await you, and you have ${totals.packs} packs to open.` : ""}</p>`;
		downloadable = true;
		stoppable = false;
	}
</script>

<Head title={"Hare - Gold Retriever"} description={"Get deck value, junk value, and more of all your puppets."} />

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
		on:submit|preventDefault={() => goldRetriever()}
		class="flex flex-col gap-8"
	>
		<InputCredentials bind:main bind:puppets bind:password authenticated={mode === "Include" ? true : false}/>
		<div class="flex gap-4 justify-between max-w-lg">
            <label class="w-24" for="jdj">Issues and Packs?</label>
			<Select bind:mode={mode} options={['Include', 'Skip']} />
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
			<button disabled={!downloadable} type="button" on:click={() => handleDownload('html', htmlContent(content, style, sort), 'Gold Retriever')}
				class="bg-green-500 rounded-md px-4 py-2 transition duration-300 hover:bg-green-300 disabled:opacity-20 disabled:hover:bg-green-500">
				Download
			</button>
		</Buttons>
	</form>
	<Terminal bind:progress={progress} />
</div>
