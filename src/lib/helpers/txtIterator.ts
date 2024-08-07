export async function nsIterator(puppets: string, mode: string, main?: string) {
	const puppetsList = puppets.split('\n');
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
			}</p></td><td><p><a target="_blank" href="https://${localStorage.getItem("connectionUrl") || "www"}.nationstates.net/container=${nation_formatted}/nation=${nation_formatted}/page=upload_flag/test=1/User_agent=${main}/Script=Login_Sheet/Generated_by=Login_Sheet/Author_discord=scrambleds/Author_main_nation=Kractero/">Link to Nation</a></p></td></tr>`;
		}
		if (mode === 'Creator') {
			buildString += `<tr><td><p>${i + 1} of ${
				puppetsList.length
			}</p></td><td><p><a target="_blank" href="https://${localStorage.getItem("connectionUrl") || "www"}.nationstates.net/container=${nation_formatted}/nation=${nation_formatted}/page=create_nation/User_agent=${main}/Script=Creator/Generated_by=Creator/Author_discord=scrambleds/Author_main_nation=Kractero/nation=${nation}">Link to Nation</a></p></td></tr>`;
		}
	}
	return mode === 'Container Rules' ? [containerise_nation, containerise_container] : buildString;
}
