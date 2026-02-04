import { apiSliceWithAuth } from './apiSlice';

export const locationApi = apiSliceWithAuth.injectEndpoints({
  endpoints: (builder) => ({
    getCountries: builder.query({
      query: ({ page = 0, search = '' } = {}) => `/admin/locations/countries?search=${search}&page=${page}`,
    }),
    getStates: builder.query({
      query: ({ countryId, page = 0, search = '' }) => `/admin/locations/states/${countryId}?search=${search}&page=${page}`,
    }),
    getCities: builder.query({
      query: ({ stateId, page = 0, search = '' }) => `/admin/locations/cities/${stateId}?search=${search}&page=${page}`,
    }),
    toggleStatus: builder.mutation({
      query: ({ type, id, is_active }) => ({
        url: '/admin/locations/toggle-status',
        method: 'PATCH',
        body: { type, id, is_active },
      }),
    }),
  }),
});

export const {
  useGetCountriesQuery,
  useGetStatesQuery,
  useGetCitiesQuery,
  useToggleStatusMutation,
} = locationApi;

