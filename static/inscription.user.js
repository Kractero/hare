// ==UserScript==
// @name        Inscribe Button Focuser
// @match       https://*.nationstates.net/*page=deck/card=*
// @grant       window.close
// @version     1.1
// @author      Kractero
// @description Focus inscribe button
// ==/UserScript==

if (document.querySelector('.info')) {
	if (document.querySelector('.info').textContent.includes('Card inscribed!')) {
		window.close()
	}
}

if (document.querySelector("button[name='confirm_modify_my_card']"))
	document.querySelector("button[name='confirm_modify_my_card']").focus()
