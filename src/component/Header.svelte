<script lang="ts">
	import Modal from './Modal.svelte';

	let modal: HTMLDivElement;
</script>

<header class="flex justify-between w-full mb-32 mt-3">
	<a href="/" class="flex items-center">
		<img src="/Computer.png" alt="Computer" />
		<h2 class="text-2xl font-bold tracking-tight ml-2">Hare</h2>
	</a>
	<div class="flex gap-4">
		<a href="https://discord.gg/yn5a4p9" target="_blank" rel="noreferrer noopener">
			<img src="/Discord.png" alt="discord" />
		</a>
		<a href="https://github.com/Kractero" target="_blank" rel="noreferrer noopener">
			<img src="/Github.png" alt="Github" />
		</a>
		<button
			on:click={() => {
				modal.classList.remove('hidden');
			}}
		>
			<img src="/Settings.png" alt="Settings" />
		</button>
	</div>
</header>
<div
	role="button"
	tabindex="0"
	aria-label="Modal overlay and closer"
	on:keypress={(e) => {
		if (e.currentTarget === e.target) {
			modal.classList.add('hidden');
		}
	}}
	on:click={(e) => {
		if (e.currentTarget === e.target) {
			modal.classList.add('hidden');
		}
	}}
	bind:this={modal}
	class="hidden bg-[#000000e1] fixed w-screen h-screen inset-0"
>
	<Modal />
</div>
