import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const isCrudGet = createAsyncThunk(
    "crud/get",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                "https://jsonplaceholder.typicode.com/todos/1"
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

export class Crud {

}