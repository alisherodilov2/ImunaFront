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


export const isReferringDoctorGet = createAsyncThunk(
    "referringDoctor/referringDoctorget",
    async (_: any, { rejectWithValue }) => {

        try {
            const response = await axios.get(
                `referring-doctor${_}`
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
export const isReferringDoctorAddExcelFile = createAsyncThunk(
    "referringDoctor/referringDoctorget/isReferringDoctorAddExcelFile",
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "referring-doctor/excel", data
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
export const isReferringDoctorAdd = createAsyncThunk(
    "referringDoctoradd",
    async (data: any, { rejectWithValue }) => {

        try {

            const { query, file } = data
            let formData = new FormData();
            if (file?.logo_photo !== null) {
                formData.append('logo_photo', file?.logo_photo);
            }
            if (file?.user_photo !== null) {
                formData.append('user_photo', file?.user_photo);
            }
            if (file?.blank_file !== null) {
                formData.append('blank_file', file?.blank_file);
            }
            const response = await axios.post(
                `referring-doctor` + query, formData
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



export const isReferringDoctorEdit = createAsyncThunk("referringDoctoredit",
    async (data: any, { rejectWithValue }) => {

        try {
            const { query, id, file } = data
            let formData = new FormData();

            if (file?.logo_photo !== null) {
                formData.append('logo_photo', file?.logo_photo);
            }
            if (file?.user_photo !== null) {
                formData.append('user_photo', file?.user_photo);
            }
            if (file?.blank_file !== null) {
                formData.append('blank_file', file?.blank_file);
            }
            const response = await axios.put(
                "referring-doctor/" + id + query, formData
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
export const payAllReferringDoctor = createAsyncThunk("payAllReferringDoctor",
    async (data: any, { rejectWithValue }) => {

        try {
            const { query, id } = data
            const response = await axios.post(
                "referringDoctor/pay-all/" + id, query
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

export const isReferringDoctorDelete = createAsyncThunk("isReferringDoctorDelete",
    async (data: any, { rejectWithValue }) => {

        try {
            const { all, id } = data
            const response = await axios.delete(
                "/referring-doctor/" + (all?.length ?? 0 > 0 ? JSON.stringify(all) : id)
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
    referringDoctorData: {
        data: []
    },
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
export const ReferringDoctorReducer = createSlice({
    name: 'referringDoctor',
    initialState,
    reducers: {
        isAddReferringDoctor: (state, { payload }) => {
            state.referringDoctorData = [...state.referringDoctorData, payload]
        },
        isEditReferringDoctorBalance: (state, { payload }) => {
            state.referringDoctorData.data = state.referringDoctorData.data?.map((item: any) => item.id === +payload.id ? {
                ...item,
                referring_doctor_balance: payload?.referring_doctor_balance
            } : item)
        },
        isReferringDoctorPageLimit: (state, { payload }) => {
            state.pageLimit = payload
        },
        isUpdateClearReferringDoctor: (state) => {
            state.update = {}
        },
        isReferringDoctorCurrentPage: (state, { payload }) => {
            state.page = payload
        },
        isAddAllReferringDoctor: (state, { payload }) => {
            state.referringDoctorData = payload
        },
        isDeleteReferringDoctor: (state, { payload }) => {
            if (Array.isArray(payload)) {
                state.referringDoctorData = state.referringDoctorData.filter(({ id }: { id: number }) => !new Set([...payload]).has(id))
            }
            state.referringDoctorData = state.referringDoctorData.filter(({ id }: { id: number }) => id !== payload)
        },
        isEditReferringDoctor: (state, { payload }) => {
            state.referringDoctorData = state.referringDoctorData.map((item: any) => item.id === +payload.id ? payload : item)
        },
        isReferringDoctorDefaultApi: (state) => {
            state.isSuccessApi = false;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(isReferringDoctorGet.pending, (state, action) => {
                state.isLoading = true;
                state.massage = {}
                state.referringDoctorData = []
            })
            .addCase(isReferringDoctorGet.fulfilled, (state, { payload
            }) => {
                const { result } = payload;
                if (result?.update) {
                    state.referringDoctorData = result?.data
                    state.update = result
                } else {
                    state.referringDoctorData = result
                }
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(isReferringDoctorGet?.rejected, (state, { payload }) => {
                state.massage = payload
                state.loading = false;
                state.isLoading = false;
                state.referringDoctorData = []
            })
            .addCase(isReferringDoctorAdd.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isReferringDoctorAdd.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    state.referringDoctorData.data = [...(state?.referringDoctorData?.data ?? []), payload?.result]
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                    state.hasError = {}

                }
                state.sendLoading = false;
                state.isLoading = false;

            })
            .addCase(isReferringDoctorAdd?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                console.log(payload);
                const { message } = payload.errors

                Toast.fire(message ?? payload?.status, '', 'error')
            })
            .addCase(isReferringDoctorDelete.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isReferringDoctorDelete.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    const { data, update } = result;
                    state.isSuccessApi = true;
                    console.log('result', result);

                    state.update = { status: '', ...result }
                    // if (Array.isArray(data)) {
                    //     let res = state.referringDoctorData.data?.filter((item: any) => !new Set([...data]).has(item.id))
                    //     state.referringDoctorData.data = res;
                    //     let pagination = [...res.slice((state.page * state.pageLimit) - state.pageLimit, state.page * state.pageLimit)]
                    //     if (pagination?.length == 0) {
                    //         state.page = 1
                    //     }
                    // } else {
                    //     let res = state.referringDoctorData.data?.filter((item: any) => item.id != result)
                    //     state.referringDoctorData.data = res;
                    //     let pagination = [...res.slice((state.page * state.pageLimit) - state.pageLimit, state.page * state.pageLimit)]
                    //     if (pagination?.length == 0) {
                    //         state.page = 1
                    //     }

                    // }
                    state.referringDoctorData.data = state.referringDoctorData.data?.filter((item: any) => item.id != result)
                    Toast.fire("Ma'lumot o'chirildi!", '', 'success')
                }
                state.sendLoading = false;
                state.isLoading = false;

            })
            .addCase(isReferringDoctorDelete?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isReferringDoctorAddExcelFile.pending, (state, action) => {
                state.sendLoading = true;

            })
            .addCase(isReferringDoctorAddExcelFile.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    state.referringDoctorData = result
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                }
                state.sendLoading = false;
            })
            .addCase(isReferringDoctorAddExcelFile?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isReferringDoctorEdit.pending, (state, action) => {
                state.sendLoading = true;
            })
            .addCase(isReferringDoctorEdit.fulfilled, (state, { payload }) => {
                const { result } = payload
                if (result) {
                    const { data, update } = result;
                    state.isSuccessApi = true;
                    state.referringDoctorData.data = state.referringDoctorData.data.map((item: any) => item.id === +result.id ? result : item)
                    Toast.fire("Ma'lumot tahrirlandi!", '', 'success')
                    state.hasError = {}
                }
                state.update = result
                state.sendLoading = false;
            })
            .addCase(isReferringDoctorEdit?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                const { message } = payload.errors
                Toast.fire(message ?? payload?.status, '', 'error')
            })
            .addCase(payAllReferringDoctor.pending, (state, action) => {
                state.sendLoading = true;
            })
            .addCase(payAllReferringDoctor.fulfilled, (state, { payload }) => {
                const { result } = payload
                if (result) {
                    state.isSuccessApi = true;
                    const { data } = result
                    if (result?.data) {
                        state.referringDoctorData.data = state.referringDoctorData.data.map((item: any) => item.id === +data.id ? data : item)
                    } else {
                        state.referringDoctorData.data = state.referringDoctorData.data.map((item: any) => item.id === +result.id ? result : item)
                    }
                    console.log('data', data);
                    state.update = result
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                    state.hasError = {}
                    state.findData = result
                }
                state.sendLoading = false;
            })
            .addCase(payAllReferringDoctor?.rejected, (state, action) => {
                state.sendLoading = false;
                state.hasError = action.payload
                Toast.fire(action?.error?.message, '', 'error')
            })
    }
})
export const { isUpdateClearReferringDoctor, isReferringDoctorPageLimit, isReferringDoctorCurrentPage, isReferringDoctorDefaultApi, isAddAllReferringDoctor, isDeleteReferringDoctor, isAddReferringDoctor, isEditReferringDoctor, isEditReferringDoctorBalance } = ReferringDoctorReducer.actions

export default ReferringDoctorReducer.reducer