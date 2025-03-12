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


export const isKlinkaGet = createAsyncThunk(
    "klinka/klinkaget",
    async (_: any, { rejectWithValue }) => {

        try {
            const response = await axios.get(
                `klinka${_}`
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
export const isKlinkaAddExcelFile = createAsyncThunk(
    "klinka/klinkaget/isKlinkaAddExcelFile",
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "klinka/excel" + data
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
export const isKlinkaAdd = createAsyncThunk(
    "klinkaadd",
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
                `klinka` + query, formData
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



export const isKlinkaEdit = createAsyncThunk("klinkaedit",
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
            const response = await axios.post(
                "klinka/" + id + query,formData
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
export const payAllKlinka = createAsyncThunk("payAllKlinka",
    async (data: any, { rejectWithValue }) => {

        try {
            const { query, id } = data
            const response = await axios.post(
                "klinka/pay-all/" + id, query
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

export const isKlinkaDelete = createAsyncThunk("isKlinkaDelete",
    async (data: any, { rejectWithValue }) => {

        try {
            const { all, id } = data
            const response = await axios.delete(
                "/klinka/" + (all?.length ?? 0 > 0 ? JSON.stringify(all) : id)
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
    klinkaData: [],
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
export const KlinkaReducer = createSlice({
    name: 'klinka',
    initialState,
    reducers: {
        isAddKlinka: (state, { payload }) => {
            state.klinkaData = [...state.klinkaData, payload]
        },
        isKlinkaPageLimit: (state, { payload }) => {
            state.pageLimit = payload
        },
        isUpdateClearKlinka: (state) => {
            state.update = {}
        },
        isKlinkaCurrentPage: (state, { payload }) => {
            state.page = payload
        },
        isAddAllKlinka: (state, { payload }) => {
            state.klinkaData = payload
        },
        isDeleteKlinka: (state, { payload }) => {
            if (Array.isArray(payload)) {
                state.klinkaData = state.klinkaData.filter(({ id }: { id: number }) => !new Set([...payload]).has(id))
            }
            state.klinkaData = state.klinkaData.filter(({ id }: { id: number }) => id !== payload)
        },
        isEditKlinka: (state, { payload }) => {
            state.klinkaData = state.klinkaData.map((item: any) => item.id === +payload.id ? payload : item)
        },
        isKlinkaDefaultApi: (state) => {
            state.isSuccessApi = false;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(isKlinkaGet.pending, (state, action) => {
                state.isLoading = true;
                state.massage = {}
                state.klinkaData = []
            })
            .addCase(isKlinkaGet.fulfilled, (state, { payload
            }) => {
                const { result } = payload;
                if (result?.update) {
                    state.klinkaData = result?.data
                    state.update = result
                } else {
                    state.klinkaData = result
                }
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(isKlinkaGet?.rejected, (state, { payload }) => {
                state.massage = payload
                state.loading = false;
                state.isLoading = false;
                state.klinkaData = []
            })
            .addCase(isKlinkaAdd.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isKlinkaAdd.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    state.klinkaData = [...state.klinkaData, payload?.result]
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                    state.hasError = {}

                }
                state.sendLoading = false;
                state.isLoading = false;

            })
            .addCase(isKlinkaAdd?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                console.log(payload);
                const {message } = payload.errors
                
                Toast.fire(message ?? payload?.status, '', 'error')
            })
            .addCase(isKlinkaDelete.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isKlinkaDelete.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    const { data, update } = result;
                    state.isSuccessApi = true;
                    console.log('result', result);

                    state.update = { status: '', ...result }
                    if (Array.isArray(data)) {
                        let res = state.klinkaData?.filter((item: any) => !new Set([...data]).has(item.id))
                        state.klinkaData = res;
                        let pagination = [...res.slice((state.page * state.pageLimit) - state.pageLimit, state.page * state.pageLimit)]
                        if (pagination?.length == 0) {
                            state.page = 1
                        }
                    } else {
                        let res = state.klinkaData?.filter((item: any) => item.id != data)
                        state.klinkaData = res;
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
            .addCase(isKlinkaDelete?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isKlinkaAddExcelFile.pending, (state, action) => {
                state.sendLoading = true;

            })
            .addCase(isKlinkaAddExcelFile.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    state.klinkaData = result
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                }
                state.sendLoading = false;
            })
            .addCase(isKlinkaAddExcelFile?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isKlinkaEdit.pending, (state, action) => {
                state.sendLoading = true;
            })
            .addCase(isKlinkaEdit.fulfilled, (state, { payload }) => {
                const { result } = payload
                if (result) {
                    const { data, update } = result;
                    state.isSuccessApi = true;
                    state.klinkaData = state.klinkaData.map((item: any) => item.id === +result.id ? result : item)
                    Toast.fire("Ma'lumot tahrirlandi!", '', 'success')
                    state.hasError = {}
                }
                state.update = result
                state.sendLoading = false;
            })
            .addCase(isKlinkaEdit?.rejected, (state, {payload}:{payload:any}) => {
                state.sendLoading = false;
                state.hasError = payload
                const {message } = payload.errors
                Toast.fire(message ?? payload?.status, '', 'error')
            })
            .addCase(payAllKlinka.pending, (state, action) => {
                state.sendLoading = true;
            })
            .addCase(payAllKlinka.fulfilled, (state, { payload }) => {
                const { result } = payload
                if (result) {
                    state.isSuccessApi = true;
                    const { data } = result
                    if (result?.data) {
                        state.klinkaData = state.klinkaData.map((item: any) => item.id === +data.id ? data : item)
                    } else {
                        state.klinkaData = state.klinkaData.map((item: any) => item.id === +result.id ? result : item)
                    }
                    console.log('data', data);
                    state.update = result
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                    state.hasError = {}
                    state.findData = result
                }
                state.sendLoading = false;
            })
            .addCase(payAllKlinka?.rejected, (state, action) => {
                state.sendLoading = false;
                state.hasError = action.payload
                Toast.fire(action?.error?.message, '', 'error')
            })
    }
})
export const { isUpdateClearKlinka, isKlinkaPageLimit, isKlinkaCurrentPage, isKlinkaDefaultApi, isAddAllKlinka, isDeleteKlinka, isAddKlinka, isEditKlinka } = KlinkaReducer.actions

export default KlinkaReducer.reducer