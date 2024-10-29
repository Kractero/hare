<script lang="ts">
	import { createBubbler } from 'svelte/legacy';

	const bubble = createBubbler();
	import type { HTMLTextareaAttributes } from "svelte/elements";
	import type { TextareaEvents } from "./index.js";
	import { cn } from "$lib/utils.js";

	type $$Props = HTMLTextareaAttributes;
	type $$Events = TextareaEvents;

	

	// Workaround for https://github.com/sveltejs/svelte/issues/9305
	
	interface Props {
		class?: $$Props["class"];
		value?: $$Props["value"];
		// Fixed in Svelte 5, but not backported to 4.x.
		readonly?: $$Props["readonly"];
		[key: string]: any
	}

	let { class: className = undefined, value = $bindable(undefined), readonly = undefined, ...rest }: Props = $props();
</script>

<textarea
	class={cn(
		"border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
		className
	)}
	bind:value
	{readonly}
	onblur={bubble('blur')}
	onchange={bubble('change')}
	onclick={bubble('click')}
	onfocus={bubble('focus')}
	onkeydown={bubble('keydown')}
	onkeypress={bubble('keypress')}
	onkeyup={bubble('keyup')}
	onmouseover={bubble('mouseover')}
	onmouseenter={bubble('mouseenter')}
	onmouseleave={bubble('mouseleave')}
	onpaste={bubble('paste')}
	oninput={bubble('input')}
	{...rest}
></textarea>
