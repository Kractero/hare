<script lang="ts">
	import { onDestroy, onMount } from 'svelte'
	import { page } from '$app/stores'
	import Buttons from '$lib/components/Buttons.svelte'
	import FormInput from '$lib/components/FormInput.svelte'
	import FormSelect from '$lib/components/FormSelect.svelte'
	import InputCredentials from '$lib/components/InputCredentials.svelte'
	import Terminal from '$lib/components/Terminal.svelte'
	import ToolContent from '$lib/components/ToolContent.svelte'
	import { parseXML } from '$lib/helpers/parser'
	import { checkUserAgent, pushHistory } from '$lib/helpers/utils'

	const abortController = new AbortController()

	let domain = ''
	let puppets = ''
	let main = ''
	let progress = ''
	let stoppable = false
	let stopped = true
	let mode = 'Puppets'
	let region = ''
	let errors: Array<{ field: string | number; message: string }> = []

	onMount(() => {
		domain = `https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net`
		main = $page.url.searchParams.get('main') || (localStorage.getItem('main') as string) || ''
		puppets = (localStorage.getItem('puppets') as string) || ''
		mode = $page.url.searchParams.get('mode') || (localStorage.getItem('mode') as string) || 'Puppets'
		region = $page.url.searchParams.get('region') || (localStorage.getItem('region') as string) || ''
	})
	onDestroy(() => abortController.abort())

	async function onSubmit() {
		pushHistory(`?main=${main}${mode ? `&mode=${mode}` : ''}${region ? `&region=${region}` : ''}`)
		errors = checkUserAgent(main)
		if (errors.length > 0) return
		progress = ''
		stoppable = true
		stopped = false
		if (mode.toLowerCase() === 'puppets') {
			let puppetsList = puppets.split('\n')
			for (let i = 0; i < puppetsList.length; i++) {
				if (abortController.signal.aborted || stopped) {
					break
				}
				let nation = puppetsList[i]
				try {
					const xml = await parseXML(`${domain}/cgi-bin/api.cgi?nation=${nation}&q=lastactivity`, main)
					const lastActive: string = xml.NATION.LASTACTIVITY
					progress += `<p>${nation} with last seen ${lastActive}.</p>`
				} catch (err) {
					progress += `<p class="text-red-400">Error processing ${nation} with ${err}</p>`
				}
			}
		} else {
			const xml = await parseXML(`${domain}/cgi-bin/api.cgi?region=${region}&q=nations`, main)
			const nations = xml.REGION.NATIONS ? xml.REGION.NATIONS.split(':') : []
			for (let i = 0; i < nations.length; i++) {
				if (abortController.signal.aborted || stopped) {
					break
				}
				let nation = nations[i]
				try {
					const xml = await parseXML(`${domain}/cgi-bin/api.cgi?nation=${nation}&q=lastactivity`, main)
					const lastActive: string = xml.NATION.LASTACTIVITY
					progress += `<p>${nation} with last seen ${lastActive}.</p>`
				} catch (err) {
					progress += `<p class="text-red-400">Error processing ${nation} with ${err}</p>`
				}
			}
		}
		progress += `<p>Wiz finished</p>`
		stoppable = false
	}
</script>

<ToolContent toolTitle="Wiz" caption="Query all your nations for their last logged in date." />

<div class="flex flex-col gap-8 break-normal lg:w-[1024px] lg:max-w-5xl lg:flex-row">
	<form on:submit|preventDefault={onSubmit} class="flex flex-col gap-8">
		<FormSelect id="mode" label="Mode" bind:bindValue={mode} items={['Puppets', 'Region']} />
		{#if mode.toLowerCase() === 'region'}
			<FormInput bind:errors label={`User Agent`} bind:bindValue={main} id="main" required={true} />
			<FormInput label={`Region`} bind:bindValue={region} id="region" required={true} />
		{:else}
			<InputCredentials bind:errors bind:main bind:puppets authenticated={false} />
		{/if}
		<Buttons stopButton={true} bind:stopped bind:stoppable />
	</form>
	<Terminal bind:progress />
</div>
