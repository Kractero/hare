<script lang="ts">
	import Buttons from '$lib/components/Buttons.svelte'
	import Puppets from '$lib/components/formFields/Puppets.svelte'
	import Terminal from '$lib/components/Terminal.svelte'
	import ToolContent from '$lib/components/ToolContent.svelte'
	import { nsIterator } from '$lib/helpers/builders'

	let progress = ''
	let puppets = ''
	let content: Array<string>
	let downloadable = false

	async function onSubmit() {
		downloadable = false
		content = (await nsIterator(puppets, 'Containerise')) as Array<string>
		progress = `<p>Finished processing</p>`
		progress += `<p>NATION RULES</p>`
		progress += content[0]
		progress += `<p>CONTAINER RULES</p>`
		progress += content[1]
		downloadable = true
	}
</script>

<ToolContent toolTitle="Containerise" caption="Generate containerise rules" />

<div class="flex flex-col gap-8 break-normal lg:w-[1024px] lg:max-w-5xl lg:flex-row">
	<form on:submit|preventDefault={onSubmit} class="flex flex-col gap-8">
		<Puppets bind:puppets />
		<Buttons {downloadable} downloadButton={true} {content} type="txt" name="Containerise" />
	</form>
	<Terminal bind:progress />
</div>
