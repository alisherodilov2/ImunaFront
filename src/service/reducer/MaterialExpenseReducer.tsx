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


export const isMaterialExpenseGet = createAsyncThunk(
    "materialExpense/materialExpenseget",
    async (_: any, { rejectWithValue }) => {

        try {
            const response = await axios.get(
                `material-expense${_}`
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
export const isMaterialExpenseAddExcelFile = createAsyncThunk(
    "materialExpense/materialExpenseget/isMaterialExpenseAddExcelFile",
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "material-expense/excel" + data
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
export const isMaterialExpenseAdd = createAsyncThunk(
    "materialExpenseadd",
    async (data: any, { rejectWithValue }) => {

        try {

            const { query, file } = data
            let formData = new FormData();
            if (file !== null) {
                formData.append('photo', file);
            }
            const response = await axios.post(
                `material-expense` + query, formData
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



export const isMaterialExpenseEdit = createAsyncThunk("materialExpenseedit",
    async (data: any, { rejectWithValue }) => {
        try {
            const { query, id } = data
            const response = await axios.put(
                "material-expense/" + id + query
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
export const payAllMaterialExpense = createAsyncThunk("payAllMaterialExpense",
    async (data: any, { rejectWithValue }) => {

        try {
            const { query, id } = data
            const response = await axios.post(
                "material-expense/pay-all/" + id, query
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

export const isMaterialExpenseDelete = createAsyncThunk("isMaterialExpenseDelete",
    async (data: any, { rejectWithValue }) => {
        try {
            const { all, id } = data
            const response = await axios.delete(
                "/material-expense/" + (all?.length ?? 0 > 0 ? JSON.stringify(all) : id)
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
    materialExpenseData: [],
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
export const MaterialExpenseReducer = createSlice({
    name: 'materialExpense',
    initialState,
    reducers: {
        isAddMaterialExpense: (state, { payload }) => {
            state.materialExpenseData = [...state.materialExpenseData, payload]
        },
        isMaterialExpensePageLimit: (state, { payload }) => {
            state.pageLimit = payload
        },
        isUpdateClearMaterialExpense: (state) => {
            state.update = {}
        },
        isMaterialExpenseCurrentPage: (state, { payload }) => {
            state.page = payload
        },
        isAddAllMaterialExpense: (state, { payload }) => {
            state.materialExpenseData = payload
        },
        isDeleteMaterialExpense: (state, { payload }) => {
            if (Array.isArray(payload)) {
                state.materialExpenseData = state.materialExpenseData.filter(({ id }: { id: number }) => !new Set([...payload]).has(id))
            }
            state.materialExpenseData = state.materialExpenseData.filter(({ id }: { id: number }) => id !== payload)
        },
        isEditMaterialExpense: (state, { payload }) => {
            state.materialExpenseData = state.materialExpenseData.map((item: any) => item.id === +payload.id ? payload : item)
        },
        isMaterialExpenseDefaultApi: (state) => {
            state.isSuccessApi = false;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(isMaterialExpenseGet.pending, (state, action) => {
                state.isLoading = true;
                state.massage = {}
                state.materialExpenseData = []
            })
            .addCase(isMaterialExpenseGet.fulfilled, (state, { payload
            }) => {
                const { result } = payload;
                if (result?.update) {
                    state.materialExpenseData = result?.data
                    state.update = result
                } else {
                    state.materialExpenseData = result
                }
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(isMaterialExpenseGet?.rejected, (state, { payload }) => {
                state.massage = payload
                state.loading = false;
                state.isLoading = false;
                state.materialExpenseData = []
            })
            .addCase(isMaterialExpenseAdd.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isMaterialExpenseAdd.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    state.materialExpenseData = [...state.materialExpenseData, payload?.result]
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                    state.hasError = {}

                }
                state.sendLoading = false;
                state.isLoading = false;

            })
            .addCase(isMaterialExpenseAdd?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isMaterialExpenseDelete.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isMaterialExpenseDelete.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    if (Array.isArray(result)) {
                        let res = state.materialExpenseData?.filter((item: any) => !new Set([...result]).has(item.id))
                        state.materialExpenseData = res;
                        let pagination = [...res.slice((state.page * state.pageLimit) - state.pageLimit, state.page * state.pageLimit)]
                        if (pagination?.length == 0) {
                            state.page = 1
                        }
                    } else {
                        let res = state.materialExpenseData?.filter((item: any) => item.id != result)
                        state.materialExpenseData = res;
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
            .addCase(isMaterialExpenseDelete?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isMaterialExpenseAddExcelFile.pending, (state, action) => {
                state.sendLoading = true;

            })
            .addCase(isMaterialExpenseAddExcelFile.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    state.materialExpenseData = result
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                }
                state.sendLoading = false;
            })
            .addCase(isMaterialExpenseAddExcelFile?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isMaterialExpenseEdit.pending, (state, action) => {
                state.sendLoading = true;
            })
            .addCase(isMaterialExpenseEdit.fulfilled, (state, { payload }) => {
                const { result } = payload
                if (result) {
                    const { data, update } = result;
                    state.isSuccessApi = true;
                    state.materialExpenseData = state.materialExpenseData.map((item: any) => item.id === +result.id ? result : item)
                    Toast.fire("Ma'lumot tahrirlandi!", '', 'success')
                    state.hasError = {}
                }
                state.update = result
                state.sendLoading = false;
            })
            .addCase(isMaterialExpenseEdit?.rejected, (state, action) => {
                state.sendLoading = false;
                state.hasError = action.payload
                Toast.fire(action?.error?.message, '', 'error')
            })
            .addCase(payAllMaterialExpense.pending, (state, action) => {
                state.sendLoading = true;
            })
            .addCase(payAllMaterialExpense.fulfilled, (state, { payload }) => {
                const { result } = payload
                if (result) {
                    state.isSuccessApi = true;
                    const { data } = result
                    if (result?.data) {
                        state.materialExpenseData = state.materialExpenseData.map((item: any) => item.id === +data.id ? data : item)
                    } else {
                        state.materialExpenseData = state.materialExpenseData.map((item: any) => item.id === +result.id ? result : item)
                    }
                    console.log('data', data);
                    state.update = result
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                    state.hasError = {}
                    state.findData = result
                }
                state.sendLoading = false;
            })
            .addCase(payAllMaterialExpense?.rejected, (state, action) => {
                state.sendLoading = false;
                state.hasError = action.payload
                Toast.fire(action?.error?.message, '', 'error')
            })
    }
})
export const { isUpdateClearMaterialExpense, isMaterialExpensePageLimit, isMaterialExpenseCurrentPage, isMaterialExpenseDefaultApi, isAddAllMaterialExpense, isDeleteMaterialExpense, isAddMaterialExpense, isEditMaterialExpense } = MaterialExpenseReducer.actions

export default MaterialExpenseReducer.reducer