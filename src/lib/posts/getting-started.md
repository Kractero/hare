---
title: Farming with Hare
description: Getting started with Hare
url: getting-started
author: Kractero
order: 2
---

Hare is a powerful tool that centralizes many browser-executable scripts, which typically otherwise would require Python installation and some knowledge of running Python scripts. This guide will walk you through setting up Hare and getting started with card farming, especially if you're new to the process.

Before diving into this guide, I recommend reading the [previous article](prereqs) for a foundational understanding. While there may be some overlap, this guide focuses specifically on how to leverage Hare for efficient farming.

## 1. A Userscript Manager

To extend a website's functionality and automate tasks, you'll need to install a userscript manager, like Tampermonkey

[Install TamperMonkey](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/) from the official Mozilla Firefox Add-ons site.

Once installed, click the TamperMonkey icon in your browser's toolbar Click "Create a new script" to open the script editor.

![add script to tampermonkey](https://raw.githubusercontent.com/Kractero/hare/main/static/guides/tampermonkey.png)

Paste your script into the editor window. lick the "File" menu and select "Save" to activate the script.

TamperMonkey will now run the script automatically whenever you visit the specified site(s) matching its domain rule.

## 2. Containers with Cardtainers

Containers are crucial for managing multiple accounts simultaneously. Cardtainers is an extension designed to simplify this process.

[Install Cardtainers](https://addons.mozilla.org/en-US/firefox/addon/cardtainers/).

After installation, click the Cardtainers icon (Testlandia in a jar). Paste your list of puppets into the text input, formatted like this:

```plaintext
kazakhstan
norway
puppet farmer 1
```

### 3. Login into the Containers

Containers are useless if they are not logged into each nation.

1. To do this, visit the Hare tool <a href="/tools/login" target="_blank" rel="noreferrer noopener">Login Sheet</a> to generate a login sheet.

2. Make sure you install [login autocloser](https://github.com/Kractero/userscripts/raw/main/container-login/autologautoclose.user.js) and [autolog](https://github.com/Kractero/userscripts/raw/main/container-login/autolog.user.js) (autolog requires configuration and assumes all your nations have the same password, set your password at line 15 and make sure it is in quotes)

3. Once the sheet is generated, click Link to Nation and then click enter until the sheet is finished.

### 4. gotIssues

gotIssues is the primary tool that enables card farming, as it allows you to clear all your puppet's issues and open packs through an html sheet.

1. To use gotIssues effectively, you must first install the following userscripts:

- [Autoclose](https://raw.githubusercontent.com/jmikk/gotIssues/master/autoclose%3D1.user.js)
- [NSIssueCompactorRand](https://raw.githubusercontent.com/jmikk/gotIssues/master/NsIssueCompactorRand.js).

2. With the userscripts installed and your containers properly set up, visit <a href="/tools/gotissues" target="_blank" rel="noreferrer noopener">gotIssues</a>.

3. Fill in the required inputs and click start.

4. You can either wait for the process to finish or manually click "Open Available Link" and spam the Enter key to expedite the process.

5. Once complete, the "Download" button will become clickable. Download the sheet, then click "Link to Issue" and spam Enter.

### 5. Configuration

If you find yourself using Hare's services a lot, it would help to visit <a href="/config" target="_blank" rel="noreferrer noopener">the configuration page</a> to store values for multiple sessions. This saves time and streamlines your workflow.

### Beyond

Whether you're just starting out or looking to refine your approach, Hare may help improve your workflow.

Once you're setup, useful scripts for managing puppets include:

1. Finder

Input card IDs (optionally with season) to find which of your puppets hold any of the specified cards.

2. junkDaJunk

Generates an HTML sheet of links to quickly junk cards. It includes customizable parameters, such as setting a minimum owner count, skipping specific regions, and junking only on nations with a certain number of cards. This helps save time by focusing on the most valuable actions.

3. Gold Retriever

Creates an HTML table that displays the card count, bank, deck value, and junk value of all your puppets. You can sort these values ascending or descending to easily identify your most valuable assets.

4. Creator Assistant

This tool generates an HTML file with entries that open the nation creation page in a specific container.

To finish its functionality, you will need to install the userscript [Creator](https://github.com/Kractero/userscripts/raw/main/nationCreator.user.js).

Once set up, clicking "Open" and hitting Enter will streamline nation creation, making the process faster until NationStates imposes rate limits.
