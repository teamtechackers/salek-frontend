import { apiSlice } from './apiSlice';

export const vaccineApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVaccines: builder.query({
      query: () => '/vaccines',
    }),
    addVaccine: builder.mutation({
      query: (vaccine) => ({
        url: '/vaccines',
        method: 'POST',
        body: vaccine,
      }),
    }),
    updateVaccine: builder.mutation({
      query: ({ id, ...vaccine }) => ({
        url: `/vaccines/${id}`,
        method: 'PUT',
        body: vaccine,
      }),
    }),
    deleteVaccine: builder.mutation({
      query: (id) => ({
        url: `/vaccines/${id}`,
        method: 'DELETE',
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
