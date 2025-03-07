<script lang="ts">
	import { onMount } from 'svelte'
	import { page } from '$app/state'
	import Buttons from '$lib/components/Buttons.svelte'
	import FormInput from '$lib/components/FormInput.svelte'
	import InputCredentials from '$lib/components/InputCredentials.svelte'
	import Terminal from '$lib/components/Terminal.svelte'
	import ToolContent from '$lib/components/ToolContent.svelte'
	import { checkUserAgent, pushHistory, urlParameters } from '$lib/helpers/utils'

	let domain = $state('')
	let puppets = $state('')
	let progress = $state('')
	let content: Array<{ url: string; tableText: string; linkStyle?: string }> = $state([])
	let downloadable = $state(false)
	let link = $state('')
	let main = $state('')
	let errors: Array<{ field: string | number; message: string }> = $state([])

	onMount(async () => {
		domain = `https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net`
		main = page.url.searchParams.get('main') || (localStorage.getItem('main') as string) || ''
		puppets = (localStorage.getItem('puppets') as string) || ''
	})

	async function onSubmit(e: Event) {
		e.preventDefault()
		errors = checkUserAgent(main)
		if (errors.length > 0) return
		pushHistory(`?main=${main}`)
		downloadable = false
		const regexContainer = /container=[^/&]+/
		const regexNation = /nation=[^/&]+/

		const puppetsList = puppets.split('\n')

		for (let i = 0; i < puppetsList.length; i++) {
			const nation_formatted = puppetsList[i].toLowerCase().replaceAll(' ', '_')
			let modifiedLink = link

			if (regexContainer.test(link)) {
				modifiedLink = modifiedLink.replace(regexContainer, `container=${nation_formatted}`)
			} else if (regexNation.test(link)) {
				modifiedLink = modifiedLink.replace(regexNation, `nation=${nation_formatted}`)
			}

			content.push({
				url: `${modifiedLink}?${urlParameters(`Sheetify`, main)}`,
				tableText: `Link ${i}`,
			})
		}
		progress = '<p>Finished processing</p>'
		downloadable = true
	}
</script>

<ToolContent toolTitle="Sheetify" icon="📜" author="Kractero" caption="Make a click sheet out of a bunch of links." />

<div class="flex flex-col gap-8 break-normal lg:w-[1024px] lg:max-w-5xl lg:flex-row">
	<form onsubmit={onSubmit} class="flex flex-col gap-8">
		<InputCredentials bind:main bind:puppets authenticated={false} {errors} />
		<FormInput label={'NS Link'} bind:bindValue={link} id="link" />
		<Buttons {downloadable} downloadButton={true} {content} name="Sheetify" />
	</form>
	<Terminal bind:progress />
</div>
