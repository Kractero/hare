export const changelog = [
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