<script lang="ts">
	import { nsIterator } from '$lib/helpers/txtIterator';
	import { onMount } from 'svelte';
	import InputCredentials from '$lib/component/InputCredentials.svelte';
	import Terminal from '$lib/component/Terminal.svelte';
	import Buttons from '$lib/component/Buttons.svelte';
	import type { PageData } from './$types';
	import { pushHistory } from '$lib/helpers/utils';
	import ToolContent from '$lib/component/ToolContent.svelte';
	export let data: PageData;
	let progress = '';
	let puppets = '';
	let main = '';
	let content: string;
	let downloadable = false;
	onMount(() => { main = data.parameters.main || localStorage.getItem("main") as string || ""; });
	async function login(puppets: string) {
		pushHistory(`?main=${main}`)
		downloadable = false;
		content = (await nsIterator(puppets, 'Login Sheet', main)) as string;
		progress = `<p>Finished processing!</p>`;
		downloadable = true;
	}
</script>

<ToolContent toolTitle="Login Sheet" caption="Generate links to help you quickly log back into containers." author="Kractero" link="https://github.com/Kractero/cards-utilities/tree/main/log_into_containers" additional={`<p class="text-xs mb-16">
	For optimal use, this script is intended to be used with
	<a class="underline" href="https://github.com/Kractero/userscripts/raw/main/container-login/autologautoclose.user.js" target="_blank" rel="noreferrer noopener">
		autocloser
	</a> and
	<a class="underline" href="https://github.com/Kractero/userscripts/raw/main/container-login/autolog.user.js" target="_blank" rel="noreferrer noopener">
		autolog
	</a> which does require configuration which you can read about in the repository.
</p>`} />

<div class="lg:w-[1024px] lg:max-w-5xl flex flex-col lg:flex-row gap-8 break-normal">
	<form on:submit|preventDefault={() => login(puppets)} class="flex flex-col gap-8">
		<InputCredentials bind:main bind:puppets authenticated={false} />
		<Buttons downloadButton={true} bind:downloadable={downloadable} bind:content={content} name="Login Sheet" />
	</form>
	<Terminal bind:progress={progress} />
</div>
