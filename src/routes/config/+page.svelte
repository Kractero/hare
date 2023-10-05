<script lang="ts">
	import { onMount } from 'svelte';
	import Head from '$lib/component/Head.svelte';
	import Rarities from '$lib/component/Rarities.svelte';
	import { loadLocalStorage } from '$lib/loadLocalStorage';
	import { text } from '@sveltejs/kit';
	import Input from '$lib/component/Input.svelte';

	let puppets = '';
	let main = '';
	let top = '100';
	let days = '30';
	let password = '';
	let endotartnation = '';
    let giftee = '';
	let nennation = '';
	let finderlist = '';
	let regionalwhitelist = '';
    let jdjMode = 'Gift'
    let finderMode = 'Gift'
	let rarities: { [key: string]: number } = {
		common: 0.5,
		uncommon: 1,
		rare: 1,
		'ultra-rare': 1,
		epic: 1
	};
    let limit = 0;
    let ownercount = "";
    let council = "General Assembly";
    let proposalid = "";

    onMount(() => ({puppets, main, giftee, top, days, password, endotartnation, nennation, finderlist, regionalwhitelist, jdjMode, finderMode, rarities, limit, ownercount, council, proposalid} = 
        loadLocalStorage(["stationPuppets", "stationMain", "stationGiftee", "stationROCTop", "stationROCDays", "stationPassword",
            "stationEndotartNation", "stationNENNation", "stationFinderList", "stationRegionalWhitelist", "stationJDJDefault", "stationFinderDefault", "stationJDJ", "stationEndotartLimit", "stationOwnerCount", "stationCouncil", "stationProposalID"]))
    );

	async function setConfig() {
		localStorage.setItem('stationMain', main);
		localStorage.setItem('stationPuppets', puppets);
		localStorage.setItem('stationPassword', password);
		localStorage.setItem('stationROCTop', String(top));
		localStorage.setItem('stationROCDays', String(days));
		localStorage.setItem('stationEndotartNation', endotartnation);
		localStorage.setItem('stationNENNation', nennation);
		localStorage.setItem('stationFinderList', finderlist);
        localStorage.setItem('stationGiftee', giftee);
		localStorage.setItem('stationRegionalWhitelist', regionalwhitelist);
        localStorage.setItem('stationJDJDefault', jdjMode);
		localStorage.setItem('stationFinderDefault', finderMode);
        localStorage.setItem('stationJDJCommon', String(rarities.common));
		localStorage.setItem('stationJDJUncommon', String(rarities.uncommon));
		localStorage.setItem('stationJDJRare', String(rarities.rare));
        localStorage.setItem('stationJDJUltraRare', String(rarities['ultra-rare']));
		localStorage.setItem('stationJDJEpic', String(rarities.epic));
        localStorage.setItem('stationEndotartLimit', String(limit));
        localStorage.setItem('stationOwnerCount', String(ownercount));
        localStorage.setItem('stationCouncil', String(council));
        localStorage.setItem('stationProposalID', String(proposalid));
	}
</script>

<Head title={"Hare - Config"} description={"Configure your default inputs for each script."} />

<h1 class="text-4xl text-center mb-16">Configure Default Inputs</h1>

<div class="lg:w-[1024px] lg:max-w-5xl w-max flex flex-col justify-center lg:flex-row gap-8">
    <form
        on:submit|preventDefault={() => setConfig()}
        class="flex flex-col gap-8"
    >
        <Input text="User Agent" bind:bindValue={main} forValue="main" />
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
        <Input text="Top {top}" bind:bindValue={top} forValue="top" />
        <Input text="Over {days} Days" bind:bindValue={days} forValue="days" />
        <Input text="Endotarting Default" bind:bindValue={endotartnation} forValue="Endotarting" />
        <Input text="Endorse Limit" bind:bindValue={limit} forValue="limit" />
        <Input text="Not Endorsing Default" bind:bindValue={nennation} forValue="nen" />
        <div class="flex flex-col lg:flex-row gap-4 justify-between max-w-lg">
            <label class="w-24" for="Regional">Regional Whitelist</label>
            <textarea
                id="Regional"
                rows="10"
                bind:value={regionalwhitelist}
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
        <Input text="Owner Threshold" bind:bindValue={ownercount} forValue="owner" />
        <Input text="Gift To" bind:bindValue={giftee} forValue="giftee" />
        <Rarities bind:rarities={rarities} />
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
                bind:value={finderlist}
                class="text-right text-black p-1 w-72 rounded-md border border-black dark:border-none"
            />
        </div>
		<div class="flex gap-4 justify-between max-w-lg">
			<label class="w-24" for="mode">Council</label>
			<select
				name="mode"
				id="mode"
				bind:value={council}
				class="text-black p-1 w-max rounded-md border border-black dark:border-none"
			>
				<option value="General Assembly" selected>General Assembly</option>
				<option value="Security Council">Security Council</option>
			</select>
		</div>
        <Input text="Proposal ID" bind:bindValue={proposalid} forValue="proposalID" required={false} />
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