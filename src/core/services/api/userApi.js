import { apiSlice } from './apiSlice';

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => '/admin/users',
    }),
    getUserDetails: builder.query({
      query: ({ user_id, admin_user_id }) => `/admin/user?admin_user_id=${admin_user_id}&user_id=${user_id}`,
    }),
    getDependentDetails: builder.query({
      query: ({ dependent_id, user_id, admin_user_id }) => `/admin/dependent?admin_user_id=${admin_user_id}&user_id=${user_id}&dependent_id=${dependent_id}`,
    }),
    addUser: builder.mutation({
      query: (user) => ({
        url: '/admin/users',
        method: 'POST',
        body: user,
      }),
      invalidatesTags: ['User'],
    }),
    updateUser: builder.mutation({
      query: (userData) => ({
        url: '/admin/user-edit',
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: (result, error, { user_id }) => [
        { type: 'User', id: user_id },
        { type: 'User', id: 'LIST' },
      ],
    }),
    deleteUser: builder.mutation({
      query: (body) => ({
        url: '/admin/user-delete',
        method: 'DELETE',
        body,
      }),
      invalidatesTags: ['User'],
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: '/admin/login',
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
