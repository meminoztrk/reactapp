import { configureStore } from '@reduxjs/toolkit'
import categoryReducer from "./stores/category"
import navigationReducer from './stores/admin/navigation'
import userReducer from './stores/user'

export default configureStore({
    reducer: {
        category:categoryReducer,
        navigation:navigationReducer,
        user:userReducer,
    },
    middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),

})