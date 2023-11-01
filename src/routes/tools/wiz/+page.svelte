<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import InputCredentials from '$lib/component/InputCredentials.svelte';
	import { parseXML, sleep } from '$lib/helpers/utils';
	import Buttons from '$lib/component/Buttons.svelte';
	import Terminal from '$lib/component/Terminal.svelte';
	import type { PageData } from './$types';
	import { pushHistory } from '$lib/helpers/utils';
	import ToolContent from '$lib/component/ToolContent.svelte';
	export let data: PageData;
    const abortController = new AbortController();
	let puppets = '';
	let main = '';
	let progress = "";
	let stoppable = false;
	let stopped = true;

	onMount(() => {
		main = data.parameters.main || localStorage.getItem("main") as string || "";
		puppets = localStorage.getItem("puppets") as string || "";
	});
    onDestroy(() => abortController.abort());

	async function lastactivity(main: string, puppets: string) {
		pushHistory(`?main=${main}`)
		progress = "";
		stoppable = true;
		stopped = false;
		let puppetsList = puppets.split('\n');
		for (let i = 0; i < puppetsList.length; i++) {
            if (abortController.signal.aborted || stopped) {
				break;
			}
			await sleep(700);
			let nation = puppetsList[i];
            
            try {
                const xml = await parseXML(`https://www.nationstates.net/cgi-bin/api.cgi?nation=${nation}&q=lastactivity`, main);
		        const lastActive: string = xml.NATION.LASTACTIVITY;
                progress += `<p>${nation} with last seen ${lastActive}.</p>`;
            } catch (err) {
				progress += `<p class="text-red-400">Error processing ${nation} with ${err}</p>`;
			}
		}
		progress += `<p>Wiz finished</p>`;
		stoppable = false;
	}
</script>

<ToolContent toolTitle="Wiz" caption="Query all your nations for their last logged in date." />

<div class="lg:w-[1024px] lg:max-w-5xl flex flex-col lg:flex-row gap-8 break-normal">
	<form
		on:submit|preventDefault={async () => await lastactivity(main, puppets)}
		class="flex flex-col gap-8"
	>
		<InputCredentials bind:main bind:puppets authenticated={false} />
		<Buttons stopButton={true} bind:stopped={stopped} bind:stoppable={stoppable} />
	</form>
	<Terminal bind:progress={progress} />
</div>
