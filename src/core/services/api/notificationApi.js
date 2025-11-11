import { apiSliceWithAuth } from './apiSlice';

export const notificationApi = apiSliceWithAuth.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => '/admin/notifications',
    }),
    addNotification: builder.mutation({
      query: (notification) => ({
        url: '/admin/notifications',
        method: 'POST',
        body: notification,
      }),
    }),
    updateNotification: builder.mutation({
      query: ({ id, ...notification }) => ({
        url: `/admin/notifications/${id}`,
        method: 'PUT',
        body: notification,
      }),
    }),
    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `/admin/notifications/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useAddNotificationMutation,
  useUpdateNotificationMutation,
  useDeleteNotificationMutation,
} = notificationApi;