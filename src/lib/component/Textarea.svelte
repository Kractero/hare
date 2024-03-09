<script lang="ts">
    export let text: string;
    export let bindValue: string | number | undefined;
    export let forValue: string;
    export let required: boolean = false;
	export let disabled: boolean = false;
</script>

<div class="flex gap-4 justify-between max-w-lg">
	<label class="w-24" for={forValue}>{text}</label>
	<textarea
		required={required}
		id={forValue}
		disabled={disabled}
		rows="10"
		bind:value={bindValue}
		class="text-right text-black p-2 w-96 rounded-md border border-black dark:border-none dark:bg-neutral-300"
	/>
</div>