<script lang="ts">
	import { onDestroy, onMount } from 'svelte'
	import { page } from '$app/stores'
	import Buttons from '$lib/components/Buttons.svelte'
	import FormInput from '$lib/components/FormInput.svelte'
	import FormTextArea from '$lib/components/FormTextArea.svelte'
	import Terminal from '$lib/components/Terminal.svelte'
	import ToolContent from '$lib/components/ToolContent.svelte'
	import { pushHistory } from '$lib/helpers/navigation'
	import { parseXML } from '$lib/helpers/parser'
	import { checkUserAgent } from '$lib/helpers/validate'

	let progress = ''
	let regions = ''
	let main = ''
	let stoppable = false
	let stopped = false
	let errors: Array<{ field: string | number; message: string }> = []

	const abortController = new AbortController()
	onMount(() => {
		main = $page.url.searchParams.get('main') || (localStorage.getItem('main') as string) || ''
		regions = (localStorage.getItem('regions') as string) || ''
	})
	onDestroy(() => abortController.abort())
	async function trigonometry(main: string, regions: string) {
		pushHistory(`?main=${main}`)
		errors = checkUserAgent('main')
		if (errors.length > 0) return
		progress = ''
		stoppable = true
		stopped = false
		const regionsList = regions.split('\n')
		progress += `<p>Initiating Trigonometry on ${regionsList.map(region => region.trim()).join(', ')} with 700ms interval.</p>`
		const updates: Array<{ name: string; update: string }> = []
		const currentTime = Math.floor(Date.now() / 1000)
		for (let i = 0; i < regionsList.length; i++) {
			if (abortController.signal.aborted || stopped) {
				break
			}
			const xml = await parseXML(
				`https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net/cgi-bin/api.cgi?region=${regionsList[i]}&q=lastupdate`,
				main
			)
			if (xml.status)
				progress += `<p class="text-red-400">Request for ${regionsList[i]} ${xml.status}</p>`
			else {
				if (!xml.REGION['LASTUPDATE']) {
					progress += `<p class="text-blue-400">${regionsList[i]} is a new region.</p>`
				} else if (currentTime - Number(xml.REGION['LASTUPDATE']) < 7200) {
					progress += `<p class="text-blue-400">${regionsList[i]} has already updated.</p>`
				} else {
					updates.push({
						name: regionsList[i],
						update: xml.REGION['LASTUPDATE'],
					})
				}
			}
		}

		if (updates.length > 1) {
			updates.sort((a, b) => Number(a.update) - Number(b.update))
		}

		progress += `<p>Starting scanning...</p>`
		while (updates.length > 0) {
			if (abortController.signal.aborted || stopped) {
				break
			}
			const region = updates[0]
			progress += `<p>Waiting for ${region.name}</p>`
			const xml = await parseXML(
				`https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net/cgi-bin/api.cgi?region=${region.name}&q=lastupdate`,
				main
			)
			if (xml.status) {
				progress += `Request for ${xml} ${xml.status}`
				updates.shift()
				continue
			}
			if (region.update !== xml.REGION['LASTUPDATE']) {
				progress += `<p class="text-green-400">!!! - UPDATE DETECTED IN ${region.name} - !!!</p>`
				updates.shift()
			}
		}

		progress += `<p>Scan for ${regionsList.length} targets finished.</p>`
		stoppable = false
	}
</script>

<ToolContent toolTitle="Trigonometry" caption="A testing trigger tool." />

<div class="flex flex-col gap-8 break-normal lg:w-[1024px] lg:max-w-5xl lg:flex-row">
	<form on:submit|preventDefault={() => trigonometry(main, regions)} class="flex flex-col gap-8">
		<FormInput label="User Agent" bind:bindValue={main} id="main" required={true} />
		<FormTextArea label="Regions" bind:bindValue={regions} id="regions" required={true} />
		<Buttons stopButton={true} bind:stopped bind:stoppable />
	</form>
	<Terminal bind:progress />
</div>
