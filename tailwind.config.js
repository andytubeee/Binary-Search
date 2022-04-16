module.exports = {
  mode: 'jit',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './node_modules/flowbite/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        bsBlue: '#006ba6',
        bsPink1: '#EB56D3',
        bsPink2: '#EE8DAB',
        bsBeige1: '#F4CAC4',
        bsBeige2: '#F3ECD0',
      },
    },
    fontFamily: {
      sans: ['Rubik', 'sans-serif'],
      heading: ['Rubik', 'sans-serif'],
    },
  },
  plugins: [require('flowbite/plugin')],
};
