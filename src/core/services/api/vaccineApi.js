import { apiSliceWithAuth } from './apiSlice';

export const vaccineApi = apiSliceWithAuth.injectEndpoints({
  endpoints: (builder) => ({
    getVaccines: builder.query({
      query: ({ page = 0, limit = 8, search, category, searchTrigger } = {}) => {
        console.log('Vaccine API called with parameters:', { page, limit, search, category, searchTrigger });
        const adminId = localStorage.getItem('adminId');
        let url = `/admin/vaccines?page=${page}&limit=${limit}`;
        if (adminId) {
          url += `&admin_user_id=${adminId}`;
        }
        
        // Add specific filter parameters
        if (search) {
          url += `&search=${encodeURIComponent(search)}`;
        }
        
        if (category) {
          url += `&category=${encodeURIComponent(category)}`;
        }
        
        console.log('Vaccine API URL:', url);
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
    getCategories: builder.query({
      query: (admin_user_id) => `/vaccines/categories?admin_user_id=${admin_user_id}`,
      transformResponse: (response) => response.data?.categories || [],
    }),
    getSubCategories: builder.query({
      query: ({ category, admin_user_id }) => `/vaccines/sub-categories?category=${category}&admin_user_id=${admin_user_id}`,
      transformResponse: (response) => response.data?.sub_categories || [],
    }),
    getTypes: builder.query({
      query: (admin_user_id) => `/vaccines/types?admin_user_id=${admin_user_id}`,
      transformResponse: (response) => response.data?.types || [],
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
  useGetCategoriesQuery,
  useGetSubCategoriesQuery,
  useGetTypesQuery,
} = vaccineApi;