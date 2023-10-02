<script lang="ts">
	import { onMount } from 'svelte';

	let puppets = '';
	let main = '';
	let top = '100';
	let days = '30';
	let password = '';
	let content: string;

	onMount(() => {
		puppets = localStorage.getItem('stationPuppets') || '';
		main = localStorage.getItem('stationMain') || '';
		top = localStorage.getItem('stationTop') || '';
		days = localStorage.getItem('stationDays') || '';
		password = localStorage.getItem('stationPassword') || '';
	});

	async function setConfig(
		main: string,
		puppets: string,
		password: string,
		top: string,
		days: string
	) {
		localStorage.setItem('stationMain', main);
		localStorage.setItem('stationPuppets', puppets);
		localStorage.setItem('stationPassword', password);
		localStorage.setItem('stationROCTop', String(top));
		localStorage.setItem('stationROCDays', String(days));
	}
</script>

<h1 class="text-4xl mb-2 text-center">Configure Default Inputs</h1>
<p class="mb-16 text-center">Generate links to help you quickly log back into containers.</p>

<div class="lg:w-[1024px] lg:max-w-5xl flex flex-col justify-center lg:flex-row gap-8">
	<form
		on:submit|preventDefault={() => setConfig(main, puppets, password, top, days)}
		class="flex flex-col gap-8"
	>
		<div class="flex gap-4 justify-between max-w-lg">
			<label class="w-24" for="main">User Agent</label>
			<input
				id="main"
				bind:value={main}
				class="text-black p-1 max-w-xs rounded-md border border-black dark:border-none"
			/>
		</div>
		<div class="flex gap-4 justify-between max-w-lg">
			<label class="w-24" for="pup">Puppets</label>
			<textarea
				id="pup"
				rows="10"
				bind:value={puppets}
				class="text-black p-1 w-96 rounded-md border border-black dark:border-none"
			/>
		</div>
		<div class="flex gap-4 justify-between max-w-lg">
			<label class="w-24" for="main">Password</label>
			<input
				id="pass"
				disabled={puppets.includes(',')}
				bind:value={password}
				title={puppets.includes(',')
					? 'A comma is detected in the puppet list, assuming that format.'
					: ''}
				class="text-black p-1 max-w-xs rounded-md border border-black dark:border-none disabled:opacity-25"
			/>
		</div>
		<div class="flex gap-4 justify-between max-w-lg">
			<label class="w-24" for="main">Top {top}</label>
			<input
				id="main"
				bind:value={top}
				class="text-black p-1 max-w-xs rounded-md border border-black dark:border-none"
			/>
		</div>
		<div class="flex gap-4 justify-between max-w-lg">
			<label class="w-24" for="main">Over {days} Days</label>
			<input
				id="main"
				bind:value={days}
				class="text-black p-1 max-w-xs rounded-md border border-black dark:border-none"
			/>
		</div>
		<div class="max-w-lg flex justify-center">
			<button
				type="submit"
				class="bg-green-300 rounded-md px-4 py-2 transition duration-300 hover:bg-green-500"
			>
				Save
			</button>
		</div>
	</form>
</div>
