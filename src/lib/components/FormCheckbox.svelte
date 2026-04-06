<script lang="ts">
	import Checkbox from './ui/checkbox/checkbox.svelte'
	import Label from './ui/label/label.svelte'

	interface Props {
		id: string
		label: string
		subTitle?: string
		checked: boolean
		disabled?: boolean
	}

	let { id, label, subTitle = '', checked = $bindable(), disabled = false }: Props = $props()
</script>

<div class={`flex max-w-lg items-center justify-between gap-4`}>
	<Label class={'w-24'} for={id}
		>{label}
		{#if subTitle}
			<span class="text-xs">{subTitle}</span>
		{/if}</Label>
	<Checkbox {disabled} bind:checked id="1" />
</div>
