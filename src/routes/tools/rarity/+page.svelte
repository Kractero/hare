<script lang="ts">
	import { onMount } from 'svelte'
	import { page } from '$app/state'
	import Buttons from '$lib/components/Buttons.svelte'
	import FormCheckbox from '$lib/components/FormCheckbox.svelte'
	import UserAgent from '$lib/components/formFields/UserAgent.svelte'
	import FormInput from '$lib/components/FormInput.svelte'
	import Terminal from '$lib/components/Terminal.svelte'
	import ToolContent from '$lib/components/ToolContent.svelte'
	import { parseXML } from '$lib/helpers/parser'
	import { checkUserAgent, pushHistory } from '$lib/helpers/utils'

	let domain = ''
	let progress = $state<Array<{ text: string; color?: string; link?: { href: string; label: string } }>>([])
	let main = $state('')
	let calc = $state('')
	let governor = $state(false)
	let founder = $state(false)
	let retiredmod = $state(false)
	let staff = $state(false)
	let ia = $state(0)
	let gaResAuthoredVal = $state(0)
	let scResAuthoredVal = $state(0)
	let unResAuthoredVal = $state(0)
	let egg = $state(0)
	let errors: Array<{ field: string | number; message: string }> = $state([])

	onMount(() => {
		domain = `https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net`
		main = page.url.searchParams.get('main') || (localStorage.getItem('main') as string) || ''
		calc = page.url.searchParams.get('calc') || ''
		governor = page.url.searchParams.get('gov') === 'true' ? true : false
		founder = page.url.searchParams.get('found') === 'true' ? true : false
		staff = page.url.searchParams.get('staff') === 'true' ? true : false
		retiredmod = page.url.searchParams.get('retired') === 'true' ? true : false
		ia = Number(page.url.searchParams.get('ia')) || 0
		gaResAuthoredVal = Number(page.url.searchParams.get('ga')) || 0
		scResAuthoredVal = Number(page.url.searchParams.get('sc')) || 0
		unResAuthoredVal = Number(page.url.searchParams.get('un')) || 0
		egg = Number(page.url.searchParams.get('egg')) || 0
	})

	async function onSubmit(e: Event) {
		e.preventDefault()
		pushHistory(
			`?main=${main}&calc=${calc}&gov=${governor}&found=${founder}&staff=${staff}&retired=${retiredmod}&ia=${ia}&ga=${gaResAuthoredVal}&sc=${scResAuthoredVal}&un=${unResAuthoredVal}&egg=${egg}`
		)
		errors = checkUserAgent(main)
		if (errors.length > 0) return
		const nationApiResponse = await parseXML(
			`${domain}/cgi-bin/api.cgi?nation=${calc}&q=wabadges+wa+census;scale=all;mode=rank+prank`,
			main
		)

		let wf = 0
		let g = 0
		let o = 0
		let gr = 0
		let waEnd = 0
		let iaEnd = 0
		const isWAMember = nationApiResponse.NATION.UNSTATUS.includes('WA')
		const isWADelegate = nationApiResponse.NATION.UNSTATUS.includes('Delegate')
		const cc = Array.isArray(nationApiResponse.NATION.WABADGES.WABADGE)
			? nationApiResponse.NATION.WABADGES.WABADGE.length
			: nationApiResponse.NATION.WABADGES.WABADGE
				? 1
				: 0

		// remove z-day trash
		const ranks: CensusRank[] = nationApiResponse.NATION.CENSUS.SCALE.filter(
			(scale: { '@_id': string }) => !['81', '82', '83', '84'].includes(scale['@_id'])
		)

		interface CensusRank {
			RANK: number
			PRANK: number
			'@_id': string
		}
		ranks.forEach(scale => {
			if (scale['@_id'] === '66') waEnd = scale.RANK
			if (scale['@_id'] === '86') iaEnd = scale.RANK
			if (scale.RANK === 1) wf++

			if (scale.PRANK <= 1) g++
			else if (scale.PRANK <= 5) o++
			else if (scale.PRANK <= 10) gr++
		})

		const valWorldFirst = wf * 6
		const valGold = g * 1.4
		const valOrange = o * 0.2
		const valGreen = gr * 0.02

		function computeWaIaVal(rank: number, factor: number) {
			if (!rank) return 0
			return Math.sqrt((1 / (factor * (rank + 60) ** 2)) * (rank + 60 + 10000))
		}
		const valWaEnd = computeWaIaVal(waEnd, 0.001)
		const valIaEnd = computeWaIaVal(iaEnd, 0.01)

		const valWaMember = isWAMember ? 0.1 : 0
		const valWaDelegate = isWADelegate ? 8 : 0
		const valFounder = founder ? 4 : 0
		const valGovernor = governor ? 4 : 0

		const valEasterEggs = 1.25 * Math.sqrt(egg)
		const valIssuesAuth = 2 * Math.sqrt(ia * 40)
		const valGaAuth = 2 * Math.sqrt(gaResAuthoredVal * 15)
		const valScAuth = 2 * Math.sqrt(scResAuthoredVal * 15)
		const valUnAuth = 2 * Math.sqrt(unResAuthoredVal * 15)
		const valCcCount = 2 * Math.sqrt(cc * 120)

		const valGameMod = staff ? 50 : 0
		const valRetiredMod = retiredmod ? 50 : 0

		const total = [
			valWorldFirst,
			valGold,
			valOrange,
			valGreen,
			valWaEnd,
			valIaEnd,
			valWaMember,
			valWaDelegate,
			valFounder,
			valGovernor,
			valEasterEggs,
			valIssuesAuth,
			valGaAuth,
			valScAuth,
			valUnAuth,
			valCcCount,
			valGameMod,
			valRetiredMod,
		].reduce((acc, v) => acc + v, 0)

		const tiers = [
			{
				name: 'Common',
				max: 4,
			},
			{
				name: 'Uncommon',
				max: 9,
			},
			{
				name: 'Rare',
				max: 18,
			},
			{
				name: 'Ultra Rare',
				max: 36,
			},
			{
				name: 'Epic',
				max: 64,
			},
			{
				name: 'Legendary',
				max: Infinity,
			},
		]

		let rarity = ''
		let nextRarity = ''
		let nextScore = 0

		for (let i = 0; i < tiers.length; i++) {
			if (total < tiers[i].max) {
				rarity = tiers[i].name
				if (i + 1 < tiers.length) {
					nextRarity = tiers[i + 1].name
					nextScore = tiers[i].max
				} else {
					nextRarity = ''
				}
				break
			}
		}

		const factors = [
			{
				name: 'World #1 stats',
				val: valWorldFirst,
				calc: `${wf} * 6`,
			},
			{
				name: 'Gold stats',
				val: valGold,
				calc: `${g} * 1.4`,
			},
			{
				name: 'Orange stats',
				val: valOrange,
				calc: `${o} * 0.2`,
			},
			{
				name: 'Green stats',
				val: valGreen,
				calc: `${gr} * 0.02`,
			},
			{
				name: 'WA Endorsements rank',
				val: valWaEnd,
				calc: `√((1 / (0.001 * (WA Endo Rank + 60)^2)) * ((WA Endo Rank + 60) + 10000))`,
			},
			{
				name: 'International Artwork rank',
				val: valIaEnd,
				calc: `√((1 / (0.01 * (IA Rank + 60)^2)) * ((IA Rank + 60) + 10000))`,
			},
			{
				name: 'WA Member',
				val: valWaMember,
				calc: isWAMember ? 'Yes (+0.1)' : 'No',
			},
			{
				name: 'WA Delegate',
				val: valWaDelegate,
				calc: isWADelegate ? 'Yes (+8)' : 'No',
			},
			{
				name: 'Founder',
				val: valFounder,
				calc: founder ? 'Yes (+4)' : 'No',
			},
			{
				name: 'Governor',
				val: valGovernor,
				calc: governor ? 'Yes (+4)' : 'No',
			},
			{
				name: 'Easter Eggs',
				val: valEasterEggs,
				calc: `1.25 * √(${egg})`,
			},
			{
				name: 'Issues Authored',
				val: valIssuesAuth,
				calc: `2 * √(${ia} * 40)`,
			},
			{
				name: 'GA Resolutions Authored',
				val: valGaAuth,
				calc: `2 * √(${valGaAuth} * 15)`,
			},
			{
				name: 'SC Resolutions Authored',
				val: valScAuth,
				calc: `2 * √(${valScAuth} * 15)`,
			},
			{
				name: 'UN Resolutions Authored',
				val: valUnAuth,
				calc: `2 * √(${valUnAuth} * 15)`,
			},
			{
				name: 'Condemnations/Commendations',
				val: valCcCount,
				calc: `2 * √(${cc} * 120)`,
			},
			{
				name: 'Site Staff',
				val: valGameMod,
				calc: staff ? 'Yes (+50)' : 'No',
			},
			{
				name: 'Retired Mod',
				val: valRetiredMod,
				calc: retiredmod ? 'Yes (+6)' : 'No',
			},
		]

		const congrats: Record<string, string> = {
			Common: `${calc} is courageously common. (${total.toFixed(2)}) ${nextRarity ? `${(nextScore - total).toFixed(2)} points to ${nextRarity}.` : ''}`,
			Uncommon: `${calc} is upwardly uncommon. (${total.toFixed(2)}) ${nextRarity ? `${(nextScore - total).toFixed(2)} points to ${nextRarity}.` : ''}`,
			Rare: `${calc} is remarkably rare. (${total.toFixed(2)}) ${nextRarity ? `${(nextScore - total).toFixed(2)} points to ${nextRarity}.` : ''}`,
			'Ultra Rare': `${calc} is upwardly and remarkably ultra rare. (${total.toFixed(2)}) ${nextRarity ? `${(nextScore - total).toFixed(2)} points to ${nextRarity}.` : ''}`,
			Epic: `${calc} is epicly epic! (${total.toFixed(2)}) ${nextRarity ? `Only ${(nextScore - total).toFixed(2)} points to ${nextRarity}...` : ''}`,
			Legendary: `${calc} is legendarily legendary! (${total.toFixed(2)})`,
		}

		progress = [...progress, { text: congrats[rarity], color: rarity }]
		progress = [...progress, { text: `Contributing factors:` }]

		for (const f of factors) {
			if (f.val > 0) {
				progress = [...progress, { text: `${f.name}: ${f.val.toFixed(2)} (${f.calc})` }]
			}
		}
	}
</script>

<ToolContent
	toolTitle="Rarity"
	icon="🏅"
	caption={'Predict what rarity your nation would or will be. Please note this is not official.'}
	author="Sitethief"
	originalBlurb="rewritten for browser use by Kractero"
	link="https://gist.github.com/Sitethief/460e7dad929ab51558348c3936abdced"
	additional={`<p class="text-sm mb-16">
    This calculator is guesswork and should be taken as an estimate. In particular, the tier thresholds were made years ago.
	Some adjustments to the base calculation was made. I am assuming that paid badges do not contribute to
    rarity. I am lumping all active site staff badges into one category.
</p>`} />

<div class="flex flex-col gap-8 break-normal lg:w-[1024px] lg:max-w-5xl lg:flex-row">
	<form onsubmit={onSubmit} class="flex flex-col gap-8">
		<UserAgent bind:errors bind:main />
		<FormInput label={`Nation`} bind:bindValue={calc} id="calc" required={true} />
		<FormCheckbox bind:checked={governor} id="governor" label="Governor" />
		<FormCheckbox bind:checked={founder} id="founder" label="Founder" />
		<FormCheckbox disabled={retiredmod} bind:checked={staff} id="staff" label="Site Staff" />
		<FormCheckbox disabled={staff} bind:checked={retiredmod} id="retiredmod" label="Retired Mod" />
		<FormInput type="number" label={`Issues Authored`} bind:bindValue={ia} id="ia" required={true} />
		<FormInput type="number" label={`GA Resolutions`} bind:bindValue={gaResAuthoredVal} id="ia" required={true} />
		<FormInput type="number" label={`SC Resolutions`} bind:bindValue={scResAuthoredVal} id="ia" required={true} />
		<FormInput type="number" label={`UN Resolutions`} bind:bindValue={unResAuthoredVal} id="ia" required={true} />
		<FormInput type="number" label={`Easter Eggs`} bind:bindValue={egg} id="egg" required={true} />
		<Buttons />
	</form>
	<Terminal bind:progress />
</div>
