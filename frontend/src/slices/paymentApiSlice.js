import { apiSlice } from "./apiSlice";

const PAYMENT_URL = "/api/payments";

export const paymentApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addPayment: builder.mutation({
            query: (newPayment) => ({
                url: PAYMENT_URL,
                method: 'POST',
                body: newPayment,
            }),
        }),

        allPayments: builder.query({
            query: ({ page = 1, limit = 0, search = '', branch_id = '', status = '' }) => ({
                url: `${PAYMENT_URL}?page=${page}&limit=${limit}&search=${search}&branch_id=${branch_id}&status=${status}`,
                method: "GET",
            }),
        }),

        updatePayments: builder.mutation({
            query: ({ id, ...update }) => ({
                url: `${PAYMENT_URL}/${id}`,
                method: 'PUT',
                body: update,
            }),
        }),

        deletePayments: builder.mutation({
            query: (id) => ({
                url: `${PAYMENT_URL}/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useAddPaymentMutation,
    useAllPaymentsQuery,
    useUpdatePaymentsMutation,
    useDeletePaymentsMutation,
} = paymentApiSlice;
