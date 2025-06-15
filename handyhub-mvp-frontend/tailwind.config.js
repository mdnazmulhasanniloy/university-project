/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        "3xl": "1700px",
      },
      colors: {
        "primary-black": "#232323",
        "primary-white": "#f8fafc",
        "primary-blue": "#0049ad",
        "primary-orange": "#fa8600",
        "foundation-primary-white-dark": "#BABCBD",
        "foundation-primary-white-dark:active": "#707071",
        "foundation-primary-white-light": "#FEFFFF",

        danger: "#ca0b00",
        muted: "#727272",
        "dark-gray": "#818181",
        "map-marker": "#ed4040",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        "dm-sans": ["var(--font-dm-sans)"],
        "cabinet-grotest": ["var(--font-cabinet-grotesk)"],
      },
      transitionTimingFunction: {
        "in-out-circ": "cubic-bezier(0.85, 0, 0.15, 1)",
      },
      keyframes: {
        "caret-blink": {
          "0%,70%,100%": {
            opacity: "1",
          },
          "20%,50%": {
            opacity: "0",
          },
        },
        "border-beam": {
          "100%": {
            "offset-distance": "100%",
          },
        },
      },
      animation: {
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "border-beam": "border-beam calc(var(--duration)*1s) infinite linear",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("tailwind-scrollbar")],
};
