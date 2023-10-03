<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import InputCredentials from '$lib/component/InputCredentials.svelte';
	import { parser, sleep } from '$lib/globals';
	import Head from '$lib/component/Head.svelte';
	import { loadLocalStorage } from '$lib/loadLocalStorage';
	import Buttons from '$lib/component/Buttons.svelte';
	import Terminal from '$lib/component/Terminal.svelte';
    const abortController = new AbortController();
	let puppets = '';
	let main = '';
	let progress = "";
	let stoppable = false;
	let stopped = true;

	onMount(() => ({main, puppets} = loadLocalStorage(["stationMain", "stationPuppets"])));
    onDestroy(() => abortController.abort());

	async function lastactivity(main: string, puppets: string) {
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
                const response = await fetch(
				`https://www.nationstates.net/cgi-bin/api.cgi?nation=${nation}&q=lastactivity`,
                    {
                        headers: {
                            'User-Agent': main
                        }
                    }
                )
                const text = await response.text();
                const xml = parser.parse(text);
		        const lastActive = xml.NATION.LASTACTIVITY;
                progress += `<p>${nation} with last seen ${lastActive}.</p>`;
            } catch (err) {
				progress += `<p class="text-red-400">Error processing ${nation} with ${err}</p>`;
			}
		}
		progress += `<p>Wiz finished</p>`;
		stoppable = false;
	}
</script>

<Head title={"Hare - Wiz"} description={"Query all your nations for their last logged in date."} />

<h1 class="text-4xl mb-2">Wiz</h1>
<p class="mb-16">Query all your nations for their last logged in date.</p>

<div class="lg:w-[1024px] lg:max-w-5xl flex flex-col lg:flex-row gap-8 break-normal">
	<form
		on:submit|preventDefault={async () => await lastactivity(main, puppets)}
		class="flex flex-col gap-8"
	>
		<InputCredentials bind:main bind:puppets authenticated={false} />
		<Buttons>
			<button
				type="button"
				disabled={!stoppable}
				on:click={() => { 
					stopped = true;
					stoppable = false; 
				}}
				class="bg-red-500 rounded-md px-4 py-2 transition duration-300 hover:bg-red-300 disabled:opacity-20 disabled:hover:bg-red-500"
			>
				Stop
			</button>
		</Buttons>
	</form>
	<Terminal bind:progress={progress} />
</div>
