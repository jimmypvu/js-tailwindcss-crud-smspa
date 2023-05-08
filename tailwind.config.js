/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/*.html", "./src/css/*.css", "./src/js/*.js"],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwindcss'),
    require('postcss'),
    require('autoprefixer')
  ],
}

