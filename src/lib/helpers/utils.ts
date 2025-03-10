import { writable } from 'svelte/store'
import { pushState } from '$app/navigation'

export const semverVersion = '5.5.8'
export const calverVersion = '2024.03.05'

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

export function checkUserAgent(ua: string) {
	if (ua.length > 40) {
		return [{ field: 'useragent', message: 'Nation name must be 40 characters or less' }]
	}

	if (!/^[a-zA-Z0-9\s\-_]+$/.test(ua)) {
		return [
			{
				field: 'useragent',
				message: 'Sorry! Nation names can only contain Latin letters, numbers, spaces, and hyphens.',
			},
		]
	}

	if (ua.split(/[\s-]+/).some(word => word.length > 26)) {
		return [{ field: 'useragent', message: 'Each word within the nation name must be no longer than 26 characters' }]
	}

	return []
}

export const canonicalize = (str: string) => str.toLowerCase().replaceAll(' ', '_')
