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


export const isTgGroupGet = createAsyncThunk(
    "tgGroup/tgGroupget",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                "tg-group"
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
export const isTgGroupAddExcelFile = createAsyncThunk(
    "tgGroup/tgGroupget/isTgGroupAddExcelFile",
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "tgGroup/excel" + data
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
export const isTgGroupAdd = createAsyncThunk(
    "tgGroupadd",
    async (data: any, { rejectWithValue }) => {

        try {

            const { query, file } = data
            let formData = new FormData();
            if (file !== null) {
                formData.append('photo', file);
            }
            const response = await axios.post(
                `tgGroup` + query, formData
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



export const isTgGroupEdit = createAsyncThunk("tgGroupedit",
    async (data: any, { rejectWithValue }) => {

        try {
            const { query, id } = data
            const response = await axios.put(
                "tg-group/" + id + query
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

export const isTgGroupDelete = createAsyncThunk("isTgGroupDelete",
    async (data: any, { rejectWithValue }) => {

        try {
            const { all, id } = data
            const response = await axios.delete(
                "/tg-group/" + (all?.length ?? 0 > 0 ? JSON.stringify(all) : id)
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
    tgGroupData: [],
    loading: false,
    sendLoading: false,
    isLoading: false,
    hasError: {},
    massage: {},
    isSuccessApi: false,
    page: 1,
    pageLimit: 50,
}
export const TgGroupReducer = createSlice({
    name: 'tgGroup',
    initialState,
    reducers: {
        isAddTgGroup: (state, { payload }) => {
            state.tgGroupData = [...state.tgGroupData, payload]
        },
        isSoketAddTgGroup: (state, { payload }) => {
            let find =  state.tgGroupData.find((res:any)=>res.id==payload.id)
            if(find){
                state.tgGroupData = state.tgGroupData.map((item: any) => item.id === +payload.id ? payload : item)
            }else{
                state.tgGroupData = [...state.tgGroupData, payload]
            }
        },
        isTgGroupPageLimit: (state, { payload }) => {
            state.pageLimit = payload
        },
        isTgGroupCurrentPage: (state, { payload }) => {
            state.page = payload
        },
        isAddAllTgGroup: (state, { payload }) => {
            state.tgGroupData = payload
        },
        isDeleteTgGroup: (state, { payload }) => {
            if (Array.isArray(payload)) {
                state.tgGroupData = state.tgGroupData.filter(({ id }: { id: number }) => !new Set([...payload]).has(id))
            }
            state.tgGroupData = state.tgGroupData.filter(({ id }: { id: number }) => id !== payload)
        },
        isEditTgGroup: (state, { payload }) => {
            state.tgGroupData = state.tgGroupData.map((item: any) => item.id === +payload.id ? payload : item)
        },
        isTgGroupDefaultApi: (state) => {
            state.isSuccessApi = false;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(isTgGroupGet.pending, (state, action) => {
                state.isLoading = true;
                state.massage = {}
                state.tgGroupData = []
            })
            .addCase(isTgGroupGet.fulfilled, (state, { payload
            }) => {
                state.tgGroupData = payload?.result
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(isTgGroupGet?.rejected, (state, { payload }) => {
                state.massage = payload
                state.loading = false;
                state.isLoading = false;
                state.tgGroupData = []
            })
            .addCase(isTgGroupAdd.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isTgGroupAdd.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    state.tgGroupData = [...state.tgGroupData, payload?.result]
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                    state.hasError = {}

                }
                state.sendLoading = false;
                state.isLoading = false;

            })
            .addCase(isTgGroupAdd?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isTgGroupDelete.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isTgGroupDelete.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    state.tgGroupData = state.tgGroupData?.filter((item: any) => result.data != item.id)
                    Toast.fire("Ma'lumot o'chirildi!", '', 'success')
                }
                state.sendLoading = false;
                state.isLoading = false;

            })
            .addCase(isTgGroupDelete?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isTgGroupAddExcelFile.pending, (state, action) => {
                state.sendLoading = true;

            })
            .addCase(isTgGroupAddExcelFile.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    state.tgGroupData = result
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                }
                state.sendLoading = false;
            })
            .addCase(isTgGroupAddExcelFile?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isTgGroupEdit.pending, (state, action) => {
                state.sendLoading = true;
            })
            .addCase(isTgGroupEdit.fulfilled, (state, { payload }) => {
                const { result } = payload
                if (result) {
                    state.isSuccessApi = true;
                    state.tgGroupData = state.tgGroupData.map((item: any) => item.id === +result.id ? result : item)
                    Toast.fire("Ma'lumot tahrirlandi!", '', 'success')
                    state.hasError = {}

                }
                state.sendLoading = false;
            })
            .addCase(isTgGroupEdit?.rejected, (state, action) => {
                state.sendLoading = false;
                state.hasError = action.payload
                Toast.fire(action?.error?.message, '', 'error')
            })
    }
})
export const { isSoketAddTgGroup,isTgGroupPageLimit, isTgGroupCurrentPage, isTgGroupDefaultApi, isAddAllTgGroup, isDeleteTgGroup, isAddTgGroup, isEditTgGroup } = TgGroupReducer.actions

export default TgGroupReducer.reducer