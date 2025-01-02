// ==UserScript==
// @name        Inscribe Button Focuser
// @match       https://www.nationstates.net/page=deck/card=*/season=4/?modify_my_card=1
// @grant       none
// @version     1.0
// @author      Kractero
// @description Focus inscribe button
// ==/UserScript==

document.querySelector("button[name='confirm_modify_my_card']").focus()
