<script lang="ts">
	import * as Select from '$lib/components/ui/select'
	import { setMode } from 'mode-watcher'

	interface Props {
		item: 'system' | 'light' | 'dark'
	}

	let { item = $bindable() }: Props = $props()
</script>

<Select.Item onclick={() => setMode(item)} value={item}>{item}</Select.Item>
