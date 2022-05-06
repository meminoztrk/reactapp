import { configureStore } from '@reduxjs/toolkit'
import categoryReducer from "./stores/category"

export default configureStore({
    reducer: {
        category:categoryReducer
    },
    middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),

})