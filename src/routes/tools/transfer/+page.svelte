<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import InputCredentials from '$lib/component/InputCredentials.svelte';
	import { parseXML, sleep } from '$lib/helpers/utils';
	import Terminal from '$lib/component/Terminal.svelte';
	import Buttons from '$lib/component/Buttons.svelte';
	import type { PageData } from './$types';
	import { pushHistory } from '$lib/helpers/utils';
	export let data: PageData;
	import ToolContent from '$lib/component/ToolContent.svelte';
	import Input from '$lib/component/Input.svelte';
	const abortController = new AbortController();
	let progress = "";
	let downloadable = false;
	let stoppable = false;
	let stopped = false;
	let main = '';
	let puppets = '';
  let content = '';
	let transfer = "10";
  let transferrable: Array<string> = [];

	onMount(() => {
		main = data.parameters.main || localStorage.getItem("main") as string || "";
		puppets = localStorage.getItem("puppets") as string || "";
		transfer = data.parameters.transfer || localStorage.getItem("transferBank") as string || "10";
	});

	onDestroy(() => abortController.abort());

	async function goldRetriever() {
		pushHistory(`?main=${main}&transfer=${transfer}`)
		downloadable = false;
		stoppable = true;
		stopped = false;
    transferrable = [];
		progress = "<p>Initiating Transfer List...</p>"
		let puppetList = puppets.split('\n');
    let count = 0;
		let bank = 0;
		for (let i = 0; i < puppetList.length; i++) {
			let nation = puppetList[i];
			if (abortController.signal.aborted || stopped) {
				break;
			}
			try {
				await sleep(700);
				progress += `<p>Processing ${nation} ${i + 1}/${puppetList.length}</p>`;
				const deckInfo = await parseXML(`https://www.nationstates.net/cgi-bin/api.cgi/?nationname=${nation}&q=cards+deck+info`, main)
				let nationalBank = deckInfo.CARDS.INFO.BANK;
        if (nationalBank >= Number(transfer)) {
          progress += `<p class="text-green-400">${nation} can transfer!</p>`;
          count++;
          bank = nationalBank + bank;
          transferrable.push(nation)
        }
			} catch (err) {
				progress += `<p class="text-red-400">Error processing ${nation} with ${err}</p>`;
			}
		}
    content = transferrable.join('\n')
		progress += `<p>Finished processing! You have a cumulative ${bank} bank to transfer from ${count}.</p>`;
		downloadable = true;
		stoppable = false;
	}
</script>

<ToolContent toolTitle="Transfer" caption="Takes a bank threshold and receive a text file with puppets that have that bank or higher." />

<div class="lg:w-[1024px] lg:max-w-5xl flex flex-col lg:flex-row gap-8 break-normal">
	<form
		on:submit|preventDefault={() => goldRetriever()}
		class="flex flex-col gap-8"
	>
		<InputCredentials bind:main bind:puppets authenticated={false}/>
		<Input text="Transfer Bank Threshold" bind:bindValue={transfer} forValue="transfer" required={true} />
		<Buttons downloadButton={true} bind:downloadable={downloadable} bind:content={content} type="txt" name="Transfer" stopButton={true} bind:stoppable={stoppable} bind:stopped={stopped} />
	</form>
	<Terminal bind:progress={progress} />
</div>
