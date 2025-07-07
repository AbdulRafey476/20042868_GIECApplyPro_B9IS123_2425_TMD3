import { apiSlice } from "./apiSlice";

const CURRENCY_URL = "https://v6.exchangerate-api.com/v6/67a6db2a5785de310882009e/pair";

export const currencyExchangeSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        convertAmount: builder.query({
            query: ({ currency = '', targetCurrency = '', amount = '' }) => ({
                url: `${CURRENCY_URL}/${currency}/${targetCurrency}/${amount}`,
                method: "GET",
            }),
        }),
    }),
});

export const {
    useConvertAmountQuery
} = currencyExchangeSlice;
