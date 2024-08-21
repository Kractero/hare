<script lang="ts">
	import FormField from '../FormField.svelte'

	export let main: string
</script>

<FormField
	type="input"
	bind:bindValue={main}
	id="ua"
	label="User Agent"
	placeholder="Main Nation"
	required={true}
	subTitle={'(Main Nation)'}
/>
