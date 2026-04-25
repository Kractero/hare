<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte'

	interface Props {
		progress?: Array<{ text: string; color?: string }>
		openNewLinkArr?: Array<{ url: string; tableText: string; linkStyle?: string }>
	}
	let { progress = $bindable([]), openNewLinkArr = $bindable([]) }: Props = $props()
	let openedCount = $state(0)
	let busy = $state(false)

	const openLink = () => {
		if (openNewLinkArr.length === 0 || busy) return
		busy = true
		window.open(openNewLinkArr[0].url, '_blank')
		openedCount++
		openNewLinkArr.splice(0, 1)
	}

	$effect(() => {
		openNewLinkArr
		progress
		if (progress.length === 1) {
			openedCount = 0
		}
	})

	$effect(() => {
		const onVisible = () => {
			if (!document.hidden) {
				busy = false
				setTimeout(() => buttonEl?.focus(), 0)
			}
		}
		const onFocus = () => {
			busy = false
			setTimeout(() => buttonEl?.focus(), 0)
		}
		document.addEventListener('visibilitychange', onVisible)
		window.addEventListener('focus', onFocus)
		return () => {
			document.removeEventListener('visibilitychange', onVisible)
			window.removeEventListener('focus', onFocus)
		}
	})

	let buttonEl = $state<HTMLElement | null>(null)
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
