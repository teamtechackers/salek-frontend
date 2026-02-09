import { apiSliceWithAuth } from './apiSlice';

export const publicLocationApi = apiSliceWithAuth.injectEndpoints({
    endpoints: (builder) => ({
        getPublicCountries: builder.query({
            query: () => '/locations/countries',
        }),
        getPublicStates: builder.query({
            query: (countryId) => `/locations/states/${countryId}`,
        }),
        getPublicCities: builder.query({
            query: (stateId) => `/locations/cities/${stateId}`,
        }),
    }),
});

export const {
    useGetPublicCountriesQuery,
    useGetPublicStatesQuery,
    useGetPublicCitiesQuery,
} = publicLocationApi;
