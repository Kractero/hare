interface Tool {
	name: string;
	slug: string;
	description: string;
}

export const tools: Array<Tool> = [
	{
		name: 'gotIssues',
		slug: 'gotissues',
		description: 'An even faster way to answer issues with JavaScript.'
	},
	{
		name: 'junkDaJunk',
		slug: 'junkdajunk',
		description: 'An even faster way to junk cards with JavaScript, with configurable rules.'
	},
	{
		name: 'Gold Retriever',
		slug: 'goldretriever',
		description: 'Check the card count, bank, deck value, and junk value of all your puppets.'
	},
	{
		name: 'RCES',
		slug: 'rces',
		description: 'Generate a sheet of clickable links pointing to various puppets.'
	},
	{
		name: 'Login Sheet',
		slug: 'login',
		description: 'Generate a login sheet for quickly logging into expired containers.'
	},
	{
		name: 'Pinger',
		slug: 'ping',
		description: 'Ping all your nations, delaying their impending doom.'
	},
	{
		name: 'Wheres My WA',
		slug: 'whereswa',
		description: 'Locate which of your puppets is your current WA member.'
	},
	{
		name: 'Rate of Change',
		slug: 'roc',
		description: 'Calculate the rate of change for an amount of nations over an amount of days.'
	},
	{
		name: 'Endotart',
		slug: 'endotart',
		description: 'Specify a nation and get all the regionmates they are not endorsing.'
	},
	{
		name: 'Not Endorsing',
		slug: 'nen',
		description: 'Specify a nation and get all the regionmates not endorsing them.'
	},
		{
		name: 'Whos Farmin',
		slug: 'whosfarmin',
		description: 'Scan the last 200 happenings and see who is farming.'
	},
	{
		name: 'Transfer',
		slug: 'transfer',
		description: 'Takes a bank threshold and receive a text file with puppets that have that bank or higher.'
	},
	{
		name: 'Containerise Rules',
		slug: 'containerise',
		description: 'Generate container rules for use with Containerise.'
	},
	{
		name: 'Approvals List',
		slug: 'approval',
		description: 'Specify a proposal and get all delegates that are not approving it.'
	},
	{
		name: 'Glasses',
		slug: 'spyglass',
		description: 'Generate a spreadsheet containing regional information.'
	},
	{
		name: 'Finder',
		slug: 'finder',
		description: 'Find which of the specified nations have which of the specified cards.'
	},
	{
		name: 'Signal',
		slug: 'signal',
		description: 'Given card ids, provide decks, collections, or check asks and bids for what is missing. Sideroca compatible.'
	},
	{
		name: 'Deck to IDs',
		slug: 'deck',
		description: 'Turn a deck into a text file of card ids.',
	},
	{
		name: 'Statistics',
		slug: 'statistics',
		description: 'Provided WA scales and puppets, get the mean, median, and mode for each scale. (WIP)'
	},
	{
		name: 'Creator Assistant',
		slug: 'creation',
		description: 'Generate a sheet that has links for nation creation that works with the provided userscripts.'
	},
	{
		name: 'Wiz',
		slug: 'wiz',
		description: 'Output the last login date of the provided puppet list.'
	},
	{
		name: 'Flag Manager',
		slug: 'flags',
		description: 'Find which puppets have a specific flag.'
	},
];

export const otherHareTools: Array<Tool> = [
	{
		name: 'Legendary Tracker',
		slug: 'legends',
		description: 'View legendaries and whether they are CTE or not.'
	},
	{
		name: 'Bazaar',
		slug: 'https://bazaar.sideroca.com',
		description: 'View historical trade information dating back to April 1st, 2018.'
	},
	{
		name: 'Ledger',
		slug: 'https://kractero.github.io/ledger',
		description: 'Data and statistics for the top 100 nations.'
	},
]
