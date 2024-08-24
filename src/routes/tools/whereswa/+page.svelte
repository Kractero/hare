<script lang="ts">
	import { onMount } from 'svelte'
	import { page } from '$app/stores'
	import Buttons from '$lib/components/Buttons.svelte'
	import InputCredentials from '$lib/components/InputCredentials.svelte'
	import Terminal from '$lib/components/Terminal.svelte'
	import ToolContent from '$lib/components/ToolContent.svelte'
	import { pushHistory } from '$lib/helpers/navigation'
	import { parseXML } from '$lib/helpers/parser'
	import { checkUserAgent } from '$lib/helpers/validate'

	let progress = ''
	let puppets = ''
	let main = ''
	let stoppable = false
	let errors: Array<{ field: string | number; message: string }> = []

	onMount(() => {
		main = $page.url.searchParams.get('main') || (localStorage.getItem('main') as string) || ''
		puppets = (localStorage.getItem('puppets') as string) || ''
	})
	async function findWA(main: string, puppets: string) {
		pushHistory(`?main=${main}`)
		errors = checkUserAgent('main')
		if (errors.length > 0) return
		progress = ''
		stoppable = true
		const puppetsList = puppets.split('\n')
		const xml = await parseXML(
			`https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net/cgi-bin/api.cgi?wa=1&q=members`,
			main
		)
		const members = xml.WA.MEMBERS.split(',')
		puppetsList.forEach(puppet => {
			if (members.includes(puppet.toLowerCase().replace(' ', '_'))) {
				progress = `<p>I found your WA on <a href="https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net/nation=${puppet}User_agent=${main}/Script=Whereswa/Generated_by=Whereswa/Author_discord=scrambleds/Author_main_nation=Kractero/">${puppet}</a>.</p>`
			}
		})
		stoppable = false
	}
</script>

<ToolContent
	toolTitle="Where's My WA"
	caption="Specify your puppets and this script will find which one is in the WA."
	author="9003"
	link="https://github.com/jmikk/WheresMyWA"
	originalBlurb="rewritten in JS for browser use by Kractero"
/>

<div class="flex flex-col gap-8 break-normal lg:w-[1024px] lg:max-w-5xl lg:flex-row">
	<form on:submit|preventDefault={() => findWA(main, puppets)} class="flex flex-col gap-8">
		<InputCredentials bind:errors bind:main bind:puppets authenticated={false} />
		<Buttons bind:stoppable />
	</form>
	<Terminal bind:progress />
</div>
