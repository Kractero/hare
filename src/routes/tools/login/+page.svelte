<script lang="ts">
	import { preventDefault } from 'svelte/legacy';

	import { onMount } from 'svelte'
	import { page } from '$app/stores'
	import Buttons from '$lib/components/Buttons.svelte'
	import FormSelect from '$lib/components/FormSelect.svelte'
	import InputCredentials from '$lib/components/InputCredentials.svelte'
	import Terminal from '$lib/components/Terminal.svelte'
	import ToolContent from '$lib/components/ToolContent.svelte'
	import { nsIterator } from '$lib/helpers/builders'
	import { checkUserAgent, pushHistory } from '$lib/helpers/utils'

	let progress = $state('')
	let puppets = $state('')
	let main = $state('')
	let content: string = $state()
	let downloadable = $state(false)
	let errors: Array<{ field: string | number; message: string }> = $state([])
	let mode = $state('UploadFlag')
	onMount(() => {
		main = $page.url.searchParams.get('main') || (localStorage.getItem('main') as string) || ''
		mode = $page.url.searchParams.get('mode') || (localStorage.getItem('loginSheetMode') as string) || 'UploadFlag'
	})
	async function onSubmit() {
		pushHistory(`?main=${main}&mode=${mode}`)
		errors = checkUserAgent(main)
		if (errors.length > 0) return
		downloadable = false
		content = (await nsIterator(puppets, 'Login Sheet', main, mode)) as string
		progress = `<p>Finished processing!</p>`
		downloadable = true
	}
</script>

<ToolContent
	toolTitle="Login Sheet"
	caption="Generate links to help you quickly log back into containers."
	author="Kractero"
	link="https://github.com/Kractero/cards-utilities/tree/main/log_into_containers"
	additional={`<p class="text-xs mb-16">
	For optimal use, this script is intended to be used with
	<a class="underline" href="https://github.com/Kractero/userscripts/raw/main/container-login/autologautoclose.user.js" target="_blank" rel="noreferrer noopener">
		autocloser (upload flag)
	</a> or
	<a class="underline" href="https://github.com/Kractero/userscripts/raw/main/container-login/autologautoclose_v2.user.js" target="_blank" rel="noreferrer noopener">
		autocloser (submit issue)
	</a>
	and
	<a class="underline" href="https://github.com/Kractero/userscripts/raw/main/container-login/autolog.user.js" target="_blank" rel="noreferrer noopener">
		autolog
	</a> which does require configuration which you can read about in the repository.
</p>`} />

<div class="flex flex-col gap-8 break-normal lg:w-[1024px] lg:max-w-5xl lg:flex-row">
	<form onsubmit={preventDefault(onSubmit)} class="flex flex-col gap-8">
		<InputCredentials bind:errors bind:main bind:puppets authenticated={false} />
		<FormSelect
			subTitle="(Which page to have login sheet fill on)"
			id="mode"
			label="Mode"
			bind:bindValue={mode}
			items={['UploadFlag', 'SubmitIssue']} />
		<Buttons downloadButton={true} bind:downloadable bind:content name="Login Sheet" />
	</form>
	<Terminal bind:progress />
</div>
