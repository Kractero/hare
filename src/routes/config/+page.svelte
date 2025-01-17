<script lang="ts">
	import { onMount } from 'svelte'
	import FormCheckbox from '$lib/components/FormCheckbox.svelte'
	import FormInput from '$lib/components/FormInput.svelte'
	import FormSelect from '$lib/components/FormSelect.svelte'
	import FormTextArea from '$lib/components/FormTextArea.svelte'
	import Head from '$lib/components/Head.svelte'
	import Rarities from '$lib/components/Rarities.svelte'
	import Button from '$lib/components/ui/button/button.svelte'
	import { Toaster } from '$lib/components/ui/sonner'
	import { toast } from 'svelte-sonner'

	const localStorageObject: { [key: string]: any } = $state({
		connectionUrl: 'www',
		theme: 'system',
		puppets: '',
		main: '',
		password: '',
		gotissuesPuppets: '',
		gotissuesMode: 'Both',
		gotissuesIssuesCount: '5',
		gotissuesPackCount: 'All',
		gotissuesMinPack: '0',
		rocTop: '100',
		rocDays: '30',
		rocSpecific: '',
		rocMode: 'Top',
		endotartEndotarter: '',
		endotartLimit: '',
		endotartImmune: '',
		endotartSource: 'XML',
		endotartInclude: 'Unendorsed',
		nenNation: '',
		finderList: '',
		junkdajunkRegionalWhitelist: '',
		junkdajunkFlagWhitelist: '',
		junkdajunkFinderList: '',
		jdjMode: 'Gift',
		jdjCheckMode: 'Advanced',
		finderMode: 'Gift',
		junkdajunkRarities: {
			common: 0.5,
			uncommon: 1,
			rare: 1,
			'ultra-rare': 1,
			epic: 1,
		},
		junkdajunkRaritiesBid: {
			common: 0.5,
			uncommon: 1,
			rare: 1,
			'ultra-rare': 1,
			epic: 1,
		},
		finderGiftee: '',
		junkdajunkOwnerCount: '',
		junkdajunkCardCount: '',
		goldretrieverMode: 'Include',
		goldretrieverTransferCard: '',
		junkdajunkOmittedSeasons: '',
		junkdajunkExnation: false,
		flagmanagerMode: 'Flags',
		flagmanagerFlags: '',
		flagmanagerMottos: '',
		signalCardIds: '',
		signalCollectionsOrDecks: '',
		signalAsksBidsNation: '',
		signalMode: 'Collection',
		deckMode: 'Signal',
		deckCollMode: 'Deck',
		deckDuplicates: 'Skip',
		transferBank: '10',
		transferMode: 'Bank',
		orphansDeck: '',
		junkdajunkTransferBank: '-1',
		loginSheetMode: 'UploadFlag',
		auctionCards: '',
		auctionMain: '',
		auctionAmount: '',
		auctionMode: 'Transfers',
	})

	onMount(() => {
		Object.keys(localStorageObject).forEach(key => {
			if (key === 'junkdajunkExnation') {
				localStorageObject.junkdajunkExnation = localStorage.getItem(key) === 'true'
			} else {
				localStorageObject[key] = localStorage.getItem(key) || localStorageObject[key]
			}
		})
		if (typeof localStorageObject.junkdajunkRarities === 'string') {
			localStorageObject.junkdajunkRarities = JSON.parse(localStorageObject.junkdajunkRarities)
		}
		if (typeof localStorageObject.junkdajunkRaritiesBid === 'string') {
			localStorageObject.junkdajunkRaritiesBid = JSON.parse(localStorageObject.junkdajunkRaritiesBid)
		}

		// Fallback for junkdajunkRaritiesBid if not defined
		if (!localStorage.getItem('junkdajunkRaritiesBid')) {
			localStorageObject.junkdajunkRaritiesBid = localStorageObject.junkdajunkRarities
		}
	})

	async function onSubmit(e: Event) {
		e.preventDefault()
		const changes = []
		for (const key in localStorageObject) {
			if (key === 'junkdajunkRarities') {
				const rarities = localStorage.getItem(key)
				const curr = rarities ? JSON.parse(rarities) : {}
				const conf = localStorageObject.junkdajunkRarities
				Object.keys(curr).forEach(rarity => {
					if (curr[rarity] !== conf[rarity]) changes.push(key)
				})
				localStorage.setItem(key, JSON.stringify(localStorageObject.junkdajunkRarities))
			} else if (key === 'junkdajunkRaritiesBid') {
				const rarities = localStorage.getItem(key)
				const curr = rarities ? JSON.parse(rarities) : {}
				const conf = localStorageObject.junkdajunkRaritiesBid

				// Use rarities from junkdajunkRarities if not set
				Object.keys(conf).forEach(rarity => {
					if (!curr[rarity]) {
						curr[rarity] = localStorageObject.junkdajunkRarities[rarity]
					}
				})

				Object.keys(curr).forEach(rarity => {
					if (curr[rarity] !== conf[rarity]) changes.push(key)
				})
				localStorage.setItem(key, JSON.stringify(conf))
			} else {
				if (localStorage.getItem(key) !== String(localStorageObject[key])) {
					changes.push(key)
				}
				localStorage.setItem(key, localStorageObject[key])
			}
		}
		if (changes.length > 0) {
			toast(`Set ${changes.map(change => change.trim()).join(', ')}`)
		} else {
			toast('Nothing was changed... ¯_(ツ)_/¯')
		}
	}
</script>

<Toaster />

<Head title={'Hare - Config'} description={'Configure your default inputs for each script.'} />

<h1 class="mb-16 text-center text-4xl">Configure Default Inputs</h1>

<div
	class="mx-auto flex w-max max-w-xs flex-col justify-center gap-8 sm:max-w-5xl lg:w-[1024px] lg:max-w-5xl lg:flex-row">
	<form onsubmit={onSubmit} class="flex flex-col gap-8">
		<h2 class="text-center text-2xl font-bold tracking-tight">General Config</h2>
		<FormSelect
			id="connectionsubdomain"
			label="Connection Subdomain"
			bind:bindValue={localStorageObject.connectionUrl}
			items={['www', 'fast']} />
		<FormSelect
			id="theme"
			label="Theme"
			bind:bindValue={localStorageObject.theme}
			items={['system', 'light', 'dark']} />
		<FormInput label="User Agent" bind:bindValue={localStorageObject.main} id="main" />
		<FormTextArea label="General Puppets" bind:bindValue={localStorageObject.puppets} id="pup" />
		<p class="text-center text-xs">These puppets do not apply for gotIssues or junkdajunk.</p>
		<FormInput
			id="pass"
			bind:bindValue={localStorageObject.password}
			type="password"
			label={'Password'}
			subTitle={localStorageObject.puppets.includes(',')
				? 'A comma is detected in the puppet list, assuming that format.'
				: ''} />
		<h2 class="text-center text-2xl font-bold tracking-tight">gotIssues and junkDaJunk</h2>
		<FormTextArea label="Puppets" bind:bindValue={localStorageObject.gotissuesPuppets} id="gipup" />
		<h2 class="text-center text-2xl font-bold tracking-tight">gotIssues</h2>
		<FormSelect
			id="gimode"
			label="Behavior"
			bind:bindValue={localStorageObject.gotissuesMode}
			items={['Both', 'Issues', 'Packs']} />
		<FormSelect
			id="gicount"
			label="Issues Count"
			bind:bindValue={localStorageObject.gotissuesIssueCount}
			items={['1', '2', '3', '4', '5']} />
		<FormSelect
			id="gipackcount"
			label="Pack Count"
			bind:bindValue={localStorageObject.gotissuesPackCount}
			items={['All', '1', '2', '3', '4', '5', '6', '7', '8', '9']} />
		<FormSelect
			id="minPack"
			label="Minimum Pack Count"
			bind:bindValue={localStorageObject.gotissuesMinPack}
			items={['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']} />
		<h2 class="text-center text-2xl font-bold tracking-tight">Rate of Change</h2>
		<FormInput label="Top {localStorageObject.rocTop}" bind:bindValue={localStorageObject.rocTop} id="top" />
		<FormInput label="Over {localStorageObject.rocDays} Days" bind:bindValue={localStorageObject.rocDays} id="days" />
		<FormInput label={`Specific ROC`} bind:bindValue={localStorageObject.rocSpecific} id="specific" />
		<FormSelect id="rocmode" label="Behavior" bind:bindValue={localStorageObject.rocMode} items={['Top', 'Specific']} />
		<h2 class="text-center text-2xl font-bold tracking-tight">Endotarting</h2>
		<FormInput label="Endotarting Default" bind:bindValue={localStorageObject.endotartEndotarter} id="Endotarting" />
		<FormInput label="Endorse Limit" bind:bindValue={localStorageObject.endotartLimit} id="limit" />
		<FormSelect
			id="inclusion"
			label="Sheet Inclusion"
			bind:bindValue={localStorageObject.endotartInclude}
			items={['Unendorsed', 'All']} />
		<FormTextArea label="Immune Nations" bind:bindValue={localStorageObject.endotartImmune} id="immune" />
		<FormSelect
			id="endotartmode"
			label="Behavior"
			bind:bindValue={localStorageObject.endotartSource}
			items={['XML', 'API']} />
		<h2 class="text-center text-2xl font-bold tracking-tight">Not Endorsing</h2>
		<FormInput label="Not Endorsing Default" bind:bindValue={localStorageObject.nenNation} id="nen" />
		<h2 class="text-center text-2xl font-bold tracking-tight">Gold Retriever</h2>
		<FormSelect
			id="grmode"
			label="Behavior"
			bind:bindValue={localStorageObject.goldretrieverMode}
			items={['Include', 'Skip']} />
		<FormInput
			label={`Transfer Card`}
			subTitle="(optional: id,season)"
			bind:bindValue={localStorageObject.goldretrieverTransferCard}
			id="transferCard"
			required={false} />
		<FormInput label="Gift To" bind:bindValue={localStorageObject.finderGiftee} id="giftee" />
		<h2 class="text-center text-2xl font-bold tracking-tight">JunkDaJunk</h2>
		<FormSelect
			bind:bindValue={localStorageObject.jdjCheckMode}
			id="checkMode"
			items={['Advanced', 'Simple']}
			label="Mode" />
		<FormSelect
			id="jdjmode"
			label="Behavior"
			bind:bindValue={localStorageObject.jdjMode}
			items={['Gift', 'Sell', 'Exclude']} />
		<FormTextArea label="Card ID Whitelist" bind:bindValue={localStorageObject.junkdajunkFinderList} id="jdjfind" />
		<FormTextArea
			label="Regional Whitelist"
			bind:bindValue={localStorageObject.junkdajunkRegionalWhitelist}
			id="regions" />
		<FormTextArea label="Flag Whitelist" bind:bindValue={localStorageObject.junkdajunkFlagWhitelist} id="flags" />
		<FormInput label="Card Count Threshold" bind:bindValue={localStorageObject.junkdajunkCardCount} id="card" />
		<FormInput label="Owner Threshold" bind:bindValue={localStorageObject.junkdajunkOwnerCount} id="owner" />
		<Rarities bind:rarities={localStorageObject.junkdajunkRarities} />
		<Rarities bind:rarities={localStorageObject.junkdajunkRaritiesBid} />
		<FormSelect
			bind:bindValue={localStorageObject.junkdajunkOmittedSeasons}
			id="skipseason"
			items={["Don't Skip", 'Skip Offseasons', '1', '2']}
			label="Skip Seasons?" />
		<FormCheckbox bind:checked={localStorageObject.junkdajunkExnation} id="skipexnation" label="Skip Exnation" />
		<FormInput
			label="Maximum Bank Threshold"
			bind:bindValue={localStorageObject.junkdajunkTransferBank}
			id="jdjtransfer"
			required={false} />
		<h2 class="text-center text-2xl font-bold tracking-tight">Finder</h2>
		<FormSelect
			id="findermode"
			label="Behavior"
			bind:bindValue={localStorageObject.finderMode}
			items={['Gift', 'Sell', 'Exclude']} />
		<FormTextArea label="Card IDs to Find" bind:bindValue={localStorageObject.finderList} id="find" />
		<h2 class="text-center text-2xl font-bold tracking-tight">Flags</h2>
		<FormSelect
			id="flagmode"
			label="Mode"
			bind:bindValue={localStorageObject.flagmanagerMode}
			items={['Flags', 'Mottos']} />
		<FormTextArea label="Search Flags" bind:bindValue={localStorageObject.flagmanagerFlags} id="flags" />
		<FormTextArea label="Motto" bind:bindValue={localStorageObject.flagmanagerMottos} id="mottos" />
		<h2 class="text-center text-2xl font-bold tracking-tight">Signal</h2>
		<FormTextArea label="Card IDs" bind:bindValue={localStorageObject.signalCardIds} id="cardIds" />
		<FormSelect
			id="signalmode"
			label="Behavior"
			bind:bindValue={localStorageObject.signalMode}
			items={['Collection', 'Deck', 'Asks', 'Bids', 'Asks and Bids']} />
		<FormInput label={`Nation`} bind:bindValue={localStorageObject.signalAsksBidsNation} id="nation" />
		<FormTextArea label={'Coll/Decks'} bind:bindValue={localStorageObject.signalCollectionsOrDecks} id="mode" />
		<h2 class="text-center text-2xl font-bold tracking-tight">Deck</h2>
		<FormSelect
			id="deckmode"
			label="Output Format"
			bind:bindValue={localStorageObject.deckMode}
			items={['Signal', 'IDs']} />
		<FormSelect
			id="deckcollmode"
			label="Mode"
			bind:bindValue={localStorageObject.deckCollMode}
			items={['Deck', 'Collection']} />
		<FormSelect
			id="deckduplicates"
			label="Duplicates"
			bind:bindValue={localStorageObject.deckDuplicates}
			items={['Skip', 'Include']} />
		<h2 class="text-center text-2xl font-bold tracking-tight">Transfer</h2>
		<FormInput label="Transfer Bank Threshold" bind:bindValue={localStorageObject.transferBank} id="transfer" />
		<FormSelect
			id="transfermode"
			label="Transfer Bank Mode"
			bind:bindValue={localStorageObject.transferMode}
			items={['Bank', 'Junk']} />
		<h2 class="text-center text-2xl font-bold tracking-tight">Orphans</h2>
		<FormInput label="Deck" bind:bindValue={localStorageObject.orphansDeck} id="orphansDeck" />
		<h2 class="text-center text-2xl font-bold tracking-tight">Login Sheet</h2>
		<FormSelect
			id="mode"
			label="Mode"
			bind:bindValue={localStorageObject.loginSheetMode}
			items={['UploadFlag', 'SubmitIssue']} />
		<h2 class="text-center text-2xl font-bold tracking-tight">Auction</h2>
		<FormTextArea bind:bindValue={localStorageObject.auctionCards} label={'Cards'} id="auctionCards" />
		<FormInput label="Auction Main" bind:bindValue={localStorageObject.auctionMain} id="auctionMain" />
		<FormInput label="Auction Amount" bind:bindValue={localStorageObject.auctionAmount} id="amount" />
		<FormSelect
			id="auctionMode"
			label="Auction Mode"
			bind:bindValue={localStorageObject.auctionMode}
			items={['Transfer', 'Bids', 'Asks']} />
		<div class="flex max-w-lg justify-center">
			<Button class="mx-auto w-max" variant="default" type="submit">Submit</Button>
		</div>
	</form>
</div>
