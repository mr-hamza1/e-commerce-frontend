import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const userAPI = createApi({
    reducerPath: "userAPI",
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/user/` }),
    tagTypes: ["users"],
      endpoints: (builder) => ({
        signUp: builder.mutation({
            query: (user) => {
                return {
                    url: "new",
                    method: "POST",
                    body: user,
                    credentials: "include",

                };
            },
         invalidateTags: ["users"],           

        }),
        login: builder.mutation({
            query: (user) => {
                return {
                    url: "login",
                    method: "POST",
                    body: user,
                    credentials: "include",
                };
            },
          invalidateTags: ["users"],           

        }),
        setProfile: builder.mutation({
            query: (userData) => {
                return {
                    url: "profile",
                    method: "POST",
                    body: userData,
                    credentials: "include",
                };
            },
          invalidateTags: ["users"],           

        }),
        deleteUser: builder.mutation({
            query: ({customerId, id}) => {
                return {
                    url: `${customerId}?id=${id}`,
                    method: "DELETE",
                    credentials: "include",
                };
            },
         invalidateTags: ["users"],           

        }),
        allUsers: builder.query({
            query: (id) => {
                return {
                    url: `all?id=${id}`,
                    credentials: "include",
                };
            },
        }), 
        providesTags: ["users"],           

             
    }),
});

export const { useLoginMutation, useSignUpMutation, useAllUsersQuery, useDeleteUserMutation, useSetProfileMutation } = userAPI;
