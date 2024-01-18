<script lang="ts">
    import Card  from "$lib/component/Card.svelte"
    import Filterer from "$lib/component/Filterer.svelte"
	import { filter, searchAuthor } from '$lib/cards-resources/store';
	import { projects } from '$lib/cards-resources/projects';
	import { onMount } from 'svelte';
	import Head from "$lib/component/Head.svelte";
	let searchTerm = '';
	onMount(() => {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry, i) => {
				if (entry.isIntersecting) {
					entry.target.classList.add('show');
				} else {
					entry.target.classList.remove('show');
				}
			});
		});
		const posts = document.querySelectorAll('.clienthide');
		posts.forEach((post) => observer.observe(post));
	});
</script>

<Head title={"Hare - Resources"} description={"Searchable hub of NationStates tools, utilies, and scripts."} />

<p class="text-3xl font-bold mb-4">Search</p>
<input class="w-full h-10 rounded-md max-w-lg lg:max-w-5xl p-4 mb-8 border border-black dark:border-none text-black" bind:value={searchTerm} />

<p class="text-xl font-semibold">or filter by tags</p>
<Filterer />

{#if $searchAuthor}
	<div class="text-xl relative">
		Tools by:
		<button
			on:click={() => searchAuthor.set('')}
			class="ml-5 font-bold p-3 bg-tertiary text-label rounded-xl"
		>
			<p>
				<span class="text-red-500">X</span>
				<span>{$searchAuthor}</span>
			</p>
		</button>
	</div>
{/if}

<div class="max-w-5xl flex flex-wrap justify-center gap-4 my-8">
	{#each projects
		.filter((project) => {
			if ($filter && $filter !== 'All') {
				return project.keywords.includes($filter);
			} else {
				return project;
			}
		})
		.filter((project) => {
			if (searchTerm) {
				return project.description.toLowerCase().includes(searchTerm.toLowerCase()) || project.name
						.toLowerCase()
						.includes(searchTerm.toLowerCase()) || project.author
						.toLowerCase()
						.includes(searchTerm.toLowerCase());
			} else {
				return project;
			}
		})
		.filter((project) => {
			if ($searchAuthor) {
				return project.author === $searchAuthor;
			} else {
				return project;
			}
		}) as project}
		<Card
			name={project.name}
			author={project.author}
			url={project.url}
			keywords={project.keywords}
			description={project.description}
		/>
	{/each}
</div>
