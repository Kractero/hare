<script lang="ts">
	import Aside from '$lib/components/Aside.svelte'
	import Head from '$lib/components/Head.svelte'

	import type { LayoutProps } from './$types'

	let { data, children }: LayoutProps = $props()
</script>

<Head title={'Hare - Resources'} description={'Hub of NationStates guides and search tools, utilities, and scripts.'} />

<div class="flex-1 md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:w-[1024px] lg:grid-cols-[240px_1fr] lg:gap-10">
	<Aside posts={data.groupedPosts} />
	{@render children?.()}
</div>
