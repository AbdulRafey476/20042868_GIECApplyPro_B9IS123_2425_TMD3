import { apiSlice } from "./apiSlice";

const EARNING_URL = "/api/earnings";

export const paymentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addEarnings: builder.mutation({
      query: (newPayment) => ({
        url: EARNING_URL,
        method: 'POST',
        body: newPayment,
      }),
    }),

    allEarnings: builder.query({
      query: ({ page = 1, limit = 10, search = '', branch_id = '', studentIds = [] } = {}) => {
        const searchParam = search ? `&search=${search}` : '';
        const branchIdParam = branch_id ? `&branch_id=${branch_id}` : '';
        const studentIdsParam = studentIds.length > 0 ? `&studentIds=${studentIds.join(',')}` : '';

        return {
          url: `${EARNING_URL}?page=${page}&limit=${limit}${searchParam}${branchIdParam}${studentIdsParam}`,
          method: "GET",
        };
      },
      providesTags: ['Earnings'],
    }),


    getEarningsByID: builder.query({
      query: (id) => ({
        url: `${EARNING_URL}/${id}`,
        method: "GET",
      }),
    }),

    updateEarnings: builder.mutation({
      query: ({ id, ...update }) => ({
        url: `${EARNING_URL}/${id}`,
        method: 'PUT',
        body: update,
      }),
    }),

    deleteEarnings: builder.mutation({
      query: (id) => ({
        url: `${EARNING_URL}/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useAddEarningsMutation,
  useAllEarningsQuery,
  useGetEarningsByIDQuery,
  useUpdateEarningsMutation,
  useDeleteEarningsMutation
} = paymentApiSlice;
