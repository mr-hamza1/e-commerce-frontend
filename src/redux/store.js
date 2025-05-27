import { configureStore } from '@reduxjs/toolkit';
import { userAPI } from './api/userApi';
import { userReducer } from './reducer/userReducer';
import { productAPI } from './api/productApi';
import { cartReducer } from './reducer/cartReducer'; // ✅ fixed reducer import
import { orderAPI } from './api/orderApi';
import { adminApi } from './api/adminStatsApi';
import { loadState, saveState } from '../utils/localstorage'; // 👈 for persistence

// Load the cart state from localStorage
const preloadedState = {
  cartReducer: loadState()
};

export const store = configureStore({
  reducer: {
    [userAPI.reducerPath]: userAPI.reducer,
    [userReducer.name]: userReducer.reducer,
    [productAPI.reducerPath]: productAPI.reducer,
    [orderAPI.reducerPath]: orderAPI.reducer,
    [adminApi.reducerPath]: adminApi.reducer,

    cartReducer: cartReducer.reducer,  // 👈 use the reducer function here
 // ✅ use as a normal reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userAPI.middleware,
      productAPI.middleware,
      orderAPI.middleware,
      adminApi.middleware
    ),
  preloadedState,
});

// Save cart state to localStorage on every change
// inside store.js or wherever you subscribe to store updates

store.subscribe(() => {
  const state = store.getState();

  // Check if user is logged in (adjust path as per your store)
  const isLoggedIn = Boolean(state.userReducer?.user); // example

  if (isLoggedIn) {
    // Save cart only if logged in
    saveState(state.cartReducer);
  } else {
    // Optional: remove cart from localStorage if user logged out
    localStorage.removeItem('cartState');
  }
});
