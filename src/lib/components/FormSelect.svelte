<script lang="ts">
	import * as Select from '$lib/components/ui/select'

	import FormSelectTheme from './FormSelectTheme.svelte'
	import Label from './ui/label/label.svelte'

	interface Props {
		label: string
		subTitle?: string
		id: string
		items: string[]
		bindValue: any
		type?: 'single' | 'multiple'
	}

	let { label, subTitle = '', id, items, bindValue = $bindable(), type = 'single' }: Props = $props()

	function isTheme(value: string): value is 'system' | 'light' | 'dark' {
		return ['system', 'light', 'dark'].includes(value)
	}
</script>

<div class={`flex max-w-lg items-center justify-between gap-4`}>
	<Label class={'w-[66px] sm:w-24'} for={id}
		><p>{label}</p>
		{#if subTitle}
			<p class="mt-1 text-xs">{subTitle}</p>
		{/if}</Label>
	<Select.Root
		{type}
		onValueChange={(v: any) => {
			bindValue = v && v
		}}
		value={bindValue}>
		<Select.Trigger class="data-placeholder:[&>span]:text-primary max-w-[221px] flex-1 justify-end">
			<span class="pr-2">{bindValue}</span>
		</Select.Trigger>
		<Select.Content class="text-left">
			{#each items as item, i}
				{#if isTheme(item)}
					<FormSelectTheme bind:item={items[i] as 'system' | 'light' | 'dark'} />
				{:else}
					<Select.Item value={item}>{item}</Select.Item>
				{/if}
			{/each}
		</Select.Content>
	</Select.Root>
</div>
