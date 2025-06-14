<script>
    import Post from "$lib/components/Post.svelte";
    import { non_md } from '$lib/helpers/md'

    const prereqs = {
        description: "Farming Prerequisites",
        title: "Prerequisites",
        url: "/guides/prereqs"
    }

    const farming = {
        description: "Farming with Hare",
        title: "Farming with Hare",
        url: "/guides/getting-started"
    }
</script>

# Hare Guides

Welcome to a collection of bad guides on card farming and how to use Hare.

## What is Hare?

Hare is a website for running NationStates scripts directly in your browser. In the past, these scripts often required downloading external dependencies like Python, along with some know-how on installing those dependencies and then using the command line to execute them. Hare centralizes these and makes them easier to run.

## New to Cards?

New to cards? Here are some general card guides.

<div class="flex flex-wrap gap-4 not-prose">
  {#each non_md as post}
    <Post title={post.title} description={post.description} url={post.url} />
  {/each}
</div>

## Getting Started with Hare

<div class="flex not-prose gap-4">
  <Post description={prereqs.description} title={prereqs.title} url={prereqs.url} />
  <Post description={farming.description} title={farming.title} url={farming.url} />
</div>

## Other Stuff

Join the <a href="https://discord.gg/JRnzyEzyp4" target="_blank">NSCards Discord</a> for cards discussion and technical help.

Telegram me for inquiries.

<a href="/disclaimer" target="_blank">Read the disclaimer.</a>
