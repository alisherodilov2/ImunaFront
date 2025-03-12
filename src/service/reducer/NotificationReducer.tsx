import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { TypeState } from '../../interface/interface';
import axios from 'axios';
import Swal from 'sweetalert2';



const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    timer: 2000,
    showConfirmButton: false,
    timerProgressBar: true
})


export const isNotificationGet = createAsyncThunk(
    "notifications",
    async (_: any, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                "notifications?" + _
            );
            return response.data;
        } catch (error: any) {
            const { exception
                , file, line, message } = error?.response?.data
           

            return rejectWithValue({
                status: error.message,
                message: message,
                exception: exception,
                line: line,
                file: file,
            });
        }
    });

const initialState: TypeState = {
    notificationData: [],
    loading: false,
    sendLoading: false,
    isLoading: true,
    hasError: {},
    massage: {},
    isSuccessApi: false,
    page: 0
}
export const NotificationReducer = createSlice({
    name: 'notification',
    initialState,
    reducers: {

    },
    extraReducers: builder => {
        builder
            .addCase(isNotificationGet.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(isNotificationGet.fulfilled, (state, { payload
            }) => {
                state.notificationData = payload?.result
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(isNotificationGet?.rejected, (state, { payload }) => {
                state.massage = payload
                state.loading = false;
                state.isLoading = false;
            })
    }
})
export const { } = NotificationReducer.actions

export default NotificationReducer.reducer