<script lang="ts">
	import { onDestroy, onMount } from 'svelte'
	import { page } from '$app/state'
	import Buttons from '$lib/components/Buttons.svelte'
	import UserAgent from '$lib/components/formFields/UserAgent.svelte'
	import Terminal from '$lib/components/Terminal.svelte'
	import ToolContent from '$lib/components/ToolContent.svelte'
	import { parseXML } from '$lib/helpers/parser'
	import { checkUserAgent, pushHistory, urlParameters } from '$lib/helpers/utils'

	const abortController = new AbortController()
	let domain = ''
	let progress = $state<Array<{ text: string; color?: string; link?: { href: string; label: string } }>>([])
	let main = $state('')
	let errors: Array<{ field: string | number; message: string }> = $state([])

	onMount(() => {
		domain = `https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net`
		main = page.url.searchParams.get('main') || (localStorage.getItem('main') as string) || ''
	})

	onDestroy(() => abortController.abort())

	async function onSubmit(e: Event) {
		e.preventDefault()
		pushHistory(`?main=${main}`)
		errors = checkUserAgent('main')
		if (errors.length > 0) return
		const fetcha = await fetch(
			'https://docs.google.com/spreadsheets/d/1MZ-4GLWAZDgB1TDvwtssEcVKHKunOKi3l90Jof1pBB4/export?format=tsv&id=1MZ-4GLWAZDgB1TDvwtssEcVKHKunOKi3l90Jof1pBB4&gid=733627866'
		)
		const text = await fetcha.text()
		let masterList: { [key: string]: string } = {}
		text.split('\n').forEach(puppetLine => {
			const puppSplit = puppetLine.split('\t')
			masterList[puppSplit[0].toLowerCase().replaceAll(' ', '_')] = puppSplit[1]
		})
		const ownerList: { [key: string]: string } = {}
		const currActives = await parseXML(`${domain}/cgi-bin/api.cgi?q=happenings;filter=law;limit=200`, main)
		currActives.WORLD.HAPPENINGS.EVENT.forEach((event: { TEXT: string }) => {
			const regex = /@@([\w]+)@@/
			if (event.TEXT) {
				const nation = event.TEXT.match(regex)
				if (nation && nation.length > 1 && nation[1]) {
					if (masterList[nation[1]]) {
						if (!ownerList[masterList[nation[1]]]) {
							ownerList[masterList[nation[1]]] = `${nation[1]}`
						} else {
							ownerList[masterList[nation[1]]] += `, ${nation[1]}`
						}
					}
				}
			}
		})
		if (Object.keys(ownerList).length === 0) {
			progress = [{ text: `It seems nobody is farming at the moment...` }]
		} else {
			Object.keys(ownerList).forEach(owner => {
				progress = [
					{
						text: '',
						link: {
							href: `${domain}/nation=${owner}?${urlParameters('Whos Farmin', main)}`,
							label: `${owner} is currently farming!`,
						},
					},
				]
			})
		}
	}
</script>

<ToolContent
	toolTitle="Whos Farmin"
	icon="🚜"
	caption="Detect whose farming at the moment from the last 200 world issue happenings."
	additional={`<p class="text-xs mb-16">
	Puppets are linked to their owners via <a class="underline" target="_blank" rel="noreferrer noopener" href="https://docs.google.com/spreadsheets/d/1MZ-4GLWAZDgB1TDvwtssEcVKHKunOKi3l90Jof1pBB4/">9003's sheet</a>, submit
  yours <a target="_blank" rel="noreferrer noopener" class="underline" href="https://docs.google.com/forms/d/16t4mlYuSU5p0U9hVkvzKMqP1GRnpdDV7nLNLA9WdFTs/viewform">here</a>
</p>`} />

<div class="flex flex-col gap-8 break-normal lg:w-[1024px] lg:max-w-5xl lg:flex-row">
	<form onsubmit={onSubmit} class="flex flex-col gap-8">
		<UserAgent bind:errors bind:main />
		<Buttons />
	</form>
	<Terminal bind:progress />
</div>
