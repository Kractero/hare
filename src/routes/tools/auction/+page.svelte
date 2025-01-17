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
	import { checkUserAgent, pushHistory, urlParameters } from '$lib/helpers/utils'

	const abortController = new AbortController()

	let domain = ''
	let progress = $state('')
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
	let errors: Array<{ field: string | number; message: string }> = $state([])

	onMount(() => {
		domain = `https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net`
		main = page.url.searchParams.get('main') || (localStorage.getItem('main') as string) || ''
		puppets = (localStorage.getItem('puppets') as string) || ''
		transferCards = (localStorage.getItem('auctionCards') as string) || ''
		amount = page.url.searchParams.get('amount') || (localStorage.getItem('auctionAmount') as string) || '10'
		auctionMain = page.url.searchParams.get('auctionMain') || (localStorage.getItem('auctionMain') as string) || ''
		mode = page.url.searchParams.get('mode') || (localStorage.getItem('auctionMode') as string) || 'Transfer'
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
		progress = '<p>Initiating Auction...</p>'
		let puppetList = puppets.split('\n')
		let count = 0
		let bank = 0
		content = []
		const findSplit = transferCards.split('\n').map(matcher => matcher.split(','))
		const transferCounts: { [key: string]: { count: number; season: string; id: string } } = {}

		if (mode === 'Bids' || mode === 'Asks') {
			let counter = 0
			for (const card of findSplit) {
				let [id, season, bidsToPlace] = card
				if (!season) {
					progress += `<p class="text-red-400">You did not provide the season.</p>`
					stoppable = false
					return
				}
				if (!bidsToPlace) bidsToPlace = '1'
				const singleLink = `${domain}/container=${auctionMain}/nation=${auctionMain}/page=deck/card=${id}/season=${season}?mode=${mode === 'Bids' ? 'bid' : 'ask'}&amount=${amount}?${urlParameters('Auction', main)}`
				for (let i = 0; i < Number(bidsToPlace); i++) {
					counter++
					content.push({
						url: singleLink,
						tableText: `Link to ${mode === 'Bids' ? 'bid' : 'ask'}`,
					})
				}
			}

			progress += `${mode === 'Bids' ? 'Bid' : 'Ask'} links generated`
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
					progress += `<p class="text-blue-400">${auctionMain} has ${count} copies of card ID ${id}, season ${season}</p>`
				}
			}
			let puppetTransfer: { name: string; transfer: number }[] = []
			let totalTransferrable = 0

			for (let i = 0; i < puppetList.length; i++) {
				let nation = puppetList[i]
				if (abortController.signal.aborted || stopped) {
					break
				}
				try {
					progress += `<p>Processing ${nation} ${i + 1}/${puppetList.length}</p>`
					const deckInfo = await parseXML(`${domain}/cgi-bin/api.cgi?nationname=${nation}&q=cards+deck+info`, main)
					let nationalBank = deckInfo.CARDS.INFO.BANK

					if (nationalBank >= Number(amount)) {
						let cardsTransferable = Math.floor(nationalBank / Number(amount))
						progress += `<p class="text-green-400">${nation} can transfer ${cardsTransferable} cards!</p>`
						puppetTransfer.push({ name: nation, transfer: cardsTransferable })
						totalTransferrable += cardsTransferable
						count++
						bank += nationalBank
					} else {
						progress += `<p class="text-yellow-400">${nation} cannot afford any cards (Bank: ${nationalBank}).</p>`
					}
				} catch (err) {
					progress += `<p class="text-red-400">Error processing ${nation} with ${err}</p>`
				}
			}

			let askQuantity = 0
			let remainingTransferable = totalTransferrable

			interface TransferCount {
				count: number
				season: number
			}

			type TransferCounts = Record<string, TransferCount>
			const askTracker: TransferCounts = JSON.parse(JSON.stringify(transferCounts)) // Deep clone

			for (const [id, { count, season }] of Object.entries(askTracker)) {
				if (!season) {
					progress += `<p class="text-red-400">You did not provide the season.</p>`
					stoppable = false
					return
				}
				while (remainingTransferable > 0 && askTracker[id].count > 0) {
					progress += `<p>${askQuantity + 1} Generated ask link for card ID ${id}, season ${season}</p>`
					const singleLink = `${domain}/container=${auctionMain}/nation=${auctionMain}/page=deck/card=${id}/season=${season}?mode=ask&amount=${amount}/mode=separate?${urlParameters('Auction', main)}`
					askQuantity++
					content.push({
						url: singleLink,
						tableText: `Link to Ask`,
					})

					askTracker[id].count--
					remainingTransferable--
				}

				if (remainingTransferable <= 0) {
					break
				}
			}

			progress += `<p>Total ask links generated: ${askQuantity}</p>`

			let bidQuantity = 0

			for (const puppet of puppetTransfer) {
				let { name, transfer: cardsTransferable } = puppet
				// for (const [id, { count, season }] of Object.entries(transferCounts)) {
				// 	if (cardsTransferable > 0 && transferCounts[id].count > 0) {
				// 		progress += `<p class="text-gray-400">Generated initial transfer link for card ID ${id}, season ${season} to ${name}</p>`
				// 		const singleLink = `https://www.nationstates.net/nation=${name}/page=deck/card=${id}/season=${season}?mode=bid&amount=${transfer}`
				// 		openNewLinkArr = [...openNewLinkArr, singleLink]

				// 		content += `<tr><td><p>${
				// 			bidQuantity + 1
				// 		}</p></td><td><p><a target="_blank" href="${singleLink}">Link to Issue</a></p></td></tr>\n`

				// 		bidQuantity = bidQuantity + 1
				// 		transferCounts[id].count--
				// 		cardsTransferable--
				// 	}
				// 	if (cardsTransferable <= 0) break
				// }
				for (const [id, { count, season }] of Object.entries(transferCounts)) {
					if (!season) {
						progress += `<p class="text-red-400">You did not provide the season.</p>`
						stoppable = false
						return
					}
					while (cardsTransferable > 0 && transferCounts[id].count > 0) {
						progress += `<p>${bidQuantity + 1} Generated bid link for card ID ${id}, season ${season} to ${name}</p>`
						const singleLink = `${domain}/container=${name}/nation=${name}/page=deck/card=${id}/season=${season}?mode=bid&amount=${amount}/mode=separate?${urlParameters('Auction', main)}`
						bidQuantity++
						content.push({
							url: singleLink,
							tableText: `Link to Bid on ${name}`,
						})

						transferCounts[id].count--
						cardsTransferable--
					}

					if (cardsTransferable <= 0) {
						break
					}
				}
			}

			progress += `<p>Total bid links generated: ${bidQuantity}</p>`

			progress += `${askQuantity} main ask links generated, ${bidQuantity} puppet bid links generated`
		}

		downloadable = true
		stoppable = false
	}
</script>

<ToolContent
	toolTitle="Auction"
	caption="Temp name. A testing transfer tool."
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
	<a class="underline" href="https://hare.kractero.com/auction.user.js" target="_blank" rel="noreferrer noopener">
		hare auction userscript
	</a>
	to be useful.
</p>
<p class="mb-16">
	Requires id,season
	On mode bid/ask, accepts the amount
</p>`} />

<div class="flex flex-col gap-8 break-normal lg:w-[1024px] lg:max-w-5xl lg:flex-row">
	<form onsubmit={onSubmit} class="flex flex-col gap-8">
		<UserAgent bind:main bind:errors />
		{#if mode === 'Transfer'}
			<FormTextArea bind:bindValue={puppets} id="puppets" label="Puppets" required={false} />
		{/if}
		<FormTextArea bind:bindValue={transferCards} label={'Cards'} id="transferCards" />
		<FormSelect id="mode" label="Mode" bind:bindValue={mode} items={['Transfer', 'Bids', 'Asks']} />
		<FormInput label="Main Nation" bind:bindValue={auctionMain} id="auctionMain" required={true} />
		<FormInput label="Amount" bind:bindValue={amount} id="amount" required={true} />
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
	<Terminal bind:progress />
</div>
