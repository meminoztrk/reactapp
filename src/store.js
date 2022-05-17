import { configureStore } from '@reduxjs/toolkit'
import categoryReducer from "./stores/category"
import navigationReducer from './stores/admin/navigation'

export default configureStore({
    reducer: {
        category:categoryReducer,
        navigation:navigationReducer
    },
    middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),

})