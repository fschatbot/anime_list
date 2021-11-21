module.exports = {
	mode: "jit",
	purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {},
		fontFamily: {
			sans: ["'Brutal Type'", "'Noto Sans JP'", "sans-serif"],
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
