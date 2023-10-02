<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import InputCredentials from '$lib/component/InputCredentials.svelte';
	import { parser, sleep } from '$lib/globals';
	import Head from '$lib/component/Head.svelte';
    const abortController = new AbortController();
	let puppets = '';
	let main = '';
	let progress: Array<string> = [];
	onMount(() => {
		puppets = localStorage.getItem('stationPuppets') || '';
		main = localStorage.getItem('stationMain') || ''
	});

    onDestroy(() => abortController.abort());
	async function lastactivity(main: string, puppets: string) {
		let puppetsList = puppets.split('\n');
		for (let i = 0; i < puppetsList.length; i++) {
            if (abortController.signal.aborted) {
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
                progress = [...progress, `${nation} with last seen ${lastActive}.`];
            } catch (err) {
				progress = [...progress, `Error processing ${nation} with ${err}`];
			}
		}
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
		<div class="max-w-lg flex justify-center">
			<button
				type="submit"
				class="bg-green-500 rounded-md px-4 py-2 transition duration-300 hover:bg-green-300"
			>
				Start
			</button>
		</div>
	</form>
	<pre
		class="flex-1 p-2 whitespace-pre-wrap bg-black dark:bg-gray-50 text-white dark:text-black font-medium font-mono inline-block">
        {#if progress && progress[0]}
			{#each progress as update}
				<p>{update}</p>
			{/each}
		{/if}
    </pre>
</div>
