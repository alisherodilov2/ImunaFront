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


export const isDoctorTemplateGet = createAsyncThunk(
    "doctorTemplate/doctorTemplateget",
    async (_: any, { rejectWithValue }) => {

        try {
            const response = await axios.get(
                `doctor-template${_}`
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
export const isDoctorTemplateAddExcelFile = createAsyncThunk(
    "doctorTemplate/doctorTemplateget/isDoctorTemplateAddExcelFile",
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "doctorTemplate/excel" + data
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
export const isDoctorTemplateAdd = createAsyncThunk(
    "doctorTemplateadd",
    async (data: any, { rejectWithValue }) => {

        try {

            const { query, file } = data
            let formData = new FormData();
            formData.append('name', query.name);
            formData.append('data', query.data);
            
            const response = await axios.post(
                `doctor-template`, formData
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



export const isDoctorTemplateEdit = createAsyncThunk("doctorTemplateedit",
    async (data: any, { rejectWithValue }) => {
        try {
            const { query, id } = data
            let formData = new FormData();
            formData.append('name', query.name);
            formData.append('data', query.data);
            const response = await axios.post(
                "doctor-template/" + id ,formData
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
export const payAllDoctorTemplate = createAsyncThunk("payAllDoctorTemplate",
    async (data: any, { rejectWithValue }) => {

        try {
            const { query, id } = data
            const response = await axios.post(
                "doctorTemplate/pay-all/" + id, query
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

export const isDoctorTemplateDelete = createAsyncThunk("isDoctorTemplateDelete",
    async (data: any, { rejectWithValue }) => {

        try {
            const { all, id } = data
            const response = await axios.delete(
                "/doctor-template/" + (all?.length ?? 0 > 0 ? JSON.stringify(all) : id)
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
    doctorTemplateData: [],
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
export const DoctorTemplateReducer = createSlice({
    name: 'doctorTemplate',
    initialState,
    reducers: {
        isAddDoctorTemplate: (state, { payload }) => {
            state.doctorTemplateData = [...state.doctorTemplateData, payload]
        },
        isDoctorTemplatePageLimit: (state, { payload }) => {
            state.pageLimit = payload
        },
        isUpdateClearDoctorTemplate: (state) => {
            state.update = {}
        },
        isDoctorTemplateCurrentPage: (state, { payload }) => {
            state.page = payload
        },
        isAddAllDoctorTemplate: (state, { payload }) => {
            state.doctorTemplateData = payload
        },
        isDeleteDoctorTemplate: (state, { payload }) => {
            if (Array.isArray(payload)) {
                state.doctorTemplateData = state.doctorTemplateData.filter(({ id }: { id: number }) => !new Set([...payload]).has(id))
            }
            state.doctorTemplateData = state.doctorTemplateData.filter(({ id }: { id: number }) => id !== payload)
        },
        isEditDoctorTemplate: (state, { payload }) => {
            state.doctorTemplateData = state.doctorTemplateData.map((item: any) => item.id === +payload.id ? payload : item)
        },
        isDoctorTemplateDefaultApi: (state) => {
            state.isSuccessApi = false;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(isDoctorTemplateGet.pending, (state, action) => {
                state.isLoading = true;
                state.massage = {}
                state.doctorTemplateData = []
            })
            .addCase(isDoctorTemplateGet.fulfilled, (state, { payload
            }) => {
                const { result } = payload;
                if (result?.update) {
                    state.doctorTemplateData = result?.data
                    state.update = result
                } else {
                    state.doctorTemplateData = result
                }
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(isDoctorTemplateGet?.rejected, (state, { payload }) => {
                state.massage = payload
                state.loading = false;
                state.isLoading = false;
                state.doctorTemplateData = []
            })
            .addCase(isDoctorTemplateAdd.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isDoctorTemplateAdd.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    state.doctorTemplateData = [...state.doctorTemplateData, payload?.result]
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                    state.hasError = {}

                }
                state.sendLoading = false;
                state.isLoading = false;

            })
            .addCase(isDoctorTemplateAdd?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isDoctorTemplateDelete.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isDoctorTemplateDelete.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    if (Array.isArray(result)) {
                        let res = state.doctorTemplateData?.filter((item: any) => !new Set([...result]).has(item.id))
                        state.doctorTemplateData = res;
                        let pagination = [...res.slice((state.page * state.pageLimit) - state.pageLimit, state.page * state.pageLimit)]
                        if (pagination?.length == 0) {
                            state.page = 1
                        }
                    } else {
                        let res = state.doctorTemplateData?.filter((item: any) => item.id != result)
                        state.doctorTemplateData = res;
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
            .addCase(isDoctorTemplateDelete?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isDoctorTemplateAddExcelFile.pending, (state, action) => {
                state.sendLoading = true;

            })
            .addCase(isDoctorTemplateAddExcelFile.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    state.doctorTemplateData = result
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                }
                state.sendLoading = false;
            })
            .addCase(isDoctorTemplateAddExcelFile?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isDoctorTemplateEdit.pending, (state, action) => {
                state.sendLoading = true;
            })
            .addCase(isDoctorTemplateEdit.fulfilled, (state, { payload }) => {
                const { result } = payload
                if (result) {
                    const { data, update } = result;
                    state.isSuccessApi = true;
                    state.doctorTemplateData = state.doctorTemplateData.map((item: any) => item.id === +result.id ? result : item)
                    Toast.fire("Ma'lumot tahrirlandi!", '', 'success')
                    state.hasError = {}
                }
                state.update = result
                state.sendLoading = false;
            })
            .addCase(isDoctorTemplateEdit?.rejected, (state, action) => {
                state.sendLoading = false;
                state.hasError = action.payload
                Toast.fire(action?.error?.message, '', 'error')
            })
            .addCase(payAllDoctorTemplate.pending, (state, action) => {
                state.sendLoading = true;
            })
            .addCase(payAllDoctorTemplate.fulfilled, (state, { payload }) => {
                const { result } = payload
                if (result) {
                    state.isSuccessApi = true;
                    const { data } = result
                    if (result?.data) {
                        state.doctorTemplateData = state.doctorTemplateData.map((item: any) => item.id === +data.id ? data : item)
                    } else {
                        state.doctorTemplateData = state.doctorTemplateData.map((item: any) => item.id === +result.id ? result : item)
                    }
                    console.log('data', data);
                    state.update = result
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                    state.hasError = {}
                    state.findData = result
                }
                state.sendLoading = false;
            })
            .addCase(payAllDoctorTemplate?.rejected, (state, action) => {
                state.sendLoading = false;
                state.hasError = action.payload
                Toast.fire(action?.error?.message, '', 'error')
            })
    }
})
export const { isUpdateClearDoctorTemplate, isDoctorTemplatePageLimit, isDoctorTemplateCurrentPage, isDoctorTemplateDefaultApi, isAddAllDoctorTemplate, isDeleteDoctorTemplate, isAddDoctorTemplate, isEditDoctorTemplate } = DoctorTemplateReducer.actions

export default DoctorTemplateReducer.reducer