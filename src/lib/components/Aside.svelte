<script lang="ts">
	import type { Post } from '$lib/server/posts'
	import ChevronDown from 'lucide-svelte/icons/chevron-down'
	import Table2 from 'lucide-svelte/icons/table-2'

	interface Props {
		posts: Record<string, Post[]>
	}

	let { posts }: Props = $props()

	let mobileOpen = $state(false)
</script>

<button onclick={() => (mobileOpen = !mobileOpen)} class="flex w-full justify-between md:hidden">
	<div class="flex items-center gap-2">
		<Table2 class="h-4 w-4" />
		<p class="font-semibold">Contents</p>
	</div>
	<ChevronDown class="h-4 w-4 transition-transform" />
</button>

<aside
	class="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r py-6 pr-2 md:sticky md:block lg:py-10">
	<nav class="w-full space-y-6 px-4">
		{#each Object.entries(posts) as [category, possts]}
			<div>
				<h2 class="text-muted-foreground mb-2 text-sm font-semibold tracking-wide uppercase">
					{category}
				</h2>
				<ul class="space-y-1">
					{#each possts as post}
						<li>
							<a
								href={post.description ? `/resources/guides/${post.slug}` : post.url}
								class="text-foreground hover:bg-accent hover:text-accent-foreground block rounded px-2 py-1 text-sm">
								{post.title}
							</a>
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</nav>
</aside>

{#if mobileOpen}
	<aside class="h-full w-full overflow-y-auto p-6 shadow-lg md:hidden">
		<nav class="space-y-6">
			{#each Object.entries(posts) as [category, possts]}
				<div>
					<h2 class="text-muted-foreground mb-2 text-sm font-semibold tracking-wide uppercase">
						{category}
					</h2>
					<ul class="space-y-1">
						{#each possts as post}
							<li>
								<a
									href={post.description ? `/resources/guides/${post.slug}` : post.url}
									class="text-foreground hover:bg-accent hover:text-accent-foreground block rounded px-2 py-1 text-sm"
									onclick={() => (mobileOpen = false)}>
									{post.title}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</nav>
	</aside>
{/if}
