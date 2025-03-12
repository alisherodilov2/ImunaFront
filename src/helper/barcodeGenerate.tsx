import { nanoid } from '@reduxjs/toolkit'
import axios from 'axios'
import React from 'react'

const barcodeGenerate = ({ data = [], sendFunction = function () { }, api = false }: { data: any, sendFunction?: Function, api?: boolean }) => {
    if (api) {
        sendFunction()
        return false;
    }
    while (true) {
        let barcode = nanoid().split('').map((item: string) => item?.charCodeAt(0)).join('').slice(0, 13)
        if (!data.find((item: any) => item != barcode)) {
            return barcode
        }
    }
}

export default barcodeGenerate

export const apiBarcodeGenerate = async (setLoading: Function, loading: boolean) => {
    try {
        setLoading(true)
        let result = await axios.get('/product/barcode-generate')
        return result.data.result
    } catch (error) {
        return error
    }
    finally {
        setLoading(false)
    }
} 