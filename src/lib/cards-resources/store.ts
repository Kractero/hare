import { writable } from 'svelte/store';

export const filter = writable<string>("")
export const searchAuthor = writable<string>("")