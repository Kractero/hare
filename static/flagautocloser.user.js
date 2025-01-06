// ==UserScript==
// @name        Flag Uploader Close Settings Page
// @match       https://www.nationstates.net/*page=settings*
// @grant       window.close
// @version     1.0
// @author      Kractero
// @description Close settings page if referred to by upload flag for Hare
// ==/UserScript==

if (document.referrer.includes('page=upload_flag')) window.close()
