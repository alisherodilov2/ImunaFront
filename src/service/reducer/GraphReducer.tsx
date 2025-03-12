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


export const isGraphGet = createAsyncThunk(
    "graph/graphget",
    async (_: any, { rejectWithValue }) => {

        try {
            const response = await axios.get(
                `graph${_}`
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
export const isGraphAddExcelFile = createAsyncThunk(
    "graph/graphget/isGraphAddExcelFile",
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "graph/excel" + data
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
export const isGraphAdd = createAsyncThunk(
    "graphadd",
    async (data: any, { rejectWithValue }) => {

        try {

            const { query, file } = data
            let formData = new FormData();
            if (file !== null) {
                formData.append('photo', file);
            }
            const response = await axios.post(
                `graph` + query, formData
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



export const isGraphEdit = createAsyncThunk("graphedit",
    async (data: any, { rejectWithValue }) => {

        try {
            const { query, id } = data
            const response = await axios.put(
                "graph/" + id + query
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
export const payAllGraph = createAsyncThunk("payAllGraph",
    async (data: any, { rejectWithValue }) => {

        try {
            const { query, id } = data
            const response = await axios.post(
                "graph/pay-all/" + id, query
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

export const isGraphDelete = createAsyncThunk("isGraphDelete",
    async (data: any, { rejectWithValue }) => {

        try {
            const { all, id } = data
            const response = await axios.delete(
                "/graph/" + (all?.length ?? 0 > 0 ? JSON.stringify(all) : id)
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
    graphData: {
        data: []
    },
    graph_achive: {
        data: []
    },
    graph_achive_target: {},
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
export const GraphReducer = createSlice({
    name: 'graph',
    initialState,
    reducers: {
        isAddGraph: (state, { payload }) => {
            state.graphData = [...state.graphData, payload]
        },
        isAddGraphAchiveAll: (state, { payload }) => {
            state.graph_achive = payload
        },
        isEditGraphAchive: (state, { payload }) => {
            state.graph_achive.data = state.graph_achive.data?.map((item: any) => item.id == payload.id ? payload : item)
        },
        isGraphPageLimit: (state, { payload }) => {
            state.pageLimit = payload
        },
        isUpdateClearGraph: (state) => {
            state.update = {}
        },
        isGraphCurrentPage: (state, { payload }) => {
            state.page = payload
        },
        isAddAllGraph: (state, { payload }) => {
            state.graphData = payload
        },
        isGrapItemDelete: (state, { payload }) => {
            state.graphData.data = state.graphData.data?.map((res: any) => {
                {
                    return {
                        ...res,
                        graph_item: res?.graph_item?.filter((item: any) => item?.id !== payload)
                    }

                }
            })
        },
        isDeleteGraph: (state, { payload }) => {
            if (Array.isArray(payload)) {
                state.graphData = state.graphData.filter(({ id }: { id: number }) => !new Set([...payload]).has(id))
            }
            state.graphData = state.graphData.filter(({ id }: { id: number }) => id !== payload)
        },
        isEditGraph: (state, { payload }) => {
            state.graphData.data = state.graphData.data.map((item: any) => item.id === +payload.id ? payload : item)
        },
        isGraphDefaultApi: (state) => {
            state.isSuccessApi = false;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(isGraphGet.pending, (state, action) => {
                state.isLoading = true;
                state.massage = {}
                state.graphData = []
            })
            .addCase(isGraphGet.fulfilled, (state, { payload
            }) => {
                const { result } = payload;
                if (result?.update) {
                    state.graphData = result?.data
                    state.update = result
                } else {
                    state.graphData = result
                }
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(isGraphGet?.rejected, (state, { payload }) => {
                state.massage = payload
                state.loading = false;
                state.isLoading = false;
                state.graphData = []
            })
            .addCase(isGraphAdd.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isGraphAdd.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    if (result?.graph_achive) {
                        // let find = state.graph_achive.data?.find((res: any) => res.id == result?.graph_achive?.id)
                        // if (find) {
                        //     state.graph_achive.data= state.graph_achive.data?.map((res: any) => {
                        //         if (res.id == result?.graph_achive?.id) {
                        //             return result?.graph_achive
                        //         }
                        //         return res
                        //     })
                        // } else {
                        //     // state.graph_achive.data = [...state.graph_achive.data, result?.graph_achive]
                        // }
                        state.graph_achive_target = result?.graph_achive
                    } else {

                        state.graphData.data = [...state.graphData?.data, payload?.result]
                    }
                    state.isSuccessApi = true;
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                    state.hasError = {}
                }
                state.sendLoading = false;
                state.isLoading = false;

            })
            .addCase(isGraphAdd?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isGraphDelete.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isGraphDelete.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    const { data, update } = result;
                    state.isSuccessApi = true;
                    console.log('result', result);

                    state.update = { status: '', ...result }
                    if (+data?.graph_achive) {
                        state.graph_achive.data = state.graph_achive.data?.map((item: any) => item.id == data?.graph_achive?.id ? data?.graph_achive : item)
                    } else {
                        if (Array.isArray(data)) {
                            let res = state.graphData?.filter((item: any) => !new Set([...data]).has(item.id))
                            state.graphData = res;
                            let pagination = [...res.slice((state.page * state.pageLimit) - state.pageLimit, state.page * state.pageLimit)]
                            if (pagination?.length == 0) {
                                state.page = 1
                            }
                        } else {
                            let res = state.graphData?.filter((item: any) => item.id != data)
                            state.graphData = res;
                            let pagination = [...res.slice((state.page * state.pageLimit) - state.pageLimit, state.page * state.pageLimit)]
                            if (pagination?.length == 0) {
                                state.page = 1
                            }

                        }
                    }
                    Toast.fire("Ma'lumot o'chirildi!", '', 'success')
                }
                state.sendLoading = false;
                state.isLoading = false;

            })
            .addCase(isGraphDelete?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isGraphAddExcelFile.pending, (state, action) => {
                state.sendLoading = true;

            })
            .addCase(isGraphAddExcelFile.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    state.graphData = result
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                }
                state.sendLoading = false;
            })
            .addCase(isGraphAddExcelFile?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isGraphEdit.pending, (state, action) => {
                state.sendLoading = true;
            })
            .addCase(isGraphEdit.fulfilled, (state, { payload }) => {
                const { result } = payload
                if (result) {
                    const { data, update, exchange_id } = result;
                    state.isSuccessApi = true;
                    console.log('result', result);
                    
                    if (result?.graph_achive) {
                        let find = state.graph_achive?.data?.find((res: any) => res.id == result?.graph_achive?.id)
                        if (exchange_id > 0) {
                            console.log('state.graph_achive.data', state.graph_achive.data);
                            console.log('exchange_id', exchange_id);
                            
                            state.graph_achive.data = state.graph_achive.data?.filter((res: any) => res.id != exchange_id)
                        }
                        if (result.graph_achive.exchange_id > 0) {
                            console.log('state.graph_achive.data', state.graph_achive.data);
                            console.log('exchange_id', exchange_id);
                            
                            state.graph_achive.data = state.graph_achive.data?.filter((res: any) => res.id != result.graph_achive.exchange_id)
                        }
                        if (find) {
                            state.graph_achive.data = state.graph_achive.data?.map((res: any) => {
                                if (res.id == result?.graph_achive?.id) {
                                    return result?.graph_achive
                                }
                                return res
                            })
                        } else {
                            if(result?.graph_achive?.id){
                                state.graph_achive.data = [...state.graph_achive.data, result?.graph_achive]
                            }
                        }
                        state.client_graph_achive_target = {
                            person_id: result?.graph_achive?.person_id,
                            use_status: result?.graph_achive?.use_status
                        }
                    } else {

                        state.graphData.data = state.graphData.data.map((item: any) => item.id === +result.id ? result : item)
                    }
                    Toast.fire("Ma'lumot tahrirlandi!", '', 'success')
                    state.hasError = {}
                }
                state.update = result
                state.sendLoading = false;
            })
            .addCase(isGraphEdit?.rejected, (state, action) => {
                state.sendLoading = false;
                state.hasError = action.payload
                Toast.fire(action?.error?.message, '', 'error')
            })
            .addCase(payAllGraph.pending, (state, action) => {
                state.sendLoading = true;
            })
            .addCase(payAllGraph.fulfilled, (state, { payload }) => {
                const { result } = payload
                if (result) {
                    state.isSuccessApi = true;
                    const { data } = result
                    if (result?.data) {
                        state.graphData = state.graphData.map((item: any) => item.id === +data.id ? data : item)
                    } else {
                        state.graphData = state.graphData.map((item: any) => item.id === +result.id ? result : item)
                    }
                    console.log('data', data);
                    state.update = result
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                    state.hasError = {}
                    state.findData = result
                }
                state.sendLoading = false;
            })
            .addCase(payAllGraph?.rejected, (state, action) => {
                state.sendLoading = false;
                state.hasError = action.payload
                Toast.fire(action?.error?.message, '', 'error')
            })
    }
})
export const { isEditGraphAchive, isAddGraphAchiveAll, isGrapItemDelete, isUpdateClearGraph, isGraphPageLimit, isGraphCurrentPage, isGraphDefaultApi, isAddAllGraph, isDeleteGraph, isAddGraph, isEditGraph } = GraphReducer.actions

export default GraphReducer.reducer