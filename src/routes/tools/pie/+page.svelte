<!-- <script lang="ts">
	import { onDestroy } from "svelte";
	import InputCredentials from "../../../component/InputCredentials.svelte";
	import { parser, sleep } from "../../../globals";
    const abortController = new AbortController();
    let progress: Array<string> = [];
    let main = "";
    let puppets = "";
    let password = "";
    
    onDestroy(() => abortController.abort())

    async function goldRetriever(main: string, nation: string) {
        let userAgent = `${main} Gotissues Written by 9003, Email NSWA9002@gmail.com,discord: 9003, NSNation 9003`;
        let content = `<tr><th>Nation</th><th class='sort' data-order='none'>Bank</th><th class='sort' data-order='none'>Deck Value</th><th class='sort' data-order='none'>Junk Value</th><th class='sort' data-order='none'>Card Count</th></tr>\n`
        const response = await fetch(
            "https://www.nationstates.net/cgi-bin/api.cgi/?nationname=" +
            nation +
            "&q=cards+deck+info",
            {
                method: "GET",
                headers: {
                    "User-Agent": userAgent
                },
            }
        );
        const xml = await response.text();
        const xmlObj = parser.parse(xml);
        const deck = {
            "nation": nation,
            "bank": 0,
            "deckValue": 0,
            "junkValue": 0,
            "cardCount": 0
        }

        const categoryCounts: {[key: string]: number} = {};
        if (xmlObj.CARDS.DECK.CARD) {
            const deckObj = xmlObj.CARDS.DECK.CARD;
            for (let i = 0; i < deckObj.length; i++) {
                const category = deckObj[i].CATEGORY;
                if (categoryCounts[category]) {
                    categoryCounts[category] += 1;
                } else {
                    categoryCounts[category] = 1;
                }
            }
            console.log
        }
    }
</script>

<h1 class="text-4xl mb-2">Gold Retriever</h1>
<p class="mb-16">Get deck value, junk value, and more of all your puppets.</p>

<div class="lg:w-[1024px] lg:max-w-5xl flex flex-col lg:flex-row gap-8">
    <form on:submit|preventDefault={() => goldRetriever(main, puppets)} class="flex flex-col gap-8">
        <InputCredentials bind:main={main} bind:puppets={puppets} authenticated={false} />
        <div class="max-w-lg flex justify-center">
            <button type="submit" class="bg-green-500 rounded-md px-4 py-2 transition duration-300 hover:bg-green-300">
                Start
            </button>
        </div>
    </form>
    <pre class="flex-1 p-2 whitespace-pre-wrap bg-black dark:bg-gray-50 text-white dark:text-black font-medium font-mono inline-block">
        {#if progress && progress[0]}
            {#each progress as update}
                <p>{update}</p>
            {/each}
        {/if}
    </pre>
</div> -->
