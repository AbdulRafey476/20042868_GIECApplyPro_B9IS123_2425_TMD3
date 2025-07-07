import { apiSlice } from "./apiSlice";

const STATUS_URL = "/api/statuses";

export const statusApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        allStatuses: builder.query({
            query: () => STATUS_URL,
            providesTags: ['Statuses'],
        }),
        addStatus: builder.mutation({
            query: (newStatus) => ({
                url: STATUS_URL,
                method: 'POST',
                body: newStatus,
            }),
            invalidatesTags: ['Statuses'],
        }),
        updateStatus: builder.mutation({
            query: ({ id, ...updatedStatus }) => ({
                url: `${STATUS_URL}/${id}`,
                method: 'PUT',
                body: updatedStatus,
            }),
            invalidatesTags: ['Statuses'],
        }),
        deleteStatus: builder.mutation({
            query: (id) => ({
                url: `${STATUS_URL}/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Statuses'],
        }),
    }),
});

export const { useAllStatusesQuery, useAddStatusMutation, useUpdateStatusMutation, useDeleteStatusMutation } = statusApiSlice;

