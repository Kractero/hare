<script lang="ts">
	import { onDestroy, onMount } from 'svelte'
	import { page } from '$app/state'
	import Buttons from '$lib/components/Buttons.svelte'
	import FormSelect from '$lib/components/FormSelect.svelte'
	import InputCredentials from '$lib/components/InputCredentials.svelte'
	import Terminal from '$lib/components/Terminal.svelte'
	import ToolContent from '$lib/components/ToolContent.svelte'
	import { checkUserAgent, pushHistory, urlParameters } from '$lib/helpers/utils'

	const abortController = new AbortController()

	let domain = $state('')
	let progress = $state('')
	let content: Array<{ url: string; tableText: string; linkStyle?: string }> = $state([])
	let downloadable = $state(false)
	let stoppable = $state(false)
	let stopped = $state(false)
	let puppets = $state('')
	let main = $state('')
	let mode = $state('Banners')
	let counter = $state(0)
	let errors: Array<{ field: string | number; message: string }> = $state([])

	onMount(async () => {
		domain = `https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net`
		main = page.url.searchParams.get('main') || (localStorage.getItem('main') as string) || ''
		mode = page.url.searchParams.get('mode') || (localStorage.getItem('inscriptionMode') as string) || 'Banners'
	})

	onDestroy(() => abortController.abort())

	async function onSubmit(e: Event) {
		e.preventDefault()
		pushHistory(`?main=${main}&mode=${mode}`)
		errors = checkUserAgent(main)
		if (errors.length > 0) return
		downloadable = false
		stoppable = true
		stopped = false
		counter = 0
		content = []
		progress = ''
		const puppetList = puppets.split('\n').map(nation => nation.toLowerCase().replaceAll(' ', '_'))
		for (let i = 0; i < puppetList.length; i++) {
			content.push({
				url: `${domain}/page=deck/container=${puppetList[i]}/nation=${puppetList[i]}/page=${mode === 'Banners' ? 'banners' : 'upload_flag'}?${urlParameters(`Inscription_Assistant_${mode}`, main)}`,
				tableText: `Link to ${puppetList[i]}`,
			})
		}
		progress += '<p>Finished processing</p>'
		downloadable = true
		stoppable = false
	}
</script>

<ToolContent
	toolTitle="Decorator"
	caption="Upload the same flag or banner to puppets."
	additional={`<p class="text-xs mb-1">
	For mode banners, this script needs
	<a class="underline" href="https://hare.kractero.com/banner.user.js" target="_blank" rel="noreferrer noopener">
		the banner userscript
	</a>. Set the link to the image in line 13 of the userscript.</p>
	<p class="text-xs mb-16">
	 For mode flags, this script needs
	 <a class="underline" href="https://hare.kractero.com/flag.user.js" target="_blank" rel="noreferrer noopener">
		the flag userscript
	</a> and <a class="underline" href="https://hare.kractero.com/flagautocloser.user.js" target="_blank" rel="noreferrer noopener">an autocloser to close the settings page (if its referrer is upload_flag)</a>. For flags, set the link to the image in line 13 of the userscript.
	</p>`} />
<div class="flex flex-col gap-8 break-normal lg:w-[1024px] lg:max-w-5xl lg:flex-row">
	<form onsubmit={onSubmit} class="flex flex-col gap-8">
		<InputCredentials bind:errors bind:main bind:puppets authenticated={false} />
		<FormSelect id="mode" label="Mode" bind:bindValue={mode} items={['Flags', 'Banners']} />
		<Buttons
			downloadButton={true}
			bind:downloadable
			bind:content
			name="Inscription"
			stopButton={true}
			bind:stoppable
			bind:stopped>
		</Buttons>
	</form>
	<Terminal bind:progress />
</div>
