import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import { TypeState } from '../../interface/interface';


export const isFetchGet = createAsyncThunk(
    "find/isFetchGet",
    async (_: any, { rejectWithValue }) => {
        try {
            const { url, method = 'post' } = _

            const response = await axios(
                {
                    url: url,
                    method: method
                }
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
export const isFindGet = createAsyncThunk(
    "find/data",
    async (_: any, { rejectWithValue }) => {
        try {
            const { url, method = 'post' } = _

            const response = await axios(
                {
                    url: url,
                    method: method
                }
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
    menu: false,
    screen: false,
    dark: true,
    loading: false,
    findData: {},
    sendLoading: false,
    isLoading: false,
    hasError: {},
    massage: {},
    serachText: '',
    serachData: {
        text: {
            role: false,
            data: ''
        }
    },
    page: 1,
    pageLimit: 50,
}
export const MenuReducer = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        isInPaymentValuePageLimit: (state, { payload }) => {
            state.pageLimit = payload
        },
        isInPaymentValueCurrentPage: (state, { payload }) => {
            state.page = payload
        },
        isMenuFunction: (state) => {
            let data = !state.menu

            state.menu = data
            if (data) {
                document.querySelector('html')?.setAttribute('class', 'light-style layout-menu-fixed layout-menu-expanded')
            } else {
                document.querySelector('html')?.setAttribute('class', 'light-style layout-menu-fixed')
            }
        },
        isFullScreenFunction: (state) => {
            state.screen = !state.screen
        },
        isSearchFunction: (state, { payload }) => {
            state.serachText = payload
        },
        isSearchDataFunction: (state, { payload }) => {
            state.serachData = payload
        },
        isDarkModeFunction: (state) => {
            document.body.classList.toggle('active')
            state.dark = !state.dark
        },
        isDeleteInPaymentValue: (state, { payload }) => {
            let res = state.findData.in_payment_value;
            if (Array.isArray(payload)) {
                res = state.findData.in_payment_value.filter(({ id }: { id: number }) => !new Set([...payload]).has(id))

            } else {

                res  = state.findData.in_payment_value.filter(({ id }: { id: number }) => id !== payload)
            }
            state.findData.in_payment_value = res

            let pagination = [...res.slice((state.page * state.pageLimit) - state.pageLimit, state.page * state.pageLimit)]
            if (pagination?.length == 0) {
                state.page = 1
            }


        },
        isFindFunction: (state, { payload }) => {
            state.findData = payload
        },
        isLoadingFunction: (state, { payload }) => {
            state.isLoading = payload
            state.loading = payload
        },
        isSuccessFunction: (state, { payload }) => {
            state.isSuccess = payload
        },
    },
    extraReducers: builder => {
        builder
            .addCase(isFindGet.pending, (state, action) => {
                state.massage = {}
                state.isLoading = true;
            })
            .addCase(isFindGet.fulfilled, (state, { payload
            }) => {
                state.findData = payload
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(isFindGet?.rejected, (state, { payload }) => {
                state.massage = payload
                state.loading = false;
                state.isLoading = false;
            })
            .addCase(isFetchGet.pending, (state, action) => {
                state.massage = {}
                state.isLoading = true;
            })
            .addCase(isFetchGet.fulfilled, (state, { payload
            }) => {
                state.findData = payload
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(isFetchGet?.rejected, (state, { payload }) => {
                state.massage = payload
                state.loading = false;
                state.isLoading = false;
            })

    }
})
export const { isInPaymentValueCurrentPage, isInPaymentValuePageLimit, isDeleteInPaymentValue, isFullScreenFunction, isSearchFunction, isSearchDataFunction, isLoadingFunction, isMenuFunction, isDarkModeFunction, isFindFunction } = MenuReducer.actions

export default MenuReducer.reducer