<script lang="ts">
	import { preventDefault } from 'svelte/legacy';

	import { onDestroy, onMount } from 'svelte'
	import { page } from '$app/stores'
	import Buttons from '$lib/components/Buttons.svelte'
	import UserAgent from '$lib/components/formFields/UserAgent.svelte'
	import FormInput from '$lib/components/FormInput.svelte'
	import FormSelect from '$lib/components/FormSelect.svelte'
	import Terminal from '$lib/components/Terminal.svelte'
	import ToolContent from '$lib/components/ToolContent.svelte'
	import { parseXML } from '$lib/helpers/parser'
	import { checkUserAgent, pushHistory, urlParameters } from '$lib/helpers/utils'

	const abortController = new AbortController()

	let domain = ''
	let progress = $state('')
	let content = $state('')
	let downloadable = $state(false)
	let stopped = false
	let stoppable = false
	let main: string = $state('')
	let council: string = $state('General Assembly')
	let proposalid: string = $state('')
	let errors: Array<{ field: string | number; message: string }> = $state([])

	onMount(() => {
		domain = `https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net`
		main = $page.url.searchParams.get('main') || (localStorage.getItem('main') as string) || ''
		council =
			$page.url.searchParams.get('council') || (localStorage.getItem('approvalCouncil') as string) || 'General Assembly'
		proposalid = $page.url.searchParams.get('proposal') || (localStorage.getItem('approvalProposal') as string) || ''
	})
	onDestroy(() => abortController.abort())
	async function onSubmit() {
		pushHistory(`?main=${main}&council=${council}&proposal=${proposalid}`)
		errors = checkUserAgent(main)
		if (errors.length > 0) return
		downloadable = false
		stoppable = true
		stopped = false
		let councilID = 1
		if (council === 'Security Council') councilID = 2
		progress = `<p>Retrieving list of esteemed delegates...</p>`
		let delegatesXML = await parseXML(`${domain}/cgi-bin/api.cgi?wa=1&q=delegates`, main)
		const delegates: Array<string> = delegatesXML.WA.DELEGATES.split(',')
		progress += `<p>${delegates.length} delegates found.</p>`
		const proposalXML = await parseXML(`${domain}/cgi-bin/api.cgi?wa=${councilID}&q=proposals`, main)
		if (!proposalXML.WA.PROPOSALS.PROPOSAL) {
			progress += `No proposals currently in the ${council}.`
			return
		}
		const proposal = Array.isArray(proposalXML.WA.PROPOSALS.PROPOSAL)
			? proposalXML.WA.PROPOSALS.PROPOSAL.filter(
					(proposal: { [x: string]: string }) => proposal['@_id'] === proposalid
				)[0]
			: proposalXML.WA.PROPOSALS.PROPOSAL['@_id'] === proposalid
		if (!proposal) {
			progress += `<p class="text-red-400">No proposal found matching ${proposalid} in the ${council}.</p>`
			stoppable = false
			return
		}
		const approvalsOnRequestedProposal = proposal.APPROVALS.split(':')
		const notApproving: Array<string> = []
		const approving: Array<string> = []
		delegates.forEach(delegate => {
			if (!approvalsOnRequestedProposal.includes(delegate)) {
				notApproving.push(delegate)
			} else {
				approving.push(delegate)
			}
		})
		progress += `<p>Finished searching <span class="font-bold">${proposal.NAME}</span> for delegates not approving.</p>`
		notApproving.forEach((delegate, i) => {
			progress += `<p class="text-red-400"><a class="underline" href="${domain}/nation=${delegate}?${urlParameters('Approvals List', main)}">${delegate}</a> is NOT approving!</p>`
			content += `<tr><td><p>${
				i + 1
			}/${notApproving.length}</p></td><td><p><a target="_blank" href="${domain}/nation=${delegate}?${urlParameters('Approvals List', main)}">Link to Nation</a></p></td></tr>\n`
		})
		approving.forEach(delegate => {
			progress += `<p class="text-green-400"><a class="underline" href="${domain}/nation=${delegate}?${urlParameters('Approvals List', main)}">${delegate}</a> is approving!</p>`
		})
		downloadable = true
		stoppable = false
	}
</script>

<ToolContent
	toolTitle="Approvals List"
	originalBlurb="rewritten in JS for browser use by Kractero"
	author="9003"
	link="https://github.com/jmikk/Approval-List"
	caption="Specify a proposal and get all delegates that are not approving it." />

<div class="flex flex-col justify-between gap-8 break-normal lg:w-[1024px] lg:max-w-5xl lg:flex-row">
	<form onsubmit={preventDefault(onSubmit)} class="flex flex-col gap-8">
		<UserAgent bind:main bind:errors />
		<FormSelect
			id="council"
			label="Council"
			bind:bindValue={council}
			items={['General Assembly', 'Security Council']} />
		<FormInput bind:bindValue={proposalid} id="proposalid" label="Proposal ID" required={true} />
		<Buttons downloadButton={true} bind:downloadable bind:content type="html" name="Approvals" />
	</form>
	<Terminal bind:progress />
</div>
