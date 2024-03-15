<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { parseXML, parser, sleep } from '$lib/helpers/utils';
	import InputCredentials from '$lib/component/InputCredentials.svelte';
	import Terminal from '$lib/component/Terminal.svelte';
	import Input from '$lib/component/Input.svelte';
	import Select from '$lib/component/Select.svelte';
	import Textarea from '$lib/component/Textarea.svelte';
	import type { Card } from '$lib/types';
	import { pushHistory } from '$lib/helpers/utils';
	import Buttons from '$lib/component/Buttons.svelte';
	import ToolContent from '$lib/component/ToolContent.svelte';
	import OpenButton from '$lib/component/OpenButton.svelte';
	import { page } from '$app/stores';
	const abortController = new AbortController();
	let progress = "";
	let openNewLinkArr: Array<string> = [];
	let counter = 0;
	let junkHtml = '';
    let downloadable = false;
	let stoppable = false;
	let stopped = false;
	let main = '';
	let puppets = '';
	let finderlist = '';
	let mode = 'Gift';
	let password = "";
	let giftee = "";
	onMount(() => {
		main = $page.url.searchParams.get('main') || localStorage.getItem("main") as string || "";
		puppets = localStorage.getItem("puppets") as string || "";
		finderlist = localStorage.getItem("finderList") as string || "";
		password = localStorage.getItem("password") as string || "";
		mode = $page.url.searchParams.get('mode') || localStorage.getItem("finderMode") as string || "Gift";
		giftee = $page.url.searchParams.get('giftee') || localStorage.getItem("finderGiftee") as string || "";
	});
	onDestroy(() => abortController.abort());

	async function finder(main: string, puppets: string) {
		pushHistory(`?main=${main}&mode=${mode}${giftee ? `&giftee=${giftee}`: ""}`)
		downloadable = false;
		stoppable = true;
		stopped = false;
		openNewLinkArr = [];
		let puppetList = puppets.split('\n');
		progress = "<p>Initiating Finder...</p>";
		const toFind = finderlist.split('\n');
		progress += `<p>Finding -> ${toFind.map((card) => card.trim()).join(', ')}</p>`;
		let findCount = 0;
		let failedGiftCount = 0;
		for (let i = 0; i < puppetList.length; i++) {
			let currentNationXPin = ""
			let nation = puppetList[i];
			let nationSpecificPassword = "";
			if (mode === "Include" && nation.includes(',')) {
				nation = puppetList[i].split(',')[0];
				nationSpecificPassword = puppetList[i].split(',')[1];
			}
			if (abortController.signal.aborted || stopped) {
				break;
			}
			nation = nation.toLowerCase().replaceAll(' ', '_');
			try {
				await sleep(600);
				progress += `<p>Processing ${nation} ${i + 1}/${puppetList.length} puppets</p>`;
				const xmlDocument = await parseXML(`https://${localStorage.getItem("connectionUrl") || "www"}.nationstates.net/cgi-bin/api.cgi/?nationname=${nation}&q=cards+deck`, main);
				let cards: Array<Card> = xmlDocument.CARDS.DECK.CARD;
				cards = cards ? Array.isArray(cards) ? cards : [cards] : []
				const matches = finderlist.split('\n').map(matcher => matcher.split(','))
				if (cards && cards.length > 0) {
					for (let j = 0; j < cards.length; j++) {
						const id = cards[j].CARDID;
						const season = cards[j].SEASON
						const matchingIndex = matches.findIndex(match => match[0] === String(id));
						if (matchingIndex !== -1) {
							const matchSeason = matches[matchingIndex][1];
							const matchGiftee = matches[matchingIndex][2];
							let currGiftee = matchGiftee || giftee;
							if (matchSeason && matchSeason !== String(season)) {
								progress += `<p>Found ${id} but not right season.`
							} else {
								if (mode === "Gift") {
									let token = ""
									await sleep(600);
									const headers: {[key: string]: string} = {
										'User-Agent': main,
									}
									if (currentNationXPin) headers['X-Pin'] = currentNationXPin
									else headers['X-Password'] = nationSpecificPassword ? nationSpecificPassword : password
									const prepare = await fetch(
										`https://${localStorage.getItem("connectionUrl") || "www"}.nationstates.net/cgi-bin/api.cgi/?nation=${nation}&cardid=${id}&season=${season}&to=${currGiftee}&mode=prepare&c=giftcard`, {headers: headers}
									);
									if (!currentNationXPin) currentNationXPin = prepare.headers.get('x-pin') || "";
									const text = await prepare.text()
									const xml = parser.parse(text)
									token = xml.NATION.SUCCESS
									await sleep(600);
									const gift = await fetch(
										`https://${localStorage.getItem("connectionUrl") || "www"}.nationstates.net/cgi-bin/api.cgi/?nation=${nation}&cardid=${id}&season=${season}&to=${currGiftee}&mode=execute&c=giftcard&token=${token}`,
										{
											headers: {
												'User-Agent': main,
												'X-Pin': currentNationXPin
											}
										}
									);
									if (gift.status === 200) {
										let successfulGift = true;
										await sleep(600);
										const verify = await parseXML(`https://${localStorage.getItem("connectionUrl") || "www"}.nationstates.net/cgi-bin/api.cgi/?nationname=${nation}&q=cards+deck`, main);
										let verifyCards: Array<Card> = verify.CARDS.DECK.CARD;
										verifyCards = verifyCards ? Array.isArray(verifyCards) ? verifyCards : [verifyCards] : []
										if (verifyCards && verifyCards.length > 0) {
											let ids = verifyCards.map(card => card.CARDID)
											for (let i = 0; i < ids.length; i++) {
												if (ids[i] === id) {
													successfulGift = false
													openNewLinkArr = [
														...openNewLinkArr,
														`https://${localStorage.getItem("connectionUrl") || "www"}.nationstates.net/page=deck/container=${nation}/nation=${nation}/card=${id}/season=${season}/gift=1/User_agent=${main}Script=Finder/Author_discord=scrambleds/Author_main_nation=Kractero?giftto=${currGiftee}`
													];
													junkHtml += `<tr><td><p>${failedGiftCount + 1}</p></td><td><p><a target="_blank" href="https://${localStorage.getItem("connectionUrl") || "www"}.nationstates.net/page=deck/container=${nation}/nation=${nation}/card=${id}/season=${season}/gift=1/User_agent=${main}Script=Finder/Author_discord=scrambleds/Author_main_nation=Kractero?giftto=${currGiftee}\n">Link to Card</a></p></td></tr>\n`;
													progress += `<p class="text-red-400">${nation} failed to gift ${id} to ${currGiftee}`;
													failedGiftCount++;
												}
											}
										}
										if (successfulGift) progress += `<p class="text-green-400">${nation} gifted ${id} to ${currGiftee}`;
									} else {
										progress += `<p class="text-red-400">${nation} failed to gift ${id} to ${currGiftee}`;
									}
								} else {
									progress += `<p class="text-green-400">${nation} owns ${id}!`;
									openNewLinkArr = [
										...openNewLinkArr,
										`https://${localStorage.getItem("connectionUrl") || "www"}.nationstates.net/page=deck/container=${nation}/nation=${nation}/card=${id}/season=${season}/User_agent=${main}Script=Finder/Author_discord=scrambleds/Author_main_nation=Kractero`
									];
									junkHtml += `<tr><td><p>${findCount + 1}</p></td><td><p><a target="_blank" href="https://${localStorage.getItem("connectionUrl") || "www"}.nationstates.net/page=deck/container=${nation}/nation=${nation}/card=${id}/season=${season}/User_agent=${main}Script=Finder/Author_discord=scrambleds/Author_main_nation=Kractero\n">Link to Card</a></p></td></tr>\n`;
								}
								findCount++;
							}
						}
					}
				} else {
					progress += `<p class="text-blue-400">It is likely ${nation} has 0 cards, skipping!`
				}
			} catch (err) {
				progress += `<p class="text-red-400">Error processing ${nation} with ${err}</p>`;
			}
		}
		progress += `<p>Finished processing, found ${findCount}, ${mode === "Gift" ? `with ${failedGiftCount} failed gifts` : `on mode ${mode}.`}</p>`;
		downloadable = true;
		stoppable = false;
	}
</script>

<ToolContent toolTitle="Finder" caption="Find which of the specified nations have which of the specified cards." author="Kractero" link="https://github.com/Kractero/cards-utilities/blob/main/finder.py" additional={`<p class="mb-2">
	You can specify season and nation to gift with CARDID,SEASON,GIFTTO instead of just CARDID on each line.
	GIFTTO will overrule the Gift To nation if provided.
</p>
<p class="mb-2">
	For optimal use, you should use the
	<a class="underline" href="https://github.com/Kractero/userscripts/blob/main/gift.user.js" target="_blank" rel="noreferrer noopener">
		finder gift default
	</a>
	userscript when gifting.
</p>
<p class="text-xs mb-16">
	Password input for gifting is optional and will be disabled if the puppet list includes a comma for nation,password.
</p>`} />

<div class="lg:w-[1024px] lg:max-w-5xl flex flex-col lg:flex-row gap-8 break-normal">
	<form on:submit|preventDefault={() => finder(main, puppets)} class="flex flex-col gap-8">
		<InputCredentials bind:main bind:puppets bind:password authenticated={mode === "Gift" ? true : false} />
		{#if mode === "Gift"}
			<Input text={`Gift To`} bind:bindValue={giftee} forValue="giftee" required={true} />
		{/if}
		<Textarea text="Card IDs to Find" bind:bindValue={finderlist} forValue="find" required />
        <Select name="Behavior" bind:mode={mode} options={['Gift', 'Sell']} />
		<div class="max-w-lg flex justify-center gap-2">
			<Buttons stopButton={true} bind:stopped={stopped} bind:stoppable={stoppable} downloadButton={true} bind:downloadable={downloadable} bind:content={junkHtml} type="html" name="Finder" >
				<OpenButton bind:counter={counter} bind:progress={progress} bind:openNewLinkArr={openNewLinkArr} />
			</Buttons>
		</div>
	</form>
	<Terminal bind:progress={progress} />
</div>
