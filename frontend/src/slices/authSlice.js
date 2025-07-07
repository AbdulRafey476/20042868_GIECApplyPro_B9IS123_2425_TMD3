import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userInfo: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem('userInfo')) : null,
    branchName: '',
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.userInfo = action.payload;
            localStorage.setItem('userInfo', JSON.stringify(action.payload))
        },
        setBranchName: (state, action) => {
            state.branchName = action.payload;
        },
        logout: (state) => {
            state.userInfo = null;
            state.branchName = '';
            localStorage.removeItem('userInfo');
            window.location.reload()
        }
    }
});

export const { setCredentials, setBranchName, logout } = authSlice.actions;
export default authSlice.reducer;
