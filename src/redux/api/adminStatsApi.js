import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const adminApi = createApi({
    reducerPath: "adminApi",
     baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/dashboard/` }),
     tagTypes : ["admin"],
      endpoints: (builder) => ({

        dashboardStats: builder.query({
            query: (id) => {
                return {
                    url:   `stats?id=${id}`,
                    credentials: "include",
                };
            },
            providesTags: ["admin"]
        }),
        adminPieChart: builder.query({
            query: (id) => {
                return {
                    url:   `pie?id=${id}`,
                    credentials: "include",
                };
            },
            providesTags: ["admin"]
        }),
   
        adminBarChart: builder.query({
            query: (id) => {
                return {
                    url:   `bar?id=${id}`,
                    credentials: "include",
                };
            },
            providesTags: ["admin"]
        }),
   
        adminLineChart: builder.query({
            query: (id) => {
                return {
                    url:   `line?id=${id}`,
                    credentials: "include",
                };
            },
            providesTags: ["admin"]
        }),
   

    }),
});

export const { 
    useAdminBarChartQuery,
    useAdminLineChartQuery,
    useAdminPieChartQuery,
    useDashboardStatsQuery,
 } = adminApi;
