<script lang="ts">
	import { onDestroy, onMount } from 'svelte'
	import { page } from '$app/stores'
	import Buttons from '$lib/components/Buttons.svelte'
	import FormInput from '$lib/components/FormInput.svelte'
	import FormSelect from '$lib/components/FormSelect.svelte'
	import InputCredentials from '$lib/components/InputCredentials.svelte'
	import Terminal from '$lib/components/Terminal.svelte'
	import ToolContent from '$lib/components/ToolContent.svelte'
	import { parseXML } from '$lib/helpers/parser'
	import { checkUserAgent, pushHistory, urlParameters } from '$lib/helpers/utils'
	import type { Card, Issue } from '$lib/types'

	const abortController = new AbortController()
	let domain = ''
	let progress = ''
	let downloadable = false
	let content = `<tr><th>Nation</th><th class='sort' data-order='none'>Bank</th><th class='sort' data-order='none'>Deck Value</th><th class='sort' data-order='none'>Junk Value</th><th class='sort' data-order='none'>Card Count</th>$</tr>\n`
	let stoppable = false
	let stopped = false
	let main = ''
	let puppets = ''
	let password = ''
	let mode: string
	let transferCard = ''
	let errors: Array<{ field: string | number; message: string }> = []

	onMount(() => {
		domain = `https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net`
		main = $page.url.searchParams.get('main') || (localStorage.getItem('main') as string) || ''
		puppets = (localStorage.getItem('puppets') as string) || ''
		password = (localStorage.getItem('password') as string) || ''
		mode = $page.url.searchParams.get('mode') || (localStorage.getItem('goldretrieverMode') as string) || 'Include'
		transferCard =
			$page.url.searchParams.get('goldretrieverTransferCard') ||
			(localStorage.getItem('goldretrieverTransferCard') as string) ||
			''
	})

	onDestroy(() => abortController.abort())

	async function onSubmit() {
		pushHistory(`?main=${main}&mode=${mode}${transferCard && `&goldretrieverTransferCard=${transferCard}`}`)
		errors = checkUserAgent(main)
		if (errors.length > 0) return
		downloadable = false
		stoppable = true
		stopped = false
		content = `<tr><th>Nation</th><th class='sort' data-order='none'>Bank</th><th class='sort' data-order='none'>Deck Value</th><th class='sort' data-order='none'>Junk Value</th><th class='sort' data-order='none'>Card Count</th>${mode === 'Include' ? "<th class='sort' data-order='none'>Issues</th><th class='sort' data-order='none'>Packs</th>" : ''}<th class='sort' data-order='none'>Legendary Count</th>${transferCard && '<th>Transfer Card</th>'}</tr>\n`
		progress = '<p>Initiating Gold Retriever...</p>'
		let puppetList = puppets.split('\n')
		let totals = {
			bank: 0,
			deckValue: 0,
			junkValue: 0,
			cardCount: 0,
			issues: 0,
			packs: 0,
		}
		for (let i = 0; i < puppetList.length; i++) {
			let nation = puppetList[i]
			let nationSpecificPassword = ''
			if (mode === 'Include' && nation.includes(',')) {
				nation = puppetList[i].split(',')[0]
				nationSpecificPassword = puppetList[i].split(',')[1]
			}
			if (abortController.signal.aborted || stopped) {
				break
			}
			const nation_formatted = nation.toLowerCase().replaceAll(' ', '_')
			try {
				progress += `<p>Processing ${nation} ${i + 1}/${puppetList.length}</p>`
				const deckInfo = await parseXML(`${domain}/cgi-bin/api.cgi/?nationname=${nation}&q=cards+deck+info`, main)
				const deck = {
					nation: nation,
					bank: 0,
					deckValue: 0,
					junkValue: 0,
					cardCount: 0,
					issues: 0,
					packs: 0,
				}

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
				deck.bank = deckInfo.CARDS.INFO.BANK
				deck.deckValue = deckInfo.CARDS.INFO.DECK_VALUE
				deck.cardCount = deckInfo.CARDS.INFO.NUM_CARDS
				deck.junkValue = Number(
					(
						(categoryCounts.legendary || 0) * 1 +
						(categoryCounts.epic || 0) * 0.5 +
						(categoryCounts.common || 0) * 0.01 +
						(categoryCounts.uncommon || 0) * 0.05 +
						(categoryCounts['ultra-rare'] || 0) * 0.2
					).toFixed(2)
				)

				if (mode === 'Include') {
					const issuesAndPacks = await parseXML(
						`${domain}/cgi-bin/api.cgi/?nation=${nation}&q=issues+packs`,
						main,
						nationSpecificPassword ? nationSpecificPassword : password.replaceAll(' ', '_')
					)
					const packs = issuesAndPacks.NATION.PACKS
					const issues: Issue = issuesAndPacks.NATION.ISSUES.ISSUE || []
					if (issues && !Array.isArray(issues)) {
						deck.issues = 1
					} else {
						deck.issues = issues.length
					}
					deck.packs = packs
				}

				totals.bank = totals.bank + deck.bank
				totals.deckValue = totals.deckValue + deck.deckValue
				totals.junkValue = totals.junkValue + deck.junkValue
				totals.cardCount = totals.cardCount + deck.cardCount
				totals.issues = totals.issues + deck.issues
				totals.packs = totals.packs + deck.packs
				content += `<tr>
					<td><p><a target='_blank' href='${domain}/container=${nation_formatted}/nation=${nation_formatted}?${urlParameters('Gold Retriever', main)}'>${deck.nation}</a></p></td>
					<td><p><a target='_blank' href='${domain}/page=deck/container=${nation_formatted}/nation=${nation_formatted}/value_deck=1?${urlParameters('Gold Retriever', main)}'>${deck.bank}</a></p></td>
					<td><p><a target='_blank' href='${domain}/page=deck/container=${nation_formatted}/nation=${nation_formatted}/value_deck=1?${urlParameters('Gold Retriever', main)}'>${deck.deckValue}</a></p></td>
					<td><p><a target='_blank' href='${domain}/page=deck/container=${nation_formatted}/nation=${nation_formatted}?${urlParameters('Gold Retriever', main)}'>${deck.junkValue}</a></p></td>
					<td><p><a target='_blank' href='${domain}/page=deck/container=${nation_formatted}/nation=${nation_formatted}?${urlParameters('Gold Retriever', main)}'>${deck.cardCount}</a></p></td>

					${
						mode === 'Include'
							? `
						<td><p><a target='_blank' href='${domain}/page=dilemmas/container=${nation_formatted}/nation=${nation_formatted}?${urlParameters('Gold Retriever', main)}'>${deck.issues}</a></p></td>
						<td><p><a target='_blank' href='${domain}/page=deck/container=${nation_formatted}/nation=${nation_formatted}?${urlParameters('Gold Retriever', main)}'>${deck.packs}</a></p></td>
					`
							: ''
					}

					<td><p><a target='_blank' href='${domain}/page=deck/container=${nation_formatted}/nation=${nation_formatted}/value_deck=1/?filter=legendary?${urlParameters('Gold Retriever', main)}'>${categoryCounts.legendary ? Number(categoryCounts.legendary) : 0}</a></p></td>
					${transferCard && `<td><p><a target='_blank' href='${domain}/page=deck/container=${nation_formatted}/nation=${nation_formatted}/card=${transferCard.split(',')[0]}/season=${transferCard.split(',')[1]}/${urlParameters('Gold Retriever', main)}'>Transfer Card</a></p></td>`}
				</tr>\n`
			} catch (err) {
				progress += `<p class="text-red-400">Error processing ${nation} with ${err}</p>`
			}
		}
		progress += `<p>Finished processing! You have a cumulative ${totals.bank.toFixed(2)} bank, ${totals.deckValue.toFixed(2)} deckValue, ${totals.junkValue.toFixed(2)} junk value, and ${totals.cardCount} cards. ${mode === 'Include' ? `${totals.issues} issues await you, and you have ${totals.packs} packs to open.` : ''}</p>`
		downloadable = true
		stoppable = false
	}
</script>

<ToolContent
	toolTitle="Gold Retriever"
	originalBlurb="rewritten in JS for browser use by Kractero"
	caption="Get deck value, junk value, and more of all your puppets."
	author="ValentineZ"
	link="https://forum.nationstates.net/viewtopic.php?f=42&t=476326"
	additional={`<p class="text-xs mb-16">
	Password input is optional and will be disabled if the puppet list includes a comma for nation,password.
</p>`} />

<div class="flex flex-col gap-8 break-normal lg:w-[1024px] lg:max-w-5xl lg:flex-row">
	<form on:submit|preventDefault={onSubmit} class="flex flex-col gap-8">
		<InputCredentials
			bind:errors
			bind:main
			bind:puppets
			bind:password
			authenticated={mode === 'Include' ? true : false} />
		<FormSelect label="Include Packs?" id="mode" bind:bindValue={mode} items={['Include', 'Skip']} />
		<FormInput
			label={`Transfer Card`}
			subTitle="(optional: id,season)"
			bind:bindValue={transferCard}
			id="transferCard"
			required={false} />
		<Buttons
			downloadButton={true}
			bind:downloadable
			bind:content
			type="html"
			name="Gold Retriever"
			stopButton={true}
			bind:stoppable
			bind:stopped />
	</form>
	<Terminal bind:progress />
</div>
