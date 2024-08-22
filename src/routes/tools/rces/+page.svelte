<script lang="ts">
	import { onDestroy, onMount } from 'svelte'
	import Buttons from '$lib/components/Buttons.svelte'
	import Puppets from '$lib/components/formFields/Puppets.svelte'
	import Terminal from '$lib/components/Terminal.svelte'
	import ToolContent from '$lib/components/ToolContent.svelte'

	const abortController = new AbortController()
	let progress = ''
	let puppets = ''
	let content = ''
	let downloadable = false

	onMount(() => {
		puppets = (localStorage.getItem('puppets') as string) || ''
	})
	onDestroy(() => abortController.abort())

	async function ping() {
		downloadable = false
		let puppetList = puppets.split('\n')
		for (let i = 0; i < puppetList.length; i++) {
			let nation = puppetList[i].replaceAll(' ', '_').toLowerCase()
			content += `<tr>\n`
			content += `<td><p>${i}</p></td>`
			content += `<td><p><a target="_blank" href="https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net/container=${nation}/nation=${nation}/Script=RCES/Generated_by=RCES/Author_discord=scrambleds/Author_main_nation=Kractero/">${nation}</a></p></td>\n`
			content += `<td><p><a target="_blank" href="https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net/container=${nation}/nation=${nation}/page=dilemmas/template-overall=none/Script=RCES/Generated_by=RCES/Author_discord=scrambleds/Author_main_nation=Kractero/">issues</a></p></td>\n`
			content += `<td><p><a target="_blank" href="https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net/container=${nation}/nation=${nation}/page=deck/Script=RCES/Generated_by=RCES/Author_discord=scrambleds/Author_main_nation=Kractero/">deck</a></p></td>\n`
			content += `<td><p><a target="_blank" href="https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net/container=${nation}/nation=${nation}/page=deck/value_deck=1/Script=RCES/Generated_by=RCES/Author_discord=scrambleds/Author_main_nation=Kractero/">value deck</a></p></td>\n`
			content += `<td><p><a target="_blank" href="https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net/container=${nation}/nation=${nation}/page=telegrams/Script=RCES/Generated_by=RCES/Author_discord=scrambleds/Author_main_nation=Kractero/">telegrams</a></p></td>\n`
			content += `<td><p><a target="_blank" href="https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net/container=${nation}/nation=${nation}/page=settings/Script=RCES/Generated_by=RCES/Author_discord=scrambleds/Author_main_nation=Kractero/">settings</a></p></td>\n`
			content += `<td><p><a target="_blank" href="https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net/container=${nation}/nation=${nation}/page=tgsettings/Script=RCES/Generated_by=RCES/Author_discord=scrambleds/Author_main_nation=Kractero/">tg settings</a></p></td>\n`
			content += `<td><p><a target="_blank" href="https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net/container=${nation}/nation=${nation}/page=create_nation/name=${nation}/Script=RCES/Generated_by=RCES/Author_discord=scrambleds/Author_main_nation=Kractero/">create (use /w hare's creator userscripts)</a></p></td>\n`
			content += `</tr>\n`
		}
		downloadable = true
	}
</script>

<ToolContent
	toolTitle="RCES Sheet Maker"
	originalBlurb="rewritten in JS for browser use by Kractero"
	author="Racoda"
	link="https://github.com/dithpri/RCES#puppet-links-sheet"
	caption="Generates a sheet of clickable links pointing to various puppets."
	additional={`<p class="text-xs mb-16">
	Is not as configurable as the original, but I think default config had sane defaults.
</p>`}
/>

<div class="flex flex-col gap-8 break-normal lg:w-[1024px] lg:max-w-5xl lg:flex-row">
	<form on:submit|preventDefault={async () => await ping()} class="flex flex-col gap-8">
		<Puppets bind:puppets />
		<Buttons downloadButton={true} bind:downloadable bind:content type="html" name="RCES" />
	</form>
	<Terminal bind:progress />
</div>
