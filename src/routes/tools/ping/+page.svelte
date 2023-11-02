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

	onMount(() => {
		main = data.parameters.main || localStorage.getItem("main") as string || "";
		puppets = localStorage.getItem("puppets") as string || "";
		password = localStorage.getItem("password") as string || "";
	});
	onDestroy(() => abortController.abort());
	async function checkForExistence(userAgent: string, username: string, password: string) {
		const res = await fetch(`https://www.nationstates.net/cgi-bin/api.cgi?nation=${username}&q=ping`,
			{
				headers: {
					'X-Password': password,
					'User-Agent': userAgent
				}
			})
		const existence = res.status
		if (existence === 404) return false
		if (existence === 200 || existence === 409) return true
		return false
	}
	async function ping(main: string, puppets: string, password: string) {
		pushHistory(`?main=${main}`)
		stoppable = true;
		stopped = false;
		progress = '';
		let puppetsList = puppets.split('\n');
		for (let i = 0; i < puppetsList.length; i++) {
			await sleep(700);
			let nation = puppetsList[i];
			if (abortController.signal.aborted || stopped) {
				break;
			}
			const existence = await checkForExistence(main, nation, password);
			if (existence === false) {
				progress += `<p class="text-red-400">Failed to log into ${nation}, attemping to restore...</p>`;
				await sleep (6000)
				const iframe = document.getElementById("iframe")! as HTMLIFrameElement;
				const loadHandler = new Promise<void>((resolve) => {
					async function loadHandler(this: any) {
						iframe.removeEventListener("load", loadHandler);
						const iframeContents = iframe.contentWindow?.document! as any;
						if (iframeContents) {
							iframeContents.getElementById("restoreUserAgent").value = main;
							iframeContents.getElementById("restoreLoggingIn").value = "1";
							iframeContents.getElementById("restoreNation").value = nation;
							iframeContents.getElementById("restoreRestoreNation").value = `Restore ${nation}`;
							iframeContents.getElementById("restoreRestorePassword").value = password;
							iframeContents.getElementById("restoreSubmit").click();
						}
						resolve();
					}
					iframe.addEventListener("load", loadHandler);
				});
				iframe.src = "/iframe.html";
				await loadHandler;
				await sleep(700)
				const existence = await checkForExistence(main, nation, password);
				if (existence === false) {
					progress += `<p class="text-red-400">Are you sure ${nation} is a nation or you provided the right credentials? Skipping...</p>`
				}
				if (existence === true) {
					progress += `<p>Successfully restored ${nation}</p>`;
				}
			}
			if (existence === true) {
				progress += `<p>Successfully logged into ${nation}</p>`;
			}
		}
		stoppable = false;
	}
</script>

<ToolContent toolTitle="Pinger" caption="Ping your puppets to prevent ctes, or bring them back from the dead." />

<div class="lg:w-[1024px] lg:max-w-5xl flex flex-col lg:flex-row gap-8 break-normal">
	<form
		on:submit|preventDefault={async () => await ping(main, puppets, password)}
		class="flex flex-col gap-8"
	>
		<InputCredentials bind:main bind:puppets bind:password authenticated={true} />
		<Buttons stopButton={true} bind:stopped={stopped} bind:stoppable={stoppable} />
	</form>
	<Terminal bind:progress={progress} />
</div>

<iframe
	id="iframe"
	style="position: absolute; left: -5000px;"
	src="/iframe.html"
	title="iFrame for logging/restoring nations"
/>