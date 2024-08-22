<script lang="ts">
	import { onDestroy, onMount } from 'svelte'
	import { page } from '$app/stores'
	import Select from '$lib/component/Select.svelte'
	import Buttons from '$lib/components/Buttons.svelte'
	import OpenButton from '$lib/components/buttons/OpenButton.svelte'
	import FormSelect from '$lib/components/FormSelect.svelte'
	import InputCredentials from '$lib/components/InputCredentials.svelte'
	import Terminal from '$lib/components/Terminal.svelte'
	import ToolContent from '$lib/components/ToolContent.svelte'
	import { pushHistory } from '$lib/helpers/navigation'
	import { parseXML } from '$lib/helpers/parser'
	import { validate } from '$lib/helpers/validate'
	import { giSchema } from '$lib/schema'
	import type { Issue } from '$lib/types'

	const abortController = new AbortController()
	let progress = ''
	let openNewLinkArr: Array<string> = []
	let counter = 0
	let downloadable = false
	let issuesContent = ''
	let stoppable = false
	let stopped = false
	let main = ''
	let puppets = ''
	let password = ''
	let mode = ''
	let issueCount = '5'
	let errors: Array<{ field: string | number; message: string }> = []

	onMount(() => {
		main = $page.url.searchParams.get('main') || (localStorage.getItem('main') as string) || ''
		puppets = (localStorage.getItem('gotissuesPuppets') as string) || ''
		password = (localStorage.getItem('password') as string) || ''
		mode =
			$page.url.searchParams.get('mode') ||
			(localStorage.getItem('gotissuesMode') as string) ||
			'Both'
		issueCount =
			$page.url.searchParams.get('count') ||
			(localStorage.getItem('gotissuesIssueCount') as string) ||
			'5'
	})
	onDestroy(() => abortController.abort())

	async function gotIssues() {
		pushHistory(`?main=${main}&mode=${mode}&count=${issueCount}`)
		errors = validate(giSchema, {
			useragent: main,
			mode: mode,
			puppets: puppets,
			issuesCount: issueCount,
		})
		if (errors.length > 0) return
		downloadable = false
		stoppable = true
		stopped = false
		progress = `<p class="font-bold">Initiating gotIssues...mode set to ${mode} for ${issueCount} issues</p>`
		openNewLinkArr = []
		issuesContent = ''
		let puppetList = puppets.split('\n')
		let issuesCount = 0
		let packsCount = 0
		let packContent = ''
		const interimPacks = []
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
				progress += `<p>Processing ${nation} ${i + 1}/${puppetList.length}</p>`
				const xmlObj = await parseXML(
					`https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net/cgi-bin/api.cgi/?nation=${nation}&q=issues+packs`,
					main,
					nationSpecificPassword ? nationSpecificPassword : password?.replaceAll(' ', '_')
				)
				if (mode === 'Both' || mode === 'Issues') {
					const issues: Issue = xmlObj.NATION.ISSUES.ISSUE || []
					let issueIds: Array<string> = []
					if (!Array.isArray(issues)) issueIds.push(issues['@_id'])
					else issueIds = issues.map(issue => issue['@_id'])
					for (let i = 0; i < Math.min(issueIds.length, Number(issueCount)); i++) {
						let issue = issueIds[i]
						openNewLinkArr = [
							...openNewLinkArr,
							`https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net/container=${nation_formatted}/nation=${nation_formatted}/page=show_dilemma/dilemma=${issue}/template-overall=none/User_agent=${main}/Script=Gotissues/Generated_by=Gotissues/Author_discord=scrambleds/Author_main_nation=Kractero/`,
						]
						issuesContent += `<tr><td><p>${
							issuesCount + 1
						}</p></td><td><p><a target="_blank" href="https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net/container=${nation_formatted}/nation=${nation_formatted}/page=show_dilemma/dilemma=${issue}/template-overall=none/User_agent=${main}/Script=Gotissues/Generated_by=Gotissues/Author_discord=scrambleds/Author_main_nation=Kractero/">Link to Issue</a></p></td></tr>\n`
						issuesCount++
					}
				}
				if (mode === 'Both' || mode === 'Packs') {
					const packs = xmlObj.NATION.PACKS
					if (packs) {
						for (let i = 0; i < packs; i++) {
							if (mode === 'Packs') {
								openNewLinkArr = [
									...openNewLinkArr,
									`https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net/page=deck/nation=${nation_formatted}/container=${nation_formatted}/?open_loot_box=1/template-overall=none/User_agent=${main}/Script=Gotissues/Generated_by=Gotissues/Author_discord=scrambleds/Author_main_nation=Kractero/autoclose=1`,
								]
							} else {
								interimPacks.push(
									`https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net/page=deck/nation=${nation_formatted}/container=${nation_formatted}/?open_loot_box=1/template-overall=none/User_agent=${main}/Script=Gotissues/Generated_by=Gotissues/Author_discord=scrambleds/Author_main_nation=Kractero/autoclose=1`
								)
							}
							packContent += `<tr><td><p>${
								packsCount + 1
							}</p></td><td><p><a target="_blank" href="https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net/page=deck/nation=${nation_formatted}/container=${nation_formatted}/?open_loot_box=1/template-overall=none/User_agent=${main}/Script=Gotissues/Generated_by=Gotissues/Author_discord=scrambleds/Author_main_nation=Kractero/autoclose=1">Link to Pack</a></p></td></tr>\n`
							packsCount++
						}
					}
				}
			} catch (err) {
				progress += `<p class="text-red-400">Error processing ${nation} with ${err}</p>`
			}
		}
		openNewLinkArr = [...openNewLinkArr, ...interimPacks]
		issuesContent = issuesContent += packContent
		progress += `<p>Finished processing ${puppetList.length} nations, equaling ${issuesCount} issues and ${packsCount} packs!</p>`
		downloadable = true
		stoppable = false
	}
</script>

<ToolContent
	toolTitle="gotIssues"
	caption="An even faster way to answer issues with JavaScript."
	author="9003"
	originalBlurb="rewritten in JS for browser use by Kractero"
	link="https://github.com/jmikk/gotIssues"
	additional={`<p class="text-xs mb-16">
	For optimal use, this script is intended to be used with
	<a class="underline" href="https://raw.githubusercontent.com/jmikk/gotIssues/master/autoclose%3D1.user.js" target="_blank" rel="noreferrer noopener">
		autoclose
	</a> and
	<a class="underline" href="https://raw.githubusercontent.com/jmikk/gotIssues/master/NsIssueCompactorRand.js" target="_blank" rel="noreferrer noopener">
		NSIssueCompactorRand
	</a>
</p>
<p class="text-xs mb-16">
	Password input is optional and will be disabled if the puppet list includes a comma for nation,password.
</p>`}
/>

<div class="flex flex-col gap-8 break-normal lg:w-[1024px] lg:max-w-5xl lg:flex-row">
	<form on:submit|preventDefault={() => gotIssues()} class="flex flex-col gap-8">
		<InputCredentials bind:errors bind:main bind:puppets bind:password authenticated={true} />
		<FormSelect
			id="mode"
			label="Issues and Packs"
			bind:bindValue={mode}
			items={['Both', 'Issues', 'Packs']}
		/>
		<FormSelect
			id="issueCount"
			label="Issues Count"
			bind:bindValue={issueCount}
			items={['1', '2', '3', '4', '5']}
		/>
		<Buttons
			stopButton={true}
			bind:stopped
			bind:stoppable
			downloadButton={true}
			bind:downloadable
			bind:content={issuesContent}
			name="gotIssues"
		>
			<OpenButton bind:counter bind:progress bind:openNewLinkArr />
		</Buttons>
	</form>
	<Terminal bind:progress />
</div>
