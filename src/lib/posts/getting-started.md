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
</script>

Hare is a powerful tool that centralizes many browser-executable scripts, which typically otherwise would require Python installation and some knowledge of running Python scripts. This guide will walk you through setting up Hare and getting started with card farming, especially if you're new to the process.

If you haven't already, I recommend reading the <a href="prereqs" target="_blank">prereqs</a> so you have what you need.

There are two primary means to farm: without containers (**containerless**) or with containers. Containerless is newer, containers are the older way of farming.

**Containers** use Firefox's container feature and have been the standard method for a while, but has been affected by NationStates's recent addition of border patrol. **Containerless** just uses a userscript and is a lot easier to setup.

<div class="flex not-prose">
  <Post description={comparison.description} title={comparison.title} url={comparison.url} />
</div>

## Choose a Method

<div class="flex not-prose gap-4">
  <Post description={containerless.description} title={containerless.title} url={containerless.url} />
  <Post description={containers.description} title={containers.title} url={containers.url} />
</div>

### Configuration

If you find yourself using Hare's services a lot, it would help to visit <a href="/config" target="_blank" rel="noreferrer noopener">the configuration page</a> to store values for multiple sessions. This saves time and streamlines your workflow.
