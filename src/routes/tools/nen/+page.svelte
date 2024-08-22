<script lang="ts">
	import { onMount } from 'svelte'
	import { page } from '$app/stores'
	import Input from '$lib/component/Input.svelte'
	import Buttons from '$lib/components/Buttons.svelte'
	import UserAgent from '$lib/components/formFields/UserAgent.svelte'
	import FormInput from '$lib/components/FormInput.svelte'
	import Terminal from '$lib/components/Terminal.svelte'
	import ToolContent from '$lib/components/ToolContent.svelte'
	import { pushHistory } from '$lib/helpers/navigation'
	import { parseXML } from '$lib/helpers/parser'
	import { checkUserAgent } from '$lib/helpers/validate'

	let progress = ''
	let main = ''
	let nennation = ''
	let errors: Array<{ field: string | number; message: string }> = []

	onMount(() => {
		main = $page.url.searchParams.get('main') || (localStorage.getItem('main') as string) || ''
		nennation =
			$page.url.searchParams.get('nennation') || (localStorage.getItem('nenNation') as string) || ''
	})

	async function nen() {
		pushHistory(`?main=${main}&nennation=${nennation}`)
		errors = checkUserAgent(main)
		if (errors.length > 0) return
		progress = ''
		const xml = await parseXML(
			`https://${
				localStorage.getItem('connectionUrl') || 'www'
			}.nationstates.net/cgi-bin/api.cgi?nation=${nennation}&q=endorsements+region+wa`,
			main
		)
		if (xml.NATION.UNSTATUS === 'Non-member') {
			progress += `<p class="text-red-400">${nennation} is not in the WA.</p>`
			return
		}
		progress += `<p">Searching for the nations in ${xml.NATION.REGION} not endorsing ${nennation}</p>`
		const wamems = await parseXML(
			`https://${
				localStorage.getItem('connectionUrl') || 'www'
			}.nationstates.net/cgi-bin/api.cgi?region=${xml.NATION.REGION}&q=wanations`,
			main
		)
		const mainEndorsers = xml.NATION.ENDORSEMENTS.split(',')
		wamems.REGION.UNNATIONS.split(',')
			.filter(
				(member: string) =>
					!mainEndorsers.includes(member) && member !== nennation.toLowerCase().replace(' ', '_')
			)
			.forEach((member: string) => {
				progress += `<p><a class="underline" href="https://${
					localStorage.getItem('connectionUrl') || 'www'
				}.nationstates.net/nation=${member}/User_agent=${main}/Script=Nen/Generated_by=Nen/Author_discord=scrambleds/Author_main_nation=Kractero/">${member}</a> is not endorsing ${nennation}.</p>`
			})
		progress += `<p>Finished processing</p>`
	}
</script>

<ToolContent
	toolTitle="Not Endorsing"
	caption={'Specify a nation and get all the regionmates not endorsing them.'}
/>

<div class="flex flex-col gap-8 break-normal lg:w-[1024px] lg:max-w-5xl lg:flex-row">
	<form on:submit|preventDefault={() => nen()} class="flex flex-col gap-8">
		<UserAgent bind:errors bind:main />
		<FormInput
			label={`Nation to Check`}
			bind:bindValue={nennation}
			id="nennation"
			required={true}
		/>
		<Buttons />
	</form>
	<Terminal bind:progress />
</div>
