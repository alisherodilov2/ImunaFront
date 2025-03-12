import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../service/store/store";
import { useEffect } from "react";
import { ReducerType } from "../../interface/interface";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { isFindFunction, isLoadingFunction } from "../../service/reducer/MenuReducer";
import Button from "../buttons/Button";

const GetApi = ({ apiId, url='', setValue, reset, getValues, extra = [], bigUrl = '' }: { extra?: any, getValues: any, reset?: any, setValue: any; apiId: string, url?: string, bigUrl?: string }) => {
    const dispatch = useDispatch<AppDispatch>()
    const path = useNavigate()
    let { pathname } = useLocation();
    const { findData } = useSelector((state: ReducerType) => state.MenuReducer)
    const extraFuntion = (obj: any, key: string) => {
        if (extra?.find((item: any) => item === key)) {
            for (let keys in obj) {
                setValue(keys, obj[keys], {
                    shouldValidate: true,
                });
            }
        }
    }
    useEffect(() => {

        if (Object.keys(findData ?? {})?.length === 0 && apiId?.length > 0) {
            dispatch(isLoadingFunction(true))
            let urls = bigUrl?.length > 0 ? bigUrl: `${url}/${apiId}`;
            axios.get(urls).then(res => {
                const { data } = res.data
                dispatch(isFindFunction(data))
                for (let key in data) {
                    setValue(key, data[key], {
                        shouldValidate: true,
                    });
                    extraFuntion(data[key], key)
                }
            })
                .catch(err => {
                    path(url)
                })
                .finally(() => {
                    dispatch(isLoadingFunction(false))
                })

        } else {

            for (let key in findData) {
                setValue(key, findData?.[key as string], {
                    shouldValidate: true,
                });
                extraFuntion(findData?.[key], key)
            }
        }
        if (pathname.split('/').find(p => p === 'create')) {
            let s = getValues(), resetObj = {};
            for (let key in getValues()) {
                resetObj = {
                    ...resetObj, [key]: ''
                }
            }
            reset(
                resetObj
            )
        }
    }, [apiId, path])
    return null;
}

export default GetApi