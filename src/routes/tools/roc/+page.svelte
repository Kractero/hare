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
	import { checkUserAgent, pushHistory } from '$lib/helpers/utils'

	const abortController = new AbortController()

	let domain = ''
	let progress = $state('')
	let stoppable = $state(false)
	let stopped = $state(false)
	let main = $state('')
	let top = $state('100')
	let days = $state('30')
	let specific = $state('')
	let mode = $state('Top')
	let errors: Array<{ field: string | number; message: string }> = $state([])

	onMount(() => {
		domain = `https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net`
		main = page.url.searchParams.get('main') || (localStorage.getItem('main') as string) || ''
		top = page.url.searchParams.get('top') || (localStorage.getItem('rocTop') as string) || '100'
		days = page.url.searchParams.get('days') || (localStorage.getItem('rocDays') as string) || '30'
		mode = page.url.searchParams.get('mode') || (localStorage.getItem('rocMode') as string) || 'Top'
		specific = (localStorage.getItem('rocSpecific') as string) || ''
	})

	onDestroy(() => abortController.abort())

	async function onSubmit(e: Event) {
		e.preventDefault()
		pushHistory(`?main=${main}&top=${top}&days=${days}`)
		errors = checkUserAgent(main)
		if (errors.length > 0) return
		stopped = false
		stoppable = true
		let names: string[] = []
		type rocTuple = [string, number]
		let ratesOfChange: Array<rocTuple> = []
		progress = ''
		if (!specific) {
			for (let i = 0; i < Math.ceil(Number(top) / 20); i++) {
				let start = 1 + i * 20
				if (abortController.signal.aborted) {
					break
				}
				const xml = await parseXML(`${domain}/cgi-bin/api.cgi?q=censusranks&scale=86&start=${start}`, main)
				names = names.concat(xml.WORLD.CENSUSRANKS.NATIONS.NATION.map((nation: { NAME: string }) => nation.NAME))
			}
			names = names.slice(0, Number(top))
		} else {
			names = specific.split('\n')
		}
		const currentTimestamp = Math.floor(Date.now() / 1000)
		const fromTimestamp = currentTimestamp - Number(days) * 24 * 60 * 60
		for (let j = 0; j < names.length; j++) {
			const nation = names[j]
			if (abortController.signal.aborted || stopped) {
				break
			}
			progress += `<p>Evaluating ${nation}, ${j + 1}/${names.length}</p>`
			const xml = await parseXML(
				`${domain}/cgi-bin/api.cgi?nation=${nation};q=census;scale=86;mode=history;from=${fromTimestamp}`,
				main
			)
			const point = xml.NATION.CENSUS.SCALE.POINT
			if (Array.isArray(point)) {
				const timestamps = point.map(point => Number(point.TIMESTAMP))
				const scores = point.map(point => Number(point.SCORE))
				const [maxTimestamp, minTimestamp] = [Math.max(...timestamps), Math.min(...timestamps)]
				const [maxScore, minScore] = [
					scores[timestamps.indexOf(maxTimestamp)],
					scores[timestamps.indexOf(minTimestamp)],
				]
				const rateOfChange = ((maxScore - minScore) / Number(days)).toFixed(2)
				ratesOfChange.push([nation, Number(rateOfChange)])
			} else {
				ratesOfChange.push([nation, Number(point.SCORE)])
			}
		}
		const fallers = ratesOfChange.slice().sort((a, b) => a[1] - b[1])
		const risers = ratesOfChange.slice().sort((a, b) => b[1] - a[1])
		progress = ''
		progress += `<span class="font-bold">${specific ? 'Specific nations' : `TOP ${names.length}`} over ${days} days</span><br>`
		for (let i = 0; i < ratesOfChange.length; i++) {
			progress += `${i + 1}/${ratesOfChange.length} ${ratesOfChange[i][0]} | Rate of Change: ${ratesOfChange[i][1]}<br>`
		}
		if (names.length > 1) {
			progress += `<span class="font-bold">Fastest growing of the ${specific ? 'specified nations' : `top ${names.length}`}</span><br>`
			for (let i = 0; i < risers.length; i++) {
				progress += `${i + 1}/${risers.length} ${risers[i][0]} | Rate of Change: ${risers[i][1]}<br>`
			}
			progress += `<span class="font-bold">Slowest growing of the ${specific ? 'specified nations' : `top ${names.length}`}</span><br>`
			for (let i = 0; i < fallers.length; i++) {
				progress += `${i + 1}/${fallers.length} ${fallers[i][0]} | Rate of Change: ${fallers[i][1]}<br>`
			}
		}
		stoppable = false
	}
</script>

<ToolContent
	toolTitle="Rate of Change"
	icon="📈"
	caption="Get the rate of change in deck value for the top X NS players, over X Days."
	author="Thorn1000"
	originalBlurb="rewritten in JS for browser use by Kractero"
	link="https://github.com/Thorn1000/NS-RoC"
	additional={`<p class="text-xs mb-16">
	Behavior Specific indicates to search for specific nation's RoC, and is enabled only when top is empty.
</p>`} />

<div class="flex flex-col gap-8 break-normal lg:w-[1024px] lg:max-w-5xl lg:flex-row">
	<form onsubmit={onSubmit} class="flex flex-col gap-8">
		<UserAgent bind:errors bind:main />
		{#if mode === 'Top'}
			<FormInput label={`Top ${top}`} bind:bindValue={top} id="top" required={true} />
		{:else}
			<FormTextArea label="Specific Nations" bind:bindValue={specific} id="specific" required />
		{/if}
		<FormInput label={`Over ${days} days`} bind:bindValue={days} id="days" required={true} />
		<FormSelect id="mode" label="Behavior" bind:bindValue={mode} items={['Top', 'Specific']} />
		<Buttons stopButton={true} bind:stopped bind:stoppable />
	</form>
	<Terminal bind:progress />
</div>
