<script lang="ts">
	import { handleDownload } from "$lib/download";
	import { htmlContent } from "$lib/htmlContent";
	import { abortController, parser, sleep } from "../../../globals";

    let progress: Array<string> = [];
    let main = "";
    let puppets = "";
    let password = "";
    let content = "";

    async function gotIssues(main: string, puppets: string, password?: string) {
        let userAgent = `${main} Gotissues Written by 9003, Email NSWA9002@gmail.com,discord: 9003, NSNation 9003`;
        let puppetList = puppets.split("\n");
        let issuesCount = 0;
        let packsCount = 0;
        let issuesContent = ""
        let packContent = ""
        let openNewLinkArr: Array<string> = []
        const interimPacks = []
        for (let i = 0; i < puppetList.length; i++) {
            let nation = puppetList[i];
            if (!password) {
                nation = puppetList[i].split(",")[0];
                password = puppetList[i].split(",")[1];
            }
            if (abortController.signal.aborted) {
                break;
            }
            const nation_formatted = nation.toLowerCase().replaceAll(" ", "_");
            try {
                await sleep(700);
                progress.push(`Processing ${nation} ${i + 1}/${puppetList.length}`);
                const response = await fetch(
                    "https://www.nationstates.net/cgi-bin/api.cgi/?nation=" +
                    nation +
                    "&q=issues+packs",
                    {
                    method: "GET",
                    headers: {
                        "User-Agent": userAgent,
                        "X-Password": password.replace(" ", "_"),
                    },
                    }
                );
                const xml = await response.text();
                const xmlObj = parser.parse(xml);
                console.log(xmlObj)
                const issueIds = xmlObj.NATION.ISSUES;
                console.log(issueIds)
                const packs = xmlObj.NATION.PACKS;
                issueIds.forEach((issue) => {
                    console.log(issue)
                    openNewLinkArr.push(`https://www.nationstates.net/container=${nation_formatted}/nation=${nation_formatted}/page=show_dilemma/dilemma=${issue.getAttribute('id')}/template-overall=none//User_agent=${userAgent}/Script=Gotissues/Author_Email=NSWA9002@gmail.com/Author_discord=9003/Author_main_nation=9003/`)
                    issuesContent += `<tr><td><p>${issuesCount+1}</p></td><td><p><a target="_blank" href="https://www.nationstates.net/container=${nation_formatted}/nation=${nation_formatted}/page=show_dilemma/dilemma=${issue.getAttribute('id')}/template-overall=none//User_agent=${userAgent}/Script=Gotissues/Author_Email=NSWA9002@gmail.com/Author_discord=9003/Author_main_nation=9003/">Link to Issue</a></p></td></tr>\n`
                    issuesCount++
                });
                if (packs && packs.textContent) {
                    for (let i = 0; i < parseInt(packs.textContent); i++) {
                    interimPacks.push(`https://www.nationstates.net/page=deck/nation=${nation_formatted}/container=${nation_formatted}/?open_loot_box=1/template-overall=none//User_agent=${userAgent}/Script=Gotissues/Author_Email=NSWA9002@gmail.com/Author_discord=9003/Author_main_nation=9003/autoclose=1`)
                    packContent += `<tr><td><p>${packsCount+1}</p></td><td><p><a target="_blank" href="https://www.nationstates.net/page=deck/nation=${nation_formatted}/container=${nation_formatted}/?open_loot_box=1/template-overall=none//User_agent=${userAgent}/Script=Gotissues/Author_Email=NSWA9002@gmail.com/Author_discord=9003/Author_main_nation=9003/autoclose=1">Link to Pack</a></p></td></tr>\n`
                    packsCount++
                    }
                }
            } catch (err) {
                progress.push(`Error processing ${nation} with ${err}`);
            }
        }
        openNewLinkArr = [...openNewLinkArr, ...interimPacks]
        issuesContent = issuesContent += packContent
        progress.push(`Finished processing`);
        handleDownload("html", htmlContent(issuesContent), "gotIssues");
    }
</script>

<h1 class="text-4xl mb-2">gotIssues</h1>
<p class="mb-16">An even faster way to answer issues with python.</p>

<div class="w-[1280px] max-w-7xl grid grid-cols-2">
    <form on:submit={() => gotIssues(main, puppets, password)} class="flex flex-col gap-8">
        <div class="flex gap-4 justify-between max-w-lg">
            <label class="w-24" id="main">User Agent</label>
            <input required id="main" bind:value={main} class="text-black p-1 max-w-xs rounded-md border border-black dark:border-none" />
        </div>
        <div class="flex gap-4 justify-between max-w-lg">
            <label class="w-24" id="main">Puppets</label>
            <textarea required id="main" rows="10" bind:value={puppets} class="text-black p-1 w-96 rounded-md border border-black dark:border-none" />
        </div>
        <div class="flex gap-4 justify-between max-w-lg">
            <label class="w-24" id="main">Password</label>
            <input id="main" disabled={puppets.includes(',')} bind:value={password} title={puppets.includes(',') ? "A comma is detected in the puppet list, assuming that format." : ""}
                class="text-black p-1  max-w-xs rounded-md border border-black dark:border-none disabled:opacity-25" />
        </div>
        <div class="max-w-lg flex justify-center">
            <button type="submit" class="bg-green-300 rounded-md px-4 py-2 transition duration-300 hover:bg-green-500">
                Start
            </button>
        </div>
    </form>
    <pre class="whitespace-pre-wrap bg-gray-400 text-black">
        {#if progress && progress[0]}
        {#each progress as update}
        <p>{update}</p>
    {/each}
        {/if}
    </pre>
</div>