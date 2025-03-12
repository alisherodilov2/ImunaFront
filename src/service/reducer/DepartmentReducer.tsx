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


export const isDepartmentGet = createAsyncThunk(
    "department/departmentget",
    async (_: any, { rejectWithValue }) => {

        try {
            const response = await axios.get(
                `department${_}`
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
export const isDepartmentAddExcelFile = createAsyncThunk(
    "department/departmentget/isDepartmentAddExcelFile",
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "department/excel" + data
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
export const isDepartmentAdd = createAsyncThunk(
    "departmentadd",
    async (data: any, { rejectWithValue }) => {

        try {

            const { query, file } = data
            let formData = new FormData();
            // if (file !== null) {
            //     formData.append('photo', file);
            // }
            for (let key in query) {
                formData.append(key, query[key]);
            }

            const response = await axios.post(
                `department`, formData
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



export const isDepartmentEdit = createAsyncThunk("departmentedit",
    async (data: any, { rejectWithValue }) => {

        try {
            const { query, id } = data
            let formData = new FormData();
            for (let key in query) {
                formData.append(key, query[key]);
            }
            const response = await axios.post(
                "department/" + id, formData);
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
export const payAllDepartment = createAsyncThunk("payAllDepartment",
    async (data: any, { rejectWithValue }) => {

        try {
            const { query, id } = data
            const response = await axios.post(
                "department/pay-all/" + id, query
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

export const isDepartmentDelete = createAsyncThunk("isDepartmentDelete",
    async (data: any, { rejectWithValue }) => {

        try {
            const { all, id } = data
            const response = await axios.delete(
                "/department/" + (all?.length ?? 0 > 0 ? JSON.stringify(all) : id)
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
    departmentData: [],
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
export const DepartmentReducer = createSlice({
    name: 'department',
    initialState,
    reducers: {
        isAddDepartment: (state, { payload }) => {
            state.departmentData = [...state.departmentData, payload]
        },
        isDepartmentPageLimit: (state, { payload }) => {
            state.pageLimit = payload
        },
        isUpdateClearDepartment: (state) => {
            state.update = {}
        },
        isDepartmentCurrentPage: (state, { payload }) => {
            state.page = payload
        },
        isAddAllDepartment: (state, { payload }) => {
            state.departmentData = payload
        },
        isDeleteDepartment: (state, { payload }) => {
            if (Array.isArray(payload)) {
                state.departmentData = state.departmentData.filter(({ id }: { id: number }) => !new Set([...payload]).has(id))
            }
            state.departmentData = state.departmentData.filter(({ id }: { id: number }) => id !== payload)
        },
        isEditDepartment: (state, { payload }) => {
            state.departmentData = state.departmentData.map((item: any) => item.id === +payload.id ? payload : item)
        },
        isDepartmentDefaultApi: (state) => {
            state.isSuccessApi = false;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(isDepartmentGet.pending, (state, action) => {
                state.isLoading = true;
                state.massage = {}
                state.departmentData = []
            })
            .addCase(isDepartmentGet.fulfilled, (state, { payload
            }) => {
                const { result } = payload;
                if (result?.update) {
                    state.departmentData = result?.data
                    state.update = result
                } else {
                    state.departmentData = result
                }
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(isDepartmentGet?.rejected, (state, { payload }) => {
                state.massage = payload
                state.loading = false;
                state.isLoading = false;
                state.departmentData = []
            })
            .addCase(isDepartmentAdd.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isDepartmentAdd.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    state.departmentData = [...state.departmentData, payload?.result]
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                    state.hasError = {}

                }
                state.sendLoading = false;
                state.isLoading = false;

            })
            .addCase(isDepartmentAdd?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isDepartmentDelete.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isDepartmentDelete.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    if (Array.isArray(result)) {
                        let res = state.departmentData?.filter((item: any) => !new Set([...result]).has(item.id))
                        state.departmentData = res;
                        let pagination = [...res.slice((state.page * state.pageLimit) - state.pageLimit, state.page * state.pageLimit)]
                        if (pagination?.length == 0) {
                            state.page = 1
                        }
                    } else {
                        let res = state.departmentData?.filter((item: any) => item.id != result)
                        state.departmentData = res;
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
            .addCase(isDepartmentDelete?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isDepartmentAddExcelFile.pending, (state, action) => {
                state.sendLoading = true;

            })
            .addCase(isDepartmentAddExcelFile.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    state.departmentData = result
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                }
                state.sendLoading = false;
            })
            .addCase(isDepartmentAddExcelFile?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isDepartmentEdit.pending, (state, action) => {
                state.sendLoading = true;
            })
            .addCase(isDepartmentEdit.fulfilled, (state, { payload }) => {
                const { result } = payload
                if (result) {
                    const { data, update } = result;
                    state.isSuccessApi = true;
                    state.departmentData = state.departmentData.map((item: any) => item.id === +result.id ? result : item)
                    Toast.fire("Ma'lumot tahrirlandi!", '', 'success')
                    state.hasError = {}
                }
                state.update = result
                state.sendLoading = false;
            })
            .addCase(isDepartmentEdit?.rejected, (state, action) => {
                state.sendLoading = false;
                state.hasError = action.payload
                Toast.fire(action?.error?.message, '', 'error')
            })
            .addCase(payAllDepartment.pending, (state, action) => {
                state.sendLoading = true;
            })
            .addCase(payAllDepartment.fulfilled, (state, { payload }) => {
                const { result } = payload
                if (result) {
                    state.isSuccessApi = true;
                    const { data } = result
                    if (result?.data) {
                        state.departmentData = state.departmentData.map((item: any) => item.id === +data.id ? data : item)
                    } else {
                        state.departmentData = state.departmentData.map((item: any) => item.id === +result.id ? result : item)
                    }
                    console.log('data', data);
                    state.update = result
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                    state.hasError = {}
                    state.findData = result
                }
                state.sendLoading = false;
            })
            .addCase(payAllDepartment?.rejected, (state, action) => {
                state.sendLoading = false;
                state.hasError = action.payload
                Toast.fire(action?.error?.message, '', 'error')
            })
    }
})
export const { isUpdateClearDepartment, isDepartmentPageLimit, isDepartmentCurrentPage, isDepartmentDefaultApi, isAddAllDepartment, isDeleteDepartment, isAddDepartment, isEditDepartment } = DepartmentReducer.actions

export default DepartmentReducer.reducer