<script lang="ts">
	import Guides from '$lib/components/Guides.svelte'
	import Head from '$lib/components/Head.svelte'

	import type { PageData } from './$types'

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<Head title={'Hare - Guides'} description={'Various guides for NationStates cards.'} />

<Guides {data} />
