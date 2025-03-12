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


export const isProductOrderGet = createAsyncThunk(
    "productOrder/productOrderget",
    async (_: any, { rejectWithValue }) => {

        try {
            const response = await axios.get(
                `product-order${_}`
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
export const isProductOrderAddExcelFile = createAsyncThunk(
    "productOrder/productOrderget/isProductOrderAddExcelFile",
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "productOrder/excel" + data
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
export const isProductOrderAdd = createAsyncThunk(
    "productOrderadd",
    async (data: any, { rejectWithValue }) => {

        try {

            const { query, file } = data
            let formData = new FormData();
            if (file !== null) {
                formData.append('photo', file);
            }
            const response = await axios.post(
                `product-order` + query, formData
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



export const isProductOrderEdit = createAsyncThunk("productOrderedit",
    async (data: any, { rejectWithValue }) => {
        try {
            const { query, id } = data
            const response = await axios.post(
                "product-order/" + id + query
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
export const payAllProductOrder = createAsyncThunk("payAllProductOrder",
    async (data: any, { rejectWithValue }) => {

        try {
            const { query, id } = data
            const response = await axios.post(
                "productOrder/pay-all/" + id, query
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

export const isProductOrderDelete = createAsyncThunk("isProductOrderDelete",
    async (data: any, { rejectWithValue }) => {

        try {
            const { all, id } = data
            const response = await axios.delete(
                "/product-order/" + (all?.length ?? 0 > 0 ? JSON.stringify(all) : id)
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
    productOrderData: [],
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
export const ProductOrderReducer = createSlice({
    name: 'productOrder',
    initialState,
    reducers: {
        isAddProductOrder: (state, { payload }) => {
            state.productOrderData = [...state.productOrderData, payload]
        },
        isProductOrderPageLimit: (state, { payload }) => {
            state.pageLimit = payload
        },
        isUpdateClearProductOrder: (state) => {
            state.update = {}
        },
        isProductOrderCurrentPage: (state, { payload }) => {
            state.page = payload
        },
        isAddAllProductOrder: (state, { payload }) => {
            state.productOrderData = payload
        },
        isDeleteProductOrder: (state, { payload }) => {
            if (Array.isArray(payload)) {
                state.productOrderData = state.productOrderData.filter(({ id }: { id: number }) => !new Set([...payload]).has(id))
            }
            state.productOrderData = state.productOrderData.filter(({ id }: { id: number }) => id !== payload)
        },
        isEditProductOrder: (state, { payload }) => {
            state.productOrderData = state.productOrderData.map((item: any) => item.id === +payload.id ? payload : item)
        },
        isProductOrderDefaultApi: (state) => {
            state.isSuccessApi = false;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(isProductOrderGet.pending, (state, action) => {
                state.isLoading = true;
                state.massage = {}
                state.productOrderData = []
            })
            .addCase(isProductOrderGet.fulfilled, (state, { payload
            }) => {
                const { result } = payload;
                if (result?.update) {
                    state.productOrderData = result?.data
                    state.update = result
                } else {
                    state.productOrderData = result
                }
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(isProductOrderGet?.rejected, (state, { payload }) => {
                state.massage = payload
                state.loading = false;
                state.isLoading = false;
                state.productOrderData = []
            })
            .addCase(isProductOrderAdd.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isProductOrderAdd.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    state.productOrderData = [...state.productOrderData, payload?.result]
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                    state.hasError = {}

                }
                state.sendLoading = false;
                state.isLoading = false;

            })
            .addCase(isProductOrderAdd?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isProductOrderDelete.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isProductOrderDelete.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    if (Array.isArray(result)) {
                        let res = state.productOrderData?.filter((item: any) => !new Set([...result]).has(item.id))
                        state.productOrderData = res;
                        let pagination = [...res.slice((state.page * state.pageLimit) - state.pageLimit, state.page * state.pageLimit)]
                        if (pagination?.length == 0) {
                            state.page = 1
                        }
                    } else {
                        let res = state.productOrderData?.filter((item: any) => item.id != result)
                        state.productOrderData = res;
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
            .addCase(isProductOrderDelete?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isProductOrderAddExcelFile.pending, (state, action) => {
                state.sendLoading = true;

            })
            .addCase(isProductOrderAddExcelFile.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    state.productOrderData = result
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                }
                state.sendLoading = false;
            })
            .addCase(isProductOrderAddExcelFile?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isProductOrderEdit.pending, (state, action) => {
                state.sendLoading = true;
            })
            .addCase(isProductOrderEdit.fulfilled, (state, { payload }) => {
                const { result } = payload
                if (result) {
                    const { data, update } = result;
                    state.isSuccessApi = true;
                    state.productOrderData = state.productOrderData.map((item: any) => item.id === +result.id ? result : item)
                    Toast.fire("Ma'lumot tahrirlandi!", '', 'success')
                    state.hasError = {}
                }
                state.update = result
                state.sendLoading = false;
            })
            .addCase(isProductOrderEdit?.rejected, (state, action) => {
                state.sendLoading = false;
                state.hasError = action.payload
                Toast.fire(action?.error?.message, '', 'error')
            })
            .addCase(payAllProductOrder.pending, (state, action) => {
                state.sendLoading = true;
            })
            .addCase(payAllProductOrder.fulfilled, (state, { payload }) => {
                const { result } = payload
                if (result) {
                    state.isSuccessApi = true;
                    const { data } = result
                    if (result?.data) {
                        state.productOrderData = state.productOrderData.map((item: any) => item.id === +data.id ? data : item)
                    } else {
                        state.productOrderData = state.productOrderData.map((item: any) => item.id === +result.id ? result : item)
                    }
                    console.log('data', data);
                    state.update = result
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                    state.hasError = {}
                    state.findData = result
                }
                state.sendLoading = false;
            })
            .addCase(payAllProductOrder?.rejected, (state, action) => {
                state.sendLoading = false;
                state.hasError = action.payload
                Toast.fire(action?.error?.message, '', 'error')
            })
    }
})
export const { isUpdateClearProductOrder, isProductOrderPageLimit, isProductOrderCurrentPage, isProductOrderDefaultApi, isAddAllProductOrder, isDeleteProductOrder, isAddProductOrder, isEditProductOrder } = ProductOrderReducer.actions

export default ProductOrderReducer.reducer