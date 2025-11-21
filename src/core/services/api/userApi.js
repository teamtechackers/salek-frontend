import { apiSliceWithAuth } from './apiSlice';

export const userApi = apiSliceWithAuth.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: ({ page = 0, limit = 8, search, date, searchTrigger } = {}) => {
        let url = `/admin/users?page=${page}&limit=${limit}`;
        
        // Add search parameter (name)
        if (search) {
          url += `&search=${encodeURIComponent(search)}`;
        }
        
        // Add date parameter (DOB)
        if (date) {
          url += `&date=${encodeURIComponent(date)}`;
        }
        
        return url;
      },
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
    deleteDependent: builder.mutation({
      query: ({ admin_user_id, user_id, dependent_id }) => ({
        url: `/admin/dependent-delete?admin_user_id=${admin_user_id}&user_id=${user_id}&dependent_id=${dependent_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { user_id }) => [
        { type: 'User', id: user_id }, // Invalidate user details to refresh dependent list
      ],
    }),
    updateDependent: builder.mutation({
      query: ({ admin_user_id, user_id, dependent_id, ...dependentData }) => ({
        url: `/admin/dependent-edit?admin_user_id=${admin_user_id}&user_id=${user_id}&dependent_id=${dependent_id}`,
        method: 'PUT',
        body: dependentData, // Send only the rest of the data in the body
      }),
      invalidatesTags: (result, error, { user_id }) => [
        { type: 'User', id: user_id }, // Invalidate user details to refresh dependent list
      ],
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
  useDeleteDependentMutation,
  useUpdateDependentMutation,
  useLoginMutation,
} = userApi;