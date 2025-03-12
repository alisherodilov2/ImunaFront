import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { TypeState } from '../../interface/interface';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AnyAsyncThunk } from '@reduxjs/toolkit/dist/matchers';



const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    timer: 2000,
    showConfirmButton: false,
    timerProgressBar: true
})


export const isOrderGet = createAsyncThunk(
    "order/orderget",
    async (_:any, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                "order?"+_
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
export const isOrderAddExcelFile = createAsyncThunk(
    "order/orderget/isOrderAddExcelFile",
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "order/excel" + data
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
export const isOrderAdd = createAsyncThunk(
    "orderadd",
    async (data: any, { rejectWithValue }) => {

        try {

            const { query, file } = data
            let formData = new FormData();
            if (file !== null) {
                formData.append('photo', file);
            }
            const response = await axios.post(
                `order` + query, formData
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



export const isOrderEdit = createAsyncThunk("orderedit",
    async (data: any, { rejectWithValue }) => {

        try {
            const { query, id } = data
            const response = await axios.put(
                "order/" + id + query
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

export const isOrderDelete = createAsyncThunk("isOrderDelete",
    async (data: any, { rejectWithValue }) => {

        try {
            const { all, id } = data
            const response = await axios.delete(
                "/order/" + (all?.length ?? 0 > 0 ? JSON.stringify(all) : id)
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
    orderData: [],
    loading: false,
    sendLoading: false,
    isLoading: false,
    hasError: {},
    massage: {},
    isSuccessApi: false,
    page: 1,
    pageLimit: 50,
}
export const OrderReducer = createSlice({
    name: 'order',
    initialState,
    reducers: {
        isSoketAddOrder: (state, { payload }) => {
            let find =  state.orderData.find((res:any)=>res.id==payload.id)
            if(find){
                state.orderData = state.orderData.map((item: any) => item.id === +payload.id ? payload : item)
            }else{
                state.orderData = [...state.orderData, payload]
            }
        },
        isAddOrder: (state, { payload }) => {
            state.orderData = [...state.orderData, payload]
        },
        isOrderPageLimit: (state, { payload }) => {
            state.pageLimit = payload
        },
        isOrderCurrentPage: (state, { payload }) => {
            state.page = payload
        },
        isAddAllOrder: (state, { payload }) => {
            state.orderData = payload
        },
        isDeleteOrder: (state, { payload }) => {
            if (Array.isArray(payload)) {
                state.orderData = state.orderData.filter(({ id }: { id: number }) => !new Set([...payload]).has(id))
            }
            state.orderData = state.orderData.filter(({ id }: { id: number }) => id !== payload)
        },
        isEditOrder: (state, { payload }) => {
            state.orderData = state.orderData.map((item: any) => item.id === +payload.id ? payload : item)
        },
        isOrderDefaultApi: (state) => {
            state.isSuccessApi = false;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(isOrderGet.pending, (state, action) => {
                state.isLoading = true;
                state.massage = {}
                state.orderData = []
            })
            .addCase(isOrderGet.fulfilled, (state, { payload
            }) => {
                state.orderData = payload?.result
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(isOrderGet?.rejected, (state, { payload }) => {
                state.massage = payload
                state.loading = false;
                state.isLoading = false;
                state.orderData = []
            })
            .addCase(isOrderAdd.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isOrderAdd.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    state.orderData = [...state.orderData, payload?.result]
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                    state.hasError = {}

                }
                state.sendLoading = false;
                state.isLoading = false;

            })
            .addCase(isOrderAdd?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isOrderDelete.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isOrderDelete.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    if (Array.isArray(result)) {
                        let res = state.orderData?.filter((item: any) => !new Set([...result]).has(item.id))
                        state.orderData = res;
                        let pagination = [...res.slice((state.page * state.pageLimit) - state.pageLimit, state.page * state.pageLimit)]
                        if (pagination?.length == 0) {
                            state.page = 1
                        }
                    } else {
                        let res = state.orderData?.filter((item: any) => item.id != result)
                        state.orderData = res;
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
            .addCase(isOrderDelete?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isOrderAddExcelFile.pending, (state, action) => {
                state.sendLoading = true;

            })
            .addCase(isOrderAddExcelFile.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    state.orderData = result
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                }
                state.sendLoading = false;
            })
            .addCase(isOrderAddExcelFile?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isOrderEdit.pending, (state, action) => {
                state.sendLoading = true;
            })
            .addCase(isOrderEdit.fulfilled, (state, { payload }) => {
                const { result } = payload
                if (result) {
                    state.isSuccessApi = true;
                    if(result?.status=='is_check'){
                        state.orderData = state.orderData.filter((item: any) => item.id != +result.id)
                    }else{
                        state.orderData = state.orderData.map((item: any) => item.id === +result.id ? result : item)
                    }
                    Toast.fire("Ma'lumot tahrirlandi!", '', 'success')
                    state.hasError = {}

                }
                state.sendLoading = false;
            })
            .addCase(isOrderEdit?.rejected, (state, {payload}) => {
                state.sendLoading = false;
                state.hasError = payload
                const {errors} = payload as any
                // console.log(errors?.message);
                Toast.fire(errors?.message, '', 'error')
            })
    }
})
export const {isSoketAddOrder, isOrderPageLimit, isOrderCurrentPage, isOrderDefaultApi, isAddAllOrder, isDeleteOrder, isAddOrder, isEditOrder } = OrderReducer.actions

export default OrderReducer.reducer