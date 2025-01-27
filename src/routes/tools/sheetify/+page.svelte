<script lang="ts">
	import { onMount } from 'svelte'
	import { page } from '$app/state'
	import Buttons from '$lib/components/Buttons.svelte'
	import UserAgent from '$lib/components/formFields/UserAgent.svelte'
	import FormTextArea from '$lib/components/FormTextArea.svelte'
	import Terminal from '$lib/components/Terminal.svelte'
	import ToolContent from '$lib/components/ToolContent.svelte'
	import { checkUserAgent, pushHistory, urlParameters } from '$lib/helpers/utils'

	let domain = $state('')
	let progress = $state('')
	let content: Array<{ url: string; tableText: string; linkStyle?: string }> = $state([])
	let downloadable = $state(false)
	let links = $state('')
	let main = $state('')
	let errors: Array<{ field: string | number; message: string }> = $state([])

	onMount(async () => {
		domain = `https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net`
		main = page.url.searchParams.get('main') || (localStorage.getItem('main') as string) || ''
	})

	async function onSubmit(e: Event) {
		e.preventDefault()
		errors = checkUserAgent(main)
		if (errors.length > 0) return
		pushHistory(`?main=${main}`)
		downloadable = false
		const linkList = links.split('\n')
		for (let i = 0; i < linkList.length; i++) {
			content.push({
				url: `${linkList[i]}?${urlParameters(`Sheetify`, main)}`,
				tableText: `Link ${i}`,
			})
		}
		progress = '<p>Finished processing</p>'
		downloadable = true
	}
</script>

<ToolContent toolTitle="Sheetify" author="Kractero" caption="Make a click sheet out of a bunch of links." />

<div class="flex flex-col gap-8 break-normal lg:w-[1024px] lg:max-w-5xl lg:flex-row">
	<form onsubmit={onSubmit} class="flex flex-col gap-8">
		<UserAgent bind:main bind:errors />
		<FormTextArea bind:bindValue={links} label={'Links'} id="links" />
		<Buttons {downloadable} downloadButton={true} {content} name="Sheetify" />
	</form>
	<Terminal bind:progress />
</div>
