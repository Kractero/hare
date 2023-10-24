import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ( { params, url }) => {
    const { region } = params;
    const searchParams = url.searchParams;
    const parameters: {[key: string]: string} = {};
    for (const [key, value] of searchParams) {
      parameters[key] = value;
    }
    return {
      "parameters": parameters,
      region
    };
};