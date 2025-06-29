---
title: JunkDaJunk
description: JunkDaJunk Parameters
url: junkdajunk
author: Kractero
order: 6
category: tools
---

junkDaJunk is a tool that processes cards on a nation and junks them if they do not meet various conditions. This is a page that shows what each setting of junkDaJunk does. This isn't intended to be a guide on how to use it.

### Modes

1. Advanced

The standard/older junkdajunk mode, which checks flags, regions, owner count, bids, exnation status (for s1s).

2. Simple

Skips all of those and only checks ids, rarity, mv, and seasons. Quicker than davanced but less precise.

### Junk Modes

1. API

Junks automatically via the API.

2. Manual

Adds it to an html sheet for manual junk processing.

### Behaviors

1. Gift

When a card is marked as not junk, junkDaJunk will attempt to gift the card to the configured giftto nation. If this fails, it will add it to a sale sheet.

2. Sell

When a card is marked as not junk, junkDaJunk will add it to a sale sheet.

3. Gift and Sell (only usable with **Advanced** mode)
   When a card is marked as not junk, junkDaJunk will dynamically choose whether to gift or sell a card based on its market value and bid activity:

   - If the the card's highest bid exceeds the gift rarity lowest bid or the market value does, the card will be gifted.
   - If the the card's highest bid exceeds the sell rarity lowest bid or the market value does, the card will be added to a sale sheet.

4. Exclude

When a card is marked as not junk, junkDaJunk will simply ignore it.

### Whitelist and Thresholds

- The card ID whitelist can specify a season as well, using the format:
  `CARDID,SEASON,GIFTTO`
  instead of just `CARDID` on each line.

- If `GIFTTO` is provided, it will override the default "Gift To" nation, but a season must be specified to use `GIFTTO`.

- The regional whitelist lists regions to skip when deciding whether to junk cards.

- The card count threshold indicates to skip jdj on nations that have more than this amount of cards.

- The owner count threshold indicates to not junk cards that have fewer owners than the specified minimum.

- The rarity threshold indicates to skip junking based on the card's rarity and market value.

- The rarity lowest bid indicates to skip junking based on the card's rarity and configured lowest bid.

- The maximum bank threshold indicates to skip junking if the nations bank exceeds the specified amount.
  A value of `-1` means JDJ will never skip.

- Junk Up To threshold indicates to skip junking after the specified amount of cards have been junked.
  A value of `-1` means JDJ will never skip.

### Recommended Usage

For optimal use, you should use the
[finder gift default](https://github.com/Kractero/userscripts/blob/main/finderJDJDefault.user.js) userscript when gifting.
When gifting, password input is optional and will be disabled if the puppet list includes a comma for nation,password.
