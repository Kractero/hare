<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { parser, sleep } from '$lib/helpers/utils';
	import Terminal from '$lib/component/Terminal.svelte';
	import Buttons from '$lib/component/Buttons.svelte';
	import Input from '$lib/component/Input.svelte';
	import { htmlContent } from '$lib/helpers/htmlContent';
	import { handleDownload } from '$lib/helpers/download';
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
		progress = "";
        progress += `<p>Retrieving list of esteemed delegates...</p>`
        await sleep(700);
        const delegatesres = await fetch(`https://www.nationstates.net/cgi-bin/api.cgi?wa=1&q=delegates`, {
			headers: {
				'User-Agent': main
			}
		});
        const delegatestext = await delegatesres.text();
        const delegatesXML = parser.parse(delegatestext)
        const delegates: Array<string> = delegatesXML.WA.DELEGATES.split(',')
        progress += `<p>${delegates.length} delegates found.</p>`
        const proposalres = await fetch(`https://www.nationstates.net/cgi-bin/api.cgi?wa=${councilID}&q=proposals`)
        const proposaltext = await proposalres.text();
        const proposalXML = parser.parse(proposaltext)
        const proposal = proposalXML.WA.PROPOSALS.PROPOSAL.filter((proposal: { [x: string]: string; }) => proposal["@_id"] === proposalid)[0]
        if (!proposal) {
            progress += `<p class="text-red-400">No proposal found matching ${proposalid} in the ${council}.</p>`
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
		<div class="flex gap-4 justify-between max-w-lg">
			<label class="w-24" for="mode">Council</label>
			<Select bind:mode={council} options={['General Assembly', 'Security Council']} />
		</div>
		<Input text="Proposal ID" bind:bindValue={proposalid} forValue="proposalID" required={true} />
		<Buttons bind:stoppable={stoppable}>
			<button
				type="button"
				disabled={!stoppable}
				on:click={() => { {
					stoppable = false;
					stopped = true;
				} }}
				class="bg-red-500 rounded-md px-4 py-2 transition duration-300 hover:bg-red-300 disabled:opacity-20 disabled:hover:bg-red-500"
			>
				Stop
			</button>
			<button disabled={!downloadable} type="button" on:click={() => handleDownload('html', htmlContent(content), 'Approvals')}
				class="bg-green-500 rounded-md px-4 py-2 transition duration-300 hover:bg-green-300 disabled:opacity-20 disabled:hover:bg-green-500">
				Download
			</button>
		</Buttons>
	</form>
	<Terminal bind:progress={progress} />
</div>
