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


export const isStatisticaGet = createAsyncThunk(
    "Statistica/statisticaget",
    async (_: any, { rejectWithValue }) => {

        try {
            const response = await axios.get(
                `statistica${_}`
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
export const isStatisticaAddExcelFile = createAsyncThunk(
    "Statistica/statisticaget/isStatisticaAddExcelFile",
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "Statistica/excel" + data
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
export const isStatisticaAdd = createAsyncThunk(
    "statisticaadd",
    async (data: any, { rejectWithValue }) => {

        try {

            const { query, file } = data
            let formData = new FormData();
            if (file !== null) {
                formData.append('photo', file);
            }
            const response = await axios.post(
                `Statistica` + query, formData
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



export const isStatisticaEdit = createAsyncThunk("statisticaedit",
    async (data: any, { rejectWithValue }) => {

        try {
            const { query, id } = data
            const response = await axios.put(
                "Statistica/" + id + query
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
export const payAllStatistica = createAsyncThunk("payAllStatistica",
    async (data: any, { rejectWithValue }) => {

        try {
            const { query, id } = data
            const response = await axios.post(
                "Statistica/pay-all/" + id, query
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

export const isStatisticaDelete = createAsyncThunk("isStatisticaDelete",
    async (data: any, { rejectWithValue }) => {

        try {
            const { all, id } = data
            const response = await axios.delete(
                "/Statistica/" + (all?.length ?? 0 > 0 ? JSON.stringify(all) : id)
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
    statisticaData: {},
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
export const StatisticaReducer = createSlice({
    name: 'Statistica',
    initialState,
    reducers: {
        isAddStatistica: (state, { payload }) => {
            state.statisticaData = [...state.statisticaData, payload]
        },
        isStatisticaPageLimit: (state, { payload }) => {
            state.pageLimit = payload
        },
        isUpdateClearStatistica: (state) => {
            state.update = {}
        },
        isStatisticaCurrentPage: (state, { payload }) => {
            state.page = payload
        },
        isAddAllStatistica: (state, { payload }) => {
            state.statisticaData = payload
        },
        isDeleteStatistica: (state, { payload }) => {
            if (Array.isArray(payload)) {
                state.statisticaData = state.statisticaData.filter(({ id }: { id: number }) => !new Set([...payload]).has(id))
            }
            state.statisticaData = state.statisticaData.filter(({ id }: { id: number }) => id !== payload)
        },
        isEditStatistica: (state, { payload }) => {
            state.statisticaData = state.statisticaData.map((item: any) => item.id === +payload.id ? payload : item)
        },
        isStatisticaDefaultApi: (state) => {
            state.isSuccessApi = false;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(isStatisticaGet.pending, (state, action) => {
                state.isLoading = true;
                state.massage = {}
                state.statisticaData = []
            })
            .addCase(isStatisticaGet.fulfilled, (state, { payload
            }) => {
                const { result } = payload;
                if (result?.update) {
                    state.statisticaData = result?.data
                    state.update = result
                } else {
                    state.statisticaData = result
                }
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(isStatisticaGet?.rejected, (state, { payload }) => {
                state.massage = payload
                state.loading = false;
                state.isLoading = false;
                state.statisticaData = []
            })
            .addCase(isStatisticaAdd.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isStatisticaAdd.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    state.statisticaData = [...state.statisticaData, payload?.result]
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                    state.hasError = {}

                }
                state.sendLoading = false;
                state.isLoading = false;

            })
            .addCase(isStatisticaAdd?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isStatisticaDelete.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isStatisticaDelete.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    if (Array.isArray(result)) {
                        let res = state.statisticaData?.filter((item: any) => !new Set([...result]).has(item.id))
                        state.statisticaData = res;
                        let pagination = [...res.slice((state.page * state.pageLimit) - state.pageLimit, state.page * state.pageLimit)]
                        if (pagination?.length == 0) {
                            state.page = 1
                        }
                    } else {
                        let res = state.statisticaData?.filter((item: any) => item.id != result)
                        state.statisticaData = res;
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
            .addCase(isStatisticaDelete?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isStatisticaAddExcelFile.pending, (state, action) => {
                state.sendLoading = true;

            })
            .addCase(isStatisticaAddExcelFile.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    state.statisticaData = result
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                }
                state.sendLoading = false;
            })
            .addCase(isStatisticaAddExcelFile?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isStatisticaEdit.pending, (state, action) => {
                state.sendLoading = true;
            })
            .addCase(isStatisticaEdit.fulfilled, (state, { payload }) => {
                const { result } = payload
                if (result) {
                    const { data, update } = result;
                    state.isSuccessApi = true;
                    state.statisticaData = state.statisticaData.map((item: any) => item.id === +result.id ? result : item)
                    Toast.fire("Ma'lumot tahrirlandi!", '', 'success')
                    state.hasError = {}
                }
                state.update = result
                state.sendLoading = false;
            })
            .addCase(isStatisticaEdit?.rejected, (state, action) => {
                state.sendLoading = false;
                state.hasError = action.payload
                Toast.fire(action?.error?.message, '', 'error')
            })
            .addCase(payAllStatistica.pending, (state, action) => {
                state.sendLoading = true;
            })
            .addCase(payAllStatistica.fulfilled, (state, { payload }) => {
                const { result } = payload
                if (result) {
                    state.isSuccessApi = true;
                    const { data } = result
                    if (result?.data) {
                        state.statisticaData = state.statisticaData.map((item: any) => item.id === +data.id ? data : item)
                    } else {
                        state.statisticaData = state.statisticaData.map((item: any) => item.id === +result.id ? result : item)
                    }
                    console.log('data', data);
                    state.update = result
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                    state.hasError = {}
                    state.findData = result
                }
                state.sendLoading = false;
            })
            .addCase(payAllStatistica?.rejected, (state, action) => {
                state.sendLoading = false;
                state.hasError = action.payload
                Toast.fire(action?.error?.message, '', 'error')
            })
    }
})
export const { isUpdateClearStatistica, isStatisticaPageLimit, isStatisticaCurrentPage, isStatisticaDefaultApi, isAddAllStatistica, isDeleteStatistica, isAddStatistica, isEditStatistica } = StatisticaReducer.actions

export default StatisticaReducer.reducer