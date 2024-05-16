<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import InputCredentials from '$lib/component/InputCredentials.svelte';
	import { parseXML, sleep } from '$lib/helpers/utils';
	import Buttons from '$lib/component/Buttons.svelte';
	import Terminal from '$lib/component/Terminal.svelte';
	import { pushHistory } from '$lib/helpers/utils';
	import Textarea from '$lib/component/Textarea.svelte';
	import ToolContent from '$lib/component/ToolContent.svelte';
	import { page } from '$app/stores';
	import Input from '$lib/component/Input.svelte';
	import Select from '$lib/component/Select.svelte';
	const abortController = new AbortController();
	let progress = "";
	let stoppable = false;
	let stopped = false;
	let puppets = '';
	let main = '';
	let flags = '';
	let downloadable = false;
	let content = ""
	let count = 0;
	let mode = "Flags";
	let mottos = '';

	onMount(() => {
		main = $page.url.searchParams.get('main') || localStorage.getItem("main") as string || "";
		mode = $page.url.searchParams.get('mode') || localStorage.getItem("flagmanagerMode") as string || "Flags";
		puppets = localStorage.getItem("puppets") as string || "";
		flags = localStorage.getItem("flagmanagerFlags") as string || "";
		mottos = localStorage.getItem("flagmanagerMottos") as string || "";
	});
	onDestroy(() => abortController.abort());

	async function ping() {
		downloadable = false;
		pushHistory(`?main=${main}&mode=${mode}`)
		stoppable = true;
		stopped = false;
		progress = '<p>Initiating Flag Manager...</p>';
		let flagsList = flags.split('\n');
		let mottosList = mottos.split('\n');
		let puppetsList = puppets.split('\n');
		for (let i = 0; i < puppetsList.length; i++) {
			let nation = puppetsList[i];
			try {
				if (abortController.signal.aborted || stopped) {
					break;
				}
				progress += `<p>Computing ${nation}'s ${mode === "flags" ? "flag" : "motto"}</p>`
				if (mode.toLowerCase() === "flags") {
					const response = await parseXML(
						`https://${localStorage.getItem("connectionUrl") || "www"}.nationstates.net/cgi-bin/api.cgi?nation=${nation}&q=flag`, main
					)
					for (const flag of flagsList) {
						if (response.NATION.FLAG.includes(flag)) {
							progress += `<p class="text-green-400"><a target="_blank" rel="noreferrer noopener" href="https://${localStorage.getItem("connectionUrl") || "www"}.nationstates.net/nation=${nation}" class="underline">${nation}</a> has flag containing ${flag}!</p>`
							content += `<tr><td><p>${
									count + 1
							}</p></td><td><p><a target="_blank" href="https://${localStorage.getItem("connectionUrl") || "www"}.nationstates.net/nation=${nation}">Link to Nation</a></p></td></tr>`
							count++;
						}
					}
				} else {
					const response = await parseXML(
						`https://${localStorage.getItem("connectionUrl") || "www"}.nationstates.net/cgi-bin/api.cgi?nation=${nation}&q=motto`, main
					)
					for (const motto of mottosList) {
						if (response.NATION.MOTTO === motto) {
							progress += `<p class="text-green-400"><a target="_blank" rel="noreferrer noopener" href="https://${localStorage.getItem("connectionUrl") || "www"}.nationstates.net/nation=${nation}" class="underline">${nation}</a> has motto equal to ${motto}!</p>`
							content += `<tr><td><p>${
									count + 1
							}</p></td><td><p><a target="_blank" href="https://${localStorage.getItem("connectionUrl") || "www"}.nationstates.net/nation=${nation}">Link to Nation</a></p></td></tr>`
							count++;
						}
					}
				}
				await sleep(600);
			} catch (err) {
				progress += `<p class="text-red-400">Error occured on ${nation}: ${err}`
			}
		}
		progress += `Flag manager finished searching!`
		stoppable = false;
		downloadable = true;
	}
</script>

<ToolContent toolTitle="Flag Manager" caption="Find which puppets have a specific flag." author="Kractero" link="https://nationstates.net/Kractero"/>

<div class="lg:w-[1024px] lg:max-w-5xl flex flex-col lg:flex-row gap-8 break-normal">
	<form
		on:submit|preventDefault={ping}
		class="flex flex-col gap-8"
	>
		<InputCredentials bind:main bind:puppets authenticated={false} />
		<Select name="Mode" bind:mode={mode} options={["Flags", "Mottos"]} />
		{#if mode === "Flags"}
		<Textarea text="Search Flags" bind:bindValue={flags} forValue="flags" required />
		{:else}
		<Textarea text="Motto" bind:bindValue={mottos} forValue="mottos" required />
		{/if}
		<Buttons downloadButton={true} bind:downloadable={downloadable} bind:content={content} type="html" stopButton={true} bind:stopped={stopped} bind:stoppable={stoppable} name="manager" />
	</form>
	<Terminal bind:progress={progress} />
</div>
