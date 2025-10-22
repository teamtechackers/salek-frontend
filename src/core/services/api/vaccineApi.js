import { apiSlice } from './apiSlice';

export const vaccineApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVaccines: builder.query({
      query: (params) => ({
        url: '/vaccines',
        params,
      }),
    }),
    addVaccine: builder.mutation({
      query: (vaccine) => ({
        url: '/vaccine-add',
        method: 'POST',
        body: vaccine,
      }),
    }),
    updateVaccine: builder.mutation({
      query: (body) => ({
        url: '/vaccine-edit',
        method: 'PUT',
        body,
      }),
    }),
    deleteVaccine: builder.mutation({
      query: ({ vaccine_id, admin_user_id }) => ({
        url: '/vaccine-delete',
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vaccine_id, admin_user_id }),
      }),
    }),
  }),
});

export const {
  useGetVaccinesQuery,
  useAddVaccineMutation,
  useUpdateVaccineMutation,
  useDeleteVaccineMutation,
} = vaccineApi;
