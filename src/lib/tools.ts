interface Tool {
    name: string;
    slug?: string;
    description: string;
    category: string;
}

/*
    Category is more like intended use case than a filterable category.
    Credentials indicate whether or not the script requires passwords for each nation.
*/

export const tools: Array<Tool> = [
    {
        "name": "gotIssues",
        "slug": "gotissues",
        "description": "An even faster way to answer issues with python.",
        "category": "cards"
    },
    {
        "name": "junkDaJunk",
        "slug": "junkdajunk",
        "description": "An even faster way to junk cards with python.",
        "category": "cards"
    },
    {
        "name": "Gold Retriever",
        "slug": "goldretriever",
        "description": "Check puppet trading cards', total bank, deck value, and more.",
        "category": "cards"
    },
    {
        "name": "Containerise Rules",
        "slug": "containerise",
        "description": "Generate container rules for use with Containerise.",
        "category": "cards"
    },
    {
        "name": "Login Sheet",
        "slug": "login",
        "description": "Check puppet trading cards', total bank, deck value, and more",
        "category": "cards"
    },
    {
        "name": "Pinger",
        "slug": "ping",
        "description": "Ping all your nations, delaying their impending doom.",
        "category": "cards"
    },
    {
        "name": "Wheres My WA",
        "slug": "whereswa",
        "description": "Ping all your nations, delaying their impending doom.",
        "category": "cards"
    },
    {
        "name": "Rate of Change",
        "slug": "roc",
        "description": "Ping all your nations, delaying their impending doom.",
        "category": "cards"
    }
]