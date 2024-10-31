<script lang="ts">
	import FormInput from '$lib/components/FormInput.svelte'

	interface Props {
		main: string
		errors: Array<{ field: string | number; message: string }>
	}

	let { main = $bindable(), errors = $bindable() }: Props = $props()
</script>

<FormInput bind:bindValue={main} bind:errors id="ua" label="User Agent" required={true} subTitle={'(Main Nation)'} />
