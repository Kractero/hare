<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import InputCredentials from '$lib/component/InputCredentials.svelte';
	import { parseXML, sleep } from '$lib/helpers/utils';
	import Buttons from '$lib/component/Buttons.svelte';
	import Terminal from '$lib/component/Terminal.svelte';
	import type { PageData } from './$types';
	import { pushHistory } from '$lib/helpers/utils';
	import ToolContent from '$lib/component/ToolContent.svelte';
	import Select from '$lib/component/Select.svelte';
	import Input from '$lib/component/Input.svelte';
	export let data: PageData;
    const abortController = new AbortController();
	let puppets = '';
	let main = '';
	let progress = "";
	let stoppable = false;
	let stopped = true;
	let mode = 'Puppets';
	let region = '';
	onMount(() => {
		main = data.parameters.main || localStorage.getItem("main") as string || "";
		puppets = localStorage.getItem("puppets") as string || "";
		mode = data.parameters.mode || localStorage.getItem("mode") as string || "Puppets";
		region = data.parameters.region || localStorage.getItem("region") as string || "";
	});
    onDestroy(() => abortController.abort());

	async function lastactivity(main: string, puppets: string) {
			pushHistory(`?main=${main}${mode ? `&mode=${mode}` : ""}${region ? `&region=${region}` : ""}`)
			progress = "";
			stoppable = true;
			stopped = false;
			if (mode.toLowerCase() === "Puppets") {
			let puppetsList = puppets.split('\n');
			for (let i = 0; i < puppetsList.length; i++) {
				if (abortController.signal.aborted || stopped) {
					break;
				}
				await sleep(600);
				let nation = puppetsList[i];
				try {
						const xml = await parseXML(`https://${localStorage.getItem("connectionUrl") || "www"}.nationstates.net/cgi-bin/api.cgi?nation=${nation}&q=lastactivity`, main);
				const lastActive: string = xml.NATION.LASTACTIVITY;
						progress += `<p>${nation} with last seen ${lastActive}.</p>`;
				} catch (err) {
					progress += `<p class="text-red-400">Error processing ${nation} with ${err}</p>`;
				}
			}
		} else {
			const xml = await parseXML(`https://${localStorage.getItem("connectionUrl") || "www"}.nationstates.net/cgi-bin/api.cgi?region=${region}&q=nations`, main);
			const nations = xml.REGION.NATIONS ? xml.REGION.NATIONS.split(':') : []
			for (let i = 0; i < nations.length; i++) {
				if (abortController.signal.aborted || stopped) {
					break;
				}
				await sleep(600);
				let nation = nations[i];
				try {
						const xml = await parseXML(`https://${localStorage.getItem("connectionUrl") || "www"}.nationstates.net/cgi-bin/api.cgi?nation=${nation}&q=lastactivity`, main);
				const lastActive: string = xml.NATION.LASTACTIVITY;
						progress += `<p>${nation} with last seen ${lastActive}.</p>`;
				} catch (err) {
					progress += `<p class="text-red-400">Error processing ${nation} with ${err}</p>`;
				}
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
		<Select name="Mode" bind:mode={mode} options={["Puppets", "Region"]} />
		{#if mode.toLowerCase() === "region"}
			<Input text={`User Agent`} bind:bindValue={main} forValue="main" required={true} />
			<Input text={`Region`} bind:bindValue={region} forValue="region" required={true} />
		{:else}
			<InputCredentials bind:main bind:puppets authenticated={false} />
		{/if}
		<Buttons stopButton={true} bind:stopped={stopped} bind:stoppable={stoppable} />
	</form>
	<Terminal bind:progress={progress} />
</div>
