import { writable } from 'svelte/store'
import { pushState } from '$app/navigation'
import { z } from 'zod'

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
	return `generated_by=Hare_${tool}__author_main_nation_Kractero__usedBy_${main}`
}

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

export function timeAgo(date: string) {
	const now = new Date()
	const createdDate = new Date(date)

	const yearsDiff = now.getFullYear() - createdDate.getFullYear()
	const monthsDiff = now.getMonth() - createdDate.getMonth()
	const daysDiff = now.getDate() - createdDate.getDate()

	let years = yearsDiff
	let months = monthsDiff
	let days = daysDiff

	if (days < 0) {
		months -= 1
		days += new Date(now.getFullYear(), now.getMonth(), 0).getDate()
	}
	if (months < 0) {
		years -= 1
		months += 12
	}

	const yearsStr = years > 0 ? `${years} year${years > 1 ? 's' : ''} ` : ''
	const monthsStr = months > 0 ? `${months} month${months > 1 ? 's' : ''} ` : ''
	const daysStr = days > 0 ? `${days} day${days > 1 ? 's' : ''} ` : ''

	return `${yearsStr}${monthsStr}${years < 1 && months < 1 ? daysStr : ''} ago`.trim()
}
