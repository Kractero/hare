<script lang="ts">
	import FormInput from '$lib/components/FormInput.svelte'

	export let rarities: any
	export let errors: Array<{ field: string | number; message: string }>
</script>

<div class="flex flex-col gap-4">
	<div class="flex max-w-lg items-center justify-between gap-4">
		<FormInput
			bind:errors
			placeholder="0.5"
			label={'Common'}
			bind:bindValue={rarities.common}
			id="common"
			required={true}
		/>
	</div>
	<div class="flex max-w-lg items-center justify-between gap-4">
		<FormInput
			bind:errors
			placeholder="1"
			label={'Uncommon'}
			bind:bindValue={rarities.uncommon}
			id="uncommon"
			required={true}
		/>
	</div>
	<div class="flex max-w-lg items-center justify-between gap-4">
		<FormInput
			bind:errors
			placeholder="1"
			label={'Rare'}
			bind:bindValue={rarities.rare}
			id="rare"
			required={true}
		/>
	</div>
	<div class="flex max-w-lg items-center justify-between gap-4">
		<FormInput
			bind:errors
			placeholder="1"
			label={'Ultra-Rare'}
			bind:bindValue={rarities['ultra-rare']}
			id="ultra-rare"
			required={true}
		/>
	</div>
	<div class="flex max-w-lg items-center justify-between gap-4">
		<FormInput
			bind:errors
			placeholder="1"
			label={'Epic'}
			bind:bindValue={rarities.epic}
			id="epic"
			required={true}
		/>
	</div>
</div>
