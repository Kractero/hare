import { env } from '$env/dynamic/private'
import { env as pubEnv } from '$env/dynamic/public'

import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ request }) => {
	if (!env.API_KEY || !pubEnv.PUBLIC_LOGGING_SCRIPT) {
		return new Response(null, { status: 204 })
	}
	const requestJson = await request.json()
	const params = Object.fromEntries(new URLSearchParams(requestJson.url.search).entries())

	requestJson.page = requestJson.url.pathname
	requestJson.query = JSON.stringify(params)

	// Flask service for basic app/error logs
	const response = await fetch(`${pubEnv.PUBLIC_LOGGING_SCRIPT}/hare`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', 'X-API-KEY': env.API_KEY },
		body: JSON.stringify(requestJson),
	})

	return response
}
