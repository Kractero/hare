---
title: Containers vs Containerless
description: Comparing containers and containerless
url: comparison
author: Kractero
order: 3
category: overview
---

Containers are the traditional method that has been used in cards to streamline card farming by allowing the process of switching between nations to be done automatically via Firefox's native container system.

Containerless farming, as the name implies, is farming without containers. It uses a userscript which facilitates switching between various nations via logging in and logging out normally, rather than using isolated containers.

**Picking one does not mean you cannot use the other.**

### Why Containers

**Pros**:

1. Entirely separate profiles per puppet.
2. You can remain logged in to multiple nations at the same time.
3. Easy to swap between containers, just change the include container= or nation= with the name after the equals sign.
4. Can be used with other farming methods like RCES.

** Cons**:

1. Each container must manually pass border patrol.
2. Containers need to be signed into, and this must be refreshed every six months or so.
3. Setup is more involved, needing Firefox, container extension, and logging into containers.

### Why Containerless

**Pros**:

1. Only one border patrol to worry about
2. Only one login session to maintain
3. Less prerequisites (only userscript manager + one userscript, no browser restrictions)
4. You don't need to maintain a puppet list in an extension (you should have a list anyways though)

** Cons**:

1. Less flexible for ad-hoc puppet management (literally anything, from going to a puppet to sell a card, change settings), as the containerless script does not handle this. If you participate in **N-Day** or other site events, containers are likely necessary anyways.

2. Harder to manage or inspect specific nations individually.

3. Heavily integrated with Hare, more so than containers.

### Notes

**Is containerless slower or faster?**

Your mileage may vary, and it's still too early to say for sure. Despite an extra click per puppet to switch (which ironically actually sends more requests to NationStates), some have noticed that containerless may actually be faster - here are some reasons that may be the case.

1. The nature of containers is that they are isolated. The cookies, cache, browser storage are all isolated and must be loaded and dumped whenever a container is opened and closed. This can lead to a decrease in performance.

2. Resources are not cached between containers, meaning fonts, images, css stylesheets, etc. need to be re-requested per container.

3. The overhead of running cardtainers or containerise - this is likely negligible, but could play a role.
