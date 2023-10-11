<script lang="ts">
	import { filter, searchAuthor } from '$lib/store';
	export let name: string;
	export let author: string;
	export let url: string;
	export let description: string;
	export let keywords: Array<string>;
	import { base } from "$app/paths";
</script>

<div
	class={`${$filter === "" ? "clienthide" : ""} max-w-xs h-min flex flex-col justify-center items-center bg-content p-4 rounded-xl gap-4 hover:shadow-lg`}
>
	<div class="text-center flex flex-col items-center">
		<a href={url} rel="noopener noreferrer" target="_blank">
			<h2 class="text-cardprimarytext text-3xl font-bold hover:underline">{name}</h2>
		</a>
		<div class="flex my-4 items-center gap-4">
			<button class="bg-gray-300 p-2 rounded-xl" on:click={() => searchAuthor.set(author)}>
				<p class="text-label text-sm">{author}</p>
			</button>
			<a href={url} rel="noopener noreferrer" target="_blank">
				<img height="24" width="24" src={`${base}/innewtab.png`} alt="open in new tab" />
			</a>
		</div>
		<div class="flex flex-wrap justify-center gap-2 my-2">
			{#each keywords as word}
				<p class="text-label text-xs rounded-xl p-2 bg-tertiary">{word}</p>
			{/each}
		</div>
	</div>
	<p class="text-cardprimarytext">{description}</p>
</div>
