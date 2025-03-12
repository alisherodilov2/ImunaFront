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


export const isUnityGet = createAsyncThunk(
    "unity/unityget",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                "unity"
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
export const isUnityAddExcelFile = createAsyncThunk(
    "unity/unityget/isUnityAddExcelFile",
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "unity/excel" + data
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
export const isUnityAdd = createAsyncThunk(
    "unityadd",
    async (data: any, { rejectWithValue }) => {

        try {

            const { query, file } = data
            let formData = new FormData();
            if (file !== null) {
                formData.append('photo', file);
            }
            const response = await axios.post(
                `unity` + query, formData
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



export const isUnityEdit = createAsyncThunk("unityedit",
    async (data: any, { rejectWithValue }) => {

        try {
            const { query, id } = data
            const response = await axios.put(
                "unity/" + id + query
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

export const isUnityDelete = createAsyncThunk("isUnityDelete",
    async (data: any, { rejectWithValue }) => {

        try {
            const { all, id } = data
            const response = await axios.delete(
                "/unity/" + (all?.length ?? 0 > 0 ? JSON.stringify(all) : id)
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
    unityData: [],
    loading: false,
    sendLoading: false,
    isLoading: false,
    hasError: {},
    massage: {},
    isSuccessApi: false,
    page: 1,
    pageLimit: 50,
}
export const UnityReducer = createSlice({
    name: 'unity',
    initialState,
    reducers: {
        isAddUnity: (state, { payload }) => {
            state.unityData = [...state.unityData, payload]
        },
        isUnityPageLimit: (state, { payload }) => {
            state.pageLimit = payload
        },
        isUnityCurrentPage: (state, { payload }) => {
            state.page = payload
        },
        isAddAllUnity: (state, { payload }) => {
            state.unityData = payload
        },
        isDeleteUnity: (state, { payload }) => {
            if (Array.isArray(payload)) {
                state.unityData = state.unityData.filter(({ id }: { id: number }) => !new Set([...payload]).has(id))
            }
            state.unityData = state.unityData.filter(({ id }: { id: number }) => id !== payload)
        },
        isEditUnity: (state, { payload }) => {
            state.unityData = state.unityData.map((item: any) => item.id === +payload.id ? payload : item)
        },
        isUnityDefaultApi: (state) => {
            state.isSuccessApi = false;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(isUnityGet.pending, (state, action) => {
                state.isLoading = true;
                state.massage = {}
                state.unityData = []
            })
            .addCase(isUnityGet.fulfilled, (state, { payload
            }) => {
                state.unityData = payload?.result
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(isUnityGet?.rejected, (state, { payload }) => {
                state.massage = payload
                state.loading = false;
                state.isLoading = false;
                state.unityData = []
            })
            .addCase(isUnityAdd.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isUnityAdd.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    state.unityData = [...state.unityData, payload?.result]
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                    state.hasError = {}

                }
                state.sendLoading = false;
                state.isLoading = false;

            })
            .addCase(isUnityAdd?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isUnityDelete.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isUnityDelete.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    if (Array.isArray(result)) {
                        let res = state.unityData?.filter((item: any) => !new Set([...result]).has(item.id))
                        state.unityData = res;
                        let pagination = [...res.slice((state.page * state.pageLimit) - state.pageLimit, state.page * state.pageLimit)]
                        if (pagination?.length == 0) {
                            state.page = 1
                        }
                    } else {
                        let res = state.unityData?.filter((item: any) => item.id != result)
                        state.unityData = res;
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
            .addCase(isUnityDelete?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isUnityAddExcelFile.pending, (state, action) => {
                state.sendLoading = true;

            })
            .addCase(isUnityAddExcelFile.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    state.unityData = result
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                }
                state.sendLoading = false;
            })
            .addCase(isUnityAddExcelFile?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isUnityEdit.pending, (state, action) => {
                state.sendLoading = true;
            })
            .addCase(isUnityEdit.fulfilled, (state, { payload }) => {
                const { result } = payload
                if (result) {
                    state.isSuccessApi = true;
                    state.unityData = state.unityData.map((item: any) => item.id === +result.id ? result : item)
                    Toast.fire("Ma'lumot tahrirlandi!", '', 'success')
                    state.hasError = {}

                }
                state.sendLoading = false;
            })
            .addCase(isUnityEdit?.rejected, (state, action) => {
                state.sendLoading = false;
                state.hasError = action.payload
                Toast.fire(action?.error?.message, '', 'error')
            })
    }
})
export const { isUnityPageLimit, isUnityCurrentPage, isUnityDefaultApi, isAddAllUnity, isDeleteUnity, isAddUnity, isEditUnity } = UnityReducer.actions

export default UnityReducer.reducer