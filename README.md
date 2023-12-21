# Hare

**H**umble **A**utomated **R**unner for **E**xecuting NationStates Scripts 

A central repository to running a variety of NationStates in the browser. 

The next step in my endless quest to make NationStates scripts more easy to use. These scripts would commonly have required downloading external dependencies like Python and some knowledge of installing dependencies or the command line in the browser.

If you would like script inclusion, either join the discord and ask or make an issue.

If this tool helped, star the repo or [gift me a leg](https://www.nationstates.net/nation=kractero) (joking, unless...)

All icons were taken from [Icons8](https://icons8.com/icons).

## NOTE

### Prerequisites
A lot of the scripts generate an html sheet that almost necessitate the use of an autocloser userscript. There are a lot of varieties but I'd recommend:
```js
// ==UserScript==
// @name         autoclose=1
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       9003
// @match         *://*/*autoclose=1
// @exclude      https://www.nationstates.net/*page=show_dilemma*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nationstates.net// 
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    window.close();
    // Your code here...
})();
```

A caveat to any autocloser is that it is expected to interfere with normal gameplay, so enable or disable it when needed or use a separate browser profile or browser. Others may require different scripts, I have included them on each page.

Most of these sheet-based userscripts require the use of containers. I want to shill my [Cardtainers](https://addons.mozilla.org/en-US/firefox/addon/cardtainers/), which will automatically create rules that match nations given a puppet list, whether you prefer container or nation, but you can use Containerise and generate the rules necessary within the website.

### Ratelimits
All of these scripts are running using YOUR rate limit. It is done this way in order to utilize the user's rate limit instead of a shared one from the IP address of the server host, which would introduce tons of complexity.

AS STATED FROM [HERE](https://www.nationstates.net/pages/api.html):

>The API is rate-limited and will temporarily lock you out if you send too many requests within a short period of time. (And return status 429: "Too Many Requests From Your IP Address.")
>
>API Rate Limit: 50 requests per 30 seconds. 

Hare will try and balance the rate limit to prevent you from being locked out by waiting the requested amount from NationStates, but please don't intentionally try and cause it.

### Attributions
"Reverse-engineering" these scripts into JavaScript and plopping them inside a website is a lot easier than making them originally. 

Credit for the original source implementations below:

1. [9003](https://github.com/jmikk) for the python version of [gotIssues](https://github.com/jmikk/gotIssues), [junkdajunk](https://github.com/jmikk/Card-Proccessor), [Approval List](https://github.com/jmikk/Approval-List), [Where's My Wa](https://github.com/jmikk/WheresMyWA).

2. [upc](https://github.com/nsupc) for the initial inspiration from the [Endotart and NEN cogs](https://github.com/nsupc/UPC-3PO/blob/main/cogs/nsinfo.py).

3. [Spyglass](https://github.com/Derpseh/Spyglass) for the python version of Spyglass.

4. [ValentineZ's Gold Retriever](https://forum.nationstates.net/viewtopic.php?f=42&t=476326) and [Racoda](https://github.com/dithpri)'s [gold retriever](https://github.com/dithpri/goldretriever-web)

5. [Rootabeta](https://github.com/rootabeta) for [DeathWatch](https://github.com/rootabeta/DeathWatch), while I didn't utilize the source code to make Wiz, its existence gave me the idea to make my own version.

<hr>

### Stack

![Svelte](https://img.shields.io/badge/svelte-%23f1413d.svg?style=for-the-badge&logo=svelte&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

<hr>

If you read this far, you have been greeted by the engineering wunderkind of Veritas, the hackers of the Millenium Science School.

![Hare](https://static.miraheze.org/bluearchivewiki/4/47/Hare.png?20210217174626)
