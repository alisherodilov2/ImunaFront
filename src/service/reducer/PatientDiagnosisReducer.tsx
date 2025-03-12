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


export const isPatientDiagnosisGet = createAsyncThunk(
    "patientDiagnosis/patientDiagnosisget",
    async (_: any, { rejectWithValue }) => {

        try {
            const response = await axios.get(
                `patient-diagnosis${_}`
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
export const isPatientDiagnosisAddExcelFile = createAsyncThunk(
    "patientDiagnosis/patientDiagnosisget/isPatientDiagnosisAddExcelFile",
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "patient-diagnosis/excel" + data
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
export const isPatientDiagnosisAdd = createAsyncThunk(
    "patientDiagnosisadd",
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
                `patient-diagnosis`, formData
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



export const isPatientDiagnosisEdit = createAsyncThunk("patientDiagnosisedit",
    async (data: any, { rejectWithValue }) => {

        try {
            const { query, id } = data
            let formData = new FormData();
            for (let key in query) {
                formData.append(key, query[key]);
            }
            const response = await axios.post(
                "patient-diagnosis/" + id, formData);
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
export const payAllPatientDiagnosis = createAsyncThunk("payAllPatientDiagnosis",
    async (data: any, { rejectWithValue }) => {

        try {
            const { query, id } = data
            const response = await axios.post(
                "patient-diagnosis/pay-all/" + id, query
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

export const isPatientDiagnosisDelete = createAsyncThunk("isPatientDiagnosisDelete",
    async (data: any, { rejectWithValue }) => {

        try {
            const { all, id } = data
            const response = await axios.delete(
                "/patient-diagnosis/" + (all?.length ?? 0 > 0 ? JSON.stringify(all) : id)
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
    patientDiagnosisData: [],
    loading: false,
    sendLoading: false,
    isLoading: false,
    hasError: {},
    diagnosisTarget: {},
    massage: {},
    update: {},
    findData: {},
    isSuccessApi: false,
    page: 1,
    pageLimit: 50,
}
export const PatientDiagnosisReducer = createSlice({
    name: 'patientDiagnosis',
    initialState,
    reducers: {
        isAddPatientDiagnosis: (state, { payload }) => {
            state.patientDiagnosisData = [...state.patientDiagnosisData, payload]
        },
        isDiagnosisTarget: (state, { payload }) => {
            state.diagnosisTarget = payload
        },
        isPatientDiagnosisPageLimit: (state, { payload }) => {
            state.pageLimit = payload
        },
        isUpdateClearPatientDiagnosis: (state) => {
            state.update = {}
        },
        isPatientDiagnosisCurrentPage: (state, { payload }) => {
            state.page = payload
        },
        isAddAllPatientDiagnosis: (state, { payload }) => {
            state.patientDiagnosisData = payload
        },
        isDeletePatientDiagnosis: (state, { payload }) => {
            if (Array.isArray(payload)) {
                state.patientDiagnosisData = state.patientDiagnosisData.filter(({ id }: { id: number }) => !new Set([...payload]).has(id))
            }
            state.patientDiagnosisData = state.patientDiagnosisData.filter(({ id }: { id: number }) => id !== payload)
        },
        isEditPatientDiagnosis: (state, { payload }) => {
            state.patientDiagnosisData = state.patientDiagnosisData.map((item: any) => item.id === +payload.id ? payload : item)
        },
        isPatientDiagnosisDefaultApi: (state) => {
            state.isSuccessApi = false;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(isPatientDiagnosisGet.pending, (state, action) => {
                state.isLoading = true;
                state.massage = {}
                state.patientDiagnosisData = []
            })
            .addCase(isPatientDiagnosisGet.fulfilled, (state, { payload
            }) => {
                const { result } = payload;
                if (result?.update) {
                    state.patientDiagnosisData = result?.data
                    state.update = result
                } else {
                    state.patientDiagnosisData = result
                }
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(isPatientDiagnosisGet?.rejected, (state, { payload }) => {
                state.massage = payload
                state.loading = false;
                state.isLoading = false;
                state.patientDiagnosisData = []
            })
            .addCase(isPatientDiagnosisAdd.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isPatientDiagnosisAdd.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.diagnosisTarget = payload?.result;
                    state.isSuccessApi = true;
                    state.patientDiagnosisData = [...state.patientDiagnosisData, payload?.result]
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                    state.hasError = {}

                }
                state.sendLoading = false;
                state.isLoading = false;

            })
            .addCase(isPatientDiagnosisAdd?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isPatientDiagnosisDelete.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isPatientDiagnosisDelete.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    if (Array.isArray(result)) {
                        let res = state.patientDiagnosisData?.filter((item: any) => !new Set([...result]).has(item.id))
                        state.patientDiagnosisData = res;
                        let pagination = [...res.slice((state.page * state.pageLimit) - state.pageLimit, state.page * state.pageLimit)]
                        if (pagination?.length == 0) {
                            state.page = 1
                        }
                    } else {
                        let res = state.patientDiagnosisData?.filter((item: any) => item.id != result)
                        state.patientDiagnosisData = res;
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
            .addCase(isPatientDiagnosisDelete?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isPatientDiagnosisAddExcelFile.pending, (state, action) => {
                state.sendLoading = true;

            })
            .addCase(isPatientDiagnosisAddExcelFile.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    state.patientDiagnosisData = result
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                }
                state.sendLoading = false;
            })
            .addCase(isPatientDiagnosisAddExcelFile?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isPatientDiagnosisEdit.pending, (state, action) => {
                state.sendLoading = true;
            })
            .addCase(isPatientDiagnosisEdit.fulfilled, (state, { payload }) => {
                const { result } = payload
                if (result) {
                    const { data, update } = result;
                    state.isSuccessApi = true;
                    state.patientDiagnosisData = state.patientDiagnosisData.map((item: any) => item.id === +result.id ? result : item)
                    Toast.fire("Ma'lumot tahrirlandi!", '', 'success')
                    state.hasError = {}
                }
                state.update = result
                state.sendLoading = false;
            })
            .addCase(isPatientDiagnosisEdit?.rejected, (state, action) => {
                state.sendLoading = false;
                state.hasError = action.payload
                Toast.fire(action?.error?.message, '', 'error')
            })
            .addCase(payAllPatientDiagnosis.pending, (state, action) => {
                state.sendLoading = true;
            })
            .addCase(payAllPatientDiagnosis.fulfilled, (state, { payload }) => {
                const { result } = payload
                if (result) {
                    state.isSuccessApi = true;
                    const { data } = result
                    if (result?.data) {
                        state.patientDiagnosisData = state.patientDiagnosisData.map((item: any) => item.id === +data.id ? data : item)
                    } else {
                        state.patientDiagnosisData = state.patientDiagnosisData.map((item: any) => item.id === +result.id ? result : item)
                    }
                    console.log('data', data);
                    state.update = result
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                    state.hasError = {}
                    state.findData = result
                }
                state.sendLoading = false;
            })
            .addCase(payAllPatientDiagnosis?.rejected, (state, action) => {
                state.sendLoading = false;
                state.hasError = action.payload
                Toast.fire(action?.error?.message, '', 'error')
            })
    }
})
export const { isDiagnosisTarget, isUpdateClearPatientDiagnosis, isPatientDiagnosisPageLimit, isPatientDiagnosisCurrentPage, isPatientDiagnosisDefaultApi, isAddAllPatientDiagnosis, isDeletePatientDiagnosis, isAddPatientDiagnosis, isEditPatientDiagnosis } = PatientDiagnosisReducer.actions

export default PatientDiagnosisReducer.reducer