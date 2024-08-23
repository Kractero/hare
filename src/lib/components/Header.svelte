<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js'
	import Moon from 'lucide-svelte/icons/moon'
	import Settings from 'lucide-svelte/icons/settings'
	import Sun from 'lucide-svelte/icons/sun'
	import { toggleMode } from 'mode-watcher'
</script>

<header class="mb-32 mt-3 flex w-full items-center justify-between">
	<a href={`/`} class="flex items-center gap-2">
		<img src="/favicon.png" alt="Hare" />
		<h2 class="ml-2 text-3xl font-semibold tracking-tight">Hare</h2>
	</a>
	<div class="flex gap-1 sm:gap-4">
		<a class="flex items-center gap-2" href={`/config`}>
			<p class="hidden text-xl font-semibold sm:block">Settings</p>
			<Button variant="outline" size="icon">
				<Settings />
			</Button>
		</a>
		<Button on:click={toggleMode} variant="outline" size="icon">
			<Sun
				class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
			/>
			<Moon
				class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
			/>
			<span class="sr-only">Toggle theme</span>
		</Button>
	</div>
</header>
