---
title: Prerequisites
description: Common prerequisites for card tools
url: prereqs
author: Kractero
---
To install most of these tools, you will be expected to have some knowledge of the browser. A lot of trading card tools involve automation, through scripting or hotkeys.
While it may seem daunting at the start, with some work everything should click and work properly. Follow this to get all the prerequisites installed.

1. [Note on Browsers](#browsers)
2. [Installing Userscripts](#userscripts)
3. [Containerise](#containers)
4. [Python](#programming-languages)

### <a name="browsers"></a>  Browsers
Depending on your usecase, you may not need to worry about this section. However, most card farmers should probably keep reading. 

Userscripts can work on any browser, as most userscript extensions work on all major browsers. However, most card tools rely on the use of containers, which is only supported by Firefox and its derivatives. Sorry to chromiumites. <a href="https://www.mozilla.org/en-US/firefox/new/" rel="noopener noreferrer" target="_blank">Installing Firefox is quite simple.</a>

<div class="flex gap-4 justify-center">
    <a href="https://www.mozilla.org/en-US/firefox/new/" rel="noopener noreferrer" target="_blank">
        <img src="https://ucarecdn.com/9dc9b403-3b4c-49ba-8154-20880be23d37/firefox_browser_logo_icon_152991-4214717325.png" />
    </a>
</div>

Other options include Firefox ESR, Firefox Nightly, Firefox Developer's Edition, LibreWolf, Floorp, Waterfox, and others, but unless you know what you're doing you should use the original.

If you don't plan on using containers, keep using whatever browser you want.

### <a name="userscripts"></a>  Userscripts
For most people, userscripts should be enough to take them to the next level. To enable the use of userscripts, you will need a userscript manager.

<div class="flex gap-4 justify-center">
    <a href="https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/" rel="noopener noreferrer" target="_blank">
        <img src="https://addons.mozilla.org/user-media/addon_icons/683/683490-64.png?modified=1625638973" alt="tampermonkey" />
    </a>
    <a href="https://addons.mozilla.org/en-US/firefox/addon/violentmonkey/" rel="noopener noreferrer" target="_blank">
        <img src="https://addons.mozilla.org/user-media/addon_icons/797/797378-64.png?modified=1692854978" alt="violentmonkey" />
    </a>
    <a href="https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/" rel="noopener noreferrer" target="_blank">
        <img src="https://addons.mozilla.org/user-media/addon_icons/0/748-64.png?modified=1531822767" alt="greasemonkey" />
    </a>
    <a href="https://addons.mozilla.org/en-US/firefox/addon/firemonkey/" rel="noopener noreferrer" target="_blank">
        <img src="https://addons.mozilla.org/user-media/addon_icons/1019/1019336-64.png?modified=f7e6f88a" alt="firemonkey" />
    </a>
</div>

There are four primary userscript managers, all with their tradeoffs.

1. <a href="https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/" rel="noopener noreferrer" target="_blank">TamperMonkey</a>
    - Probably the best option for 98% of users. It's modern and works well. Sticklers for open source will need to turn away though, as Tampermonkey is closed source and frequently asks for donations.

    To add a script to Tampermonkey, click the Tampermonkey icon and then click create script.
    ![add script to tampermonkey](https://raw.githubusercontent.com/Kractero/cards-resources/main/static/tampermonkey.png)

2. <a href="https://addons.mozilla.org/en-US/firefox/addon/violentmonkey/" rel="noopener noreferrer" target="_blank">ViolentMonkey</a>
    - Probably the best option for those who don't want to use Tampermonkey. Free and open source. Smaller userbase, and they've had some drama in the past.

    To add a script to Violentmonkey, click the Violentmonkey icon and then click Create a new script.
    ![add script to Violentmonkey](https://raw.githubusercontent.com/Kractero/cards-resources/main/static/violentmonkey.png)

3. <a href="https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/" rel="noopener noreferrer" target="_blank">GreaseMonkey</a>
    - The old premier userscript manager before there were really any to compete with it. Should work fine, but newer scripts will be incompatible. Generally just go with a newer one.

    To add a script to Greasemonkey, click the Greasemonkey icon and then click the + icon.
    ![add script to Greasemonkey](https://raw.githubusercontent.com/Kractero/cards-resources/main/static/greasemonkey.png)

4. <a href="https://addons.mozilla.org/en-US/firefox/addon/firemonkey/" rel="noopener noreferrer" target="_blank">FireMonkey</a> 
    - A newer userscript manager with a very small userbase but an active creator. Is a bit more difficult to setup as it does not expose or use the same grants as the others. It does double as a user styles manager though.

    To add a script to Firemonkey, click the Firemonkey icon and then click the +JS button.
    ![add script to Firemonkey](https://raw.githubusercontent.com/Kractero/cards-resources/main/static/firemonkey.png)

If after adding the extension the icon does not appear in your toolbar, you may need to pin it. Click the puzzle icon, then click the settings cog for the extension and click pin to toolbar.

![pin extension to bar](https://raw.githubusercontent.com/Kractero/cards-resources/main/static/pintotoolbar.png)

### <a name="containers"></a>  Containers

Containers are not necessary for farming, as you can use any puppet manager that allows you to switch, but it definitely makes the job infinitely easier. 

Containers are essentially isolated browser instances
that retain their own cookies and sessions. This allows you to be logged on to multiple accounts at once.

As mentioned [above](#browsers), the only browsers that supports this are Firefox and its derivatives. Sorry to chromiumites.

<div class="flex gap-4 justify-center">
    <a href="https://addons.mozilla.org/en-US/firefox/addon/containerise/" rel="noopener noreferrer" target="_blank">
        <img src="https://addons.mozilla.org/user-media/addon_icons/859/859380-64.png?modified=1553034276" alt="containerise" />
    </a>
</div>

Open Firefox, then <a href="https://addons.mozilla.org/en-US/firefox/addon/containerise/" rel="noopener noreferrer" target="_blank">Install the Containerise addon.</a>

After you have generated some container rules, you can add them by clicking the pencil icon, pasting them in the text area, then hitting the save icon.

![pencil icon](https://raw.githubusercontent.com/Kractero/cards-resources/main/static/containerise.png)
    
### <a name="programming-languages"></a>  Programming Languages

Essentially just Python. Most cards tools in use now are developed using Python, although some exist in other languages. There are a lot of traps you can run into while downloading Python, especially on Windows.
Some things to watch for include adding python to your path.
    
Of course, if you use Linux, you wouldn't have that problem!

<div class="flex gap-4 justify-center">
    <a href="https://www.python.org/downloads/" rel="noopener noreferrer" target="_blank">
        <img src="https://ucarecdn.com/b23e066d-1f40-4da7-8df3-d11b1c0e99f4/python-logo-only.png" />
    </a>
</div>

Here are the steps on how to download Python and get it working, on Windows.

1. Visit <a href="https://www.python.org/downloads/" rel="noopener noreferrer" target="_blank">the Python website</a> and click Download Python 3.11.5 (version at the time of writing, yours might be different).

2. Launch the executable. 

3. On the open prompt, make sure you check "add python.exe to PATH" and select Install Now (as admin).

![python add to path install](https://raw.githubusercontent.com/Kractero/cards-resources/main/static/python1.png)

4. Follow the steps to the finish.

5. If you followed these steps, you should be able to open a Command Prompt, type python, and see the below.

![python in command line](https://raw.githubusercontent.com/Kractero/cards-resources/main/static/python2.png)

Congratulations, you should now be able to execute any script with Python by either clicking it or going to the directory with command prompt and doing python SCRIPT_NAME.py .