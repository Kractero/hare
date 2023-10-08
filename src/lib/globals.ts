import { XMLParser } from 'fast-xml-parser';

export const parser = new XMLParser({ ignoreAttributes: false });

export function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function parseXML(url: string, userAgent: string) {
	let response = await fetch(url, {
		method: 'GET',
		headers: {
			'User-Agent': userAgent
		}
	});
	const xml = await response.text();
	const xmlObj = parser.parse(xml);
	return xmlObj;
}
