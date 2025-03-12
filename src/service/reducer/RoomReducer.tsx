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


export const isRoomGet = createAsyncThunk(
    "room/roomget",
    async (_: any, { rejectWithValue }) => {

        try {
            const response = await axios.get(
                `room${_}`
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
export const isRoomAddExcelFile = createAsyncThunk(
    "room/roomget/isRoomAddExcelFile",
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "room/excel", data
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
export const isRoomAdd = createAsyncThunk(
    "roomadd",
    async (data: any, { rejectWithValue }) => {

        try {

            const { query, file } = data
            let formData = new FormData();
            for(let key in query) {
                formData.append(key, query[key]);
            }
            const response = await axios.post(
                `room` ,formData
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



export const isRoomEdit = createAsyncThunk("roomedit",
    async (data: any, { rejectWithValue }) => {
        try {
            const { query, id } = data
            let formData = new FormData();
            for(let key in query) {
                formData.append(key, query[key]);
            }
            const response = await axios.post(
                "room/" + id ,formData
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
export const payAllRoom = createAsyncThunk("payAllRoom",
    async (data: any, { rejectWithValue }) => {

        try {
            const { query, id } = data
            const response = await axios.post(
                "room/pay-all/" + id, query
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

export const isRoomDelete = createAsyncThunk("isRoomDelete",
    async (data: any, { rejectWithValue }) => {

        try {
            const { all, id } = data
            const response = await axios.delete(
                "/room/" + (all?.length ?? 0 > 0 ? JSON.stringify(all) : id)
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
    roomData: [],
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
export const RoomReducer = createSlice({
    name: 'room',
    initialState,
    reducers: {
        isAddRoom: (state, { payload }) => {
            state.roomData = [...state.roomData, payload]
        },
        isRoomPageLimit: (state, { payload }) => {
            state.pageLimit = payload
        },
        isUpdateClearRoom: (state) => {
            state.update = {}
        },
        isRoomCurrentPage: (state, { payload }) => {
            state.page = payload
        },
        isAddAllRoom: (state, { payload }) => {
            state.roomData = payload
        },
        isDeleteRoom: (state, { payload }) => {
            if (Array.isArray(payload)) {
                state.roomData = state.roomData.filter(({ id }: { id: number }) => !new Set([...payload]).has(id))
            }
            state.roomData = state.roomData.filter(({ id }: { id: number }) => id !== payload)
        },
        isEditRoom: (state, { payload }) => {
            state.roomData = state.roomData.map((item: any) => item.id === +payload.id ? payload : item)
        },
        isRoomDefaultApi: (state) => {
            state.isSuccessApi = false;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(isRoomGet.pending, (state, action) => {
                state.isLoading = true;
                state.massage = {}
                state.roomData = []
            })
            .addCase(isRoomGet.fulfilled, (state, { payload
            }) => {
                const { result } = payload;
                if (result?.update) {
                    state.roomData = result?.data
                    state.update = result
                } else {
                    state.roomData = result
                }
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(isRoomGet?.rejected, (state, { payload }) => {
                state.massage = payload
                state.loading = false;
                state.isLoading = false;
                state.roomData = []
            })
            .addCase(isRoomAdd.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isRoomAdd.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    state.roomData = [...state.roomData, payload?.result]
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                    state.hasError = {}

                }
                state.sendLoading = false;
                state.isLoading = false;

            })
            .addCase(isRoomAdd?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isRoomDelete.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isRoomDelete.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    if (Array.isArray(result)) {
                        let res = state.roomData?.filter((item: any) => !new Set([...result]).has(item.id))
                        state.roomData = res;
                        let pagination = [...res.slice((state.page * state.pageLimit) - state.pageLimit, state.page * state.pageLimit)]
                        if (pagination?.length == 0) {
                            state.page = 1
                        }
                    } else {
                        let res = state.roomData?.filter((item: any) => item.id != result)
                        state.roomData = res;
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
            .addCase(isRoomDelete?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isRoomAddExcelFile.pending, (state, action) => {
                state.sendLoading = true;

            })
            .addCase(isRoomAddExcelFile.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    state.roomData = result
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                }
                state.sendLoading = false;
            })
            .addCase(isRoomAddExcelFile?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isRoomEdit.pending, (state, action) => {
                state.sendLoading = true;
            })
            .addCase(isRoomEdit.fulfilled, (state, { payload }) => {
                const { result } = payload
                if (result) {
                    const { data, update } = result;
                    state.isSuccessApi = true;
                    state.roomData = state.roomData.map((item: any) => item.id === +result.id ? result : item)
                    Toast.fire("Ma'lumot tahrirlandi!", '', 'success')
                    state.hasError = {}
                }
                state.update = result
                state.sendLoading = false;
            })
            .addCase(isRoomEdit?.rejected, (state, action) => {
                state.sendLoading = false;
                state.hasError = action.payload
                Toast.fire(action?.error?.message, '', 'error')
            })
            .addCase(payAllRoom.pending, (state, action) => {
                state.sendLoading = true;
            })
            .addCase(payAllRoom.fulfilled, (state, { payload }) => {
                const { result } = payload
                if (result) {
                    state.isSuccessApi = true;
                    const { data } = result
                    if (result?.data) {
                        state.roomData = state.roomData.map((item: any) => item.id === +data.id ? data : item)
                    } else {
                        state.roomData = state.roomData.map((item: any) => item.id === +result.id ? result : item)
                    }
                    console.log('data', data);
                    state.update = result
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                    state.hasError = {}
                    state.findData = result
                }
                state.sendLoading = false;
            })
            .addCase(payAllRoom?.rejected, (state, action) => {
                state.sendLoading = false;
                state.hasError = action.payload
                Toast.fire(action?.error?.message, '', 'error')
            })
    }
})
export const { isUpdateClearRoom, isRoomPageLimit, isRoomCurrentPage, isRoomDefaultApi, isAddAllRoom, isDeleteRoom, isAddRoom, isEditRoom } = RoomReducer.actions

export default RoomReducer.reducer