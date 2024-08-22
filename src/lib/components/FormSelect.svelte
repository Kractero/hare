<script lang="ts">
	import * as Select from '$lib/components/ui/select'

	import Label from './ui/label/label.svelte'

	export let label: string
	export let subTitle: string = ''
	export let id: string
	export let items: string[]
	export let bindValue: any
</script>

<div class={`flex max-w-lg items-center justify-between gap-4`}>
	<Label class={'w-24'} for={id}
		>{label}
		{#if subTitle}
			<span class="text-xs">{subTitle}</span>
		{/if}</Label
	>
	<Select.Root
		onSelectedChange={v => {
			bindValue = v && v.value
		}}
	>
		<Select.Trigger class="flex-1">
			<Select.Value placeholder={items[0]} />
		</Select.Trigger>
		<Select.Content class="text-left">
			{#each items as item}
				<Select.Item value={item}>{item}</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>
</div>
