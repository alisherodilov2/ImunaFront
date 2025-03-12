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


export const isServiceTypeGet = createAsyncThunk(
    "serviceType/serviceTypeget",
    async (_: any, { rejectWithValue }) => {

        try {
            const response = await axios.get(
                `service-type${_}`
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
export const isServiceTypeAddExcelFile = createAsyncThunk(
    "serviceType/serviceTypeget/isServiceTypeAddExcelFile",
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "serviceType/excel" + data
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
export const isServiceTypeAdd = createAsyncThunk(
    "serviceTypeadd",
    async (data: any, { rejectWithValue }) => {

        try {

            const { query, file } = data
            let formData = new FormData();
            if (file !== null) {
                formData.append('photo', file);
            }
            const response = await axios.post(
                `service-type` + query, formData
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



export const isServiceTypeEdit = createAsyncThunk("serviceTypeedit",
    async (data: any, { rejectWithValue }) => {

        try {
            const { query, id } = data
            const response = await axios.put(
                "service-type/" + id + query
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
export const payAllServiceType = createAsyncThunk("payAllServiceType",
    async (data: any, { rejectWithValue }) => {

        try {
            const { query, id } = data
            const response = await axios.post(
                "service-type/pay-all/" + id, query
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

export const isServiceTypeDelete = createAsyncThunk("isServiceTypeDelete",
    async (data: any, { rejectWithValue }) => {

        try {
            const { all, id } = data
            const response = await axios.delete(
                "/service-type/" + (all?.length ?? 0 > 0 ? JSON.stringify(all) : id)
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
    serviceTypeData: [],
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
export const ServiceTypeReducer = createSlice({
    name: 'serviceType',
    initialState,
    reducers: {
        isAddServiceType: (state, { payload }) => {
            state.serviceTypeData = [...state.serviceTypeData, payload]
        },
        isServiceTypePageLimit: (state, { payload }) => {
            state.pageLimit = payload
        },
        isUpdateClearServiceType: (state) => {
            state.update = {}
        },
        isServiceTypeCurrentPage: (state, { payload }) => {
            state.page = payload
        },
        isAddAllServiceType: (state, { payload }) => {
            state.serviceTypeData = payload
        },
        isDeleteServiceType: (state, { payload }) => {
            if (Array.isArray(payload)) {
                state.serviceTypeData = state.serviceTypeData.filter(({ id }: { id: number }) => !new Set([...payload]).has(id))
            }
            state.serviceTypeData = state.serviceTypeData.filter(({ id }: { id: number }) => id !== payload)
        },
        isEditServiceType: (state, { payload }) => {
            state.serviceTypeData = state.serviceTypeData.map((item: any) => item.id === +payload.id ? payload : item)
        },
        isServiceTypeDefaultApi: (state) => {
            state.isSuccessApi = false;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(isServiceTypeGet.pending, (state, action) => {
                state.isLoading = true;
                state.massage = {}
                state.serviceTypeData = []
            })
            .addCase(isServiceTypeGet.fulfilled, (state, { payload
            }) => {
                const { result } = payload;
                if (result?.update) {
                    state.serviceTypeData = result?.data
                    state.update = result
                } else {
                    state.serviceTypeData = result
                }
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(isServiceTypeGet?.rejected, (state, { payload }) => {
                state.massage = payload
                state.loading = false;
                state.isLoading = false;
                state.serviceTypeData = []
            })
            .addCase(isServiceTypeAdd.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isServiceTypeAdd.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    state.serviceTypeData = [...state.serviceTypeData, payload?.result]
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                    state.hasError = {}

                }
                state.sendLoading = false;
                state.isLoading = false;

            })
            .addCase(isServiceTypeAdd?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isServiceTypeDelete.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isServiceTypeDelete.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    if (Array.isArray(result)) {
                        let res = state.serviceTypeData?.filter((item: any) => !new Set([...result]).has(item.id))
                        state.serviceTypeData = res;
                        let pagination = [...res.slice((state.page * state.pageLimit) - state.pageLimit, state.page * state.pageLimit)]
                        if (pagination?.length == 0) {
                            state.page = 1
                        }
                    } else {
                        let res = state.serviceTypeData?.filter((item: any) => item.id != result)
                        state.serviceTypeData = res;
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
            .addCase(isServiceTypeDelete?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isServiceTypeAddExcelFile.pending, (state, action) => {
                state.sendLoading = true;

            })
            .addCase(isServiceTypeAddExcelFile.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    state.serviceTypeData = result
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                }
                state.sendLoading = false;
            })
            .addCase(isServiceTypeAddExcelFile?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isServiceTypeEdit.pending, (state, action) => {
                state.sendLoading = true;
            })
            .addCase(isServiceTypeEdit.fulfilled, (state, { payload }) => {
                const { result } = payload
                if (result) {
                    const { data, update } = result;
                    state.isSuccessApi = true;
                    state.serviceTypeData = state.serviceTypeData.map((item: any) => item.id === +result.id ? result : item)
                    Toast.fire("Ma'lumot tahrirlandi!", '', 'success')
                    state.hasError = {}
                }
                state.update = result
                state.sendLoading = false;
            })
            .addCase(isServiceTypeEdit?.rejected, (state, action) => {
                state.sendLoading = false;
                state.hasError = action.payload
                Toast.fire(action?.error?.message, '', 'error')
            })
            .addCase(payAllServiceType.pending, (state, action) => {
                state.sendLoading = true;
            })
            .addCase(payAllServiceType.fulfilled, (state, { payload }) => {
                const { result } = payload
                if (result) {
                    state.isSuccessApi = true;
                    const { data } = result
                    if (result?.data) {
                        state.serviceTypeData = state.serviceTypeData.map((item: any) => item.id === +data.id ? data : item)
                    } else {
                        state.serviceTypeData = state.serviceTypeData.map((item: any) => item.id === +result.id ? result : item)
                    }
                    console.log('data', data);
                    state.update = result
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                    state.hasError = {}
                    state.findData = result
                }
                state.sendLoading = false;
            })
            .addCase(payAllServiceType?.rejected, (state, action) => {
                state.sendLoading = false;
                state.hasError = action.payload
                Toast.fire(action?.error?.message, '', 'error')
            })
    }
})
export const { isUpdateClearServiceType, isServiceTypePageLimit, isServiceTypeCurrentPage, isServiceTypeDefaultApi, isAddAllServiceType, isDeleteServiceType, isAddServiceType, isEditServiceType } = ServiceTypeReducer.actions

export default ServiceTypeReducer.reducer