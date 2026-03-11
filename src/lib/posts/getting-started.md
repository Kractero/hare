---
title: Farming with Hare
description: Getting started with Hare
url: getting-started
author: Kractero
order: 2
category: overview
---

<script>
	import Post from "$lib/components/Post.svelte";

  const comparison = {
    description: "Method Comparison",
    title: "Containers vs Containerless",
    url: "/guides/comparison"
  }

  const containers = {
    description: "Setting up Containers",
    title: "Container Setup",
    url: "/guides/containers"
  }

  const containerless = {
    description: "Setting up Containerless",
    title: "Containerless Setup",
    url: "/guides/containerless"
  }

    const gotIssues = {
        description: "Using gotIssues to farm",
        title: "gotIssues",
        url: "/guides/gotissues"
    }
</script>

Hare is a powerful tool that centralizes many browser-executable scripts, which typically otherwise would require Python installation and some knowledge of running Python scripts. This guide will walk you through setting up Hare and getting started with card farming, especially if you're new to the process.

If you haven't already, I recommend reading the <a href="prereqs" target="_blank">prereqs</a> so you have what you need.

<!-- There are two primary means to farm: without containers (**containerless**) or with containers. Containerless is newer, containers are the older way of farming.

**Containers** use Firefox's container feature and have been the standard method for a while, but has been affected by NationStates's recent addition of border patrol. **Containerless** just uses a userscript and is a lot easier to setup.

<div class="flex not-prose">
  <Post description={comparison.description} title={comparison.title} url={comparison.url} />
</div>

## Choose a Method

<div class="flex not-prose gap-4">
  <Post description={containerless.description} title={containerless.title} url={containerless.url} />
  <Post description={containers.description} title={containers.title} url={containers.url} />
</div> -->

**Requires:**

- <a href="/resources/guides/prereqs">Userscript Monkey</a>

<!-- ### Farming Containerless

For years, containers have been the standard farming method, popularized by Racoda, as they allow each nation to be accessed separately in its own container. However, with containerless, you remain logged into one nation at a time and switch between them similar to how R/D switching works (I don't R/D so this may be a lie).

Containerless farming also offers more flexibility, as it can be used in any browser that supports userscripts (although why would you, Firefox works fine) -->

Once you have a userscript manager setup, follow the below steps, or watch the video.

<video width="320" height="320" controls>
  <source src="/SCS.mp4" type="video/mp4">
</video>

1. Install https://raw.githubusercontent.com/Kractero/userscripts/refs/heads/main/scs.user.js, likely the permanent link, watch for updates (shouldnt be too frequent after the initial bit)

2. Run any Hare tool. A menu will pop up to enter your credentials. Once it's up, Simple Card Switcher will pop up the login menu. Put simply, SCS will detect if your current logged in nation matches the nation it expects, and login you in or out based on it, allowing you to swap between nations for farming/other tasks quickly.

3. If you are using containers, disable them. To do so, enter about:addons in the address bar and flip the toggle for containerise/cardtainers), or use a browser that doesn't have containers.

### Next Steps

After setup, you can use the core tool for speeding up the process of answering issues and opening packs, gotIssues.

<div class="flex not-prose">
  <Post description={gotIssues.description} title={gotIssues.title} url={gotIssues.url} />
</div>

### Configuration

If you find yourself using Hare's services a lot, it would help to visit <a href="/config" target="_blank" rel="noreferrer noopener">the configuration page</a> to store values for multiple sessions. This saves time and streamlines your workflow.

<!-- Containerless farming, as the name implies, is farming without containers. It uses a userscript which facilitates switching between various nations via logging in and logging out normally, rather than using isolated containers. -->
