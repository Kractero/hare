import { z } from 'zod'

const userAgent = z
	.string()
	.max(40, 'Nation name must be 40 characters or less')
	.refine(
		name => name.split(/[\s\-]+/).every(word => word.length <= 26),
		'Each word within the nation name must be no longer than 26 characters'
	)

export const creationSchema = z.object({
	useragent: userAgent,
	puppets: z.string(),
})

export const approvalSchema = z.object({
	useragent: userAgent,
	council: z.enum(['General Assembly', 'Security Council']),
	proposalid: z.string(),
	// proposalid: z.number({ coerce: true }),
})

const deckCommon = {
	mode: z.enum(['Signal', 'IDs']),
	duplicates: z.enum(['Skip', 'Include']),
	useragent: userAgent,
}

export const deckSchema = z.discriminatedUnion('type', [
	z.object({
		type: z.literal('Deck'),
		checkObject: userAgent,
		...deckCommon,
	}),
	z.object({
		type: z.literal('Collection'),
		checkObject: z.number({ coerce: true }),
		...deckCommon,
	}),
])
