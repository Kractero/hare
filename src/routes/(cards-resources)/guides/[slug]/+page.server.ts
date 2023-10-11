import { posts } from '$lib/server/posts';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    const { slug } = params;

    const post = posts.find((post) => slug === post.slug);

    if (!post) {
        throw error(404, 'Post not found');
    }

    return {
        post,
    };
};