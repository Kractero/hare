---
title: gotIssues
description: gotIssues use
url: junkdajunk
author: Kractero
order: 5
category: tools
---

gotIssues is the primary tool that enables card farming, as it allows you to clear all your puppet's issues and open packs through an html sheet.

1. To use gotIssues effectively, you must first install the following userscript:

   - <a href="https://github.com/dithpri/RCES/raw/master/userscripts/issue_answering/NsIssueCompactorRand.user.js" target="_blank">NSIssueCompactorRand</a> by Racoda.

   Issues are intended to automatically close for gotIssues, but the condition on which it closes can depend on your preference.

   - **Always close the issue, even if a pack was generated.** <a href="https://raw.githubusercontent.com/dithpri/RCES/refs/heads/master/userscripts/issue_answering/NsDilemmaAutoCloseAll.user.js">NSDilemmaAutoCloseAll</a> by Racoda.

   - **Do not close the issue if a pack was generated.** <a href="https://raw.githubusercontent.com/dithpri/RCES/refs/heads/master/userscripts/issue_answering/NsDilemmaAutoClose.user.js">NSDilemmaAutoClose</a> by Racoda.

   gotIssues also supports packs, which can either be automatically closed or not. If you want to see the cards, do not use an autocloser for packs. Otherwise:

   - If you want packs to autoclose, you need to install a pack autocloser, of which there are some variations. <a href="https://raw.githubusercontent.com/Kractero/userscripts/refs/heads/main/packAutocloser.user.js" target="_blank">This is the basic one</a>.

2. With the userscript installed and your containers properly set up, visit <a href="/tools/gotissues" target="_blank" rel="noreferrer noopener">gotIssues</a>.

3. Fill in the required inputs and click start.

4. You can either wait for the process to finish or manually click "Open Available Link" and spam the Enter key to expedite the process.

5. Once complete, the "Download" button will become clickable. Download the sheet, then click "Link to Issue" and spam Enter.

#### Pack Autoclosers

The linked autocloser indiscriminately closes all packs. If you would like it to not, you can use the linked conditional autocloser.

- <a href="https://raw.githubusercontent.com/Kractero/userscripts/refs/heads/main/packConditionalAutocloser.user.js" target="_blank">Conditional Autocloser</a> - Closes the page if no legendary and no cards at a certain MV are present (default 1.5). To change the mv, ctrl+f 1.5 on the page and change it to whatever value. Additional conditions can be added as well if you are familair with JavaScript.

Modifications of this exist that can notify you when the conditions are met, with stuff like TTS, notifications, or discord webhook. More information can be found in the cards server.
