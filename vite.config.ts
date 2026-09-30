import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

const now = new Date()
const pad = (n: number) => String(n).padStart(2, '0')
const calver = `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())}`

export default defineConfig({
	server: {
		fs: {
			// Allow serving files from one level up to the project root
			allow: ['..'],
		},
	},
	define: {
		__CALVER__: JSON.stringify(calver),
	},
	plugins: [sveltekit()],
})
