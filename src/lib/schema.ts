import { z } from 'zod'

export const userAgent = z
	.string()
	.max(40, 'Nation name must be 40 characters or less')
	.refine(
		name => name.split(/[\s\-]+/).every(word => word.length <= 26),
		'Each word within the nation name must be no longer than 26 characters'
	)

// export const creationSchema = z.object({
// 	useragent: userAgent,
// 	puppets: z.string().min(1),
// })

// export const approvalSchema = z.object({
// 	useragent: userAgent,
// 	council: z.enum(['General Assembly', 'Security Council']),
// 	proposalid: z.string().min(1),
// 	// proposalid: z.number({ coerce: true }),
// })

// const deckCommon = {
// 	mode: z.enum(['Signal', 'IDs']),
// 	duplicates: z.enum(['Skip', 'Include']),
// 	useragent: userAgent,
// }

// export const deckSchema = z.discriminatedUnion('type', [
// 	z.object({
// 		type: z.literal('Deck'),
// 		checkObject: userAgent,
// 		...deckCommon,
// 	}),
// 	z.object({
// 		type: z.literal('Collection'),
// 		checkObject: z.coerce.number().positive(),
// 		...deckCommon,
// 	}),
// ])

// export const endotartSchema = z.object({
// 	useragent: userAgent,
// 	endotarter: userAgent,
// 	limit: z.coerce.number().positive(),
// 	immune: z.string().min(1),
// 	source: z.enum(['XML', 'API']),
// })

// const seasonSchema = z.union([z.literal(1), z.literal(2), z.literal(3)])

// const finderLineSchema = z.union([
// 	z.coerce.number().positive(),
// 	z
// 		.string()
// 		.regex(/^\d+,\d$/, "Must be in the format 'CARDID,SEASON'")
// 		.refine(line => {
// 			const [cardId, season] = line.split(',')
// 			return (
// 				z.coerce.number().positive().safeParse(cardId).success &&
// 				seasonSchema.safeParse(Number(season)).success
// 			)
// 		}),
// 	z
// 		.string()
// 		.regex(/^\d+,\d,[^,]+$/, "Must be in the format 'CARDID,SEASON,GIFTTO'")
// 		.refine(line => {
// 			const [cardId, season] = line.split(',')
// 			return (
// 				z.coerce.number().positive().safeParse(cardId).success &&
// 				seasonSchema.safeParse(Number(season)).success
// 			)
// 		}),
// ])

// const finderListSchema = z.string().refine(
// 	value => {
// 		const lines = value.split('\n').filter(line => line.trim().length > 0)
// 		return lines.every(line => finderLineSchema.safeParse(line).success)
// 	},
// 	{
// 		message:
// 			"Each line must be either 'CARDID' or 'CARDID,SEASON', or 'CARDID, SEASON,GIFTTO' with season being 1, 2, or 3 and GIFTTO being a valid nation.",
// 	}
// )

// export const finderSchema = z.object({
// 	useragent: userAgent,
// 	puppets: z.string(),
// 	giftto: userAgent,
// 	finderlist: finderListSchema,
// 	mode: z.enum(['Gift', 'Sell']),
// })

// export const flagSchema = z.discriminatedUnion('mode', [
// 	z.object({
// 		mode: z.literal('Flags'),
// 		useragent: userAgent,
// 		puppets: z.string(),
// 		flags: z.string(),
// 		mottos: z.undefined(),
// 	}),
// 	z.object({
// 		mode: z.literal('Motto'),
// 		useragent: userAgent,
// 		puppets: z.string(),
// 		flags: z.undefined(),
// 		mottos: z.string(),
// 	}),
// ])

// export const grSchema = z.object({
// 	useragent: userAgent,
// 	puppets: z.string(),
// 	mode: z.enum(['Include', 'Skip']),
// 	transferCard: z
// 		.string()
// 		.optional()
// 		.refine(
// 			value => {
// 				if (!value) return true

// 				const parts = value.split(',')
// 				if (parts.length !== 2) return false

// 				const [id, season] = parts
// 				const idIsValid = !isNaN(Number(id))
// 				const seasonIsValid = ['1', '2', '3'].includes(season.trim())

// 				return idIsValid && seasonIsValid
// 			},
// 			{
// 				message: "The transfer card must formatted like 'id,season'",
// 			}
// 		),
// })

// export const giSchema = z.object({
// 	useragent: userAgent,
// 	puppets: z.string(),
// 	mode: z.enum(['Both', 'Issues', 'Packs']),
// 	issuesCount: z.enum(['1', '2', '3', '4', '5']),
// })

// export const raritiesSchema = z.object({
// 	common: z.coerce.number().positive(),
// 	uncommon: z.coerce.number().positive(),
// 	rare: z.coerce.number().positive(),
// 	'ultra-rare': z.coerce.number().positive(),
// 	epic: z.coerce.number().positive(),
// })

// export const jdjSchema = z.object({
// 	useragent: userAgent,
// 	puppets: z.string(),
// 	finderlist: finderListSchema,
// 	regionWhiteList: z.string(),
// 	flagWhiteList: z.string(),
// 	cardCount: z.coerce.number().positive(),
// 	ownerCount: z.coerce.number().positive(),
// 	raritiesMV: raritiesSchema,
// 	raritiesLowestBid: raritiesSchema,

// 	mode: z.enum(['Both', 'Issues', 'Packs']),
// 	issuesCount: z.enum(['1', '2', '3', '4', '5']),
// })
