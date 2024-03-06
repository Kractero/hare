<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { parseXML, sleep } from '$lib/helpers/utils';
	import Buttons from '$lib/component/Buttons.svelte';
	import Terminal from '$lib/component/Terminal.svelte';
	import type { PageData } from '../trigonometry/$types';
	import { pushHistory } from '$lib/helpers/utils';
	import Textarea from '$lib/component/Textarea.svelte';
	import Input from '$lib/component/Input.svelte';
	import ToolContent from '$lib/component/ToolContent.svelte';
	export let data: PageData;
	let progress = "";
	let regions = '';
	let main = '';
    let stoppable = false;
	let stopped = false;
    const abortController = new AbortController();
	onMount(() => {
		main = data.parameters.main || localStorage.getItem("main") as string || "";
		regions = localStorage.getItem("regions") as string || "";
	});
    onDestroy(() => abortController.abort());
	async function trigonometry(main: string, regions: string) {
		pushHistory(`?main=${main}`)
		progress = '';
        stoppable = true;
		stopped = false;
        const regionsList = regions.split('\n')
        progress += `<p>Initiating Trigonometry on ${regionsList.map((region) => region.trim()).join(', ')} with 700ms interval.</p>`
        const updates: Array<{"name": string, "update": string}> = []
        const currentTime = Math.floor(Date.now()/1000)
        for (let i = 0 ; i < regionsList.length; i++) {
            if (abortController.signal.aborted || stopped) {
				break;
			}
            const xml = await parseXML(`https://${localStorage.getItem("connectionUrl") || "www"}.nationstates.net/cgi-bin/api.cgi?region=${regionsList[i]}&q=lastupdate`, main);
		    if (xml.status) progress += `<p class="text-red-400">Request for ${regionsList[i]} ${xml.status}</p>`
            else {
                if (!xml.REGION['LASTUPDATE']) {
                    progress += `<p class="text-blue-400">${regionsList[i]} is a new region.</p>`
                } else if (currentTime - Number(xml.REGION['LASTUPDATE']) < 7200) {
                    progress += `<p class="text-blue-400">${regionsList[i]} has already updated.</p>`
                } else {
                    updates.push({
                        name: regionsList[i],
                        update: xml.REGION['LASTUPDATE']
                    })
                    await sleep(600)
                }
            }
        }

        if (updates.length > 1) {
            updates.sort((a ,b) => Number(a.update) - Number(b.update))
        }

        progress += `<p>Starting scanning...</p>`
        while (updates.length > 0) {
            if (abortController.signal.aborted || stopped) {
				break;
			}
            const region = updates[0]
            progress += `<p>Waiting for ${region.name}</p>`
            const xml = await parseXML(`https://${localStorage.getItem("connectionUrl") || "www"}.nationstates.net/cgi-bin/api.cgi?region=${region.name}&q=lastupdate`, main);
            if (xml.status) {
                progress += `Request for ${xml} ${xml.status}`
                if (xml.status.includes('409')) await sleep(5000)
                updates.shift()
                continue;
            }
            if (region.update !== xml.REGION['LASTUPDATE']) {
                progress += `<p class="text-green-400">!!! - UPDATE DETECTED IN ${region.name} - !!!</p>`;
                updates.shift()
            }
            await sleep(600)
        }

        progress += `<p>Scan for ${regionsList.length} targets finished.</p>`
        stoppable = false;
	}
</script>

<ToolContent toolTitle="Trigonometry" caption="A testing trigger tool." />

<div class="lg:w-[1024px] lg:max-w-5xl flex flex-col lg:flex-row gap-8 break-normal">
	<form on:submit|preventDefault={() => trigonometry(main, regions)} class="flex flex-col gap-8">
		<Input text="User Agent" bind:bindValue={main} forValue="main" required={true} />
        <Textarea text="Regions" bind:bindValue={regions} forValue="regions" required={true} />
		<Buttons stopButton={true} bind:stopped={stopped} bind:stoppable={stoppable} />
	</form>
	<Terminal bind:progress={progress} />
</div>
