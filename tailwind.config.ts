import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        clay:    "#C67B52",
        "clay-dk": "#A05E3A",
        cream:   "#FDF6EC",
        sand:    "#F0E0C8",
        brown:   "#5C3A1E",
        muted:   "#8B6A52",
      },
    },
  },
  plugins: [],
};

export default config;
