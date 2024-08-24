<script lang="ts">
	import { onMount } from 'svelte'
	import { page } from '$app/stores'
	import Buttons from '$lib/components/Buttons.svelte'
	import FormTextArea from '$lib/components/FormTextArea.svelte'
	import InputCredentials from '$lib/components/InputCredentials.svelte'
	import Terminal from '$lib/components/Terminal.svelte'
	import ToolContent from '$lib/components/ToolContent.svelte'
	import { pushHistory } from '$lib/helpers/navigation'
	import { parseXML } from '$lib/helpers/parser'
	import { scoreCodes } from '$lib/helpers/scores'
	import { checkUserAgent } from '$lib/helpers/validate'

	const abortController = new AbortController()

	let progress = ''
	let puppets = ''
	let main = ''
	let scales = ''
	let stoppable = false
	let stopped = false
	let errors: Array<{ field: string | number; message: string }> = []

	onMount(() => {
		main = $page.url.searchParams.get('main') || (localStorage.getItem('main') as string) || ''
		puppets = (localStorage.getItem('puppets') as string) || ''
		scales =
			$page.url.searchParams.get('scale') ||
			(localStorage.getItem('statisticsScales') as string) ||
			''
	})
	async function findWA(main: string, puppets: string) {
		pushHistory(`?main=${main}&scale=${scales.replace('\n', ',')}`)
		errors = checkUserAgent('main')
		if (errors.length > 0) return
		stoppable = true
		stopped = false
		progress = '<p>Initiating Stats</p>'
		const puppetsList = puppets.split('\n')
		const scaleList = scales.split('\n')
		for (let i = 0; i < scaleList.length; i++) {
			let scores: Array<Array<number>> = []
			for (let j = 0; j < puppetsList.length; j++) {
				if (abortController.signal.aborted || stopped) {
					break
				}
				const nation = puppetsList[j]
				try {
					const scaler = await parseXML(
						`https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net/cgi-bin/api.cgi?nation=${nation}&q=census&scale=${scaleList[i]}`,
						main
					)
					scores = [...scores, [scaler.NATION.CENSUS.SCALE.RANK, scaler.NATION.CENSUS.SCALE.SCORE]]
				} catch (err) {
					progress += `<p class="text-red-400">Error processing ${nation} with ${err}</p>`
				}
			}
			const scoresScores = scores.map(score => score[1])
			let scoresMean = 0
			scoresScores.forEach(score => {
				scoresMean = scoresMean + score
			})
			scoresMean = scoresMean / scoresScores.length
			const medianSorted = scoresScores.sort((a, b) => a - b)
			const midpoint = Math.floor(medianSorted.length / 2)
			const scoresMedian =
				medianSorted.length % 2 === 1
					? medianSorted[midpoint]
					: (medianSorted[midpoint - 1] + medianSorted[midpoint]) / 2
			const scoresMode = Math.max(...scoresScores)

			const scoresRanks = scores.map(score => score[0])
			let ranksMean = 0
			scoresRanks.forEach(score => {
				ranksMean = ranksMean + score
			})
			let total = ranksMean
			ranksMean = ranksMean / scoresRanks.length
			const rankSorted = scoresRanks.sort((a, b) => a - b)
			const rankMidpoint = Math.floor(rankSorted.length / 2)
			const ranksMedian =
				rankSorted.length % 2 === 1
					? rankSorted[rankMidpoint]
					: (rankSorted[rankMidpoint - 1] + rankSorted[rankMidpoint]) / 2
			const ranksMode = Math.min(...scoresRanks)
			progress += `<p>Category ${scoreCodes[scaleList[i]]}</p>`
			progress += `<p>Total: ${total}</p>`
			progress += `<p>Mean Score: ${scoresMean}</p>`
			progress += `<p>Median Score: ${scoresMedian}</p>`
			progress += `<p>Mode Score: ${scoresMode}</p>`
			progress += `<p>Mean Rank: ${ranksMean}</p>`
			progress += `<p>Median Rank: ${ranksMedian}</p>`
			progress += `<p>Mode Rank: ${ranksMode}</p>`
		}
		stoppable = false
	}
</script>

<ToolContent
	toolTitle="Statistics"
	caption="Provided WA scales and puppets, get the mean, median, and mode for each scale."
	author="9003"
	originalBlurb="rewritten in JS for browser use by Kractero"
/>

<div class="flex flex-col gap-8 break-normal lg:w-[1024px] lg:max-w-5xl lg:flex-row">
	<form on:submit|preventDefault={() => findWA(main, puppets)} class="flex flex-col gap-8">
		<InputCredentials bind:errors bind:main bind:puppets authenticated={false} />
		<FormTextArea label="Scale" bind:bindValue={scales} id="scale" required={true} />
		<Buttons stopButton={true} bind:stopped bind:stoppable />
	</form>
	<Terminal bind:progress />
</div>
