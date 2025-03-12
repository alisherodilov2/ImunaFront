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


export const isProductGet = createAsyncThunk(
    "product/productget",
    async (_: any, { rejectWithValue }) => {

        try {
            const response = await axios.get(
                `product${_}`
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
export const isProductAddExcelFile = createAsyncThunk(
    "product/productget/isProductAddExcelFile",
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "product/excel" + data
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
export const isProductAdd = createAsyncThunk(
    "productadd",
    async (data: any, { rejectWithValue }) => {

        try {

            const { query, file } = data
            let formData = new FormData();
            if (file !== null) {
                formData.append('photo', file);
            }
            const response = await axios.post(
                `product` + query, formData
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



export const isProductEdit = createAsyncThunk("productedit",
    async (data: any, { rejectWithValue }) => {
        try {
            const { query, id } = data
            const response = await axios.put(
                "product/" + id + query
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
export const payAllProduct = createAsyncThunk("payAllProduct",
    async (data: any, { rejectWithValue }) => {

        try {
            const { query, id } = data
            const response = await axios.post(
                "product/pay-all/" + id, query
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

export const isProductDelete = createAsyncThunk("isProductDelete",
    async (data: any, { rejectWithValue }) => {

        try {
            const { all, id } = data
            const response = await axios.delete(
                "/product/" + (all?.length ?? 0 > 0 ? JSON.stringify(all) : id)
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
    productData: [],
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
export const ProductReducer = createSlice({
    name: 'product',
    initialState,
    reducers: {
        isAddProduct: (state, { payload }) => {
            state.productData = [...state.productData, payload]
        },

        isProductPageLimit: (state, { payload }) => {
            state.pageLimit = payload
        },
        isUpdateClearProduct: (state) => {
            state.update = {}
        },
        isProductCurrentPage: (state, { payload }) => {
            state.page = payload
        },
        isAddAllProduct: (state, { payload }) => {
            state.productData = payload
        },
        isDeleteProduct: (state, { payload }) => {
            if (Array.isArray(payload)) {
                state.productData = state.productData.filter(({ id }: { id: number }) => !new Set([...payload]).has(id))
            }
            state.productData = state.productData.filter(({ id }: { id: number }) => id !== payload)
        },
        isEditProduct: (state, { payload }) => {
            state.productData = state.productData.map((item: any) => item.id === +payload.id ? payload : item)
        },
        isEditProductCount: (state, { payload }) => {
            state.productData = state.productData.map((item: any) => item.id === +payload.id ? {
                ...item,
                use_qty: payload.use_qty + item.use_qty
            } : item)
        },
        isProductDefaultApi: (state) => {
            state.isSuccessApi = false;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(isProductGet.pending, (state, action) => {
                state.isLoading = true;
                state.massage = {}
                state.productData = []
            })
            .addCase(isProductGet.fulfilled, (state, { payload
            }) => {
                const { result } = payload;
                if (result?.update) {
                    state.productData = result?.data
                    state.update = result
                } else {
                    state.productData = result
                }
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(isProductGet?.rejected, (state, { payload }) => {
                state.massage = payload
                state.loading = false;
                state.isLoading = false;
                state.productData = []
            })
            .addCase(isProductAdd.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isProductAdd.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    state.productData = [...state.productData, payload?.result]
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                    state.hasError = {}

                }
                state.sendLoading = false;
                state.isLoading = false;

            })
            .addCase(isProductAdd?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isProductDelete.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isProductDelete.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    if (Array.isArray(result)) {
                        let res = state.productData?.filter((item: any) => !new Set([...result]).has(item.id))
                        state.productData = res;
                        let pagination = [...res.slice((state.page * state.pageLimit) - state.pageLimit, state.page * state.pageLimit)]
                        if (pagination?.length == 0) {
                            state.page = 1
                        }
                    } else {
                        let res = state.productData?.filter((item: any) => item.id != result)
                        state.productData = res;
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
            .addCase(isProductDelete?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isProductAddExcelFile.pending, (state, action) => {
                state.sendLoading = true;

            })
            .addCase(isProductAddExcelFile.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    state.productData = result
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                }
                state.sendLoading = false;
            })
            .addCase(isProductAddExcelFile?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isProductEdit.pending, (state, action) => {
                state.sendLoading = true;
            })
            .addCase(isProductEdit.fulfilled, (state, { payload }) => {
                const { result } = payload
                if (result) {
                    const { data, update } = result;
                    state.isSuccessApi = true;
                    state.productData = state.productData.map((item: any) => item.id === +result.id ? result : item)
                    Toast.fire("Ma'lumot tahrirlandi!", '', 'success')
                    state.hasError = {}
                }
                state.update = result
                state.sendLoading = false;
            })
            .addCase(isProductEdit?.rejected, (state, action) => {
                state.sendLoading = false;
                state.hasError = action.payload
                Toast.fire(action?.error?.message, '', 'error')
            })
            .addCase(payAllProduct.pending, (state, action) => {
                state.sendLoading = true;
            })
            .addCase(payAllProduct.fulfilled, (state, { payload }) => {
                const { result } = payload
                if (result) {
                    state.isSuccessApi = true;
                    const { data } = result
                    if (result?.data) {
                        state.productData = state.productData.map((item: any) => item.id === +data.id ? data : item)
                    } else {
                        state.productData = state.productData.map((item: any) => item.id === +result.id ? result : item)
                    }
                    console.log('data', data);
                    state.update = result
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                    state.hasError = {}
                    state.findData = result
                }
                state.sendLoading = false;
            })
            .addCase(payAllProduct?.rejected, (state, action) => {
                state.sendLoading = false;
                state.hasError = action.payload
                Toast.fire(action?.error?.message, '', 'error')
            })
    }
})
export const { isEditProductCount, isUpdateClearProduct, isProductPageLimit, isProductCurrentPage, isProductDefaultApi, isAddAllProduct, isDeleteProduct, isAddProduct, isEditProduct } = ProductReducer.actions

export default ProductReducer.reducer