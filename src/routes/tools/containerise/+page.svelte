<script lang="ts">
	import Buttons from '$lib/components/Buttons.svelte'
	import Puppets from '$lib/components/formFields/Puppets.svelte'
	import Terminal from '$lib/components/Terminal.svelte'
	import ToolContent from '$lib/components/ToolContent.svelte'

	let progress = $state('')
	let puppets = $state('')
	let content: Array<string> = $state([])
	let downloadable = $state(false)

	async function onSubmit(e: Event) {
		e.preventDefault()
		downloadable = false
		const puppetList = puppets.split('\n').map(nation => nation.toLowerCase().replaceAll(' ', '_'))
		const nationRules = puppetList
			.map(nation => `@^.*\\.nationstates\\.net/(.*/)?nation=${nation}(/.*)?$ , ${nation}`)
			.join('\n')
		const containerRules = puppetList
			.map(nation => `@^.*\\.nationstates\\.net/(.*/)?container=${nation}(/.*)?$ , ${nation}`)
			.join('\n')
		content = [nationRules, containerRules]
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
	<form onsubmit={onSubmit} class="flex flex-col gap-8">
		<Puppets bind:puppets />
		<Buttons {downloadable} downloadButton={true} bind:content type="txt" name="Containerise" />
	</form>
	<Terminal bind:progress />
</div>
