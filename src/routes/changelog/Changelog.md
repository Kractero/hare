# Changelog

## 2024-8-06

### Creator

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
