<script lang="ts">
	import { onMount } from 'svelte'
	import { page } from '$app/state'
	import Buttons from '$lib/components/Buttons.svelte'
	import FormInput from '$lib/components/FormInput.svelte'
	import Button from '$lib/components/ui/button/button.svelte'
	import InputCredentials from '$lib/components/InputCredentials.svelte'
	import Terminal from '$lib/components/Terminal.svelte'
	import ToolContent from '$lib/components/ToolContent.svelte'
	import { checkUserAgent, pushHistory, urlParameters } from '$lib/helpers/utils'

	let domain = $state('')
	let progress = $state<Array<{ text: string; color?: string }>>([])
	let content: Array<{ url: string; tableText: string; linkStyle?: string }> = $state([])
	let downloadable = $state(false)
	let puppets = $state('')
	let main = $state('')
	let errors: Array<{ field: string | number; message: string }> = $state([])
	let baseName = $state('')
	let start = $state(1)
	let count = $state(10)

	function generatePuppets() {
		const name = baseName.trim()
		const amount = Number(count)
		if (!name || amount < 1) return
		const generated = Array.from({ length: amount }, (_, i) => `${name}${Number(start) + i}`)
		const existing = puppets.trim()
		puppets = existing ? `${existing}\n${generated.join('\n')}` : generated.join('\n')
	}

	onMount(async () => {
		domain = `https://www.nationstates.net`
		main = page.url.searchParams.get('main') || (localStorage.getItem('main') as string) || ''
	})

	async function onSubmit(e: Event) {
		e.preventDefault()
		errors = checkUserAgent(main)
		if (errors.length > 0) return
		pushHistory(`?main=${main}`)
		downloadable = false
		const puppetList = puppets.split('\n')
		for (let i = 0; i < puppetList.length; i++) {
			const nation_formatted = puppetList[i].toLowerCase().replaceAll(' ', '_')
			content.push({
				url: `${domain}/container=${nation_formatted}/page=create_nation/nation=${puppetList[i]}?${urlParameters(`Creator`, main)}`,
				tableText: `Link to ${puppetList[i]}`,
			})
		}
		progress = [{ text: 'Finished processing', color: 'green' }]
		downloadable = true
	}
</script>

<ToolContent
	toolTitle="Creation Assistant"
	icon="🧫"
	author="Kractero"
	link="https://github.com/Kractero/cards-utilities/tree/main/creation_assistant"
	caption="Generate a sheet that has links for nation creation that works with the provided userscripts."
	additional={`<p class="text-xs mb-16">
	For optimal use, this script is intended to be used with
	<a class="underline" href="https://github.com/Kractero/userscripts/raw/main/nationCreator.user.js" target="_blank" rel="noreferrer noopener">
		creator
	</a> which does require configuration which you can read about in the repository.
	</p>`} />

<div class="flex flex-col gap-8 break-normal lg:w-5xl lg:max-w-5xl lg:flex-row">
	<form onsubmit={onSubmit} class="flex flex-col gap-8">
		<InputCredentials bind:errors bind:main bind:puppets authenticated={false} />
		<div class="flex max-w-lg flex-col gap-4 rounded-md border p-4">
			<p class="text-sm font-medium">Generate puppet names</p>
			<FormInput label="Base name" bind:bindValue={baseName} id="basename" />
			<FormInput label="Start" bind:bindValue={start} id="start" type="number" />
			<FormInput label="Count" bind:bindValue={count} id="count" type="number" />
			<Button type="button" variant="outline" onclick={generatePuppets}>Add to puppets</Button>
		</div>
		<Buttons {downloadable} downloadButton={true} {content} name="Creator" />
	</form>
	<Terminal bind:progress />
</div>
