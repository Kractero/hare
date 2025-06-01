<script lang="ts">
	import { onMount } from 'svelte'
	import { page } from '$app/state'
	import Buttons from '$lib/components/Buttons.svelte'
	import InputCredentials from '$lib/components/InputCredentials.svelte'
	import Terminal from '$lib/components/Terminal.svelte'
	import ToolContent from '$lib/components/ToolContent.svelte'
	import { parseXML } from '$lib/helpers/parser'
	import { checkUserAgent, pushHistory, urlParameters } from '$lib/helpers/utils'

	let domain = ''
	let progress = $state<Array<{ text: string; color?: string; link?: { href: string; label: string } }>>([])
	let puppets = $state('')
	let main = $state('')
	let stoppable = $state(false)
	let errors: Array<{ field: string | number; message: string }> = $state([])

	onMount(() => {
		domain = `https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net`
		main = page.url.searchParams.get('main') || (localStorage.getItem('main') as string) || ''
		puppets = (localStorage.getItem('puppets') as string) || ''
	})

	async function onSubmit(e: Event) {
		e.preventDefault()
		pushHistory(`?main=${main}`)
		errors = checkUserAgent('main')
		if (errors.length > 0) return
		stoppable = true
		const puppetsList = puppets.split('\n')
		const xml = await parseXML(`${domain}/cgi-bin/api.cgi?wa=1&q=members`, main)
		const members = xml.WA.MEMBERS.split(',')
		puppetsList.forEach(puppet => {
			if (members.includes(puppet.toLowerCase().replace(' ', '_'))) {
				progress = [
					{
						text: '',
						link: {
							href: `${domain}/nation=${puppet}?${urlParameters('Wheres My WA', main)}`,
							label: `I found your WA on ${puppet}`,
						},
					},
				]
			}
		})
		stoppable = false
	}
</script>

<ToolContent
	toolTitle="Where's My WA"
	icon="🗺️"
	caption="Specify your puppets and this script will find which one is in the WA."
	author="9003"
	link="https://github.com/jmikk/WheresMyWA"
	originalBlurb="rewritten in JS for browser use by Kractero" />

<div class="flex flex-col gap-8 break-normal lg:w-[1024px] lg:max-w-5xl lg:flex-row">
	<form onsubmit={onSubmit} class="flex flex-col gap-8">
		<InputCredentials bind:errors bind:main bind:puppets authenticated={false} />
		<Buttons bind:stoppable />
	</form>
	<Terminal bind:progress />
</div>
