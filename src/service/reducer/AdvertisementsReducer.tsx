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


export const isAdvertisementsGet = createAsyncThunk(
    "advertisements/advertisementsget",
    async (_: any, { rejectWithValue }) => {

        try {
            const response = await axios.get(
                `advertisements${_}`
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
export const isAdvertisementsAddExcelFile = createAsyncThunk(
    "advertisements/advertisementsget/isAdvertisementsAddExcelFile",
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "advertisements/excel" + data
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
export const isAdvertisementsAdd = createAsyncThunk(
    "advertisementsadd",
    async (data: any, { rejectWithValue }) => {

        try {

            const { query, file } = data
            let formData = new FormData();
            if (file !== null) {
                formData.append('photo', file);
            }
            const response = await axios.post(
                `advertisements` + query, formData
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



export const isAdvertisementsEdit = createAsyncThunk("advertisementsedit",
    async (data: any, { rejectWithValue }) => {
        try {
            const { query, id } = data
            const response = await axios.put(
                "advertisements/" + id + query
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
export const payAllAdvertisements = createAsyncThunk("payAllAdvertisements",
    async (data: any, { rejectWithValue }) => {

        try {
            const { query, id } = data
            const response = await axios.post(
                "advertisements/pay-all/" + id, query
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

export const isAdvertisementsDelete = createAsyncThunk("isAdvertisementsDelete",
    async (data: any, { rejectWithValue }) => {

        try {
            const { all, id } = data
            const response = await axios.delete(
                "/advertisements/" + (all?.length ?? 0 > 0 ? JSON.stringify(all) : id)
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
    advertisementsData: [],
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
export const AdvertisementsReducer = createSlice({
    name: 'advertisements',
    initialState,
    reducers: {
        isAddAdvertisements: (state, { payload }) => {
            state.advertisementsData = [...state.advertisementsData, payload]
        },
        isAdvertisementsPageLimit: (state, { payload }) => {
            state.pageLimit = payload
        },
        isUpdateClearAdvertisements: (state) => {
            state.update = {}
        },
        isAdvertisementsCurrentPage: (state, { payload }) => {
            state.page = payload
        },
        isAddAllAdvertisements: (state, { payload }) => {
            state.advertisementsData = payload
        },
        isDeleteAdvertisements: (state, { payload }) => {
            if (Array.isArray(payload)) {
                state.advertisementsData = state.advertisementsData.filter(({ id }: { id: number }) => !new Set([...payload]).has(id))
            }
            state.advertisementsData = state.advertisementsData.filter(({ id }: { id: number }) => id !== payload)
        },
        isEditAdvertisements: (state, { payload }) => {
            state.advertisementsData = state.advertisementsData.map((item: any) => item.id === +payload.id ? payload : item)
        },
        isAdvertisementsDefaultApi: (state) => {
            state.isSuccessApi = false;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(isAdvertisementsGet.pending, (state, action) => {
                state.isLoading = true;
                state.massage = {}
                state.advertisementsData = []
            })
            .addCase(isAdvertisementsGet.fulfilled, (state, { payload
            }) => {
                const { result } = payload;
                if (result?.update) {
                    state.advertisementsData = result?.data
                    state.update = result
                } else {
                    state.advertisementsData = result
                }
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(isAdvertisementsGet?.rejected, (state, { payload }) => {
                state.massage = payload
                state.loading = false;
                state.isLoading = false;
                state.advertisementsData = []
            })
            .addCase(isAdvertisementsAdd.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isAdvertisementsAdd.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    state.advertisementsData = [...state.advertisementsData, payload?.result]
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                    state.hasError = {}

                }
                state.sendLoading = false;
                state.isLoading = false;

            })
            .addCase(isAdvertisementsAdd?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isAdvertisementsDelete.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isAdvertisementsDelete.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    if (Array.isArray(result)) {
                        let res = state.advertisementsData?.filter((item: any) => !new Set([...result]).has(item.id))
                        state.advertisementsData = res;
                        let pagination = [...res.slice((state.page * state.pageLimit) - state.pageLimit, state.page * state.pageLimit)]
                        if (pagination?.length == 0) {
                            state.page = 1
                        }
                    } else {
                        let res = state.advertisementsData?.filter((item: any) => item.id != result)
                        state.advertisementsData = res;
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
            .addCase(isAdvertisementsDelete?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isAdvertisementsAddExcelFile.pending, (state, action) => {
                state.sendLoading = true;

            })
            .addCase(isAdvertisementsAddExcelFile.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    state.advertisementsData = result
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                }
                state.sendLoading = false;
            })
            .addCase(isAdvertisementsAddExcelFile?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isAdvertisementsEdit.pending, (state, action) => {
                state.sendLoading = true;
            })
            .addCase(isAdvertisementsEdit.fulfilled, (state, { payload }) => {
                const { result } = payload
                if (result) {
                    const { data, update } = result;
                    state.isSuccessApi = true;
                    state.advertisementsData = state.advertisementsData.map((item: any) => item.id === +result.id ? result : item)
                    Toast.fire("Ma'lumot tahrirlandi!", '', 'success')
                    state.hasError = {}
                }
                state.update = result
                state.sendLoading = false;
            })
            .addCase(isAdvertisementsEdit?.rejected, (state, action) => {
                state.sendLoading = false;
                state.hasError = action.payload
                Toast.fire(action?.error?.message, '', 'error')
            })
            .addCase(payAllAdvertisements.pending, (state, action) => {
                state.sendLoading = true;
            })
            .addCase(payAllAdvertisements.fulfilled, (state, { payload }) => {
                const { result } = payload
                if (result) {
                    state.isSuccessApi = true;
                    const { data } = result
                    if (result?.data) {
                        state.advertisementsData = state.advertisementsData.map((item: any) => item.id === +data.id ? data : item)
                    } else {
                        state.advertisementsData = state.advertisementsData.map((item: any) => item.id === +result.id ? result : item)
                    }
                    console.log('data', data);
                    state.update = result
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                    state.hasError = {}
                    state.findData = result
                }
                state.sendLoading = false;
            })
            .addCase(payAllAdvertisements?.rejected, (state, action) => {
                state.sendLoading = false;
                state.hasError = action.payload
                Toast.fire(action?.error?.message, '', 'error')
            })
    }
})
export const { isUpdateClearAdvertisements, isAdvertisementsPageLimit, isAdvertisementsCurrentPage, isAdvertisementsDefaultApi, isAddAllAdvertisements, isDeleteAdvertisements, isAddAdvertisements, isEditAdvertisements } = AdvertisementsReducer.actions

export default AdvertisementsReducer.reducer