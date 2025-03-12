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


export const isMedicineTypeGet = createAsyncThunk(
    "medicineType/medicineTypeget",
    async (_: any, { rejectWithValue }) => {

        try {
            const response = await axios.get(
                `medicine-type${_}`
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
export const isMedicineTypeAddExcelFile = createAsyncThunk(
    "medicineType/medicineTypeget/isMedicineTypeAddExcelFile",
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "medicine-type/excel" + data
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
export const isMedicineTypeAdd = createAsyncThunk(
    "medicineTypeadd",
    async (data: any, { rejectWithValue }) => {

        try {

            const { query, file } = data
            let formData = new FormData();
            // if (file !== null) {
            //     formData.append('photo', file);
            // }
            for (let key in query) {
                formData.append(key, query[key]);
            }

            const response = await axios.post(
                `medicine-type`, formData
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



export const isMedicineTypeEdit = createAsyncThunk("medicineTypeedit",
    async (data: any, { rejectWithValue }) => {

        try {
            const { query, id } = data
            let formData = new FormData();
            for (let key in query) {
                formData.append(key, query[key]);
            }
            const response = await axios.post(
                "medicine-type/" + id, formData);
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
export const payAllMedicineType = createAsyncThunk("payAllMedicineType",
    async (data: any, { rejectWithValue }) => {

        try {
            const { query, id } = data
            const response = await axios.post(
                "medicine-type/pay-all/" + id, query
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

export const isMedicineTypeDelete = createAsyncThunk("isMedicineTypeDelete",
    async (data: any, { rejectWithValue }) => {

        try {
            const { all, id } = data
            const response = await axios.delete(
                "/medicine-type/" + (all?.length ?? 0 > 0 ? JSON.stringify(all) : id)
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
    medicineTypeData: [],
    loading: false,
    sendLoading: false,
    isLoading: false,
    hasError: {},
    massage: {},
    update: {},
    complaintTarget: {},
    findData: {},
    isSuccessApi: false,
    page: 1,
    pageLimit: 50,
}
export const MedicineTypeReducer = createSlice({
    name: 'medicineType',
    initialState,
    reducers: {
        isAddMedicineType: (state, { payload }) => {
            state.medicineTypeData = [...state.medicineTypeData, payload]
        },
        isMedicineTypePageLimit: (state, { payload }) => {
            state.pageLimit = payload
        },
        isComplaintTarget: (state, { payload }) => {
            state.complaintTarget = payload
        },
        isUpdateClearMedicineType: (state) => {
            state.update = {}
        },
        isMedicineTypeCurrentPage: (state, { payload }) => {
            state.page = payload
        },
        isAddAllMedicineType: (state, { payload }) => {
            state.medicineTypeData = payload
        },
        isDeleteMedicineType: (state, { payload }) => {
            if (Array.isArray(payload)) {
                state.medicineTypeData = state.medicineTypeData.filter(({ id }: { id: number }) => !new Set([...payload]).has(id))
            }
            state.medicineTypeData = state.medicineTypeData.filter(({ id }: { id: number }) => id !== payload)
        },
        isEditMedicineType: (state, { payload }) => {
            state.medicineTypeData = state.medicineTypeData.map((item: any) => item.id === +payload.id ? payload : item)
        },
        isMedicineTypeDefaultApi: (state) => {
            state.isSuccessApi = false;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(isMedicineTypeGet.pending, (state, action) => {
                state.isLoading = true;
                state.massage = {}
                state.medicineTypeData = []
            })
            .addCase(isMedicineTypeGet.fulfilled, (state, { payload
            }) => {
                const { result } = payload;
                if (result?.update) {
                    state.medicineTypeData = result?.data
                    state.update = result
                } else {
                    state.medicineTypeData = result
                }
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(isMedicineTypeGet?.rejected, (state, { payload }) => {
                state.massage = payload
                state.loading = false;
                state.isLoading = false;
                state.medicineTypeData = []
            })
            .addCase(isMedicineTypeAdd.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isMedicineTypeAdd.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {

                    state.complaintTarget = payload?.result;
                    state.isSuccessApi = true;
                    state.medicineTypeData = [...state.medicineTypeData, payload?.result]
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                    state.hasError = {}

                }
                state.sendLoading = false;
                state.isLoading = false;

            })
            .addCase(isMedicineTypeAdd?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isMedicineTypeDelete.pending, (state, action) => {
                state.sendLoading = true;
                state.isLoading = true;

            })
            .addCase(isMedicineTypeDelete.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    if (Array.isArray(result)) {
                        let res = state.medicineTypeData?.filter((item: any) => !new Set([...result]).has(item.id))
                        state.medicineTypeData = res;
                        let pagination = [...res.slice((state.page * state.pageLimit) - state.pageLimit, state.page * state.pageLimit)]
                        if (pagination?.length == 0) {
                            state.page = 1
                        }
                    } else {
                        let res = state.medicineTypeData?.filter((item: any) => item.id != result)
                        state.medicineTypeData = res;
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
            .addCase(isMedicineTypeDelete?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                state.isLoading = false;
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isMedicineTypeAddExcelFile.pending, (state, action) => {
                state.sendLoading = true;

            })
            .addCase(isMedicineTypeAddExcelFile.fulfilled, (state, { payload }) => {
                const { result } = payload ?? false
                if (result) {
                    state.isSuccessApi = true;
                    state.medicineTypeData = result
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                }
                state.sendLoading = false;
            })
            .addCase(isMedicineTypeAddExcelFile?.rejected, (state, { payload }: { payload: any }) => {
                state.sendLoading = false;
                state.hasError = payload
                Toast.fire(payload?.status, '', 'error')
            })
            .addCase(isMedicineTypeEdit.pending, (state, action) => {
                state.sendLoading = true;
            })
            .addCase(isMedicineTypeEdit.fulfilled, (state, { payload }) => {
                const { result } = payload
                if (result) {
                    const { data, update } = result;
                    state.isSuccessApi = true;
                    state.medicineTypeData = state.medicineTypeData.map((item: any) => item.id === +result.id ? result : item)
                    Toast.fire("Ma'lumot tahrirlandi!", '', 'success')
                    state.hasError = {}
                }
                state.update = result
                state.sendLoading = false;
            })
            .addCase(isMedicineTypeEdit?.rejected, (state, action) => {
                state.sendLoading = false;
                state.hasError = action.payload
                Toast.fire(action?.error?.message, '', 'error')
            })
            .addCase(payAllMedicineType.pending, (state, action) => {
                state.sendLoading = true;
            })
            .addCase(payAllMedicineType.fulfilled, (state, { payload }) => {
                const { result } = payload
                if (result) {
                    state.isSuccessApi = true;
                    const { data } = result
                    if (result?.data) {
                        state.medicineTypeData = state.medicineTypeData.map((item: any) => item.id === +data.id ? data : item)
                    } else {
                        state.medicineTypeData = state.medicineTypeData.map((item: any) => item.id === +result.id ? result : item)
                    }
                    console.log('data', data);
                    state.update = result
                    Toast.fire("Ma'lumot qo'shildi!", '', 'success')
                    state.hasError = {}
                    state.findData = result
                }
                state.sendLoading = false;
            })
            .addCase(payAllMedicineType?.rejected, (state, action) => {
                state.sendLoading = false;
                state.hasError = action.payload
                Toast.fire(action?.error?.message, '', 'error')
            })
    }
})
export const { isComplaintTarget, isUpdateClearMedicineType, isMedicineTypePageLimit, isMedicineTypeCurrentPage, isMedicineTypeDefaultApi, isAddAllMedicineType, isDeleteMedicineType, isAddMedicineType, isEditMedicineType } = MedicineTypeReducer.actions

export default MedicineTypeReducer.reducer