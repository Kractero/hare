<script lang="ts">
	import * as Select from '$lib/components/ui/select'
	import { setMode } from 'mode-watcher'

	export let item: 'system' | 'light' | 'dark'
</script>

<Select.Item on:click={() => setMode(item)} bind:value={item}>{item}</Select.Item>
