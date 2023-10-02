<script lang="ts">
	import { handleDownload } from '$lib/download';
	import { htmlContent } from '$lib/htmlContent';
	import { onDestroy, onMount } from 'svelte';
	import InputCredentials from '../../../component/InputCredentials.svelte';
	import { parser, sleep } from '../../../globals';
	import Terminal from '../../../component/Terminal.svelte';
	const abortController = new AbortController();
	let progress: Array<string> = [];
	let main = '';
	let puppets = '';
	let password = '';
	let openNewLinkArr: Array<string> = [];
	let counter = 0;

	onMount(() => {
		puppets = localStorage.getItem('stationPuppets') || '';
		main = localStorage.getItem('stationMain') || '';
		password = localStorage.getItem('stationPassword') || '';
	});
	onDestroy(() => abortController.abort());

	async function gotIssues(main: string, puppets: string, password?: string) {
		let userAgent = `${main} Gotissues Written by 9003, Email NSWA9002@gmail.com,discord: 9003, NSNation 9003`;
		let puppetList = puppets.split('\n');
		let issuesCount = 0;
		let packsCount = 0;
		let issuesContent = '';
		let packContent = '';
		const interimPacks = [];
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
					'https://www.nationstates.net/cgi-bin/api.cgi/?nation=' + nation + '&q=issues+packs',
					{
						method: 'GET',
						headers: {
							'User-Agent': userAgent,
							'X-Password': password.replace(' ', '_')
						}
					}
				);
				const xml = await response.text();
				const xmlObj = parser.parse(xml);
				const issueIds = (xmlObj.NATION.ISSUES.ISSUE as Array<{ [key: string]: string }>).map(
					(issue) => issue['@_id']
				);
				const packs = xmlObj.NATION.PACKS;
				issueIds.forEach((issue) => {
					openNewLinkArr = [
						...openNewLinkArr,
						`https://www.nationstates.net/container=${nation_formatted}/nation=${nation_formatted}/page=show_dilemma/dilemma=${issue}/template-overall=none//User_agent=${userAgent}/Script=Gotissues/Author_Email=NSWA9002@gmail.com/Author_discord=9003/Author_main_nation=9003/`
					];
					issuesContent += `<tr><td><p>${
						issuesCount + 1
					}</p></td><td><p><a target="_blank" href="https://www.nationstates.net/container=${nation_formatted}/nation=${nation_formatted}/page=show_dilemma/dilemma=${issue}/template-overall=none//User_agent=${userAgent}/Script=Gotissues/Author_Email=NSWA9002@gmail.com/Author_discord=9003/Author_main_nation=9003/">Link to Issue</a></p></td></tr>\n`;
					issuesCount++;
				});
				if (packs) {
					for (let i = 0; i < parseInt(packs); i++) {
						interimPacks.push(
							`https://www.nationstates.net/page=deck/nation=${nation_formatted}/container=${nation_formatted}/?open_loot_box=1/template-overall=none//User_agent=${userAgent}/Script=Gotissues/Author_Email=NSWA9002@gmail.com/Author_discord=9003/Author_main_nation=9003/autoclose=1`
						);
						packContent += `<tr><td><p>${
							packsCount + 1
						}</p></td><td><p><a target="_blank" href="https://www.nationstates.net/page=deck/nation=${nation_formatted}/container=${nation_formatted}/?open_loot_box=1/template-overall=none//User_agent=${userAgent}/Script=Gotissues/Author_Email=NSWA9002@gmail.com/Author_discord=9003/Author_main_nation=9003/autoclose=1">Link to Pack</a></p></td></tr>\n`;
						packsCount++;
					}
				}
			} catch (err) {
				progress = [...progress, `Error processing ${nation} with ${err}`];
			}
		}
		openNewLinkArr = [...openNewLinkArr, ...interimPacks];
		issuesContent = issuesContent += packContent;
		progress = [...progress, `Finished processing`];
		handleDownload('html', htmlContent(issuesContent), 'gotIssues');
	}
</script>

<h1 class="text-4xl mb-4">gotIssues</h1>
<p class="text-xs mb-4">Original by 9003, rewritten in JS for browser use by Kractero</p>
<p class="mb-2">
	An even faster way to answer issues with <span class="line-through">python</span> JavaScript.
</p>
<p class="mb-16">
	Password input is optional and will be disabled if the puppet list includes a comma.
</p>

<div class="lg:w-[1024px] lg:max-w-5xl flex flex-col lg:flex-row gap-8 break-normal">
	<form
		on:submit|preventDefault={() => gotIssues(main, puppets, password)}
		class="flex flex-col gap-8"
	>
		<InputCredentials bind:main bind:puppets bind:password authenticated={true} />
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
		</div>
	</form>
	<Terminal bind:progress={progress} />
</div>
