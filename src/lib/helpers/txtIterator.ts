export async function nsIterator(puppets: string, mode: string, main?: string) {
    const puppetsList = puppets.split('\n').map(nation => nation.split(',')[0].trim().toLowerCase().replace(/ /g, '_'));

    const baseURL = `https://${localStorage.getItem("connectionUrl") || "www"}.nationstates.net`;

    const buildTableRow = (index: number, nation: string, path: string, script: string) => `
        <tr>
            <td><p>${index + 1} of ${puppetsList.length}</p></td>
            <td><p><a target="_blank" href="${baseURL}/${path}/User_agent=${main}/Script=${script}/Generated_by=${script}/Author_discord=scrambleds/Author_main_nation=Kractero/${path.includes('create_nation') ? `nation=${nation}` : ''}">Link to Nation</a></p></td>
        </tr>`;

    const generateContainerRules = () => {
        const nationRules = puppetsList.map(nation => `@^.*\\.nationstates\\.net/(.*/)?nation=${nation}(/.*)?$ , ${nation}`).join('\n');
        const containerRules = puppetsList.map(nation => `@^.*\\.nationstates\\.net/(.*/)?container=${nation}(/.*)?$ , ${nation}`).join('\n');
        return [nationRules, containerRules];
    };

    switch (mode) {
        case 'Container Rules':
            return generateContainerRules();

        case 'Login Sheet':
            return puppetsList.map((nation, i) => buildTableRow(i, nation, `container=${nation}/nation=${nation}/page=upload_flag/test=1`, 'Login_Sheet')).join('\n');

        case 'Creator':
            return puppetsList.map((nation, i) => buildTableRow(i, nation, `container=${nation}/nation=${nation}/page=create_nation`, 'Creator')).join('\n');

        default:
            return '';
    }
}
