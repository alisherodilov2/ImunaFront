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


export const isTemplateCategoryGet = createAsyncThunk(
    "templateCategory/template-categoryget",
    async (_: any, { rejectWithValue }) => {

        try {
            const response = await axios.get(
                `template-category${_}`
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
export const isTemplateCategoryAddExcelFile = createAsyncThunk(
    "templateCategory/template-categoryget/isTemplateCategoryAddExcelFile",
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "template-category/excel" + data
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
export const isTemplateCategoryAdd = createAsyncThunk(
    "templateCategoryadd",
    async (data: any, { rejectWithValue }) => {

        try {

            const { query, file } = data
            let formData = new FormData();
            if (file !== null) {
                formData.append('photo', file);
            }
            const response = await axios.post(
                `template-category` + query, formData
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



export const isTemplateCategoryEdit = createAsyncThunk("templateCategoryedit",
    async (data: any, { rejectWithValue }) => {
        try {
            const { query, id } = data
            const response = await axios.put(
                "template-category/" + id + query
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
export const payAllTemplateCategory = createAsyncThunk("payAllTemplateCategory",
    async (data: any, { rejectWithValue }) => {

        try {
            const { query, id } = data
            const response = await axios.post(
                "template-category/pay-all/" + id, query
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

export const isTemplateCategoryDelete = createAsyncThunk("isTemplateCategoryDelete",
    async (data: any, { rejectWithValue }) => {

        try {
            const { all, id } = data
            const response = await axios.delete(
                "/template-category/" + (all?.length ?? 0 > 0 ? JSON.stringify(all) : id)
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
    templateCategoryData: [],
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
export const TemplateCategoryReducer = createSlice({
    name: 'templateCategory',
    initialState,
    reducers: {
        isAddTemplateCategory: (state, { payload }) => {
            state.templateCategoryData = [...state.templateCategoryData, payload]
        },
        isTemplateCategoryPageLimit: (state, { payload }) => {
            state.pageLimit = payload
        },
        isUpdateClearTemplateCategory: (state) => {
            state.update = {}
        },
        isTemplateCategoryCurrentPage: (state, { payload }) => {
            state.page = payload
        },
        isAddAllTemplateCategory: (state, { payload }) => {
            state.templateCategoryData = payload
        },
        isDeleteTemplateCategory: (state, { payload }) => {
            if (Array.isArray(payload)) {
                state.templateCategoryData = state.templateCategoryData.filter(({ id }: { id: number }) => !new Set([...payload]).has(id))
            }
            state.templateCategoryData = state.templateCategoryData.filter(({ id }: { id: number }) => id !== payload)
        },
        isEditTemplateCategory: (state, { payload }) => {
            state.templateCategoryData = state.templateCategoryData.map((item: any) => item.id === +payload.id ? payload : item)
        },
        isTemplateCategoryDefaultApi: (state) => {
            state.isSuccessApi = false;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(isTemplateCategoryGet.pending, (state, action) => {
                state.isLoading = true;
                state.massage = {}
                state.templateCategoryData = []
            })
            .addCase(isTemplateCategoryGet.fulfilled, (state, { payload
            }) => {
                const { result } = payload;
                if (result?.update) {
                    state.templateCategoryData = result?.data
                    state.update = result
                } else {
                    state.templateCategoryData = result
                }
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(isTemplateCategoryGet?.rejected, (state, { payload }) => {
                state.massage = payload
                state.loading = false;
                state.isLoading = false;
                state.templateCategoryData = []
            })
            .addCase(isTemplateCategoryAdd.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isTemplateCategoryAdd.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    state.templateCategoryData = [...state.templateCategoryData, payload?.result]
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                    state.hasError = {}

                }
                state.sendLoading = false;
                state.isLoading = false;

            })
            .addCase(isTemplateCategoryAdd?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isTemplateCategoryDelete.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isTemplateCategoryDelete.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    if (Array.isArray(result)) {
                        let res = state.templateCategoryData?.filter((item: any) => !new Set([...result]).has(item.id))
                        state.templateCategoryData = res;
                        let pagination = [...res.slice((state.page * state.pageLimit) - state.pageLimit, state.page * state.pageLimit)]
                        if (pagination?.length == 0) {
                            state.page = 1
                        }
                    } else {
                        let res = state.templateCategoryData?.filter((item: any) => item.id != result)
                        state.templateCategoryData = res;
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
            .addCase(isTemplateCategoryDelete?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isTemplateCategoryAddExcelFile.pending, (state, action) => {
                state.sendLoading = true;

            })
            .addCase(isTemplateCategoryAddExcelFile.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    state.templateCategoryData = result
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                }
                state.sendLoading = false;
            })
            .addCase(isTemplateCategoryAddExcelFile?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isTemplateCategoryEdit.pending, (state, action) => {
                state.sendLoading = true;
            })
            .addCase(isTemplateCategoryEdit.fulfilled, (state, { payload }) => {
                const { result } = payload
                if (result) {
                    const { data, update } = result;
                    state.isSuccessApi = true;
                    state.templateCategoryData = state.templateCategoryData.map((item: any) => item.id === +result.id ? result : item)
                    Toast.fire("Ma'lumot tahrirlandi!", '', 'success')
                    state.hasError = {}
                }
                state.update = result
                state.sendLoading = false;
            })
            .addCase(isTemplateCategoryEdit?.rejected, (state, action) => {
                state.sendLoading = false;
                state.hasError = action.payload
                Toast.fire(action?.error?.message, '', 'error')
            })
            .addCase(payAllTemplateCategory.pending, (state, action) => {
                state.sendLoading = true;
            })
            .addCase(payAllTemplateCategory.fulfilled, (state, { payload }) => {
                const { result } = payload
                if (result) {
                    state.isSuccessApi = true;
                    const { data } = result
                    if (result?.data) {
                        state.templateCategoryData = state.templateCategoryData.map((item: any) => item.id === +data.id ? data : item)
                    } else {
                        state.templateCategoryData = state.templateCategoryData.map((item: any) => item.id === +result.id ? result : item)
                    }
                    console.log('data', data);
                    state.update = result
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                    state.hasError = {}
                    state.findData = result
                }
                state.sendLoading = false;
            })
            .addCase(payAllTemplateCategory?.rejected, (state, action) => {
                state.sendLoading = false;
                state.hasError = action.payload
                Toast.fire(action?.error?.message, '', 'error')
            })
    }
})
export const { isUpdateClearTemplateCategory, isTemplateCategoryPageLimit, isTemplateCategoryCurrentPage, isTemplateCategoryDefaultApi, isAddAllTemplateCategory, isDeleteTemplateCategory, isAddTemplateCategory, isEditTemplateCategory } = TemplateCategoryReducer.actions

export default TemplateCategoryReducer.reducer