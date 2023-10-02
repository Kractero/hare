<script lang="ts">
	import { base } from "$app/paths";
</script>

<header class="flex justify-between w-full mb-32 mt-3">
	<a href={`${base}/`} class="flex items-center">
		<img src="{base}/Computer.png" alt="Computer" />
		<h2 class="text-2xl font-bold tracking-tight ml-2">Hare</h2>
	</a>
	<div class="flex gap-1 sm:gap-4">
		<a href="https://discord.gg/yn5a4p9" target="_blank" rel="noreferrer noopener">
			<img src="{base}/Discord.png" alt="discord" />
		</a>
		<a href="https://github.com/Kractero/hare" target="_blank" rel="noreferrer noopener">
			<img src="{base}/Github.png" alt="Github" />
		</a>
		<a href={`${base}/config`}>
			<img src="{base}/Settings.png" alt="Settings" />
		</a>
	</div>
</header>