<script lang="ts">
	import { onDestroy, onMount } from 'svelte'
	import { page } from '$app/state'
	import Buttons from '$lib/components/Buttons.svelte'
	import OpenButton from '$lib/components/buttons/OpenButton.svelte'
	import FormCheckbox from '$lib/components/FormCheckbox.svelte'
	import FormSelect from '$lib/components/FormSelect.svelte'
	import InputCredentials from '$lib/components/InputCredentials.svelte'
	import Terminal from '$lib/components/Terminal.svelte'
	import ToolContent from '$lib/components/ToolContent.svelte'
	import { parseXML } from '$lib/helpers/parser'
	import { checkUserAgent, pushHistory, urlParameters } from '$lib/helpers/utils'
	import type { Issue } from '$lib/types'

	const abortController = new AbortController()
	let domain = ''
	let info = $state<Array<{ text: string; color?: string }>>([])
	let progress = $state<Array<{ text: string; color?: string }>>([])
	let counter = $state(0)
	let downloadable = $state(false)
	let content: Array<{ url: string; tableText: string; linkStyle?: string }> = $state([])
	let stoppable = $state(false)
	let stopped = $state(false)
	let main = $state('')
	let puppets = $state('')
	let password = $state('')
	let mode = $state('')
	let issueCount = $state('5')
	let packCount = $state('All')
	let minPack = $state('0')
	let autoclosepacks = $state(true)
	let errors: Array<{ field: string | number; message: string }> = $state([])
	let testmode: string | null

	onMount(() => {
		domain = `https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net`
		main = page.url.searchParams.get('main') || (localStorage.getItem('main') as string) || ''
		puppets = (localStorage.getItem('gotissuesPuppets') as string) || ''
		password = (localStorage.getItem('password') as string) || ''
		mode = page.url.searchParams.get('mode') || (localStorage.getItem('gotissuesMode') as string) || 'Both'
		issueCount = page.url.searchParams.get('count') || (localStorage.getItem('gotissuesIssueCount') as string) || '5'
		packCount =
			page.url.searchParams.get('packCount') || (localStorage.getItem('gotissuesPackCount') as string) || 'All'
		minPack = page.url.searchParams.get('minPack') || (localStorage.getItem('gotissuesMinPack') as string) || '0'
		testmode = page.url.searchParams.get('test')
		autoclosepacks = Boolean(
			page.url.searchParams.get('autoclosepacks') || localStorage.getItem('gotissuesAutoclosePacks') || true
		)
	})
	onDestroy(() => abortController.abort())

	async function onSubmit(e: Event) {
		e.preventDefault()
		pushHistory(
			`?main=${main}&mode=${mode}${mode === 'Issues' ? `&count=${issueCount}` : mode === 'Packs' ? `&packCount=${packCount}&minPack=${minPack}` : `&count=${issueCount}&packCount=${packCount}&minPack=${minPack}&autoclose=${autoclosepacks}`}${testmode ? `&test=${testmode}` : ''}`
		)
		errors = checkUserAgent(main)
		if (errors.length > 0) return
		downloadable = false
		stoppable = true
		stopped = false
		progress = []
		info = [
			{
				text: `Initiating gotIssues...mode set to ${mode} for ${mode === 'Issues' ? `${issueCount} issues` : `${packCount} packs`}`,
			},
		]
		counter = 0
		content = []
		let puppetList = puppets.split('\n')
		let issuesCount = 0
		let packsCount = 0
		let packContent: Array<{ url: string; tableText: string; linkStyle?: string }> = []
		mode = mode.charAt(0).toUpperCase() + mode.slice(1)
		for (let i = 0; i < puppetList.length; i++) {
			let nation = puppetList[i]
			let nationSpecificPassword = ''
			if (nation.includes(',')) {
				nation = puppetList[i].split(',')[0]
				nationSpecificPassword = puppetList[i].split(',')[1]
			}
			if (abortController.signal.aborted || stopped) {
				break
			}
			const nation_formatted = nation.toLowerCase().replaceAll(' ', '_')
			try {
				progress = [...progress, { text: `Processing ${nation} ${i + 1}/${puppetList.length}` }]
				const xmlObj = await parseXML(
					`${domain}/cgi-bin/api.cgi?nation=${nation}&q=issues+packs`,
					main,
					nationSpecificPassword ? nationSpecificPassword : password?.replaceAll(' ', '_')
				)
				const packs = xmlObj.NATION.PACKS

				if (mode === 'Both' || mode === 'Issues') {
					if (packs && packs >= 9) {
						info = [...info, { text: `${nation} has over 9 packs, skipping issues`, color: 'blue' }]
					} else {
						const issues: Issue = xmlObj.NATION.ISSUES.ISSUE || []
						let issueIds: Array<string> = []
						if (!Array.isArray(issues)) issueIds.push(issues['@_id'])
						else issueIds = issues.map(issue => issue['@_id'])

						if (testmode === 'test') {
							const limitedIssues = issueIds.slice(0, Number(issueCount))
							const firstIssue = limitedIssues[0]

							if (firstIssue) {
								const remainingIssues = limitedIssues.slice(1).join(',')

								const singleLink = `${domain}/container=${nation_formatted}/nation=${nation_formatted}/page=show_dilemma/dilemma=${firstIssue}/template-overall=none?${
									remainingIssues ? `remainingIssues=${remainingIssues}&` : ''
								}${urlParameters('gotIssues', main)}`

								content.push({
									url: singleLink,
									tableText: `Link to Issue`,
								})
								issuesCount += limitedIssues.length
							}
						} else {
							for (let i = 0; i < Math.min(issueIds.length, Number(issueCount)); i++) {
								let issue = issueIds[i]
								content.push({
									url: `${domain}/container=${nation_formatted}/nation=${nation_formatted}/page=show_dilemma/dilemma=${issue}/template-overall=none?${urlParameters('gotIssues', main)}`,
									tableText: `Link to Issue`,
								})
								issuesCount++
							}
						}
					}
				}
				if (mode === 'Both' || mode === 'Packs') {
					packCount = packCount === 'All' ? '9' : packCount
					const packsToOpen = Math.min(packs - Number(minPack), Number(packCount))
					if (packs === 0) {
						progress = [...progress, { text: `${nation} has no packs, skipping!`, color: 'blue' }]
						continue
					}
					if (packs >= Number(minPack)) {
						for (let i = 0; i < packsToOpen; i++) {
							const packLink = `${domain}/page=deck/container=${nation_formatted}/nation=${nation_formatted}?open_loot_box=1&${urlParameters('gotIssues', main)}`
							if (mode === 'Both') {
								packContent.push({
									url: packLink,
									tableText: `Link to Pack`,
								})
							} else {
								content.push({
									url: packLink,
									tableText: `Link to Pack`,
								})
							}
							packsCount++
						}
					} else {
						info = [...info, { text: `${nation} has less packs than ${minPack}, skipping!`, color: 'blue' }]
					}
				}
			} catch (err) {
				info = [...info, { text: `Error processing ${nation} with ${err}`, color: 'red' }]
			}
		}
		content = [...content, ...packContent]
		progress = [
			...progress,
			{
				text: `Finished processing ${puppetList.length} nations, equaling ${issuesCount} issues and ${packsCount} packs!`,
			},
		]
		downloadable = true
		stoppable = false
	}
</script>

<ToolContent
	toolTitle="gotIssues"
	icon="🗒️"
	caption="An even faster way to answer issues with JavaScript."
	author="9003"
	originalBlurb="rewritten in JS for browser use by Kractero"
	link="https://github.com/jmikk/gotIssues"
	additional={`<p class="text-xs mb-16">
	For optimal use, this script is intended to be used with
	<a class="underline" href="https://raw.githubusercontent.com/jmikk/gotIssues/master/autoclose%3D1.user.js" target="_blank" rel="noreferrer noopener">
		autoclose
	</a> and
	<a class="underline" href="https://github.com/dithpri/RCES/raw/master/userscripts/issue_answering/NsIssueCompactorRand.user.js" target="_blank" rel="noreferrer noopener">
		NSIssueCompactorRand
	</a>
</p>
<p class="text-xs mb-16">
	Password input is optional and will be disabled if the puppet list includes a comma for nation,password.
</p>`} />

<div class="flex flex-col gap-8 break-normal lg:w-[1024px] lg:max-w-5xl lg:flex-row">
	<form onsubmit={onSubmit} class="flex flex-col gap-8">
		<InputCredentials bind:errors bind:main bind:puppets bind:password authenticated={true} />
		<FormSelect id="mode" label="Issues and Packs" bind:bindValue={mode} items={['Both', 'Issues', 'Packs']} />
		{#if mode === 'Issues' || mode === 'Both'}
			<FormSelect id="issueCount" label="Issues Count" bind:bindValue={issueCount} items={['1', '2', '3', '4', '5']} />
		{/if}
		{#if mode === 'Packs' || mode === 'Both'}
			<FormSelect
				id="packCount"
				label="Pack Count"
				bind:bindValue={packCount}
				items={['All', '1', '2', '3', '4', '5', '6', '7', '8', '9']} />
			<FormSelect
				id="minPack"
				label="Minimum Floor"
				subTitle={`Open ${packCount} packs on a nation up to the floor of ${minPack} packs. Always keep at least ${minPack} packs.`}
				bind:bindValue={minPack}
				items={['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']} />
			<FormCheckbox bind:checked={autoclosepacks} id="autoclosepacks" label="Autoclose Packs" />
		{/if}
		<Buttons
			stopButton={true}
			bind:stopped
			bind:stoppable
			downloadButton={true}
			bind:downloadable
			bind:content
			name="gotIssues">
			<OpenButton bind:progress bind:openNewLinkArr={content} />
		</Buttons>
	</form>
	<Terminal bind:progress bind:info />
</div>
