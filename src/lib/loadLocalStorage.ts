export function loadLocalStorage(keysToLoad: string[]) {
	const loadedValues: { [key: string]: any } = {};
	keysToLoad.forEach((key) => {
		switch (key) {
			case 'stationJDJ':
				loadedValues.rarities = {
					common: Number(localStorage.getItem(`${key}Common`)) || 0.5,
					uncommon: Number(localStorage.getItem(`${key}Uncommon`)) || 1,
					rare: Number(localStorage.getItem(`${key}Rare`)) || 1,
					'ultra-rare': Number(localStorage.getItem(`${key}UltraRare`)) || 1,
					epic: Number(localStorage.getItem(`${key}Epic`)) || 1
				};
				break;
            case 'stationEndotartLimit':
                loadedValues.limit = Number(localStorage.getItem(key)) || undefined;
                break;
			case 'stationROCDays':
				loadedValues.days = Number(localStorage.getItem(key)) || 30;
				break;
			case 'stationROCTop':
				loadedValues.top = Number(localStorage.getItem(`${key}`)) || 100;
				break;
            case 'stationJDJDefault':
                loadedValues.jdjMode = localStorage.getItem(`${key}`) || "Gift";
                break;
            case 'stationFinderDefault':
                loadedValues.finderMode = localStorage.getItem(`${key}`) || "Gift";
                break;
			default:
				loadedValues[key.replace('station', '').toLowerCase()] = localStorage.getItem(key) || '';
				break;
		}
	});
	return loadedValues;
}
