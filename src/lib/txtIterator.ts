export async function nsIterator(puppets: string, mode: string, main?: string) {
	let puppetsList = puppets.split('\n');
	let buildString = '';
    let containerise_nation = '';
    let containerise_container = '';
	for (let i = 0; i < puppetsList.length; i++) {
		let nation = puppetsList[i];
		if (nation.includes(',')) {
			nation = nation.substring(0, nation.indexOf(','));
		}
		const nation_formatted = nation.toLowerCase().replaceAll(' ', '_');
		if (mode === 'Container Rules') {
			containerise_nation += `@^.*\\.nationstates\\.net/(.*/)?nation=${nation_formatted}(/.*)?$ , ${nation}\n`;
			containerise_container += `@^.*\\.nationstates\\.net/(.*/)?container=${nation_formatted}(/.*)?$ , ${nation}\n`;
		}
		if (mode === 'Login Sheet') {
			buildString += `<tr><td><p>${i + 1} of ${
				puppetsList.length
			}</p></td><td><p><a target="_blank" href="https://www.nationstates.net/nation=${nation_formatted}/page=upload_flag/test=1/User_agent=${main}">Link to Nation</a></p></td></tr>`;
		}
	}
    return mode === 'Container Rules' ? [containerise_nation, containerise_container]: buildString;
}
