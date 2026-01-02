import type { Config } from "tailwindcss"

const config: Config = {
  theme: {
    extend: {
      colors: {
        /* Base */
        black: "#000000",
        white: "#FFFFFF",

        /* Dark */
        dark: {
          1: "#59626A",
          2: "#3F4952",
          3: "#2F3944",
          4: "#1B2732",
          5: "#081624",
        },

        /* Light */
        light: {
          1: "#F7F9FB",
          2: "#E8ECF1",
          3: "#D8DEE6",
          4: "#C7CEDA",
          5: "#B1BDCF",
        },

        /* Red */
        red: {
          1: "#FBE9E8",
          2: "#F3B7B1",
          3: "#EA4C46",
          4: "#9E2A26",
          5: "#6B1A19",
        },

        /* Orange */
        orange: {
          1: "#FDF1E6",
          2: "#F8C89C",
          3: "#F9841F",
          4: "#B25516",
          5: "#7C3B0F",
        },

        /* Yellow */
        yellow: {
          1: "#FEFBE4",
          2: "#F8E98E",
          3: "#F7C600",
          4: "#B08F00",
          5: "#7D6600",
        },

        /* Lime */
        lime: {
          1: "#F5FAE6",
          2: "#D8EE95",
          3: "#AAD400",
          4: "#708E00",
          5: "#4E6400",
        },

        /* Green */
        green: {
          1: "#E6F7EA",
          2: "#A7DFB6",
          3: "#2EB67D",
          4: "#1B7451",
          5: "#105136",
        },

        /* Sky */
        sky: {
          1: "#E6F4FA",
          2: "#A8DAEB",
          3: "#2DB9EC",
          4: "#187B9B",
          5: "#105469",
        },

        /* Blue */
        blue: {
          1: "#E6F0FB",
          2: "#A5C5ED",
          3: "#357EDD",
          4: "#21579B",
          5: "#153A6B",
        },

        /* Purple */
        purple: {
          1: "#F0E6FB",
          2: "#C5A8E8",
          3: "#A042EC",
          4: "#672999",
          5: "#471E6B",
        },

        /* Pink */
        pink: {
          1: "#FBE6F2",
          2: "#F2ADD4",
          3: "#EC4CA0",
          4: "#9D2B69",
          5: "#6B1B49",
        },

        /* Gray */
        gray: {
          1: "#F3F4F5",
          2: "#E0E2E5",
          3: "#9CA2AE",
          4: "#606775",
          5: "#32363D",
        },
      },
    },
  },
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
}

export default config
