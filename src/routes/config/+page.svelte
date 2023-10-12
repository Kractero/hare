<script lang="ts">
	import { onMount } from 'svelte';
	import Head from '$lib/component/Head.svelte';
	import Rarities from '$lib/component/Rarities.svelte';
	import Input from '$lib/component/Input.svelte';
	import Textarea from '$lib/component/Textarea.svelte';
	import Select from '$lib/component/Select.svelte';
	import { loadStorage } from '$lib/loadStorage';
	import { loadLocalStorage } from '$lib/loadLocalStorage';

    const localStorageObject: {[key: string]: any } = {
    // const localStorageObject: {[key: string]: string | {[key: string]: number}} = {
        puppets: '',
        main: '',
        password: '',
        issuesmode: '',
        top: '100',
        days: '30',
        specific: '',
        endotartnation: '',
        limit: "0",
        immune: '',
        endotartsource: 'XML',
        nennation: '',
        finderlist: '',
        regionalwhitelist: '',
        jdjMode: 'Gift',
        finderMode: 'Gift',
        rarities: {
            common: 0.5,
            uncommon: 1,
            rare: 1,
            'ultra-rare': 1,
            epic: 1,
        },
        giftee: '',
        ownercount: '',
        cardcount: '',
        council: 'General Assembly',
        proposalid: '',
    };

	// let puppets = '';
	// let main = '';
    // let password = '';

    // let issuesmode = "";

	// let top = '100';
	// let days = '30';
    // let specific = "";

	// let endotartnation = '';
    // let limit = 0;
    // let immune = "";
    // let endotartsource = "XML";
	// let nennation = '';

	// let finderlist = '';
	// let regionalwhitelist = '';
    // let jdjMode = 'Gift'
    // let finderMode = 'Gift'
	// let rarities: { [key: string]: number } = {
	// 	common: 0.5,
	// 	uncommon: 1,
	// 	rare: 1,
	// 	'ultra-rare': 1,
	// 	epic: 1
	// };
    // let giftee = '';
    // let ownercount = "";
    // let cardcount = "";

    // let council = "General Assembly";
    // let proposalid = "";

    onMount(() => {
        Object.keys(localStorageObject).forEach((key) => {
            console.log(key)
            console.log(loadStorage(key))
            localStorageObject[key] = loadStorage(key) || localStorageObject[key];
        });
        console.log(localStorageObject)
    });

	async function setConfig() {
        for (const key in localStorageObject) {
            if (key === "rarities") {
                for (const key in localStorageObject.rarities) {
                    localStorage.setItem(key, localStorageObject.rarities[key]);
                }
            } else {
                localStorage.setItem(key, localStorageObject[key]);
            }
        }
	}
</script>

<Head title={"Hare - Config"} description={"Configure your default inputs for each script."} />

<h1 class="text-4xl text-center mb-16">Configure Default Inputs</h1>

<div class="lg:w-[1024px] lg:max-w-5xl w-max flex flex-col justify-center lg:flex-row gap-8">
    <form
        on:submit|preventDefault={() => setConfig()}
        class="flex flex-col gap-8"
    >
        <h2 class="text-2xl text-center font-bold tracking-tight">General Config</h2>
        <Input text="User Agent" bind:bindValue={localStorageObject.main} forValue="main" />
        <Textarea text="General Puppets" bind:bindValue={localStorageObject.puppets} forValue="pup" />
        <div class="flex flex-col lg:flex-row gap-4 justify-between max-w-lg">
            <label class="w-24" for="pass">Password</label>
            <input
                id="pass"
                bind:value={localStorageObject.password}
                title={localStorageObject.puppets.includes(',')
                    ? 'A comma is detected in the puppet list, assuming that format.'
                    : ''}
                class="text-right text-black p-1 max-w-xs rounded-md border border-black dark:border-none disabled:opacity-25"
            />
        </div>
        <h2 class="text-2xl text-center font-bold tracking-tight">gotIssues</h2>
        <div class="flex gap-4 justify-between max-w-lg">
			<label class="w-24" for="mode">Issues Mode</label>
            <Select bind:mode={localStorageObject.issuesmode} options={["Both", "Issues", "Packs"]} />
		</div>
        <h2 class="text-2xl text-center font-bold tracking-tight">Rate of Change</h2>
        <Input text="Top {localStorageObject.top}" bind:bindValue={localStorageObject.top} forValue="top" />
        <Input text="Over {localStorageObject.days} Days" bind:bindValue={localStorageObject.days} forValue="days" />
        <Input text={`Specific ROC`} bind:bindValue={localStorageObject.specific} forValue="specific" />
        <h2 class="text-2xl text-center font-bold tracking-tight">Endotarting</h2>
        <Input text="Endotarting Default" bind:bindValue={localStorageObject.endotartnation} forValue="Endotarting" />
        <Input text="Endorse Limit" bind:bindValue={localStorageObject.limit} forValue="limit" />
        <Textarea text="Immune Nations" bind:bindValue={localStorageObject.immune} forValue="immune" />
        <div class="flex gap-4 justify-between max-w-lg">
			<label class="w-24" for="mode">Council</label>
            <Select bind:mode={localStorageObject.endotartsource} options={["XML", "API"]} />
		</div>
        <h2 class="text-2xl text-center font-bold tracking-tight">Not Endorsing</h2>
        <Input text="Not Endorsing Default" bind:bindValue={localStorageObject.nennation} forValue="nen" />
        <h2 class="text-2xl text-center font-bold tracking-tight">JunkDaJunk Finder Shared</h2>
        <h2 class="text-2xl text-center font-bold tracking-tight">JunkDaJunk</h2>
        <Textarea text="Regional Whitelist" bind:bindValue={localStorageObject.regionalwhitelist} forValue="regions" />
        <div class="flex flex-col lg:flex-row gap-4 justify-between max-w-lg">
            <label class="w-24" for="jdj">JDJ Default Behavior</label>
			<Select bind:mode={localStorageObject.jdjMode} options={['Gift', 'Sell']} />
        </div>
        <Input text="Card Count Threshold" bind:bindValue={localStorageObject.cardcount} forValue="card" />
        <Input text="Owner Threshold" bind:bindValue={localStorageObject.ownercount} forValue="owner" />
        <Input text="Gift To" bind:bindValue={localStorageObject.giftee} forValue="giftee" />
        <Rarities bind:rarities={localStorageObject.rarities} />
        <h2 class="text-2xl text-center font-bold tracking-tight">Finder</h2>
        <div class="flex flex-col lg:flex-row gap-4 justify-between max-w-lg">
            <label class="w-24" for="finder">Finder Default Behavior</label>
			<Select bind:mode={localStorageObject.finderMode} options={['Gift', 'Sell']} />
        </div>
        <Textarea text="Card IDs to Find" bind:bindValue={localStorageObject.finderlist} forValue="find" />
        <h2 class="text-2xl text-center font-bold tracking-tight">Approval</h2>
		<div class="flex gap-4 justify-between max-w-lg">
			<label class="w-24" for="mode">Council</label>
            <Select bind:mode={localStorageObject.council} options={['General Assembly', 'Security Council']} />
		</div>
        <Input text="Proposal ID" bind:bindValue={localStorageObject.proposalid} forValue="proposalID" required={false} />
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