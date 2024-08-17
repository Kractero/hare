export const pushHistory = (params: string) => {
	const currentURL = window.location.href;
	const baseURL = currentURL.split('?')[0];
	window.history.pushState(null, '', `${baseURL}${params}`);
};

import { XMLParser } from 'fast-xml-parser';

export const parser = new XMLParser({ ignoreAttributes: false });

export function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function parseXML(url: string, userAgent: string, password?: string) {

	const headers: Record<string, string> = {
		'User-Agent': `Used by ${userAgent} with Hare, written by Kractero`
	};

	if (password) {
		headers['X-Password'] = password;
	}

	const response = await fetch(`${url}&userAgent=${userAgent} using Hare by Kractero`, {
		method: 'GET',
		headers
	});

    const ratelimitRemaining = Number(response.headers.get("RateLimit-Remaining"));
    const ratelimitReset = Number(response.headers.get("RateLimit-Reset"));
    const retryAfter = Number(response.headers.get('Retry-After'));

	if (response.status === 404) {
		return { status: `failed with error code 404` };
	}

	if (response.status === 409) {
		return { status: `failed with error code 409` };
	}

    if (response.status === 429) {
        const waitTime = retryAfter > 0 ? retryAfter : (ratelimitReset / ratelimitRemaining);
        await sleep(waitTime * 1000);
        return await parseXML(url, userAgent, password ? password : '');
    }

    if (ratelimitRemaining > 0) {
        await sleep((ratelimitReset / ratelimitRemaining) * 1000);
    } else {
        await sleep(ratelimitReset * 1000);
    }

	const xml = await response.text();
	const xmlObj = parser.parse(xml);
	return xmlObj;
}
