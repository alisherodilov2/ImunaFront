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


export const isExpenseTypeGet = createAsyncThunk(
    "expenseType/expenseTypeget",
    async (_: any, { rejectWithValue }) => {

        try {
            const response = await axios.get(
                `expense-type${_}`
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
export const isExpenseTypeAddExcelFile = createAsyncThunk(
    "expenseType/expenseTypeget/isExpenseTypeAddExcelFile",
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "expense-type/excel" + data
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
export const isExpenseTypeAdd = createAsyncThunk(
    "expenseTypeadd",
    async (data: any, { rejectWithValue }) => {

        try {

            const { query, file } = data
            let formData = new FormData();
            if (file !== null) {
                formData.append('photo', file);
            }
            const response = await axios.post(
                `expense-type` + query, formData
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



export const isExpenseTypeEdit = createAsyncThunk("expenseTypeedit",
    async (data: any, { rejectWithValue }) => {
        try {
            const { query, id } = data
            const response = await axios.put(
                "expense-type/" + id + query
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
export const payAllExpenseType = createAsyncThunk("payAllExpenseType",
    async (data: any, { rejectWithValue }) => {

        try {
            const { query, id } = data
            const response = await axios.post(
                "expenseType/pay-all/" + id, query
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

export const isExpenseTypeDelete = createAsyncThunk("isExpenseTypeDelete",
    async (data: any, { rejectWithValue }) => {

        try {
            const { all, id } = data
            const response = await axios.delete(
                "/expense-type/" + (all?.length ?? 0 > 0 ? JSON.stringify(all) : id)
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
    expenseTypeData: [],
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
export const ExpenseTypeReducer = createSlice({
    name: 'expenseType',
    initialState,
    reducers: {
        isAddExpenseType: (state, { payload }) => {
            state.expenseTypeData = [...state.expenseTypeData, payload]
        },
        isExpenseTypePageLimit: (state, { payload }) => {
            state.pageLimit = payload
        },
        isUpdateClearExpenseType: (state) => {
            state.update = {}
        },
        isExpenseTypeCurrentPage: (state, { payload }) => {
            state.page = payload
        },
        isAddAllExpenseType: (state, { payload }) => {
            state.expenseTypeData = payload
        },
        isDeleteExpenseType: (state, { payload }) => {
            if (Array.isArray(payload)) {
                state.expenseTypeData = state.expenseTypeData.filter(({ id }: { id: number }) => !new Set([...payload]).has(id))
            }
            state.expenseTypeData = state.expenseTypeData.filter(({ id }: { id: number }) => id !== payload)
        },
        isEditExpenseType: (state, { payload }) => {
            state.expenseTypeData = state.expenseTypeData.map((item: any) => item.id === +payload.id ? payload : item)
        },
        isExpenseTypeDefaultApi: (state) => {
            state.isSuccessApi = false;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(isExpenseTypeGet.pending, (state, action) => {
                state.isLoading = true;
                state.massage = {}
                state.expenseTypeData = []
            })
            .addCase(isExpenseTypeGet.fulfilled, (state, { payload
            }) => {
                const { result } = payload;
                if (result?.update) {
                    state.expenseTypeData = result?.data
                    state.update = result
                } else {
                    state.expenseTypeData = result
                }
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(isExpenseTypeGet?.rejected, (state, { payload }) => {
                state.massage = payload
                state.loading = false;
                state.isLoading = false;
                state.expenseTypeData = []
            })
            .addCase(isExpenseTypeAdd.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isExpenseTypeAdd.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    state.expenseTypeData = [...state.expenseTypeData, payload?.result]
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                    state.hasError = {}

                }
                state.sendLoading = false;
                state.isLoading = false;

            })
            .addCase(isExpenseTypeAdd?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isExpenseTypeDelete.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isExpenseTypeDelete.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    if (Array.isArray(result)) {
                        let res = state.expenseTypeData?.filter((item: any) => !new Set([...result]).has(item.id))
                        state.expenseTypeData = res;
                        let pagination = [...res.slice((state.page * state.pageLimit) - state.pageLimit, state.page * state.pageLimit)]
                        if (pagination?.length == 0) {
                            state.page = 1
                        }
                    } else {
                        let res = state.expenseTypeData?.filter((item: any) => item.id != result)
                        state.expenseTypeData = res;
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
            .addCase(isExpenseTypeDelete?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isExpenseTypeAddExcelFile.pending, (state, action) => {
                state.sendLoading = true;

            })
            .addCase(isExpenseTypeAddExcelFile.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    state.expenseTypeData = result
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                }
                state.sendLoading = false;
            })
            .addCase(isExpenseTypeAddExcelFile?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isExpenseTypeEdit.pending, (state, action) => {
                state.sendLoading = true;
            })
            .addCase(isExpenseTypeEdit.fulfilled, (state, { payload }) => {
                const { result } = payload
                if (result) {
                    const { data, update } = result;
                    state.isSuccessApi = true;
                    state.expenseTypeData = state.expenseTypeData.map((item: any) => item.id === +result.id ? result : item)
                    Toast.fire("Ma'lumot tahrirlandi!", '', 'success')
                    state.hasError = {}
                }
                state.update = result
                state.sendLoading = false;
            })
            .addCase(isExpenseTypeEdit?.rejected, (state, action) => {
                state.sendLoading = false;
                state.hasError = action.payload
                Toast.fire(action?.error?.message, '', 'error')
            })
            .addCase(payAllExpenseType.pending, (state, action) => {
                state.sendLoading = true;
            })
            .addCase(payAllExpenseType.fulfilled, (state, { payload }) => {
                const { result } = payload
                if (result) {
                    state.isSuccessApi = true;
                    const { data } = result
                    if (result?.data) {
                        state.expenseTypeData = state.expenseTypeData.map((item: any) => item.id === +data.id ? data : item)
                    } else {
                        state.expenseTypeData = state.expenseTypeData.map((item: any) => item.id === +result.id ? result : item)
                    }
                    console.log('data', data);
                    state.update = result
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                    state.hasError = {}
                    state.findData = result
                }
                state.sendLoading = false;
            })
            .addCase(payAllExpenseType?.rejected, (state, action) => {
                state.sendLoading = false;
                state.hasError = action.payload
                Toast.fire(action?.error?.message, '', 'error')
            })
    }
})
export const { isUpdateClearExpenseType, isExpenseTypePageLimit, isExpenseTypeCurrentPage, isExpenseTypeDefaultApi, isAddAllExpenseType, isDeleteExpenseType, isAddExpenseType, isEditExpenseType } = ExpenseTypeReducer.actions

export default ExpenseTypeReducer.reducer