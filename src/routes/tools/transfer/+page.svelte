<script lang="ts">
	import { onDestroy, onMount } from 'svelte'
	import { page } from '$app/stores'
	import Buttons from '$lib/components/Buttons.svelte'
	import FormInput from '$lib/components/FormInput.svelte'
	import FormSelect from '$lib/components/FormSelect.svelte'
	import InputCredentials from '$lib/components/InputCredentials.svelte'
	import Terminal from '$lib/components/Terminal.svelte'
	import ToolContent from '$lib/components/ToolContent.svelte'
	import { pushHistory } from '$lib/helpers/navigation'
	import { parseXML } from '$lib/helpers/parser'
	import { checkUserAgent } from '$lib/helpers/validate'
	import type { Card } from '$lib/types'

	const abortController = new AbortController()
	let progress = ''
	let downloadable = false
	let stoppable = false
	let stopped = false
	let main = ''
	let puppets = ''
	let content = ''
	let transfer = '10'
	let transferrable: Array<string> = []
	let mode = 'Bank'
	let errors: Array<{ field: string | number; message: string }> = []

	onMount(() => {
		main = $page.url.searchParams.get('main') || (localStorage.getItem('main') as string) || ''
		puppets = (localStorage.getItem('puppets') as string) || ''
		transfer =
			$page.url.searchParams.get('transfer') ||
			(localStorage.getItem('transferBank') as string) ||
			'10'
		mode =
			$page.url.searchParams.get('mode') ||
			(localStorage.getItem('transferMode') as string) ||
			'Bank'
	})

	onDestroy(() => abortController.abort())

	async function goldRetriever() {
		pushHistory(`?main=${main}&transfer=${transfer}&mode=${mode}`)
		errors = checkUserAgent('main')
		if (errors.length > 0) return
		downloadable = false
		stoppable = true
		stopped = false
		transferrable = []
		progress = '<p>Initiating Transfer List...</p>'
		let puppetList = puppets.split('\n')
		let count = 0
		let bank = 0
		for (let i = 0; i < puppetList.length; i++) {
			let nation = puppetList[i]
			if (abortController.signal.aborted || stopped) {
				break
			}
			try {
				progress += `<p>Processing ${nation} ${i + 1}/${puppetList.length}</p>`
				const deckInfo = await parseXML(
					`https://${
						localStorage.getItem('connectionUrl') || 'www'
					}.nationstates.net/cgi-bin/api.cgi/?nationname=${nation}&q=cards+deck+info`,
					main
				)
				if (mode === 'Bank') {
					let nationalBank = deckInfo.CARDS.INFO.BANK
					if (nationalBank >= Number(transfer)) {
						progress += `<p class="text-green-400">${nation} can transfer!</p>`
						count++
						bank = nationalBank + bank
						transferrable.push(nation)
					}
				}
				if (mode === 'Junk') {
					const categoryCounts: { [key: string]: number } = {}
					if (deckInfo.CARDS.DECK.CARD) {
						let deckObj: Array<Card> = deckInfo.CARDS.DECK.CARD
						deckObj = deckObj ? (Array.isArray(deckObj) ? deckObj : [deckObj]) : []
						for (let i = 0; i < deckObj.length; i++) {
							const category = deckObj[i].CATEGORY
							if (categoryCounts[category]) {
								categoryCounts[category] += 1
							} else {
								categoryCounts[category] = 1
							}
						}
					}
					let jv = Number(
						(
							(categoryCounts.legendary || 0) * 1 +
							(categoryCounts.epic || 0) * 0.5 +
							(categoryCounts.common || 0) * 0.01 +
							(categoryCounts.uncommon || 0) * 0.05 +
							(categoryCounts['ultra-rare'] || 0) * 0.2
						).toFixed(2)
					)
					if (jv >= Number(transfer)) {
						progress += `<p class="text-green-400">${nation} has enough junk value to transfer!</p>`
						count++
						bank = jv + bank
						transferrable.push(nation)
					}
				}
			} catch (err) {
				progress += `<p class="text-red-400">Error processing ${nation} with ${err}</p>`
			}
		}
		content = transferrable.join('\n')
		progress += `<p>Finished processing! You have a cumulative ${bank} ${mode} to transfer from ${count}.</p>`
		downloadable = true
		stoppable = false
	}
</script>

<ToolContent
	toolTitle="Transfer"
	caption="Takes a bank threshold and receive a text file with puppets that have that bank or higher."
/>

<div class="flex flex-col gap-8 break-normal lg:w-[1024px] lg:max-w-5xl lg:flex-row">
	<form on:submit|preventDefault={() => goldRetriever()} class="flex flex-col gap-8">
		<InputCredentials bind:errors bind:main bind:puppets authenticated={false} />
		<FormSelect id="mode" label="Transfer Value" bind:bindValue={mode} items={['Bank', 'Junk']} />
		<FormInput
			label="Transfer Bank Threshold"
			bind:bindValue={transfer}
			id="transfer"
			required={true}
		/>
		<Buttons
			downloadButton={true}
			bind:downloadable
			bind:content
			type="txt"
			name="Transfer"
			stopButton={true}
			bind:stoppable
			bind:stopped
		/>
	</form>
	<Terminal bind:progress />
</div>
