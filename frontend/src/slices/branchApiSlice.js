import { apiSlice } from "./apiSlice";

const BRANCH_URL = "/api/branch";

export const branchApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createBranch: builder.mutation({
            query: (data) => ({
                url: `${BRANCH_URL}`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ['Branches'],
        }),

        allBranches: builder.query({
            query: ({ page = 1, limit = 10, search = '' }) => ({
                url: `${BRANCH_URL}/allbranches?page=${page}&limit=${limit}&search=${search}`,
                method: "GET",
            }),
            providesTags: ['Branches'],
        }),
        specificBranch: builder.query({
            query: (id) => ({
                url: `${BRANCH_URL}/getbranch/${id}`,
                method: "GET",
            }),
            providesTags: ['Branches'],
        }),

        updateBranch: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `${BRANCH_URL}/updatebranch/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ['Branches'],
        }),

        deleteBranch: builder.mutation({
            query: (id) => ({
                url: `${BRANCH_URL}/deletebranch/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ['Branches'],
        }),
    }),
});

export const {
    useCreateBranchMutation,
    useAllBranchesQuery,
    useUpdateBranchMutation,
    useSpecificBranchQuery,
    useDeleteBranchMutation,
} = branchApiSlice;

