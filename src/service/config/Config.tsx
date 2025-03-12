import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../store/store';
import { isUserCheck } from '../reducer/ProfileReducer';
import { ReducerType } from '../../interface/interface';
import Loader from '../../componets/api/Loader';
import { useLocation, useNavigate } from 'react-router-dom';
// import { isOrderGet, isOrderRepotGet, isorderIncomeGet } from '../reducer/OrderReducer';
import { userRole } from '../helper/UserRole';
import { isNotificationGet } from '../reducer/NotificationReducer';
import { redirect } from '../helper/redirect';
import { isUnityGet } from '../reducer/UnityReducer';
import { ScaleLoader } from 'react-spinners';
import { isTgGroupGet } from '../reducer/TgGroupReducer';
import { isMasterGet } from '../reducer/MasterReducer';
// import { io } from 'socket.io-client';
// export const socket = io('https://soket6.akrampulatov.uz'); 
const Config = () => {
    const dispatch = useDispatch<AppDispatch>()
    const path = useNavigate();
    let { pathname } = useLocation();
    // const { productData } = useSelector((state: ReducerType) => state.ProductReducer)
    // const { currencyData, isSuccess, isLoading } = useSelector((state: ReducerType) => state.CurrencyReducer)
    // const { loading } = useSelector((state: ReducerType) => state.MenuReducer)
    // const { orderData } = useSelector((state: ReducerType) => state.OrderReducer)
    const { userCheck, userCheckLoad, user, token } = useSelector((state: ReducerType) => state.ProfileReducer)
    useEffect(() => {
        dispatch(isUserCheck())

        if (userCheck && userCheckLoad) {
            // dispatch(isTgGroupGet())
            // dispatch(isMasterGet())
            // dispatch(isPayOfficeGet(''))
            // dispatch(isBrachGet(''))
            // dispatch(isUnityGet())
            // dispatch(isCustomerGet(''))
            // dispatch(isCurrencyGet())
            // dispatch(isCategoryGet())
            // dispatch(isProductGet())
            // dispatch(isManagerGet())
            // dispatch(isInPaymentGet(''))
            // dispatch(isServiceGet())
            // dispatch(isDiagnosisGet())
            // dispatch(isDoctorsGet())
            // dispatch(isStorageGet())
            // dispatch(isContainerGet())
        }
        if ((token || '').length == 0) {
            path('/')
        }
    }, [userCheck, userCheckLoad, token])
    useEffect(() => {
    }, [pathname])
    const [model, setModel] = useState(false)
    return <>
        {/* {
            !isLoading && isSuccess && currencyData?.length == 0 ?
                <CurrencyAdd modal={true} /> : ''
        } */}
    </>;
}

export default Config