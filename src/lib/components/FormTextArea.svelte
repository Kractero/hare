<script lang="ts">
	import Label from './ui/label/label.svelte'
	import Textarea from './ui/textarea/textarea.svelte'

	interface Props {
		id: string
		label: string
		bindValue: string | number | undefined
		subTitle?: string
		required?: boolean
		editor?: boolean
	}

	let { id, label, bindValue = $bindable(), subTitle = '', required = false, editor = false }: Props = $props()

	// export let errors: Array<{ field: string | number; message: string }> = []
</script>

<div class={`${editor == true ? 'block' : 'flex'} max-w-lg items-center justify-between gap-4`}>
	<Label class={'w-24'} for={id}
		>{label}
		{#if subTitle}
			<p class="mt-1 text-xs">{subTitle}</p>
		{/if}</Label>
	<Textarea class="w-96 text-right text-base" {id} bind:value={bindValue} {required} rows={10} />
</div>

<!-- {#if errors && errors.length > 0 && errors.find(error => error.field === id)}
	<p class="max-w-lg text-wrap text-sm font-medium text-destructive">
		{errors.find(error => error.field === id)?.message}
	</p>
{/if} -->
