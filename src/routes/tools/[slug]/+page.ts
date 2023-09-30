import type { PageLoad } from "./$types";

export const load: PageLoad = ({ params }) => {
    return {
		tool: {
			name: params.slug
		}
	};
}