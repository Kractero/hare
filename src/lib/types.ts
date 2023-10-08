export interface NSRegion {
    NAME:            string;
    FACTBOOK:        string;
    NUMNATIONS:      number;
    NATIONS:         string;
    DELEGATE:        number;
    DELEGATEVOTES:   number;
    DELEGATEAUTH:    string;
    FRONTIER:        number;
    FOUNDER:         string;
    GOVERNOR:        string;
    OFFICERS:        Officers;
    POWER:           string;
    FLAG:            string;
    BANNER:          number;
    BANNERURL:       string;
    EMBASSIES:       Embassies;
    LASTUPDATE:      number;
    LASTMAJORUPDATE: number;
    LASTMINORUPDATE: number;
    UNNATIONS:       string;
}

export interface Embassies {
    EMBASSY: Array<PendingEmbassy | string>;
}

export interface PendingEmbassy {
    "#text":  string;
    "@_type": string;
}

export interface Officers {
    OFFICER: Officer;
}

export interface Officer {
    NATION:    string;
    OFFICE:    string;
    AUTHORITY: string;
    TIME:      number;
    BY:        string;
    ORDER:     number;
}

/*
    gotIssues
    Omitting unused k/vs from the json response, only the ID is needed
*/

export interface IssuesList {
    ISSUE: Issue[] | Issue;
}

export interface Issue {
    "@_id":  string;
}