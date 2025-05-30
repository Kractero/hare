# Changelog

## 2025-05-30

### Adjustments

1. JunkDaJunk

   - Use the junk api 🙏🙏🙏🙏🙏🙏

## 2025-5-12

### Features

1. Finder

   - Sell one similar to gift one implemented

## 2025-5-08

### Fixes

1. Sheetify

   - Sheetify will work without needing to pass a link that already contains a nation or container name. For example, just base page=settings without nation=test/page=settings

## 2025-4-01

### Fixes

1. Login Sheet

   - Existing login links clear when start is clicked.

## 2025-3-05

### Adjustments

1. Auction

   - Setting for a skip threshold to skip puppets that have greater than that amount of bank.

## 2025-2-24

### Fixes

Setting index in downloaded sheets should work.

## 2025-2-22

### Fixes

1. Auction

   - Fix broken canonicalization.

## 2025-2-18

### Adjustments

1. Auction

   - On Transfer, Auction places all the asks with the main before proceeding to bids. This allows it to work better with containerless so all bids on the same nation occur next to each other.

## 2025-2-16

### Adjustments

1. Sheetify

   - Change how Sheetify works. It now uses a puppet list and now takes a link and if the link contains container= or nation=, it will replace whatever is currently there with the puppet name and make a sheet out of it.

## 2025-2-14

Host the containerless userscript.

### Fixes

1. Auction, Creation, gotIssues

   - Minor changes reordering some query parameters (extra ?, weirdly placed) and consistently doing container=/nation=.

2. Ping

   - Use page=login instead of page=upload_flag for reviving nations.

3. Inscription

   - Remove commented out inscription code.

4. Auction's Userscript

   - Logic to not focus when working with SCS, some conditionals to prevent errors.

## 2025-2-11

### Features

1. Finder

   - New mode for Finder to gift legendaries and cards over a certain market value. The current Finder (passing in id,season) is defaulted as findMode "Specific Cards". The legendaries and mv gifting is under the mode General.

     The existence of a separate mode as opposed to just lumping the logic into the existing functionality is because it is easier this way. If there are more puppets than cards, the logic is thrown out the window. When there are more puppets than cards, each card is searched for matching owners, as opposed to each owner being searched for cards, which defeats the purpose of the new options.

## 2025-2-06

### Fixes

1. JDJ

   - If pulling from local storage, use the right name for the local storage variable, instead of forgetting to change it from the url param after copy pasting.

## 2025-2-02

### Fixes

1. Finder

   - Convert owners to string.

   - Add new line character to improperly formatted line in legendary preset.

## 2025-1-27

### Features

1. NEW - Sheetify

   - Pass any series of links in, get a click sheet.

### Adjustments

Nation specific password logic changed, only for Finder.

1. GotIssues

   - Output message on nations that have zero packs.

2. Config

   - JDJ skip season will match jdj settings.

### Fixes

1. Creator

   - Fix creator url on new tab sheet generation.

## 2025-1-20

### Adjustments

Input on sheets to control the placement if you know where you left off.

1. GotIssues

   - Pack count is back. New setting to determine whether to autoclose.

2. Auction

   - Auction Transfer no longer generates /mode=separate to separate the sheet, it just changes the tool name to Auction-Transfer.

## 2025-1-17

### Adjustments

Sheet progress is tracked by a number stored in local storage equal to a counter value that starts at zero and increments as you go down the sheet. When the page is reopened it will dump all links prior to the counter and update the progress.

Clicking on a link in the table still controls the position of the open next link button and clicking a column will remove all preceding rows.

If something is wrong with the index, the clear progress will reset the progress.

1. JunkDaJunk

   - Changed season whitelisting to a multiple select. Don't Skip and Skip Offseasons are retired. Don't skip is possible by having nothing checked, skip offseasons by checking 1, 2, and 3.

   - Moved the logic around, so simple's parameters (id, season, rarity, market value) are checked first. This should save time as if a card is marked as junk it will no longer send an additional request for the advanced parameters.

   - The links to junk now say Link to Junk.

2. Finder

   - Finder now performs on two different modes. If the amount of cards exceeds the amount of puppets, it will go through the cards and check their owners and perform finder tasks off that. if the amount of puppets exceeds the amount of cards, it will do the normal finder process. This should save time on tasks like gifting legendaries.

   - S4 legendaries added to legendary preset.

   - Gifting properly follows rate limit using the helper function.

### Fixes

Links that should reset their count to indicate a change (issues to packs, junk to sale) now reset to 1 properly.

1. gotIssues

   - Pack only mode links now get added to right link queue for opening on Hare.

2. Auction

   - Auction userscript splits at the query parameters.

## 2025-1-16

Rework how sheets work.

1. Sheets now have a button that will go through the links in the sheet, while the table is still there but no longer processable with enter. You can still click the links in the sheet one by one.

2. Tools that produce sheets will produce sheets removed of links already opened via Open New Link.

~~3. Sheets will store the links already opened in local storage, so closing them will automatically remove them from the table/button queue. This might be an issue with large junkDaJunk files.~~

3. You can control the position of the open next link button by clicking a column, which will the next link to the active one in open next link. Clicking a column will remove all preceding rows.

Prevents illegal behavior (holding down enter and automatically opening links, thereby breaking one click one action), which has been an issue with GI-based sheet openers since at least 2020.

### Features

1. JunkDaJunk

   - A "simple" mode for JDJ, which only checks card IDs, season, rarity, and market value. This is not as complex as the traditional mode but is way faster.

### Adjustments

1. Inscription Assistant

   - Renamed to Decorator. Aspects related to inscribing cards removed (the inscribing part and the userscript, and viewing the card).

2. Flag Manager

   - Renamed to Flag Finder, because the actual flag manager is Decorator.

3. gotIssues

   - Removed pack banking.

## 2025-1-15

Open New Link button now uses keyup to prevent illegal behavior (holding down enter and automatically opening links, thereby breaking one click one action). This was an oversight, it should have been in place since the start.

## 2025-1-06

### Features

1. Inscription Assistant

   - Flag mode, which works like banners, just point to a remote flag and go through the sheet.

### Adjustments

1. Auction

   - Auction now requires season (obviously, why didn't it before) so it knows what card to list. You can know tell the amount of times to list it.

## 2025-1-04

### Features

1. Finder

   - Gift One mode, which will gift one card from the specified IDs in total. For example, if you provide ten puppets and each owns a specified ID, only one copy will be gifted.

### Adjustments

1. Legendary Tracker

   - S4 legendaries added.
   - Sorting sucks less, as you can know actually reset the sorting instead of being stuck after sorting once.

### Fixes

1. Inscription Assistant

   - Don't clear terminal progress when stopped.

## 2025-1-02

### Features

1. NEW - Inscription Assistant

   - Tool with two modes - one to upload banners/set them as primary, and one to click the inscribe button cards.

### Fixes

1. Parameter generation for Creator, Containerise, Login Sheet

   - Updates the parameter generation to match the rest of the tools. This is a breaking change for Creator (theres an update to the userscript)

2. Fixed missing ? before Pinger's url parameters

3. Fixed broken link to Finder's userscript.

## 2024-12-19

### Features

1. NEW - Auctions

   - Given a bunch of cards, puppets, and main, creates a bunch of links to place bids and asks.

### Adjustments

1. Gold Retriever
   - Force bank and dv to display with two decimal points.
   - Right align

## 2024-12-16

### Removals

Removed Approval List ("Specify a proposal and get all delegates that are not approving it."), Statistics ("Provided WA scales and puppets, get the mean, median, and mode for each scale.), Wiz ("Query all your nations for their last logged in date.).

Nobody ever used them, not worth the scroll space in settings.

### Adjustments

1. JunkDaJunk

   - The removed mv > 10 check on the 12th has been reimplemented as just checking if the card is legendary. The reasoning behind its initial removal was to fallback to the rarity mv and rarity lowest bid thresholds, but I forgot legendaries weren't handled there.

2. Rate of Change
   - Adjusted ROC output to use spans and brs, so when you copy them it doesn't generate the annoying whitespace.

## 2024-12-12

### Adjustments

1. JunkDaJunk
   - Large changes to the gifting function to match Finder's gifting, which is more up to date.
   - Properly display the current card / total card when a gift is encountered, and also include the reason.

## 2024-11-29

### Fixes

1. Legendary Tracker
   - Fix malformed table headers.

## 2024-11-18

### Adjustments

1. Gold Retriever
   - Always split nation names for nation,password format for config storage consistency.

## 2024-11-16

### Adjustments

1. junkDaJunk
   - Alert if downloadable output is present when clicking start again.
   - Skip seasons output no longer iterates a string and makes up 10-15 seasons.

## 2024-10-26

### Features

1. gotIssues
   - New parameter: Minimum Pack Count (because I can't name things) - only nations that have more packs than the specified value (default 0) will have packs added to the sheet (the number is based on the value of Pack Count above)

## 2024-10-24

### Features

1. gotIssues
   - Some conditional logic on when to render issue counts, and a new parameter: Pack Count, which works like issue count to allow you to determine how many packs to open per nation.

## 2024-10-23

### Fixes

1. Finder
   - Parse nation,password properly.

## 2024-10-21

### Fixes

1. Finder
   - Use an updated beetles gifting list.

## 2024-10-14

### Fixes

1. gotIssues
   - Link to the updated compactorrand (it should have auto-updated even on the old one)

## 2024-10-07

### Fixes

1. Gold Retriever
   - The gold retriever next line script properly traverses to the next line.

## 2024-10-04

### Features

1. Endotart

   - Now generates a downloadable sheet pointing to #composebuttons for each nation. A new option has been added to include nations that you already endorse.
   - Fixed an oversight where nations with zero endorsements were skipped in endotart calculations for the XML sheet.

2. Login Sheet
   - Split into modes, UploadFlag (default, legacy) and SubmitIssue. A corresponding userscript has been added to SubmitIssue in the description. This will cause login sheet to generate links to either upload_flag or submit_issue. The regular autolog script will continue to work without update and fill, and the autocloser will close the link based on mode. SubmitIssue is probably better but UploadFlag maintains default status.

### Fixes

1. Endotart, Finder (failed gift links), JunkDaJunk (failed gift links, sell links), Spyglass, Whos Farmin were not being assigned a tool name or the user agent. The identifying string was presented as generated_by=Hare_author_main_nation_Kractero without the speciifc tool and user, this has been fixed. Because these links are all publically accessible, this was likely was not a problem.

2. Approvals List, Gold Retriever, Nen were creating a /? path parameter instead of just a normal ? path parameter.

## 2024-10-01

### Features

1. gotIssues
   - Will now skip adding issues to the sheet for nations with 9 packs if mode is both or issues.

## 2024-9-26

Getting Started guide has two videos, one to set up Cardtainers and one for Login SHeet

## 2024-9-23

### Features

1. Finder
   - Preset for legendaries

### Fixes

1. Nen
   - Fixed invalid progress string html prevented the not endorsing from showing up as output.

## 2024-9-16

### Adjustments

1. Link to RCES Issue compactor instead of the one in GI.

### Fixes

1. Fix regression where puppet names are no longer canonicalized.

## 2024-9-12

### Fixes

1. Fetch from new repository for endotart.

## 2024-9-11

### Adjustments

1. Start button is disabled when a script is running.

## 2024-9-03

### Adjustments

1. Rewrite url params and reorganize.

### Fixes

1. gotIssues
   - Fix regression where issue links had autoclose.

## 2024-9-01

### Fixes

1. gotIssues
   - Open links properly refreshes if GI is paused and restarted.

## 2024-8-29

### Adjustments

1. JunkDaJunk / Finder
   - JunkDaJunk/Finder use their own separate modes rather than sharing one. JDJ will take a new mode and fallback to finder's if not provided.

## 2024-8-27

Will include bits from previous days.

### Features

Replaced base svelte error page.

### Adjustments

Reorder some of the tools (finder higher up for example).

1. Download Button is now some shade of green again.

### Fixes

1. CSS fixes to the body.

2. On UA validation, allow underscores.

3. Fix broken image links on the getting started and prerequisites guides.

4. Resources - Duplicate Creation (asc) replaced with Creation (desc).

5. Tiny input on chromium and webkit browsers fixed.

6. Creation downloads with a name.

7. Finder - If finder is provided with multiple entries of the same id but different season, it matched the first id and would usually find the wrong season as a result. It now will iterate over all same id matches.

## 2024-8-23

Migrates the site to using [shadcn-svelte](https://shadcn-svelte.com/) instead of rolling my own UI components and styling. This makes it more maintainable from a UI standpoint and also opens it up to merging Queries, as Queries using that as its UI framework.

Every tool has seen behind the scenes changes but this shouldn't affect their operations maybe.

### Features

1. Input validation is now conducted on the user agent, to make sure that default browser agents or any kind of improper agent is passed.

2. Finder
   - Finder now has some buttons you can click to load presets for certain users.

### Adjustments

Rewrote multiple guides.

Merged the resources and guides page to resources, set up a redirect on guides to the new page.

Home page search bar was removed.

1. Resources

   - Removed the weird author filtering button click, replaced with some selects to sort by update/creation date, author, and category.
   - Removed the animations, they were unnecessary.

2. Ledger

   - Should behave similarly to upstream Ledger and reflect its recent changes.

3. Flag Manager

   - The motto mode now does an inclusive search on the motto instead of an exact match.

4. JunkDaJunk
   - The skip season is now a dropdown instead of a checkbox, with options of "Don't Skip", "Skip Offseasons", "Skip 1", "Skip 2". This is mainly because I don't want to deal with reimplementing its function yet but nobody was using it anyways.
   - The progress final output of summed cards will no longer be off by 2.
   - In the sheet, the global count of cards will bno longer be off by 1.

### Fixes

1. Approval List

   - If there are no current proposals in the selected council, it will now output that instead of crashing.

2. Gold Retriever
   - Fixed issue with the transfer and legendary card columns only appearing with Issue/Packs mode.

### Removed

1. Guides

   - Removed the gotIssues guide due to it being out of date and relatively unnecessary.

   - Removed Yuno's transfer guide due to it being out of date.

   - Removed suggestions of alternative userscript managers since nobody cares and just uses TamperMonkey (I prefer VioletMonkey).

2. Resources

   - Removed Dispatches (the ones that also appeared in guides), Card Browser, Local Retriever, Container Login Assist, old Queries, Henson, DeathWatch, Creation Assistant, and Rota Fortunae Discord Issues. These were either older versions of my scripts that have been supplanted into Hare or aren't really related to cards.

3. Trigonometry
   - Some kind of implementation of a trigger tool that was never added to the list and I haven't touched in a while.

## 2024-8-13

### Features

1. gotIssues

   - You can now set the amount of issues to be added per call, default to 5.

2. Config
   - New system theme option set to default.

## 2024-8-10

### Fixes

1. JunkDaJunk
   - Remove the required attribute and set default values to junkdajunk rarities bid.

## 2024-8-06

### Features

1. Creator
   - Creator asks for user agent now and also pulls the nation name properly. This pulling should be adjusted on the userscript to be honest but its harder to get that updated and pushed out so moving the parameter to the end will suffice.

## 2024-8-04

### Fixes

1. Finder/JunkDaJunk
   - Remove confoundingly stupid \n characters splitting each tr from the resulting html sheet.

## 2024-8-01

### Features

1. Gold Retriever
   - An option to include a column for a transfer card (links to gift=1), needs to be passed as id,season.
   - Added a row for legendaries (mainly for catching low MV legs like AOCI)

## 2024-7-26

### Fixes

1. Tools that generate clickable links should include Generated_By.

## 2024-7-4

### Features

1. JunkDaJunk
   - New option, maximum bank threshold, that lets you skip nations that have bank over a certain amount. -1 means don't skip.

## 2024-6-23

### Adjustments

1. JunkDaJunk
   - Test having junkdajunk attempt to prompt the user to not close it whilst it is being run.

## 2024-6-11

### Adjustments

1. JunkDaJunk
   - Split the logic of junkdajunk's rarity threshold into a market value threshold and bid value threshold. The bid value threshold will inherit the market value threshold for legacy reasons so people are not screwed over if they are unaware of the change.
   - Now takes a giftto value to specify which whitelisted cards should be gifted to who (same as finder), a season value must be provided for this to be parsed

### Fixes

1. Finder
   - Finder should no longer report successfully gifted cards as failed if you have multiple copies of it in the gift queue.

## 2024-6-03

### Adjustments

1. JunkDaJunk
   - Change output of the outputted sheet to indicate the national name and the global number count card.

### Fixes

1. Flag Manager

   - Tool is no longer pulling the wrong mode parameter.

2. JunkDaJunk
   - Fix issue where threshold would not actually properly pull from market value.

## 2024-3-27

### Features

1. Flag Manager
   - New mode that lets you search for specific mottos on a set of nation (intended for customization).

## 2024-3-20

### Fixes

1. Spyglass
   - Fix improperly formatted template string.

## 2024-3-15

### Fixes

1. Junk Da Junk
   - Fix bad array iteration logic and cast number to string for comparison.

## 2024-3-13

### Fixes

1. Who's Farmin
   - save the user agent in the url

## 2024-3-11

### Fixes

1. User Agent

   - Comply with stupid disallowed headers on chromium browsers by passing the user agent as a parameter on all API calls.

2. RCES, Gold Retriever

   - Improve tabbing experience in row from column to next column.

3. Wiz
   - Fix breaking typo.

## 2024-3-09

### Adjustments

1. Dark Mode

   - Darker dark mode

2. Tool styling
   - More internal spacing and margins within the tool components on the home page.

### Fixes

1. Config

   - Remove required attribute from two inputs.

2. Containerise
   - Flip the name of the container and nation rule files.

## 2024-3-08

### Features

1. Orphans
   - New tool migrated from queries to find cards inside of a deck that are not inside any collection.

### Adjustments

1. Rendering
   - Generate the entire site statically on the server.

## 2024-3-05

### Features

1. Config, Fast

   - New configuration setting to change the subdomain to fast.nationstates.net, set to www by default.
   - Change the theme immediately on configuration save.

2. UI Changes
   - Move Discord and Github icons to appear only on front page, and make the settings button more obvious.

## 2024-3-04

### Fixes

1. Various
   - Change links referring to userscripts to match changes to my userscript github repository.

## 2024-2-04

### Features

1. Transfer
   - New tool that is essentially just Gold Retriever, except it is specialized to output a text file list of nations that contain over a threshold of bank. This makes it easier to extract just the names for things like mass place bids and other scripts that handle transfers that aren't runnable in Hare's browser context.

## 2024-2-02

### Fixes

1. All tools using User Agent

   - Specify me as owner and for hare.

2. The year is 2024 now, fix wrong year changelogs.

## 2024-2-01

### Features

1. Deck to IDs
   - Duplicates or singles option.

## 2024-1-26

### Adjustments

1. Pinger
   - To maintain legality, restores cannot be done automatically. This means that in order to restore, you now need containers, with the same scripts as required in login sheet. Essentially, it will build a login sheet for the nations that require restores. A modification to the autologin userscript will allow it to autofill the revival page, meaning once pinger finishes execution, you just need to clear a login sheet to restore.

## 2024-1-25

### Features

1. Deck to IDs
   - Now pulls mode and type from config.

### Fixes

1. General
   - Fix issue with saving config because of wrong object.

## 2024-1-23

### Features

1. Wiz
   - Can now point to a region instead, idk useful for sniffing out randoms in your puppet regions I guess?

### Fixes

1. Gold Retriever
   - Properly show issues and packs when the mode is set to include them.

## 2024-1-21

### Features

1. Who's Farmin

   - Quick little tool that analyzes the world happenings shard for last 200 laws passed, and matches the names against 9003's puppet reporting sheet. This is all done in client and also not cached.

2. Bad Ledger GUI
   - Hare native gui, you can use it [here](https://hare.vercel.app/resources/ledger) but the non-Hare version is superior.

### Fixes

1. Gold Retriever
   - Readd the header row, it was being cleared on start.

## 2024-1-17

### Fixes

1. Theming

   - Revert internal logic which allowed for custom themes like the provided Amoled logic. This broke the behavior of the styling provided on guides and the changelog.
   - Amoled theme removed.

2. Changelog
   - Make changelog more maintainable by rendering it from markdown instead of a typescript object.

## 2024-1-14

### Features

1. Bazaar

   - Add link to new external trade records website.

2. RCES
   - Add a new tool that allows you to generate sheet generated by the RCES sheet generator.

### Fixes

1. General
   - Make dark mode HTML sheet more legible, as it was difficult to tell if a link was already clicked, also Purple Reign.

## 2024-1-11

### Features

1. JunkDaJunk
   - Ability to gift all cards by setting -1 to the bid value (requested by card gardens Shyshaeian Nation)

### Fixes

1. JunkDaJunk
   - Fix issue with handling highest bid due to the configurable bid values being interpolated as a string instead of a number.

## 2024-1-08

### Features

1. Deck to IDs
   - Now supports converting collections to ID (requested by kakastania)

### Fixes

1. Deck to IDs

   - Properly handle nations with only one card in their deck by converting the object to an array.

2. Gold Retriever
   - Properly retrieve data for nations without decks. Previously it was skipping nations with an empty CARDS.DECK.CARD.

## 2024-1-04

### Features

1. Ledger
   - Add shortcut to the Ledger resource on the front page.

## 2023-12-28

### Features

1. General
   - Add dark mode support to the downloadable HTML sheet.

## 2023-12-27

### Features

1. Flag Manager
   - Output from flag manager now downloadable as html sheet.

### Fixes

1. Deck to IDs
   - Fix issue where the wrong value would be loaded for mode on page load due to duplicate keys.

## 2023-12-26

### Fixes

1. Endotart
   - Change the default limit to have no value instead of zero.

## 2023-12-19

### Features

1. Options
   - Add a theme changer for light and dark in the configuration.

## 2023-11-19

### Features

1. Finder, JunkDaJunk

   - Add a query parameter giftto for gift userscript purposes.
   - Handle failed gifts by adding them to another sheet and properly outputting to the 'terminal' that the gift failed.

2. Finder
   - After running, output the amount of found cards, and if Finder was set to gift also output the amount of failed gifts.

### Fixes

1. Finder, JunkDaJunk

   - Remove autoclose from view links. On gift failures, add gift=1 to the sheet.

2. Finder
   - Rename giftee variables to avoid collision from default and locally set giftee nations.

## 2023-11-18

### Fixes

1. JunkDaJunk
   - Removed required status from the Card ID whitelist
   - Fix owner count whitelist logic.

## 2023-11-17

### Features

1. JunkDaJunk
   - Add the ability to whitelist specific card ids.

## 2023-11-16

1. Guides
   - Include mentions of Cardtainers, and replace mention of the legacy gi-browser suite tools with Hare.

## 2023-11-15

### Fixes

1. JunkDaJunk

   - Fix variable name duplication on owner count to allow for owner count whitelisting.

2. Finder
   - Correct numerical increment on the table rows for the html output.

## 2023-11-14

### Fixes

1. Finder, Gold Retriever, GotIssues, JunkDaJunk, Pinger
   - Properly handle multiple separate passwords with commas, additionally fallback to the globally configurable password value if any has been provided.

## 2023-11-12

### Features

1. All tools that use the API

   - Add support for respecting the retry-after header when rate limited to respect the NationStates rate limit.

2. Approvals

   - Utilize the helper parseXML function.

3. Deck to IDs

   - Now default option to return card ids formatted with their season after (IE: id,season) for use with other tools like Signal and Finder.

4. Where's WA
   - Is now stoppable (for when you are rate-limited)

## 2023-11-09

### Features

1. NEW - Deck to IDs

   - Given a deck, get a downloadable text file of ids.

2. JunkDaJunk
   - Add an option to whitelist particular flags. By this, this means any part of the flag parameter stored in NationStates. For example to skip any default game flag you would provide .svg.

## 2023-11-06

### Features

1. JunkDaJunk
   - Add an option to exclude any cards that meet the whitelist from the resulting sheet, instead of appending them to the bottom.

### Fixes

1. JunkDaJunk

   - Cast the region returned from the NationStates into a string, to catch the case in which regions with only numbers in their name are parsed as a string.

2. Legendary Tracker
   - Fixed the date interpolation in the subtitle.

## 2023-11-05

### Features

1. Finder, Gold Retriever, JunkDaJunk, Pinger
   - Add support for nation,password formatting identical to that of gotIssues.

## 2023-11-04

### Features

1. Statistics
   - Added name mapping to census numbers (IE: 3 - population) to the 'terminal' output.

### Fixes

1. Flag Manager
   - Include error handling to prevent the tools stopping prematurely on an error.

## 2023-11-02

### Features

1. NEW - Signal

   - A new tool that works with card queries. Given a list of card ids, you can get the cards from that ID list that are not present in the provided collections/decks/asks or bids.

2. Pinger

   - Pinger now implements an iframe that allows for the restoration of nations.

3. Statistics
   - Implement mappings to map the numerical census values to their actual names.

### Fixes

1. Guides - Cardtainers
   - Add links where they make sense and fix the broken pre element at the bottom.

## 2023-11-01

### Features

1. NEW - Statistics

   - Add a new tool that takes a list of nations, then gets statistics like the mean, average, and total for the provided census stat categories.

2. Config
   - The config now displays a toast indicating what config values have been read as changed.

### Fixes

1. All
   - Internal adjustments to tool components.

## 2023-10-30

### Features

1. NEW - Flag Manager

   - Add a new tool that takes a flag file name and finds all the nations with that specified flag.

## 2023-10-27

### Adjustments

1. JunkDaJunk
   - Improve logging on skips, indicating the reason.
   - Fix randomly overwriting JDJ with Finder.
   - Pass the giftee in the url.

## 2023-10-26

### Features

Stop Button added to all tools that can be stoppped.

## 2023-10-20

### Fixes

1. Finder, JunkDaJunk
   - Fix storage and handling of X-Pin for protected authentication.

## 2023-10-20

### Features

1. NEW - Legendary Tracker

   - Add a new resource to track the cte status of legendaries, converted to Svelte from [Ledger's tracker](https://ledger.kractero.com/legendaries).

## 2023-10-14 - 2023-10-19

A large pull request that involved the move from static website to Vercel and other changes.

Fix various issues with the url on form submission. Fixes to cards-resources.

### Adjustments

1. JunkDaJunk

   - Properly sleep between gifts
   - Output the count in the outputted html table cells.
   - Sales should use a different counter.
   - Allow whitelisting seasons and exnation (S1).

2. JunkDaJunk, Finder

   - Properly handle decks with 0/1 card/cards.
   - Implement specific gifting to certain nations with ,GIFTTO.
   - Fix region parsing for whitelist.
   - Add sale links to the end.

3. Endotart, Spyglass
   - A message is outputted if the nation being queried is not in the dump yet.
   - Better handling when nations aren't in the dump.

## 2023-10-11

Merge card-resources into Hare.

## 2023-10-10

### Adjustments

1. Endotart

   - Add an option to use the endotart dumps instead of the API.

2. Rate of Change

   - Allow nations to be put as input.

3. GotIssues

   - Add a mode option to allow processing issues, packs, or both.
   - Properly handle 1 issue

4. JunkDaJunk

   - Skip empty decks.
   - Option to check the amount of cards in a deck before deciding to junk or not.

## 2023-10-08

### Features

1. NEW - Spyglass

   - Terrible Hare implementation of Spyglass.

## 2023-10-05

### Features

1. NEW - Approvals

   - Given a piece of WA legislation, get the delegates not approving it yet.

2. NEW - Endotart

   - A endotarter for Hare

3. NEW - Not Endorsing Nation

   - Tool to find nations in a region not endorsing the specified nation.

4. NEW - Wiz

   - Provided nations, log their last login date.

5. NEW - Finder

   - Given nations and a set of ids, gift/add to a sheet the cards if found.

6. NEW - Creator

   - Outputs an html sheet that prefills the create_nation page with the hel pof two userscripts.

7. NEW - Rate of Change

   - Get the rate of change for a specified stat for nations over an amount of time.

## 2023-10-01

### Features

1. NEW - Pinger

2. NEW - Where's My WA

3. NEW - Gold Retriever

4. NEW - Login Sheet

5. NEW - Containerise Rule Generator

## 2023 September and Older

Project created from the archived gi-browser, an older version of Hare that had gotIssues and junkDaJunk support.
