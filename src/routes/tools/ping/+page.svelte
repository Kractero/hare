<script lang="ts">
	import { onMount } from 'svelte';
	import InputCredentials from '../../../component/InputCredentials.svelte';
	import { sleep } from '../../../globals';
	let puppets = '';
	let main = '';
	let password = '';
	let progress: Array<string> = [];
	onMount(() => {
		puppets = localStorage.getItem('stationPuppets') || '';
		main = localStorage.getItem('stationMain') || '';
		password = localStorage.getItem('stationPassword') || '';
	});
	async function ping(main: string, puppets: string, password: string) {
		let puppetsList = puppets.split('\n');
		for (let i = 0; i < puppetsList.length; i++) {
			await sleep(700);
			let nation = puppetsList[i];
			const response = await fetch(
				`https://www.nationstates.net/cgi-bin/api.cgi?nation=${nation}&q=ping`,
				{
					headers: {
						'X-Password': password.replace(' ', '_'),
						'User-Agent': main
					}
				}
			);
			const success = response.status;
			if (success === 404) {
				progress = [...progress, `Failed to log into ${nation}`];
			}
			if (success === 200 || success === 409) {
				progress = [...progress, `Successfully logged into ${nation}`];
			}
		}
	}
</script>

<h1 class="text-4xl mb-2">Nation Pinger</h1>
<p class="mb-16">Ping all your inputed nations to keep them from ceasing to exist.</p>

<div class="lg:w-[1024px] lg:max-w-5xl flex flex-col lg:flex-row gap-8 break-normal">
	<form
		on:submit|preventDefault={async () => await ping(main, puppets, password)}
		class="flex flex-col gap-8"
	>
		<InputCredentials bind:main bind:puppets bind:password authenticated={true} />
		<div class="max-w-lg flex justify-center">
			<button
				type="submit"
				class="bg-green-300 rounded-md px-4 py-2 transition duration-300 hover:bg-green-500"
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
