<div align="center">
<h1>Hare</h1>
<img src="./static/hare.jpg"/>

<p>Run NationStates cards scripts (and others) through your web browser.</p>

![Svelte](https://img.shields.io/badge/svelte-%23f1413d.svg?style=for-the-badge&logo=svelte&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

</div>

Hare is a central repository for running various NationStates scripts directly in your browser. In the past, these scripts often required downloading external dependencies like Python, along with some know-how on installing those dependencies and then using the command line to execute them. Hare aims to solve this by moving all of this to just using your browser.

If you'd like to suggest a script for inclusion, feel free to join the Discord and ask, or open an issue on the repository.

Let's be honest—Hare isn't a backronym. It doesn't stand for **H**umble **A**utomated **R**unner for **E**xecuting NationStates Scripts or whatever mumbo jumbo I had previously. The project is named after Omagari Hare from Blue Archive.

If this tool has helped you, consider starring the repo or [gifting me a leg](https://www.nationstates.net/nation=kractero) (just kidding unless...).

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
