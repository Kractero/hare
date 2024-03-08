<script>
	import Linkbar from "$lib/component/Linkbar.svelte";
</script>
<div class="lg:w-[1024px] md:max-w-5xl mb-12">
    <h1 class="text-textprimary font-bold tracking-wide text-4xl mb-4">Hare (ハレ)</h1>
    <p class="font-extralight tracking-tight mb-1">A central location for NationStates scripts.</p>
    <Linkbar />
    <div class="flex gap-2">
		<a href="https://discord.gg/yn5a4p9" target="_blank" rel="noreferrer noopener">
			<img src="/Discord.png" alt="discord" />
		</a>
		<a href="https://github.com/Kractero/hare" target="_blank" rel="noreferrer noopener">
			<img src="/Github.png" alt="Github" />
		</a>
	</div>
</div>

<slot />