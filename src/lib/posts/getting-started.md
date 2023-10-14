---
title: Farming with Hare
description: Getting started with Hare
url: getting-started
author: Kractero
order: 2
---

Hare is a central location that contains many browser executable scripts that typically would require the installation of Python and some understanding of running Python scripts. 

To start farming cards with Hare, you will first want to visit the <a href="/guides/prereqs" target="_blank" rel="noreferrer noopener">prerequisites guide</a> and follow the Notes on Browsers and Installing Userscripts.

1. Containerise Rules or Cardtainers

What glues most card tools together are containers.

<a href="/guides/cardtainers" target="_blank" rel="noreferrer noopener">Cardtainers advert</a>

There has historically been one option, Containerise, and to be honest, it still is the most robust option. If you want to, visit download Containerise following <a href="/guides/prereqs#containers" target="_blank" rel="noreferrer noopener">these steps</a>. To generate the rules mentioned, you can visit the Containerise Rules tool, and the rules will be outputted after you run the tool with your puppets. You can then paste it into the Containerise contaienr input area.

1. Creator Assistant (optional)

What creator assistant does is generate a HTML file containing entries that simply open up the create nation page in a specific container. 

To finish its functionality, you will need to install the userscript [Creator](https://github.com/Kractero/cards-utilities/blob/main/creation_assistant/creator.user.js). When installing, you will need to modify the fields for the slogan, animal, currency, optionally the email, password, confirm password, and you have the choice to alter the flag and government type.

Once the userscript is installed, you should be able to just click Open and hitting enter will lead you through nation creation. This helps to speed up time until NationStates itself slows you down.

3. Login Sheet (optional)

Login Sheet is an html sheet generator that helps you log into containers. The sheet contains link to the upload flag page, which is protected and requires a login if you aren't logged in.

To fully extend the functionality, you will need to install the userscripts [Autolog Autoclose](https://github.com/Kractero/cards-utilities/raw/main/log_into_containers/autologautoclose.user.js) and [Autolog](https://github.com/Kractero/cards-utilities/blob/main/log_into_containers/autolog.user.js). For Autolog, you will want to replace the password with your (presumably) shared password for puppets (keeping the quotes).

Once these userscripts are installed, you should be able to just click Open and hitting enter will log you in to a nation, automatically checking keep me logged in, and then will close through autoclose. This lets you mash enter to finish the sheet, and log you in to all your containers.

4. gotIssues

gotIssues is the primary tool that enables card farming, as it allows you to clear all your puppet's issues and open packs through an html sheet.

For gotIssues to be usable at all, you will need to install the userscripts [Autoclose](https://raw.githubusercontent.com/jmikk/gotIssues/master/autoclose%3D1.user.js) and [NSIssueCompactorRand](https://raw.githubusercontent.com/jmikk/gotIssues/master/NsIssueCompactorRand.js).

Once these userscripts are installed, assuming your containers are setup properly, you should be able to click one Open Link, then mash enter until you finish the sheet.

### Beyond

Once you're setup, useful scripts for managing puppets include:

1. Finder

Input card ids, optionally with season, and find which of your puppets has any of the specified cards.

2. junkDaJunk

Generates an html sheet of links that quickly junk cards, and includes many customizable parameters to tune the junking, like a minimum owner count, skipping particular regions, and only executing the junking process on nations with a certain amount of cards (this helps save time).

3. Gold Retriever

Generates an html table/sheet that displays the card count, bank, deck value, and junk value of all your puppets, all sortable ascending or descending.