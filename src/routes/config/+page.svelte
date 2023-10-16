<script lang="ts">
	import { onMount } from 'svelte';
	import Head from '$lib/component/Head.svelte';
	import Rarities from '$lib/component/Rarities.svelte';
	import Input from '$lib/component/Input.svelte';
	import Textarea from '$lib/component/Textarea.svelte';
	import Select from '$lib/component/Select.svelte';
	import Checkbox from '$lib/component/Checkbox.svelte';

    const localStorageObject: {[key: string]: any } = {
    // const localStorageObject: {[key: string]: string | {[key: string]: number}} = {
        puppets: '',
        main: '',
        password: '',
        gotissuesPuppets: '',
        gotissuesMode: 'Both',
        rocTop: '100',
        rocDays: '30',
        rocSpecific: '',
        rocMode: 'Top',
        endotartEndotarter: '',
        endotartLimit: "0",
        endotartImmune: '',
        endotartSource: 'XML',
        nenNation: '',
        finderList: '',
        junkdajunkRegionalWhitelist: '',
        finderMode: 'Gift',
        junkdajunkRarities: {
            common: 0.5,
            uncommon: 1,
            rare: 1,
            'ultra-rare': 1,
            epic: 1,
        },
        finderGiftee: '',
        junkdajunkOwnerCount: '',
        junkdajunkCardCount: '',
        approvalCouncil: 'General Assembly',
        approvalProposal: '',
        goldretrieverMode: "Include",
        junkdajunkOmittedSeasons: "",
        junkdajunkExnation: false
    };

    onMount(() => {
        Object.keys(localStorageObject).forEach((key) => {
            if (key === "junkdajunkExnation") {
                localStorageObject.junkdajunkExnation = localStorage.getItem(key) === "true" || false;
            } else {
                localStorageObject[key] = localStorage.getItem(key) || localStorageObject[key];
            }
        });
        if (typeof localStorageObject.junkdajunkRarities === "string") {
            localStorageObject.junkdajunkRarities = JSON.parse(localStorageObject.junkdajunkRarities) 
        }
    });

	async function setConfig() {
        for (const key in localStorageObject) {
            if (key === "junkdajunkRarities") {
                localStorage.setItem(key, JSON.stringify(localStorageObject.junkdajunkRarities))
            } else {
                localStorage.setItem(key, localStorageObject[key]);
            }
        }
	}
</script>

<Head title={"Hare - Config"} description={"Configure your default inputs for each script."} />

<h1 class="text-4xl text-center mb-16">Configure Default Inputs</h1>

<div class="max-w-xs sm:max-w-5xl lg:w-[1024px] lg:max-w-5xl w-max flex flex-col justify-center lg:flex-row gap-8">
    <form
        on:submit|preventDefault={() => setConfig()}
        class="flex flex-col gap-8"
    >
        <h2 class="text-2xl text-center font-bold tracking-tight">General Config</h2>
        <Input text="User Agent" bind:bindValue={localStorageObject.main} forValue="main" />
        <Textarea text="General Puppets" bind:bindValue={localStorageObject.puppets} forValue="pup" />
        <p class="text-xs">These puppets do not apply for gotIssues or junkdajunk.</p>
        <div class="flex gap-4 justify-between max-w-lg">
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
        <h2 class="text-2xl text-center font-bold tracking-tight">gotIssues and junkDaJunk</h2>
        <Textarea text="Puppets" bind:bindValue={localStorageObject.gotissuesPuppets} forValue="gipup" />
        <h2 class="text-2xl text-center font-bold tracking-tight">gotIssues</h2>
        <div class="flex gap-4 justify-between max-w-lg">
			<label class="w-24" for="mode">Issues Mode</label>
            <Select bind:mode={localStorageObject.gotissuesMode} options={["Both", "Issues", "Packs"]} />
		</div>
        <h2 class="text-2xl text-center font-bold tracking-tight">Rate of Change</h2>
        <Input text="Top {localStorageObject.rocTop}" bind:bindValue={localStorageObject.rocTop} forValue="top" />
        <Input text="Over {localStorageObject.rocDays} Days" bind:bindValue={localStorageObject.rocDays} forValue="days" />
        <Input text={`Specific ROC`} bind:bindValue={localStorageObject.rocSpecific} forValue="specific" />
        <div class="flex gap-4 justify-between max-w-lg">
			<label class="w-24" for="mode">RoC Mode</label>
            <Select bind:mode={localStorageObject.rocMode} options={["Top", "Specific"]} />
		</div>
        <h2 class="text-2xl text-center font-bold tracking-tight">Endotarting</h2>
        <Input text="Endotarting Default" bind:bindValue={localStorageObject.endotartEndotarter} forValue="Endotarting" />
        <Input text="Endorse Limit" bind:bindValue={localStorageObject.endotartLimit} forValue="limit" />
        <Textarea text="Immune Nations" bind:bindValue={localStorageObject.endotartImmune} forValue="immune" />
        <div class="flex gap-4 justify-between max-w-lg">
			<label class="w-24" for="mode">Source</label>
            <Select bind:mode={localStorageObject.endotartSource} options={["XML", "API"]} />
		</div>
        <h2 class="text-2xl text-center font-bold tracking-tight">Not Endorsing</h2>
        <Input text="Not Endorsing Default" bind:bindValue={localStorageObject.nenNation} forValue="nen" />
        <h2 class="text-2xl text-center font-bold tracking-tight">Gold Retriever</h2>
        <div class="flex gap-4 justify-between max-w-lg">
            <label class="w-24" for="jdj">Issues and Packs?</label>
			<Select bind:mode={localStorageObject.goldretrieverMode} options={['Include', 'Skip']} />
        </div>
        <h2 class="text-2xl text-center font-bold tracking-tight">JunkDaJunk Finder Shared</h2>
        <div class="flex gap-4 justify-between max-w-lg">
            <label class="w-24" for="jdj">Default Behavior</label>
			<Select bind:mode={localStorageObject.finderMode} options={['Gift', 'Sell']} />
        </div>
        <Input text="Gift To" bind:bindValue={localStorageObject.finderGiftee} forValue="giftee" />
        <h2 class="text-2xl text-center font-bold tracking-tight">JunkDaJunk</h2>
        <Textarea text="Regional Whitelist" bind:bindValue={localStorageObject.junkdajunkRegionalWhitelist} forValue="regions" />
        <Input text="Card Count Threshold" bind:bindValue={localStorageObject.junkdajunkCardCount} forValue="card" />
        <Input text="Owner Threshold" bind:bindValue={localStorageObject.junkdajunkOwnerCount} forValue="owner" />
        <Rarities bind:rarities={localStorageObject.junkdajunkRarities} />
        <Checkbox bind:omittedSeasons={localStorageObject.junkdajunkOmittedSeasons} />
		<div class="flex flex-col lg:flex-row gap-4 justify-between max-w-lg">
            <p class="w-24">Skip S1 Exnation</p>
			<input on:change={() => localStorageObject.junkdajunkExnation = !localStorageObject.junkdajunkExnation} checked={localStorageObject.junkdajunkExnation} class="m-1" type="checkbox" />
		</div>
        <h2 class="text-2xl text-center font-bold tracking-tight">Finder</h2>
        <Textarea text="Card IDs to Find" bind:bindValue={localStorageObject.finderList} forValue="find" />
        <h2 class="text-2xl text-center font-bold tracking-tight">Approval</h2>
		<div class="flex gap-4 justify-between max-w-lg">
			<label class="w-24" for="mode">Council</label>
            <Select bind:mode={localStorageObject.approvalCouncil} options={['General Assembly', 'Security Council']} />
		</div>
        <Input text="Proposal ID" bind:bindValue={localStorageObject.approvalProposal} forValue="proposalID" required={false} />
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