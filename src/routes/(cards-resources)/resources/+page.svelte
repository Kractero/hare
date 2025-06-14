<script lang="ts">
	import Head from '$lib/components/Head.svelte'

	// @ts-expect-error importing changelog markdown
	import Docs from './Resources.md'
</script>

<Head title={'Hare - Guides'} description={'Various guides for NationStates cards.'} />

<article class="prose dark:prose-invert mx-auto mb-24 max-w-lg p-4 md:max-w-3xl lg:max-w-5xl">
	<Docs />
</article>
