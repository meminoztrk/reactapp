import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios';

const category = createSlice({
  name: 'category',
  initialState: {
    mainCategories: [],
    subCategories:[],
    visibility:{display:"hidden",actState:"-1"}
  },
  reducers: {
    getMainCategories: (state, action) => {
      state.mainCategories = action.payload;
    },
    getSubCategories: (state, action) => {
      state.mainCategories = action.payload;
    },
    setMenuVisibility: (state, action) => {
      state.visibility = action.payload;
    },
  },
})

export const { getMainCategories,getSubCategories,setMenuVisibility } = category.actions

export default category.reducer

export const getMainCategory = () => async dispatch => {
  await axios
    .get("https://localhost:7168/api/Categories/GetCategoryWithSub")
    .then(response => dispatch({ type: getMainCategories.type, payload: response.data.data }))
    .catch((err) => {
      console.log("Err: ", err);
    });
}

export const getSubCategory = () => async dispatch => {
  await axios
    .get("https://localhost:7168/api/Categories/GetAllMainCategory")
    .then(response => dispatch({ type: getMainCategories.type, payload: response.data.data }))
    .catch((err) => {
      console.log("Err: ", err);
    });
}

// export const selectMainCategory = createSelector((state)=>state[category.name].mainCategories,(mainCategories)=>mainCategories)