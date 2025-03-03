// ==UserScript==
// @name        Hare Auction
// @namespace   Kractero
// @match       https://*.nationstates.net/*page=deck/card=*
// @grant       window.close
// @version     1.4
// @author      Kractero
// ==/UserScript==

;(function () {
	'use strict'

	if (document.getElementById('switching')) return

	const referrer = document.referrer ? new URL(document.referrer) : null
	const referrerMode = referrer ? referrer.searchParams.get('mode') : null
	if (referrerMode) {
		if (document.querySelector('.info') && document.querySelector('.info').textContent.includes('has been lodged'))
			window.close()
	}

	const searchParams = new URLSearchParams(window.location.search)
	if (!searchParams.get('amount')) return
	const amount = searchParams.get('amount').split('?')[0]
	const mode = searchParams.get('mode')

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
