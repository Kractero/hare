import { writable } from 'svelte/store'
import { pushState } from '$app/navigation'
import { z } from 'zod'

export const semverVersion = '5.5.7'
export const calverVersion = '2024.03.05'

export const domain = writable()

export const pushHistory = (params: string) => {
	const currentURL = window.location.href
	const baseURL = currentURL.split('?')[0]
	pushState(`${baseURL}${params}`, `${baseURL}${params}`)
	log('tool')
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

export const canonicalize = (str: string) => str.toLowerCase().replaceAll(' ', '_')

export async function log(trigger?: string, errorMessage?: string) {
	const data: {
		url: URL
		referrer: string
		siteVersion: string
		trigger: string
		timestamp: string
		errorMessage?: string
	} = {
		url: new URL(window.location.href),
		referrer: document.referrer || 'hare',
		siteVersion: calverVersion,
		trigger: trigger || 'navigation',
		timestamp: new Date().toISOString(),
	}

	if (errorMessage) data.errorMessage = errorMessage || ''

	await fetch('/api/athena', {
		method: 'POST',
		body: JSON.stringify(data),
	})
}
