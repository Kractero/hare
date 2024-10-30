<script lang="ts">
	import Puppets from './formFields/Puppets.svelte'
	import UserAgent from './formFields/UserAgent.svelte'
	import FormInput from './FormInput.svelte'

	interface Props {
		main: string
		puppets: string
		authenticated: boolean
		password?: string
		errors: Array<{ field: string | number; message: string }>
	}

	let {
		main = $bindable(),
		puppets = $bindable(),
		authenticated,
		password = $bindable(''),
		errors = $bindable(),
	}: Props = $props()
</script>

<UserAgent bind:main bind:errors />
<Puppets bind:puppets />
{#if authenticated}
	<FormInput
		label={'Password'}
		bind:bindValue={password}
		id="pass"
		required={true}
		disabled={puppets.includes(',')}
		type="password"
	/>
{/if}
