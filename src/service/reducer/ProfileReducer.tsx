import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { TypeState } from '../../interface/interface';
import axios from 'axios';
import Swal from 'sweetalert2';
import { set } from 'date-fns';



const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    timer: 2000,
    showConfirmButton: false,
    timerProgressBar: true
})
export const isUserCheck = createAsyncThunk("profile",
    async () => {
        const response = await axios.get('/profile')
        return response.data
    })
// export const isLogout = createAsyncThunk("profile",
//     async () => {
//         const response = await axios.post('/logout')
//         return response.data
//     })
export const isProfileEdit = createAsyncThunk("isProfileEdit",
    async (data: any, { rejectWithValue }) => {

        try {
            const { query, id, file } = data
            let formData = new FormData();
            if (file !== null) {
                formData.append('photo', file);
            }
            const response = await axios.post(
                "profile/" + query, formData
            );
            return response.data;

        } catch (error: any) {
            const { exception
                , file, line, message, errors
            } = error?.response?.data


            return rejectWithValue({
                status: error.message,
                message: message,
                exception: exception,
                line: line,
                file: file,
                errors: errors
                ,
            });
        }
    })
const initialState: TypeState = {
    token: localStorage.getItem('token') ?? '',
    user: {},
    target_branch: 0,
    home_tab: 0,
    isSuccessApi: false,
    isLoading: false,
    userCheck: false,
    userCheckLoad: false
}


export const ProfileReducer = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        isUpdateProfile: (state, { payload }) => {
            state.user = payload;
        },
        isSetHomeTab: (state, { payload }) => {
            state.home_tab = payload;
        },
        isChanageTargetBranch: (state, { payload }) => {
            state.target_branch = payload;
        },
        isSettingUpdate: (state, { payload }) => {
            state.user = {
                ...state.user,
                setting: payload
            };
        },
        isLoginFunction: (state, { payload }) => {
            localStorage.setItem('token', payload?.token);
            state.token = payload?.token;
        },
        isLogoutFunction: (state) => {
            window.localStorage.clear();
            state.token = undefined;
            state.user = {}
        },
        isProfileDefaultApi: (state, { payload }) => {
            state.isSuccessApi = payload;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(isUserCheck.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(isUserCheck.fulfilled, (state, { payload }) => {
                state.userCheckLoad = true;
                state.userCheck = true;
                state.user = payload?.result
                state.isLoading = false;
            })
            .addCase(isUserCheck?.rejected, (state, action) => {
                state.token = '';
                state.userCheckLoad = true;
                state.userCheck = false;
                state.user = {}
                state.isLoading = false;
                localStorage.clear()
            })
            .addCase(isProfileEdit.pending, (state, action) => {
                state.isLoading = true
            })
            .addCase(isProfileEdit.fulfilled, (state, { payload }) => {
                state.isLoading = false
                state.isSuccessApi = true;
                state.user = payload?.result
                Toast.fire('Profile malumotlari yangilandi', '', 'success')
            })
            .addCase(isProfileEdit?.rejected, (state, action) => {
                state.isLoading = false
                Toast.fire(action?.error?.message, '', 'error')
            })
        // .addCase(isLogout.pending, (state, action) => {
        //     state.isLoading = true
        // })
        // .addCase(isLogout.fulfilled, (state, { payload }) => {
        //     state.isLoading = false
        //     state.isSuccessApi = true;
        //     state.token = '';
        //     state.userCheckLoad = true;
        //     state.userCheck = false;
        //     state.user = {}
        //     state.isLoading = false;
        //     localStorage.clear()
        //     Toast.fire('Profile chiqildi', '', 'success')
        // })
        // .addCase(isLogout?.rejected, (state, action) => {
        //     state.isLoading = false
        //     Toast.fire(action?.error?.message, '', 'error')
        // })
    }
})

export const { isSetHomeTab,isChanageTargetBranch, isSettingUpdate, isUpdateProfile, isProfileDefaultApi, isLoginFunction, isLogoutFunction } = ProfileReducer.actions

export default ProfileReducer.reducer