<script lang="ts">
	import * as Select from '$lib/components/ui/select'

	import FormSelectTheme from './FormSelectTheme.svelte'
	import Label from './ui/label/label.svelte'

	interface Props {
		label: string;
		subTitle?: string;
		id: string;
		items: string[];
		bindValue: any;
	}

	let {
		label,
		subTitle = '',
		id,
		items,
		bindValue = $bindable()
	}: Props = $props();

	function isTheme(value: string): value is 'system' | 'light' | 'dark' {
		return ['system', 'light', 'dark'].includes(value)
	}
</script>

<div class={`flex max-w-lg items-center justify-between gap-4`}>
	<Label class={'w-[66px] sm:w-24'} for={id}
		><p>{label}</p>
		{#if subTitle}
			<p class="text-xs">{subTitle}</p>
		{/if}</Label>
	<Select.Root
		onSelectedChange={v => {
			bindValue = v && v.value
		}}
		selected={bindValue}>
		<Select.Trigger class="w-[206px] flex-1 justify-end sm:max-w-[221px] data-[placeholder]:[&>span]:text-primary">
			<Select.Value class="mr-2" placeholder={bindValue} />
		</Select.Trigger>
		<Select.Content class="text-left">
			{#each items as item}
				{#if isTheme(item)}
					<FormSelectTheme bind:item />
				{:else}
					<Select.Item value={item}>{item}</Select.Item>
				{/if}
			{/each}
		</Select.Content>
	</Select.Root>
</div>
