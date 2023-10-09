<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { parser, sleep } from '$lib/globals';
	import Head from '$lib/component/Head.svelte';
	import { loadLocalStorage } from '$lib/loadLocalStorage';
	import Terminal from '$lib/component/Terminal.svelte';
	import Buttons from '$lib/component/Buttons.svelte';
	import Input from '$lib/component/Input.svelte';
	import { htmlContent } from '$lib/htmlContent';
	import { handleDownload } from '$lib/download';
	import Select from '$lib/component/Select.svelte';
	const abortController = new AbortController();
	let progress = "";
	let main = "";
    let content = "";
	let downloadable = false;
    let council = "General Assembly";
	let proposalid = "";
	onMount(() => ({main, council, proposalid} = loadLocalStorage(["stationMain", "stationCouncil", "stationProposalID"])));
	onDestroy(() => abortController.abort() );
	async function approvals() {
        downloadable = false;
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
	}
</script>

<Head title={"Hare - Approvals List"} description={"Specify a nation and get all the regionmates they are not endorsing."} />

<h1 class="text-4xl mb-2">Approvals List</h1>
<p class="text-xs mb-1">
	<a class="underline" href="https://github.com/jmikk/gotIssues" target="_blank" rel="noreferrer noopener">
		Original by 9003
	</a>, rewritten in JS for browser use by Kractero</p>
<p class="mb-16">Specify a proposal and get all delegates that are not approving it.</p>

<div class="lg:w-[1024px] lg:max-w-5xl flex flex-col lg:flex-row gap-8 break-normal">
	<form on:submit|preventDefault={() => approvals()} class="flex flex-col gap-8">
		<Input text="User Agent" bind:bindValue={main} forValue="main" required={true} />
		<div class="flex gap-4 justify-between max-w-lg">
			<label class="w-24" for="mode">Council</label>
			<Select bind:mode={council} options={['General Assembly', 'Security Council']} />
		</div>
		<Input text="Proposal ID" bind:bindValue={proposalid} forValue="proposalID" required={false} />
		<Buttons>
			<button disabled={!downloadable} type="button" on:click={() => handleDownload('html', htmlContent(content), 'Approvals')}
				class="bg-green-500 rounded-md px-4 py-2 transition duration-300 hover:bg-green-300 disabled:opacity-20 disabled:hover:bg-green-500">
				Download
			</button>
		</Buttons>
	</form>
	<Terminal bind:progress={progress} />
</div>
