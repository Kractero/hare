<script lang="ts">
	import { onMount } from 'svelte';
	import { parseXML, sleep } from '$lib/helpers/utils';
	import Buttons from '$lib/component/Buttons.svelte';
	import Input from '$lib/component/Input.svelte';
	import Terminal from '$lib/component/Terminal.svelte';
	import { pushHistory } from '$lib/helpers/utils';
	import ToolContent from '$lib/component/ToolContent.svelte';
	import { page } from '$app/stores';

	let progress = '';
	let main = '';
	let nennation = '';

	onMount(() => {
		main = $page.url.searchParams.get('main') || (localStorage.getItem('main') as string) || '';
		nennation = $page.url.searchParams.get('nennation') || (localStorage.getItem('nenNation') as string) || '';
	});

	async function nen() {
		pushHistory(`?main=${main}&nennation=${nennation}`);
		progress = '';
		const xml = await parseXML(
			`https://${
				localStorage.getItem('connectionUrl') || 'www'
			}.nationstates.net/cgi-bin/api.cgi?nation=${nennation}&q=endorsements+region+wa`,
			main
		);
		if (xml.NATION.UNSTATUS === 'Non-member') {
			progress += `<p class="text-red-400">${nennation} is not in the WA.</p>`;
			return;
		}
		await sleep(600);
		progress += `<p">Searching for the nations in ${xml.NATION.REGION} not endorsing ${nennation}</p>`;
		const wamems = await parseXML(
			`https://${
				localStorage.getItem('connectionUrl') || 'www'
			}.nationstates.net/cgi-bin/api.cgi?region=${xml.NATION.REGION}&q=wanations`,
			main
		);
		const mainEndorsers = xml.NATION.ENDORSEMENTS.split(',');
		wamems.REGION.UNNATIONS.split(',')
			.filter(
				(member: string) =>
					!mainEndorsers.includes(member) && member !== nennation.toLowerCase().replace(' ', '_')
			)
			.forEach((member: string) => {
				progress += `<p><a class="underline" href="https://${
					localStorage.getItem('connectionUrl') || 'www'
				}.nationstates.net/nation=${member}/User_agent=${main}/Script=Nen/Generated_by=Nen/Author_discord=scrambleds/Author_main_nation=Kractero/">${member}</a> is not endorsing ${nennation}.</p>`;
			});
		progress += `<p>Finished processing</p>`;
	}
</script>

<ToolContent
	toolTitle="Not Endorsing"
	caption={'Specify a nation and get all the regionmates not endorsing them.'}
/>

<div class="lg:w-[1024px] lg:max-w-5xl flex flex-col lg:flex-row gap-8 break-normal">
	<form on:submit|preventDefault={() => nen()} class="flex flex-col gap-8">
		<Input text={`User Agent`} bind:bindValue={main} forValue="main" required={true} />
		<Input
			text={`Nation to Check`}
			bind:bindValue={nennation}
			forValue="nennation"
			required={true}
		/>
		<Buttons />
	</form>
	<Terminal bind:progress />
</div>
