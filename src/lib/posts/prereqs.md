---
title: Prerequisites
description: Common prerequisites for card tools
url: prereqs
author: Kractero
order: 1
category: overview
---

To install and effectively use most of these tools, having a basic understanding of your browser's capabilities is essential. Many trading card tools involve some degree of automation, whether through scripting or hotkeys.

All you need now to get started is a userscript manager. Previously, farming required additional setup, but recent changes have made it so you only need a userscript manager to get started.

Some optional stuff you can use will be included at the bottom.

1. [Installing Userscripts](#userscripts)
2. [Optional](#optional)

### <a name="userscripts">Userscripts</a>

For most people, userscripts are the gateway to taking their card farming to the next level. To use userscripts, you'll need a userscript manager.

<div class="flex gap-4 justify-center">
    <a href="https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/" rel="noopener noreferrer" target="_blank">
        <img src="https://addons.mozilla.org/user-media/addon_icons/683/683490-64.png?modified=1625638973" alt="TamperMonkey" />
    </a>
</div>

There are a number of userscript managers, but I would recommend <a href="https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/" rel="noopener noreferrer">TamperMonkey</a> for most users. It's modern, user-friendly, and works well with most scripts you'll find online. While it's not open source, it's reliable and widely used, making it the best choice for most people.

To add a script to TamperMonkey, simply click the TamperMonkey icon in your toolbar and select "Create a new script."

![add script to tampermonkey](https://raw.githubusercontent.com/Kractero/hare/main/static/guides/tampermonkey.png)

If after adding Tampermonkey the icon does not appear in your toolbar, you may need to pin it. Click the puzzle icon, then click the settings cog for the extension and click pin to toolbar.

![pin extension to bar](https://raw.githubusercontent.com/Kractero/hare/main/static/guides/pintotoolbar.png)

For those who prefer open-source alternatives or are interested in exploring other options, use <a href="https://addons.mozilla.org/en-US/firefox/addon/violentmonkey/" rel="noopener noreferrer">ViolentMonkey</a>, it's what I use.

## <a name="optional">Optional Tools</a>

### <a name="programming-languages">Programming Languages</a>

For most card tools that require command line execution, Python is the primary language you'll encounter.

> For Hare, you will not need Python.

There are a few traps you can run into while downloading Python, especially on Windows (which itself is a trap). One of the most common issues is not adding Python to your PATH.

Of course, if you're using Linux, you won't have that problem!

<div class="flex gap-4 justify-center">
    <a href="https://www.python.org/downloads/" rel="noopener noreferrer" target="_blank">
        <img src="https://ucarecdn.com/b23e066d-1f40-4da7-8df3-d11b1c0e99f4/python-logo-only.png" alt="Python Logo"/>
    </a>
</div>

Here are the steps to download and install Python on Windows:

1. Visit [the Python website](https://www.python.org/downloads/) and click the button to download the latest version.

2. Run the downloaded executable.

3. In the installation prompt, make sure to check "Add python.exe to PATH," then select "Install Now" (admin rights may be required).

   ![python add to path install](https://raw.githubusercontent.com/Kractero/hare/main/static/guides/python1.png)

4. Follow the installation steps to completion.

5. To verify the installation, open a Command Prompt, type `python`, and you should see a Python prompt similar to the one below:

   ![python in command line](https://raw.githubusercontent.com/Kractero/hare/main/static/guides/python2.png)

Congratulations! You should now be able to execute any Python script by either double-clicking it or by navigating to its directory in the Command Prompt and typing `python SCRIPT_NAME.py`.

It's worth noting that while tools like Hare are designed to make Python unnecessary for most tasks, having Python set up can still be useful if you ever need it. Although other languages like C# (Henson) or PHP (Sitethief) are used in the card farming community, they aren't as common as Python, so you don't need to worry about them as much.

### <a name="browsers">Browsers</a>

Depending on your specific needs, you might not need to worry too much about this section. However, if you're serious about card farming, it's worth reading on.

Userscripts can function on almost any browser thanks to widespread support by userscript extensions. This means that **any** browser can be used to farm. In the past, Firefox was the only practical option due to it being the only major browser to support containers, but with the addition of border patrol, containers have become less viable of an option.

> Update: Firefox is no longer strictly required

**Containers**

If you want to use containers, you will need Firefox. <a href="https://www.mozilla.org/en-US/firefox/new/" rel="noopener noreferrer" target="_blank">Installing Firefox is quick and easy.</a>

Other alternatives include Firefox ESR, Firefox Nightly, Firefox Developer Edition, LibreWolf, Floorp, Waterfox, and more. However, unless you're familiar with these versions, it's best to stick with the original Firefox.

If you don't plan on using containers, you can continue using whatever browser you prefer.

### <a name="containers">Containers</a>

> UPDATE: You may not need containers at all, [read here](/resources/guides/containerless)

Containers aren't strictly necessary for farming, as you can use any puppet manager that lets you switch accounts. However, they can make the process much easier.

Containers are essentially isolated browser instances that retain their own cookies and sessions. This allows you to be logged in to multiple accounts at once.

As mentioned [above](#browsers), the only browsers that support this feature are Firefox and its derivatives. Sorry to Chromium users.

You have two main choices for containers:

1. Cardtainers - Read more here -> [Cardtainers advert](/resources/guides/cardtainers)

   - Pros: No need for Python, quick and easy setup.

2. Containerise

   <div class="flex gap-4 justify-center">
       <a href="https://addons.mozilla.org/en-US/firefox/addon/containerise/" rel="noopener noreferrer" target="_blank">
           <img src="https://addons.mozilla.org/user-media/addon_icons/859/859380-64.png?modified=1553034276" alt="containerise" />
       </a>
   </div>

   Open Firefox, then [Install the Containerise addon](https://addons.mozilla.org/en-US/firefox/addon/containerise/).

   Once you've generated some container rules, add them by clicking the pencil icon, pasting them in the text area, and hitting the save icon.

   ![pencil icon](https://raw.githubusercontent.com/Kractero/hare/main/static/guides/containerise.png)

   More steps can be found [here](/resources/guides/containers).
