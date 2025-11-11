import { apiSliceWithAuth } from './apiSlice';

export const dashboardApi = apiSliceWithAuth.injectEndpoints({
  endpoints: (builder) => ({
    getDashboard: builder.query({
      query: (adminId) => `/admin/dashboard?user_id=${adminId}`, // Modified to accept userId as a query parameter
    }),
 
  }),
});

export const {
  useGetDashboardQuery,
} = dashboardApi;