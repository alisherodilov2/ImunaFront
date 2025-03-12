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


export const isUsersGet = createAsyncThunk(
    "users/usersget",
    async (_: any, { rejectWithValue }) => {

        try {
            const response = await axios.get(
                `users${_}`
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
export const isUsersAddExcelFile = createAsyncThunk(
    "users/usersget/isUsersAddExcelFile",
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "users/excel" + data
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
export const isUsersAdd = createAsyncThunk(
    "usersadd",
    async (data: any, { rejectWithValue }) => {

        try {

            const { query, file } = data
            let formData = new FormData();
            if (file?.logo_photo !== null) {
                formData.append('logo_photo', file?.logo_photo);
            }
            if (file?.user_photo !== null) {
                formData.append('user_photo', file?.user_photo);
            }
            if (file?.blank_file !== null) {
                formData.append('blank_file', file?.blank_file);
            }
            for(let key in query) {
                formData.append(key, query[key]);
            }
            const response = await axios.post(
                `users` , formData
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
    });



export const isUsersEdit = createAsyncThunk("usersedit",
    async (data: any, { rejectWithValue }) => {

        try {
            const { query, id, file } = data
            let formData = new FormData();

            if (file?.logo_photo !== null) {
                formData.append('logo_photo', file?.logo_photo);
            }
            if (file?.user_photo !== null) {
                formData.append('user_photo', file?.user_photo);
            }
            if (file?.blank_file !== null) {
                formData.append('blank_file', file?.blank_file);
            }
            for(let key in query) {
                formData.append(key, query[key]);
            }
            const response = await axios.post(
                "users/" + id, formData
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
export const payAllUsers = createAsyncThunk("payAllUsers",
    async (data: any, { rejectWithValue }) => {

        try {
            const { query, id } = data
            const response = await axios.post(
                "users/pay-all/" + id, query
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

export const isUsersDelete = createAsyncThunk("isUsersDelete",
    async (data: any, { rejectWithValue }) => {

        try {
            const { all, id } = data
            const response = await axios.delete(
                "/users/" + (all?.length ?? 0 > 0 ? JSON.stringify(all) : id)
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
    usersData: [],
    loading: false,
    sendLoading: false,
    isLoading: false,
    hasError: {},
    massage: {},
    update: {},
    findData: {},
    isSuccessApi: false,
    page: 1,
    pageLimit: 50,
}
export const UserReducer = createSlice({
    name: 'users',
    initialState,
    reducers: {
        isAddUsers: (state, { payload }) => {
            state.usersData = [...state.usersData, payload]
        },
        isUsersPageLimit: (state, { payload }) => {
            state.pageLimit = payload
        },
        isUpdateClearUsers: (state) => {
            state.update = {}
        },
        isUsersCurrentPage: (state, { payload }) => {
            state.page = payload
        },
        isAddAllUsers: (state, { payload }) => {
            state.usersData = payload
        },
        isDeleteUsers: (state, { payload }) => {
            if (Array.isArray(payload)) {
                state.usersData = state.usersData.filter(({ id }: { id: number }) => !new Set([...payload]).has(id))
            }
            state.usersData = state.usersData.filter(({ id }: { id: number }) => id !== payload)
        },
        isEditUsers: (state, { payload }) => {
            state.usersData = state.usersData.map((item: any) => item.id === +payload.id ? payload : item)
        },
        isUsersDefaultApi: (state) => {
            state.isSuccessApi = false;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(isUsersGet.pending, (state, action) => {
                state.isLoading = true;
                state.massage = {}
                state.usersData = []
            })
            .addCase(isUsersGet.fulfilled, (state, { payload
            }) => {
                const { result } = payload;
                if (result?.update) {
                    state.usersData = result?.data
                    state.update = result
                } else {
                    state.usersData = result
                }
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(isUsersGet?.rejected, (state, { payload }) => {
                state.massage = payload
                state.loading = false;
                state.isLoading = false;
                state.usersData = []
            })
            .addCase(isUsersAdd.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isUsersAdd.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    state.usersData = [...state.usersData, payload?.result]
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                    state.hasError = {}

                }
                state.sendLoading = false;
                state.isLoading = false;

            })
            .addCase(isUsersAdd?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                console.log(payload);
                const { message } = payload.errors

                Toast.fire(message ?? payload?.status, '', 'error')
            })
            .addCase(isUsersDelete.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isUsersDelete.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    const { data, update } = result;
                    state.isSuccessApi = true;
                    console.log('result', result);

                    state.update = { status: '', ...result }
                    if (Array.isArray(data)) {
                        let res = state.usersData?.filter((item: any) => !new Set([...data]).has(item.id))
                        state.usersData = res;
                        let pagination = [...res.slice((state.page * state.pageLimit) - state.pageLimit, state.page * state.pageLimit)]
                        if (pagination?.length == 0) {
                            state.page = 1
                        }
                    } else {
                        let res = state.usersData?.filter((item: any) => item.id != data)
                        state.usersData = res;
                        let pagination = [...res.slice((state.page * state.pageLimit) - state.pageLimit, state.page * state.pageLimit)]
                        if (pagination?.length == 0) {
                            state.page = 1
                        }

                    }
                    Toast.fire("Ma'lumot o'chirildi!", '', 'success')
                }
                state.sendLoading = false;
                state.isLoading = false;

            })
            .addCase(isUsersDelete?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isUsersAddExcelFile.pending, (state, action) => {
                state.sendLoading = true;

            })
            .addCase(isUsersAddExcelFile.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    state.usersData = result
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                }
                state.sendLoading = false;
            })
            .addCase(isUsersAddExcelFile?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isUsersEdit.pending, (state, action) => {
                state.sendLoading = true;
            })
            .addCase(isUsersEdit.fulfilled, (state, { payload }) => {
                const { result } = payload
                if (result) {
                    const { data, update } = result;
                    state.isSuccessApi = true;
                    state.usersData = state.usersData.map((item: any) => item.id === +result.id ? result : item)
                    Toast.fire("Ma'lumot tahrirlandi!", '', 'success')
                    state.hasError = {}
                }
                state.update = result
                state.sendLoading = false;
            })
            .addCase(isUsersEdit?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                const { message } = payload.errors
                Toast.fire(message ?? payload?.status, '', 'error')
            })
            .addCase(payAllUsers.pending, (state, action) => {
                state.sendLoading = true;
            })
            .addCase(payAllUsers.fulfilled, (state, { payload }) => {
                const { result } = payload
                if (result) {
                    state.isSuccessApi = true;
                    const { data } = result
                    if (result?.data) {
                        state.usersData = state.usersData.map((item: any) => item.id === +data.id ? data : item)
                    } else {
                        state.usersData = state.usersData.map((item: any) => item.id === +result.id ? result : item)
                    }
                    console.log('data', data);
                    state.update = result
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                    state.hasError = {}
                    state.findData = result
                }
                state.sendLoading = false;
            })
            .addCase(payAllUsers?.rejected, (state, action) => {
                state.sendLoading = false;
                state.hasError = action.payload
                Toast.fire(action?.error?.message, '', 'error')
            })
    }
})
export const { isUpdateClearUsers, isUsersPageLimit, isUsersCurrentPage, isUsersDefaultApi, isAddAllUsers, isDeleteUsers, isAddUsers, isEditUsers } = UserReducer.actions

export default UserReducer.reducer