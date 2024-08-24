<script lang="ts">
	import Puppets from './formFields/Puppets.svelte'
	import UserAgent from './formFields/UserAgent.svelte'
	import FormInput from './FormInput.svelte'

	export let main: string
	export let puppets: string
	export let authenticated: boolean
	export let password: string = ''
	export let errors: Array<{ field: string | number; message: string }>
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
