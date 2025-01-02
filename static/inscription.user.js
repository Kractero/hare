// ==UserScript==
// @name        Inscribe Button Focuser
// @match       https://*.nationstates.net/*page=deck/card=*
// @grant       none
// @version     1.0
// @author      Kractero
// @description Focus inscribe button
// ==/UserScript==

if (document.querySelector("button[name='confirm_modify_my_card']"))
	document.querySelector("button[name='confirm_modify_my_card']").focus()
