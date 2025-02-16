---
title: Containerless
description: Avoiding the border patrol
url: containerless
author: Kractero
order: 5
---

With the recent implementation of Cloudflare verification checks (referred to as "border patrol" in NationStates terms), farming via containers has become significantly more cumbersome. Each container must individually pass the verification check, making the process tedious. However, container farming is still possible as you can manually complete the check for each container and continue farming as usual. That said, this is time-consuming, and there is a risk that Cloudflare's stored verification cookies could be cleared at any time, requiring re-verification.

### Farming Containerless

Containers have been recommended as the main way of farming since Racoda popularized them and are useful for allowing you to access any nation in its own container. With containerless, you are always logged into one nation and have to switch to the others, kind of similar to r/d switching. Containerless also allows you to use any browser that supports userscripts (although why would you, Firefox works fine)

To do this:

1. Install https://raw.githubusercontent.com/Kractero/hare/refs/heads/main/static/scs.user.js, likely the permanent link, watch for updates (shouldnt be too frequent after the initial bit)

2. On lines ten and eleven, set your main nation and password. Multi-password setups (where puppets have different passwords) are not supported at the moment.

3. Disable containers if using firefox (visit the url about:addons, flip the toggle for containerise/cardtainers), or use a browser that doesn't have containers.

### Notes

**Is containerless slower or faster?**

Despite an extra click per puppet (to switch, which ironically actually sends more requests to NationStates), some have noticed that containerless may actually be faster - here are some reasons that may be the case.

1. The nature of containers is that they are isolated. The cookies, cache, browser storage are all isolated and must be loaded and dumped whenever a container is opened and closed. This can lead to a decrease in performance.

2. Resources are not cached between containers, meaning fonts, images, css stylesheets, etc. need to be re-requested per container.

3. The overhead of running cardtainers or containerise - this is likely negligible, but could play a role.

**Why were containers used?**

1. Containers are powerful and let you manage multiple nations at once without needing to switch. You can have multiple nations open in the same instance, each logged in.

**What steps are now dead in containerless?**

You no longer need to run Login Sheet and manage container rules.
