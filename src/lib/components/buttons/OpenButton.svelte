<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte'

	interface Props {
		progress?: Array<{ text: string; color?: string }>
		openNewLinkArr?: Array<{ url: string; tableText: string; linkStyle?: string }>
		stopped?: boolean
		stoppable?: boolean
	}
	let { progress = $bindable([]), openNewLinkArr = $bindable([]), stopped = false, stoppable = false }: Props = $props()
	let openedCount = $state(0)
	let busy = $state(false)
	let lastNation = $state('')
	let buttonEl = $state<HTMLElement | null>(null)

	const getNation = (url: string) => {
		const part = url.split('nation=')[1]
		return part ? part.split('/')[0].split('&')[0].split('?')[0] : ''
	}

	const openLink = () => {
		if (openNewLinkArr.length === 0) return
		const nation = getNation(openNewLinkArr[0].url)
		if (nation !== lastNation && busy) return
		if (lastNation === '') busy = false
		lastNation = nation
		window.open(openNewLinkArr[0].url, '_blank')
		openedCount++
		openNewLinkArr.splice(0, 1)
	}

	$effect(() => {
		const url = openNewLinkArr[0]?.url
		if (!url || !url.includes('open_loot_box')) return
		const nation = getNation(url)
		if (nation !== lastNation && lastNation !== '') {
			lastNation = nation
			busy = true
		}
	})

	$effect(() => {
		openNewLinkArr
		progress
		if (progress.length === 1) {
			openedCount = 0
		}
	})

	$effect(() => {
		stopped
		stoppable
		busy = false
		lastNation = ''
	})

	$effect(() => {
		const reset = () => {
			const url = openNewLinkArr[0]?.url
			if (!url || !url.includes('open_loot_box')) return
			const nation = getNation(url)
			if (nation !== lastNation) return
			busy = false
			setTimeout(() => buttonEl?.focus(), 0)
		}
		const onVisible = () => {
			if (!document.hidden) reset()
		}
		document.addEventListener('visibilitychange', onVisible)
		return () => document.removeEventListener('visibilitychange', onVisible)
	})
</script>

<Button
	bind:ref={buttonEl}
	disabled={!progress || openNewLinkArr.length === 0 || busy}
	type="button"
	variant={'default'}
	onkeyup={e => {
		if (e.key === 'Enter') openLink()
	}}
	onclick={(e: any) => {
		if (e.pointerType === 'mouse') openLink()
	}}>
	Open Available Link {openNewLinkArr.length > 0 ? `(${openedCount} / ${openNewLinkArr.length + openedCount})` : ''}
</Button>
