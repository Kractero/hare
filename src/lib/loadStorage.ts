export function loadStorage(key: string) {
    switch (key) {
        case 'junkdajunkRarities':
            return {
                common: Number(localStorage.getItem(`${key}Common`)) || 0.5,
                uncommon: Number(localStorage.getItem(`${key}Uncommon`)) || 1,
                rare: Number(localStorage.getItem(`${key}Rare`)) || 1,
                'ultra-rare': Number(localStorage.getItem(`${key}UltraRare`)) || 1,
                epic: Number(localStorage.getItem(`${key}Epic`)) || 1
            };
        case 'stationROCDays':
            return Number(localStorage.getItem(key)) || 30;
        case 'stationROCTop':
            return Number(localStorage.getItem(`${key}`)) || 100;
        default:
            return localStorage.getItem(key) || '';
    }
}