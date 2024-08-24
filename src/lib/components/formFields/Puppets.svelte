<script lang="ts">
	import FormTextArea from '$lib/components/FormTextArea.svelte'

	export let puppets: string
</script>

<FormTextArea bind:bindValue={puppets} id="pup" label="Puppets" required={true} />
