/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      backgroundColor: {
        'check-empty': '#F6F6F6',
        'green-primary': '#5DB075',
        'green-secondary': '#4B9460',
        'white-6': "#F6F6F6",
        'white-8': "#F8F8F8",
        'gray-8': '#E8E8E8',
        'background': '#F9F9F9',
      },
      borderColor: {
        'gray-8': '#E8E8E8',
        'green-secondary': '#4B9460',
      },
      colors: {
        'green-primary': '#5DB075',
        'green-secondary': '#4B9460',
        'white-6': "#F6F6F6",
        'white-8': "#F8F8F8",
        'gray-01': '#F6F6F6',
        'gray-02': '#E8E8E8',
        'gray-03': '#BDBDBD',
        'primary': '#5DB075',
        'disabled': '#979797',
      },
      placeholderColor: {
        'primary': "#BDBDBD"
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif']
      },
      boxShadow: {
        'default': '0px 1px 4px 0px rgba(0, 0, 0, 0.25)',
        'inset': '0px 1px 4px 0px rgba(0, 0, 0, 0.25) inset',
      },
    },
  },
  plugins: [],
};