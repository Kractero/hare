import { writable } from 'svelte/store'
import { pushState } from '$app/navigation'
import { z } from 'zod'

export const semverVersion = '5.4.3'
export const calverVersion = '2024.02.02'

export const domain = writable()

export const pushHistory = (params: string) => {
	const currentURL = window.location.href
	const baseURL = currentURL.split('?')[0]
	pushState(`${baseURL}${params}`, `${baseURL}${params}`)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const beforeUnload = (e: any) => {
	const message = 'Are you sure you want to leave?'
	e.returnValue = message
	return message
}

export const urlParameters = (tool: string, main: string) => {
	return `generated_by=Hare__v${calverVersion}_${tool}__author_main_nation_Kractero__usedBy_${main}`
}

export const userAgent = z
	.string()
	.max(40, 'Nation name must be 40 characters or less')
	.refine(
		name => /^[a-zA-Z0-9\s\-_]+$/.test(name),
		'Sorry! Nation names can only contain Latin letters, numbers, spaces, and hyphens.'
	)
	.refine(
		name => name.split(/[\s-]+/).every(word => word.length <= 26),
		'Each word within the nation name must be no longer than 26 characters'
	)

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

// export const canonicalize = (str: string) => str.toLowerCase().replace(' ', '_')
