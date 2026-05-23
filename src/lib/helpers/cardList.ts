export type CardListEntry = {
	id: string
	season: string
	extra: string[]
}

export function parseCardList(value: string): CardListEntry[] {
	return value
		.split('\n')
		.map(line => line.trim())
		.filter(Boolean)
		.map(line => {
			const [id = '', season = '', ...extra] = line.split(',').map(part => part.trim())
			return { id, season, extra }
		})
}

export function cardListEntryMatches(entry: CardListEntry, id: string | number, season: string | number): boolean {
	if (entry.id !== String(id)) return false
	return !entry.season || entry.season === String(season)
}
