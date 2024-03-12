<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import Buttons from '$lib/component/Buttons.svelte';
	import Terminal from '$lib/component/Terminal.svelte';
	import ToolContent from '$lib/component/ToolContent.svelte';
	import Textarea from '$lib/component/Textarea.svelte';
	const abortController = new AbortController();
	let progress = "";
	let puppets = '';
  let content = '';
  let downloadable = false;

	onMount(() => {
		puppets = localStorage.getItem("puppets") as string || "";
	});
	onDestroy(() => abortController.abort());

	async function ping() {
    downloadable = false;
		let puppetList = puppets.split('\n');
		for (let i = 0; i < puppetList.length; i++) {
			let nation = puppetList[i].replaceAll(' ', '_').toLowerCase();
      content += `<tr>\n`
      content += `<td><p>${i}</p></td>`
      content += `<td><p><a target="_blank" href="https://${localStorage.getItem("connectionUrl") || "www"}.nationstates.net/container=${nation}/nation=${nation}">${nation}</a></p></td>\n`
      content += `<td><p><a target="_blank" href="https://${localStorage.getItem("connectionUrl") || "www"}.nationstates.net/container=${nation}/nation=${nation}/page=dilemmas/template-overall=none">issues</a></p></td>\n`
      content += `<td><p><a target="_blank" href="https://${localStorage.getItem("connectionUrl") || "www"}.nationstates.net/container=${nation}/nation=${nation}/page=deck">deck</a></p></td>\n`
      content += `<td><p><a target="_blank" href="https://${localStorage.getItem("connectionUrl") || "www"}.nationstates.net/container=${nation}/nation=${nation}/page=deck/value_deck=1">value deck</a></p></td>\n`
      content += `<td><p><a target="_blank" href="https://${localStorage.getItem("connectionUrl") || "www"}.nationstates.net/container=${nation}/nation=${nation}/page=telegrams">telegrams</a></p></td>\n`
      content += `<td><p><a target="_blank" href="https://${localStorage.getItem("connectionUrl") || "www"}.nationstates.net/container=${nation}/nation=${nation}/page=settings">settings</a></p></td>\n`
      content += `<td><p><a target="_blank" href="https://${localStorage.getItem("connectionUrl") || "www"}.nationstates.net/container=${nation}/nation=${nation}/page=tgsettings">tg settings</a></p></td>\n`
      content += `<td><p><a target="_blank" href="https://${localStorage.getItem("connectionUrl") || "www"}.nationstates.net/container=${nation}/nation=${nation}/page=create_nation/name=${nation}">create (use /w hare's creator userscripts)</a></p></td>\n`
      content += `</tr>\n`
    }
    downloadable = true;
	}
</script>

<ToolContent toolTitle="RCES Sheet Maker" originalBlurb="rewritten in JS for browser use by Kractero" author="Racoda" link="https://github.com/dithpri/RCES#puppet-links-sheet" caption="Generates a sheet of clickable links pointing to various puppets." additional={`<p class="text-xs mb-16">
	Is not as configurable as the original, but I think default config had sane defaults.
</p>`} />

<div class="lg:w-[1024px] lg:max-w-5xl flex flex-col lg:flex-row gap-8 break-normal">
	<form
		on:submit|preventDefault={async () => await ping()}
		class="flex flex-col gap-8"
	>
  <Textarea text="Puppets" bind:bindValue={puppets} forValue="pup" required />
  <Buttons downloadButton={true} bind:downloadable={downloadable} bind:content={content} type="html" name="RCES" />
	</form>
	<Terminal bind:progress={progress} />
</div>
