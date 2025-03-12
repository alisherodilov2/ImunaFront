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


export const isTemplateGet = createAsyncThunk(
    "template/templateget",
    async (_: any, { rejectWithValue }) => {

        try {
            const response = await axios.get(
                `template${_}`
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
export const isTemplateAddExcelFile = createAsyncThunk(
    "template/templateget/isTemplateAddExcelFile",
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "template/excel" + data
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
export const isTemplateAdd = createAsyncThunk(
    "templateadd",
    async (data: any, { rejectWithValue }) => {

        try {

            const { query, file } = data
            let formData = new FormData();
            for(let key in query) {
                formData.append(key, query[key]);
            }
            const response = await axios.post(
                `template`, formData
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



export const isTemplateEdit = createAsyncThunk("templateedit",
    async (data: any, { rejectWithValue }) => {

        try {
            const { query, id } = data
            let formData = new FormData();
            for(let key in query) {
                formData.append(key, query[key]);
            }
            const response = await axios.post(
                "template/" + id, formData
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
export const payAllTemplate = createAsyncThunk("payAllTemplate",
    async (data: any, { rejectWithValue }) => {

        try {
            const { query, id } = data
            const response = await axios.post(
                "template/pay-all/" + id, query
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

export const isTemplateDelete = createAsyncThunk("isTemplateDelete",
    async (data: any, { rejectWithValue }) => {

        try {
            const { all, id } = data
            const response = await axios.delete(
                "/template/" + (all?.length ?? 0 > 0 ? JSON.stringify(all) : id)
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
    templateData: [],
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
export const TemplateReducer = createSlice({
    name: 'template',
    initialState,
    reducers: {
        isAddTemplate: (state, { payload }) => {
            state.templateData = [...state.templateData, payload]
        },
        isTemplatePageLimit: (state, { payload }) => {
            state.pageLimit = payload
        },
        isUpdateClearTemplate: (state) => {
            state.update = {}
        },
        isTemplateCurrentPage: (state, { payload }) => {
            state.page = payload
        },
        isAddAllTemplate: (state, { payload }) => {
            state.templateData = payload
        },
        isDeleteTemplate: (state, { payload }) => {
            if (Array.isArray(payload)) {
                state.templateData = state.templateData.filter(({ id }: { id: number }) => !new Set([...payload]).has(id))
            }
            state.templateData = state.templateData.filter(({ id }: { id: number }) => id !== payload)
        },
        isEditTemplate: (state, { payload }) => {
            state.templateData = state.templateData.map((item: any) => item.id === +payload.id ? payload : item)
        },
        isTemplateDefaultApi: (state) => {
            state.isSuccessApi = false;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(isTemplateGet.pending, (state, action) => {
                state.isLoading = true;
                state.massage = {}
                state.templateData = []
            })
            .addCase(isTemplateGet.fulfilled, (state, { payload
            }) => {
                const { result } = payload;
                if (result?.update) {
                    state.templateData = result?.data
                    state.update = result
                } else {
                    state.templateData = result
                }
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(isTemplateGet?.rejected, (state, { payload }) => {
                state.massage = payload
                state.loading = false;
                state.isLoading = false;
                state.templateData = []
            })
            .addCase(isTemplateAdd.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isTemplateAdd.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    state.templateData = [...state.templateData, payload?.result]
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                    state.hasError = {}

                }
                state.sendLoading = false;
                state.isLoading = false;

            })
            .addCase(isTemplateAdd?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isTemplateDelete.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isTemplateDelete.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    if (Array.isArray(result)) {
                        let res = state.templateData?.filter((item: any) => !new Set([...result]).has(item.id))
                        state.templateData = res;
                        let pagination = [...res.slice((state.page * state.pageLimit) - state.pageLimit, state.page * state.pageLimit)]
                        if (pagination?.length == 0) {
                            state.page = 1
                        }
                    } else {
                        let res = state.templateData?.filter((item: any) => item.id != result)
                        state.templateData = res;
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
            .addCase(isTemplateDelete?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isTemplateAddExcelFile.pending, (state, action) => {
                state.sendLoading = true;

            })
            .addCase(isTemplateAddExcelFile.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    state.templateData = result
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                }
                state.sendLoading = false;
            })
            .addCase(isTemplateAddExcelFile?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isTemplateEdit.pending, (state, action) => {
                state.sendLoading = true;
            })
            .addCase(isTemplateEdit.fulfilled, (state, { payload }) => {
                const { result } = payload
                if (result) {
                    const { data, update } = result;
                    state.isSuccessApi = true;
                    state.templateData = state.templateData.map((item: any) => item.id === +result.id ? result : item)
                    Toast.fire("Ma'lumot tahrirlandi!", '', 'success')
                    state.hasError = {}
                }
                state.update = result
                state.sendLoading = false;
            })
            .addCase(isTemplateEdit?.rejected, (state, action) => {
                state.sendLoading = false;
                state.hasError = action.payload
                Toast.fire(action?.error?.message, '', 'error')
            })
            .addCase(payAllTemplate.pending, (state, action) => {
                state.sendLoading = true;
            })
            .addCase(payAllTemplate.fulfilled, (state, { payload }) => {
                const { result } = payload
                if (result) {
                    state.isSuccessApi = true;
                    const { data } = result
                    if (result?.data) {
                        state.templateData = state.templateData.map((item: any) => item.id === +data.id ? data : item)
                    } else {
                        state.templateData = state.templateData.map((item: any) => item.id === +result.id ? result : item)
                    }
                    console.log('data', data);
                    state.update = result
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                    state.hasError = {}
                    state.findData = result
                }
                state.sendLoading = false;
            })
            .addCase(payAllTemplate?.rejected, (state, action) => {
                state.sendLoading = false;
                state.hasError = action.payload
                Toast.fire(action?.error?.message, '', 'error')
            })
    }
})
export const { isUpdateClearTemplate, isTemplatePageLimit, isTemplateCurrentPage, isTemplateDefaultApi, isAddAllTemplate, isDeleteTemplate, isAddTemplate, isEditTemplate } = TemplateReducer.actions

export default TemplateReducer.reducer