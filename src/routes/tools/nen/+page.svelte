<script lang="ts">
	import { preventDefault } from 'svelte/legacy';

	import { onMount } from 'svelte'
	import { page } from '$app/stores'
	import Buttons from '$lib/components/Buttons.svelte'
	import UserAgent from '$lib/components/formFields/UserAgent.svelte'
	import FormInput from '$lib/components/FormInput.svelte'
	import Terminal from '$lib/components/Terminal.svelte'
	import ToolContent from '$lib/components/ToolContent.svelte'
	import { parseXML } from '$lib/helpers/parser'
	import { checkUserAgent, pushHistory, urlParameters } from '$lib/helpers/utils'

	let domain = ''
	let progress = $state('')
	let main = $state('')
	let nennation = $state('')
	let errors: Array<{ field: string | number; message: string }> = $state([])

	onMount(() => {
		domain = `https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net`
		main = $page.url.searchParams.get('main') || (localStorage.getItem('main') as string) || ''
		nennation = $page.url.searchParams.get('nennation') || (localStorage.getItem('nenNation') as string) || ''
	})

	async function onSubmit() {
		pushHistory(`?main=${main}&nennation=${nennation}`)
		errors = checkUserAgent(main)
		if (errors.length > 0) return
		progress = ''
		const xml = await parseXML(`${domain}/cgi-bin/api.cgi?nation=${nennation}&q=endorsements+region+wa`, main)
		if (xml.NATION.UNSTATUS === 'Non-member') {
			progress += `<p class="text-red-400">${nennation} is not in the WA.</p>`
			return
		}
		progress += `<p>Searching for the nations in ${xml.NATION.REGION} not endorsing ${nennation}</p>`
		const wamems = await parseXML(`${domain}/cgi-bin/api.cgi?region=${xml.NATION.REGION}&q=wanations`, main)
		const mainEndorsers = xml.NATION.ENDORSEMENTS.split(',')
		wamems.REGION.UNNATIONS.split(',')
			.filter((member: string) => !mainEndorsers.includes(member))
			.forEach((member: string) => {
				progress += `<p><a class="underline" href="${domain}/nation=${member}?${urlParameters('nen', main)}">${member}</a> is not endorsing ${nennation}.</p>`
			})
		progress += `<p>Finished processing</p>`
	}
</script>

<ToolContent toolTitle="Not Endorsing" caption={'Specify a nation and get all the regionmates not endorsing them.'} />

<div class="flex flex-col gap-8 break-normal lg:w-[1024px] lg:max-w-5xl lg:flex-row">
	<form onsubmit={preventDefault(onSubmit)} class="flex flex-col gap-8">
		<UserAgent bind:errors bind:main />
		<FormInput label={`Nation to Check`} bind:bindValue={nennation} id="nennation" required={true} />
		<Buttons />
	</form>
	<Terminal bind:progress />
</div>
