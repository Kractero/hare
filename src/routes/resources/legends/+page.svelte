<!-- @migration-task Error while migrating Svelte code: `<th>` is invalid inside `<table>` -->
<script lang="ts">
	import { onMount } from 'svelte'
	import ToolContent from '$lib/components/ToolContent.svelte'
	import Check from 'lucide-svelte/icons/check'
	import X from 'lucide-svelte/icons/x'

	let domain = ''
	let json: Array<{ [key: string]: boolean }> = []
	let changelog: any[] = []
	const currentDate = new Date()
	const utcMinus7Date = new Date(currentDate.getTime() - 7 * 60 * 60 * 1000)
	utcMinus7Date.setDate(utcMinus7Date.getDate() - 1)
	const date = utcMinus7Date.toISOString().slice(0, 10)
	const validHeaders = ['Name', 'S1', 'S2', 'S3', '👍']
	let counts: string | any[] = []
	onMount(async () => {
		domain = `https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net`
		const activityRes = await fetch(`https://raw.githubusercontent.com/Kractero/himari/main/files/Legendaries.json`)
		json = await activityRes.json()
		const changelogres = await fetch(
			`https://raw.githubusercontent.com/Kractero/himari/main/files/LegendariesChangelog.json`
		)
		changelog = await changelogres.json()
		changelog = changelog.slice(0, 5)
		let s1s = json.filter(entry => entry.S1 === true)
		let s2s = json.filter(entry => entry.S2 === true)
		let s3s = json.filter(entry => entry.S3 === true)
		counts = [
			...counts,
			{
				ratio: `${s1s.filter(entry => entry.exists === true).length}/${s1s.length}`,
				pctg: ((s1s.filter(entry => entry.exists === true).length / s1s.length) * 100).toFixed(2),
			},
			{
				ratio: `${s2s.filter(entry => entry.exists === true).length}/${s2s.length}`,
				pctg: ((s2s.filter(entry => entry.exists === true).length / s2s.length) * 100).toFixed(2),
			},
			{
				ratio: `${s3s.filter(entry => entry.exists === true).length}/${s3s.length}`,
				pctg: ((s3s.filter(entry => entry.exists === true).length / s3s.length) * 100).toFixed(2),
			},
		]
	})

	const sort = (column: string | number) => {
		let notExistsArray = json
			.filter(item => item.exists === false)
			.sort((a, b) => (a[column] < b[column] ? 1 : a[column] > b[column] ? -1 : 0))
		let existsArray = json.filter(item => item.exists === true)
		json = notExistsArray.concat(existsArray)
	}
</script>

<ToolContent
	toolTitle="Legendary Tracker"
	caption="Track the existence of legendaries per season"
	originalBlurb="rewritten in Svelte for Hare use by Kractero"
	author="Kractero"
	link="https://ledger.kractero.com/legendaries"
	additional={`<p class="mb-16">As of ${date} (11:30 PM/23:30 UTC-7)</p>`} />

<div class="mb-4 flex flex-col justify-between gap-8 break-normal lg:w-[1024px] lg:max-w-5xl lg:flex-row">
	<div>
		<h2 class="mb-2 text-lg font-semibold">Per-Season</h2>
		{#if counts.length > 0}
			{#each counts as season, i}
				<p class="m-1">S{i + 1} - {season.ratio}, equaling {season.pctg}% non-CTE</p>
			{/each}
		{/if}
	</div>
	<div>
		<h2 class="mb-2 text-lg font-semibold">Changelog (last 5 days)</h2>
		{#if changelog.length > 0}
			{#each changelog as log, i}
				<p class="my-1 font-semibold">{log.date}</p>
				{#each log.changes as change}
					<p>
						<a
							class="underline"
							rel="noreferrer noopener"
							target="_blank"
							href={`https://nationstates.net/nation=${change.name}`}>{change.name}</a>
						(
						{#await json.find(nation => nation.name === change.name) then nation}
							{#if nation && (nation.S1 || nation.S2 || nation.S3)}
								{#if nation.S1}<a
										class="mx-0 underline"
										rel="noreferrer noopener"
										target="_blank"
										href={`https://nationstates.net/page=deck/card=${nation.id}/season=1`}>S1</a
									>{/if}
								{#if nation.S2}<a
										class="mx-0 underline"
										rel="noreferrer noopener"
										target="_blank"
										href={`https://nationstates.net/page=deck/card=${nation.id}/season=2`}>S2</a
									>{/if}
								{#if nation.S3}<a
										class="mx-0 underline"
										rel="noreferrer noopener"
										target="_blank"
										href={`https://nationstates.net/page=deck/card=${nation.id}/season=3`}>S3</a
									>{/if}
							{/if}
						{/await}
						legendary) has {change.new === true ? 'restored!' : 'ceased to exist...'}
					</p>
				{/each}
			{/each}
		{/if}
	</div>
</div>

<p class="my-4 text-xs">
	The thumbs-up column indicates whether they exist or not, the others indicate whether they were a legendary in that
	season or not.
</p>

<div class="flex flex-col gap-8 break-normal lg:w-[1024px] lg:max-w-5xl lg:flex-row">
	<table class="w-full table-auto caption-bottom border-collapse whitespace-normal text-left">
		<thead>
			<tr>
				<th>#</th>
				{#each validHeaders as header}
					<th
						on:click={() => sort(`${header}`)}
						class={`h-12 p-2 font-semibold md:p-4 ${header.includes('S') ? 'underline' : ''}`}>{header}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each json as nation}
				<tr class="border-b-1 border border-black">
					<td class="text-xs">{nation.id}</td>
					<td class="w-[150px] whitespace-normal break-words break-all p-2 text-xs md:w-auto md:p-4 md:text-base">
						<a class="underline" rel="noreferrer noopener" target="_blank" href={`${domain}/nation=${nation.name}/`}
							>{nation.name}</a>
					</td>
					{#each [1, 2, 3] as season}
						{#if nation[`S${season}`] === true}
							<td class="p-2 md:p-4">
								<a
									rel="noreferrer noopener"
									target="_blank"
									href={`${domain}/page=deck/card=${nation.id}/season=${season}`}><Check color="green" /></a>
							</td>
						{:else}
							<td class="p-2 md:p-4"><X color="red" /></td>
						{/if}
					{/each}
					{#if nation.exists === true}
						<td class="p-2 md:p-4"
							><a rel="noreferrer noopener" target="_blank" href={`${domain}/nation=${nation.name}/`}
								><Check color="green" /></a>
						</td>
					{:else}
						<td class="p-2 md:p-4"><X color="red" /></td>
					{/if}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
