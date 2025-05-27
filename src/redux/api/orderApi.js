import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const orderAPI = createApi({
    reducerPath: "orderAPI",
     baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/order/` }),
     tagTypes : ["orders"],
      endpoints: (builder) => ({
        newOrder: builder.mutation({
            query: (order) => {
                return {
                    url: "new",
                    method: "POST",
                    body: order,
                    credentials: "include",
                };
            },
            invalidatesTags: ["orders"]
        }),
        updateOrder: builder.mutation({
            query: ({userId, orderId}) => {
                return {
                    url: `${orderId}?id=${userId}`,
                    method: "PUT",
                    credentials: "include",
                };
            },
            invalidatesTags: ["orders"]
        }),
        deleteOrder: builder.mutation({
            query: ({userId, orderId}) => {
                return {
                    url: `${orderId}?id=${userId}`,
                    method: "DELETE",
                    credentials: "include",
                };
            },
            invalidatesTags: ["orders"]
        }),
        myOrder: builder.query({
            query: (id) => {
                return {
                    url:   `my?id=${id}`,
                    credentials: "include",
                };
            },
            providesTags: ["orders"]
        }),
        allOrders: builder.query({
            query: (id) => {
                return {
                    url:   `all?id=${id}`,
                    credentials: "include",
                };
            },
            providesTags: ["orders"]
        }),
        orderDetails: builder.query({
            query: (id) => {
                return {
                    url:   `${id}`,
                    credentials: "include",
                };
            },
            providesTags: ["orders"]
        }),

    }),
});

export const { 
    useNewOrderMutation, 
    useMyOrderQuery, 
    useUpdateOrderMutation,
    useDeleteOrderMutation,
    useAllOrdersQuery,
    useOrderDetailsQuery,
 } = orderAPI;
