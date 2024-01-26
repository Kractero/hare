<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import InputCredentials from '$lib/component/InputCredentials.svelte';
	import { sleep } from '$lib/helpers/utils';
	import Buttons from '$lib/component/Buttons.svelte';
	import Terminal from '$lib/component/Terminal.svelte';
	import type { PageData } from './$types';
	import { pushHistory } from '$lib/helpers/utils';
	import ToolContent from '$lib/component/ToolContent.svelte';
	export let data: PageData;
	const abortController = new AbortController();
	let progress = "";
	let stoppable = false;
	let stopped = false;
	let puppets = '';
	let main = '';
	let password = '';
	let content = '';
	let restoreCount = 0;
	let downloadable = false;

	onMount(() => {
		main = data.parameters.main || localStorage.getItem("main") as string || "";
		puppets = localStorage.getItem("puppets") as string || "";
		password = localStorage.getItem("password") as string || "";
	});
	onDestroy(() => abortController.abort());
	async function checkForExistence(userAgent: string, username: string, password: string) {
		let res = await fetch(`https://www.nationstates.net/cgi-bin/api.cgi?nation=${username}&q=ping`,
			{
				headers: {
					'X-Password': password,
					'User-Agent': userAgent
				}
			})
		const existence = res.status
		if (existence === 404) return false
		if (existence === 200 || existence === 409) return true
		while (existence === 409) {
			stoppable = true
			await sleep(Number(res.headers.get('retry-after')) * 1000)
			await checkForExistence(userAgent, username, password)
		}
		return false
	}
	async function ping() {
		pushHistory(`?main=${main}`)
		downloadable = false;
		stoppable = true;
		stopped = false;
		progress = '';
		let puppetList = puppets.split('\n');
		for (let i = 0; i < puppetList.length; i++) {
			await sleep(700);
			let nation = puppetList[i];
			let nationSpecificPassword = "";
			if (nation.includes(',')) {
				nation = puppetList[i].split(',')[0];
				nationSpecificPassword = puppetList[i].split(',')[1];
			}
			if (abortController.signal.aborted || stopped) {
				break;
			}
			const existence = await checkForExistence(main, nation, nationSpecificPassword ? nationSpecificPassword : password);
			if (existence === false) {
				progress += `<p class="text-red-400">Failed to log into ${nation}, adding to restore sheet...</p>`;
				let nation_formatted = nation.toLowerCase().replaceAll(' ', '_')
				content +=`<tr><td><p>${restoreCount + 1}</p></td><td><p><a target="_blank" href="https://www.nationstates.net/container=${nation_formatted}/nation=${nation_formatted}/page=upload_flag/test=1/User_agent=${main}">Link to Restore ${nation}</a></p></td></tr>`;
				restoreCount++;
				await sleep(700)
			}
			if (existence === true) {
				progress += `<p>Successfully logged into ${nation}</p>`;
			}
		}
		progress += `<p>Finished processing ${puppetList.length} nations, logging into ${puppetList.length - restoreCount} nations and ready to restore ${restoreCount} nations</p>`;
		stoppable = false;
		downloadable = true;
	}
</script>

<ToolContent toolTitle="Pinger" caption="Ping your puppets to prevent ctes, or bring them back from the dead." additional={`<p class="text-xs mb-4">
	Password input is optional and will be disabled if the puppet list includes a comma for nation,password.
</p>
<p class="text-xs mb-16">
	To restore nations, YOU NEED CONTAINERS, as to maintain legality restores cannot be done automatically. It isn't in Hare's interest to pause its execution to wait for user prompt like Auralia's tool does. If you would like to use
	<a class="underline" href="https://auralia.github.io/nslogin-web/build/" target="_blank" rel="noreferrer noopener">Auralia's tool</a> instead, click the link.
	To facilitate container-based revives, <a class="underline" href="https://github.com/Kractero/cards-utilities/raw/main/log_into_containers/autologautoclose.user.js" target="_blank" rel="noreferrer noopener">
		autocloser
	</a> and
	<a class="underline" href="https://github.com/Kractero/cards-utilities/blob/main/log_into_containers/autolog.user.js" target="_blank" rel="noreferrer noopener">
		autolog
	</a> are needed which does require configuration which you can read about in the repository.
</p>`} />

<div class="lg:w-[1024px] lg:max-w-5xl flex flex-col lg:flex-row gap-8 break-normal">
	<form
		on:submit|preventDefault={async () => await ping()}
		class="flex flex-col gap-8"
	>
		<InputCredentials bind:main bind:puppets bind:password authenticated={true} />
		<Buttons stopButton={true} bind:stopped={stopped} bind:stoppable={stoppable} downloadButton={true} bind:downloadable={downloadable} bind:content={content} name="restore" />
	</form>
	<Terminal bind:progress={progress} />
</div>