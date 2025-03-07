<script lang="ts">
	import { onDestroy, onMount } from 'svelte'
	import { page } from '$app/state'
	import Buttons from '$lib/components/Buttons.svelte'
	import InputCredentials from '$lib/components/InputCredentials.svelte'
	import Terminal from '$lib/components/Terminal.svelte'
	import ToolContent from '$lib/components/ToolContent.svelte'
	import { checkUserAgent, pushHistory, urlParameters } from '$lib/helpers/utils'

	const abortController = new AbortController()
	let domain = ''
	let main = $state('')
	let progress = $state('')
	let puppets = $state('')
	let content = $state('')
	let errors: Array<{ field: string | number; message: string }> = $state([])
	let downloadable = $state(false)

	onMount(() => {
		domain = `https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net`
		main = page.url.searchParams.get('main') || (localStorage.getItem('main') as string) || ''
		puppets = (localStorage.getItem('puppets') as string) || ''
	})
	onDestroy(() => abortController.abort())

	async function onSubmit(e: Event) {
		e.preventDefault()
		pushHistory(`?main=${main}`)
		errors = checkUserAgent(main)
		if (errors.length > 0) return
		downloadable = false
		let puppetList = puppets.split('\n')
		for (let i = 0; i < puppetList.length; i++) {
			let nation = puppetList[i].replaceAll(' ', '_').toLowerCase()
			content += `<tr>\n`
			content += `<td><p>${i}</p></td>`
			content += `<td><p><a target="_blank" href="${domain}/container=${nation}/nation=${nation}?${urlParameters('RCES', main)}">${nation}</a></p></td>\n`
			content += `<td><p><a target="_blank" href="${domain}/container=${nation}/nation=${nation}/page=dilemmas/template-overall=none?${urlParameters('RCES', main)}">issues</a></p></td>\n`
			content += `<td><p><a target="_blank" href="${domain}/container=${nation}/nation=${nation}/page=deck?${urlParameters('RCES', main)}">deck</a></p></td>\n`
			content += `<td><p><a target="_blank" href="${domain}/container=${nation}/nation=${nation}/page=deck/value_deck=1?${urlParameters('RCES', main)}">value deck</a></p></td>\n`
			content += `<td><p><a target="_blank" href="${domain}/container=${nation}/nation=${nation}/page=telegrams?${urlParameters('RCES', main)}">telegrams</a></p></td>\n`
			content += `<td><p><a target="_blank" href="${domain}/container=${nation}/nation=${nation}/page=settings?${urlParameters('RCES', main)}">settings</a></p></td>\n`
			content += `<td><p><a target="_blank" href="${domain}/container=${nation}/nation=${nation}/page=tgsettings?${urlParameters('RCES', main)}">tg settings</a></p></td>\n`
			content += `<td><p><a target="_blank" href="${domain}/container=${nation}/nation=${nation}/page=create_nation/name=${nation}?${urlParameters('RCES', main)}">create (use /w hare's creator userscripts)</a></p></td>\n`
			content += `</tr>\n`
		}
		downloadable = true
	}
</script>

<ToolContent
	toolTitle="RCES"
	icon="📝"
	originalBlurb="Sheet maker rewritten in JS for browser use by Kractero"
	author="Racoda"
	link="https://github.com/dithpri/RCES#puppet-links-sheet"
	caption="Generates a sheet of clickable links pointing to various puppets."
	additional={`<p class="text-xs mb-16">
	Is not as configurable as the original, but I think default config had sane defaults.
</p>`} />

<div class="flex flex-col gap-8 break-normal lg:w-[1024px] lg:max-w-5xl lg:flex-row">
	<form onsubmit={onSubmit} class="flex flex-col gap-8">
		<InputCredentials bind:main bind:puppets authenticated={false} {errors} />
		<Buttons downloadButton={true} bind:downloadable bind:content type="html" name="RCES" />
	</form>
	<Terminal bind:progress />
</div>
