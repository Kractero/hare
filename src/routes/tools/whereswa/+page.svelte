<script lang="ts">
	import InputCredentials from "../../../component/InputCredentials.svelte";
	import { parser } from "../../../globals";
    let progress: Array<string> = [];
    let puppets = "";
    let main = "";
    let content: string;
    
    async function findWA (main: string, puppets: string) {
        const puppetsList = puppets.split('\n');
        const response = await fetch(`https://www.nationstates.net/cgi-bin/api.cgi?wa=1&q=members`,
            {
                headers: {
                    'User-Agent': main
                }
            }
        );
        const text = await response.text();
        const xml = parser.parse(text);
        const members = xml.WA.MEMBERS.split(',')
        for (let i = 0; i < puppetsList.length; i++) {
            if (members.includes(puppetsList[i].toLowerCase().replace(' ', '_'))) {
                content = puppetsList[i]
            }
        }
    }
</script>

<h1 class="text-4xl mb-2">Login Sheet</h1>
<p class="mb-16">Generate links to help you quickly log back into containers.</p>

<div class="lg:w-[1024px] lg:max-w-5xl flex flex-col lg:flex-row gap-8">
    <form on:submit|preventDefault={() => findWA(main, puppets)} class="flex flex-col gap-8">
        <InputCredentials bind:main={main} bind:puppets={puppets} authenticated={false} />
        <div class="max-w-lg flex justify-center">
            <button type="submit" class="bg-green-300 rounded-md px-4 py-2 transition duration-300 hover:bg-green-500">
                Start
            </button>
        </div>
    </form>
    <pre class="flex-1 p-2 whitespace-pre-wrap bg-black dark:bg-gray-50 text-white dark:text-black font-medium font-mono inline-block">
        {#if content}
            <p>I found your WA on <a href={`https://nationstates.net/nation=${content}`}>{content}</a>.</p>
        {/if}
    </pre>
</div>