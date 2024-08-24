import { z } from 'zod'

export const userAgent = z
	.string()
	.max(40, 'Nation name must be 40 characters or less')
	.refine(
		name => /^[a-zA-Z0-9\s\-\_]+$/.test(name),
		'Sorry! Nation names can only contain Latin letters, numbers, spaces, and hyphens.'
	)
	.refine(
		name => name.split(/[\s\-]+/).every(word => word.length <= 26),
		'Each word within the nation name must be no longer than 26 characters'
	)

// import { ZodDiscriminatedUnion, type ZodObject } from 'zod'

// export function validate(
// 	formSchema: ZodObject<any> | ZodDiscriminatedUnion<any, any>,
// 	object: { [key: string]: any }
// ) {
// 	const validate = formSchema.safeParse(object)
// 	if (!validate.success) {
// 		return validate.error.errors.map(error => {
// 			return {
// 				field: error.path[0],
// 				message: error.message,
// 			}
// 		})
// 	}
// 	return []
// }

export function checkUserAgent(ua: string) {
	const validate = userAgent.safeParse(ua)
	if (!validate.success) {
		return validate.error.errors.map(error => {
			return {
				field: 'useragent',
				message: error.message,
			}
		})
	}
	return []
}
