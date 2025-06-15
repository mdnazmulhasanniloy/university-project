/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",

        "primary-black": "#232323",
        "primary-white": "#f8fafc",
        "primary-blue": "#0049ad",
        "primary-orange": "#fa8600",
        "primary-orange-light": "#fef3e5",
        "foundation-primary-white-dark": "#BABCBD",
        "foundation-primary-white-dark:active": "#707071",
        "foundation-primary-white-light": "#FEFFFF",

        danger: "#ca0b00",
        muted: "#727272",
        "dark-gray": "#818181",
        "map-marker": "#ed4040",
      },

      fontFamily: {
        generalSans: ["var(--font-uncut-sans)"],
        dmSans: ["var(--font-dm-sans)"],
      },
    },
  },
  plugins: [],
};
