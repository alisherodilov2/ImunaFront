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


export const isProductCategoryGet = createAsyncThunk(
    "productCategory/productCategoryget",
    async (_: any, { rejectWithValue }) => {

        try {
            const response = await axios.get(
                `product-category${_}`
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
export const isProductCategoryAddExcelFile = createAsyncThunk(
    "productCategory/productCategoryget/isProductCategoryAddExcelFile",
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "product-category/excel" + data
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
export const isProductCategoryAdd = createAsyncThunk(
    "productCategoryadd",
    async (data: any, { rejectWithValue }) => {

        try {

            const { query, file } = data
            let formData = new FormData();
            if (file !== null) {
                formData.append('photo', file);
            }
            const response = await axios.post(
                `product-category` + query, formData
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



export const isProductCategoryEdit = createAsyncThunk("productCategoryedit",
    async (data: any, { rejectWithValue }) => {
        try {
            const { query, id } = data
            const response = await axios.put(
                "product-category/" + id + query
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
export const payAllProductCategory = createAsyncThunk("payAllProductCategory",
    async (data: any, { rejectWithValue }) => {

        try {
            const { query, id } = data
            const response = await axios.post(
                "productCategory/pay-all/" + id, query
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

export const isProductCategoryDelete = createAsyncThunk("isProductCategoryDelete",
    async (data: any, { rejectWithValue }) => {

        try {
            const { all, id } = data
            const response = await axios.delete(
                "/product-category/" + (all?.length ?? 0 > 0 ? JSON.stringify(all) : id)
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
    productCategoryData: [],
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
export const ProductCategoryReducer = createSlice({
    name: 'productCategory',
    initialState,
    reducers: {
        isAddProductCategory: (state, { payload }) => {
            state.productCategoryData = [...state.productCategoryData, payload]
        },
        isProductCategoryPageLimit: (state, { payload }) => {
            state.pageLimit = payload
        },
        isUpdateClearProductCategory: (state) => {
            state.update = {}
        },
        isProductCategoryCurrentPage: (state, { payload }) => {
            state.page = payload
        },
        isAddAllProductCategory: (state, { payload }) => {
            state.productCategoryData = payload
        },
        isDeleteProductCategory: (state, { payload }) => {
            if (Array.isArray(payload)) {
                state.productCategoryData = state.productCategoryData.filter(({ id }: { id: number }) => !new Set([...payload]).has(id))
            }
            state.productCategoryData = state.productCategoryData.filter(({ id }: { id: number }) => id !== payload)
        },
        isEditProductCategory: (state, { payload }) => {
            state.productCategoryData = state.productCategoryData.map((item: any) => item.id === +payload.id ? payload : item)
        },
        isProductCategoryDefaultApi: (state) => {
            state.isSuccessApi = false;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(isProductCategoryGet.pending, (state, action) => {
                state.isLoading = true;
                state.massage = {}
                state.productCategoryData = []
            })
            .addCase(isProductCategoryGet.fulfilled, (state, { payload
            }) => {
                const { result } = payload;
                if (result?.update) {
                    state.productCategoryData = result?.data
                    state.update = result
                } else {
                    state.productCategoryData = result
                }
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(isProductCategoryGet?.rejected, (state, { payload }) => {
                state.massage = payload
                state.loading = false;
                state.isLoading = false;
                state.productCategoryData = []
            })
            .addCase(isProductCategoryAdd.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isProductCategoryAdd.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    state.productCategoryData = [...state.productCategoryData, payload?.result]
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                    state.hasError = {}

                }
                state.sendLoading = false;
                state.isLoading = false;

            })
            .addCase(isProductCategoryAdd?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isProductCategoryDelete.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isProductCategoryDelete.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    if (Array.isArray(result)) {
                        let res = state.productCategoryData?.filter((item: any) => !new Set([...result]).has(item.id))
                        state.productCategoryData = res;
                        let pagination = [...res.slice((state.page * state.pageLimit) - state.pageLimit, state.page * state.pageLimit)]
                        if (pagination?.length == 0) {
                            state.page = 1
                        }
                    } else {
                        let res = state.productCategoryData?.filter((item: any) => item.id != result)
                        state.productCategoryData = res;
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
            .addCase(isProductCategoryDelete?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isProductCategoryAddExcelFile.pending, (state, action) => {
                state.sendLoading = true;

            })
            .addCase(isProductCategoryAddExcelFile.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    state.productCategoryData = result
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                }
                state.sendLoading = false;
            })
            .addCase(isProductCategoryAddExcelFile?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isProductCategoryEdit.pending, (state, action) => {
                state.sendLoading = true;
            })
            .addCase(isProductCategoryEdit.fulfilled, (state, { payload }) => {
                const { result } = payload
                if (result) {
                    const { data, update } = result;
                    state.isSuccessApi = true;
                    state.productCategoryData = state.productCategoryData.map((item: any) => item.id === +result.id ? result : item)
                    Toast.fire("Ma'lumot tahrirlandi!", '', 'success')
                    state.hasError = {}
                }
                state.update = result
                state.sendLoading = false;
            })
            .addCase(isProductCategoryEdit?.rejected, (state, action) => {
                state.sendLoading = false;
                state.hasError = action.payload
                Toast.fire(action?.error?.message, '', 'error')
            })
            .addCase(payAllProductCategory.pending, (state, action) => {
                state.sendLoading = true;
            })
            .addCase(payAllProductCategory.fulfilled, (state, { payload }) => {
                const { result } = payload
                if (result) {
                    state.isSuccessApi = true;
                    const { data } = result
                    if (result?.data) {
                        state.productCategoryData = state.productCategoryData.map((item: any) => item.id === +data.id ? data : item)
                    } else {
                        state.productCategoryData = state.productCategoryData.map((item: any) => item.id === +result.id ? result : item)
                    }
                    console.log('data', data);
                    state.update = result
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                    state.hasError = {}
                    state.findData = result
                }
                state.sendLoading = false;
            })
            .addCase(payAllProductCategory?.rejected, (state, action) => {
                state.sendLoading = false;
                state.hasError = action.payload
                Toast.fire(action?.error?.message, '', 'error')
            })
    }
})
export const { isUpdateClearProductCategory, isProductCategoryPageLimit, isProductCategoryCurrentPage, isProductCategoryDefaultApi, isAddAllProductCategory, isDeleteProductCategory, isAddProductCategory, isEditProductCategory } = ProductCategoryReducer.actions

export default ProductCategoryReducer.reducer