import { apiSlice } from "./apiSlice";

const STUDENT_URL = "/api/students";

export const studentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addStudent: builder.mutation({
      query: (data) => ({
        url: `${STUDENT_URL}`,
        method: "POST",
        body: data,
      }),
    }),

    allStudents: builder.query({
      query: ({ page = 1, limit = 0, search = '', branch_id = ' ', status = '', showPaymentsAdded } = {}) => ({
        url: `${STUDENT_URL}?page=${page}&limit=${limit}&search=${search}&branch_id=${branch_id}&status=${status}&showPaymentsAdded=${showPaymentsAdded}`,
        method: "GET",
      }),
    }),

    getStudentByID: builder.query({
      query: (id) => ({
        url: `${STUDENT_URL}/${id}`,
        method: "GET",
      }),
    }),

    updateStudents: builder.mutation({
      query: ({ id, ...update }) => ({
        url: `${STUDENT_URL}/${id}`,
        method: 'PUT',
        body: update,
      }),
    }),

    deleteStudent: builder.mutation({
      query: (id) => ({
        url: `${STUDENT_URL}/${id}`,
        method: "DELETE",
      }),
    }),

    allStudentsByMonth: builder.query({
      query: ({ branch_id = "", month = "" }) => ({
        url: `${STUDENT_URL}/monthly-count?branch_id=${branch_id}&month=${month}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useAddStudentMutation,
  useGetStudentByIDQuery,
  useAllStudentsQuery,
  useUpdateStudentsMutation,
  useDeleteStudentMutation,
  useAllStudentsByMonthQuery,
} = studentApiSlice;
