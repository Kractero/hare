<script lang="ts">
	import { onMount } from 'svelte'
	import { page } from '$app/state'
	import Buttons from '$lib/components/Buttons.svelte'
	import UserAgent from '$lib/components/formFields/UserAgent.svelte'
	import FormInput from '$lib/components/FormInput.svelte'
	import Terminal from '$lib/components/Terminal.svelte'
	import ToolContent from '$lib/components/ToolContent.svelte'
	import { parseXML } from '$lib/helpers/parser'
	import { checkUserAgent, pushHistory, urlParameters } from '$lib/helpers/utils'

	let domain = ''
	let progress = $state<Array<{ text: string; color?: string; link?: { href: string; label: string } }>>([])
	let main = $state('')
	let nennation = $state('')
	let errors: Array<{ field: string | number; message: string }> = $state([])

	onMount(() => {
		domain = `https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net`
		main = page.url.searchParams.get('main') || (localStorage.getItem('main') as string) || ''
		nennation = page.url.searchParams.get('nennation') || (localStorage.getItem('nenNation') as string) || ''
	})

	async function onSubmit(e: Event) {
		e.preventDefault()
		pushHistory(`?main=${main}&nennation=${nennation}`)
		errors = checkUserAgent(main)
		if (errors.length > 0) return
		progress = []
		const xml = await parseXML(`${domain}/cgi-bin/api.cgi?nation=${nennation}&q=endorsements+region+wa`, main)
		if (xml.NATION.UNSTATUS === 'Non-member') {
			progress = [...progress, { text: `${nennation} is not in the WA.`, color: 'red' }]
			return
		}
		progress = [...progress, { text: `Searching for the nations in ${xml.NATION.REGION} not endorsing ${nennation}` }]
		const wamems = await parseXML(`${domain}/cgi-bin/api.cgi?region=${xml.NATION.REGION}&q=wanations`, main)
		const mainEndorsers = xml.NATION.ENDORSEMENTS.split(',')
		wamems.REGION.UNNATIONS.split(',')
			.filter((member: string) => !mainEndorsers.includes(member))
			.forEach((member: string) => {
				progress = [
					...progress,
					{
						text: '',
						link: {
							href: `${domain}/nation=${member}?${urlParameters('nen', main)}`,
							label: `${member} is not endorsing ${nennation}`,
						},
					},
				]
			})
		progress = [...progress, { text: 'Finished processing' }]
	}
</script>

<ToolContent
	toolTitle="Not Endorsing"
	icon="🚓"
	caption={'Specify a nation and get all the regionmates not endorsing them.'} />

<div class="flex flex-col gap-8 break-normal lg:w-[1024px] lg:max-w-5xl lg:flex-row">
	<form onsubmit={onSubmit} class="flex flex-col gap-8">
		<UserAgent bind:errors bind:main />
		<FormInput label={`Nation to Check`} bind:bindValue={nennation} id="nennation" required={true} />
		<Buttons />
	</form>
	<Terminal bind:progress />
</div>
