import { apiSlice } from './apiSlice';

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => '/users',
    }),
    getUserDetails: builder.query({
      query: ({ user_id, admin_user_id }) => `/user?admin_user_id=${admin_user_id}&user_id=${user_id}`,
    }),
    getDependentDetails: builder.query({
      query: ({ dependent_id, user_id, admin_user_id }) => `/dependent?dependent_id=${dependent_id}&user_id=${user_id}&admin_user_id=${admin_user_id}`,
    }),
    addUser: builder.mutation({
      query: (user) => ({
        url: '/users',
        method: 'POST',
        body: user,
      }),
    }),
    updateUser: builder.mutation({
      query: ({ id, ...user }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: user,
      }),
    }),
    deleteUser: builder.mutation({
      query: (body) => ({
        url: '/user-delete',
        method: 'DELETE',
        body,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserDetailsQuery,
  useGetDependentDetailsQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useLoginMutation,
} = userApi;
