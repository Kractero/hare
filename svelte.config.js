import adapter from '@sveltejs/adapter-node';
import { mdsvex } from 'mdsvex';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import mdsvexConfig from './mdsvex.config.js'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', ...mdsvexConfig.extensions],
	preprocess: [
		mdsvex(mdsvexConfig),
		vitePreprocess()
	],

	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: '404.html',
			precompress: true,
			strict: true,
		}),
		// adapter: adapter(),

		prerender: {
			entries: ["/", "/config", "/disclaimer", "/resources", "/resources/ledger", "/resources/guides", "/guides", "/guides/[slug]"]
		}
	},
};

export default config;