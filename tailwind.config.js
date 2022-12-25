/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        logo: ["old_english"],
        h1_headline: ["mw_black"],
        h2_headline: ["libre_light"],
        h3_headline: ["mw_black"],
        h4_headline: ["libre_regular"],
        h5_headline: ["libre_regular"],
        h6_headline: ["mw_bold"],
        subtitle_1: ["libre_medium"],
        subtitle_2: ["mw_light"],
        body_1: ["mw_regular"],
        body_2: ["libre_regular"],
        button: ["libre_bold"],
        caption: ["mw_italic"],
        overline: ["libre_bold"],
      },
      colors: {
        cclrs: {
          // The variants of text colors
          dark: {
            strong: "#1f1e1f",
            medium: "#333",
            weak: "#555",
            disabled: "#999",
          },
          light: {
            strong: "#fff",
            medium: "#cccccc",
            weak: "#aaaaaa",
            disabled: "#666666",
          },
          bg: {
            // The default background when there's no content to display
            default: "#ededed",
            // The brightest background that has current focus
            surface: "#fff",
            // The background color of a disabled element to make it easily identifiable
            disabled: "#bbb",
            error: "coral",
            yellow: "#fce436",
            green: {
              lightest: "#EAF7EC",
              dark: "#aed581",
              light: "#c5e1a5"
            },
            red: "#ffa07a",
          },

          secondary: {
            normal: "#6b38fb",
            light: "#a462ff",
            dark: "#1e00c5",
          },

          error: "#BE0000",
          transparent: "#fff0",

          green: {
            strong: "#57BF68",
            type2: "#33691e",
            type3: "#1b5e20",
          },
        }
      }
    },
  },
  plugins: [],
}