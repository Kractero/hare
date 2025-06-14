import { groupedPosts } from '$lib/server/posts'

import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	return {
		groupedPosts,
	}
}
