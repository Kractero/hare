import { parseXML } from '$lib/helpers/parser'

export interface GiftParams {
	url: string
	main: string
	cnx: string
	nsp?: string
	password?: string
	specificGiftee: string
}

export async function giftCard({
	url,
	main,
	cnx,
	nsp,
	password,
	specificGiftee,
}: GiftParams): Promise<{ cnx: string; giftee: string; fail: string }> {
	const fetchUrl = `${url}&to=${specificGiftee}&mode=`

	const authPassword = nsp || password || ''
	const authXpin = cnx || ''

	const prepare = await parseXML(`${fetchUrl}prepare&c=giftcard`, main, cnx ? '' : authPassword, authXpin)
	if (!cnx) cnx = prepare['x-pin'] || ''
	const token = prepare.NATION.SUCCESS

	const result = await parseXML(`${fetchUrl}execute&c=giftcard&token=${token}`, main, '', cnx)

	let failureReason = ''
	if (result.NATION?.ERROR) {
		if (result.NATION.ERROR.includes('capacity')) {
			failureReason = 'no capacity'
		} else if (result.NATION.ERROR.includes('pay the transfer fee')) {
			failureReason = 'not enough bank'
		} else {
			failureReason = result.NATION.ERROR
		}
	}

	return { cnx, giftee: specificGiftee, fail: failureReason }
}
