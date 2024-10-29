<script lang="ts">
	import FormTextArea from '$lib/components/FormTextArea.svelte'

	interface Props {
		puppets: string;
	}

	let { puppets = $bindable() }: Props = $props();
</script>

<FormTextArea bind:bindValue={puppets} id="pup" label="Puppets" required={true} />
