import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
    baseUrl: "",
    prepareHeaders: (headers) => {
        try {
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            const token = userInfo?.token;

            if (token) {
                headers.set("token", token);
            }
        } catch (error) {
            console.error("Error parsing userInfo from localStorage:", error);
        }

        return headers;
    },
});

export const apiSlice = createApi({
    baseQuery,
    tagTypes: ["User", "Branch", "Student", "Status", "Payment", "Earnings"],
    endpoints: (builder) => ({}),
})