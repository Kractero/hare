import { error } from '@sveltejs/kit'
import { groupedPosts } from '$lib/server/posts'

import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params }) => {
	const { slug } = params

	const post = Object.values(groupedPosts)
		.flat()
		.find(post => slug === post.slug)

	if (!post) {
		throw error(404, 'Post not found')
	}

	return {
		post,
		groupedPosts,
	}
}
