<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import InputCredentials from '$lib/component/InputCredentials.svelte';
	import { parseXML, sleep } from '$lib/helpers/utils';
	import Buttons from '$lib/component/Buttons.svelte';
	import Terminal from '$lib/component/Terminal.svelte';
	import type { PageData } from './$types';
	import { pushHistory } from '$lib/helpers/utils';
	import Textarea from '$lib/component/Textarea.svelte';
	import ToolContent from '$lib/component/ToolContent.svelte';
	export let data: PageData;
	const abortController = new AbortController();
	let progress = "";
	let stoppable = false;
	let stopped = false;
	let puppets = '';
	let main = '';
	let flags = '';

	onMount(() => {
		main = data.parameters.main || localStorage.getItem("main") as string || "";
		puppets = localStorage.getItem("puppets") as string || "";
		flags = localStorage.getItem("flagmanagerFlags") as string || "";
	});
	onDestroy(() => abortController.abort());

	async function ping() {
		pushHistory(`?main=${main}`)
		stoppable = true;
		stopped = false;
		progress = '<p>Initiating Flag Manager...</p>';
        let flagsList = flags.split('\n');
		let puppetsList = puppets.split('\n');
		for (let i = 0; i < puppetsList.length; i++) {
			let nation = puppetsList[i];
			try {
				if (abortController.signal.aborted || stopped) {
					break;
				}
				progress += `<p>Computing ${nation}'s flag</p>`
				const response = await parseXML(
					`https://www.nationstates.net/cgi-bin/api.cgi?nation=${nation}&q=flag`, main
				)
				for (const flag of flagsList) {
					if (response.NATION.FLAG.includes(flag)) progress += `<p class="text-green-400"><a target="_blank" rel="noreferrer noopener" href="https://nationstates.net/nation=${nation}" class="underline">${nation}</a> has flag containing ${flag}!</p>`
				}
				await sleep(700);
			} catch (err) {
				progress += `<p class="text-red-400">Error occured on ${nation}: ${err}`
			}
		}
		progress += `Flag manager finished searching!`
		stoppable = false;
	}
</script>

<ToolContent toolTitle="Flag Manager" caption="Find which puppets have a specific flag." author="Kractero" link="https://nationstates.net/Kractero"/>

<div class="lg:w-[1024px] lg:max-w-5xl flex flex-col lg:flex-row gap-8 break-normal">
	<form
		on:submit|preventDefault={ping}
		class="flex flex-col gap-8"
	>
		<InputCredentials bind:main bind:puppets authenticated={false} />
        <Textarea text="Search Flags" bind:bindValue={flags} forValue="flags" required />
		<Buttons stopButton={true} bind:stopped={stopped} bind:stoppable={stoppable} />
	</form>
	<Terminal bind:progress={progress} />
</div>
