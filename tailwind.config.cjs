const plugin = require("tailwindcss/plugin");
const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  variants: {
    extend: {
      borderWidth: ["responsive", "last", "hover", "focus"],
    },
  },
  theme: {
    extend: {
      colors: {
        "half-black": "rgba(0, 0, 0, 0.5)",
        "faint-white": "rgba(255, 255, 255, 0.1)",
        "m-red": "#F61D5B",
        "light-text": "rgba(250, 245, 234, 0.5)",
      },
      backgroundImage: {
        "fade-to-blue":
          "linear-gradient(1.63deg, #0B215B 32.05%, rgba(11, 33, 91, 0) 84.78%)",
      },
      dropShadow: {
        "blue-glow": "0px 0px 32px rgba(11, 33, 91, 0.5)",
        "text-glow": "0px 0px 32px rgba(11, 33, 91, 0.9)",
      },

      fontFamily: {
        sans: ["Inter Variable", ...fontFamily.sans],
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      const newUtilities = {
        ".safe-top": {
          paddingTop: "env(safe-area-inset-top)",
        },
        ".safe-left": {
          paddingLeft: "env(safe-area-inset-left)",
        },
        ".safe-right": {
          paddingRight: "env(safe-area-inset-right)",
        },
        ".safe-bottom": {
          paddingBottom: "env(safe-area-inset-bottom)",
        },
        ".disable-scrollbars": {
          scrollbarWidth: "none",
          "-ms-overflow-style": "none",
          "&::-webkit-scrollbar": {
            width: "0px",
            background: "transparent",
            display: "none",
          },
          "& *::-webkit-scrollbar": {
            width: "0px",
            background: "transparent",
            display: "none",
          },
          "& *": {
            scrollbarWidth: "none",
            "-ms-overflow-style": "none",
          },
        },
      };

      addUtilities(newUtilities);
    }),
  ],
};
