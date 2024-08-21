<script lang="ts">
	import Input from './ui/input/input.svelte'
	import Label from './ui/label/label.svelte'
	import Textarea from './ui/textarea/textarea.svelte'

	export let id: string
	export let label: string
	export let type: string
	export let placeholder: string
	export let bindValue: string | number | undefined
	export let disabled: boolean = false
	export let subTitle: string = ''
	export let required: boolean = false
</script>

<div class={`flex max-w-lg items-center justify-between gap-4`}>
	<Label class={'w-24'} for={id}
		>{label}
		{#if subTitle}
			<span class="text-xs">{subTitle}</span>
		{/if}</Label
	>
	{#if type === 'input'}
		<Input
			class="max-w-xs text-right text-base"
			{id}
			{placeholder}
			bind:value={bindValue}
			{required}
		/>
	{/if}
	{#if type === 'textarea'}
		<Textarea
			class="w-96 text-right text-base"
			{id}
			{placeholder}
			bind:value={bindValue}
			{required}
			rows={10}
		/>
	{/if}
</div>
