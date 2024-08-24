<script lang="ts">
	import Input from './ui/input/input.svelte'
	import Label from './ui/label/label.svelte'

	export let id: string
	export let label: string
	export let bindValue: string | number | undefined
	export let subTitle: string = ''
	export let required: boolean = false
	export let disabled: boolean = false
	export let type = ''

	export let errors: Array<{ field: string | number; message: string }> = []
	const rarities = ['common', 'uncommon', 'rare', 'ultra-rare', 'epic']
</script>

<div class={`flex max-w-lg items-center justify-between gap-4`}>
	<Label class={'w-24'} for={id}
		>{label}
		{#if subTitle}
			<span class="text-xs">{subTitle}</span>
		{/if}</Label
	>
	<Input
		class={`${rarities.includes(id) ? 'w-20' : 'max-w-min'} text-right text-base`}
		{id}
		type={type || 'text'}
		bind:value={bindValue}
		{required}
		{disabled}
	/>
</div>

{#if errors && errors.length > 0 && errors.find(error => error.field === 'useragent')}
	<p class="text-sm font-medium text-destructive">
		{errors.find(error => error.field === 'useragent')?.message}
	</p>
{/if}
