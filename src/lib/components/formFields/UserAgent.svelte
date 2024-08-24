<script lang="ts">
	import FormInput from '$lib/components/FormInput.svelte'

	export let main: string
	export let errors: Array<{ field: string | number; message: string }>
</script>

<FormInput
	bind:bindValue={main}
	bind:errors
	id="ua"
	label="User Agent"
	required={true}
	subTitle={'(Main Nation)'}
/>
