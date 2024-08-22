<script lang="ts">
	import Input from './ui/input/input.svelte'
	import Label from './ui/label/label.svelte'

	export let id: string
	export let label: string
	export let placeholder: string
	export let bindValue: string | number | undefined
	export let subTitle: string = ''
	export let required: boolean = false

	export let errors: Array<{ field: string | number; message: string }>
</script>

<div class={`flex max-w-lg items-center justify-between gap-4`}>
	<Label class={'w-24'} for={id}
		>{label}
		{#if subTitle}
			<span class="text-xs">{subTitle}</span>
		{/if}</Label
	>
	<Input
		class="max-w-min text-right text-base"
		{id}
		{placeholder}
		bind:value={bindValue}
		{required}
	/>
</div>

{#if errors && errors.length > 0 && errors.find(error => error.field === id)}
	<p class="text-sm font-medium text-destructive">
		{errors.find(error => error.field === id)?.message}
	</p>
{/if}
