<script lang="ts">
	import Input from "./Input.svelte";
	import Textarea from "./Textarea.svelte";
	export let main: string;
	export let puppets: string;
	export let authenticated: boolean;
	export let password: string = '';
</script>

<Input text={`User Agent`} bind:bindValue={main} forValue="main" required />
<Textarea text="Puppets" bind:bindValue={puppets} forValue="pup" required />
{#if authenticated}
	<div class="flex gap-4 justify-between max-w-lg">
		<label class="w-24" for="main">Password</label>
		<input
			id="pass"
			disabled={puppets.includes(',')}
			bind:value={password}
			required={true}
			title={puppets.includes(',')
				? 'A comma is detected in the puppet list, assuming that format.'
				: ''}
			class="text-right text-black p-2 max-w-xs rounded-md border border-black dark:border-none disabled:opacity-25"
		/>
	</div>
{/if}
