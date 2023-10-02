<script lang="ts">
	import { onMount } from 'svelte';
	import Head from '$lib/component/Head.svelte';

	let puppets = '';
	let main = '';
	let top = '100';
	let days = '30';
	let password = '';
	let endotart = '';
	let nen = '';
	let find = '';
	let regions = '';
    let jdjMode = 'Gift'
    let finderMode = 'Gift'
	const rarities: { [key: string]: number } = {
		common: 0.5,
		uncommon: 1,
		rare: 1,
		'ultra-rare': 1,
		epic: 1
	};

	onMount(() => {
		puppets = localStorage.getItem('stationPuppets') || '';
		main = localStorage.getItem('stationMain') || '';
		top = localStorage.getItem('stationTop') || '100';
		days = localStorage.getItem('stationDays') || '30';
		password = localStorage.getItem('stationPassword') || '';
        endotart = localStorage.getItem('stationEndotartNation') || '';
		nen = localStorage.getItem('stationNENNation') || '';
		find = localStorage.getItem('stationFinderList') || '';
		regions = localStorage.getItem('stationRegionalWhitelist') || '';
		jdjMode = localStorage.getItem('stationJDJDefault') || 'Gift';
        finderMode = localStorage.getItem('stationFinderDefault') || 'Gift';
        rarities.common = Number(localStorage.getItem('stationJDJCommon')) || 0.5;
		rarities.uncommon = Number(localStorage.getItem('stationJDJUncommon')) || 1;
		rarities.rare = Number(localStorage.getItem('stationJDJRare')) || 1;
		rarities['ultra-rare'] = Number(localStorage.getItem('stationJDJUltraRare')) || 1;
        rarities.epic = Number(localStorage.getItem('stationJDJEpic')) || 1;
	});

	async function setConfig() {
		localStorage.setItem('stationMain', main);
		localStorage.setItem('stationPuppets', puppets);
		localStorage.setItem('stationPassword', password);
		localStorage.setItem('stationROCTop', String(top));
		localStorage.setItem('stationROCDays', String(days));
		localStorage.setItem('stationEndotartNation', endotart);
		localStorage.setItem('stationNENNation', nen);
		localStorage.setItem('stationFinderList', find);
		localStorage.setItem('stationRegionalWhitelist', regions);
        localStorage.setItem('stationJDJDefault', jdjMode);
		localStorage.setItem('stationFinderDefault', finderMode);
        localStorage.setItem('stationJDJCommon', String(rarities.common));
		localStorage.setItem('stationJDJUncommon', String(rarities.uncommon));
		localStorage.setItem('stationJDJRare', String(rarities.rare));
        localStorage.setItem('stationJDJUltraRare', String(rarities['ultra-rare']));
		localStorage.setItem('stationJDJEpic', String(rarities.epic));
	}
</script>

<Head title={"Hare - Config"} description={"Configure your default inputs for each script."} />

<h1 class="text-4xl text-center mb-16">Configure Default Inputs</h1>

<div class="lg:w-[1024px] lg:max-w-5xl w-max flex flex-col justify-center lg:flex-row gap-8">
    <form
        on:submit|preventDefault={() => setConfig()}
        class="flex flex-col gap-8"
    >
        <div class="flex flex-col lg:flex-row gap-4 justify-between max-w-lg">
            <label class="w-24" for="main">User Agent</label>
            <input
                id="main"
                bind:value={main}
                class="text-right text-black p-1 max-w-xs rounded-md border border-black dark:border-none"
            />
        </div>
        <div class="flex flex-col lg:flex-row gap-4 justify-between max-w-lg">
            <label class="w-24" for="pup">Puppets</label>
            <textarea
                id="pup"
                rows="10"
                bind:value={puppets}
                class="text-right text-black p-1 w-72 rounded-md border border-black dark:border-none"
            />
        </div>
        <div class="flex flex-col lg:flex-row gap-4 justify-between max-w-lg">
            <label class="w-24" for="pass">Password</label>
            <input
                id="pass"
                bind:value={password}
                title={puppets.includes(',')
                    ? 'A comma is detected in the puppet list, assuming that format.'
                    : ''}
                class="text-right text-black p-1 max-w-xs rounded-md border border-black dark:border-none disabled:opacity-25"
            />
        </div>
        <div class="flex flex-col lg:flex-row gap-4 justify-between max-w-lg">
            <label class="w-24" for="top">Top {top}</label>
            <input
                id="top"
                bind:value={top}
                class="text-right text-black p-1 max-w-xs rounded-md border border-black dark:border-none"
            />
        </div>
        <div class="flex flex-col lg:flex-row gap-4 justify-between max-w-lg">
            <label class="w-24" for="days">Over {days} Days</label>
            <input
                id="days"
                bind:value={days}
                class="text-right text-black p-1 max-w-xs rounded-md border border-black dark:border-none"
            />
        </div>
        <div class="flex flex-col lg:flex-row gap-4 justify-between max-w-lg">
            <label class="w-24" for="Endotarting">Endotarting Default</label>
            <input
                id="Endotarting"
                bind:value={endotart}
                class="text-right text-black p-1 max-w-xs rounded-md border border-black dark:border-none"
            />
        </div>
        <div class="flex flex-col lg:flex-row gap-4 justify-between max-w-lg">
            <label class="w-24" for="Not">Not Endorsing Default</label>
            <input
                id="Not"
                bind:value={nen}
                class="text-right text-black p-1 max-w-xs rounded-md border border-black dark:border-none"
            />
        </div>
        <div class="flex flex-col lg:flex-row gap-4 justify-between max-w-lg">
            <label class="w-24" for="Regional">Regional Whitelist</label>
            <textarea
                id="Regional"
                rows="10"
                bind:value={regions}
                class="text-right text-black p-1 w-72 rounded-md border border-black dark:border-none"
            />
        </div>
        <div class="flex flex-col lg:flex-row gap-4 justify-between max-w-lg">
            <label class="w-24" for="jdj">JDJ Default Behavior</label>
			<select
				name="jdj"
				id="jdj"
				bind:value={jdjMode}
				class="text-black p-1 w-16 rounded-md border border-black dark:border-none"
			>
				<option value="Gift" selected>Gift</option>
				<option value="Sell">Sell</option>
			</select>
        </div>
        <div class="flex flex-col gap-4">
            <div class="flex items-center gap-4 justify-between max-w-lg">
                <label class="w-24" for="common">Common</label>
                <input
                    name="common"
                    required
                    id="common"
                    bind:value={rarities.common}
                    class="text-black p-1 w-20 rounded-md border border-black dark:border-none"
                />
            </div>
            <div class="flex items-center gap-4 justify-between max-w-lg">
                <label class="w-24" for="uncommon">Uncommon</label>
                <input
                    name="uncommon"
                    required
                    id="uncommon"
                    bind:value={rarities.uncommon}
                    class="text-black p-1 w-20 rounded-md border border-black dark:border-none"
                />
            </div>
            <div class="flex items-center gap-4 justify-between max-w-lg">
                <label class="w-24" for="rare">Rare</label>
                <input
                    name="rare"
                    required
                    id="rare"
                    bind:value={rarities.rare}
                    class="text-black p-1 w-20 rounded-md border border-black dark:border-none"
                />
            </div>
            <div class="flex items-center gap-4 justify-between max-w-lg">
                <label class="w-24" for="ultra-rare">Ultra-Rare</label>
                <input
                    name="ultra-rare"
                    required
                    id="ultra-rare"
                    bind:value={rarities['ultra-rare']}
                    class="text-black p-1 w-20 rounded-md border border-black dark:border-none"
                />
            </div>
            <div class="flex items-center gap-4 justify-between max-w-lg">
                <label class="w-24" for="epic">Epic</label>
                <input
                    name="epic"
                    required
                    id="epic"
                    bind:value={rarities.epic}
                    class="text-black p-1 w-20 rounded-md border border-black dark:border-none"
                />
            </div>
        </div>
        <div class="flex flex-col lg:flex-row gap-4 justify-between max-w-lg">
            <label class="w-24" for="finder">Finder Default Behavior</label>
			<select
				name="finder"
				id="finder"
				bind:value={finderMode}
				class="text-black p-1 w-16 rounded-md border border-black dark:border-none"
			>
				<option value="Gift" selected>Gift</option>
				<option value="View">View</option>
			</select>
        </div>
        <div class="flex flex-col lg:flex-row gap-4 justify-between max-w-lg">
            <label class="w-24" for="Find">Find List</label>
            <textarea
                id="Find"
                rows="10"
                bind:value={find}
                class="text-right text-black p-1 w-72 rounded-md border border-black dark:border-none"
            />
        </div>
        <div class="max-w-lg flex justify-center">
            <button
                type="submit"
                class="bg-green-500 rounded-md px-4 py-2 transition duration-300 hover:bg-green-300"
            >
                Save
            </button>
        </div>
    </form>
</div>