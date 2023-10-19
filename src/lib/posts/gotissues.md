---
title: Got Issues with gotIssues?
description: Resolution for gotIssues issues
url: gotissues
author: Kractero
order: 5
---
gotIssues is a powerful command line tool written in Python by 9003 to generate an html sheet that allows you to mow down issues on all your puppets by just spamming enter. Once setup, it can take your card farming to the moon. The problem is that it is very difficult to setup for someone who is not familiar with coding.

I am entering this guide assuming you have the prerequisites setup already. These include Python and Containerise. If you don't, visit [this url to learn more](/guides/prereqs).

## Methods
There are actually two ways to run gotIssues now.

Before any of that, install these two userscripts.
1. Autocloser
```js
// ==UserScript==
// @name         Autocloser
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       9003
// @match        https://www.nationstates.net/*page=enact_dilemma*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nationstates.net//
// @grant        window.close
// ==/UserScript==
(function() {
     'use strict';
     window.close();
})();
```

2. <a href="https://raw.githubusercontent.com/jmikk/gotIssues/master/NsIssueCompactorRand.js" rel="noopener noreferrer" target="_blank">NSIssueCompactorRand</a>

Now, continue by picking one of the two methods.

1. [As a Script](#traditional)
2. [In the Browser](#browser)

### <a id="traditional" name="traditional"></a> Traditional Script
There is the traditional way written by 9003, which involves running the gotIssues script and waiting for the sheet to be generated to start farming. 

1. <a href="https://github.com/jmikk/gotIssues/archive/refs/heads/master.zip" rel="noopener noreferrer" target="_blank">Download gotIssues</a>
2. Navigate to the directory it is installed in.
2. gotIssues expects a file named puppet.csv to be fully configured with your nations inside. If you open it in your preferred editor, you can see some samples. It is formatted as
```
nation,password
```

Fill this out so gotIssues knows which nations to gather issues for.

3. While you might be tempted to just click issues.py with your mouse, I find this way causes issues and just feels way less reliabe than actually doing it through the terminal. Assuming you are on windows, hit the Windows key, then type in Command Prompt and open it.
4. From your explorer, find where you downloaded, and then go to the address bar and double click it. The address bar is below:
![address bar](https://raw.githubusercontent.com/Kractero/cards-resources/main/static/addressbar.png) Copy it, and then in the command prompt window, type
```
cd C:\USER\YOURGOTISSUESLOCATION
```
and this will navigate your terminal to the gotIssues folder.

5. Once in the directory, in your terminal, run this command to download the dependencies for gotIssues.
```
dependencies-windows.bat
```
6. In the terminal window, execute issues.py by running
```
python issues.py
```
If this fails, that means your python command is not python. Try it with python3, py, or py3.

Once you enter this, it will ask you for a user agent by requesting your main nation. Type it in, then it will start generating your sheet. You will know if it succeeds when "Done, thanks for using GotIssues" appears and two text files named link_list and pack_list are generated in the gotIssues folder.

7. In the terminal window, execute issues.py by running
```
python Sheet_Maker.py
```
This will generate the html sheet, named 9003samazinglistofcards.html. Essentially how this sheet will work is that when you open it up in a browser with containerise, you can click the Link to Card button, then spam enter all the way down. Each click will open an issue choice up, answer it, then close it.

### <a id="browser" name="browser"></a> gi-browser
I have been on an endless hunt of making gotIssues more usable to the average farmer. It even came to the point of an unsigned executable that antiviruses would cry about. Nevertheless, you can now access and use gotIssues through the browser, and circumvent the normal pain point of waiting for it to finish by answering the issues immediately after it starts running.

1. <a href="https://kractero.github.io/gi-browser/" rel="noopener noreferrer" target="_blank">Visit the site.</a> 

2. Fill in your main nation's name. This is required so NationStates knows who is making the requests.

3. If all your puppets have the same password, put it into the Shared Password field. Then, list all your puppets in the textarea following this example:
```
nation name
Kazakhstan
Puppet1
Farmers
Norway
```

If your puppets have different passwords, click Multiple Passwords, then list your puppets following this example:
```
nation,password
Kazakhstan,astana
Puppet1,puppet1!
Farmers,farmers
Norway,oslo
```

If you already have a prepared puppet.csv file formatted like nation,password, click the Different Passwords button, even if they are all the same. Then, paste the contents of puppet.csv into this text box. Likewise, if you already have a sheet with all your nations and the same password, use shared passwords.

4. Click Run. If text starts appearing indicating the stage on which the script is at (like Processing...) it is running.

A cool thing about the browser version is that you can start answering issues immediately, instead of waiting until the end. Click open next link and start answering.

When it actually finishes, the sheet will download automatically.

## Method Pros/Cons
There are some definite pros/cons to running it as a script or in the browser.

**As a script:**

Pros
1. You do not need to have a browser link bookmarked or memorized, you can just jump in the terminal, or god forbid, click the icon, and generate it.

2. Running the script does not come with the added baggage of running a browser, as browsers can be resource heavy.

Cons
1. Getting it setup is difficult.

2. You have to wait .7 * number of puppets before you can get started. For people with a lot of puppets, this can be a very long time.

**In the browser**

Pros
1. You don't need to set anything up, you can just jump in, fill out some inputs, and go.
2. You can start answering issues immediately, instead of waiting until the end.

Cons
1. I don't have a custom, easy to remember domain, so you will have to bookmark or memorize it.
2. Browser windows are easy to close, thus killing all of your script progress.

## Closing Notes
If this helped gift me a leg.

<style>
	pre {
		white-space: pre-wrap;
	}
</style>
