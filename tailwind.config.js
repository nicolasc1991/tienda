/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      opacity: ['disabled'] // Esto deberías ponerlo en plugins si usás Tailwind 3+, pero casi no es necesario
    }
  },
  plugins: [require('@tailwindcss/forms')]
}
