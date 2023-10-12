export const pushHistory = (params: string) => {
    const currentURL = window.location.href;
    const baseURL = currentURL.split('?')[0];
    window.history.pushState(null, '', `${baseURL}${params}`);
}