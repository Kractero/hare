<script lang="ts">
	import Input from './ui/input/input.svelte'
	import Label from './ui/label/label.svelte'

	interface Props {
		id: string
		label: string
		bindValue: string | number | undefined
		subTitle?: string
		required?: boolean
		disabled?: boolean
		type?: string
		errors?: Array<{ field: string | number; message: string }>
	}

	let {
		id,
		label,
		bindValue = $bindable(),
		subTitle = '',
		required = false,
		disabled = false,
		type = '',
		errors = $bindable([]),
	}: Props = $props()
	const rarities = ['common', 'uncommon', 'rare', 'ultra-rare', 'epic']
</script>

<div class={`flex w-full max-w-lg items-center justify-between gap-4`}>
	<Label class={'w-24'} for={id}
		>{label}
		{#if subTitle}
			<span class="text-xs">{subTitle}</span>
		{/if}</Label>
	<Input
		class={`${rarities.includes(id) ? 'w-20' : 'max-w-max'} text-right text-base`}
		{id}
		type={type || 'text'}
		bind:value={bindValue}
		{required}
		{disabled} />
</div>

{#if errors && errors.length > 0 && errors.find(error => error.field === 'useragent')}
	<p class="max-w-lg text-sm font-medium text-destructive">
		{errors.find(error => error.field === 'useragent')?.message}
	</p>
{/if}
