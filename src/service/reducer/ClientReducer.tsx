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


export const isClientGet = createAsyncThunk(
    "client/clientget",
    async (_: any, { rejectWithValue }) => {

        try {
            const response = await axios.get(
                `client${_}`
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
export const isClientReceptionGet = createAsyncThunk(
    "client/clientget",
    async (_: any, { rejectWithValue }) => {

        try {
            const response = await axios.get(
                `client${_}`
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
export const isDoctorGet = createAsyncThunk(
    "client/clientget",
    async (_: any, { rejectWithValue }) => {

        try {
            const response = await axios.get(
                `client${_}`
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
export const isClientAddExcelFile = createAsyncThunk(
    "client/clientget/isClientAddExcelFile",
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "client/excel", data
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
export const isClientAdd = createAsyncThunk(
    "clientadd",
    async (data: any, { rejectWithValue }) => {

        try {

            const { query, file } = data
            let formData = new FormData();
            for (let key in query) {
                formData.append(key, query[key]);
            }
            if (file !== null) {
                formData.append('photo', file);
            }
            const response = await axios.post(
                `client`, formData
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



export const isClientEdit = createAsyncThunk("clientedit",
    async (data: any, { rejectWithValue }) => {

        try {
            const { query, id } = data
            const response = await axios.put(
                "client/" + id + query
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
export const payAllClient = createAsyncThunk("payAllClient",
    async (data: any, { rejectWithValue }) => {

        try {
            const { query, id } = data
            const response = await axios.post(
                "client/pay-all/" + id, query
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

export const isClientDelete = createAsyncThunk("isClientDelete",
    async (data: any, { rejectWithValue }) => {

        try {
            const { all, id } = data
            const response = await axios.delete(
                "/client/" + (all?.length ?? 0 > 0 ? JSON.stringify(all) : id)
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
    clientData: {
        data: []
    },
    doctor: [],
    debtClientData: {
        data: [],
        start_date: '',
        end_date: ''
    },
    clientGet: false,
    loading: false,
    sendLoading: false,
    client_graph_achive_target: {},
    isLoading: false,
    hasError: {},
    massage: {},
    check_print_data: {},
    update: {},
    findData: {},
    isSuccessApi: false,
    page: 1,
    pageLimit: 50,
    data: {},
    cashRegModal: false,
    cashRegItem: {},
    cashRegModal2: false,
    cashRegItem2: {},
}
export const ClientReducer = createSlice({
    name: 'client',
    initialState,
    reducers: {
        isAddClient: (state, { payload }) => {
            state.clientData.data = [...state.clientData.data, payload]
        },
        isAddRegisterClient: (state, { payload }) => {
            state.data = payload
        },

        isAddAllDebtClient: (state, { payload }) => {
            state.debtClientData = payload
        },
        isDeleteAllDebtClient: (state, { payload }) => {
            state.debtClientData.data = state.debtClientData.data?.filter((item: any) => item?.id != payload)
        },
        isChangeClientGraphAchiveTarget: (state, { payload }) => {
            state.client_graph_achive_target = payload
        },
        isTornametClient: (state, { payload }) => {
            state.clientData.data = state.clientData.data.map((item: any) => item.person_id == payload?.person_id ? {
                ...item,
                use_status: 'tornamet'
            } : item)
        },
        isChangeClietStatus: (state, { payload }) => {
            let find = state.clientData.data.find((res: any) => +res.person_id == +payload?.person_id)
            console.log('find', find);

            if (find) {
                state.clientData.data = state.clientData.data.map((item: any) => +item.person_id == +payload?.person_id ? {
                    ...item,
                    use_status: payload?.use_status
                } : item)
            }

        },
        isDoctorTargetData: (state, { payload }) => {
            state.data = payload
        },
        isClearChekPrintData: (state) => {
            state.check_print_data = {}
        },
        isClientPageLimit: (state, { payload }) => {
            state.pageLimit = payload
        },
        isUpdateClearClient: (state) => {
            state.update = {}
        },
        isClientCurrentPage: (state, { payload }) => {
            state.page = payload
        },
        isAddAllClient: (state, { payload }) => {
            state.clientData.data = payload
        },
        isCashRegItem: (state) => {
            state.cashRegItem = {}
            state.cashRegModal = false
        },
        isCashRegItem2: (state) => {
            state.cashRegItem2 = {}
            state.cashRegModal2 = false
        },
        isDeleteClient: (state, { payload }) => {
            if (Array.isArray(payload)) {
                state.clientData.data = state.clientData.data.filter(({ id }: { id: number }) => !new Set([...payload]).has(id))
            }
            state.clientData.data = state.clientData.data.filter(({ id }: { id: number }) => id !== payload)
        },
        isEditClient: (state, { payload }) => {
            state.clientData.data = state.clientData.data.map((item: any) => item.id === +payload.id ? payload : item)
        },
        isClientDefaultApi: (state) => {
            state.isSuccessApi = false;
        },
    },
    extraReducers: builder => {
        builder
            // .addCase(isDoctorGet.pending, (state, action) => {

            //     state.doctor = []
            // })
            // .addCase(isDoctorGet.fulfilled, (state, { payload
            // }) => {
            //     const { result } = payload;
            //     state.doctor = result
            // })
            // .addCase(isDoctorGet?.rejected, (state, { payload }) => {
            //     state.clientData = []
            // })
            .addCase(isClientGet.pending, (state, action) => {
                state.isLoading = true;
                state.clientGet = true;
                state.massage = {}
                state.clientData = {
                    data: []
                }
            })
            .addCase(isClientGet.fulfilled, (state, { payload
            }) => {
                const { result } = payload;
                state.clientData = result
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(isClientGet?.rejected, (state, { payload }) => {
                state.massage = payload
                state.loading = false;
                state.isLoading = false;
                state.clientData = []
            })
            // registerniki
            // .addCase(isClientReceptionGet.pending, (state, action) => {
            //     state.isLoading = true;
            //     state.massage = {}
            //     state.clientData = {
            //         data: []
            //     }
            // })
            // .addCase(isClientReceptionGet.fulfilled, (state, { payload
            // }) => {
            //     const { result } = payload;
            //     state.clientData = result
            //     state.isLoading = false;
            //     state.isSuccess = true;
            // })
            // .addCase(isClientReceptionGet?.rejected, (state, { payload }) => {
            //     state.massage = payload
            //     state.loading = false;
            //     state.isLoading = false;
            //     state.clientData = []
            // })

            .addCase(isClientAdd.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isClientAdd.fulfilled, (state, { payload }) => {
                const { data, check_print_data, graph_achive, cash_pay_id } = payload?.result ?? false
                if (check_print_data) {
                    state.check_print_data = check_print_data;
                }
                if (cash_pay_id > 0) {
                    let first2 = data?.client_item?.find((item: any) => item?.id == cash_pay_id);
                    console.log('first', first2);
                    if (first2?.total_price - first2?.discount - first2?.pay_total_price > 0) {
                        state.cashRegItem2 = { ...first2, balance: data?.balance }
                        state.cashRegModal2 = true
                        console.log('runnn', first2?.total_price - first2?.discount - first2?.pay_total_price);

                    }
                }
                if (graph_achive?.id > 0) {
                    state.isSuccessApi = true;
                    state.client_graph_achive_target = graph_achive
                    state.cashRegItem = data,
                        state.cashRegModal = true;
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                    state.hasError = {}
                } else
                    if (data) {
                        state.isSuccessApi = true;
                        let find = state.clientData.data.find((res: any) => res.id == data.id)
                        if (find) {
                            state.clientData.data = state.clientData.data.map((res: any) => res.id == data.id ? data : res)
                        } else {
                            state.clientData.data = [data, ...state.clientData.data]
                        }
                        if (state.debtClientData?.data?.length > 0 && data?.client_item?.length == 1) {
                            let first = data?.client_item?.at(-1);
                            console.log('first', first);

                            if (first?.total_price - first?.discount - first?.pay_total_price > 0) {
                                state.debtClientData.data = state.debtClientData.data?.map((item: any) => item?.id == first?.id ? first : item)
                            } else {
                                state.debtClientData.data = state.debtClientData.data?.filter((item: any) => item?.id != first?.id)
                            }
                        }

                        Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                        state.hasError = {}

                    }
                state.sendLoading = false;
                state.isLoading = false;

            })
            .addCase(isClientAdd?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isClientDelete.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isClientDelete.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    const { data, update } = result;
                    state.isSuccessApi = true;
                    console.log('result', result);

                    state.update = { status: '', ...result }
                    if (Array.isArray(data)) {
                        let res = state.clientData.data?.filter((item: any) => !new Set([...data]).has(item.id))
                        state.clientData.data = res;
                        let pagination = [...res.slice((state.page * state.pageLimit) - state.pageLimit, state.page * state.pageLimit)]
                        if (pagination?.length == 0) {
                            state.page = 1
                        }
                    } else {
                        let res = state.clientData.data?.filter((item: any) => item.id != data)
                        state.clientData.data = res;
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
            .addCase(isClientDelete?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isClientAddExcelFile.pending, (state, action) => {
                state.sendLoading = true;

            })
            .addCase(isClientAddExcelFile.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    state.clientData = result
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                }
                state.sendLoading = false;
            })
            .addCase(isClientAddExcelFile?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isClientEdit.pending, (state, action) => {
                state.sendLoading = true;
            })
            .addCase(isClientEdit.fulfilled, (state, { payload }) => {
                const { result } = payload
                if (result) {
                    const { data, update } = result;
                    state.isSuccessApi = true;
                    state.clientData.data = state.clientData.data.map((item: any) => item.id === +result.id ? result : item)
                    Toast.fire("Ma'lumot tahrirlandi!", '', 'success')
                    state.hasError = {}
                }
                state.update = result
                state.sendLoading = false;
            })
            .addCase(isClientEdit?.rejected, (state, action) => {
                state.sendLoading = false;
                state.hasError = action.payload
                Toast.fire(action?.error?.message, '', 'error')
            })
            .addCase(payAllClient.pending, (state, action) => {
                state.sendLoading = true;
            })
            .addCase(payAllClient.fulfilled, (state, { payload }) => {
                const { result } = payload
                if (result) {
                    state.isSuccessApi = true;
                    const { data } = result
                    if (result?.data) {
                        state.clientData.data = state.clientData.data.map((item: any) => item.id === +data.id ? data : item)
                    } else {
                        state.clientData.data = state.clientData.data.map((item: any) => item.id === +result.id ? result : item)
                    }
                    console.log('data', data);
                    state.update = result
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                    state.hasError = {}
                    state.findData = result
                }
                state.sendLoading = false;
            })
            .addCase(payAllClient?.rejected, (state, action) => {
                state.sendLoading = false;
                state.hasError = action.payload
                Toast.fire(action?.error?.message, '', 'error')
            })
    }
})
export const { isAddRegisterClient, isChangeClietStatus, isDeleteAllDebtClient, isCashRegItem2, isAddAllDebtClient, isCashRegItem, isChangeClientGraphAchiveTarget, isTornametClient, isDoctorTargetData, isClearChekPrintData, isUpdateClearClient, isClientPageLimit, isClientCurrentPage, isClientDefaultApi, isAddAllClient, isDeleteClient, isAddClient, isEditClient } = ClientReducer.actions

export default ClientReducer.reducer