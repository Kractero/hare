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
