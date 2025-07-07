import { apiSlice } from "./apiSlice";

const USER_URL = "/api/admins";

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: `${USER_URL}/auth`,
                method: "POST",
                body: data
            }),
        }),

        specificUser: builder.query({
            query: () => ({
                url: `${USER_URL}/profile`,
                method: "GET",
            }),
        }),

        getUserById: builder.query({
            query: (id) => ({
                url: `${USER_URL}/profile/${id}`,
                method: "GET",
            }),
        }),

        allUsers: builder.mutation({
            query: () => ({
                url: `${USER_URL}/users`,
                method: "GET",
            }),
        }),

        // paginatedUsers: builder.mutation({
        //     query: ({ currentPage, limit, search = '', role = '', branch_id = '' }) => ({
        //         url: `${USER_URL}/pagination?page=${currentPage}&limit=${limit}&search=${search}&role=${role}&branch_id=${branch_id}`,
        //         method: "GET",
        //     }),
        //     invalidatesTags: ['User'],
        // }),

        paginatedUser: builder.query({
            query: ({ currentPage, limit, search = '', role = '', branch_id = '' }) => ({
                url: `${USER_URL}/pagination?page=${currentPage}&limit=${limit}&search=${search}&role=${role}&branch_id=${branch_id}`,
                method: "GET",
            }),
            invalidatesTags: ['User'],
        }),

        addUser: builder.mutation({
            query: (data) => ({
                url: `${USER_URL}`,
                method: "POST",
                body: data,
            }),
        }),

        updateUser: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `${USER_URL}/profile/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
        }),

        getConsultantsByBranch: builder.query({
            query: (id) => ({
                url: `${USER_URL}/consultants/${id}`,
                method: "GET",
            }),
        }),

        deleteUser: builder.mutation({
            query: (id) => ({
                url: `${USER_URL}/profile/${id}`,
                method: "DELETE",
            }),
        }),

    }),
});

export const {
    useLoginMutation,
    useSpecificUserQuery,
    useGetUserByIdQuery,
    useAllUsersMutation,
    useAddUserMutation,
    useUpdateUserMutation,
    useGetConsultantsByBranchQuery,
    useDeleteUserMutation,
    usePaginatedUserQuery
} = userApiSlice;
