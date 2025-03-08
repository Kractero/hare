<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js'
	import Moon from 'lucide-svelte/icons/moon'
	import Settings from 'lucide-svelte/icons/settings'
	import Sun from 'lucide-svelte/icons/sun'
	import { toggleMode } from 'mode-watcher'
</script>

<header class="mt-3 mb-32 flex w-full items-center justify-between">
	<a href={`/`} class="flex items-center gap-2">
		<img class="h-[58px] w-12" src="/favicon.png" alt="" />
		<h2 class="ml-2 text-3xl font-semibold tracking-tight">Hare</h2>
	</a>
	<div class="flex gap-1 sm:gap-4">
		<a class="flex items-center gap-2" href={`/config`}>
			<p class="hidden text-xl font-semibold sm:block">Settings</p>
			<Button variant="outline" size="icon">
				<Settings />
				<span class="sr-only">Open config</span>
			</Button>
		</a>
		<Button onclick={toggleMode} variant="outline" size="icon">
			<Sun class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
			<Moon class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
			<span class="sr-only">Toggle theme</span>
		</Button>
	</div>
</header>
