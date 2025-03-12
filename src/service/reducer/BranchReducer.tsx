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


export const isBranchGet = createAsyncThunk(
    "branch/branchget",
    async (_: any, { rejectWithValue }) => {

        try {
            const response = await axios.get(
                `branch${_}`
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
export const isBranchAddExcelFile = createAsyncThunk(
    "branch/branchget/isBranchAddExcelFile",
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "branch/excel" + data
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
export const isBranchAdd = createAsyncThunk(
    "branchadd",
    async (data: any, { rejectWithValue }) => {

        try {

            const { query, file } = data
            let formData = new FormData();
            for(let key in query) {
                formData.append(key, query[key]);
            }
            const response = await axios.post(
                `branch` ,formData
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



export const isBranchEdit = createAsyncThunk("branchedit",
    async (data: any, { rejectWithValue }) => {
        try {
            const { query, id } = data
            let formData = new FormData();
            for(let key in query) {
                formData.append(key, query[key]);
            }
            const response = await axios.post(
                "branch/" + id ,formData
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
export const payAllBranch = createAsyncThunk("payAllBranch",
    async (data: any, { rejectWithValue }) => {

        try {
            const { query, id } = data
            const response = await axios.post(
                "branch/pay-all/" + id, query
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

export const isBranchDelete = createAsyncThunk("isBranchDelete",
    async (data: any, { rejectWithValue }) => {

        try {
            const { all, id } = data
            const response = await axios.delete(
                "/branch/" + (all?.length ?? 0 > 0 ? JSON.stringify(all) : id)
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
    branchData: [],
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
export const BranchReducer = createSlice({
    name: 'branch',
    initialState,
    reducers: {
        isAddBranch: (state, { payload }) => {
            state.branchData = [...state.branchData, payload]
        },
        isBranchPageLimit: (state, { payload }) => {
            state.pageLimit = payload
        },
        isUpdateClearBranch: (state) => {
            state.update = {}
        },
        isBranchCurrentPage: (state, { payload }) => {
            state.page = payload
        },
        isAddAllBranch: (state, { payload }) => {
            state.branchData = payload
        },
        isDeleteBranch: (state, { payload }) => {
            if (Array.isArray(payload)) {
                state.branchData = state.branchData.filter(({ id }: { id: number }) => !new Set([...payload]).has(id))
            }
            state.branchData = state.branchData.filter(({ id }: { id: number }) => id !== payload)
        },
        isEditBranch: (state, { payload }) => {
            state.branchData = state.branchData.map((item: any) => item.id === +payload.id ? payload : item)
        },
        isBranchDefaultApi: (state) => {
            state.isSuccessApi = false;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(isBranchGet.pending, (state, action) => {
                state.isLoading = true;
                state.massage = {}
                state.branchData = []
            })
            .addCase(isBranchGet.fulfilled, (state, { payload
            }) => {
                const { result } = payload;
                if (result?.update) {
                    state.branchData = result?.data
                    state.update = result
                } else {
                    state.branchData = result
                }
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(isBranchGet?.rejected, (state, { payload }) => {
                state.massage = payload
                state.loading = false;
                state.isLoading = false;
                state.branchData = []
            })
            .addCase(isBranchAdd.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isBranchAdd.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    state.branchData = [...state.branchData, payload?.result]
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                    state.hasError = {}

                }
                state.sendLoading = false;
                state.isLoading = false;

            })
            .addCase(isBranchAdd?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isBranchDelete.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isBranchDelete.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    if (Array.isArray(result)) {
                        let res = state.branchData?.filter((item: any) => !new Set([...result]).has(item.id))
                        state.branchData = res;
                        let pagination = [...res.slice((state.page * state.pageLimit) - state.pageLimit, state.page * state.pageLimit)]
                        if (pagination?.length == 0) {
                            state.page = 1
                        }
                    } else {
                        let res = state.branchData?.filter((item: any) => item.id != result)
                        state.branchData = res;
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
            .addCase(isBranchDelete?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isBranchAddExcelFile.pending, (state, action) => {
                state.sendLoading = true;

            })
            .addCase(isBranchAddExcelFile.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    state.branchData = result
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                }
                state.sendLoading = false;
            })
            .addCase(isBranchAddExcelFile?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isBranchEdit.pending, (state, action) => {
                state.sendLoading = true;
            })
            .addCase(isBranchEdit.fulfilled, (state, { payload }) => {
                const { result } = payload
                if (result) {
                    const { data, update } = result;
                    state.isSuccessApi = true;
                    state.branchData = state.branchData.map((item: any) => item.id === +result.id ? result : item)
                    Toast.fire("Ma'lumot tahrirlandi!", '', 'success')
                    state.hasError = {}
                }
                state.update = result
                state.sendLoading = false;
            })
            .addCase(isBranchEdit?.rejected, (state, action) => {
                state.sendLoading = false;
                state.hasError = action.payload
                Toast.fire(action?.error?.message, '', 'error')
            })
            .addCase(payAllBranch.pending, (state, action) => {
                state.sendLoading = true;
            })
            .addCase(payAllBranch.fulfilled, (state, { payload }) => {
                const { result } = payload
                if (result) {
                    state.isSuccessApi = true;
                    const { data } = result
                    if (result?.data) {
                        state.branchData = state.branchData.map((item: any) => item.id === +data.id ? data : item)
                    } else {
                        state.branchData = state.branchData.map((item: any) => item.id === +result.id ? result : item)
                    }
                    console.log('data', data);
                    state.update = result
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                    state.hasError = {}
                    state.findData = result
                }
                state.sendLoading = false;
            })
            .addCase(payAllBranch?.rejected, (state, action) => {
                state.sendLoading = false;
                state.hasError = action.payload
                Toast.fire(action?.error?.message, '', 'error')
            })
    }
})
export const { isUpdateClearBranch, isBranchPageLimit, isBranchCurrentPage, isBranchDefaultApi, isAddAllBranch, isDeleteBranch, isAddBranch, isEditBranch } = BranchReducer.actions

export default BranchReducer.reducer