import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { CrudInterface, TypeState } from '../../interface/interface';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Crud } from '../Crud';

const crudClass: CrudInterface = new Crud();
const crudClass2: CrudInterface = new Crud();


const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    timer: 2000,
    showConfirmButton: false,
    timerProgressBar: true
})


export const isCrudGet = crudClass?.apiSend?.({ url: 'https://jsonplaceholder.typicode.com/todos' });
export const isCrudGet2 = crudClass?.apiSend?.({ url: 'https://jsonplaceholder.typicode.com/users' });
export const isBrachGet = createAsyncThunk(
    "branch/branchget",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                "branch"
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
export const isBrachAdd = createAsyncThunk(
    "branchadd",
    async (data: any, { rejectWithValue }) => {
       

        try {
            const { query } = data
            const response = await axios.post(
                "branch" + query
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



export const isBrachEdit = createAsyncThunk("branchedit",
    async (data: any, { rejectWithValue }) => {
       

        try {
            const { query, id } = data
            const response = await axios.put(
                "branch/" + id + query
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
    branchData: [],
    modelClass: [],
    loading: false,
    sendLoading: false,
    isLoading: true,
    hasError: {},
    massage: {},
    isSuccessApi: false
}
export const CrudClass = createSlice({
    name: 'CrudClass',
    initialState,
    reducers: {
        store: (state, { payload }) => {
            state.modelClass = crudClass.store?.(state, payload)
        },
        crud: (state, { payload }) => {
            state.modelClass = crudClass.crud?.(state, payload)
        },
    },
    extraReducers: builder => {
        crudClass.apiCrud?.(builder, [{ function: isCrudGet, type: 'r' }])
    }
})
export const { store, crud } = CrudClass.actions

export default CrudClass.reducer