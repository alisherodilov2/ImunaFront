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


export const isPatientComplaintGet = createAsyncThunk(
    "patientComplaint/patientComplaintget",
    async (_: any, { rejectWithValue }) => {

        try {
            const response = await axios.get(
                `patient-complaint${_}`
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
export const isPatientComplaintAddExcelFile = createAsyncThunk(
    "patientComplaint/patientComplaintget/isPatientComplaintAddExcelFile",
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "patient-complaint/excel" + data
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
export const isPatientComplaintAdd = createAsyncThunk(
    "patientComplaintadd",
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
                `patient-complaint`, formData
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



export const isPatientComplaintEdit = createAsyncThunk("patientComplaintedit",
    async (data: any, { rejectWithValue }) => {

        try {
            const { query, id } = data
            let formData = new FormData();
            for (let key in query) {
                formData.append(key, query[key]);
            }
            const response = await axios.post(
                "patient-complaint/" + id, formData);
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
export const payAllPatientComplaint = createAsyncThunk("payAllPatientComplaint",
    async (data: any, { rejectWithValue }) => {

        try {
            const { query, id } = data
            const response = await axios.post(
                "patient-complaint/pay-all/" + id, query
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

export const isPatientComplaintDelete = createAsyncThunk("isPatientComplaintDelete",
    async (data: any, { rejectWithValue }) => {

        try {
            const { all, id } = data
            const response = await axios.delete(
                "/patient-complaint/" + (all?.length ?? 0 > 0 ? JSON.stringify(all) : id)
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
    patientComplaintData: [],
    loading: false,
    sendLoading: false,
    isLoading: false,
    hasError: {},
    massage: {},
    update: {},
    complaintTarget: {},
    findData: {},
    isSuccessApi: false,
    page: 1,
    pageLimit: 50,
}
export const PatientComplaintReducer = createSlice({
    name: 'patientComplaint',
    initialState,
    reducers: {
        isAddPatientComplaint: (state, { payload }) => {
            state.patientComplaintData = [...state.patientComplaintData, payload]
        },
        isPatientComplaintPageLimit: (state, { payload }) => {
            state.pageLimit = payload
        },
        isComplaintTarget: (state, { payload }) => {
            state.complaintTarget = payload
        },
        isUpdateClearPatientComplaint: (state) => {
            state.update = {}
        },
        isPatientComplaintCurrentPage: (state, { payload }) => {
            state.page = payload
        },
        isAddAllPatientComplaint: (state, { payload }) => {
            state.patientComplaintData = payload
        },
        isDeletePatientComplaint: (state, { payload }) => {
            if (Array.isArray(payload)) {
                state.patientComplaintData = state.patientComplaintData.filter(({ id }: { id: number }) => !new Set([...payload]).has(id))
            }
            state.patientComplaintData = state.patientComplaintData.filter(({ id }: { id: number }) => id !== payload)
        },
        isEditPatientComplaint: (state, { payload }) => {
            state.patientComplaintData = state.patientComplaintData.map((item: any) => item.id === +payload.id ? payload : item)
        },
        isPatientComplaintDefaultApi: (state) => {
            state.isSuccessApi = false;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(isPatientComplaintGet.pending, (state, action) => {
                state.isLoading = true;
                state.massage = {}
                state.patientComplaintData = []
            })
            .addCase(isPatientComplaintGet.fulfilled, (state, { payload
            }) => {
                const { result } = payload;
                if (result?.update) {
                    state.patientComplaintData = result?.data
                    state.update = result
                } else {
                    state.patientComplaintData = result
                }
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(isPatientComplaintGet?.rejected, (state, { payload }) => {
                state.massage = payload
                state.loading = false;
                state.isLoading = false;
                state.patientComplaintData = []
            })
            .addCase(isPatientComplaintAdd.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isPatientComplaintAdd.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {

                    state.complaintTarget = payload?.result;
                    state.isSuccessApi = true;
                    state.patientComplaintData = [...state.patientComplaintData, payload?.result]
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                    state.hasError = {}

                }
                state.sendLoading = false;
                state.isLoading = false;

            })
            .addCase(isPatientComplaintAdd?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isPatientComplaintDelete.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isPatientComplaintDelete.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    if (Array.isArray(result)) {
                        let res = state.patientComplaintData?.filter((item: any) => !new Set([...result]).has(item.id))
                        state.patientComplaintData = res;
                        let pagination = [...res.slice((state.page * state.pageLimit) - state.pageLimit, state.page * state.pageLimit)]
                        if (pagination?.length == 0) {
                            state.page = 1
                        }
                    } else {
                        let res = state.patientComplaintData?.filter((item: any) => item.id != result)
                        state.patientComplaintData = res;
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
            .addCase(isPatientComplaintDelete?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isPatientComplaintAddExcelFile.pending, (state, action) => {
                state.sendLoading = true;

            })
            .addCase(isPatientComplaintAddExcelFile.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    state.patientComplaintData = result
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                }
                state.sendLoading = false;
            })
            .addCase(isPatientComplaintAddExcelFile?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isPatientComplaintEdit.pending, (state, action) => {
                state.sendLoading = true;
            })
            .addCase(isPatientComplaintEdit.fulfilled, (state, { payload }) => {
                const { result } = payload
                if (result) {
                    const { data, update } = result;
                    state.isSuccessApi = true;
                    state.patientComplaintData = state.patientComplaintData.map((item: any) => item.id === +result.id ? result : item)
                    Toast.fire("Ma'lumot tahrirlandi!", '', 'success')
                    state.hasError = {}
                }
                state.update = result
                state.sendLoading = false;
            })
            .addCase(isPatientComplaintEdit?.rejected, (state, action) => {
                state.sendLoading = false;
                state.hasError = action.payload
                Toast.fire(action?.error?.message, '', 'error')
            })
            .addCase(payAllPatientComplaint.pending, (state, action) => {
                state.sendLoading = true;
            })
            .addCase(payAllPatientComplaint.fulfilled, (state, { payload }) => {
                const { result } = payload
                if (result) {
                    state.isSuccessApi = true;
                    const { data } = result
                    if (result?.data) {
                        state.patientComplaintData = state.patientComplaintData.map((item: any) => item.id === +data.id ? data : item)
                    } else {
                        state.patientComplaintData = state.patientComplaintData.map((item: any) => item.id === +result.id ? result : item)
                    }
                    console.log('data', data);
                    state.update = result
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                    state.hasError = {}
                    state.findData = result
                }
                state.sendLoading = false;
            })
            .addCase(payAllPatientComplaint?.rejected, (state, action) => {
                state.sendLoading = false;
                state.hasError = action.payload
                Toast.fire(action?.error?.message, '', 'error')
            })
    }
})
export const { isComplaintTarget, isUpdateClearPatientComplaint, isPatientComplaintPageLimit, isPatientComplaintCurrentPage, isPatientComplaintDefaultApi, isAddAllPatientComplaint, isDeletePatientComplaint, isAddPatientComplaint, isEditPatientComplaint } = PatientComplaintReducer.actions

export default PatientComplaintReducer.reducer