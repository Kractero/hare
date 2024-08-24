<script lang="ts">
	import Head from '$lib/components/Head.svelte'

	// @ts-ignore
	import Changelog from './Changelog.md'
</script>

<Head title={'Hare - Changelog'} description={'Changelog of Hare'} />

<article class="prose mx-auto mb-24 max-w-lg p-4 dark:prose-invert md:max-w-3xl lg:max-w-5xl">
	<Changelog />
</article>
