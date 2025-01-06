<script lang="ts">
	import { onDestroy, onMount } from 'svelte'
	import { page } from '$app/state'
	import Buttons from '$lib/components/Buttons.svelte'
	import OpenButton from '$lib/components/buttons/OpenButton.svelte'
	import FormSelect from '$lib/components/FormSelect.svelte'
	import InputCredentials from '$lib/components/InputCredentials.svelte'
	import Terminal from '$lib/components/Terminal.svelte'
	import ToolContent from '$lib/components/ToolContent.svelte'
	import { nsIterator } from '$lib/helpers/builders'
	import { parseXML } from '$lib/helpers/parser'
	import { checkUserAgent, pushHistory } from '$lib/helpers/utils'

	const abortController = new AbortController()

	let domain = $state('')
	let progress = $state('')
	let content: string = $state('')
	let downloadable = $state(false)
	let stoppable = $state(false)
	let stopped = $state(false)
	let puppets = $state('')
	let main = $state('')
	let mode = $state('Banners')
	let openNewLinkArr: Array<string> = $state([])
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
		content = ''
		progress = ''
		openNewLinkArr = []
		let puppetCounter = 0
		if (mode == 'Banners') {
			content = (await nsIterator(puppets, 'Banners', main)) as string
		} else if (mode === 'Flags') {
			content = (await nsIterator(puppets, 'Flags', main)) as string
		} else {
			let puppetList = puppets.split('\n')
			for (let i = 0; i < puppetList.length; i++) {
				let nation = puppetList[i]
				if (abortController.signal.aborted || stopped) {
					break
				}
				try {
					progress += `<p>Processing ${nation} ${i + 1}/${puppetList.length}</p>`
					const dbid = await parseXML(`${domain}/cgi-bin/api.cgi?nation=${nation}&q=dbid`, main)
					puppetCounter++
					let addLink = `https://www.nationstates.net/container=${nation}/nation=${nation}/page=deck/card=${dbid.NATION.DBID}/season=4`
					if (mode === 'Inscribe') {
						addLink += '/?modify_my_card=1'
					}
					openNewLinkArr = [...openNewLinkArr, addLink]
					content += `<tr><td><p>${puppetCounter}</p></td><td><p><a target="_blank" href="https://www.nationstates.net/container=${nation}/nation=${nation}/page=deck/card=${dbid.NATION.DBID}/season=4/?modify_my_card=1">Link to ${nation}</a></p></td></tr>\n`
					progress += `<p class="text-green-400">Got ${dbid.NATION.DBID} for ${nation}!</p>`
				} catch (err) {
					progress += `<p class="text-red-400">Error processing ${nation} with ${err}</p>`
				}
			}
		}
		progress += '<p>Finished processing</p>'
		downloadable = true
		stoppable = false
	}
</script>

<ToolContent
	toolTitle="Inscription Assistant"
	caption="Upload flags, banners or inscribe/view cards."
	additional={`<p class="text-xs mb-1">
	For mode banners, this script needs
	<a class="underline" href="https://hare.kractero.com/banner.user.js" target="_blank" rel="noreferrer noopener">
		the banner userscript
	</a>. Set the link to the image in line 13 of the userscript.</p>
	<p class="text-xs mb-1">
	 For mode flags, this script needs
	 <a class="underline" href="https://hare.kractero.com/flag.user.js" target="_blank" rel="noreferrer noopener">
		the flag userscript
	</a> and <a class="underline" href="https://hare.kractero.com/flagautocloser.user.js" target="_blank" rel="noreferrer noopener">an autocloser to close the settings page (if its referrer is upload_flag)</a>. For flags, set the link to the image in line 13 of the userscript.
	</p>
	<p class="text-xs mb-16">
	 For inscribing, you will need
	 <a class="underline" href="https://hare.kractero.com/inscription.user.js" target="_blank" rel="noreferrer noopener">
		the inscription userscript
	</a>. Viewing needs nothing.
	</p>`} />

<div class="flex flex-col gap-8 break-normal lg:w-[1024px] lg:max-w-5xl lg:flex-row">
	<form onsubmit={onSubmit} class="flex flex-col gap-8">
		<InputCredentials bind:errors bind:main bind:puppets authenticated={false} />
		<FormSelect id="mode" label="Mode" bind:bindValue={mode} items={['Banners', 'Flags', 'Inscribe', 'View']} />
		<Buttons
			downloadButton={true}
			bind:downloadable
			bind:content
			name="Inscription"
			stopButton={true}
			bind:stoppable
			bind:stopped>
			{#if mode === 'Inscribe' || mode === 'View'}
				<OpenButton bind:counter bind:progress bind:openNewLinkArr />
			{/if}
		</Buttons>
	</form>
	<Terminal bind:progress />
</div>
