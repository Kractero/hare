interface Tool {
    name: string;
    description: string;
    category: string;
    credentials: boolean
}

/*
    Category is more like intended use case than a filterable category.
    Credentials indicate whether or not the script requires passwords for each nation.
*/

export const tools: Array<Tool> = [
    {
        "name": "gotissues",
        "description": "An even faster way to answer issues with python.",
        "category": "cards",
        "credentials": true
    }
]