interface Tool {
	name: string;
	slug: string;
	description: string;
}

/*
    Category is more like intended use case than a filterable category.
    Credentials indicate whether or not the script requires passwords for each nation.
*/

export const tools: Array<Tool> = [
	{
		name: 'gotIssues',
		slug: 'gotissues',
		description: 'An even faster way to answer issues with JavaScript.'
		// "category": "cards"
	},
	{
		name: 'junkDaJunk',
		slug: 'junkdajunk',
		description: 'An even faster way to junk cards with JavaScript, with configurable rules.'
		// "category": "cards"
	},
	{
		name: 'Gold Retriever',
		slug: 'goldretriever',
		description: 'Check the card count, bank, deck value, and junk value of all your puppets.'
		// "category": "cards"
	},
	{
		name: 'Containerise Rules',
		slug: 'containerise',
		description: 'Generate container rules for use with Containerise.'
		// "category": "cards"
	},
	{
		name: 'Login Sheet',
		slug: 'login',
		description: 'Generate a login sheet for quickly logging into expired containers.'
		// "category": "cards"
	},
	{
		name: 'Pinger',
		slug: 'ping',
		description: 'Ping all your nations, delaying their impending doom.'
		// "category": "cards"
	},
	{
		name: 'Wheres My WA',
		slug: 'whereswa',
		description: 'Locate which of your puppets is your current WA member.'
		// "category": "cards"
	},
	{
		name: 'Rate of Change',
		slug: 'roc',
		description: 'Calculate the rate of change for an amount of nations over an amount of days.'
		// "category": "cards"
	},
	{
		name: 'Endotart',
		slug: 'endotart',
		description: 'Specify a nation and get all the regionmates they are not endorsing.'
		// "category": "cards"
	},
	{
		name: 'Not Endorsing',
		slug: 'nen',
		description: 'Specify a nation and get all the regionmates not endorsing them.'
		// "category": "cards"
	},
	{
		name: 'Approvals List',
		slug: 'approval',
		description: 'Specify a proposal and get all delegates that are not approving it.'
		// "category": "cards"
	},
	{
		name: 'Glasses',
		slug: 'spyglass',
		description: 'Generate a spreadsheet containing regional information.'
		// "category": "cards"
	},
	{
		name: 'Finder',
		slug: 'finder',
		description: 'Find which of the specified nations have which of the specified cards.'
		// "category": "cards"
	},
	{
		name: 'Creator Assistant',
		slug: 'creation',
		description: 'Generate a sheet that has links for nation creation that works with the provided userscripts.'
		// "category": "cards"
	},
	{
		name: 'Wiz',
		slug: 'wiz',
		description: 'Output the last login date of the provided puppet list.'
		// "category": "cards"
	},
];
