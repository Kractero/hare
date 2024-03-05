---
title: Farming with Hare
description: Getting started with Hare
url: getting-started
author: Kractero
order: 2
---

Hare is a central location that contains many browser executable scripts that typically would require the installation of Python and some understanding of running Python scripts.

### 1. A Userscript Manager
A userscript allows you to extend a website's functionality beyond what is present in the website's current scripts. To facilitate this, install either:

1. <a href="https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/" rel="noopener noreferrer" target="_blank">TamperMonkey</a>
    - Probably the best option for 98% of users. It's modern and works well. Sticklers for open source will need to turn away though, as Tampermonkey is closed source and frequently asks for donations.

    To add a script to Tampermonkey, click the Tampermonkey icon and then click create script.
    ![add script to tampermonkey](https://raw.githubusercontent.com/Kractero/cards-resources/main/static/tampermonkey.png)

2. <a href="https://addons.mozilla.org/en-US/firefox/addon/violentmonkey/" rel="noopener noreferrer" target="_blank">ViolentMonkey</a>
    - Probably the best option for those who don't want to use Tampermonkey. Free and open source. Smaller userbase, and they've had some drama in the past.

    To add a script to Violentmonkey, click the Violentmonkey icon and then click Create a new script.
    ![add script to Violentmonkey](https://raw.githubusercontent.com/Kractero/cards-resources/main/static/violentmonkey.png)

### 2. Containers with Cardtainers

What glues most card tools together are containers. Cardtainers is an extension that provides an easy way to set up containers without requiring any script to be run.

1. [Install the extension](https://addons.mozilla.org/en-US/firefox/addon/cardtainers/).

2. Once the extension is installed, click its icon (its Testlandia in a jar) and in the text input paste your entire list of pupets, formatted like

```
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

1. For gotIssues to be usable at all, you will need to install the userscripts [Autoclose](https://raw.githubusercontent.com/jmikk/gotIssues/master/autoclose%3D1.user.js) and [NSIssueCompactorRand](https://raw.githubusercontent.com/jmikk/gotIssues/master/NsIssueCompactorRand.js).

2. Once these userscripts are installed, assuming your containers are setup properly, visit <a href="/tools/gotIssues" target="_blank" rel="noreferrer noopener">gotIssues</a>.

3. Fill in the required inputs and click start.

4. You can either wait for it to finish or start clicking Open Available Link and then spamming enter.

5. Once it is finished, Download will be clickable, download the sheet, then click Link to Issue and spam enter.

### 5. Configuration

If you find yourself using Hare a lot, it would help to visit <a href="/tools/config" target="_blank" rel="noreferrer noopener">the configuration page</a> to store values for multiple sessions.


### Beyond

Once you're setup, useful scripts for managing puppets include:

1. Finder

Input card ids, optionally with season, and find which of your puppets has any of the specified cards.

2. junkDaJunk

Generates an html sheet of links that quickly junk cards, and includes many customizable parameters to tune the junking, like a minimum owner count, skipping particular regions, and only executing the junking process on nations with a certain amount of cards (this helps save time).

3. Gold Retriever

Generates an html table/sheet that displays the card count, bank, deck value, and junk value of all your puppets, all sortable ascending or descending.

4. Creator Assistant

What creator assistant does is generate a HTML file containing entries that simply open up the create nation page in a specific container.

To finish its functionality, you will need to install the userscript [Creator](https://github.com/Kractero/userscripts/raw/main/nationCreator.user.js). When installing, you will need to modify the fields for the slogan, animal, currency, optionally the email, password, confirm password, and you have the choice to alter the flag and government type.

Once the userscript is installed, you should be able to just click Open and hitting enter will lead you through nation creation. This helps to speed up time until NationStates itself slows you down.