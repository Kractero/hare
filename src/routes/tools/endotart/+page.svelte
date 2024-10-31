<script lang="ts">
	import { onDestroy, onMount } from 'svelte'
	import { page } from '$app/stores'
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
	let progress = $state('')
	let stopped = $state(false)
	let stoppable = $state(false)
	let source: string = $state('')
	let main: string = $state('')
	let endotarter: string = $state('')
	let immune: string = $state('')
	let limit: string = $state('')
	let errors: Array<{ field: string | number; message: string }> = $state([])
	let content: string = $state('')
	let downloadable = $state(false)
	let inclusion = $state('Unendorsed')

	onMount(() => {
		domain = `https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net`
		main = $page.url.searchParams.get('main') || (localStorage.getItem('main') as string) || ''
		endotarter = $page.url.searchParams.get('nation') || (localStorage.getItem('endotartEndotarter') as string) || ''
		immune = $page.url.searchParams.get('immune')
			? $page.url.searchParams.get('immune')!.replaceAll(',', '\n')
			: (localStorage.getItem('endotartImmune') as string) || ''
		limit = $page.url.searchParams.get('limit') || (localStorage.getItem('endotartLimit') as string) || ''
		source = $page.url.searchParams.get('source') || (localStorage.getItem('endotartSource') as string) || 'XML'
		inclusion =
			$page.url.searchParams.get('include') || (localStorage.getItem('endotartInclude') as string) || 'Unendorsed'
	})

	onDestroy(() => abortController.abort())

	async function onSubmit(e: Event) {
		e.preventDefault()
		pushHistory(
			`?main=${main}${limit ? `&limit=${limit}` : ''}&nation=${endotarter}&source=${source}${immune ? `&immune=${immune.replaceAll('\n', ',')}` : ''}&include=${inclusion}`
		)
		errors = checkUserAgent(main)
		if (errors.length > 0) return
		content = ''
		downloadable = false
		progress = '<p>Initiating Endotart...</p>'
		stoppable = true
		stopped = false
		const whiteList = immune ? immune.split('\n').map(nation => nation.toLowerCase().replace(' ', '_')) : []

		const regionalXML = await parseXML(`${domain}/cgi-bin/api.cgi?nation=${endotarter}&q=endorsements+region+wa`, main)
		if (!regionalXML.NATION) progress += `<p class="text-red-400">Error finding ${endotarter}!</p>`
		if ((regionalXML as Nation).NATION.UNSTATUS === 'Non-member') {
			progress += `<p class="text-red-400">${endotarter} is not in the WA.</p>`
			return
		}

		progress += `<p>Searching for the nations in ${regionalXML.NATION.REGION} not being endorsed by ${endotarter}, using the ${source}</p>`
		if (whiteList.length > 0) {
			progress += `<p>Nations immune to endocap: ${whiteList.map(region => region.trim()).join(', ')}</p>`
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
			progress += `<p>Requesting ${date} national dump.</p>`
			const nationRes = await fetch(`https://raw.githubusercontent.com/Kractero/himari/main/data/${date}-Nations.xml`, {
				method: 'GET',
			})
			if (nationRes.status === 404) {
				progress += `<p class="text-yellow-400">Could not find ${date} national dump, defaulting to the API.</p>`
				source = 'API'
			} else {
				progress += `<p class="text-green-400">Found ${date} national dump.</p>`
				progress += `<p>Parsing dump for endotarting...</p>`
				const regionText = await nationRes.text()
				xml = parser.parse(regionText)
			}
		}

		let sheetCounter = 0
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
					progress += `<p class="text-yellow-400">${i + 1}/${regionalWA.length} ${regionalWA[i]} not found, likely not in the dump yet`
				}
			}
			if (NAME) {
				if (!ENDORSEMENTS) ENDORSEMENTS = ['']
				if (endotarter.toLowerCase().replaceAll(' ', '_') === String(NAME).toLowerCase().replaceAll(' ', '_')) {
					progress += `<p class="text-yellow-400 font-extralight">${i + 1}/${regionalWA.length} <a target="_blank" rel="noreferrer noopener" class="underline" href="https://nationstates.net/nation=${regionalWA[i]}?${urlParameters('Endotart', main)}"}>${regionalWA[i]}</a> is the endotart nation.</p>`
				} else if (limit) {
					if (whiteList.includes(regionalWA[i])) {
						progress += `<p class="text-yellow-400 font-extralight">${i + 1}/${regionalWA.length} <a target="_blank" rel="noreferrer noopener" class="underline" href="https://nationstates.net/nation=${regionalWA[i]}?${urlParameters('Endotart', main)}"}>${regionalWA[i]}</a> is in your immune nations.</p>`
					} else if (
						ENDORSEMENTS.length < Number(limit) &&
						!ENDORSEMENTS.includes(endotarter.toLowerCase().replaceAll(' ', '_')) &&
						regionalWA[i] !== endotarter.toLowerCase().replaceAll(' ', '_')
					) {
						progress += `<p class="text-green-400">${i + 1}/${regionalWA.length} <a target="_blank" rel="noreferrer noopener" class="underline" href="https://nationstates.net/nation=${regionalWA[i]}?${urlParameters('Endotart', main)}"}>${regionalWA[i]}</a> is not being endorsed by ${endotarter}.</p>`
						content += `<tr><td><p>${sheetCounter + 1}</p></td><td><p><a target="_blank" href="${domain}/nation=${regionalWA[i]}#composebutton?${urlParameters('Endotart', main)}">Link to ${regionalWA[i]}</a></p></td></tr>\n`
						sheetCounter++
					} else if (ENDORSEMENTS.length > Number(limit)) {
						progress += `<p class="text-red-400 font-extralight">${i + 1}/${regionalWA.length} <a target="_blank" rel="noreferrer noopener" class="underline" href="https://nationstates.net/nation=${regionalWA[i]}?${urlParameters('Endotart', main)}"}>${regionalWA[i]}</a> has more than ${limit} endorsements.</p>`
					} else {
						progress += `<p class="text-red-400 font-extralight">${i + 1}/${regionalWA.length} <a target="_blank" rel="noreferrer noopener" class="underline" href="https://nationstates.net/nation=${regionalWA[i]}?${urlParameters('Endotart', main)}"}>${regionalWA[i]}</a> is already endorsed by ${endotarter}.</p>`
						if (inclusion === 'All') {
							content += `<tr><td><p>${sheetCounter + 1}</p></td><td><p><a target="_blank" style="color: red;" href="${domain}/nation=${regionalWA[i]}#composebutton?${urlParameters('Endotart', main)}">Link to ${regionalWA[i]}</a></p></td></tr>\n`
							sheetCounter++
						}
					}
				} else {
					if (
						!ENDORSEMENTS.includes(endotarter.toLowerCase().replaceAll(' ', '_')) &&
						regionalWA[i] !== endotarter.toLowerCase().replaceAll(' ', '_')
					) {
						progress += `<p class="text-green-400">${i + 1}/${regionalWA.length} <a target="_blank" rel="noreferrer noopener" class="underline" href="https://nationstates.net/nation=${regionalWA[i]}?${urlParameters('Endotart', main)}"}>${regionalWA[i]}</a> is not being endorsed by ${endotarter}.</p>`
						content += `<tr><td><p>${sheetCounter + 1}</p></td><td><p><a target="_blank" href="${domain}/nation=${regionalWA[i]}#composebutton?${urlParameters('Endotart', main)}">Link to ${regionalWA[i]}</a></p></td></tr>\n`
						sheetCounter++
					} else {
						progress += `<p class="text-red-400 font-extralight">${i + 1}/${regionalWA.length} <a target="_blank" rel="noreferrer noopener" class="underline" href="https://nationstates.net/nation=${regionalWA[i]}?${urlParameters('Endotart', main)}"}>${regionalWA[i]}</a> is already endorsed by ${endotarter}.</p>`
						if (inclusion === 'All') {
							content += `<tr><td><p>${sheetCounter + 1}</p></td><td><p><a target="_blank" style="color: red;" href="${domain}/nation=${regionalWA[i]}#composebutton?${urlParameters('Endotart', main)}">Link to ${regionalWA[i]}</a></p></td></tr>\n`
							sheetCounter++
						}
					}
				}
			}
		}
		progress += `<p>Finished searching ${regionalXML.NATION.REGION} for nations not being endorsed by ${endotarter}</p>`
		stoppable = false
		downloadable = true
	}
</script>

<ToolContent toolTitle="Endotart" caption="Specify a nation and get all the regionmates they are not endorsing." />

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
