<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import Buttons from '$lib/component/Buttons.svelte';
	import Terminal from '$lib/component/Terminal.svelte';
	import ToolContent from '$lib/component/ToolContent.svelte';
	import Input from '$lib/component/Input.svelte';
	import { parseXML, pushHistory } from '$lib/helpers/utils';
	import { page } from '$app/stores';

	const abortController = new AbortController();
	let progress = "";
	let main = '';

	onMount(() => {
		main = $page.url.searchParams.get('main') || localStorage.getItem("main") as string || "";
  })

	onDestroy(() => abortController.abort());

	async function detector() {
    pushHistory(`?main=${main}`);
    progress = "";
    const fetcha = await fetch("https://docs.google.com/spreadsheets/d/1MZ-4GLWAZDgB1TDvwtssEcVKHKunOKi3l90Jof1pBB4/export?format=tsv&id=1MZ-4GLWAZDgB1TDvwtssEcVKHKunOKi3l90Jof1pBB4&gid=733627866")
    const text = await fetcha.text()
    let masterList: {[key: string]: string} = {}
    text.split('\n').forEach(puppetLine => {
      const puppSplit = puppetLine.split('\t')
      masterList[puppSplit[0].toLowerCase().replaceAll(' ', '_')] = puppSplit[1]
    });
    const ownerList: {[key: string]: string} = {}
    const currActives = await parseXML(`https://${localStorage.getItem("connectionUrl") || "www"}.nationstates.net/cgi-bin/api.cgi?q=happenings;filter=law;limit=200`, main)
    currActives.WORLD.HAPPENINGS.EVENT.forEach((event: { TEXT: string; }) => {
      const regex = /@@([\w]+)@@/
      if (event.TEXT) {
        const nation = event.TEXT.match(regex)
        if (nation && nation.length > 1 && nation[1]) {
          if (masterList.hasOwnProperty(nation[1])) {
            if (!ownerList[masterList[nation[1]]]) {
              ownerList[masterList[nation[1]]] = `${nation[1]}`
            } else {
              ownerList[masterList[nation[1]]] += `, ${nation[1]}`
            }
          }
        }
      }
    })
    if (Object.keys(ownerList).length === 0) {
      progress += `<p>It seems nobody is farming at the moment...</p>`
    } else {
      Object.keys(ownerList).forEach(owner => {
        progress += `<p><a class="underline" target="_blank" rel="noreferrer noopener"
            href="https://nationstates.net/nation=${owner}/User_agent=${main}/Script=Whosfarmin/Generated_by=Whosfarmin/Author_discord=scrambleds/Author_main_nation=Kractero/">${owner}</a> is currently farming!</p>\n`
      });
    }
	}
</script>

<ToolContent toolTitle="Farm Detector" caption="Detect whose farming at the moment from the last 200 world issue happenings." additional={`<p class="text-xs mb-16">
	Puppets are linked to their owners via <a class="underline" target="_blank" rel="noreferrer noopener" href="https://docs.google.com/spreadsheets/d/1MZ-4GLWAZDgB1TDvwtssEcVKHKunOKi3l90Jof1pBB4/">9003's sheet</a>, submit
  yours <a target="_blank" rel="noreferrer noopener" class="underline" href="https://docs.google.com/forms/d/16t4mlYuSU5p0U9hVkvzKMqP1GRnpdDV7nLNLA9WdFTs/viewform">here</a>
</p>`} />

<div class="lg:w-[1024px] lg:max-w-5xl flex flex-col lg:flex-row gap-8 break-normal">
	<form
		on:submit|preventDefault={async () => await detector()}
		class="flex flex-col gap-8"
	>
  <Input text={`User Agent`} bind:bindValue={main} forValue="main" required={true} />
  <Buttons />
	</form>
	<Terminal bind:progress={progress} />
</div>