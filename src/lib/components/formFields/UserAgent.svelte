<script lang="ts">
	import FormInput from '../FormInput.svelte'

	export let main: string
	export let errors: Array<{ field: string | number; message: string }>
</script>

<FormInput
	bind:bindValue={main}
	id="ua"
	label="User Agent"
	placeholder="Main Nation"
	required={true}
	subTitle={'(Main Nation)'}
/>

{#if errors.length > 0 && errors.find(error => error.field === 'useragent')}
	<p class="text-sm font-medium text-destructive">
		{errors.find(error => error.field === 'useragent')?.message}
	</p>
{/if}
