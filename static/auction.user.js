// ==UserScript==
// @name        Hare Auction
// @namespace   Kractero
// @match       https://www.nationstates.net/*page=deck/card=*/season=*
// @grant       window.close
// @version     1.1
// @author      Kractero
// ==/UserScript==

;(function () {
	'use strict'

	const referrer = document.referrer ? new URL(document.referrer) : null
	const referrerMode = referrer ? referrer.searchParams.get('mode') : null
	if (referrerMode) {
		if (document.querySelector('.info') && document.querySelector('.info').textContent.includes('has been lodged'))
			window.close()
	}

	const uuurl = new URL(window.location.href)
	const amount = uuurl.searchParams.get('amount').split('?')[0]
	const mode = uuurl.searchParams.get('mode')

	if (mode === 'ask') {
		document.querySelector('#cardauctionoffertable').classList.add('mode-sell')
		if (amount && Number(amount) > 0) {
			document.querySelector('input.auctionbid[name="auction_ask"]').value = amount
		}
		document.querySelectorAll('#cardauctionoffertable button')[0].focus()
	}

	if (mode === 'bid') {
		document.querySelector('#cardauctionoffertable').classList.add('mode-buy')
		if (amount && Number(amount) > 0) {
			document.querySelector('input.auctionbid[name="auction_bid"]').value = amount
		}
		document.querySelectorAll('#cardauctionoffertable button')[1].focus()
	}
})()
