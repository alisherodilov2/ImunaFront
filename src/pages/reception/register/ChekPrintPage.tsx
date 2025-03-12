import React, { useEffect, useRef } from 'react'
import { ReducerType } from '../../../interface/interface'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../../../service/store/store'
import { generateCheck } from '../../../helper/generateCheck'
import { isClearChekPrintData } from '../../../service/reducer/ClientReducer'

const ChekPrintPage = () => {
    const { isSuccessApi,check_print_data } = useSelector((state: ReducerType) => state.ClientReducer)
    const { user } = useSelector((state: ReducerType) => state.ProfileReducer)
    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const dispatch = useDispatch<AppDispatch>()
    useEffect(() => {
        if (check_print_data?.client_value?.length > 0) {
            generateCheck({
                target: check_print_data,
                iframeRef: iframeRef,
                name: user?.owner?.name,
                client_time: check_print_data?.client_time,
                user: user
            })
            dispatch(isClearChekPrintData())
        }
    }, [isSuccessApi])
    return (
        <div>
            <iframe ref={iframeRef} style={{ display: 'none' }} title="print-frame" />
        </div>
    )
}

export default ChekPrintPage
