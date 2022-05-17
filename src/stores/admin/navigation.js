import { createSlice } from '@reduxjs/toolkit'


const navigation = createSlice({
  name: 'navigation',
  initialState: {
    navigator: "",
  },
  reducers: {
    setNavigation: (state, action) => {
      state.navigator = action.payload;
    },
  },
})

export const { setNavigation } = navigation.actions

export default navigation.reducer