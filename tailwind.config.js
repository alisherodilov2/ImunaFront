const plugin = require("tailwindcss/plugin");
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  variants: {
    textColor: ({ after }) => after(["invalid"]),
  },
  plugins: [
    plugin(({ addVariant, e }) => {
      addVariant("label-checked", ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          const eClassName = e(`label-checked${separator}${className}`); // escape class
          const yourSelector = 'input[type="radio"]'; // your input selector. Could be any
          return `${yourSelector}:checked ~ .${eClassName}`; // ~ - CSS selector for siblings
        });
      });
    }),
    plugin(function ({ addVariant, e }) {
      addVariant("invalid", ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`invalid${separator}${className}`)}:invalid`;
        });
      });
    }),
  ],
};
