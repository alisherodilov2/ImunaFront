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


export const isMasterGet = createAsyncThunk(
    "master/masterget",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                "master"
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
export const isMasterAddExcelFile = createAsyncThunk(
    "master/masterget/isMasterAddExcelFile",
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "master/excel" + data
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
export const isMasterAdd = createAsyncThunk(
    "masteradd",
    async (data: any, { rejectWithValue }) => {

        try {

            const { query, file } = data
            let formData = new FormData();
            if (file !== null) {
                formData.append('photo', file);
            }
            const response = await axios.post(
                `master` + query, formData
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



export const isMasterEdit = createAsyncThunk("masteredit",
    async (data: any, { rejectWithValue }) => {

        try {
            const { query, id } = data
            const response = await axios.put(
                "master/" + id + query
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

export const isMasterDelete = createAsyncThunk("isMasterDelete",
    async (data: any, { rejectWithValue }) => {

        try {
            const { all, id } = data
            const response = await axios.delete(
                "/master/" + (all?.length ?? 0 > 0 ? JSON.stringify(all) : id)
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
    masterData: [],
    loading: false,
    sendLoading: false,
    isLoading: false,
    hasError: {},
    massage: {},
    isSuccessApi: false,
    page: 1,
    pageLimit: 50,
}
export const MasterReducer = createSlice({
    name: 'master',
    initialState,
    reducers: {
        isSoketAddMaster: (state, { payload }) => {
            let find =  state.masterData.find((res:any)=>res.id==payload.id)
            if(find){
                state.masterData = state.masterData.map((item: any) => item.id === +payload.id ? payload : item)
            }else{
                state.masterData = [...state.masterData, payload]
            }
        },
        isAddMaster: (state, { payload }) => {
            state.masterData = [...state.masterData, payload]
        },
        isMasterPageLimit: (state, { payload }) => {
            state.pageLimit = payload
        },
        isMasterCurrentPage: (state, { payload }) => {
            state.page = payload
        },
        isAddAllMaster: (state, { payload }) => {
            state.masterData = payload
        },
        isDeleteMaster: (state, { payload }) => {
            if (Array.isArray(payload)) {
                state.masterData = state.masterData.filter(({ id }: { id: number }) => !new Set([...payload]).has(id))
            }
            state.masterData = state.masterData.filter(({ id }: { id: number }) => id !== payload)
        },
        isEditMaster: (state, { payload }) => {
            state.masterData = state.masterData.map((item: any) => item.id === +payload.id ? payload : item)
        },
        isMasterDefaultApi: (state) => {
            state.isSuccessApi = false;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(isMasterGet.pending, (state, action) => {
                state.isLoading = true;
                state.massage = {}
                state.masterData = []
            })
            .addCase(isMasterGet.fulfilled, (state, { payload
            }) => {
                state.masterData = payload?.result
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(isMasterGet?.rejected, (state, { payload }) => {
                state.massage = payload
                state.loading = false;
                state.isLoading = false;
                state.masterData = []
            })
            .addCase(isMasterAdd.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isMasterAdd.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    state.masterData = [...state.masterData, payload?.result]
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                    state.hasError = {}

                }
                state.sendLoading = false;
                state.isLoading = false;

            })
            .addCase(isMasterAdd?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isMasterDelete.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isMasterDelete.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    if (Array.isArray(result)) {
                        let res = state.masterData?.filter((item: any) => !new Set([...result]).has(item.id))
                        state.masterData = res;
                        let pagination = [...res.slice((state.page * state.pageLimit) - state.pageLimit, state.page * state.pageLimit)]
                        if (pagination?.length == 0) {
                            state.page = 1
                        }
                    } else {
                        let res = state.masterData?.filter((item: any) => item.id != result)
                        state.masterData = res;
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
            .addCase(isMasterDelete?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isMasterAddExcelFile.pending, (state, action) => {
                state.sendLoading = true;

            })
            .addCase(isMasterAddExcelFile.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    state.masterData = result
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                }
                state.sendLoading = false;
            })
            .addCase(isMasterAddExcelFile?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isMasterEdit.pending, (state, action) => {
                state.sendLoading = true;
            })
            .addCase(isMasterEdit.fulfilled, (state, { payload }) => {
                const { result } = payload
                if (result) {
                    state.isSuccessApi = true;
                    state.masterData = state.masterData.map((item: any) => item.id === +result.id ? result : item)
                    Toast.fire("Ma'lumot tahrirlandi!", '', 'success')
                    state.hasError = {}

                }
                state.sendLoading = false;
            })
            .addCase(isMasterEdit?.rejected, (state, action) => {
                state.sendLoading = false;
                state.hasError = action.payload
                Toast.fire(action?.error?.message, '', 'error')
            })
    }
})
export const { isSoketAddMaster,isMasterPageLimit, isMasterCurrentPage, isMasterDefaultApi, isAddAllMaster, isDeleteMaster, isAddMaster, isEditMaster } = MasterReducer.actions

export default MasterReducer.reducer