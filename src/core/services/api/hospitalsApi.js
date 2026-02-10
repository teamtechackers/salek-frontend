import { apiSliceWithAuth } from './apiSlice';

export const hospitalsApi = apiSliceWithAuth.injectEndpoints({
    endpoints: (builder) => ({
        getHospitals: builder.query({
            query: (params = {}) => {
                const queryParams = new URLSearchParams();
                Object.keys(params).forEach(key => {
                    if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
                        queryParams.append(key, params[key]);
                    }
                });
                const queryString = queryParams.toString();
                return `/hospitals/list${queryString ? `?${queryString}` : ''}`;
            },
            providesTags: ['Hospitals'],
            transformResponse: (response) => {
                const rawData = Array.isArray(response) ? response : (response?.data || []);
                const mappedData = rawData.map(item => ({
                    ...item,
                    id: item.hospital_id,           // Map hospital_id to id
                    country: item.country_name,     // Map country_name to country
                    state: item.state_name,         // Map state_name to state
                    city: item.city_name,           // Map city_name to city
                    phone_number: item.phone,       // Map phone to phone_number
                    is_active: item.is_active === 1 || item.is_active === true, // boolean
                    image: item.image ? (item.image.startsWith('http') ? item.image : `${import.meta.env.VITE_API_URL.replace('/api', '')}${item.image}`) : null
                }));
                return {
                    data: mappedData,
                    total: response.count || mappedData.length
                };
            },
        }),
        addHospital: builder.mutation({
            query: (formData) => ({
                url: '/hospitals/add',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['Hospitals'],
        }),
        updateHospital: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/hospitals/update/${id}`,
                method: 'PATCH',
                body: formData,
            }),
            invalidatesTags: ['Hospitals'],
        }),
        deleteHospital: builder.mutation({
            query: (id) => ({
                url: `/hospitals/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Hospitals'],
        }),
        toggleHospitalStatus: builder.mutation({
            query: ({ id }) => ({
                url: '/hospitals/toggle-status',
                method: 'PATCH',
                body: { hospital_id: id },
            }),
            invalidatesTags: ['Hospitals'],
        }),
    }),
});

export const {
    useGetHospitalsQuery,
    useAddHospitalMutation,
    useUpdateHospitalMutation,
    useDeleteHospitalMutation,
    useToggleHospitalStatusMutation,
} = hospitalsApi;
