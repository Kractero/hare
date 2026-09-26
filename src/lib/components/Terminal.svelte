<script lang="ts">
	interface Props {
		info?: { text: string; color?: string }[]
		progress?: { text: string; color?: string; link?: { href: string; label: string } }[]
		continuousUpdate?: string
	}

	let { info = $bindable([]), progress = $bindable([]), continuousUpdate = '' }: Props = $props()

	let terminal: HTMLDivElement

	$effect(() => {
		if (terminal && progress) {
			terminal.scrollTop = terminal.scrollHeight
		}
	})

	let trimmedProgress = $derived(info && info.length > 0 ? progress.slice(-1000) : progress)

	const colors: Record<string, string> = {
		green: 'text-green-400',
		blue: 'text-blue-400',
		white: 'text-red-400',
		yellow: 'text-yellow-400',
		red: 'text-red-400',
		Common: '#c9c9c9',
		Uncommon: '#60d774',
		Rare: '#5ab2de',
		'Ultra Rare': '#d171e3',
		Epic: '#d59b62',
		Legendary: '#e4c21b',
	}
</script>

<div
	bind:this={terminal}
	class="focus-visible:ring-ringy border-input bg-secondary ring-offset-background inline-block w-full max-w-[496px] flex-1 gap-4 rounded-md border px-3 py-2 font-mono text-sm font-medium whitespace-pre-wrap lg:max-w-5xl">
	{#if info && info.length > 0}
		{#each info as { text, color }, i (i)}
			<p class={`my-0.5 ${color ? `text-${color}-400` : ''}`}>{text}</p>
		{/each}
	{/if}{#if continuousUpdate}<p class="font-bold text-purple-400">
			{continuousUpdate}
		</p>{/if}{#each trimmedProgress as { text, color, link }, i (i)}
		<p
			class={`my-0.5 ${color && colors[color] ? (colors[color].startsWith('#') ? '' : colors[color]) : ''}`}
			style={`${color && colors[color]?.startsWith('#') ? `color: ${colors[color]}` : ''}`}>
			{#if text}
				{text}
			{/if}{#if link}
				{' '}
				<a href={link.href} target="_blank" rel="noreferrer noopener" class="underline">
					{`${link.label}`}
				</a>
			{/if}
		</p>
	{/each}
</div>
