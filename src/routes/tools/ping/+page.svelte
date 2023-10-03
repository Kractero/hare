<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import InputCredentials from '$lib/component/InputCredentials.svelte';
	import { sleep } from '$lib/globals';
	import Head from '$lib/component/Head.svelte';
	import Buttons from '$lib/component/Buttons.svelte';
	import { loadLocalStorage } from '$lib/loadLocalStorage';
	import Terminal from '$lib/component/Terminal.svelte';
	const abortController = new AbortController();
	let puppets = '';
	let main = '';
	let password = '';
	let progress = "";
	let stoppable = false;
	let stopped = false;

	onMount(() => ({puppets, main, password} = loadLocalStorage(["stationPuppets", "stationMain", "stationPassword"])));
	onDestroy(() => abortController.abort());

	async function ping(main: string, puppets: string, password: string) {
		stoppable = true;
		stopped = false;
		progress = '';
		let puppetsList = puppets.split('\n');
		for (let i = 0; i < puppetsList.length; i++) {
			await sleep(700);
			let nation = puppetsList[i];
			if (abortController.signal.aborted || stopped) {
				break;
			}
			const response = await fetch(
				`https://www.nationstates.net/cgi-bin/api.cgi?nation=${nation}&q=ping`,
				{
					headers: {
						'X-Password': password.replaceAll(' ', '_'),
						'User-Agent': main
					}
				}
			);
			const success = response.status;
			if (success === 404) {
				progress += `<p class="text-red-400">Failed to log into ${nation}</p>`;
			}
			if (success === 200 || success === 409) {
				progress += `<p>Successfully logged into ${nation}</p>`;
			}
			
		}
		stoppable = false;
	}
</script>

<Head title={"Hare - Pinger"} description={"Ping all your inputed nations to keep them from ceasing to exist."} />

<h1 class="text-4xl mb-2">Nation Pinger</h1>
<p class="text-xs mb-1">Kractero</p>
<p class="mb-16">Ping all your inputed nations to keep them from ceasing to exist.</p>

<div class="lg:w-[1024px] lg:max-w-5xl flex flex-col lg:flex-row gap-8 break-normal">
	<form
		on:submit|preventDefault={async () => await ping(main, puppets, password)}
		class="flex flex-col gap-8"
	>
		<InputCredentials bind:main bind:puppets bind:password authenticated={true} />
		<Buttons>
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
