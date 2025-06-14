import { parse } from 'path'

type GlobEntry = {
	metadata: Post
	default: unknown
}

export interface Post {
	title: string
	description?: string
	url: string
	author: string
	order: number
	category: string
	slug: string
}

const rawPosts = Object.entries(import.meta.glob<GlobEntry>('/src/lib/posts/**/*.md', { eager: true })).map(
	([filepath, globEntry]) => {
		return {
			...globEntry.metadata,
			slug: parse(filepath).name,
			url: `/resources/guides/${parse(filepath).name}`,
		}
	}
)

// Add manual post
rawPosts.push({
	title: 'Tools',
	description: '',
	url: '/resources/tools',
	author: '',
	order: 9999, // position this as you like
	category: 'Utilities',
	slug: 'tools',
})

export const posts = rawPosts
	.map((post, index, allPosts) => ({
		...post,
		next: allPosts[index - 1] || 0,
		previous: allPosts[index + 1] || 0,
	}))
	.sort((a, b) => a.order - b.order)

export const groupedPosts: Record<string, Post[]> = posts.reduce((acc: Record<string, Post[]>, post) => {
	if (!acc[post.category]) acc[post.category] = []
	acc[post.category].push(post)
	return acc
}, {})
