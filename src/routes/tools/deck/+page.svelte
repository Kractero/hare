<script lang="ts">
	import { onMount } from 'svelte'
	import { page } from '$app/state'
	import Buttons from '$lib/components/Buttons.svelte'
	import UserAgent from '$lib/components/formFields/UserAgent.svelte'
	import FormInput from '$lib/components/FormInput.svelte'
	import FormSelect from '$lib/components/FormSelect.svelte'
	import Terminal from '$lib/components/Terminal.svelte'
	import ToolContent from '$lib/components/ToolContent.svelte'
	import { parseXML } from '$lib/helpers/parser'
	import { checkUserAgent, pushHistory } from '$lib/helpers/utils'
	import type { Card } from '$lib/types'

	let domain = ''
	let progress = $state('')
	let main = $state('')
	let checkObject = $state('')
	let downloadable = $state(false)
	let content = $state('')
	let mode = $state('Signal')
	let type = $state('Deck')
	let duplicates = $state('Skip')
	let errors: Array<{ field: string | number; message: string }> = $state([])

	onMount(() => {
		domain = `https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net`
		main = page.url.searchParams.get('main') || (localStorage.getItem('main') as string) || ''
		checkObject = page.url.searchParams.get('nation') || ''
		mode = page.url.searchParams.get('mode') || (localStorage.getItem('deckMode') as string) || 'Signal'
		duplicates = page.url.searchParams.get('duplicates') || (localStorage.getItem('deckDuplicates') as string) || 'Skip'
		type = page.url.searchParams.get('type') || (localStorage.getItem('deckCollMode') as string) || 'Deck'
	})

	async function onSubmit(e: Event) {
		e.preventDefault()
		downloadable = false
		pushHistory(`?main=${main}&nation=${checkObject}&mode=${mode}&type=${type}&duplicates=${duplicates}`)
		errors = checkUserAgent(main)
		if (errors.length > 0) return
		progress = ''
		if (type.toLowerCase() === 'deck') {
			const xml = await parseXML(`${domain}/cgi-bin/api.cgi?q=cards+deck;nationname=${checkObject}`, main)
			let deckObj: Array<Card> = xml.CARDS.DECK.CARD
			deckObj = deckObj ? (Array.isArray(deckObj) ? deckObj : [deckObj]) : []
			if (duplicates === 'Skip') {
				content = Array.from(
					new Set((deckObj as Card[]).map(card => (mode === 'Signal' ? `${card.CARDID},${card.SEASON}` : card.CARDID)))
				).join('\n')
			} else {
				content = Array.from(deckObj as Card[])
					.map(card => (mode === 'Signal' ? `${card.CARDID},${card.SEASON}` : card.CARDID))
					.join('\n')
			}
		} else {
			const xml = await parseXML(`${domain}/cgi-bin/api.cgi?q=cards+collection;collectionid=${checkObject}`, main)
			let collObj: Array<Card> = xml.CARDS.COLLECTION.DECK.CARD
			collObj = collObj ? (Array.isArray(collObj) ? collObj : [collObj]) : []
			if (duplicates === 'Skip') {
				content = Array.from(
					new Set((collObj as Card[]).map(card => (mode === 'Signal' ? `${card.CARDID},${card.SEASON}` : card.CARDID)))
				).join('\n')
			} else {
				content = Array.from(collObj as Card[])
					.map(card => (mode === 'Signal' ? `${card.CARDID},${card.SEASON}` : card.CARDID))
					.join('\n')
			}
		}
		downloadable = true
		progress += `<p>Finished processing</p>`
	}
</script>

<ToolContent
	toolTitle="Deck to IDs"
	icon="🃏"
	caption={'Turn a deck into a text file of card ids, duplicates ignored.'} />

<div class="flex flex-col gap-8 break-normal lg:w-[1024px] lg:max-w-5xl lg:flex-row">
	<form onsubmit={onSubmit} class="flex flex-col gap-8">
		<UserAgent bind:main bind:errors />
		<FormInput
			label={type.toLowerCase() === 'deck' ? `Nation` : 'Collection'}
			bind:bindValue={checkObject}
			id="checkObject"
			required={true} />
		<FormSelect id="type" label="Type" bind:bindValue={type} items={['Deck', 'Collection']} />
		<FormSelect id="duplicates" label="Duplicates" bind:bindValue={duplicates} items={['Skip', 'Include']} />
		<FormSelect id="mode" label="Mode" bind:bindValue={mode} items={['Signal', 'IDs']} />
		<Buttons downloadButton={true} bind:downloadable bind:content type="txt" name="Deck" />
	</form>
	<Terminal bind:progress />
</div>
