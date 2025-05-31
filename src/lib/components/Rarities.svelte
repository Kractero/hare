<script lang="ts">
	import FormInput from '$lib/components/FormInput.svelte'

	interface Props {
		label: string
		rarities: { common: number; uncommon: number; rare: number; 'ultra-rare': number; epic: number }
	}

	let { label, rarities = $bindable() }: Props = $props()
</script>

<p class="w-24">{label}</p>
<div class="flex flex-col gap-4">
	<div class="flex max-w-lg items-center justify-between gap-4">
		<FormInput label={'Common'} bind:bindValue={rarities.common} id="common" required={true} />
	</div>
	<div class="flex max-w-lg items-center justify-between gap-4">
		<FormInput label={'Uncommon'} bind:bindValue={rarities.uncommon} id="uncommon" required={true} />
	</div>
	<div class="flex max-w-lg items-center justify-between gap-4">
		<FormInput label={'Rare'} bind:bindValue={rarities.rare} id="rare" required={true} />
	</div>
	<div class="flex max-w-lg items-center justify-between gap-4">
		<FormInput label={'Ultra-Rare'} bind:bindValue={rarities['ultra-rare']} id="ultra-rare" required={true} />
	</div>
	<div class="flex max-w-lg items-center justify-between gap-4">
		<FormInput label={'Epic'} bind:bindValue={rarities.epic} id="epic" required={true} />
	</div>
</div>
