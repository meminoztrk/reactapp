import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
let sessionCart = JSON.parse(sessionStorage.getItem("userCart"));

const user = createSlice({
    name: 'category',
    initialState: {
        user: {},
        cart: sessionCart ? sessionCart : [],

    },
    reducers: {
        getUser: (state, action) => {
            state.user = action.payload;
        },
        addToCart: (state, action) => {
            state.cart.find(x=>x.id === action.payload.id) ? 
            state.cart.find(x=>x.id === action.payload.id).count++ : 
            state.cart.push(action.payload);
        }
    },
})

export const { getUser,addToCart } = user.actions

export default user.reducer

export const User = () => async dispatch => {
    await axios
        .get(process.env.REACT_APP_API + "/User/user", {
            headers: {
                'ApiKey': process.env.REACT_APP_API_KEY,
                'Content-Type': 'application/json'
            },
            withCredentials: true,
        })
        .then(response => dispatch({ type: getUser.type, payload: response.data }))
        .catch((err) => {
            dispatch({ type: getUser.type, payload: {} })
        });
}

