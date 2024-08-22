<script lang="ts">
	import { onDestroy, onMount } from 'svelte'
	import { page } from '$app/stores'
	import Buttons from '$lib/components/Buttons.svelte'
	import FormSelect from '$lib/components/FormSelect.svelte'
	import FormTextArea from '$lib/components/FormTextArea.svelte'
	import InputCredentials from '$lib/components/InputCredentials.svelte'
	import Terminal from '$lib/components/Terminal.svelte'
	import ToolContent from '$lib/components/ToolContent.svelte'
	import { pushHistory } from '$lib/helpers/navigation'
	import { parseXML } from '$lib/helpers/parser'
	import { checkUserAgent } from '$lib/helpers/validate'

	const abortController = new AbortController()
	let progress = ''
	let stoppable = false
	let stopped = false
	let puppets = ''
	let main = ''
	let flags = ''
	let downloadable = false
	let content = ''
	let count = 0
	let mode = 'Flags'
	let mottos = ''
	let errors: Array<{ field: string | number; message: string }> = []

	onMount(() => {
		main = $page.url.searchParams.get('main') || (localStorage.getItem('main') as string) || ''
		mode =
			$page.url.searchParams.get('mode') ||
			(localStorage.getItem('flagmanagerMode') as string) ||
			'Flags'
		puppets = (localStorage.getItem('puppets') as string) || ''
		flags = (localStorage.getItem('flagmanagerFlags') as string) || ''
		mottos = (localStorage.getItem('flagmanagerMottos') as string) || ''
	})
	onDestroy(() => abortController.abort())

	async function ping() {
		downloadable = false
		pushHistory(`?main=${main}&mode=${mode}`)
		errors = checkUserAgent(main)
		if (errors.length > 0) return
		stoppable = true
		stopped = false
		progress = '<p>Initiating Flag Manager...</p>'
		let flagsList = flags.split('\n')
		let mottosList = mottos.split('\n')
		let puppetsList = puppets.split('\n')
		for (let i = 0; i < puppetsList.length; i++) {
			let nation = puppetsList[i]
			try {
				if (abortController.signal.aborted || stopped) {
					break
				}
				progress += `<p>Computing ${nation}'s ${mode.toLowerCase() === 'flags' ? 'flags' : 'motto'}</p>`
				if (mode.toLowerCase() === 'flags') {
					const response = await parseXML(
						`https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net/cgi-bin/api.cgi?nation=${nation}&q=flag`,
						main
					)
					for (const flag of flagsList) {
						if (response.NATION.FLAG.includes(flag)) {
							progress += `<p class="text-green-400"><a target="_blank" rel="noreferrer noopener" href="https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net/nation=${nation}/User_agent=${main}/Script=Flag_Manager/Generated_by=Flag_Manager/Author_discord=scrambleds/Author_main_nation=Kractero/" class="underline">${nation}</a> has flag containing ${flag}!</p>`
							content += `<tr><td><p>${
								count + 1
							}</p></td><td><p><a target="_blank" href="https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net/nation=${nation}/User_agent=${main}/Script=Flag_Manager/Generated_by=Flag_Manager/Author_discord=scrambleds/Author_main_nation=Kractero/">Link to Nation</a></p></td></tr>`
							count++
						}
					}
				} else {
					const response = await parseXML(
						`https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net/cgi-bin/api.cgi?nation=${nation}&q=motto`,
						main
					)
					for (const motto of mottosList) {
						if (response.NATION.MOTTO.includes(motto)) {
							progress += `<p class="text-green-400"><a target="_blank" rel="noreferrer noopener" href="https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net/nation=${nation}/User_agent=${main}/Script=Flag_Manager/Generated_by=Flag_Manager/Author_discord=scrambleds/Author_main_nation=Kractero/" class="underline">${nation}</a> has motto that includes '${motto}'!</p>`
							content += `<tr><td><p>${
								count + 1
							}</p></td><td><p><a target="_blank" href="https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net/nation=${nation}/User_agent=${main}/Script=Flag_Manager/Generated_by=Flag_Manager/Author_discord=scrambleds/Author_main_nation=Kractero/">Link to Nation</a></p></td></tr>`
							count++
						}
					}
				}
			} catch (err) {
				progress += `<p class="text-red-400">Error occured on ${nation}: ${err}`
			}
		}
		progress += `Flag manager finished searching!`
		stoppable = false
		downloadable = true
	}
</script>

<ToolContent
	toolTitle="Flag Manager"
	caption="Find which puppets have a specific flag."
	author="Kractero"
	link="https://nationstates.net/Kractero"
/>

<div class="flex flex-col gap-8 break-normal lg:w-[1024px] lg:max-w-5xl lg:flex-row">
	<form on:submit|preventDefault={ping} class="flex flex-col gap-8">
		<InputCredentials bind:errors bind:main bind:puppets authenticated={false} />
		<FormSelect id="mode" label="Mode" items={['Flags', 'Mottos']} bind:bindValue={mode} />
		{#if mode === 'Flags'}
			<FormTextArea
				bind:bindValue={flags}
				id="flags"
				label="Search Flags"
				placeholder="svg"
				required
			/>
		{:else}
			<FormTextArea
				bind:bindValue={mottos}
				id="mottos"
				label="Search Mottos"
				placeholder="You Can't Stop Progress"
				required
			/>
		{/if}
		<Buttons
			downloadButton={true}
			bind:downloadable
			bind:content
			type="html"
			stopButton={true}
			bind:stopped
			bind:stoppable
			name="manager"
		/>
	</form>
	<Terminal bind:progress />
</div>
