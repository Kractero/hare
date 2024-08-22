<script lang="ts">
	import FormTextArea from '../FormTextArea.svelte'

	export let puppets: string
</script>

<FormTextArea
	bind:bindValue={puppets}
	id="pup"
	label="Puppets"
	placeholder="Puppets"
	required={true}
/>
