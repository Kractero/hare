<script lang="ts">
	import Label from './ui/label/label.svelte'
	import Textarea from './ui/textarea/textarea.svelte'

	export let id: string
	export let label: string
	export let placeholder: string
	export let bindValue: string | number | undefined
	export let disabled: boolean = false
	export let subTitle: string = ''
	export let required: boolean = false

	export let errors: Array<{ field: string | number; message: string }> = []
</script>

<div class={`flex max-w-lg items-center justify-between gap-4`}>
	<Label class={'w-24'} for={id}
		>{label}
		{#if subTitle}
			<span class="text-xs">{subTitle}</span>
		{/if}</Label
	>
	<Textarea
		class="w-96 text-right text-base"
		{id}
		{placeholder}
		bind:value={bindValue}
		{required}
		rows={10}
	/>
</div>

{#if errors && errors.length > 0 && errors.find(error => error.field === id)}
	<p class="max-w-lg text-wrap text-sm font-medium text-destructive">
		{errors.find(error => error.field === id)?.message}
	</p>
{/if}
