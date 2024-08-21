<script lang="ts">
	import FormField from '../FormField.svelte'

	export let puppets: string
</script>

<FormField
	type="textarea"
	bind:bindValue={puppets}
	id="pup"
	label="Puppets"
	placeholder="Puppets"
	required={true}
/>
