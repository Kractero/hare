<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import type { NSNation, Region } from '$lib/types';
	import { parseXML, parser } from '$lib/helpers/utils';
	import ToolContent from '$lib/component/ToolContent.svelte';

	export let data: PageData;
    let source: string;
	let main: string;
	let immune: string;
    let upperlim: string;
	let limit: string;
    let wanations: Array<string> | [string, number][] = [];
    let whiteList: Array<string> = [];
    let waEndos: {[key:string]: Array<string>} = {};
	onMount( async () => {
		main = data.parameters.main || localStorage.getItem("main") as string || "";
		immune = data.parameters.immune && data.parameters.immune.replaceAll(',', '\n') || "";
        whiteList = immune ? immune.split('\n').map(nation => nation.toLowerCase().replace(' ', '_')) : [];
        upperlim = data.parameters.upperlim || "0";
		limit = data.parameters.limit  || "0";
 		source = data.parameters.source || localStorage.getItem("endotartSource") as string || "XML";
        const wamems: Region = await parseXML(`https://www.nationstates.net/cgi-bin/api.cgi?region=${data.region}&q=wanations`, main)
        wanations = wamems.REGION.UNNATIONS.split(',')
        const currentDate = new Date();
        const utcMinus7Date = new Date(currentDate.getTime() - 7 * 60 * 60 * 1000);
        utcMinus7Date.setDate(utcMinus7Date.getDate() - 1);
        const date = utcMinus7Date.toISOString().slice(0, 10);
        const nationRes = await fetch(`https://raw.githubusercontent.com/Kractero/region-dump-xml/main/data/${date}-Nations.xml`, {
            method: "GET"
        });
        const regionText = await nationRes.text()
        let xml = parser.parse(regionText)
        let wanationsobj: {[key: string]: number} = {} 
        wanations.forEach(nation => {
            wanationsobj[nation] = 0
        })
        wanations.forEach(nation => waEndos[nation] = [])
        whiteList.forEach(nationa => {
            let immune_endos: string | string[] = (xml.NATIONS.NATION as Array<NSNation>).find(nation => String(nation.NAME).toLowerCase().replace(/ /g, '_') === (nationa.toLowerCase()))?.ENDORSEMENTS!;
            immune_endos = immune_endos ? String(immune_endos).split(',') : immune_endos
            for (let i = 0; i < wanations.length; i++) {
                let endocheckNation: string = wanations[i] as string
                let { ENDORSEMENTS } = (xml.NATIONS.NATION as Array<NSNation>).find(nation => String(nation.NAME).toLowerCase().replace(/ /g, '_') === (endocheckNation.toLowerCase()))!;
                wanationsobj[endocheckNation] = ENDORSEMENTS ? Array.isArray(String(ENDORSEMENTS).split(',')) ? String(ENDORSEMENTS).split(',').length : 1 : 0
                if (Array.isArray(immune_endos)) {
                    if (immune_endos.includes(endocheckNation)) waEndos[endocheckNation].push("Y")
                    else if (endocheckNation.toLowerCase() === nationa) waEndos[endocheckNation].push('S')
                    else waEndos[endocheckNation].push('N')
                } else {
                    if (immune_endos === endocheckNation) waEndos[endocheckNation].push('Y')
                    else if (immune_endos === endocheckNation) waEndos[endocheckNation].push('S')
                    else waEndos[endocheckNation].push('N')
                }
            }
        })
        let wanationsArray = Object.entries(wanationsobj);
        wanations = wanationsArray.sort((a, b) => b[1] - a[1]);
	});
    let regionName = data.region.split('_').map(word => word[0].toUpperCase() + word.slice(1)).join(' ')
</script>

<ToolContent toolTitle={regionName} caption={`${regionName} Endorsement Board`} />

<div class="lg:w-[1024px] lg:max-w-5xl flex flex-col lg:flex-row gap-8 break-normal">
	<table class="w-full border-collapse table-auto caption-bottom text-left whitespace-normal">
        <th class={`h-12 p-2 md:p-4 font-semibold`}>Name</th>
    {#each whiteList as header}
        <th class={`h-12 p-2 md:p-4 font-semibold`}>{header}</th>
    {/each}
    <th class={`h-12 p-2 md:p-4 font-semibold`}>Endos</th>
    {#each wanations as nation}
        {#if nation.length === 2}
        <tr class="text-center">
            <td>{nation[0]}</td>
            {#if waEndos[nation[0]]}
            {#each waEndos[nation[0]] as status}
            {#if status === "Y"}
            <td>&#9989</td>
            {:else if status === "S"}
            <td>Same</td>
            {:else}
            <td>&#10060</td>
            {/if}
        {/each}
            {/if}
            <td class={`${whiteList.includes(nation[0]) ? Number(upperlim) > Number(nation[1]) ? "text-fuchsia-400" : "text-red-400" : Number(limit) > Number(nation[1]) ? "text-fuchsia-400" : "text-red-400"}`}>{nation[1]}</td>
        </tr>
        {/if}
    {/each}
    </table>
</div>