import { type ZodObject } from 'zod'

export function validate(formSchema: ZodObject<any>, object: { [key: string]: any }) {
	const validate = formSchema.safeParse(object)
	if (!validate.success) {
		return validate.error.errors.map(error => {
			return {
				field: error.path[0],
				message: error.message,
			}
		})
	}
	return []
}
