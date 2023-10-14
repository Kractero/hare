import { parse } from 'path';

type GlobEntry = {
    metadata: Post;
    default: unknown;
};

export interface Post {
    title: string;
    description: string;
    url: string;
    author: string;
    order: number;
}

export const posts = Object.entries(
        import.meta.glob<GlobEntry>('/src/lib/posts/**/*.md', { eager: true })
    )
    .map(([filepath, globEntry]) => {
        return {
        ...globEntry.metadata,

        slug: parse(filepath).name,
        };
    })
    .map((post, index, allPosts) => ({
        ...post,
        next: allPosts[index - 1] || 0,
        previous: allPosts[index + 1] || 0,

    }))
    .sort((a, b) => a.order - b.order
);