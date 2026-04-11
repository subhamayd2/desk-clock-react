/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,jsx}"],
	theme: {
		extend: {
			fontFamily: {
				display: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
			},
			boxShadow: {
				glow: "0 0 50px rgb(32 224 186 / 0.18)",
			},
		},
	},
	plugins: [],
};
