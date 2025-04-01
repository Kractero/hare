<div align="center">
<h1>Hare</h1>
<img src="./static/hare.jpg"/>

<p>Run NationStates cards scripts (and others) through your web browser.</p>

![Svelte](https://img.shields.io/badge/svelte-%23f1413d.svg?style=for-the-badge&logo=svelte&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

</div>

Hare is a center repository for running various NationStates scripts directly in your browser. In the past, these scripts often required downloading external dependencies like Python, along with some know-how on installing those dependencies and then using the command line to execute them. Hare aims to solve this by moving all of this to just using your browser.

If you'd like to suggest a script for inclusion, feel free to join the Discord and ask, or open an issue on the repository.

Let's be honest—Hare isn't a backronym. It doesn't stand for **H**umble **A**utomated **R**unner for **E**xecuting NationStates Scripts or whatever mumbo jumbo I had previously. The project is named after Omagari Hare from Blue Archive.

If this tool has helped you, consider starring the repo or [gifting me a leg](https://www.nationstates.net/nation=kractero) (just kidding unless...).

## Prerequisites

You'd be better off reading [here](https://hare.kractero.com/resources/guides/prereqs) but below is a brief look.

### A Userscript Manager

A userscript allows you to extend a website's functionality beyond what is available with the website's current scripts. All modern browsers support userscript managers. For ease of use, I suggest using TamperMonkey. However, if you prefer open-source software, ViolentMonkey is a good alternative.

Many scripts generate an HTML sheet that almost necessitates the use of an autocloser userscript. There are several varieties, some tailored for a specific tool, but for a general one for most card stuff (gotIssues) I'd recommend the following:

```js
// ==UserScript==
// @name autoclose=1
// @version 0.1
// @match https://*.nationstates.net/*page=enact_dilemma*
// @exclude https://*.nationstates.net/*page=show_dilemma*
// @icon https://www.google.com/s2/favicons?sz=64&domain=nationstates.net//
// @grant window.close
// ==/UserScript==

// @match on enact_dilemma as autoclose does not carry over to the issue answered screen
// @exclude on show_dilemma since autoclose should not close the new intermediary screen

;(function () {
	'use strict'
	window.close()
})()
```

A caveat with any autocloser is that it may interfere with normal gameplay. It's recommended to enable or disable it as needed, or alternatively, use a separate browser profile or browser to avoid disruptions.

### Containers (optional)

#### Mozilla Firefox

Only Firefox supports containers.

If you already use Firefox as your main browser, I suggest setting up a separate profile or using a different Firefox derivative (e.g., ESR, Nightly, Floorp, Waterfox) to avoid any mix-ups with your main nation.

#### Containers

Containers are a Firefox-only feature that allows you to create multiple mini profiles or sessions within one profile, each maintaining its own cookies and state. This means you can have one container for each nation, making it easy to manage many puppets.

I recommend using my [Cardtainers](https://addons.mozilla.org/en-US/firefox/addon/cardtainers/) addon, which automatically creates rules matching nations based on a puppet list. Alternatively, you can also use the Containerise addon to manually generate the necessary rules within the website.

## Ratelimits

All of these scripts run using **your** rate limit.

As stated in the [NationStates API documentation](https://www.nationstates.net/pages/api.html):

> The API is rate-limited and will temporarily lock you out if you send too many requests within a short period of time. (And return status 429: "Too Many Requests From Your IP Address.")
>
> **API Rate Limit:** 50 requests per 30 seconds.

Hare will attempt to balance the rate limit to prevent you from being locked out by adhering to NationStates' rate limits using various headers returned by NationStates. However, please refrain from intentionally trying to trigger a lockout.

## Attributions

"Reverse-engineering" these scripts into JavaScript and integrating them into a website is much easier than creating them from scratch.

Credit for the original source implementations goes to:

1. **[9003](https://github.com/jmikk)**

2. **[upc](https://github.com/nsupc)**

3. **[Spyglass](https://github.com/Derpseh/Spyglass)**

4. **[ValentineZ's Gold Retriever](https://forum.nationstates.net/viewtopic.php?f=42&t=476326)** and **[Racoda](https://github.com/dithpri)**'s [gold retriever](https://github.com/dithpri/goldretriever-web).

More attributions on the actual site on the relevant tool page.

Icons used from Icons8.

<hr>
