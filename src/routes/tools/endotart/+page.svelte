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
	import { parser, parseXML } from '$lib/helpers/parser'
	import { checkUserAgent, pushHistory, urlParameters } from '$lib/helpers/utils'
	import type { Nation, NSNation, NSRegion } from '$lib/types'

	const abortController = new AbortController()
	let domain = ''
	let progress = $state<Array<{ text: string; color?: string; link?: { href: string; label: string } }>>([])
	let stopped = $state(false)
	let stoppable = $state(false)
	let source: string = $state('')
	let main: string = $state('')
	let endotarter: string = $state('')
	let immune: string = $state('')
	let limit: string = $state('')
	let errors: Array<{ field: string | number; message: string }> = $state([])
	let content: Array<{ url: string; tableText: string; linkStyle?: string }> = $state([])
	let downloadable = $state(false)
	let inclusion = $state('Unendorsed')

	onMount(() => {
		domain = `https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net`
		main = page.url.searchParams.get('main') || (localStorage.getItem('main') as string) || ''
		endotarter = page.url.searchParams.get('nation') || (localStorage.getItem('endotartEndotarter') as string) || ''
		immune = page.url.searchParams.get('immune')
			? page.url.searchParams.get('immune')!.replaceAll(',', '\n')
			: (localStorage.getItem('endotartImmune') as string) || ''
		limit = page.url.searchParams.get('limit') || (localStorage.getItem('endotartLimit') as string) || ''
		source = page.url.searchParams.get('source') || (localStorage.getItem('endotartSource') as string) || 'XML'
		inclusion =
			page.url.searchParams.get('include') || (localStorage.getItem('endotartInclude') as string) || 'Unendorsed'
	})

	onDestroy(() => abortController.abort())

	async function onSubmit(e: Event) {
		e.preventDefault()
		pushHistory(
			`?main=${main}${limit ? `&limit=${limit}` : ''}&nation=${endotarter}&source=${source}${immune ? `&immune=${immune.replaceAll('\n', ',')}` : ''}&include=${inclusion}`
		)
		errors = checkUserAgent(main)
		if (errors.length > 0) return
		content = []
		downloadable = false
		stoppable = true
		stopped = false
		progress = [{ text: 'Initiating Endotart...' }]

		const whiteList = immune ? immune.split('\n').map(nation => nation.toLowerCase().replace(' ', '_')) : []

		const regionalXML = await parseXML(`${domain}/cgi-bin/api.cgi?nation=${endotarter}&q=endorsements+region+wa`, main)
		if (!regionalXML.NATION) progress = [...progress, { text: `Error finding ${endotarter}!`, color: 'red' }]
		if ((regionalXML as Nation).NATION.UNSTATUS === 'Non-member') {
			progress = [...progress, { text: `${endotarter} is not in the WA.`, color: 'red' }]
			return
		}

		progress = [
			...progress,
			{
				text: `Searching for the nations in ${regionalXML.NATION.REGION} not being endorsed by ${endotarter}, using the ${source}.`,
			},
		]
		if (whiteList.length > 0) {
			progress = [
				...progress,
				{ text: `Nations immune to endocap: ${whiteList.map(region => region.trim()).join(', ')}` },
			]
		}
		const wamems = await parseXML(`${domain}/cgi-bin/api.cgi?region=${regionalXML.NATION.REGION}&q=wanations`, main)
		const regionalWA = (wamems.REGION as NSRegion).UNNATIONS.split(',')
		let xml
		let NAME
		let ENDORSEMENTS

		if (source === 'XML') {
			const currentDate = new Date()
			const utcMinus7Date = new Date(currentDate.getTime() - 7 * 60 * 60 * 1000)
			utcMinus7Date.setDate(utcMinus7Date.getDate() - 1)
			const date = utcMinus7Date.toISOString().slice(0, 10)
			progress = [...progress, { text: `Requesting ${date} national dump.` }]
			const nationRes = await fetch(`https://raw.githubusercontent.com/Kractero/himari/main/data/${date}-Nations.xml`, {
				method: 'GET',
			})
			if (nationRes.status === 404) {
				progress = [
					...progress,
					{ text: `Could not find ${date} national dump, defaulting to the API.`, color: 'yellow' },
				]
				source = 'API'
			} else {
				progress = [...progress, { text: `Found ${date} national dump.`, color: 'green' }]
				progress = [...progress, { text: `Parsing dump for endotarting...`, color: 'green' }]
				const regionText = await nationRes.text()
				xml = parser.parse(regionText)
			}
		}

		for (let i = 0; i < regionalWA.length; i++) {
			if (abortController.signal.aborted || stopped) {
				break
			}

			if (source === 'API') {
				xml = (await parseXML(`${domain}/cgi-bin/api.cgi?nation=${regionalWA[i]}&q=endorsements+name`, main)) as Nation
				NAME = String(xml.NATION.NAME)
				ENDORSEMENTS = String(xml.NATION.ENDORSEMENTS).includes(',')
					? xml.NATION.ENDORSEMENTS.split(',')
					: [xml.NATION.ENDORSEMENTS]
			} else {
				const nations = (xml.NATIONS.NATION as Array<NSNation>).filter(
					nation => String(nation.NAME).toLowerCase().replaceAll(' ', '_') === regionalWA[i].toLowerCase()
				)
				if (nations.length > 0) {
					;({ NAME, ENDORSEMENTS } = nations[0])
				} else {
					progress = [
						...progress,
						{
							text: `${i + 1}/${regionalWA.length} ${regionalWA[i]} not found, likely not in the dump yet`,
							color: 'yellow',
						},
					]
				}
			}
			if (NAME) {
				if (!ENDORSEMENTS) ENDORSEMENTS = ['']
				if (endotarter.toLowerCase().replaceAll(' ', '_') === String(NAME).toLowerCase().replaceAll(' ', '_')) {
					progress = [
						...progress,
						{
							text: `${i + 1}/${regionalWA.length}`,
							color: 'yellow',
							link: {
								href: `https://nationstates.net/nation=${regionalWA[i]}?${urlParameters('Endotart', main)}"}`,
								label: `${regionalWA[i]} is the endotart nation`,
							},
						},
					]
				} else if (limit) {
					if (whiteList.includes(regionalWA[i])) {
						progress = [
							...progress,
							{
								text: `${i + 1}/${regionalWA.length}`,
								color: 'yellow',
								link: {
									href: `https://nationstates.net/nation=${regionalWA[i]}?${urlParameters('Endotart', main)}"}`,
									label: `${regionalWA[i]} is in your immune nations`,
								},
							},
						]
					} else if (
						ENDORSEMENTS.length < Number(limit) &&
						!ENDORSEMENTS.includes(endotarter.toLowerCase().replaceAll(' ', '_')) &&
						regionalWA[i] !== endotarter.toLowerCase().replaceAll(' ', '_')
					) {
						progress = [
							...progress,
							{
								text: `${i + 1}/${regionalWA.length}`,
								color: 'green',
								link: {
									href: `https://nationstates.net/nation=${regionalWA[i]}?${urlParameters('Endotart', main)}"}`,
									label: `${regionalWA[i]} is not being endorsed by ${endotarter}`,
								},
							},
						]
						content.push({
							url: `${domain}/nation=${regionalWA[i]}#composebutton?${urlParameters('Endotart', main)}`,
							tableText: `Link to ${regionalWA[i]}`,
						})
					} else if (ENDORSEMENTS.length > Number(limit)) {
						progress = [
							...progress,
							{
								text: `${i + 1}/${regionalWA.length}`,
								color: 'red',
								link: {
									href: `https://nationstates.net/nation=${regionalWA[i]}?${urlParameters('Endotart', main)}"}`,
									label: `${regionalWA[i]} has more than ${limit} endorsements.`,
								},
							},
						]
					} else {
						progress = [
							...progress,
							{
								text: `${i + 1}/${regionalWA.length}`,
								color: 'red',
								link: {
									href: `https://nationstates.net/nation=${regionalWA[i]}?${urlParameters('Endotart', main)}"}`,
									label: `${regionalWA[i]} is already endorsed by ${endotarter}.`,
								},
							},
						]
						if (inclusion === 'All') {
							content.push({
								url: `${domain}/nation=${regionalWA[i]}#composebutton?${urlParameters('Endotart', main)}`,
								tableText: `Link to ${regionalWA[i]}`,
								linkStyle: 'color: red;',
							})
						}
					}
				} else {
					if (
						!ENDORSEMENTS.includes(endotarter.toLowerCase().replaceAll(' ', '_')) &&
						regionalWA[i] !== endotarter.toLowerCase().replaceAll(' ', '_')
					) {
						progress = [
							...progress,
							{
								text: `${i + 1}/${regionalWA.length}`,
								color: 'green',
								link: {
									href: `https://nationstates.net/nation=${regionalWA[i]}?${urlParameters('Endotart', main)}"}`,
									label: `${regionalWA[i]} is not being endorsed by ${endotarter}.`,
								},
							},
						]
						content.push({
							url: `${domain}/nation=${regionalWA[i]}#composebutton?${urlParameters('Endotart', main)}`,
							tableText: `Link to ${regionalWA[i]}`,
						})
					} else {
						progress = [
							...progress,
							{
								text: `${i + 1}/${regionalWA.length}`,
								color: 'red',
								link: {
									href: `https://nationstates.net/nation=${regionalWA[i]}?${urlParameters('Endotart', main)}"}`,
									label: `${regionalWA[i]} is already endorsed by ${endotarter}.`,
								},
							},
						]
						if (inclusion === 'All') {
							content.push({
								url: `${domain}/nation=${regionalWA[i]}#composebutton?${urlParameters('Endotart', main)}`,
								tableText: `Link to ${regionalWA[i]}`,
								linkStyle: 'color: red;',
							})
						}
					}
				}
			}
		}
		progress = [
			...progress,
			{ text: `Finished searching ${regionalXML.NATION.REGION} for nations not being endorsed by ${endotarter}.` },
		]
		stoppable = false
		downloadable = true
	}
</script>

<ToolContent
	toolTitle="Endotart"
	icon="🤝"
	caption="Specify a nation and get all the regionmates they are not endorsing." />

<div class="flex flex-col gap-8 break-normal lg:w-[1024px] lg:max-w-5xl lg:flex-row">
	<form onsubmit={onSubmit} class="flex flex-col gap-8">
		<UserAgent bind:main bind:errors />
		<FormInput label={'Endotart Nation'} bind:bindValue={endotarter} id="endotarter" required={true} />
		<FormInput label={'Endorse Limit'} bind:bindValue={limit} id="limit" required={false} />
		<FormSelect id="source" label="Source" bind:bindValue={source} items={['XML', 'API']} />
		<FormSelect
			subTitle="(Whether to include already endorsed)"
			id="inclusion"
			label="Sheet Inclusion"
			bind:bindValue={inclusion}
			items={['Unendorsed', 'All']} />
		<FormTextArea bind:bindValue={immune} id="immune" label="Immune Nations" required={false} />
		<Buttons
			downloadButton={true}
			bind:downloadable
			bind:content
			name="Endotart"
			stopButton={true}
			bind:stopped
			bind:stoppable />
	</form>
	<Terminal bind:progress />
</div>
