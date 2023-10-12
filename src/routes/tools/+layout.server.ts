import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ( { url }) => {
    const searchParams = url.searchParams;
    const parameters: {[key: string]: string} = {};
    for (const [key, value] of searchParams) {
      parameters[key] = value;
    }
    return {
      "parameters": parameters
    };
};