<script lang="ts">
	export let info: { text: string; color?: string }[] = []
	export let progress: { text: string; color?: string; link?: { href: string; label: string } }[] = []
	export let continuousUpdate: string = ''

	let terminal: HTMLDivElement

	$: if (terminal) {
		terminal.scrollTop = terminal.scrollHeight
	}

	$: trimmedProgress = info && info.length > 0 ? progress.slice(-1000) : progress

	const colors: Record<string, string> = {
		green: 'text-green-400',
		blue: 'text-blue-400',
		white: 'text-red-400',
		yellow: 'text-yellow-400',
		red: 'text-red-400',
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
		<p class={`my-0.5 ${color && colors[color] ? colors[color] : ''}`}>
			{#if text}
				{text} {' '}
			{/if}{#if link}
				<a href={link.href} target="_blank" rel="noreferrer noopener" class="underline">
					{link.label}
				</a>
			{/if}
		</p>
	{/each}
</div>
