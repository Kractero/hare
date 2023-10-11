/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				background: 'rgb(var(--color-primary) / <alpha-value>)',
				content: 'rgb(var(--color-secondary) / <alpha-value>)',
				tertiary: 'rgb(var(--color-tertiary) / <alpha-value>)',
				textprimary: 'rgb(var(--text-primary) / <alpha-value>)',
				textcontent: 'rgb(var(--text-content) / <alpha-value>)',
				cardprimarytext: 'rgb(var(--card-text-primary) / <alpha-value>)',
				cardsecondarytext: 'rgb(var(--card-text-secondary) / <alpha-value>)',
				label: 'rgb(var(--labels) / <alpha-value>)',
				herobuttons: 'rgb(var(--herobuttons) / <alpha-value>)',
				herobuttonshover: 'rgb(var(--herobuttons-hover) / <alpha-value>)',
				buttons: 'rgb(var(--buttons) / <alpha-value>)'
			},
			fontFamily: {
				notosans: ['Noto Sans', 'sans-serif']
			}
		}
	},
	plugins: [
		require('@tailwindcss/typography'),
		'prettier-plugin-tailwindcss'
	]
};
