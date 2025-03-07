<script lang="ts">
	import { onMount } from 'svelte'
	import ToolContent from '$lib/components/ToolContent.svelte'
	import Button from '$lib/components/ui/button/button.svelte'

	const validHeaders = ['Nation', 'Deck Value', 'Junk Value', 'Bank', 'Card Count', 'Deck Capacity']
	const hideableHeaders = [
		'Common',
		'Uncommon',
		'Rare',
		'Ultra-Rare',
		'Epic',
		'Legendary',
		'S1',
		'S2',
		'S3',
		'S1 Common',
		'S1 Uncommon',
		'S1 Rare',
		'S1 Ultra-Rare',
		'S1 Epic',
		'S1 Legendary',
		'S2 Common',
		'S2 Uncommon',
		'S2 Rare',
		'S2 Ultra-Rare',
		'S2 Epic',
		'S2 Legendary',
		'S3 Common',
		'S3 Uncommon',
		'S3 Rare',
		'S3 Ultra-Rare',
		'S3 Epic',
		'S3 Legendary',
	]
	let ledgerTable: HTMLTableElement | undefined = $state()
	let ledger: [{ [key: string]: number | string }] = $state([{}])
	let body = $state()
	let displayDate: string
	let error: string = $state('')

	const utcTime = new Date().getTime() + new Date().getTimezoneOffset() * 6000
	const maxDate = new Date(utcTime + -7 * 60 * 60000).toISOString().slice(0, 10)

	async function fillTable(date: string | undefined = '') {
		const filePath = `https://raw.githubusercontent.com/Kractero/himari/main/data/${date}.json`
		const data = await fetch(filePath)
		if (data.status === 404) {
			let previousDate = new Date()
			if (date) {
				previousDate.setDate(new Date(date).getDate() - 1)
			} else {
				previousDate.setDate(previousDate.getDate() - 1)
			}
			await fillTable(previousDate.toISOString().slice(0, 10))
			error = `Date not found for ${date}, using ${previousDate.toISOString().slice(0, 10)}`
			return
		}
		ledger = await data.json()
	}
	onMount(() => {
		fillTable()
		const sortableColumns = ledgerTable!.querySelectorAll('.sort')
		sortableColumns.forEach(col => {
			col.addEventListener('click', () => {
				const columnIndex = Array.from((col.parentNode! as HTMLTableRowElement).cells).indexOf(
					col as HTMLTableCellElement
				)
				const rows = Array.from(ledgerTable!.rows).slice(1)
				const currentOrder = col.getAttribute('data-order')
				const newOrder = currentOrder === 'asc' ? 'desc' : 'asc'
				rows.sort((a, b) => {
					const aValue = parseFloat(a.cells[columnIndex].innerText)
					const bValue = parseFloat(b.cells[columnIndex].innerText)
					if (currentOrder === 'asc') {
						return aValue > bValue ? 1 : aValue === bValue ? 0 : -1
					} else {
						return aValue > bValue ? -1 : aValue === bValue ? 0 : 1
					}
				})
				ledgerTable!.append(...rows)
				col.setAttribute('data-order', newOrder)
			})
		})
	})
</script>

<ToolContent
	toolTitle="Ledger"
	icon="📒"
	caption="Track the trades and movement of the top 100."
	originalBlurb="rewritten in Svelte for Hare use by Kractero"
	author="Kractero"
	link="https://ledger.kractero.com"
	additional={`<p class="mb-16">As of ${displayDate || maxDate}</p>`} />

<div class="flex flex-col gap-2">
	<input
		class="text-primary mx-auto border-none bg-transparent p-2 text-center text-xl"
		type="date"
		id="dateInput"
		min="2023-10-05"
		value={displayDate || maxDate}
		onchange={async e => {
			const selectedDate = e.currentTarget.value
			if (selectedDate && selectedDate >= '2023-10-05' && selectedDate <= maxDate) {
				await fillTable(selectedDate)
			}
		}} />
	{#if error}
		<p class="mb-2 text-center">{error}</p>
	{/if}
	<Button
		class="mx-auto"
		onclick={() => {
			ledgerTable!.querySelectorAll('.hideable').forEach(el => el.classList.toggle('hidden'))
		}}>
		Toggle Additional Headers
	</Button>
</div>

<div class="mt-2 flex w-full flex-col justify-center">
	<div class="rotate-180 overflow-x-scroll" dir="rtl">
		<table bind:this={ledgerTable} class="min-w-full border-collapse -rotate-180 text-right text-sm" dir="ltr">
			<thead>
				<tr class="border-border text-muted-foreground border-b">
					<th>#</th>
					{#each validHeaders as header}
						<th class="sort h-12 p-4 font-medium" data-order="none">{header}</th>
					{/each}
					{#each hideableHeaders as header}
						<th class="sort hideable hidden h-12 p-4 font-medium" data-order="none">{header}</th>
					{/each}
				</tr>
			</thead>
			{#if ledger}
				<tbody bind:this={body}>
					{#each ledger as deck}
						<tr class="border-border border-b">
							<td></td>
							{#each validHeaders as header}
								<td class="p-4">{deck[header]}</td>
							{/each}
							{#each hideableHeaders as header}
								<td class="hideable hidden">
									{#if deck[header]}<a
											target="_blank"
											href={`https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net/nation=${deck.Nation}/page=deck/?filter=${header.toLowerCase()}`}>
											{deck[header]}
										</a>
									{/if}
								</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			{/if}
		</table>
	</div>
</div>

<p class="my-8 text-center">The oldest tracked date is 2023-10-05.</p>

<style>
	table {
		counter-reset: serial-number;
	}

	table td:first-child:before {
		counter-increment: serial-number;
		content: counter(serial-number);
	}
</style>
