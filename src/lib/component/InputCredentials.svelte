<script lang="ts">
	export let main: string;
	export let puppets: string;
	export let authenticated: boolean;
	export let password: string = '';
</script>

<div class="flex gap-4 justify-between max-w-lg">
	<label class="w-24" for="main">User Agent</label>
	<input
		required
		id="main"
		bind:value={main}
		class="text-right text-black p-2 max-w-xs rounded-md border border-black dark:border-none"
	/>
</div>
<div class="flex gap-4 justify-between max-w-lg">
	<label class="w-24" for="pup">Puppets</label>
	<textarea
		required
		id="pup"
		rows="10"
		bind:value={puppets}
		class="text-right text-black p-2 w-96 rounded-md border border-black dark:border-none"
	/>
</div>
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
