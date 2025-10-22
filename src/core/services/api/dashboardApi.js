import { apiSlice } from './apiSlice';

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboard: builder.query({
      query: (adminId) => `/dashboard?user_id=${adminId}`, // Modified to accept userId as a query parameter
    }),
 
  }),
});

export const {
  useGetDashboardQuery,
} = dashboardApi;
