<script lang="ts">
	import FormInput from '../FormInput.svelte'

	export let main: string
	export let errors: Array<{ field: string | number; message: string }>
</script>

<FormInput
	bind:bindValue={main}
	bind:errors
	id="ua"
	label="User Agent"
	placeholder="Main Nation"
	required={true}
	subTitle={'(Main Nation)'}
/>
