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


export const isProductReceptionGet = createAsyncThunk(
    "productReception/productReceptionget",
    async (_: any, { rejectWithValue }) => {

        try {
            const response = await axios.get(
                `product-reception${_}`
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
export const isProductReceptionAddExcelFile = createAsyncThunk(
    "productReception/productReceptionget/isProductReceptionAddExcelFile",
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "product-reception/excel" + data
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
export const isProductReceptionAdd = createAsyncThunk(
    "productReceptionadd",
    async (data: any, { rejectWithValue }) => {

        try {

            const { query, file } = data
            let formData = new FormData();
            if (file !== null) {
                formData.append('photo', file);
            }
            const response = await axios.post(
                `product-reception` + query, formData
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



export const isProductReceptionEdit = createAsyncThunk("productReceptionedit",
    async (data: any, { rejectWithValue }) => {
        try {
            const { query, id } = data
            const response = await axios.put(
                "product-reception/" + id + query
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
export const payAllProductReception = createAsyncThunk("payAllProductReception",
    async (data: any, { rejectWithValue }) => {

        try {
            const { query, id } = data
            const response = await axios.post(
                "product-reception/pay-all/" + id, query
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

export const isProductReceptionDelete = createAsyncThunk("isProductReceptionDelete",
    async (data: any, { rejectWithValue }) => {

        try {
            const { all, id } = data
            const response = await axios.delete(
                "/product-reception/" + (all?.length ?? 0 > 0 ? JSON.stringify(all) : id)
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
    productReceptionData: [],
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
export const ProductReceptionReducer = createSlice({
    name: 'productReception',
    initialState,
    reducers: {
        isAddProductReception: (state, { payload }) => {
            state.productReceptionData = [...state.productReceptionData, payload]
        },
        isProductReceptionChange: (state, { payload }) => {

            state.productReceptionData = state.productReceptionData.map((item: any) => {
                if (item.id === payload.id) {
                    return {
                        ...item,
                        total_price: payload?.product_reception_item?.reduce((a: any, b: any) => a + +b?.price * b.qty, 0),
                        product_qty: payload?.product_reception_item?.reduce((a: any, b: any) => a + +b?.qty, 0),
                        product_category_count: [...new Set(payload?.product_reception_item?.map((res: any) => res.product_category_id))].length

                    }

                }
                return item
            })
        },
        isProductReceptionPageLimit: (state, { payload }) => {
            state.pageLimit = payload
        },
        isUpdateClearProductReception: (state) => {
            state.update = {}
        },
        isProductReceptionCurrentPage: (state, { payload }) => {
            state.page = payload
        },
        isAddAllProductReception: (state, { payload }) => {
            state.productReceptionData = payload
        },
        isDeleteProductReception: (state, { payload }) => {
            if (Array.isArray(payload)) {
                state.productReceptionData = state.productReceptionData.filter(({ id }: { id: number }) => !new Set([...payload]).has(id))
            }
            state.productReceptionData = state.productReceptionData.filter(({ id }: { id: number }) => id !== payload)
        },
        isEditProductReception: (state, { payload }) => {
            state.productReceptionData = state.productReceptionData.map((item: any) => item.id === +payload.id ? payload : item)
        },
        isProductReceptionDefaultApi: (state) => {
            state.isSuccessApi = false;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(isProductReceptionGet.pending, (state, action) => {
                state.isLoading = true;
                state.massage = {}
                state.productReceptionData = []
            })
            .addCase(isProductReceptionGet.fulfilled, (state, { payload
            }) => {
                const { result } = payload;
                if (result?.update) {
                    state.productReceptionData = result?.data
                    state.update = result
                } else {
                    state.productReceptionData = result
                }
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(isProductReceptionGet?.rejected, (state, { payload }) => {
                state.massage = payload
                state.loading = false;
                state.isLoading = false;
                state.productReceptionData = []
            })
            .addCase(isProductReceptionAdd.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isProductReceptionAdd.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    let find = state.productReceptionData?.find((item: any) => item.id === result?.id)
                    if (find) {
                        state.productReceptionData = state.productReceptionData.map((item: any) => item.id === result?.id ? result : item)
                    } else {
                        state.productReceptionData = [...state.productReceptionData, payload?.result]
                    }
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                    state.hasError = {}

                }
                state.sendLoading = false;
                state.isLoading = false;

            })
            .addCase(isProductReceptionAdd?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isProductReceptionDelete.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isProductReceptionDelete.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    if (Array.isArray(result)) {
                        let res = state.productReceptionData?.filter((item: any) => !new Set([...result]).has(item.id))
                        state.productReceptionData = res;
                        let pagination = [...res.slice((state.page * state.pageLimit) - state.pageLimit, state.page * state.pageLimit)]
                        if (pagination?.length == 0) {
                            state.page = 1
                        }
                    } else {
                        let res = state.productReceptionData?.filter((item: any) => item.id != result)
                        state.productReceptionData = res;
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
            .addCase(isProductReceptionDelete?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isProductReceptionAddExcelFile.pending, (state, action) => {
                state.sendLoading = true;

            })
            .addCase(isProductReceptionAddExcelFile.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    state.productReceptionData = result
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                }
                state.sendLoading = false;
            })
            .addCase(isProductReceptionAddExcelFile?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isProductReceptionEdit.pending, (state, action) => {
                state.sendLoading = true;
            })
            .addCase(isProductReceptionEdit.fulfilled, (state, { payload }) => {
                const { result } = payload
                if (result) {
                    const { data, update } = result;
                    state.isSuccessApi = true;
                    state.productReceptionData = state.productReceptionData.map((item: any) => item.id === +result.id ? result : item)
                    Toast.fire("Ma'lumot tahrirlandi!", '', 'success')
                    state.hasError = {}
                }
                state.update = result
                state.sendLoading = false;
            })
            .addCase(isProductReceptionEdit?.rejected, (state, action) => {
                state.sendLoading = false;
                state.hasError = action.payload
                Toast.fire(action?.error?.message, '', 'error')
            })
            .addCase(payAllProductReception.pending, (state, action) => {
                state.sendLoading = true;
            })
            .addCase(payAllProductReception.fulfilled, (state, { payload }) => {
                const { result } = payload
                if (result) {
                    state.isSuccessApi = true;
                    const { data } = result
                    if (result?.data) {
                        state.productReceptionData = state.productReceptionData.map((item: any) => item.id === +data.id ? data : item)
                    } else {
                        state.productReceptionData = state.productReceptionData.map((item: any) => item.id === +result.id ? result : item)
                    }
                    console.log('data', data);
                    state.update = result
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                    state.hasError = {}
                    state.findData = result
                }
                state.sendLoading = false;
            })
            .addCase(payAllProductReception?.rejected, (state, action) => {
                state.sendLoading = false;
                state.hasError = action.payload
                Toast.fire(action?.error?.message, '', 'error')
            })
    }
})
export const { isProductReceptionChange, isUpdateClearProductReception, isProductReceptionPageLimit, isProductReceptionCurrentPage, isProductReceptionDefaultApi, isAddAllProductReception, isDeleteProductReception, isAddProductReception, isEditProductReception } = ProductReceptionReducer.actions

export default ProductReceptionReducer.reducer