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


export const isTreatmentGet = createAsyncThunk(
    "treatment/treatmentget",
    async (_: any, { rejectWithValue }) => {

        try {
            const response = await axios.get(
                `treatment${_}`
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
export const isTreatmentAddExcelFile = createAsyncThunk(
    "treatment/treatmentget/isTreatmentAddExcelFile",
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "treatment/excel" + data
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
export const isTreatmentAdd = createAsyncThunk(
    "treatmentadd",
    async (data: any, { rejectWithValue }) => {

        try {

            const { query, file } = data
            let formData = new FormData();
            for(let key in query) {
                formData.append(key, query[key]);
            }
            const response = await axios.post(
                `treatment` ,formData
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



export const isTreatmentEdit = createAsyncThunk("treatmentedit",
    async (data: any, { rejectWithValue }) => {
        try {
            const { query, id } = data
            let formData = new FormData();
            for(let key in query) {
                formData.append(key, query[key]);
            }
            const response = await axios.post(
                "treatment/" + id ,formData
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
export const payAllTreatment = createAsyncThunk("payAllTreatment",
    async (data: any, { rejectWithValue }) => {

        try {
            const { query, id } = data
            const response = await axios.post(
                "treatment/pay-all/" + id, query
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

export const isTreatmentDelete = createAsyncThunk("isTreatmentDelete",
    async (data: any, { rejectWithValue }) => {

        try {
            const { all, id } = data
            const response = await axios.delete(
                "/treatment/" + (all?.length ?? 0 > 0 ? JSON.stringify(all) : id)
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
    treatmentData: [],
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
export const TreatmentReducer = createSlice({
    name: 'treatment',
    initialState,
    reducers: {
        isAddTreatment: (state, { payload }) => {
            state.treatmentData = [...state.treatmentData, payload]
        },
        isTreatmentPageLimit: (state, { payload }) => {
            state.pageLimit = payload
        },
        isUpdateClearTreatment: (state) => {
            state.update = {}
        },
        isTreatmentCurrentPage: (state, { payload }) => {
            state.page = payload
        },
        isAddAllTreatment: (state, { payload }) => {
            state.treatmentData = payload
        },
        isDeleteTreatment: (state, { payload }) => {
            if (Array.isArray(payload)) {
                state.treatmentData = state.treatmentData.filter(({ id }: { id: number }) => !new Set([...payload]).has(id))
            }
            state.treatmentData = state.treatmentData.filter(({ id }: { id: number }) => id !== payload)
        },
        isEditTreatment: (state, { payload }) => {
            state.treatmentData = state.treatmentData.map((item: any) => item.id === +payload.id ? payload : item)
        },
        isTreatmentDefaultApi: (state) => {
            state.isSuccessApi = false;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(isTreatmentGet.pending, (state, action) => {
                state.isLoading = true;
                state.massage = {}
                state.treatmentData = []
            })
            .addCase(isTreatmentGet.fulfilled, (state, { payload
            }) => {
                const { result } = payload;
                if (result?.update) {
                    state.treatmentData = result?.data
                    state.update = result
                } else {
                    state.treatmentData = result
                }
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(isTreatmentGet?.rejected, (state, { payload }) => {
                state.massage = payload
                state.loading = false;
                state.isLoading = false;
                state.treatmentData = []
            })
            .addCase(isTreatmentAdd.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isTreatmentAdd.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    state.treatmentData = [...state.treatmentData, payload?.result]
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                    state.hasError = {}

                }
                state.sendLoading = false;
                state.isLoading = false;

            })
            .addCase(isTreatmentAdd?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isTreatmentDelete.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isTreatmentDelete.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    if (Array.isArray(result)) {
                        let res = state.treatmentData?.filter((item: any) => !new Set([...result]).has(item.id))
                        state.treatmentData = res;
                        let pagination = [...res.slice((state.page * state.pageLimit) - state.pageLimit, state.page * state.pageLimit)]
                        if (pagination?.length == 0) {
                            state.page = 1
                        }
                    } else {
                        let res = state.treatmentData?.filter((item: any) => item.id != result)
                        state.treatmentData = res;
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
            .addCase(isTreatmentDelete?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isTreatmentAddExcelFile.pending, (state, action) => {
                state.sendLoading = true;

            })
            .addCase(isTreatmentAddExcelFile.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    state.treatmentData = result
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                }
                state.sendLoading = false;
            })
            .addCase(isTreatmentAddExcelFile?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isTreatmentEdit.pending, (state, action) => {
                state.sendLoading = true;
            })
            .addCase(isTreatmentEdit.fulfilled, (state, { payload }) => {
                const { result } = payload
                if (result) {
                    const { data, update } = result;
                    state.isSuccessApi = true;
                    state.treatmentData = state.treatmentData.map((item: any) => item.id === +result.id ? result : item)
                    Toast.fire("Ma'lumot tahrirlandi!", '', 'success')
                    state.hasError = {}
                }
                state.update = result
                state.sendLoading = false;
            })
            .addCase(isTreatmentEdit?.rejected, (state, action) => {
                state.sendLoading = false;
                state.hasError = action.payload
                Toast.fire(action?.error?.message, '', 'error')
            })
            .addCase(payAllTreatment.pending, (state, action) => {
                state.sendLoading = true;
            })
            .addCase(payAllTreatment.fulfilled, (state, { payload }) => {
                const { result } = payload
                if (result) {
                    state.isSuccessApi = true;
                    const { data } = result
                    if (result?.data) {
                        state.treatmentData = state.treatmentData.map((item: any) => item.id === +data.id ? data : item)
                    } else {
                        state.treatmentData = state.treatmentData.map((item: any) => item.id === +result.id ? result : item)
                    }
                    console.log('data', data);
                    state.update = result
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                    state.hasError = {}
                    state.findData = result
                }
                state.sendLoading = false;
            })
            .addCase(payAllTreatment?.rejected, (state, action) => {
                state.sendLoading = false;
                state.hasError = action.payload
                Toast.fire(action?.error?.message, '', 'error')
            })
    }
})
export const { isUpdateClearTreatment, isTreatmentPageLimit, isTreatmentCurrentPage, isTreatmentDefaultApi, isAddAllTreatment, isDeleteTreatment, isAddTreatment, isEditTreatment } = TreatmentReducer.actions

export default TreatmentReducer.reducer