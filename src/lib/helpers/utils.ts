export const pushHistory = (params: string) => {
    const currentURL = window.location.href;
    const baseURL = currentURL.split('?')[0];
    window.history.pushState(null, '', `${baseURL}${params}`);
}

import { XMLParser } from 'fast-xml-parser';

export const parser = new XMLParser({ ignoreAttributes: false });

export function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function parseXML(url: string, userAgent: string, password?: string) {
	const headers: Record<string, string> = {
		'User-Agent': userAgent
	};

	if (password) {
		headers['X-Password'] = password;
	}

	const response = await fetch(url, {
		method: 'GET',
		headers
	});

	const xml = await response.text();
	const xmlObj = parser.parse(xml);
	return xmlObj;
}
