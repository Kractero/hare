<script lang="ts">
	import { onMount } from 'svelte';
	import InputCredentials from '$lib/component/InputCredentials.svelte';
	import { parseXML, sleep } from '$lib/helpers/utils';
	import Buttons from '$lib/component/Buttons.svelte';
	import Terminal from '$lib/component/Terminal.svelte';
	import { pushHistory } from '$lib/helpers/utils';
	import ToolContent from '$lib/component/ToolContent.svelte';
	import { page } from '$app/stores';

	let progress = "";
	let puppets = '';
	let main = '';
	let stoppable = false;
	onMount(() => {
		main = $page.url.searchParams.get('main') || localStorage.getItem("main") as string || "";
		puppets = localStorage.getItem("puppets") as string || "";
	});
	async function findWA(main: string, puppets: string) {
		pushHistory(`?main=${main}`)
		progress = '';
		stoppable = true;
		const puppetsList = puppets.split('\n');
		const xml = await parseXML(`https://${localStorage.getItem("connectionUrl") || "www"}.nationstates.net/cgi-bin/api.cgi?wa=1&q=members`, main);
		const members = xml.WA.MEMBERS.split(',');
		puppetsList.forEach(puppet => {
			if (members.includes(puppet.toLowerCase().replace(' ', '_'))) {
				progress = `<p>I found your WA on <a href="https://${localStorage.getItem("connectionUrl") || "www"}.nationstates.net/nation=${puppet}User_agent=${main}/Script=Whereswa/Generated_by=Whereswa/Author_discord=scrambleds/Author_main_nation=Kractero/">${puppet}</a>.</p>`;
			}
		})
		stoppable = false;
	}
</script>

<ToolContent toolTitle="Where's My WA" caption="Specify your puppets and this script will find which one is in the WA." author="9003" link="https://github.com/jmikk/WheresMyWA" originalBlurb="rewritten in JS for browser use by Kractero" />

<div class="lg:w-[1024px] lg:max-w-5xl flex flex-col lg:flex-row gap-8 break-normal">
	<form on:submit|preventDefault={() => findWA(main, puppets)} class="flex flex-col gap-8">
		<InputCredentials bind:main bind:puppets authenticated={false} />
		<Buttons bind:stoppable={stoppable} />
	</form>
	<Terminal bind:progress={progress} />
</div>
