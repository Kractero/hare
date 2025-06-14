---
title: Container Setup
description: Setting up Containers for Farming
url: containers
author: Kractero
order: 3
category: containers
---

<script>
    import Post from "$lib/components/Post.svelte";

    const gotIssues = {
        description: "Using gotIssues to farm",
        title: "gotIssues",
        url: "/guides/gotIssues"
    }
</script>

Containers are the traditional method that has been used in cards to streamline card farming by allowing the process of switching between nations to be done automatically via Firefox's native container system.

**Requires:**

- <a href="/resources/guides/prereqs">Userscript Monkey</a>
- Firefox
- Container Extension

## What is a container?

A container is an isolated instance within a browser, with its own cookies, sessions, and state, separate from other sessions or tabs. This means that for NationStates, you can configure multiple containers to be logged into different accounts simultaneously.

Containers are only supported in Firefox and Firefox-based browsers. This means that you will need to install and use Firefox for containers if you aren't already.

## 1. Install Firefox

<a href="https://www.mozilla.org/en-US/firefox/new/" rel="noopener noreferrer" target="_blank">Installing Firefox is quick and easy.</a>

## 2. Install a Container Extension

### Containerise

Containerise is the traditional choice for containers. Instead of rewriting an excellent guide, you can follow <a href="https://www.nationstates.net/page=dispatch/id=1383002" rel="noopener noreferrer" target="_blank">this guide by Racoda</a> to get started with Containerise.

If you're looking to avoid installing Python for generating rules, you can use <a href="https://hare.vercel.app/tools/containerise/" rel="noopener noreferrer" target="_blank">Hare's Containerise rule generator</a> or opting for <a href="/resources/guides/cardtainers" target="_blank" rel="noreferrer noopener">Cardtainers</a>.

### Cardtainers

Alternatively, you can use Cardtainers, which I made for cards. <a href="/resources/guides/cardtainers">Advert</a>

** Installing and Using Cardtainers**

<video width="320" height="320" controls>
  <source src="/Cardtainers.mp4" type="video/mp4">
</video>

<a href="https://addons.mozilla.org/en-US/firefox/addon/cardtainers/" target="_blank">Install Cardtainers.</a>

After installation, click the Cardtainers icon (Testlandia in a jar). Paste your list of puppets into the text input, formatted like this:

```plaintext
kazakhstan
norway
puppet farmer 1
```

### 3. Login into the Containers

<video width="320" height="320" controls>
  <source src="/Login.mp4" type="video/mp4">
</video>

Containers are useless if they are not logged into each nation.

1. To do this, visit the Hare tool <a href="/tools/login" target="_blank" rel="noreferrer noopener">Login Sheet</a> to generate a login sheet.

2. Make sure you install <a href="https://raw.githubusercontent.com/Kractero/userscripts/main/container-login/autologautoclose.user.js" target="_blank"> login autocloser </a> and <a href="https://raw.githubusercontent.com/Kractero/userscripts/main/container-login/autolog.user.js"> autolog </a> (autolog requires configuration and assumes all your nations have the same password, set your password at line 15 and make sure it is in quotes)

3. Once the sheet is generated, click Link to Nation and then click enter until the sheet is finished.

### Next Steps

With containerless setup, you can use the core tool for speeding up the process of answering issues and opening packs, gotIssues.

<div class="flex not-prose">
  <Post description={gotIssues.description} title={gotIssues.title} url={gotIssues.url} />
</div>
