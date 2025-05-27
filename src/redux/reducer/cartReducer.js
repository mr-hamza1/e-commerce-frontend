import {createSlice} from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

const initialState = {
    loading: false,
    cartItems: [],
    subTotal: 0,
    tax: 0,
    shippingCharges: 0,
    discount: 0,
    total: 0,
    coupon: undefined,
    shippingInfo: {
        address: "",
        city: "",
        state: "",
        country: "",
        pinCode: "",
    },
}

export const cartReducer = createSlice({
    name: "cartReducer",
    initialState,
    reducers: {
        addToCart: (state, action)=>{
            state.loading = true;

            const index = state.cartItems.findIndex((i)=> i._id === action.payload._id);

            if(index !== -1) state.cartItems[index] = action.payload
            else {state.cartItems.push(action.payload);   toast.success("Added to cart successfully");
            }
            state.loading = false;
        },
        removeCartItem: (state, action)=>{
            state.loading = true;
            state.cartItems = state.cartItems.filter((i) => i._id !== action.payload);
            state.loading = false;
        },
        calculatePrice: (state) => {
            const subtotal = state.cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

            state.subTotal = subtotal;
            state.shippingCharges = state.subTotal < 1000 ? 200 : state.subTotal > 5000 ? (state.subTotal / 100) *3 : 0;
            state.tax = Math.round(state.subTotal * 0.018);
            state.total =  state.subTotal + state.shippingCharges + state.tax - state.discount;
        },
         saveCoupon: (state, action) => {
        state.coupon = action.payload;
        },
        discountApplied: (state, action)=>{
            state.discount = action.payload
        },
         saveShippingInfo: (state, action) => {
             state.shippingInfo = action.payload;
    },
    resetCart: () => initialState,
    },
})

export const { addToCart, removeCartItem, calculatePrice, discountApplied, saveShippingInfo, resetCart, saveCoupon} = cartReducer.actions; 