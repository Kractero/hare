import { error } from '@sveltejs/kit'

export function load() {
	throw error(410, 'The rarity tool has been removed.')
}
