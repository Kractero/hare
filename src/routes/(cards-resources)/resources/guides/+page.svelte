<script lang="ts">
	import Guides from '$lib/components/Guides.svelte'
	import Head from '$lib/components/Head.svelte'

	import type { PageData } from './$types'

	export let data: PageData
</script>

<Head title={'Hare - Guides'} description={'Various guides for NationStates cards.'} />

<Guides {data} />
