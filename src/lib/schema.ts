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
