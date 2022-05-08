module.exports = {
  important: true,
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      backgroundColor: theme => ({
        'brand-color': '#F8F8F8',
        'orange-color': '#F14800'
      }),
      fontFamily: {
        poppins: ['Poppins']
      }
    },
  },
  plugins: [],
  
}
