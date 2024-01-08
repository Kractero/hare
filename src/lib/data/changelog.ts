export const changelog = [
    {
        "date": "2023-11-19",
        "changes": {
            "fixes": [
                [
                    "Gold Retriever",
                    "Fix issue where nations with one card in their deck do not get properly parsed."
                ]
            ]
        }
    },
    {
        "date": "2023-11-19",
        "changes": {
            "fixes": [
                [
                    "Gold Retriever",
                    "Move calculation of bank, deck value, and card count to be independent of actually having cards as they are separate objects."
                ]
            ]
        }
    },
    {
        "date": "2023-1-04",
        "changes": {
            "features": [
                [
                    "Ledger Shortcut",
                    "Add ledger shortcut to resources row on the front page."
                ]
            ]
        }
    },
    {
        "date": "2023-12-19",
        "changes": {
            "features": [
                [
                    "Themes",
                    "Test a theme changer in the configuration and an 'amoled' theme which is just dark but with a black background."
                ]
            ]
        }
    },
    {
        "date": "2023-11-19",
        "changes": {
            "features": [
                [
                    "Finder, JunkDaJunk",
                    "Add a query parameter giftto for gift userscript purposes."
                ],
                [
                    "Finder",
                    "Handle failed gifts by adding them to another sheet and properly outputting that it failed.",
                    "After running, output the amount of found cards and if Finder was set to gift also output the amount of failed gifts."
                ],
                [
                    "JunkDaJunk",
                    "Handle failed gifts by adding them to the bottom of the junk sheet on gift mode. Regardless you should be using finder to gift, not junkdajunk."
                ]
            ],
            "fixes": [
                [
                    "Finder, JunkDaJunk",
                    "Remove autoclose from view links. On gift failures, add gift=1.",
                ],
                [
                    "Finder",
                    "Rename giftee variables to avoid collision from default and locally set giftee nations."
                ]
            ]
        }
    },
    {
        "date": "2023-11-18",
        "changes": {
            "fixes": [
                [
                    "JunkDaJunk",
                    "Remove required status from Card ID whitelist.",
                    "Fix owner count whitelist logic."
                ]
            ]
        }
    },
    {
        "date": "2023-11-17",
        "changes": {
            "features": [
                [
                    "JunkDaJunk",
                    "Whitelist specific cards."
                ]
            ]
        }
    },
    {
        "date": "2023-11-16",
        "changes": {
            "fixes": [
                [
                    "Guides",
                    "Include mentions of cardtainers, and replace mentions of gi-browser suite tools with Hare."
                ]
            ]
        }
    },
    {
        "date": "2023-11-15",
        "changes": {
            "fixes": [
                [
                    "JunkDaJunk",
                    "Fix variable name duplication on owner count to allow for owner count whitelisting."
                ],
                [
                    "Finder",
                    "Correct numerical increment on table rows for html output."
                ]
            ]
        }
    },
    {
        "date": "2023-11-14",
        "changes": {
            "fixes": [
                [
                    "Finder, Gold Retriever, gotIssues, JunkDaJunk, Pinger",
                    "Properly handle multiple separate passwords with commas, additionally fallback to any provided general password value if any."
                ],
            ]
        }
    },
    {
        "date": "2023-11-12",
        "changes": {
            "features": [
                [
                    "All Tools Using the API",
                    "Respect the retry-after header when ratelimited, wait the duration, then continue."
                ],
                [
                    "Approvals",
                    "Utilize the parseXML helper function."
                ],
                [
                    "Deck",
                    "New default option to return card ids formatted with their season after (ID,season) for use with Signal."
                ],
                [
                    "Where's WA",
                    "Is now stoppable (for when you are rate-limited)."
                ]
            ]
        }
    },
    {
        "date": "2023-11-09",
        "changes": {
            "features": [
                [
                    "Deck to IDs",
                    "NEW - Given a deck, get a downloadable text file of ids."
                ],
                [
                    "JunkDaJunk",
                    "Add option to whitelist flags."
                ]
            ]
        }
    },
    {
        "date": "2023-11-06",
        "changes": {
            "features": [
                [
                    "JunkDaJunk",
                    "Add option to exclude any cards that meet the whitelist from the resulting sheet, instead of appending them to the bottom."
                ]
            ],
            "fixes": [
                [
                    "JunkDaJunk",
                    "Cast the region returned from the NationStates API into a string. I believe this will avoid regions like 0000 being caught in the whitelist."
                ],
                [
                    "Legendary Tracker",
                    "Fixed date interpolation in the subtitle."
                ]
            ]
        }
    },
    {
        "date": "2023-11-05",
        "changes": {
            "features": [
                [
                    "Finder, Gold Retriever, JunkDaJunk, Pinger",
                    "Added support for nation,password formatting, identical to the behavior of gotIssues."
                ]
            ],
        }
    },
    {
        "date": "2023-11-04",
        "changes": {
            "features": [
                [
                    "Statistics",
                    "Added name mappings to census number values (IE: 3 is Population) to the terminal output."
                ]
            ],
            "fixes": [
                [
                    "Flag Manager",
                    "Include error handling to prevent tool from stopping prematurely on error."
                ]
            ]
        }
    },
    {
        "date": "2023-11-02",
        "changes": {
            "features": [
                [
                    "Signal",
                    "NEW - A new tool that works with card queries. Given a list of card ids, you can get the cards from that id list that are not present in the provided collections/decks/asks or bids."
                ],
                [
                    "Pinger",
                    "Pinger now implements an iframe that allows for restoring nations."
                ],
                [
                    "Statistics",
                    "Backend implementation for name mappings to census number values."
                ]
            ],
            "fixes": [
                [
                    "Guides - Cardtainers",
                    "Add links where they make sense and fix broken pre element at the bottom."
                ]
            ]
        }
    },
    {
        "date": "2023-11-04",
        "changes": {
            "features": [
                [
                    "Statistics",
                    "NEW - A new tool that takes a list of nations, then gets statistics like the mean, average, and total for the provided census stat categories."
                ],
                [
                    "Config",
                    "The config now displays toasts when the submit button is clicked, to indicate which config values have changed."
                ]
            ],
            "fixes": [
                [
                    "All",
                    "Internal adjustments to tool components."
                ]
            ]
        }
    }
]