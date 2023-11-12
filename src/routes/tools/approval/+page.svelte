<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { parseXML, sleep } from '$lib/helpers/utils';
	import Terminal from '$lib/component/Terminal.svelte';
	import Buttons from '$lib/component/Buttons.svelte';
	import Input from '$lib/component/Input.svelte';
	import Select from '$lib/component/Select.svelte';
	const abortController = new AbortController();
	import type { PageData } from './$types';
	import { pushHistory } from '$lib/helpers/utils';
	import ToolContent from '$lib/component/ToolContent.svelte';
	export let data: PageData;
	let progress = "";
    let content = "";
	let downloadable = false;
	let stopped = false;
	let stoppable = false;

	let main: string;
    let council: string;
	let proposalid: string;
	onMount(() => {
		main = data.parameters.main || localStorage.getItem("main") as string || "";
		council = data.parameters.council || localStorage.getItem("approvalCouncil") as string || "General Assembly";
		proposalid = data.parameters.proposal || localStorage.getItem("approvalProposal") as string || "";
	});
	onDestroy(() => abortController.abort() );
	async function approvals() {
		pushHistory(`?main=${main}&council=${council}&proposal=${proposalid}`)
        downloadable = false;
		stoppable = true;
		stopped = false;
        let councilID = 1;
        if (council === "Security Council") {
            councilID = 2;
        }
		progress = `<p>Retrieving list of esteemed delegates...</p>`
        await sleep(700);
        let delegatesXML = await parseXML(`https://www.nationstates.net/cgi-bin/api.cgi?wa=1&q=delegates`, main)
		const delegates: Array<string> = delegatesXML.WA.DELEGATES.split(',')
        progress += `<p>${delegates.length} delegates found.</p>`
        const proposalXML = await parseXML(`https://www.nationstates.net/cgi-bin/api.cgi?wa=${councilID}&q=proposals`, main)
        const proposal = proposalXML.WA.PROPOSALS.PROPOSAL.filter((proposal: { [x: string]: string; }) => proposal["@_id"] === proposalid)[0]
        if (!proposal) {
            progress += `<p class="text-red-400">No proposal found matching ${proposalid} in the ${council}.</p>`
			stoppable = false;
            return;
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
            progress += `<p class="text-red-400"><a class="underline" href="https://nationstates.net/nation=${delegate}">${delegate}</a> is NOT approving!</p>`
            content += `<tr><td><p>${
                i + 1
            }/${notApproving.length}</p></td><td><p><a target="_blank" href="https://www.nationstates.net/nation=${delegate}//User_agent=${main}/Script=ApprovalListBrowser/Author_main_nation=Kractero/">Link to Nation</a></p></td></tr>\n`;
        })
        approving.forEach(delegate => {
            progress += `<p class="text-green-400"><a class="underline" href="https://nationstates.net/nation=${delegate}">${delegate}</a> is approving!</p>`
        })
        downloadable = true;
		stoppable = false;
	}
</script>

<ToolContent toolTitle="Approvals List" originalBlurb="rewritten in JS for browser use by Kractero" author="9003" link="https://github.com/jmikk/Approval-List" caption="Specify a proposal and get all delegates that are not approving it." />

<div class="lg:w-[1024px] lg:max-w-5xl flex flex-col lg:flex-row gap-8 break-normal">
	<form on:submit|preventDefault={() => approvals()} class="flex flex-col gap-8">
		<Input text="User Agent" bind:bindValue={main} forValue="main" required={true} />
		<Select name="Council" mode={council} options={['General Assembly', 'Security Council']} />
		<Input text="Proposal ID" bind:bindValue={proposalid} forValue="proposalID" required={true} />
		<Buttons downloadButton={true} bind:downloadable={downloadable} bind:content={content} type="html" name="Approvals" />
	</form>
	<Terminal bind:progress={progress} />
</div>
