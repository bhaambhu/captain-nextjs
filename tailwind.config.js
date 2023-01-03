/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./config/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        text: 'text 2s linear infinite',
      },
      keyframes: {
        text: {
          '0%': {
            'background-size': '1000% 1000%',
            'background-position': 'right center',
          },
          '100%': {
            'background-size': '1000% 1000%',
            'background-position': 'left center',
          },
        },
      },
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
            dark: "#1e00c5",
            normal: "#6b38fb",
            light: "#a462ff",
            lightest: "#E3D1FC"
          },

          error: "#BE0000",
          transparent: "#fff0",

          green: {
            strong: "#57BF68",
            type2: "#33691e",
            type3: "#1b5e20",
          },
        },
        san: {
          primary: {
            DEFAULT: "#6750a4",
            container: "#EADCFE"
          },
          secondary: {
            DEFAULT: "#625B70",
            container: "#E7DDF8"
          },
          tertiary: {
            DEFAULT: "#7D5260",
            container: "#FFD7E4"
          },
          error: {
            DEFAULT: "#B3251E",
            container: "#F9DEDC"
          },
          unsaved: {
            DEFAULT: "#006973",
            container: "#92f1ff"
          },
          removeitem: {
            DEFAULT: "#006b55",
            container: "#7ef8d4"
          },
          additem: {
            DEFAULT: "#7b5900",
            container: "#ffdea4"
          },
          delete: {
            DEFAULT: "#ae302c",
            container: "#ffdad6"
          },
          background: {
            DEFAULT: "#EAEAEA"
          },
          surface: {
            DEFAULT: "#FEFBFE",
            variant: "#E7E0EC"
          },
          positive: {
            DEFAULT: "#0f6e0f",
            container: "#9cf88a",
          },
          outline: "#79747E",
          on: {
            primary: {
              DEFAULT: "#ffffff",
              container: "#21005E"
            },
            secondary: {
              DEFAULT: "#FFFFFF",
              container: "#1E192B"
            },
            tertiary: {
              DEFAULT: "#FFFFFF",
              container: "#370B1E"
            },
            error: {
              DEFAULT: "#FFFFFF",
              container: "#370B1E"
            },
            unsaved: {
              DEFAULT: "#ffffff",
              container: "#001f23"
            },
            removeitem: {
              DEFAULT: "#ffffff",
              container: "#002018"
            },
            additem: {
              DEFAULT: "#ffffff",
              container: "#261900"
            },
            delete: {
              DEFAULT: "#ffffff",
              container: "#410003"
            },
            background: {
              DEFAULT: "#1C1B1F"
            },
            surface: {
              DEFAULT: "#1C1B1F",
              variant: "#48454D",
            },
            positive: {
              DEFAULT: "#ffffff",
              container: "#002201",
            },
          },
          dark: {
            primary: {
              DEFAULT: "#cfbcff",
              container: "#4f378a"
            },
            secondary: {
              DEFAULT: "#cbc2db",
              container: "#4a4458"
            },
            tertiary: {
              DEFAULT: "#efb8c8",
              container: "#633b48"
            },
            error: {
              DEFAULT: "#ffb4ab",
              container: "#93000a"
            },
            unsaved: {
              DEFAULT: "#4ed8ea",
              container: "#004f57"
            },
            removeitem: {
              DEFAULT: "#60dbb8",
              container: "#005140"
            },
            additem: {
              DEFAULT: "#f5be48",
              container: "#5d4200"
            },
            delete: {
              DEFAULT: "#ffb4ac",
              container: "#8c1617"
            },
            background: {
              DEFAULT: "#222831",
              // DEFAULT: "#1c1b1e"
            },
            surface: {
              DEFAULT: "#393E46",
              variant: "#49454e"
            },
            positive: {
              DEFAULT: "#81db71",
              container: "#005304",
            },
            outline: "#948f99",
            on: {
              primary: {
                DEFAULT: "#381e72",
                container: "#e9ddff"
              },
              secondary: {
                DEFAULT: "#332d41",
                container: "#e8def8"
              },
              tertiary: {
                DEFAULT: "#4a2532",
                container: "#ffd9e3"
              },
              error: {
                DEFAULT: "#690005",
                container: "#ffdad6"
              },
              unsaved: {
                DEFAULT: "#00363c",
                container: "#92f1ff"
              },
              removeitem: {
                DEFAULT: "#00382b",
                container: "#7ef8d4"
              },
              additem: {
                DEFAULT: "#412d00",
                container: "#ffdea4"
              },
              delete: {
                DEFAULT: "#690007",
                container: "#ffdad6"
              },
              background: {
                DEFAULT: "#e6e1e6"
              },
              surface: {
                DEFAULT: "#e6e1e6",
                variant: "#cac4cf",
              },
              positive: {
                DEFAULT: "#003a02",
                container: "#9cf88a",
              },
            }
          }
        }
      }
    },
  },
  plugins: [],
}