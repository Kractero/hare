let scores = `0 - civil rights
1 - economy
2 - political freedoms
3 - population
4 - wealth gaps
5 - death rate (née unexpected death rate)
6 - compassion
7 - eco-friendliness
8 - social conservatism
9 - nudity
10 - industry: automobile manufacturing
11 - industry: cheese exports
12 - industry: basket weaving
13 - industry: informtion technology
14 - industry: pizza delivery
15 - industry: trout fishing
16 - industry: arms manufacturing
17 - sector: agriculture
18 - industry: beverage sales
19 - industry: timber woodchipping
20 - industry: mining
21 - industry: insurance
22 - industry: furniture restoration
23 - industry: retail
24 - industry: book publishing
25 - industry: gambling
26 - sector: manufacturing
27 - government size
28 - welfare
29 - public healthcare
30 - law enforcement
31 - business subsidization
32 - religiousness
33 - income equality
34 - niceness
35 - rudeness
36 - intelligence
37 - ignorance (née stupidity)
38 - political apathy
39 - health
40 - cheerfulness (née happiness)
41 - weather
42 - compliance (née safety from crime)
43 - safety
44 - lifespan
45 - ideological radicality
46 - defense forces
47 - pacifism
48 - economic freedom (née most pro-market)
49 - taxation
50 - freedom from taxation
51 - corruption
52 - integrity (née freedom from corruption)
53 - authoritarianism
54 - youth rebelliousness
55 - culture
56 - employment
57 - public transport
58 - tourism
59 - weaponization
60 - recreational drug use
61 - obesity
62 - secularism (née godlessness)
63 - environmental beauty
64 - charmlessness (née toxicity)
65 - influence
66 - world assembly endorsements
67 - averageness
68 - human development index
69 - primitiveness
70 - scientific advancement
71 - inclusiveness
72 - average income
73 - average income of poor
74 - average income of rich
75 - public education
76 - economic output
77 - crime
78 - foreign aid
79 - black market
80 - residency
81 - survivors
82 - zombies
83 - dead
84 - percentage zombies
85 - average disposable income
86 - international artwork
87 - patriotism
88 - food quality`;

let scoresObj: {[key: string]: string} = {}
scores.split('\n').forEach((score) => {
	let split = score.split('-');
    scoresObj[split[0].trim()] = split[1]
        .substring(0, split[1].includes('(') ? split[1].indexOf('(') : split[1].length)
        .trim()
        .split(' ')
        .map((word) => word[0].toUpperCase() + word.substring(1))
        .join(' ')
});

console.log(scoresObj)