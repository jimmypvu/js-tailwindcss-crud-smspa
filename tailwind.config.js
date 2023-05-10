/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./src/css/*.css", "./src/js/*.js"],
  theme: {
    screens: {
      // 'sm': '475px',
      // => @media (min-width: 475px) { ... }
      //min-width 475px: "if device width is 475 or larger, do this {}"
      //max-width 475px: "if device width is 475 or smaller, do this {}"

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1028px',
      // => @media (min-width: 1028px) { ... }
    },
    //don't need to change tailwind config if importing fonts into css
    // fontFamily:{
    //   display: ['Darumadrop One', 'cursive'],
    //   display: ['Inter', 'sans-serif']
    // },
    extend: {},
  },
  plugins: [
    require('tailwindcss'),
    require('postcss'),
    require('autoprefixer')
  ],
}

