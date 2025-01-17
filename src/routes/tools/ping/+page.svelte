<script lang="ts">
	import { onDestroy, onMount } from 'svelte'
	import { page } from '$app/state'
	import Buttons from '$lib/components/Buttons.svelte'
	import InputCredentials from '$lib/components/InputCredentials.svelte'
	import Terminal from '$lib/components/Terminal.svelte'
	import ToolContent from '$lib/components/ToolContent.svelte'
	import { sleep } from '$lib/helpers/parser'
	import { checkUserAgent, pushHistory, urlParameters } from '$lib/helpers/utils'

	const abortController = new AbortController()
	let domain = ''
	let progress = $state('')
	let stoppable = $state(false)
	let stopped = $state(false)
	let puppets = $state('')
	let main = $state('')
	let password = $state('')
	let content: Array<{ url: string; tableText: string; linkStyle?: string }> = $state([])
	let restoreCount = 0
	let downloadable = $state(false)
	let errors: Array<{ field: string | number; message: string }> = $state([])

	onMount(() => {
		domain = `https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net`
		main = page.url.searchParams.get('main') || (localStorage.getItem('main') as string) || ''
		puppets = (localStorage.getItem('puppets') as string) || ''
		password = (localStorage.getItem('password') as string) || ''
	})
	onDestroy(() => abortController.abort())
	async function checkForExistence(userAgent: string, username: string, password: string) {
		let res = await fetch(`${domain}/cgi-bin/api.cgi?nation=${username}&q=ping`, {
			headers: {
				'X-Password': password,
				'User-Agent': userAgent,
			},
		})
		const existence = res.status
		const ratelimitRemaining = Number(res.headers.get('RateLimit-Remaining'))
		const ratelimitReset = Number(res.headers.get('RateLimit-Reset'))
		const retryAfter = Number(res.headers.get('Retry-After'))
		if (ratelimitRemaining > 0) {
			await sleep((ratelimitReset / ratelimitRemaining) * 1000)
		} else {
			await sleep(ratelimitReset * 1000)
		}
		if (existence === 404) return false
		if (existence === 200 || existence === 409) return true
		if (res.status === 429) {
			const waitTime = retryAfter > 0 ? retryAfter : ratelimitReset / ratelimitRemaining
			await sleep(waitTime * 1000)
			return await checkForExistence(userAgent, username, password)
		}
		return false
	}
	async function onSubmit(e: Event) {
		e.preventDefault()
		pushHistory(`?main=${main}`)
		errors = checkUserAgent(main)
		if (errors.length > 0) return
		downloadable = false
		stoppable = true
		stopped = false
		progress = ''
		content = []
		let puppetList = puppets.split('\n')
		for (let i = 0; i < puppetList.length; i++) {
			let nation = puppetList[i]
			let nationSpecificPassword = ''
			if (nation.includes(',')) {
				nation = puppetList[i].split(',')[0]
				nationSpecificPassword = puppetList[i].split(',')[1]
			}
			if (abortController.signal.aborted || stopped) {
				break
			}
			const existence = await checkForExistence(
				main,
				nation,
				nationSpecificPassword ? nationSpecificPassword : password
			)
			if (existence === false) {
				progress += `<p class="text-red-400">Failed to log into ${nation}, adding to restore sheet...</p>`
				let nation_formatted = nation.toLowerCase().replaceAll(' ', '_')
				content.push({
					url: `${domain}/container=${nation_formatted}/nation=${nation_formatted}/page=upload_flag/test=1?${urlParameters('Pinger', main)}`,
					tableText: `Link to Restore ${nation}`,
				})
				restoreCount++
			}
			if (existence === true) {
				progress += `<p>Successfully logged into ${nation}</p>`
			}
		}
		progress += `<p>Finished processing ${puppetList.length} nations, logging into ${puppetList.length - restoreCount} nations and ready to restore ${restoreCount} nations</p>`
		stoppable = false
		downloadable = true
	}
</script>

<ToolContent
	toolTitle="Pinger"
	caption="Ping your puppets to prevent ctes, or bring them back from the dead."
	additional={`<p class="text-xs mb-4">
	Password input is optional and will be disabled if the puppet list includes a comma for nation,password.
</p>
<p class="text-xs mb-16">
	To restore nations, YOU NEED CONTAINERS, as to maintain legality restores cannot be done automatically. To facilitate container-based revives,
	<a class="underline" href="https://github.com/Kractero/userscripts/raw/main/container-login/autologautoclose.user.js" target="_blank" rel="noreferrer noopener">
		autocloser
	</a> and
	<a class="underline" href="https://github.com/Kractero/userscripts/raw/main/container-login/autolog.user.js" target="_blank" rel="noreferrer noopener">
		autolog
	</a> are needed which does require configuration which you can read about in the repository.
</p>`} />

<div class="flex flex-col gap-8 break-normal lg:w-[1024px] lg:max-w-5xl lg:flex-row">
	<form onsubmit={onSubmit} class="flex flex-col gap-8">
		<InputCredentials bind:errors bind:main bind:puppets bind:password authenticated={true} />
		<Buttons
			stopButton={true}
			bind:stopped
			bind:stoppable
			downloadButton={true}
			bind:downloadable
			bind:content
			name="restore" />
	</form>
	<Terminal bind:progress />
</div>
