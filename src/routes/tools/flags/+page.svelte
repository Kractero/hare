<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import InputCredentials from '$lib/component/InputCredentials.svelte';
	import { parseXML, sleep } from '$lib/helpers/utils';
	import Head from '$lib/component/Head.svelte';
	import Buttons from '$lib/component/Buttons.svelte';
	import Terminal from '$lib/component/Terminal.svelte';
	import type { PageData } from './$types';
	import { pushHistory } from '$lib/helpers/utils';
	import Textarea from '$lib/component/Textarea.svelte';
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
		progress = '';
        let flagsList = flags.split('\n');
		let puppetsList = puppets.split('\n');
		for (let i = 0; i < puppetsList.length; i++) {
			let nation = puppetsList[i];
			if (abortController.signal.aborted || stopped) {
				break;
			}
            progress += `<p>Computing ${nation}</p>`
			const response = await parseXML(
				`https://www.nationstates.net/cgi-bin/api.cgi?nation=${nation}&q=flag`, main
			)
            for (const flag of flagsList) {
                if (response.NATION.FLAG.includes(flag)) progress += `<p class="text-green-400"><a target="_blank" rel="noreferrer noopener" href="https://nationstates.net/nation=${nation}" class="underline">${nation}</a> has flag containing ${flag}!</p>`
            }
            await sleep(700);
		}
		stoppable = false;
	}
</script>

<Head title={"Hare - Flags"} description={"Find which puppets have a specific flag."} />

<h1 class="text-4xl mb-2">Flag Manager</h1>
<p class="text-xs mb-1">Kractero</p>
<p class="mb-16">Find which nations have a specific flag, useful for unique puppet management.</p>

<div class="lg:w-[1024px] lg:max-w-5xl flex flex-col lg:flex-row gap-8 break-normal">
	<form
		on:submit|preventDefault={ping}
		class="flex flex-col gap-8"
	>
		<InputCredentials bind:main bind:puppets authenticated={false} />
        <Textarea text="Search Flags" bind:bindValue={flags} forValue="flags" required />
		<Buttons bind:stoppable={stoppable} >
			<button
				type="button"
				disabled={!stoppable}
				on:click={() => { 
					stoppable = false
					stopped = true
				 }}
				class="bg-red-500 rounded-md px-4 py-2 transition duration-300 hover:bg-red-300 disabled:opacity-20 disabled:hover:bg-red-500"
			>
				Stop
			</button>
		</Buttons>
	</form>
	<Terminal bind:progress={progress} />
</div>
