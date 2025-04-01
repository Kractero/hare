import { API_KEY } from '$env/static/private'
import { PUBLIC_LOGGING_SCRIPT } from '$env/static/public'

import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ request }) => {
	const requestJson = await request.json()
	const params = Object.fromEntries(new URLSearchParams(requestJson.url.search).entries())

	requestJson.page = requestJson.url.pathname
	requestJson.query = JSON.stringify(params)

	// Flask service for basic app/error logs
	const response = await fetch(`${PUBLIC_LOGGING_SCRIPT}/hare`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', 'X-API-KEY': API_KEY },
		body: JSON.stringify(requestJson),
	})

	return response
}
