import { apiSlice } from './apiSlice';

export const vaccineApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVaccines: builder.query({
      query: (params) => ({
        url: '/admin/vaccines',
        params,
      }),
    }),
    addVaccine: builder.mutation({
      query: (vaccine) => ({
        url: '/admin/vaccine-add',
        method: 'POST',
        body: vaccine,
      }),
    }),
    updateVaccine: builder.mutation({
      query: (body) => ({
        url: '/admin/vaccine-edit',
        method: 'PUT',
        body,
      }),
    }),
    deleteVaccine: builder.mutation({
      query: ({ vaccine_id, admin_user_id }) => ({
        url: '/admin/vaccine-delete',
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vaccine_id, admin_user_id }),
      }),
    }),
    getReminders: builder.query({
      query: ({ user_id, user_vaccine_id }) => `/vaccines/get-reminders?user_id=${user_id}&user_vaccine_id=${user_vaccine_id}`,
    }),
    getRemindersByUserId: builder.query({
      query: (userId) => `/vaccines/get-reminders-by-user/${userId}`,
    }),
  }),
});

export const {
  useGetVaccinesQuery,
  useAddVaccineMutation,
  useUpdateVaccineMutation,
  useDeleteVaccineMutation,
  useGetRemindersQuery,
  useGetRemindersByUserIdQuery,
} = vaccineApi;
