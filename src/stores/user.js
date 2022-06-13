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
            state.cart.find(x => x.id === action.payload.id) ?
                state.cart.find(x => x.id === action.payload.id).count++ :
                state.cart.push(action.payload);
        },
        increaseQuantity: (state, action) => {
            state.cart.find(x => x.id === action.payload) &&
                state.cart.find(x => x.id === action.payload).count++
        },
        decreaseQuantity: (state, action) => {
            state.cart.find(x => x.id === action.payload) &&
                state.cart.find(x => x.id === action.payload).count--

        },
        deleteToCart: (state, action) => {
            state.cart.find(x => x.id === action.payload) &&
                (state.cart = state.cart.filter(x => x.id !== action.payload))
        },
        setCartWithDB: (state, action) => {
            state.cart = action.payload
        },
        clearCart: (state) => {
            state.cart = []
        },

    },
})

export const { getUser, addToCart, deleteToCart, setCartWithDB, clearCart, increaseQuantity, decreaseQuantity } = user.actions

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
        .then(response => {
            dispatch({ type: getUser.type, payload: response.data })
            dispatch(GetCart(response.data.id));
        })
        .catch((err) => {
            dispatch({ type: getUser.type, payload: {} })
        });
}

export const GetCart = (userid) => async dispatch => {
    await axios
        .get(process.env.REACT_APP_API + "/Products/GetCart?id=" + userid, {
            headers: {
                'ApiKey': process.env.REACT_APP_API_KEY,
                'Content-Type': 'application/json'
            },
            withCredentials: true,
        })
        .then(response => {
            dispatch({ type: setCartWithDB.type, payload: response.data.data })
            sessionStorage.setItem("userCart", JSON.stringify(response.data.data));
        })
        .catch((err) => {
            dispatch({ type: setCartWithDB.type, payload: [] })
        });
}

