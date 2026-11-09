import { error } from '@sveltejs/kit'

export const prerender = false

export function load() {
	throw error(410, 'The rarity tool has been removed.')
}
