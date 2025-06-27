import type { Config } from "tailwindcss";
const colors = require("tailwindcss/colors");

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "src/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },
    screens: {
      xs: "450px",
      // => @media (min-width: 450px) { ... }

      sm: "575px",
      // => @media (min-width: 576px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "992px",
      // => @media (min-width: 992px) { ... }

      xl: "1200px",
      // => @media (min-width: 1200px) { ... }

      "2xl": "1400px",
      // => @media (min-width: 1400px) { ... }
    },
    extend: {
      height: {
        "screen-1/2": "50vh",
        "screen-1/3": "33.333333vh",
        "screen-2/3": "66.666667vh",
        "screen-1/4": "25vh",
        "screen-3/4": "75vh",
        "8px": "8px",
        "10px": "10px",
        "20px": "20px",
        "25px": "25px",
        "30px": "30px",
        "45px": "45px",
        "48px": "48px",
        "50px": "50px",
        "100px": "100px",
        "130px": "130px",
        "350px": "350px",
        "500px": "500px",
        "525px": "525px",
      },
      width: {
        "1px": "1px",
        "8px": "8px",
        "10px": "10px",
        "20px": "20px",
        "30px": "30px",
        "45px": "45px",
        "50px": "50px",
        "60px": "60px",
        "70px": "70px",
        "80px": "80px",
        "100px": "100px",
        "120px": "120px",
        "130px": "130px",
        "200px": "200px",
        "210px": "210px",
        "220px": "220px",
        "250px": "250px",
        "350px": "350px",
        "400px": "400px",
        "500px": "500px",
        "540px": "540px",
        "800px": "800px",
        "1000px": "1000px",
        "1200px": "1200px",
      },
      fontSize: {
        "8px": "8px",
        "12px": "12px",
        "14px": "14px",
        "16px": "16px",
        "18px": "18px",
        "22px": "22px",
        "24px": "24px",
        "26px": "26px",
        "32px": "32px",
        "38px": "38px",
        "44px": "44px",
        "54px": "54px",
        "64px": "64px",
      },
      minHeight: {
        "525px": "525px",
      },
      colors: {
        transparent: "transparent",

        brandcolor: "#7b92e0",
        brandhover: "#cedef7",
        brandbgcolor: "#f0f6fd",
        brandborder: "#cbd5e1",

        branddark: "#262f40",
        brandgray: "#344057",
        branddarkborder: "#475569",
        // brandcolor: "#11235A",
        // brandbgcolor: "#FAFAFA",
        current: "currentColor",
        white: "#FFFFFF",
        black: "#121723",
        dark: "#1D2430",

        primary: "#4A6CF7",
        yellow: "#FBB040",
        "bg-color-dark": "#171C28",
        "body-color": {
          DEFAULT: "#788293",
          dark: "#959CB1",
        },
        stroke: {
          stroke: "#E3E8EF",
          dark: "#353943",
        },
        gray: {
          ...colors.gray,
          dark: "#1E232E",
          light: "#F0F2F9",
        },
      },

      boxShadow: {
        signUp: "0px 5px 10px rgba(4, 10, 34, 0.2)",
        one: "0px 2px 3px rgba(7, 7, 77, 0.05)",
        two: "0px 5px 10px rgba(6, 8, 15, 0.1)",
        three: "0px 5px 15px rgba(6, 8, 15, 0.05)",
        sticky: "inset 0 -1px 0 0 rgba(0, 0, 0, 0.1)",
        "sticky-dark": "inset 0 -1px 0 0 rgba(255, 255, 255, 0.1)",
        "feature-2": "0px 10px 40px rgba(48, 86, 211, 0.12)",
        submit: "0px 5px 20px rgba(4, 10, 34, 0.1)",
        "submit-dark": "0px 5px 20px rgba(4, 10, 34, 0.1)",
        btn: "0px 1px 2px rgba(4, 10, 34, 0.15)",
        "btn-hover": "0px 1px 2px rgba(0, 0, 0, 0.15)",
        "btn-light": "0px 1px 2px rgba(0, 0, 0, 0.1)",
      },
      dropShadow: {
        three: "0px 5px 15px rgba(6, 8, 15, 0.05)",
      },
    },
  },
  plugins: [],
};
export default config;
