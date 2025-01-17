<script lang="ts">
	import { onDestroy, onMount } from 'svelte'
	import { page } from '$app/state'
	import Buttons from '$lib/components/Buttons.svelte'
	import FormSelect from '$lib/components/FormSelect.svelte'
	import FormTextArea from '$lib/components/FormTextArea.svelte'
	import InputCredentials from '$lib/components/InputCredentials.svelte'
	import Terminal from '$lib/components/Terminal.svelte'
	import ToolContent from '$lib/components/ToolContent.svelte'
	import { parseXML } from '$lib/helpers/parser'
	import { checkUserAgent, pushHistory, urlParameters } from '$lib/helpers/utils'

	const abortController = new AbortController()
	let domain = ''
	let progress = $state('')
	let stoppable = $state(false)
	let stopped = $state(false)
	let puppets = $state('')
	let main = $state('')
	let flags = $state('')
	let downloadable = $state(false)
	let content: Array<{ url: string; tableText: string; linkStyle?: string }> = $state([])
	let mode = $state('Flags')
	let mottos = $state('')
	let errors: Array<{ field: string | number; message: string }> = $state([])

	onMount(() => {
		domain = `https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net`
		main = page.url.searchParams.get('main') || (localStorage.getItem('main') as string) || ''
		mode = page.url.searchParams.get('mode') || (localStorage.getItem('flagmanagerMode') as string) || 'Flags'
		puppets = (localStorage.getItem('puppets') as string) || ''
		flags = (localStorage.getItem('flagmanagerFlags') as string) || ''
		mottos = (localStorage.getItem('flagmanagerMottos') as string) || ''
	})

	onDestroy(() => abortController.abort())

	async function onSubmit(e: Event) {
		e.preventDefault()
		downloadable = false
		pushHistory(`?main=${main}&mode=${mode}`)
		errors = checkUserAgent(main)
		if (errors.length > 0) return
		stoppable = true
		stopped = false
		content = []
		progress = '<p>Initiating Flag Finder...</p>'
		let flagsList = flags.split('\n')
		let mottosList = mottos.split('\n')
		let puppetsList = puppets.split('\n')
		for (let i = 0; i < puppetsList.length; i++) {
			let nation = puppetsList[i]
			nation = nation.toLowerCase().replaceAll(' ', '_')
			try {
				if (abortController.signal.aborted || stopped) {
					break
				}
				progress += `<p>Computing ${nation}'s ${mode.toLowerCase() === 'flags' ? 'flags' : 'motto'}</p>`
				if (mode.toLowerCase() === 'flags') {
					const response = await parseXML(`${domain}/cgi-bin/api.cgi?nation=${nation}&q=flag`, main)
					for (const flag of flagsList) {
						if (response.NATION.FLAG.includes(flag)) {
							progress += `<p class="text-green-400"><a target="_blank" rel="noreferrer noopener" href="${domain}/nation=${nation}?${urlParameters('Flag_Manager', main)}" class="underline">${nation}</a> has flag containing ${flag}!</p>`
							content.push({
								url: `${domain}/nation=${nation}?${urlParameters('Flag_Finder', main)}`,
								tableText: `Link to ${nation}`,
							})
						}
					}
				} else {
					const response = await parseXML(`${domain}/cgi-bin/api.cgi?nation=${nation}&q=motto`, main)
					for (const motto of mottosList) {
						if (response.NATION.MOTTO.includes(motto)) {
							progress += `<p class="text-green-400"><a target="_blank" rel="noreferrer noopener" href="${domain}/nation=${nation}?${urlParameters('Flag_Manager', main)}" class="underline">${nation}</a> has motto that includes '${motto}'!</p>`
							content.push({
								url: `${domain}/nation=${nation}?${urlParameters('Flag_Finder', main)}`,
								tableText: `Link to ${nation}`,
							})
						}
					}
				}
			} catch (err) {
				progress += `<p class="text-red-400">Error occured on ${nation}: ${err}`
			}
		}
		progress += `Flag finder finished searching!`
		stoppable = false
		downloadable = true
	}
</script>

<ToolContent
	toolTitle="Flag Finder"
	caption="Find which puppets have a specific flag."
	author="Kractero"
	link="https://nationstates.net/Kractero" />

<div class="flex flex-col gap-8 break-normal lg:w-[1024px] lg:max-w-5xl lg:flex-row">
	<form onsubmit={onSubmit} class="flex flex-col gap-8">
		<InputCredentials bind:errors bind:main bind:puppets authenticated={false} />
		<FormSelect id="mode" label="Mode" items={['Flags', 'Mottos']} bind:bindValue={mode} />
		{#if mode === 'Flags'}
			<FormTextArea bind:bindValue={flags} id="flags" label="Search Flags" required />
		{:else}
			<FormTextArea bind:bindValue={mottos} id="mottos" label="Search Mottos" required />
		{/if}
		<Buttons
			downloadButton={true}
			bind:downloadable
			bind:content
			type="html"
			stopButton={true}
			bind:stopped
			bind:stoppable
			name="manager" />
	</form>
	<Terminal bind:progress />
</div>
