<script lang="ts">
	import Label from '$lib/components/ui/label/label.svelte'
	import * as Select from '$lib/components/ui/select'

	interface Props {
		bindValue: string
		label: string
		items: string[]
	}

	let { bindValue = $bindable(), label, items }: Props = $props()
</script>

<div class={`flex w-max items-center justify-between gap-4`}>
	<Label class={'w-24'} for={'sort'}>{label}</Label>
	<Select.Root
		type="single"
		onValueChange={v => {
			bindValue = v && v
		}}
		value={bindValue}>
		<Select.Trigger class="min-w-[175px] flex-1 justify-end data-placeholder:[&>span]:text-primary" />
		<Select.Content class="text-left">
			{#each Array.from(items) as item}
				<Select.Item value={item}>{item}</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>
</div>
