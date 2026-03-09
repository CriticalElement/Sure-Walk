import {
  UTBurntOrange,
  UTBluebonnet,
  UTTurquoise,
  UTTangerine,
} from "./src/utils/colors";

/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "ut-burntorange": UTBurntOrange,
        "ut-bluebonnet": UTBluebonnet,
        "ut-turquoise": UTTurquoise,
        "ut-tangerine": UTTangerine,
      },
      fontFamily: {
        thin: ["Geist_100Thin"],
        extralight: ["Geist_200ExtraLight"],
        light: ["Geist_300Light"],
        regular: ["Geist_400Regular"],
        medium: ["Geist_500Medium"],
        semibold: ["Geist_600SemiBold"],
        bold: ["Geist_700Bold"],
        extrabold: ["Geist_800ExtraBold"],
        black: ["Geist_900Black"],
      },
    },
  },
  plugins: [],
};
