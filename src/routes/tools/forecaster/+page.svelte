<script lang="ts">
	import { onDestroy, onMount } from 'svelte'
	import { page } from '$app/state'
	import Buttons from '$lib/components/Buttons.svelte'
	import UserAgent from '$lib/components/formFields/UserAgent.svelte'
	import FormInput from '$lib/components/FormInput.svelte'
	import Terminal from '$lib/components/Terminal.svelte'
	import ToolContent from '$lib/components/ToolContent.svelte'
	import { parseXML } from '$lib/helpers/parser'
	import { checkUserAgent, pushHistory } from '$lib/helpers/utils'

	const abortController = new AbortController()
	let domain = ''
	let progress = $state<Array<{ text: string; color?: string; link?: { href: string; label: string } }>>([])
	let main = $state('')
	let nation = $state('')
	let stat = $state('')
	let errors: Array<{ field: string | number; message: string }> = $state([])
	let stoppable = $state(false)
	let stopped = $state(false)

	onMount(() => {
		domain = `https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net`
		main = page.url.searchParams.get('main') || (localStorage.getItem('main') as string) || ''
		nation = page.url.searchParams.get('nation') || ''
		stat = page.url.searchParams.get('stat') || ''
	})

	onDestroy(() => abortController.abort())

	async function onSubmit(e: Event) {
		e.preventDefault()
		pushHistory(`?main=${main}&nation=${nation}&stat=${stat}`)
		errors = checkUserAgent(main)
		if (errors.length > 0) return

		progress = []

		stoppable = true
		stopped = false
		const currentTime = new Date()
		const ninetyDaysAgo = new Date(currentTime)
		ninetyDaysAgo.setDate(currentTime.getDate() - 90)
		const epochTime = Math.floor(ninetyDaysAgo.getTime() / 1000)

		const daysList = [7, 30, 60, 90, 120, 180, 270, 365, 730, 1825, 3650]
		const boundaryNations: string[] = []
		const results: ([number, number] | [null, null])[] = []

		const censusNameXml = await parseXML(`${domain}/cgi-bin/api.cgi?q=censusname;scale=${stat}`, main)
		const statName = censusNameXml?.WORLD?.CENSUS?.['#text'] ?? censusNameXml?.WORLD?.CENSUS ?? `Stat ${stat}`
		progress = [...progress, { text: `Stat: ${statName}` }]

		const statsXml = await parseXML(
			`${domain}/cgi-bin/api.cgi?nation=${nation};q=census;scale=${stat};mode=history;from=${epochTime}`,
			main
		)
		progress = [...progress, { text: `Getting national history for ${statName}` }]
		const scale = statsXml?.NATION?.CENSUS?.SCALE
		const points = scale?.POINT ?? []
		const pointArr = Array.isArray(points) ? points : [points]
		let nationValues: [number, number] | null = null
		if (pointArr.length > 0 && pointArr[0]?.SCORE != null) {
			nationValues = [parseFloat(pointArr[0].SCORE), parseFloat(pointArr.at(-1).SCORE)]
		}

		if (!nationValues) {
			progress = [...progress, { text: `No census data found for ${nation} on stat ${stat}.`, color: 'red' }]
			return
		}

		const numNatXml = await parseXML(`${domain}/cgi-bin/api.cgi?q=numnations`, main)
		const numNat = Math.floor(parseInt(numNatXml?.WORLD?.NUMNATIONS) * 0.01)

		for (const start of [numNat - 19, numNat + 20]) {
			const neighborsXml = await parseXML(`${domain}/cgi-bin/api.cgi?q=censusranks&scale=${stat}&start=${start}`, main)
			const nations = neighborsXml?.WORLD?.CENSUSRANKS?.NATIONS?.NATION ?? []
			const nationArr = Array.isArray(nations) ? nations : [nations]
			for (const nation of nationArr) {
				boundaryNations.push(nation.NAME)
			}
		}

		for (let i = 0; i < boundaryNations.length; i++) {
			if (abortController.signal.aborted || stopped) break
			progress = [...progress, { text: `Fetching ${i + 1}/${boundaryNations.length}: ${boundaryNations[i]}` }]
			const xml = await parseXML(
				`${domain}/cgi-bin/api.cgi?nation=${boundaryNations[i]};q=census;scale=${stat};mode=history;from=${epochTime}`,
				main
			)
			const statPoints = xml?.NATION?.CENSUS?.SCALE?.POINT ?? []
			const pArr = Array.isArray(statPoints) ? statPoints : [statPoints]
			if (pArr.length > 0 && pArr[0]?.SCORE != null) {
				results.push([parseFloat(pArr[0].SCORE), parseFloat(pArr.at(-1).SCORE)])
			} else {
				results.push([null, null])
			}
		}

		progress = [...progress, { text: `Projections for ${nation} (${statName}):`, color: 'green' }]
		const nationSlope = (nationValues[1] - nationValues[0]) / 90
		for (const days of daysList) {
			const nationValue = nationValues[1] + nationSlope * days
			const count = results.filter(
				result => result[0] !== null && nationValue > result[1]! + ((result[1]! - result[0]) / 90) * days
			).length
			progress = [
				...progress,
				{ text: `Percent beat after ${days} days: ${((count / results.length) * 100).toFixed(2)}%` },
			]
		}
		stoppable = false
	}
</script>

<ToolContent
	toolTitle="Forecaster"
	icon="🌡️"
	caption={'A script that estimates you likelihood of obtaining a gold badge in NS'}
	author="Thorn1000"
	originalBlurb="rewritten for browser use by Kractero"
	link="https://github.com/Thorn1000/Forecaster/blob/main/main.py" />

<div class="flex flex-col gap-8 break-normal lg:w-5xl lg:max-w-5xl lg:flex-row">
	<form onsubmit={onSubmit} class="flex flex-col gap-8">
		<UserAgent bind:errors bind:main />
		<FormInput label={`Nation`} bind:bindValue={nation} id="nation" required={true} />
		<FormInput label={`Stat ID`} bind:bindValue={stat} id="stat" required={true} />
		<Buttons stopButton={true} bind:stopped bind:stoppable />
	</form>
	<Terminal bind:progress />
</div>
