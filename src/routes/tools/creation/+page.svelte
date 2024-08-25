<script lang="ts">
	import { onMount } from 'svelte'
	import { page } from '$app/stores'
	import Buttons from '$lib/components/Buttons.svelte'
	import InputCredentials from '$lib/components/InputCredentials.svelte'
	import Terminal from '$lib/components/Terminal.svelte'
	import ToolContent from '$lib/components/ToolContent.svelte'
	import { nsIterator } from '$lib/helpers/builders'
	import { pushHistory } from '$lib/helpers/navigation'
	import { checkUserAgent } from '$lib/helpers/validate'

	let progress = ''
	let content: string
	let downloadable = false
	let puppets = ''
	let main = ''
	let errors: Array<{ field: string | number; message: string }> = []

	onMount(async () => {
		main = $page.url.searchParams.get('main') || (localStorage.getItem('main') as string) || ''
	})

	async function login(puppets: string) {
		errors = checkUserAgent(main)
		if (errors.length > 0) return
		pushHistory(`?main=${main}`)
		downloadable = false
		content = (await nsIterator(puppets, 'Creator', main)) as string
		progress = '<p>Finished processing</p>'
		downloadable = true
	}
</script>

<ToolContent
	toolTitle="Creation Assistant"
	author="Kractero"
	link="https://github.com/Kractero/cards-utilities/tree/main/creation_assistant"
	caption="Generate a sheet that has links for nation creation that works with the provided userscripts."
	additional={`<p class="text-xs mb-16">
	For optimal use, this script is intended to be used with
	<a class="underline" href="https://github.com/Kractero/userscripts/raw/main/nationCreator.user.js" target="_blank" rel="noreferrer noopener">
		creator
	</a> which does require configuration which you can read about in the repository.
</p>`}
/>

<div class="flex flex-col gap-8 break-normal lg:w-[1024px] lg:max-w-5xl lg:flex-row">
	<form on:submit|preventDefault={() => login(puppets)} class="flex flex-col gap-8">
		<InputCredentials bind:errors bind:main bind:puppets authenticated={false} />
		<Buttons {downloadable} downloadButton={true} {content} name="Creator" />
	</form>
	<Terminal bind:progress />
</div>
