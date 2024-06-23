// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const beforeUnload = (e: any) => {
    const message = 'Are you sure you want to leave?';
    e.returnValue = message;
    return message;
}