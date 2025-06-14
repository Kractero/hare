---
title: Containerless
description: Avoiding the border patrol
url: containerless
author: Kractero
order: 5
category: containerless
---

<script>
    import Post from "$lib/components/Post.svelte";

    const gotIssues = {
        description: "Using gotIssues to farm",
        title: "gotIssues",
        url: "/guides/gotIssues"
    }
</script>

Containerless farming, as the name implies, is farming without containers. It uses a userscript which facilitates switching between various nations via logging in and logging out normally, rather than using isolated containers.

**Requires:**

- <a href="/resources/guides/prereqs">Userscript Monkey</a>

### Farming Containerless

For years, containers have been the standard farming method, popularized by Racoda, as they allow each nation to be accessed separately in its own container. However, with containerless, you remain logged into one nation at a time and switch between them similar to how R/D switching works (I don't R/D so this may be a lie).

Containerless farming also offers more flexibility, as it can be used in any browser that supports userscripts (although why would you, Firefox works fine)

To do this:

1. Install https://raw.githubusercontent.com/Kractero/userscripts/refs/heads/main/scs.user.js, likely the permanent link, watch for updates (shouldnt be too frequent after the initial bit)

2. On lines ten and eleven, set your main nation and password. Multi-password setups (where puppets have different passwords) are not supported at the moment.

3. If you are using containers, disable them. To do so, enter about:addons in the address bar and flip the toggle for containerise/cardtainers), or use a browser that doesn't have containers.

### Next Steps

With containerless setup, you can use the core tool for speeding up the process of answering issues and opening packs, gotIssues.

<div class="flex not-prose">
  <Post description={gotIssues.description} title={gotIssues.title} url={gotIssues.url} />
</div>
