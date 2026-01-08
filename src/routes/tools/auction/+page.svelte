<script lang="ts">
	import { onDestroy, onMount } from 'svelte'
	import { page } from '$app/state'
	import Buttons from '$lib/components/Buttons.svelte'
	import UserAgent from '$lib/components/formFields/UserAgent.svelte'
	import FormInput from '$lib/components/FormInput.svelte'
	import FormSelect from '$lib/components/FormSelect.svelte'
	import FormTextArea from '$lib/components/FormTextArea.svelte'
	import Terminal from '$lib/components/Terminal.svelte'
	import ToolContent from '$lib/components/ToolContent.svelte'
	import { parseXML } from '$lib/helpers/parser'
	import { canonicalize, checkUserAgent, pushHistory, urlParameters } from '$lib/helpers/utils'

	const abortController = new AbortController()

	let domain = ''
	let info = $state<Array<{ text: string; color?: string }>>([])
	let progress = $state<Array<{ text: string; color?: string }>>([])
	let downloadable = $state(false)
	let stoppable = $state(false)
	let stopped = $state(false)
	let main = $state('')
	let puppets = $state('')
	let content: Array<{ url: string; tableText: string; linkStyle?: string }> = $state([])
	let amount = $state('10')
	let mode = $state('Transfer')
	let transferCards = $state('')
	let auctionMain = $state('')
	let skip = $state('-1')
	let template = $state('Overall-None')
	let errors: Array<{ field: string | number; message: string }> = $state([])

	onMount(() => {
		domain = `https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net`
		main = page.url.searchParams.get('main') || (localStorage.getItem('main') as string) || ''
		puppets = (localStorage.getItem('puppets') as string) || ''
		transferCards = (localStorage.getItem('auctionCards') as string) || ''
		amount = page.url.searchParams.get('amount') || (localStorage.getItem('auctionAmount') as string) || '10'
		auctionMain = page.url.searchParams.get('auctionMain') || (localStorage.getItem('auctionMain') as string) || ''
		mode = page.url.searchParams.get('mode') || (localStorage.getItem('auctionMode') as string) || 'Transfer'
		skip = page.url.searchParams.get('skip') || (localStorage.getItem('auctionSkip') as string) || '-1'
	})

	onDestroy(() => abortController.abort())

	async function onSubmit(e: Event) {
		e.preventDefault()
		pushHistory(`?main=${main}&amount=${amount}&mode=${mode}`)
		errors = checkUserAgent('main')
		if (errors.length > 0) return
		downloadable = false
		stoppable = true
		stopped = false
		let puppetList = puppets.split('\n')
		let bank = 0
		progress = []
		content = []
		info = [{ text: 'Initiating Auction...' }]
		const findSplit = transferCards.split('\n').map(matcher => matcher.split(','))
		const transferCounts: { [key: string]: { count: number; season: string; id: string } } = {}

		if (mode === 'Bids' || mode === 'Asks') {
			let counter = 0
			for (const card of findSplit) {
				let [id, season, bidsToPlace] = card
				if (!season) {
					info = [...info, { text: 'You did not provide the season.', color: 'red' }]
					stoppable = false
					return
				}
				if (!bidsToPlace) bidsToPlace = '1'
				const singleLink = `${domain}/container=${auctionMain}/nation=${auctionMain}/page=deck/card=${id}${template === 'Overall-None' ? '/template-overall=none' : ''}/season=${season}?mode=${mode === 'Bids' ? 'bid' : 'ask'}&amount=${amount}&${urlParameters('Auction', main)}`
				for (let i = 0; i < Number(bidsToPlace); i++) {
					counter++
					content.push({
						url: singleLink,
						tableText: `Link to ${mode === 'Bids' ? 'bid' : 'ask'}`,
					})
				}
			}

			info = [...info, { text: `${mode === 'Bids' ? 'Bid' : 'Ask'} links generated` }]
		}

		if (mode === 'Transfer') {
			const deckInfo = await parseXML(`${domain}/cgi-bin/api.cgi?nationname=${auctionMain}&q=cards+deck+info`, main)
			let cards = deckInfo.CARDS.DECK.CARD
			cards = cards ? (Array.isArray(cards) ? cards : [cards]) : []

			if (cards.length > 0) {
				for (const card of cards) {
					const id = card.CARDID
					const season = card.SEASON

					const matchingEntries = findSplit.filter(match => match[0] === String(id) && match[1] === String(season))
					if (matchingEntries.length > 0) {
						if (!transferCounts[id]) {
							transferCounts[id] = { count: 0, season, id }
						}
						transferCounts[id].count++
					}
				}

				for (const [id, { count, season }] of Object.entries(transferCounts)) {
					info = [
						...info,
						{ text: `${auctionMain} has ${count} copies of card ID ${id}, season ${season}`, color: 'blue' },
					]
				}
			}

			let currIndex = 0
			let bids = []

			const transferableIDs = Object.keys(transferCounts).filter(id => transferCounts[id].count > 0)
			for (let i = 0; i < puppetList.length; i++) {
				let nation = puppetList[i]
				if (abortController.signal.aborted || stopped) {
					break
				}
				try {
					progress = [...progress, { text: `Processing ${nation} ${i + 1}/${puppetList.length}` }]
					const deckInfo = await parseXML(`${domain}/cgi-bin/api.cgi?nationname=${nation}&q=cards+deck+info`, main)
					let nationalBank = deckInfo.CARDS.INFO.BANK

					if (nationalBank > Number(amount) && (Number(skip) < 0 || nationalBank < Number(skip))) {
						let cardsTransferable = Math.floor(nationalBank / Number(amount))
						progress = [...progress, { text: `${nation} can transfer ${cardsTransferable} cards!`, color: 'green' }]
						while (cardsTransferable > 0 && transferableIDs.length > 0) {
							let id = transferableIDs[currIndex]
							let { count, season } = transferCounts[id]

							if (!season) {
								progress = [...progress, { text: 'You did not provide the season.', color: 'red' }]
								stoppable = false
								return
							}

							if (count > 0 && transferCounts[id].count > 0) {
								progress = [...progress, { text: `${i + 1} Generated ask link for card ID ${id}, season ${season}` }]
								const singleAskLink = `${domain}/container=${canonicalize(auctionMain)}/nation=${canonicalize(auctionMain)}/page=deck/card=${id}${template === 'Overall-None' ? '/template-overall=none' : ''}/season=${season}?mode=ask&amount=${amount}&${urlParameters('Auction-Transfer', main)}`
								content.push({
									url: singleAskLink,
									tableText: `Link to Ask`,
								})
								progress = [
									...progress,
									{
										text: `${i + 1} Generated bid link for card ID ${id}, season ${season} to ${canonicalize(nation)}`,
									},
								]

								const singleBidLink = `${domain}/container=${canonicalize(nation)}/nation=${canonicalize(nation)}/page=deck/card=${id}${template === 'Overall-None' ? '/template-overall=none' : ''}/season=${season}?mode=bid&amount=${amount}&${urlParameters('Auction-Transfer', main)}`

								bids.push({
									url: singleBidLink,
									tableText: `Link to Bid on ${canonicalize(nation)}`,
								})

								transferCounts[id].count--
								cardsTransferable--

								if (transferCounts[id].count === 0) {
									transferableIDs.splice(currIndex, 1)

									if (currIndex > 0) currIndex--
								}
							}

							currIndex = (currIndex + 1) % transferableIDs.length
						}
						bank += nationalBank
					} else {
						if (nationalBank < Number(amount)) {
							progress = [
								...progress,
								{ text: `${nation} cannot afford any cards (Bank: ${nationalBank}).`, color: 'yellow' },
							]
						} else {
							progress = [
								...progress,
								{ text: `${nation}'s bank ${nationalBank} exceeds the skip threshold of ${skip}.`, color: 'yellow' },
							]
						}
					}
				} catch (err) {
					progress = [...progress, { text: `Error processing ${nation} with ${err}`, color: 'red' }]
				}
			}

			content = [...content, ...bids]

			progress = [...progress, { text: 'Auction links generated' }]
		}

		downloadable = true
		stoppable = false
	}
</script>

<ToolContent
	toolTitle="Auction"
	icon="🏛️"
	caption="A transfer tool."
	additional={`<p class="mb-2">
	Mode Transfer will first sum the total amount of transfer cards located on the main nation. It will then figure out how many times
	the provided puppets can transfer under the amount. It will then generate bid links equal to that amount, then ask links decrementing
	until all possible transfers have links. On
</p>
<p class="mb-2">
	Mode Bid/Ask will just place one bid or ask with the amount from the main nation on each card. You can place more than one bid
	if you include the amount, formatted like id,season,amount.
</p>
<p class="mb-2">
	Requires the
	<a class="underline" href="https://raw.githubusercontent.com/Kractero/userscripts/refs/heads/main/hare/auction/auction.user.js" target="_blank" rel="noreferrer noopener">
		hare auction userscript
	</a>
	to be useful.
</p>
<p class="mb-16">
	Requires id,season
	On mode bid/ask, accepts the amount
</p>`} />

<div class="flex flex-col gap-8 break-normal lg:w-5xl lg:max-w-5xl lg:flex-row">
	<form onsubmit={onSubmit} class="flex flex-col gap-8">
		<UserAgent bind:main bind:errors />
		{#if mode === 'Transfer'}
			<FormTextArea bind:bindValue={puppets} id="puppets" label="Puppets" required={false} />
		{/if}
		<FormTextArea bind:bindValue={transferCards} label={'Cards'} id="transferCards" required />
		<FormSelect id="mode" label="Mode" bind:bindValue={mode} items={['Transfer', 'Bids', 'Asks']} />
		<FormSelect id="template" label="Template" bind:bindValue={template} items={['Overall-None', 'Regular']} />
		<FormInput label="Main Nation" bind:bindValue={auctionMain} id="auctionMain" required={true} />
		<FormInput label="Amount" bind:bindValue={amount} id="amount" required={true} />
		<FormInput label="Skip Threshold" subTitle="-1 means don't skip" bind:bindValue={skip} id="skip" />
		<Buttons
			downloadButton={true}
			bind:downloadable
			bind:content
			name="Auction"
			stopButton={true}
			bind:stoppable
			bind:stopped>
		</Buttons>
	</form>
	<Terminal bind:info bind:progress />
</div>
