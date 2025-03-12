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


export const isPharmacyProductGet = createAsyncThunk(
    "pharmacyProduct/pharmacyProductget",
    async (_: any, { rejectWithValue }) => {

        try {
            const response = await axios.get(
                `pharmacy-product${_}`
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
export const isPharmacyProductAddExcelFile = createAsyncThunk(
    "pharmacyProduct/pharmacyProductget/isPharmacyProductAddExcelFile",
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "pharmacy-product/excel" + data
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
export const isPharmacyProductAdd = createAsyncThunk(
    "pharmacyProductadd",
    async (data: any, { rejectWithValue }) => {

        try {

            const { query, file } = data
            let formData = new FormData();
            if (file !== null) {
                formData.append('photo', file);
            }
            const response = await axios.post(
                `pharmacy-product` + query, formData
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



export const isPharmacyProductEdit = createAsyncThunk("pharmacyProductedit",
    async (data: any, { rejectWithValue }) => {
        try {
            const { query, id } = data
            const response = await axios.put(
                "pharmacy-product/" + id + query
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
export const payAllPharmacyProduct = createAsyncThunk("payAllPharmacyProduct",
    async (data: any, { rejectWithValue }) => {

        try {
            const { query, id } = data
            const response = await axios.post(
                "pharmacy-product/pay-all/" + id, query
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

export const isPharmacyProductDelete = createAsyncThunk("isPharmacyProductDelete",
    async (data: any, { rejectWithValue }) => {

        try {
            const { all, id } = data
            const response = await axios.delete(
                "/pharmacy-product/" + (all?.length ?? 0 > 0 ? JSON.stringify(all) : id)
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
    pharmacyProductData: [],
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
export const PharmacyProductReducer = createSlice({
    name: 'pharmacyProduct',
    initialState,
    reducers: {
        isAddPharmacyProduct: (state, { payload }) => {
            state.pharmacyProductData = [...state.pharmacyProductData, payload]
        },
        isPharmacyProductChange: (state, { payload }) => {

            state.pharmacyProductData = state.pharmacyProductData.map((item: any) => {
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
        isPharmacyProductPageLimit: (state, { payload }) => {
            state.pageLimit = payload
        },
        isUpdateClearPharmacyProduct: (state) => {
            state.update = {}
        },
        isPharmacyProductCurrentPage: (state, { payload }) => {
            state.page = payload
        },
        isAddAllPharmacyProduct: (state, { payload }) => {
            state.pharmacyProductData = payload
        },
        isDeletePharmacyProduct: (state, { payload }) => {
            if (Array.isArray(payload)) {
                state.pharmacyProductData = state.pharmacyProductData.filter(({ id }: { id: number }) => !new Set([...payload]).has(id))
            }
            state.pharmacyProductData = state.pharmacyProductData.filter(({ id }: { id: number }) => id !== payload)
        },
        isEditPharmacyProduct: (state, { payload }) => {
            state.pharmacyProductData = state.pharmacyProductData.map((item: any) => item.id === +payload.id ? payload : item)
        },
        isPharmacyProductDefaultApi: (state) => {
            state.isSuccessApi = false;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(isPharmacyProductGet.pending, (state, action) => {
                state.isLoading = true;
                state.massage = {}
                state.pharmacyProductData = []
            })
            .addCase(isPharmacyProductGet.fulfilled, (state, { payload
            }) => {
                const { result } = payload;
                if (result?.update) {
                    state.pharmacyProductData = result?.data
                    state.update = result
                } else {
                    state.pharmacyProductData = result
                }
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(isPharmacyProductGet?.rejected, (state, { payload }) => {
                state.massage = payload
                state.loading = false;
                state.isLoading = false;
                state.pharmacyProductData = []
            })
            .addCase(isPharmacyProductAdd.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isPharmacyProductAdd.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    let find = state.pharmacyProductData?.find((item: any) => +item.id === +result?.id)
                    if (find) {
                        state.pharmacyProductData = state.pharmacyProductData.map((item: any) => +item.id === +result?.id ? result : item)
                    } else {
                        state.pharmacyProductData = [...state.pharmacyProductData, payload?.result]
                    }
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                    state.hasError = {}

                }
                state.sendLoading = false;
                state.isLoading = false;

            })
            .addCase(isPharmacyProductAdd?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isPharmacyProductDelete.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isPharmacyProductDelete.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    if (Array.isArray(result)) {
                        let res = state.pharmacyProductData?.filter((item: any) => !new Set([...result]).has(item.id))
                        state.pharmacyProductData = res;
                        let pagination = [...res.slice((state.page * state.pageLimit) - state.pageLimit, state.page * state.pageLimit)]
                        if (pagination?.length == 0) {
                            state.page = 1
                        }
                    } else {
                        let res = state.pharmacyProductData?.filter((item: any) => item.id != result)
                        state.pharmacyProductData = res;
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
            .addCase(isPharmacyProductDelete?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isPharmacyProductAddExcelFile.pending, (state, action) => {
                state.sendLoading = true;

            })
            .addCase(isPharmacyProductAddExcelFile.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    state.pharmacyProductData = result
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                }
                state.sendLoading = false;
            })
            .addCase(isPharmacyProductAddExcelFile?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isPharmacyProductEdit.pending, (state, action) => {
                state.sendLoading = true;
            })
            .addCase(isPharmacyProductEdit.fulfilled, (state, { payload }) => {
                const { result } = payload
                if (result) {
                    const { data, update } = result;
                    state.isSuccessApi = true;
                    state.pharmacyProductData = state.pharmacyProductData.map((item: any) => item.id === +result.id ? result : item)
                    Toast.fire("Ma'lumot tahrirlandi!", '', 'success')
                    state.hasError = {}
                }
                state.update = result
                state.sendLoading = false;
            })
            .addCase(isPharmacyProductEdit?.rejected, (state, action) => {
                state.sendLoading = false;
                state.hasError = action.payload
                Toast.fire(action?.error?.message, '', 'error')
            })
            .addCase(payAllPharmacyProduct.pending, (state, action) => {
                state.sendLoading = true;
            })
            .addCase(payAllPharmacyProduct.fulfilled, (state, { payload }) => {
                const { result } = payload
                if (result) {
                    state.isSuccessApi = true;
                    const { data } = result
                    if (result?.data) {
                        state.pharmacyProductData = state.pharmacyProductData.map((item: any) => item.id === +data.id ? data : item)
                    } else {
                        state.pharmacyProductData = state.pharmacyProductData.map((item: any) => item.id === +result.id ? result : item)
                    }
                    console.log('data', data);
                    state.update = result
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                    state.hasError = {}
                    state.findData = result
                }
                state.sendLoading = false;
            })
            .addCase(payAllPharmacyProduct?.rejected, (state, action) => {
                state.sendLoading = false;
                state.hasError = action.payload
                Toast.fire(action?.error?.message, '', 'error')
            })
    }
})
export const { isPharmacyProductChange, isUpdateClearPharmacyProduct, isPharmacyProductPageLimit, isPharmacyProductCurrentPage, isPharmacyProductDefaultApi, isAddAllPharmacyProduct, isDeletePharmacyProduct, isAddPharmacyProduct, isEditPharmacyProduct } = PharmacyProductReducer.actions

export default PharmacyProductReducer.reducer