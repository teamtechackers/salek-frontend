import { apiSliceWithAuth } from './apiSlice';

export const vaccineApi = apiSliceWithAuth.injectEndpoints({
  endpoints: (builder) => ({
    getVaccines: builder.query({
      query: ({ page = 0, limit = 8, search } = {}) => {
        const adminId = localStorage.getItem('adminId');
        let url = `/admin/vaccines?page=${page}&limit=${limit}`;
        if (adminId) {
          url += `&admin_user_id=${adminId}`;
        }
        // Add search parameter if provided
        if (search) {
          url += `&search=${encodeURIComponent(search)}`;
        }
        return url;
      },
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
    deleteDependentUserVaccine: builder.mutation({
      query: ({ admin_user_id, user_vaccine_id }) => ({
        url: '/admin/dependent-user-vaccine-delete',
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ admin_user_id, user_vaccine_id }),
      }),
    }),
    deleteUserVaccine: builder.mutation({
      query: ({ admin_user_id, user_vaccine_id }) => ({
        url: '/admin/user-vaccine-delete',
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ admin_user_id, user_vaccine_id }),
      }),
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
  useDeleteDependentUserVaccineMutation,
  useDeleteUserVaccineMutation,
} = vaccineApi;