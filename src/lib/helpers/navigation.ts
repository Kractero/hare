import { pushState } from "$app/navigation";

export const pushHistory = (params: string) => {
	const currentURL = window.location.href;
	const baseURL = currentURL.split('?')[0];
	pushState(`${baseURL}${params}`, `${baseURL}${params}`);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const beforeUnload = (e: any) => {
    const message = 'Are you sure you want to leave?';
    e.returnValue = message;
    return message;
}