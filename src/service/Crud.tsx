import { createAsyncThunk, nanoid } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";

export class Crud {
    modelClass: any = [];
    payload: any;
    getOject(state: any) {
        if (this.modelClass?.length > 0) {
            let objectNames = this.modelClass.split('.')
            let result: any = state[this.modelClass.at(0)];
            for (let key of this.modelClass) {
                result = result[key]
            }
            return result;
        }
        return state.modelClass
    }
    show(state: any, payload: any) {
        return this.getOject(state).find((item: any) => item.id == payload)
    }
    store(state: any, payload: any) {
        return [...this.getOject(state), payload];
    }
    update(state: any, payload: any) {
        return this.getOject(state).map((item: any) => item.id == payload?.id ? payload : item);
    }
    delete(state: any, payload: any) {
        return this.getOject(state).filter((item: any) => item.id == payload);
    }
    crud(state: any, payload: any) {
        switch (payload.type) {
            case 'c':
                return this.store(state, payload)
            case 'r':
                return payload
            case 'u':
                return this.update(state, payload)
            case 'd':
                return this.delete(state, payload)

            default:
                return this.getOject(state)
        }
    }
    apiCrud(builder: any, functions: any) {
        // function,type
        for (let key of functions) {
            builder.addCase(key.function.pending, (state: any) => {
                state.isLoading = true;
            })
                .addCase(key.function.fulfilled, (state: any, { payload }: any) => {
                    state.isLoading = true;
                    state.modelClass = this.crud(state, { ...payload, type: key.type })
                    state.isLoading = false;
                    state.isSuccess = true;
                })
                .addCase(key.function.rejected, (state: any, { payload }: any) => {
                    state.massage = payload
                    state.isLoading = false;
                })
        }
        return builder
    }
    apiSend(options: any) {
        const { url = '', responseObjectName = 'data', method = 'get', data = '' } = options
        return createAsyncThunk(
            nanoid(),
            async (_, { rejectWithValue }) => {
                try {
                    const response: any = await axios(
                        {
                            url: url,
                            method: method,
                            data: data
                        }
                    );
                    return response[responseObjectName];
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
    }
}