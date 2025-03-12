import React, { useEffect, useRef, useState } from 'react'
// import Layout from '../layouts/Layout'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Toast, ToastHeader, ToastBody, TabPane, TabContent, NavItem, Nav, NavLink, PopoverBody, PopoverHeader, Popover, Spinner } from 'reactstrap'
import classnames from 'classnames';
import { ToastContainer, toast } from 'react-toastify';
import { BrowserMultiFormatReader } from '@zxing/library';
import 'react-toastify/dist/ReactToastify.css';
import { set, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from 'react-redux';
import { query, queryObj } from '../../../componets/api/Query';
import { ReducerType } from '../../../interface/interface';
import Loader from '../../../componets/api/Loader';
import Input from '../../../componets/inputs/Input';
import { NumericFormat, PatternFormat } from 'react-number-format';
import ErrorInput from '../../../componets/inputs/ErrorInput';
import Select from 'react-select';
import axios from 'axios';
import { MdDeleteForever, MdToday } from 'react-icons/md';
import Swal from 'sweetalert2';
import { json, useLocation } from 'react-router-dom';
import { AppDispatch } from '../../../service/store/store';
import { isClearChekPrintData, isClientAdd, isClientDefaultApi, isClientEdit } from '../../../service/reducer/ClientReducer';
import DepartmentAdd from '../../director/services/department/DepartmentAdd';
import Table from '../../../componets/table/Table';
import { nanoid } from '@reduxjs/toolkit';
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaHandHoldingUsd, FaMoneyBillWave, FaMoneyCheck } from 'react-icons/fa';
import { isGrapItemDelete } from '../../../service/reducer/GraphReducer';
import GraphAdd from '../graph/GraphAdd';
import RegGraphAdd from '../graph/RegGraphAdd';
import { fullName, masulRegUchunFullName } from '../../../helper/fullName';
import { phoneFormatNumber } from '../../../helper/graphHelper';
import { getUniqueDepartments, groupAndLimitServices, regDepartmentUnique, serviceGroupBy } from '../../../helper/clientHelper';
import { calculateAge } from '../../../helper/calculateAge';
import { chegirma, chegirmaHisobla, chegirmaTaqsimlash, qarzi, tolanyotkan, totalCalc } from '../../../helper/cashRegHelper';
import { AiFillEdit } from 'react-icons/ai';
import { BiTransfer } from 'react-icons/bi';
import ReferringDoctorAdd from '../../counterparty/referring-doctor/ReferringDoctorAdd';
import { overflow } from 'html2canvas/dist/types/css/property-descriptors/overflow';
import { clientvalidateCheck } from './validate/clientValidate';
import { generateCheck } from '../../../helper/generateCheck';
import { BsQrCodeScan } from 'react-icons/bs';
import { dateFormat } from '../../../service/helper/day';
// import { isAddClient, isEditClient } from '../../client/reducer/ClientReducer';
const ClientAdd = ({ data, modal, setModal, setData = function () { }, resetItem = false, setExtraModalClose = function () { }, setExtraModalClose2 = function () { }, }: { setData?: any, data?: any, modal?: boolean; setModal?: any, resetItem?: boolean, setExtraModalClose?: Function, setExtraModalClose2?: Function, }) => {

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true
    })

    const { serviceData, } = useSelector((state: ReducerType) => state.ServiceReducer)
    const { user, } = useSelector((state: ReducerType) => state.ProfileReducer)
    const { departmentData, } = useSelector((state: ReducerType) => state.DepartmentReducer)
    const { clientData } = useSelector((state: ReducerType) => state.ClientReducer)
    const { referringDoctorData, } = useSelector((state: ReducerType) => state.ReferringDoctorReducer)
    const [loading2, setLoading2] = useState(false)
    const [loading, setLoading] = useState(false)
    const [checkProductItem, setCheckProductItem] = useState({} as any)
    const [checkProductItemId, setCheckProductItemId] = useState(null as any)

    const scanerSend = async (data: any, target: any) => {
        try {
            setLoading(true)
            setCameraReset(() => true)
            console.log('checkProductItem', checkProductItem);
            const split = data?.split('_')
            let res = await axios.get(`/pharmacy-product/qr-code-scan?code=${data}&service_id=${target?.service_id}&qty=${target?.qty}&product_qty=${(target?.client_use_product ?? [])?.filter((item: any) => split?.at(-1) == item?.product_id)?.reduce((a: any, b: any) => a + +b?.qty, 0) + 1}`)
            console.log('res.data', res.data);
            const { result } = res.data

            if (result?.error) {
                Toast.fire(result?.message, '', 'error')
                setCameraReset(() => false)
                startScan(target)
            } else {
                let client_use_product = (target?.client_use_product ?? [])?.filter((item: any) => result?.product_id != item?.product_id)
                let k = { ...target, client_use_product: [...client_use_product, ...result?.client_use_product] }
                console.log('k', k);
                const totalQty = (k.client_use_product ?? [])?.reduce((a: any, b: any) => a + +b?.qty, 0)
                const restotalQty = (k.service_product ?? [])?.reduce((a: any, b: any) => a + +b?.qty, 0) * k.qty
                if (restotalQty - totalQty == 0) {
                    setCheckProductItem(() => ({}))
                    setCameraReset(() => true)
                    setClientValue(() => clinetValue.map((item2: any) => target.id === item2.id ? k : item2))
                    setIsOpenCamera(false)
                } else {
                    setCheckProductItem(() => (k))

                    setClientValue(() => clinetValue.map((item2: any) => target.id === item2.id ? k : item2))
                    setLoading(false)
                    setCameraReset(() => false)
                    startScan(k)
                }

                Toast.fire(result?.message, '', 'success')
            }

            // setIsOpenCamera(false);
        }
        catch (err) {
            setLoading(false)
            setCameraReset(() => false)
            startScan(target)

        }
        finally {
            setLoading(false)
            setCameraReset(() => false)



        }
    }

    const [cameraReset, setCameraReset] = useState(false)
    const startScan = async (item: any) => {
        // setCheckProductItem(() => {})
        const codeReader = new BrowserMultiFormatReader();
        try {
            const videoInputDevices = await codeReader.listVideoInputDevices();
            const rearCamera = videoInputDevices.find((device: any) =>
                device?.label?.toLowerCase()?.includes("back")
                || device?.label?.toLowerCase()?.includes("назад") || device?.label?.toLowerCase()?.includes("orqa")
            ) || videoInputDevices[0];

            codeReader.decodeFromInputVideoDevice(rearCamera.deviceId, 'video').then((result: any) => {
                // setResult(result.getText());

                scanerSend(result.getText(), item);
                // setIsOpenCamera(false);
                // console.log('result.getText()', result.getText());
                // sendCode(result.getText());
                // setLoad(() => true);
                // setIsOpenCamera(false);
            });
            // setStart(true)
        } catch (err) {
            console.error(err);
        }
    };
    const [modal2, setModal2] = useState(false)
    const [modal3, setModal3] = useState(false)
    const { serviceTypeData } = useSelector((state: ReducerType) => state.ServiceTypeReducer)
    const dataSelect = (data: any) => {
        return data?.map((item: any) => {
            return {
                value: item?.id, label: `${item?.name || item?.type} ${item?.price ? `(${item?.price} so'm)` : ''}`,
                data: item
            }
        })
    }
    const advertisementsDataSelect = (data: any) => {
        return data?.map((item: any) => {
            return {
                value: item?.id, label: `${item?.name || item?.type} ${item?.price ? `(${item?.price} so'm)` : ''}`,
                data: item
            }
        })
    }
    const referringDoctorDataSelect = (data: any) => {
        if (data?.length > 0) {

            return data?.map((item: any) => {
                return {
                    value: item?.id, label: fullName(item),
                    data: item
                }
            })
        }
        return []
    }
    const [complateLoading, setComplateLoading] = useState(false)
    const handleConfirmation = (confirm: any, toastId: any) => {
        if (confirm) {
            let find = JSON.parse(toastId);
            toast.dismiss(); // Dismiss specific toast
            if (find) {
                let s = getValues(), resetObj = {};
                for (let key in getValues()) {
                    resetObj = {
                        ...resetObj, [key]: ''
                    }
                }

                for (let key in find) {
                    if (key == 'id') {

                        setValue('parent_id', find?.[key as string], {
                            shouldValidate: true,
                        });
                    } else {
                        setValue(key, find?.[key as string], {
                            shouldValidate: true,
                        });
                    }

                }

            }

        } else {
            toast.dismiss(toastId); // Dismiss specific toast
        }
    };
    const { pathname } = useLocation()
    const autocomplate = async (target: string) => {
        try {
            setComplateLoading(true)
            let res = await axios.get(`/client/autocomplate${target}`)
            const { result } = res.data
            if (result?.length > 0) {
                for (let index = 0; index < result?.length; index++) {
                    const toastId = JSON.stringify(result[index]);
                    toast.info(
                        <div className='d-flex justify-content-between align-items-center toast_card gap-2 w-100'>
                            <p className='m-0 p-0'>
                                {fullName(result[index])}
                            </p>
                            <p className='m-0 p-0'>
                                {result[index]?.data_birth}
                            </p>
                            <p className='m-0 p-0'>
                                {phoneFormatNumber(result[index]?.phone)}
                            </p>
                        </div>,
                        {
                            toastId,
                            className: 'custom-toast',
                            position: 'top-center',
                            autoClose: false,
                            closeOnClick: false,
                            draggable: true,
                            pauseOnHover: false,
                            closeButton: ({ closeToast }) => (
                                <div className="custom-close-button d-flex justify-content-center align-items-center">
                                    <button type='button' className='btn btn-sm btn-success' onClick={() => {
                                        handleConfirmation(true, toastId)
                                        setSendRole(true)
                                    }}>Ha</button>
                                    <button type='button' className='btn btn-sm btn-danger' onClick={() => {
                                        handleConfirmation(false, toastId)
                                        setSendRole(true)

                                    }}>Yo'q</button>
                                </div>
                            ),
                        }
                    );
                }
            } else if (result?.length == 0) {
                setSendRole(true)
            }

        } catch (error) {

        }
        finally {
            setComplateLoading(false)
        }
    }
    const [selectData, setSelectData] = useState({
        customer: {
            value: '',
            label: ''
        },
        customer_target: {
            value: '',
            label: ''
        },
        branch: {
            value: '',
            label: ''
        },
        status: {
            value: 'all', label: "Barchasi"
        },
        payment_type: {
            label: "To'lov turlari ",
            value: 'all'
        },
        department_id: {
            label: "Bo'limlar",
            value: 0
        }
    } as any)
    const iframeRef = useRef<HTMLIFrameElement | null>(null);

    const { findData } = useSelector((state: ReducerType) => state.MenuReducer)
    const { advertisementsData } = useSelector((state: ReducerType) => state.AdvertisementsReducer)
    const { isLoading, sendLoading, isSuccessApi, hasError, check_print_data } = useSelector((state: ReducerType) => state.ClientReducer)
    const dispatch = useDispatch<AppDispatch>()
    const schema = yup
        .object()
        .shape({
            first_name: yup.string().required("Familiyasi kiriting!"),
            last_name: yup.string().required("Ismi kiriting!"),
            data_birth: yup.string().required("Tug'ilgan sanasi kiriting!"),
            sex: yup.string().required("Jinsi kiriting!"),
            phone: yup.string().required("Telefon raqami kiriting!"),
            // citizenship: yup.string().required("Fuqoroligi kiriting!"),
            // address: yup.string().required("Manzil kiriting!"),
        })
        .required();
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        getValues,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(clientvalidateCheck({
            setting: user?.setting
        })),
        defaultValues: {
            ...data,
        }
    });

    const [clinetValue, setClientValue] = useState([] as any)
    const [activeTab, setActiveTab] = useState('1' as any);

    const [enter, setEnter] = useState(false);
    useEffect(() => {


        // if (Object.keys(data ?? {})?.length > 0) {
        //     alert(JSON.stringify(data))
        //     for (let keys in data) {
        //         setValue(keys, data[keys], {
        //             shouldValidate: true,
        //         });
        //     }
        // }
        if (data?.reset) {
            let s = getValues(), resetObj = {};
            for (let key in getValues()) {
                resetObj = {
                    ...resetObj, [key]: ''
                }
            }

            setClientValue(() => [])

            setSelectData(() => {
                return false
            })
            reset(
                resetObj
            )
            if (data?.department_id > 0 && data?.clienttype_id > 0) {
                // let department_id = departmentData?.find((item: any) => item?.id == data?.department_id);
                // let clienttype_id = clientData?.find((item: any) => item?.id == data?.clienttype_id);
                // setSelectData(() => {
                //     return {
                //         department_id: {
                //             value: department_id?.id,
                //             label: department_id?.name
                //         },
                //         clienttype_id: {
                //             value: clienttype_id?.id,
                //             label: clienttype_id?.type
                //         },
                //     }
                // })
                setValue('department_id', data?.department_id.id, {
                    shouldValidate: true,
                });
                setValue('clienttype_id', data?.clienttype_id.id, {
                    shouldValidate: true,
                });
            }

        }
        console.log('dataffff', data);

        if (data?.client_time?.length > 0) {
            setClientTime(() => data?.client_time?.map((item: any) => {
                return {
                    status: 'old',
                    agreement_time: {
                        value: item?.agreement_time,
                        label: item?.agreement_time
                    },
                    department_id: item?.department?.id,
                    department: item?.department

                }
            }))
        }
        if (data?.client_value?.length > 0) {
            let resdata = data?.client_value?.filter((item: any) => item?.id > 0)?.map((item: any) => {
                return {
                    status: 'old',
                    ...item?.service,
                    owner: item?.owner,
                    pay_price: item?.pay_price ?? 0,
                    is_active: +item?.is_active ? 1 : 0,
                    qty: +item?.qty,
                    service_id: item?.service_id,
                    department_id: item?.department_id,
                    price: item?.price,
                    id: item?.id,
                    discount: item?.discount,
                    is_pay: +item?.is_pay ? 1 : 0,
                    client_use_product: item?.client_use_product ?? []

                }
            })

            let newresdata = data?.client_value?.filter((item: any) => item?.id == 0),
                service_id = newresdata?.map((res: any) => {
                    return {
                        value: res?.service_id,
                        label: `${res?.name} ${res?.price ? `(${res?.price} so'm)` : ''}`,
                        data: res
                    }
                }),
                clinetValueNew = newresdata?.map((item: any) => {
                    return {
                        ...item?.service,
                        owner: item?.owner,
                        pay_price: item?.pay_price ?? 0,
                        is_active: 1,
                        qty: 1,
                        service_id: item?.service_id,
                        department_id: item?.department_id,
                        price: item?.price,
                        id: nanoid(),
                        discount: 0,
                        is_pay: 0,
                        client_use_product: item?.client_use_product ?? []
                    }
                });


            setClientValue(() => [...resdata, ...clinetValueNew])
            if (+user?.setting?.is_reg_monoblok) {
                setServiceIdData(() => service_id?.map((item: any) => item?.service))
            }

            let dep = getUniqueDepartments(service_id ?? [])?.filter((res: any) => !new Set(data?.client_time?.map((item: any) => item?.department_id)).has(res?.id))
            if (dep?.length > 0) {
                for (let key of dep) {
                    let find = clientTime?.find((item: any) => item?.department.id == key?.id)
                    if (find) {
                        setClientTime(() => clientTime?.map((res: any) => {
                            return res?.department.id == key?.id ? {
                                department: key,
                                agreement_time: false

                            } : res
                        }))
                    } else {
                        setClientTime([...clientTime, { department: key }])
                    }
                    //   setClientTime(()=>clin)
                }
            }

            setSelectData(() => {
                return {
                    ...selectData,
                    service_id: service_id,
                    department_id: {
                        value: data?.department?.id,
                        label: data?.department?.name,
                    }
                }
            })


        }
        if (Object.keys(data ?? {})?.length > 0) {
            if ((data?.id ?? 0) == 0 && data?.data_birth?.length > 0 && data?.phone?.length > 0) {
                if (pathname == '/') {
                    let target = `?data_birth=${data?.data_birth}&phone=${(data?.phone)}`
                    setAutocomplateText(target)
                    autocomplate(target)
                }
            }
            if ((data?.client_value?.length == 0 || !data?.client_value) && data?.department?.id > 0) {
                setSelectData(() => {
                    return {
                        ...selectData,
                        department_id: {
                            value: data?.department?.id,
                            label: data?.department?.name,
                        }
                    }
                })
                if (+data?.department?.is_reg_time) {
                    setClientTime(() => [
                        {
                            status: 'old',
                            agreement_time: data?.agreement_time,
                            department_id: data?.department?.id,
                            department: data?.department
                        }
                    ])
                }
            }
            if (data?.referring_doctor?.id > 0) {
                setValue('referring_doctor_id', data?.referring_doctor?.id, {
                    shouldValidate: true,
                })
                setSelectData(() => {
                    return {
                        ...selectData,
                        referring_doctor_id: {
                            value: data?.referring_doctor?.id,
                            label: fullName(data?.referring_doctor),
                        }
                    }
                })
            }
            // let department_id = departmentData?.find((item: any) => item?.id == data?.department.id);
            // let clienttype_id = clientData?.find((item: any) => item?.id == data?.clienttype.id);
            // setValue('department_id', data?.department.id, {
            //     shouldValidate: true,
            // });
            // setValue('clienttype_id', data?.clienttype.id, {
            //     shouldValidate: true,
            // });
            // setSelectData(() => {
            //     return {
            //         department_id: {
            //             value: department_id?.id,
            //             label: department_id?.name
            //         },
            //         clienttype_id: {
            //             value: clienttype_id?.id,
            //             label: clienttype_id?.type
            //         },
            //     }
            // })
            for (let key in data) {
                setValue(key, data?.[key as string], {
                    shouldValidate: true,
                });

                // extraFuntion(data?.[key], key)
            }
            // setClientValue(() => data?.client_value)


        } else {

        }
        if (isSuccessApi) {
            setData(() => { })
            setClientTime(() => [])
            setModal(enter)
            if (data?.graph_item_id > 0) {
                setExtraModalClose()
                dispatch(isGrapItemDelete(+data?.graph_item_id))
            }
            setActiveTab2('0')
            setCashRegObj(() => ({ pay_total_price: 0, discount: 0, debt_price: 0 }))
            setNumberData(() => ({ debt: 0, discount: 0, discount_comment: '', payment_deadline: '', debt_comment: '', discount_send: false }))
            setExtraModalClose2()

            dispatch(isClientDefaultApi())
            let s = getValues(), resetObj = {};
            for (let key in getValues()) {
                resetObj = {
                    ...resetObj, [key]: ''
                }
            }
            setSelectData(() => {
                return {
                    service_id: [],
                    department_id: false
                }
            })
            setClientValue(() => [])
            setQueueNumberTarget({})
            setQueueNumber(0)
            setQueueNumberData([])
            reset(
                resetObj
            )
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
            setServiceIdData(() => [])
        }
    }, [modal, data, isLoading, isSuccessApi])
    const [autocomplateText, setAutocomplateText] = useState('' as any)
    const [sendRole, setSendRole] = useState(false as any)
    const toggle = () => {
        setModal(!modal)
        setData(() => { })
        setEnter(() => false)
        let s = getValues(), resetObj = {};
        for (let key in getValues()) {
            resetObj = {
                ...resetObj, [key]: ''
            }
        }
        setClientTime(() => [])

        setClientValue(() => [])
        setServiceIdData(() => [])
        setSelectData(() => {
            return {
                service_id: [],
                department_id: false
            }
        })
        setQueueNumberTarget({})
        setQueueNumber(0)
        setQueueNumberData([])
        setActiveTab2('0')
        setCashRegObj(() => ({ pay_total_price: 0, discount: 0, debt_price: 0 }))
        setNumberData(() => ({ debt: 0, discount: 0, discount_comment: '', payment_deadline: '', debt_comment: '', discount_send: false }))
        reset(
            resetObj
        )
        setActiveTab('1')
    };
    const cameraToggle = () => {
        setIsOpenCamera(!isOpenCamera)

    };
    const [isOpenCamera, setIsOpenCamera] = useState(false);
    // const [item, setItem] = useState({} as any)
    const clinetValueMap = (data: any) => {

        if (data?.length > 0) {
            return data?.map((item: any) => {
                return {
                    status: 'old',
                    ...item?.service,
                    owner: item?.owner,
                    pay_price: item?.pay_price ?? 0,
                    is_active: +item?.is_active ? 1 : 0,
                    qty: +item?.qty,
                    service_id: item?.service_id,
                    department_id: item?.department_id,
                    price: item?.price,

                    discount: item?.discount ?? 0,
                    id: item?.id,
                    is_pay: +item?.is_pay ? 1 : 0,

                }
            })
        }
        return []
    }
    const [useBalance, setUseBalance] = useState(false)
    const sendApi = (e: any, cond?: any) => {
        let cashregobjSend = {

        } as any,
            oldClientValue = []
        if (cond) {
            cashregobjSend = {
                balanse: `${qarzi([...clinetValue], cashRegObj.pay_total_price, true, data?.balance)}`,
                pay_type: payStatus?.find((a: any) => a?.value == activeTab2)?.key,
                pay_total_price: `${cashRegObj.pay_total_price}`,
                use_balance: useBalance ? '1' : '0',
                discount_comment: numberData?.discount_comment ?? '-',
                debt_comment: numberData?.debt_comment ?? '-',
                debt_price: `${cashRegObj?.debt_price ?? 0}`,
                payment_deadline: `${numberData?.payment_deadline ?? '-'}`,
                discount_price: `${(cashRegObj?.discount) ?? 0}`,
                // pay_type: cashRegObj?.pay_type,
                // balanse: `${qarzi([...clinetValue], cashRegObj.pay_total_price, true, data?.balance)}`,
                use_balanse: `${qarzi([...clinetValue], cashRegObj.pay_total_price, true, data?.balance, true)}`,
                pay_balanse: `${qarzi([...clinetValue], cashRegObj.pay_total_price, true, data?.balance) - data?.balance > 0 ? qarzi([...clinetValue], cashRegObj.pay_total_price, true, data?.balance) - data?.balance : 0}`
            }
            oldClientValue = clinetValue?.filter((item: any) => item?.status == 'old')?.map((res: any) => {
                return {
                    id: res?.id ?? 0,
                    service_id: res?.service_id,
                    department_id: res?.department_id,
                    price: res.price,
                    qty: res.qty ?? 1,
                    is_probirka: res?.department?.probirka,
                    discount: res?.discount,
                    is_active: +res?.is_active ? 1 : 0,
                    // is_pay: +res?.is_pay ? 1 : 0,

                }
            })
        }
        let newservice = clinetValue?.filter((item: any) => (!item?.status || item?.status != 'old') && item?.service_product?.length > 0)

        if (newservice?.length > 0) {
            let is_qrcode = newservice?.find((item: any) => {
                const totalQty = (item.client_use_product ?? [])?.reduce((a: any, b: any) => a + +b?.qty, 0)
                const restotalQty = (item.service_product ?? [])?.reduce((a: any, b: any) => a + +b?.qty, 0) * item.qty
                return restotalQty - totalQty > 0
            })

            console.log('newservice', newservice);
            console.log('is_qrcode', is_qrcode);
            console.log('newservice', newservice);

            if (is_qrcode) {
                alert('Qr kodni skaner qiling')
                return;
            }
        }


        dispatch(isClientAdd({
            query: queryObj({
                ...data, ...e,
                ...cashregobjSend,
                queue_number_data: JSON.stringify(
                    queueNumberData?.map((item: any) => {
                        return {
                            department_id: item?.department.id,
                            queue_number: item?.queue_number
                        }
                    })
                ),
                referring_doctor_id: `${e.referring_doctor_id ?? 0}`,
                advertisements_id: `${e.advertisements_id ?? 0}`,
                graph_item_id: `${+e?.graph_item_id > 0 ? e?.graph_item_id : 0}`,
                agreement_time: `${data?.agreement_time?.value?.length > 0 ? e?.agreement_time?.value : 0}`,
                agreement_date: `${data?.agreement_date?.length > 0 ? e?.agreement_date : 0}`,
                id: `${+data?.id > 0 ? data?.id : 0}`,
                parent_id: null,
                autocomplate_id: `${+e?.parent_id > 0 ? e?.parent_id : 0}`,
                edit_parent_id: `${+e?.parent_id > 0 ? e?.parent_id : 0}`,
                client_value: JSON.stringify(
                    clinetValue?.filter((item: any) => !item?.status || item?.status != 'old')?.map((res: any) => {
                        return {
                            id: res?.id ?? 0,
                            service_id: res?.service_id,
                            department_id: res?.department_id,
                            price: res.price,
                            qty: res.qty ?? 1,
                            is_probirka: res?.department?.probirka,
                            discount: res?.discount,
                        }
                    })
                ),
                old_client_value: JSON.stringify(oldClientValue),
                client_time: JSON.stringify(
                    clientTime
                        ?.filter((res: any) => +res?.department?.is_reg_time)
                        ?.map((res: any) => {
                            return {
                                department_id: res?.department.id,
                                agreement_time: res?.agreement_time?.value,
                            }
                        })

                )
            })
        }))
        setDebtModal(false)
    }
    const cashRegCondition = (e: any) => {
        let jami = clinetValue?.reduce((a: any, b: any) => a + (+b.is_active ? +totalCalc(b) - (chegirmaHisobla(b)) : 0), 0) as any
        let toladi = clinetValue?.reduce((a: any, b: any) => a + +b.pay_price, 0) as any

        if (cashRegObj.pay_total_price < 0 && payStatus?.reduce((a: any, b: any) => a + b?.price, 0) != cashRegObj.pay_total_price) {
            alert('qaytarish uchun boshqa tolov turini tanlang!')
        } else {
            let qarz = qarzi([...clinetValue], cashRegObj.pay_total_price)
            if (qarz == 0) {
                sendApi(e, true)
            } else {
                debtToggle()
            }
            // if (jami - toladi - cashRegObj.pay_total_price > 0 && Math.abs(+qarz) > 0) {
            //     if (qarz > 0) {
            //         debtToggle()
            //     } else {
            //         sendApi(e, true)
            //     }
            // } else {
            //     sendApi(e, true)
            // }
        }
    }
    const send = (e: any) => {
        // e.preventDefault()
        if (clinetValue?.length == 0) {
            alert("Xizmatlarni tanlang!")
        } else {
            let qn = regDepartmentUnique(selectData?.service_id?.filter((res: any) => !new Set(data?.client_value?.map((mm: any) => mm.department_id)).has(res.data?.department.id)))

            if (+user?.is_cash_reg) {

                if (activeTab2 > 0) {
                    cashRegCondition(e)
                } else {
                    alert("To'lov turini  tanlang!")

                }
            } else {
                sendApi(e)
            }

        }
        // if (id?.toString()?.length ?? 0 > 0) {
        //   dispatch(isProductEdit({ query: query({ ...data, product_value: JSON.stringify(product_values) }, ['photo']), file: file, id: id }))
        // } else {
        //   dispatch(isProductAdd({ query: query({ ...data, product_value: JSON.stringify(product_values) }, ['photo']), file: file }))
        // }
        // if (data?.id?.toString()?.length ?? 0 > 0) {
        //     dispatch(isClientEdit({ query: query({ ...data, ...e, probirka: `${e?.probirka ? 0 : 1}`, client_value: JSON.stringify(clinetValue) }), id: data?.id }))
        //     /////// dispatch(isCostEdit(data)) 
        // } else {
        //     dispatch(isClientAdd({ query: query({ ...data, ...e, probirka: `${e?.probirka ? 0 : 1}`, client_value: JSON.stringify(clinetValue) }) }))
        // }

    }
    const [activeTab2, setActiveTab2] = useState(0 as any);
    const cardRef = useRef<HTMLDivElement>(null);
    const scrollToBottom = () => {
        if (cardRef.current) {
            // Scroll to the bottom of the card
            cardRef.current.scrollTo({
                top: cardRef.current.scrollHeight - cardRef.current.clientHeight,
                behavior: 'smooth', // Enables smooth scrolling
            });
        }
    }
        ;
    const [payStatus, setPayStatus] = useState([
        {
            label: 'Naqd',
            value: 1,
            key: 'cash',
            price: 0,
            icon: <FaMoneyBillWave />
        },
        {
            label: 'Plastik',
            value: 2,
            key: 'card',
            price: 0,
            icon: <FaMoneyCheck />
        },
        {
            label: "O'tkazma",
            value: 3,
            key: 'transfer',
            price: 0,
            icon: <BiTransfer />
        },
        {
            label: 'Aralash',
            value: 4,
            key: 'mix',
            icon: <FaMoneyBillWave />
        },
    ])
    const [isDebt, setIsDebt] = useState(false)
    const toggleTab = (tab: any) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    };
    const [clientTime, setClientTime] = useState([] as any)
    const clientTimeFun = (data: any) => {
        return clientTime?.filter((item: any) => +item?.department?.is_reg_time)
    }
    const clientNavbatFun = (data: any, selectData: any) => {
        if (data?.client_value?.length > 0) {
            return [
                ...regDepartmentUnique((data?.client_value ?? [])?.map((kk: any) => {
                    return {
                        data: {
                            department: kk?.service?.department
                        }
                    }
                })),
                ...regDepartmentUnique(selectData?.service_id?.filter((res: any) => !new Set(data?.client_value?.map((mm: any) => mm?.department_id)).has(res?.data?.department?.id)))

            ]
        }
        return [

            ...regDepartmentUnique(selectData?.service_id)

        ]
    }

    const workingDateCheck = async (id: any) => {
        try {
            setLoading(() => true)

            let res = await axios.get(`/graph/working-date-check?date=${user?.graph_format_date}&department_id=${id}&is_reg=1`)
            const { result } = res.data
            if (!result?.is_working) {
                alert('ish kuni emas')
            } else
                if (result?.data?.length > 0) {
                    let find = clientTime?.find((item: any) => item?.department?.id == id)
                    if (find) {

                        setClientTime(() => clientTime?.map((res: any) => {
                            if (res?.department.id == id) {
                                return {
                                    ...res,
                                    agreement_time: '',
                                    agreement_time_data: result?.data?.map((item: any) => {
                                        return {
                                            value: item,
                                            label: item
                                        }
                                    })
                                }
                            }
                            return res
                        }))
                    } else {
                        setClientTime(() => [
                            ...clientTime,
                            {
                                agreement_time: '',
                                agreement_time_data: result?.data?.map((item: any) => {
                                    return {
                                        value: item,
                                        label: item
                                    }
                                })
                            }
                        ])
                    }
                } else if (result?.data?.length == 0) {
                    alert('vaqt qolmagan')
                }

            // dispatch(isGrapItemDelete(+result?.id))
            // setGraphItem(() => graphItem?.filter((res: any) => res?.id !== +result?.id))
            // setModal(false)
        } catch (error) {
        } finally {
            setLoading(() => false)
        }
    }
    const [debtModal, setDebtModal] = useState(false)
    const [isMonoBlock, setIsMonoBlock] = useState(false)
    const [isQueueModal, setIsQueueModal] = useState(false)
    const queueToggle = () => {
        setIsQueueModal(!isQueueModal)
    }
    const debtToggle = () => {
        setDebtModal(!debtModal)
    }

    const monoblokToggle = () => {
        setIsMonoBlock(!isMonoBlock)
        // setSelectData({
        //     ...selectData,
        //     department_id: false
        // })
    }

    const [discountModal, setDiscountModal] = useState(false)
    const discountToggle = () => {
        setDiscountModal(!discountModal)
    }

    const [clintCopyValue, setClintCopyValue] = useState([] as any)
    const [serviceIdData, setServiceIdData] = useState([] as any)

    const [numberData, setNumberData] = useState({
        debt: 0,
        discount: 0,
        discount_comment: '',
        payment_deadline: '',
        debt_comment: '',
        discount_send: false
    } as any)
    const [cashRegObj, setCashRegObj] = useState({
        pay_type: '',
        pay_total_price: 0,
        debt_price: 0,
        discount: 0
    } as any)
    const [queueNumberData, setQueueNumberData] = useState([] as any)
    const [queueNumber, setQueueNumber] = useState(0 as any)
    const [queueNumberTargtet, setQueueNumberTarget] = useState({} as any)
    const isCheckQueue = async (id: any) => {
        try {
            setLoading(() => true)
            let res = await axios.get(`/department/queue-number-limit/${id}`)
            const { result } = res.data
            let find = data?.client_value?.find((findItem: any) => findItem?.service?.department.id === id)
            if (find) {
                setQueueNumber(() => find?.queue_number)
            }
            setQueueNumberTarget(() => {
                return {
                    ...result,
                    data: result?.data?.filter((item: any) => item != find?.queue_number)
                }
            })

            queueToggle()
        } catch (error) {

        }
        finally {
            setLoading(() => false)
        }

    }
    return (
        <>
            <Loader loading={sendLoading || loading || loading2} />
            <Modal centered={true} isOpen={modal} toggle={toggle} role='dialog' size='xl' backdrop="static" keyboard={false} fullscreen>
                <ToastContainer />
                <form onSubmit={handleSubmit(send)} className="size_16">

                    <div className="modal-header">
                        <div className="d-flex gap-5 ">
                            <h5 className="modal-title" id="modalCenterTitle">Mijoz qo'shish</h5>
                            <h3 className='fw-blod'>
                                Yoshi:{getValues('data_birth')?.length > 0 ? calculateAge(getValues('data_birth'), user?.graph_format_date) : 0}
                            </h3>
                        </div>
                        <button onClick={toggle} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body overflow-none "
                        style={{
                            // height:'120%'
                        }}

                    >

                        <div className="row h-100">
                            <div className={`col-${+user?.is_cash_reg ? '9' : '12'} `}>
                                <div className="row border border-primary border-5 rounded mb-3">
                                    <div className="col-3 mb-1">
                                        <label className="form-label">F.I.O <span className='text-danger fw-bold'>*</span></label>
                                        <Input required={true}
                                            disabled={data?.id > 0}
                                            type="text" placeholder="Familiyasi"  {...register('first_name')} name='first_name'
                                            error={errors.first_name?.message?.toString() || hasError?.errors?.first_name?.toString()}
                                        />
                                    </div>
                                    {/* <div className="col-3 mb-1">
                                        <label className="form-label">Ismi  <span className='text-danger fw-bold'>*</span></label>
                                        <Input type="text" placeholder="Ismi"  {...register('last_name')} name='last_name'
                                            error={errors.last_name?.message?.toString() || hasError?.errors?.last_name?.toString()}
                                        />
                                    </div> */}
                                    {
                                        +user?.setting?.is_reg_data_birth ?
                                            <div className={`col-3 mb-1 ${+user?.setting?.is_reg_data_birth ? '' : 'd-none'}`}>
                                                <label className="form-label">Tug'ilgan sanasi
                                                    {
                                                        +user?.setting?.is_reg_data_birth ? <span className='text-danger fw-bold'> *</span> : ''
                                                    }
                                                </label>
                                                <Input required type="date" placeholder="Ismi"  {...register('data_birth')} name='data_birth'
                                                    onChange={(e: any) => {
                                                        let value = e.target.value
                                                        setValue('data_birth', value, {
                                                            shouldValidate: true
                                                        })
                                                        if (value.length > 0 && getValues('phone')?.length == 9) {
                                                            let target = `?data_birth=${value}&phone=${getValues('phone')}`
                                                            if (pathname == '/') {
                                                                if (autocomplateText !== target) {
                                                                    setAutocomplateText(target)
                                                                    autocomplate(target)
                                                                }
                                                            }


                                                        }
                                                        else {
                                                            setAutocomplateText('')
                                                        }
                                                    }}
                                                    error={errors.data_birth?.message?.toString() || hasError?.errors?.data_birth?.toString()}
                                                />
                                            </div> : ''
                                    }
                                    {
                                        +user?.setting?.is_reg_phone ?
                                            <div className={`col-3 mb-1 ${+user?.setting?.is_reg_phone ? '' : 'd-none'}`}>
                                                <label className="form-label">Telefon raqami {
                                                    +user?.setting?.is_reg_phone ? <span className='text-danger fw-bold'> *</span> : ''
                                                }</label>
                                                <input type="hidden" {...register('phone')} name='phone' />
                                                <div className="input-group">
                                                    <div className="input-group-text">
                                                        +998
                                                    </div>
                                                    <PatternFormat
                                                        format="(##) ###-##-##"
                                                        mask="_"
                                                        disabled={getValues('data_birth')?.length > 0 ? false : true}
                                                        value={getValues('phone')}
                                                        allowEmptyFormatting
                                                        className='form-control'
                                                        placeholder="+998 (___) ___-____"
                                                        onChange={(e: any) => {
                                                            let value = e.target.value.replace(/[^\d]/g, '');

                                                            setValue('phone', value, {
                                                                shouldValidate: true,
                                                            });
                                                            if (value.length == 9) {
                                                                let target = `?phone=${value}&data_birth=${getValues('data_birth')}`
                                                                if (pathname == '/') {
                                                                    if (autocomplateText !== target) {
                                                                        setAutocomplateText(target)
                                                                        autocomplate(target)
                                                                    }
                                                                }


                                                            }
                                                            else {
                                                                setAutocomplateText('')
                                                            }
                                                        }}
                                                    />
                                                    {
                                                        complateLoading ? <div className="input-group-text">
                                                            <Spinner animation="border" />
                                                        </div> : ''
                                                    }
                                                </div>
                                                <ErrorInput>
                                                    {errors.phone?.message?.toString() || hasError?.errors?.phone?.toString()}
                                                </ErrorInput>

                                            </div> : ''
                                    }
                                    {
                                        +user?.setting?.is_reg_sex ?
                                            <div className={`col-3 mb-1 ${+user?.setting?.is_reg_sex ? '' : 'd-none'}`}>
                                                <label className="form-label">jinsi {
                                                    +user?.setting?.is_reg_sex ? <span className='text-danger fw-bold'> *</span> : ''
                                                }</label>
                                                <div className="d-flex gap-3">
                                                    <div className="form-check ">
                                                        <input className="form-check-input" type="radio" id="male" {...register('sex')} name='sex' value={'male'} />
                                                        <label className="form-check-label" htmlFor="male"> erkak </label>
                                                    </div>
                                                    <div className="form-check ">
                                                        <input className="form-check-input" type="radio" id="female" {...register('sex')} name='sex' value={'female'} />
                                                        <label className="form-check-label" htmlFor="female"> ayol </label>
                                                    </div>
                                                </div>
                                                <ErrorInput>
                                                    {errors.sex?.message?.toString() || hasError?.errors?.sex?.toString()}
                                                </ErrorInput>
                                            </div> : ''
                                    }
                                    <div className="col-3 mb-1">
                                        <label className="form-label">Yullanma</label>
                                        <div className="d-flex">
                                            <div className="w-100">

                                                <Select
                                                    // isDisabled={data?.department?.id>0 ? true : false}
                                                    name='name3'
                                                    value={selectData?.referring_doctor_id}
                                                    onChange={(e: any) => {
                                                        setSelectData({
                                                            ...selectData,
                                                            referring_doctor_id: e
                                                        })
                                                        setValue('referring_doctor_id', e.value, {
                                                            shouldValidate: true,
                                                        })


                                                    }}
                                                    className="basic-multi-select"
                                                    classNamePrefix="select"
                                                    // value={userBranch}
                                                    options={
                                                        [
                                                            {
                                                                value: 0,
                                                                label: 'Barchasi'
                                                            },
                                                            ...referringDoctorDataSelect(referringDoctorData.data)
                                                        ]
                                                    } />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setModal2(() => true)
                                                }}
                                                // onFocus={togglePopover}
                                                className="btn btn-icon btn-primary input-group-text">
                                                <span className="tf-icons bx bx-plus" />
                                            </button>
                                        </div>
                                        <ErrorInput>
                                            {errors.referring_doctor_id?.message?.toString() || hasError?.errors?.department_id?.toString()}
                                        </ErrorInput>
                                    </div>

                                    <div className="col-3 mb-1">
                                        <label className="form-label">Reklama</label>
                                        <div className="d-flex">
                                            <div className="w-100">

                                                <Select
                                                    // isDisabled={data?.department?.id>0 ? true : false}
                                                    name='name3'
                                                    value={selectData?.advertisements_id}
                                                    onChange={(e: any) => {
                                                        setSelectData({
                                                            ...selectData,
                                                            advertisements_id: e
                                                        })
                                                        setValue('advertisements_id', e.value, {
                                                            shouldValidate: true,
                                                        })
                                                    }}
                                                    className="basic-multi-select"
                                                    classNamePrefix="select"
                                                    // value={userBranch}
                                                    options={
                                                        [
                                                            {
                                                                value: 0,
                                                                label: 'Barchasi'
                                                            },
                                                            ...advertisementsDataSelect(advertisementsData)
                                                        ]
                                                    } />
                                            </div>
                                            {/* <button
                                            type="button"
                                            onClick={() => {
                                                setModal2(() => true)
                                            }}
                                            // onFocus={togglePopover}
                                            className="btn btn-icon btn-primary input-group-text">
                                            <span className="tf-icons bx bx-plus" />
                                        </button> */}
                                        </div>
                                        <ErrorInput>
                                            {errors.advertisements_id?.message?.toString() || hasError?.errors?.advertisements_id?.toString()}
                                        </ErrorInput>
                                    </div>

                                    <div className={`col-3 mb-1 ${clientTimeFun(clientTime)?.length > 0 ? '' : 'd-none'}`}>
                                        <label className="form-label">Bo'lim vaqti</label>
                                        <div className="">
                                            {clientTimeFun(clientTime)?.map((item: any) => {
                                                return (
                                                    <div className='d-flex input-group mb-1'>
                                                        <p className='form-control mb-0'>
                                                            {item?.department?.name}
                                                        </p>
                                                        <button className='btn btn-info input-group-text'
                                                            type='button'
                                                            onClick={() => {
                                                                workingDateCheck(item?.department?.id)
                                                            }}

                                                        >
                                                            <MdToday />
                                                        </button>
                                                        <Select
                                                            name='name3'
                                                            required

                                                            value={item?.agreement_time}
                                                            isDisabled={item?.agreement_time?.value?.length > 0 ? true : false}
                                                            onChange={(e: any) => {
                                                                setClientTime(clientTime?.map((_: any, index: number) => {
                                                                    if (_?.department?.id === item?.department.id) {
                                                                        return {
                                                                            ..._,
                                                                            agreement_time: e
                                                                        }
                                                                    }
                                                                    return _
                                                                }))
                                                            }}
                                                            className="basic-multi-select"
                                                            classNamePrefix="select"
                                                            options={item?.agreement_time_data} />
                                                        <div>

                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                    <div className={`col-3 mb-1 ${clientNavbatFun(data, selectData)?.length > 0 ? '' : 'd-none'}`}>
                                        <label className="form-label">Navbati</label>
                                        {
                                            // JSON.stringify(data?.client_value)
                                        }
                                        <div className="d-flex gap-1">
                                            {clientNavbatFun(data, selectData)?.map((item: any) => {
                                                return (
                                                    <div className=' mb-1'>
                                                        <button className='btn btn-info  position-relative' type='button' onClick={() => {
                                                            isCheckQueue(item?.data?.department?.id)
                                                        }}>
                                                            {item?.data?.department?.name}
                                                            <input type="number" value={queueNumberData?.find((findItem: any) => findItem?.department?.id === item?.data?.department?.id)?.queue_number > 0 ? queueNumberData?.find((findItem: any) => findItem?.department?.id === item?.data?.department?.id)?.queue_number : data?.client_value?.find((findItem: any) => findItem?.service?.department.id === item?.data?.department?.id)?.queue_number ?? '0'} min={1} required style={{
                                                                opacity: 0,
                                                                position: 'absolute',
                                                                zIndex: -1,
                                                                top: 0,
                                                                left: 0
                                                            }} />
                                                            <span className='badge bg-white text-info ms-2'>
                                                                {
                                                                    queueNumberData?.find((findItem: any) => findItem?.department?.id === item?.data?.department?.id)?.queue_number > 0 ? queueNumberData?.find((findItem: any) => findItem?.department?.id === item?.data?.department?.id)?.queue_number : data?.client_value?.find((findItem: any) => findItem?.service?.department.id === item?.data?.department?.id)?.queue_number ?? '-'
                                                                }
                                                            </span>
                                                        </button>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    {
                                        +user?.setting?.is_reg_monoblok ? <div>
                                            <button
                                                type='button'
                                                onClick={() => monoblokToggle()}
                                                className='btn btn-primary'>
                                                + Xizmat qo'shish
                                            </button>
                                        </div> : <>
                                            <div className="col-6 mb-2">
                                                <label className="form-label">Bo'lim nomi</label>
                                                <input type="hidden" {...register('department_id')} name='department_id' />
                                                <div className="d-flex">
                                                    <div className="w-100">

                                                        <Select
                                                            // isDisabled={data?.department?.id>0 ? true : false}
                                                            name='name3'
                                                            value={selectData?.department_id}
                                                            onChange={(e: any) => {
                                                                setSelectData({
                                                                    ...selectData,
                                                                    department_id: e
                                                                })


                                                            }}
                                                            className="basic-multi-select"
                                                            classNamePrefix="select"
                                                            // value={userBranch}
                                                            options={
                                                                [
                                                                    {
                                                                        value: 0,
                                                                        label: 'Barchasi'
                                                                    },
                                                                    ...dataSelect(departmentData)]
                                                            } />
                                                    </div>
                                                    {/* <button
                                            type="button"
                                            onClick={() => {
                                                setModal2(() => true)
                                            }}
                                            // onFocus={togglePopover}
                                            className="btn btn-icon btn-primary input-group-text">
                                            <span className="tf-icons bx bx-plus" />
                                        </button> */}
                                                </div>
                                                <ErrorInput>
                                                    {errors.department_id?.message?.toString() || hasError?.errors?.department_id?.toString()}
                                                </ErrorInput>
                                            </div>
                                            <div className="col-6 mb-2">
                                                <label className="form-label">
                                                    <span>
                                                        Xizmatlar
                                                    </span>
                                                    {" "}
                                                    <span className='bg-success text-white p-1'>
                                                        Jami: {' '}
                                                        <NumericFormat displayType="text"
                                                            thousandSeparator
                                                            decimalScale={2}
                                                            value={clinetValue?.reduce((a: any, b: any) => a + +(b?.price ?? 0) * (b?.qty ?? 1), 0)} /> {' '}
                                                        so'm
                                                    </span>
                                                </label>
                                                <div className="d-flex w-100">
                                                    <div className="w-100">
                                                        <Select
                                                            name='name3'
                                                            value={selectData?.service_id}
                                                            isMulti
                                                            onChange={(e: any) => {
                                                                setActiveTab2('0')
                                                                setCashRegObj(() => ({ pay_total_price: 0, discount: 0, debt_price: 0 }))
                                                                setNumberData(() => ({ payment_deadline: 0, debt_comment: '', discount_comment: '' }))
                                                                let result = e
                                                                let dep = getUniqueDepartments(e ?? [])?.filter((res: any) => !new Set(data?.client_time?.map((item: any) => item?.department_id)).has(res?.id))
                                                                if (dep?.length > 0) {
                                                                    for (let key of dep) {
                                                                        let find = clientTime?.find((item: any) => item?.department.id == key?.id)
                                                                        if (find) {
                                                                            setClientTime(() => clientTime?.map((res: any) => {
                                                                                return res?.department.id == key?.id ? {
                                                                                    department: key,
                                                                                    agreement_time: false

                                                                                } : res
                                                                            }))
                                                                        } else {
                                                                            setClientTime([...clientTime, { department: key }])
                                                                        }
                                                                        //   setClientTime(()=>clin)
                                                                    }
                                                                }
                                                                let depId = [... new Set(result?.map((item: any) => item?.department?.id))]
                                                                if (depId?.length > 0) {
                                                                    setQueueNumberData(() => queueNumberData?.filter((res: any) => new Set(depId).has(res?.department?.id)))
                                                                } else {
                                                                    setQueueNumberData(() => [])
                                                                }


                                                                let newsdata = clientTime?.filter((res: any) => res.status != 'old');

                                                                for (let key of newsdata) {
                                                                    if (!dep?.find((item: any) => item?.id == key?.department?.id)) {
                                                                        setClientTime(() => clientTime?.filter((res: any) => res?.department.id != key?.department.id))
                                                                    }
                                                                }


                                                                if (+data?.id > 0) {
                                                                    if (result?.length == 0) {
                                                                        setSelectData({
                                                                            ...selectData,
                                                                            service_id: [],
                                                                            department_id: false,
                                                                        })
                                                                        let resdata = data?.client_value?.map((item: any) => {
                                                                            return {
                                                                                status: 'old',
                                                                                ...item?.service,
                                                                                qty: +item?.qty,
                                                                                pay_price: item?.pay_price,
                                                                                is_active: +item?.is_active ? 1 : 0,
                                                                                service_id: item?.service_id,
                                                                                department_id: item?.department_id,
                                                                                id: item?.id,
                                                                                price: item?.price,
                                                                                owner: item?.owner,
                                                                                total_price: +item?.total_price > 0 ? (+item?.qty > 0 ? item?.qty : 1) * item?.price : (+item?.qty > 0 ? item?.qty : 1) * item?.price,
                                                                                discount: item?.discount ?? 0,
                                                                                client_use_product: item?.client_use_product ?? []


                                                                            }
                                                                        })
                                                                        setClientValue(() => resdata)
                                                                    }

                                                                    else {

                                                                        setSelectData({
                                                                            ...selectData,
                                                                            service_id: result,
                                                                            department_id: false,
                                                                        })
                                                                        setClientValue(() => [
                                                                            ...data?.client_value?.map((item: any) => {
                                                                                return {
                                                                                    status: 'old',
                                                                                    ...item?.service,
                                                                                    qty: +item?.qty,
                                                                                    pay_price: item?.pay_price,
                                                                                    is_active: +item?.is_active ? 1 : 0,
                                                                                    service_id: item?.service_id,
                                                                                    department_id: item?.department_id,
                                                                                    id: item?.id,
                                                                                    owner: item?.owner,
                                                                                    price: item?.price,
                                                                                    total_price: +item?.total_price > 0 ? (+item?.qty > 0 ? item?.qty : 1) * item?.price : (+item?.qty > 0 ? item?.qty : 1) * item?.price,
                                                                                    discount: item?.discount ?? 0,
                                                                                    is_pay: +item?.is_pay ? 1 : 0,
                                                                                    client_use_product: item?.client_use_product ?? []



                                                                                }
                                                                            }),
                                                                            ...result
                                                                                .map((item: any) => {
                                                                                    return {
                                                                                        ...item?.data,
                                                                                        pay_price: item?.pay_price ?? 0,
                                                                                        is_active: 1,
                                                                                        id: nanoid(),
                                                                                        department_id: item?.data?.department?.id,
                                                                                        service_id: item?.value,
                                                                                        discount: 0,
                                                                                        total_price: (+item?.qty > 0 ? item?.qty : 1) * item?.price,
                                                                                        qty: 1,
                                                                                        client_use_product: item?.client_use_product ?? []

                                                                                    }
                                                                                }),
                                                                        ])
                                                                    }
                                                                } else {
                                                                    setSelectData({
                                                                        ...selectData,
                                                                        service_id: result,
                                                                        department_id: false,
                                                                    })
                                                                    setClientValue(() => [
                                                                        ...result
                                                                            ?.map((item: any) => {
                                                                                return {

                                                                                    ...item?.data,
                                                                                    owner: item?.owner,
                                                                                    pay_price: item?.pay_price ?? 0,
                                                                                    id: nanoid(),
                                                                                    is_active: 1,
                                                                                    service_id: item?.value,
                                                                                    department_id: item?.data?.department?.id,
                                                                                    total_price: (+item?.qty > 0 ? item?.qty : 1) * item?.price,
                                                                                    discount: 0,
                                                                                    qty: 1
                                                                                }
                                                                            }),
                                                                    ])
                                                                }

                                                            }}
                                                            className="basic-multi-select"
                                                            classNamePrefix="select"
                                                            // value={userBranch}
                                                            options={
                                                                [

                                                                    ...dataSelect(serviceData
                                                                        // ?.filter((item: any) => {
                                                                        //     return +data?.id > 0 ? (data?.client_value?.find((res: any) => res?.service.id == item?.id) ? false : true) : true
                                                                        // })
                                                                        .filter((item: any) => selectData?.department_id?.value > 0 ? item.department.id == selectData?.department_id?.value : true)
                                                                    )
                                                                ]
                                                            } />
                                                    </div>
                                                    {/* <button
                                            type="button"
                                            onClick={() => {
                                                setModal2(() => true
                                            }}
                                            // onFocus={togglePopover}
                                            className="btn btn-icon btn-primary input-group-text">
                                            <span className="tf-icons bx bx-plus" />
                                        </button> */}
                                                </div>
                                            </div>
                                        </>
                                    }


                                    <div className="col-12 mb-1">


                                        <ErrorInput>
                                            {errors.department_id?.message?.toString() || hasError?.errors?.department_id?.toString()}
                                        </ErrorInput>
                                    </div>
                                    <div style={{
                                        maxHeight: `${window.innerHeight / 2.2}px`,
                                        overflow: 'auto'
                                    }}>

                                        <table className="table table-bordered my-2">
                                            <thead>
                                                <tr>
                                                    <th>
                                                        №
                                                    </th>
                                                    <th>
                                                        Xizmat nomi
                                                    </th>
                                                    <th>
                                                        Amallar
                                                    </th>
                                                    <th>
                                                        Narxi
                                                    </th>
                                                    <th>
                                                        Kim tomonidan
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                                {clinetValue?.length > 0 ? clinetValue?.map((item: any, index: any) => {
                                                    let result = 'danger' as any;
                                                    if (+item?.is_active && (+totalCalc(item) - chegirmaHisobla(item) - +item?.pay_price) == 0) {
                                                        result = 'success'
                                                    } else if (+item?.is_active && (+totalCalc(item) - chegirmaHisobla(item) - +item?.pay_price) != 0 && +item?.pay_price > 0) {
                                                        result = 'info'
                                                    } else if (+item?.is_active && item?.pay_price == 0) {
                                                        result = 'warning'
                                                    }
                                                    return <tr key={item?.id}>
                                                        <td key={item.index} className={` p-1 bg-${result} text-white  h-100 `}>

                                                            <span className='mr-3'
                                                                style={{
                                                                    display: 'inline-block',
                                                                    width: '30px',
                                                                }}
                                                            >
                                                                {index + 1}
                                                            </span>
                                                            <span className={`cursor-pointer ${item?.service_product?.length > 0 ? '' : 'd-none'}`}
                                                                onClick={() => {
                                                                    cameraToggle()
                                                                    setCheckProductItem(() => item)
                                                                    setCheckProductItemId(() => item?.id)
                                                                    setCameraReset(() => true)
                                                                    if (item?.status == 'old') {
                                                                        setCameraReset(() => true)
                                                                    } else {
                                                                        startScan(item)
                                                                        setCameraReset(() => false)

                                                                    }

                                                                }}
                                                            >
                                                                <BsQrCodeScan className='' size={28} />
                                                            </span>
                                                        </td>
                                                        <td>

                                                            <p className={`${item?.service_product?.length > 0 ? item?.service_product?.reduce((a: any, b: any) => a + +b?.qty, 0) * item?.qty - (item?.client_use_product ?? [])?.reduce((a: any, b: any) => a + +b?.qty, 0) > 0 ? 'text-danger' : ''
                                                                : ''}`}>
                                                                {item?.name}
                                                            </p>
                                                        </td>
                                                        <td className='d-flex gap-1'>

                                                            <div className="btn-group" role="group" aria-label="Basic example">
                                                                <button type="button"
                                                                    disabled={item.status == 'old'}
                                                                    className="btn btn-danger btn-sm"
                                                                    onClick={() => {
                                                                        setClientValue(() => {
                                                                            return clinetValue?.map((res: any) => {
                                                                                if (res?.id == item?.id) {
                                                                                    return {
                                                                                        ...res,
                                                                                        qty: res?.qty > 1 ? res?.qty - 1 : 1
                                                                                    }
                                                                                }
                                                                                return res
                                                                            })
                                                                        })
                                                                    }}

                                                                >-</button>
                                                                <input type="number" className='form-control'
                                                                    style={{
                                                                        width: '100px'
                                                                    }}
                                                                    name=""
                                                                    value={item?.qty}
                                                                    min={1}
                                                                    disabled={item.status == 'old'}
                                                                    onChange={(e: any) => {
                                                                        // if (+e.target.value >= 1) {
                                                                        setClientValue(() => {
                                                                            return clinetValue?.map((res: any) => {
                                                                                if (res?.id == item?.id) {
                                                                                    return {
                                                                                        ...res,
                                                                                        qty: +e.target.value == 0 ? '' : +e.target.value
                                                                                    }
                                                                                }
                                                                                return res
                                                                            })
                                                                        })
                                                                        // }
                                                                    }}
                                                                    id="" />

                                                                {/* <button type="button" className="btn  btn-sm">{
        (item?.qty || 1)
    }</button> */}
                                                                <button type="button"
                                                                    //  disabled={item?.status == 'old' ? true : false}
                                                                    disabled={item.status == 'old'}

                                                                    className="btn btn-success btn-sm"
                                                                    onClick={() => {
                                                                        setClientValue(() => {
                                                                            return clinetValue?.map((res: any) => {
                                                                                if (res?.id == item?.id) {
                                                                                    return {
                                                                                        ...res,
                                                                                        qty: (res?.qty ?? 1) + 1
                                                                                    }
                                                                                }
                                                                                return res
                                                                            })
                                                                        })

                                                                    }}


                                                                >+</button>
                                                            </div>

                                                            {
                                                                item.status == 'old' ?
                                                                    <div className="form-check d-flex justify-content-center">
                                                                        <input className="form-check-input" type="checkbox" id="defaultCheck1"
                                                                            checked={+item?.is_active ? true : false}
                                                                            onChange={(e: any) => {
                                                                                setActiveTab2(0)
                                                                                setClientValue(() => {
                                                                                    return clinetValue?.map((res: any) => {
                                                                                        if (res?.id == item?.id) {
                                                                                            return {
                                                                                                ...res,
                                                                                                is_active: e?.target?.checked ? 1 : 0
                                                                                            }
                                                                                        }
                                                                                        return res
                                                                                    })
                                                                                })
                                                                            }}
                                                                        />
                                                                    </div> : <button className=" btn btn-sm btn-danger"
                                                                        type='button'
                                                                        disabled={item.status == 'old'}
                                                                        // disabled={data?.id > 0 ? (data?.client_value?.find((res: any) => res?.service_id == item?.service_id) ? true : false) : false}
                                                                        onClick={() => {
                                                                            Swal.fire({
                                                                                title: "Ma'lumotni o'chirasizmi?",
                                                                                showDenyButton: true,
                                                                                showCancelButton: true,
                                                                                confirmButtonText: 'Ha',
                                                                                denyButtonText: `Yo'q`,
                                                                            }).then((result: any) => {
                                                                                if (result.isConfirmed) {
                                                                                    setClientValue(() => clinetValue?.filter((res: any) => res.id != item.id))
                                                                                    if (+user?.setting?.is_reg_monoblok) {
                                                                                        setServiceIdData(() => serviceIdData?.filter((res: any) => res.id != item.service_id))
                                                                                        setSelectData({
                                                                                            ...selectData,
                                                                                            service_id: selectData.service_id.filter((res: any) => res.value != item?.service_id)
                                                                                        })
                                                                                        let depIdFind = selectData.service_id?.filter((item: any) => item?.department?.id == item?.department?.id)

                                                                                        if (depIdFind?.length <= 1) {
                                                                                            setQueueNumberData(() => queueNumberData?.filter((res: any) => new Set([item?.department?.id]).has(res?.department?.id)))
                                                                                        }
                                                                                    } else {
                                                                                        let depIdFind = selectData.service_id?.filter((item: any) => item?.department?.id == item?.department?.id)

                                                                                        if (depIdFind?.length <= 1) {
                                                                                            setQueueNumberData(() => queueNumberData?.filter((res: any) => new Set([item?.department?.id]).has(res?.department?.id)))
                                                                                        }
                                                                                        setSelectData({
                                                                                            ...selectData,
                                                                                            service_id: selectData.service_id.filter((res: any) => res.value != item?.service_id)
                                                                                        })
                                                                                    }
                                                                                    setActiveTab2('0')
                                                                                    setCashRegObj(() => ({ pay_total_price: 0, discount: 0, debt_price: 0 }))
                                                                                    setNumberData(() => ({ payment_deadline: 0, debt_comment: '', discount_comment: '' }))
                                                                                    Swal.fire({
                                                                                        position: 'top-end',
                                                                                        icon: 'success',
                                                                                        title: "Malumot o'chirildi",
                                                                                        showConfirmButton: false,
                                                                                        timer: 2500
                                                                                    })
                                                                                }
                                                                            })
                                                                        }}

                                                                    >
                                                                        <MdDeleteForever />
                                                                    </button>
                                                            }

                                                        </td>
                                                        {/* {JSON.stringify(item)} */}
                                                        <td>
                                                            {/* <NumericFormat displayType="text"
                                                                thousandSeparator
                                                                decimalScale={2}
                                                                value={item?.price ?? 0} /> */}

                                                            <input type="number" className='form-control'
                                                                style={{
                                                                    width: '100px'
                                                                }}
                                                                name=""
                                                                value={item?.price}
                                                                min={1}
                                                                disabled={item.status == 'old' || (+item?.is_change_price ? false : true)}
                                                                onChange={(e: any) => {
                                                                    // if (+e.target.value >= 1) {
                                                                    setClientValue(() => {
                                                                        return clinetValue?.map((res: any) => {
                                                                            if (res?.id == item?.id) {
                                                                                return {
                                                                                    ...res,
                                                                                    price: +e.target.value == 0 ? '' : +e.target.value
                                                                                }
                                                                            }
                                                                            return res
                                                                        })
                                                                    })
                                                                    // }
                                                                }}
                                                                id="" />
                                                        </td>
                                                        <td>
                                                            {`Qabulxona: ${masulRegUchunFullName(item?.owner ?? user)}`}
                                                        </td>
                                                    </tr>
                                                }) : <tr >
                                                    <td colSpan={5} className='text-center p-1'>Malumot topilmadi</td>
                                                </tr>}
                                            </tbody>
                                        </table>



                                    </div>


                                    <div className="col-6">
                                        <div className='row' >

                                            {/* <div className="col-6 mb-1">
                                        <label className="form-label">Fuqoroligi</label>
                                        <div className="d-flex gap-3">
                                            <div className="form-check ">
                                                <input className="form-check-input" type="radio" id="uz" {...register('citizenship')} name='citizenship' value={'uz'} />
                                                <label className="form-check-label" htmlFor="uz"> Uzbek </label>
                                            </div>
                                            <div className="form-check ">
                                                <input className="form-check-input" type="radio" id="chet" {...register('citizenship')} name='citizenship' value={'chet'} />
                                                <label className="form-check-label" htmlFor="chet"> Chet'ellik </label>
                                            </div>
                                        </div>
                                        <ErrorInput>
                                            {errors.citizenship?.message?.toString() || hasError?.errors?.citizenship?.toString()}
                                        </ErrorInput>
                                    </div> */}
                                            {/* <div className="col-12 mb-1">
                                        <label className="form-label">Manzil</label>
                                        <Input type="text" placeholder="Manzil"  {...register('address')} name='address'
                                            error={errors.address?.message?.toString() || hasError?.errors?.address?.toString()}
                                        />
                                    </div> */}


                                        </div>



                                        {/* vaqtlar */}

                                    </div>
                                    <div className="col-6">


                                    </div>
                                </div>
                            </div>
                            <div className={` ${+user?.is_cash_reg ? 'col-3' : 'd-none'}  h-100`}


                            >
                                <div className="card  h-100  border border-primary border-5"
                                    style={{
                                        // background: '#80808054'
                                    }}
                                >

                                    <div className="card-body">
                                        <h4 className='text-center fw-bold mb-1'>
                                            <NumericFormat displayType="text"
                                                thousandSeparator
                                                decimalScale={2}
                                                value={clinetValue?.reduce((a: any, b: any) => a + +(b?.price ?? 0) * (b?.qty ?? 1), 0)} /> {' '} so'm
                                        </h4>
                                        <div className="d-flex justify-content-between">
                                            <div className="d-flex gap-2 align-items-center">
                                                <p>To'langan:</p>
                                                <p className='text-success fw-bold'>  <NumericFormat displayType="text"
                                                    thousandSeparator
                                                    decimalScale={2}
                                                    value={clinetValue?.reduce((acc: number, cur: any) => acc + +(cur?.pay_price ?? 0), 0)} /> </p>
                                            </div>
                                            <div className="d-flex gap-2 align-items-center">
                                                <p>Chegirma</p>
                                                <p className='text-warning fw-bold'>  <NumericFormat displayType="text"
                                                    thousandSeparator
                                                    decimalScale={2}
                                                    value={chegirma(clinetValue)} /> </p>
                                            </div>
                                        </div>
                                        {
                                            activeTab2 == 4 ? <>
                                                {
                                                    payStatus

                                                        ?.filter((item: any,) => item?.value != 4)
                                                        ?.filter((res: any) => {
                                                            if (res?.key == 'cash') {
                                                                return true
                                                            }

                                                            return +user?.setting?.[`is_reg_${res?.key}_pay`]
                                                        })
                                                        ?.map((item: any, index: any) => {
                                                            return <div className="form-input my-4">
                                                                <div className="input-group">
                                                                    <label className="input-group-text bg-info text-white  w-25" htmlFor="html5-text-input">{item?.label}</label>
                                                                    <NumericFormat
                                                                        disabled={cashRegObj?.pay_total_price >= 0 ? false : true}
                                                                        isAllowed={(e: any) => {
                                                                            const { value } = e
                                                                            let total = payStatus?.slice(0, 3)
                                                                                ?.filter((totalItem: any,) => item?.value != totalItem.value)
                                                                                ?.reduce((a: any, b: any) => a + (+b?.price), 0);
                                                                            let jami = clinetValue?.reduce((a: any, b: any) => a + (+b.is_active ? +totalCalc(b) - (chegirmaHisobla(b)) : 0), 0) as any
                                                                            let toladi = clinetValue?.reduce((a: any, b: any) => a + +b.pay_price, 0) as any
                                                                            return +value >= 0 && (jami - (toladi) >= total + +value)
                                                                        }}
                                                                        placeholder={item?.label}
                                                                        // valueIsNumericString={item?.price}
                                                                        value={item?.price}
                                                                        thousandSeparator
                                                                        onChange={(e: any) => {
                                                                            let value = +e.target.value.replace(/,/g, '') as any; // Virgullarni olib tashlash
                                                                            let total = payStatus?.slice(0, 3)
                                                                                ?.filter((totalItem: any,) => item?.value != totalItem.value)
                                                                                ?.reduce((a: any, b: any) => a + (+b?.price), 0);
                                                                            // let discount = getValues('discount') ?? 0
                                                                            let discount = cashRegObj?.discount
                                                                            let debt = cashRegObj?.debt_price
                                                                            // let debt = getValues('debt_price') ?? 0
                                                                            let pay_total_price = value
                                                                            let umumiysumma = clinetValue?.reduce((a: any, b: any) => a + (+b?.is_active ? +totalCalc(b) : 0), 0);
                                                                            let chegirma = discount as any;
                                                                            if (discount <= 100) {
                                                                                chegirma = ((umumiysumma / 100) * discount)
                                                                            }

                                                                            let tolangan = clinetValue?.reduce((a: any, b: any) => a + (+b.pay_price), 0)
                                                                            if (total + value == 0) {
                                                                                if (umumiysumma - chegirma - tolangan > 0) {
                                                                                    // setValue('debt_price', (umumiysumma - chegirma - tolangan) - total, {
                                                                                    //     shouldValidate: true,
                                                                                    // });
                                                                                    setCashRegObj({
                                                                                        ...cashRegObj,
                                                                                        debt_price: (umumiysumma - chegirma - tolangan) - total
                                                                                    })

                                                                                }
                                                                                setPayStatus((prev: any) => prev.map((item2: any, index: number) => {
                                                                                    if (item2?.value == item?.value) {
                                                                                        return {
                                                                                            ...item2,
                                                                                            price: value
                                                                                        }
                                                                                    }
                                                                                    return item2
                                                                                }))

                                                                                setCashRegObj({
                                                                                    ...cashRegObj,
                                                                                    pay_total_price: 0
                                                                                })
                                                                                // setValue('pay_total_price', 0, {
                                                                                //     shouldValidate: true,
                                                                                // });
                                                                            } else {
                                                                                if ((umumiysumma - chegirma - tolangan) - (value + total) >= 0) {
                                                                                    // setValue('debt_price', ((umumiysumma - chegirma - tolangan) - (value + total)), {
                                                                                    //     shouldValidate: true,
                                                                                    // });
                                                                                    setCashRegObj({
                                                                                        ...cashRegObj,
                                                                                        debt_price: ((umumiysumma - chegirma - tolangan) - (value + total)),
                                                                                        pay_total_price: total + value
                                                                                    })
                                                                                    // setValue('pay_total_price', total + value, {
                                                                                    //     shouldValidate: true,
                                                                                    // });
                                                                                    setPayStatus((prev: any) => prev.map((item2: any, index: number) => {
                                                                                        if (item2?.value == item?.value) {
                                                                                            return {
                                                                                                ...item2,
                                                                                                price: value
                                                                                            }
                                                                                        }
                                                                                        return item2
                                                                                    }))
                                                                                }
                                                                            }


                                                                        }}
                                                                        className='form-control'

                                                                    />

                                                                </div>
                                                            </div>
                                                        })
                                                }

                                            </> : (+activeTab2 > 0) && <div className="form-input my-1">
                                                <div className="input-group">
                                                    <label className="input-group-text bg-info text-white  w-25" htmlFor="html5-text-input">{
                                                        payStatus?.find((item: any) => item?.value == activeTab2)?.label
                                                    }</label>
                                                    <NumericFormat
                                                        // isAllowed={(e: any) => {
                                                        //     console.log(e);
                                                        //     const { value } = e
                                                        //     let jami = clinetValue?.reduce((a: any, b: any) => a + (+b.is_active ? +b.total_price - (chegirmaHisobla(b)) : 0), 0) as any
                                                        //     let qarz = clinetValue?.reduce((a: any, b: any) => a + (+b.is_active   ? +b.total_price - (chegirmaHisobla(b)+ + b.pay_price) : 0), 0) as any
                                                        //     let toladi = clinetValue?.reduce((a: any, b: any) => a + +b.pay_price, 0) as any
                                                        //     console.log('qarz',qarz);

                                                        //     console.log(value);
                                                        //     return +value >= 0 && (qarz >= value)
                                                        // }}
                                                        value={payStatus?.find((item: any) => item?.value == activeTab2)?.price}
                                                        thousandSeparator=","
                                                        fixedDecimalScale
                                                        disabled={cashRegObj.pay_total_price < 0 ? true : false}
                                                        onChange={(e: any) => {
                                                            // setPriceAdd(true)
                                                            let value = +e.target.value.replace(/,/g, '') as any; // Virgullarni olib tashlash
                                                            // if (value == 0) {
                                                            //     setDebtErorr(true)
                                                            // } else {
                                                            //     setDebtErorr(false)
                                                            // }
                                                            let discount = cashRegObj?.discount ?? 0
                                                            let debt = getValues('debt_price') ?? 0
                                                            let pay_total_price = value
                                                            let umumiysumma = clinetValue?.reduce((a: any, b: any) => a + (+b?.is_active ? +b.total_price : 0), 0);
                                                            let chegirma = discount as any;
                                                            if (discount <= 100) {
                                                                chegirma = ((umumiysumma / 100) * discount)
                                                            }


                                                            let jami = clinetValue?.reduce((a: any, b: any) => a + (+b.is_active ? +b.total_price - (+b.pay_price + chegirmaHisobla(b)) : 0), 0) as any
                                                            let qarzianiq = clinetValue?.reduce((a: any, b: any) => a + b.is_active ? 0 : +b.pay_price, 0) as any
                                                            let tolanyotkan = qarzianiq > 0 ? qarzianiq - jami : jami;


                                                            let tolangan = clinetValue?.reduce((a: any, b: any) => a + (+b.pay_price), 0)
                                                            if (value == 0) {
                                                                // if (umumiysumma - chegirma - tolangan > 0) {
                                                                //     setValue('debt_price', umumiysumma - chegirma - tolangan, {
                                                                //         shouldValidate: true,
                                                                //     });
                                                                // }

                                                                setPayStatus((prev: any) => prev.map((item2: any, index: number) => {
                                                                    if (item2?.value == activeTab2) {
                                                                        return {
                                                                            ...item2,
                                                                            price: 0
                                                                        }
                                                                    }
                                                                    return item2
                                                                }))
                                                                // setValue('pay_total_price', 0, {
                                                                //     shouldValidate: true,
                                                                // });
                                                                // setValue('debt_price', tolanyotkan, {
                                                                //     shouldValidate: true,
                                                                // });
                                                                setCashRegObj({
                                                                    pay_total_price: 0,
                                                                    debt_price: tolanyotkan
                                                                })
                                                            } else {
                                                                // if (tolanyotkan - value >= 0) {
                                                                setPayStatus((prev: any) => prev.map((item2: any, index: number) => {
                                                                    if (item2?.value == activeTab2) {
                                                                        return {
                                                                            ...item2,
                                                                            price: value
                                                                        }
                                                                    }
                                                                    return item2
                                                                }))
                                                                setCashRegObj({
                                                                    pay_total_price: value,
                                                                    debt_price: (tolanyotkan) - value
                                                                })
                                                                // setValue('debt_price', (tolanyotkan) - value, {
                                                                //     shouldValidate: true,
                                                                // });
                                                                // setValue('pay_total_price', value, {
                                                                //     shouldValidate: true,
                                                                // });
                                                                // }
                                                            }


                                                        }}
                                                        className='form-control'
                                                    />
                                                </div>
                                            </div>
                                        }

                                        <div className="d-flex justify-content-between align-items-center">
                                            <p>Umumiy To'lovga</p>
                                            <p className='text-success'>  <NumericFormat displayType="text"
                                                thousandSeparator
                                                decimalScale={2}
                                                // value={tolanyotkan([...clinetValue], cashRegObj.pay_total_price)} /> </p>
                                                value={tolanyotkan([...clinetValue], cashRegObj.pay_total_price, true)} /> </p>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <p>To'layotkan</p>
                                            <p className='text-success'>  <NumericFormat displayType="text"
                                                thousandSeparator
                                                decimalScale={2}
                                                value={data?.id > 0 ? qarzi([...clinetValue], tolanyotkan([...clinetValue], cashRegObj.pay_total_price), true, data?.balance, true, true) : tolanyotkan([...clinetValue], cashRegObj.pay_total_price)} /> </p>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <p>Qarzlar</p>
                                            <p className='text-danger'>  <NumericFormat displayType="text"
                                                thousandSeparator
                                                decimalScale={2}
                                                value={

                                                    qarzi([...clinetValue], cashRegObj.pay_total_price)
                                                } /> </p>
                                        </div>


                                        {
                                            +data?.balance > 0 && cashRegObj.pay_total_price > 0 ?
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <p>Balansdan</p>
                                                    <p className='text-danger'>  <NumericFormat displayType="text"
                                                        thousandSeparator
                                                        decimalScale={2}
                                                        value={qarzi([...clinetValue], cashRegObj.pay_total_price, true, data?.balance, true)} /> </p>
                                                </div> : ''
                                        }

                                        {
                                            qarzi([...clinetValue], cashRegObj.pay_total_price, true, data?.balance) - data?.balance > 0 ? <div className="d-flex justify-content-between align-items-center">
                                                <p>+Balans</p>
                                                <p className='text-danger'>  <NumericFormat displayType="text"
                                                    thousandSeparator
                                                    decimalScale={2}
                                                    value={qarzi([...clinetValue], cashRegObj.pay_total_price, true, data?.balance) - data?.balance} /> </p>
                                            </div> : (
                                                activeTab2 > 0 ? (qarzi([...clinetValue], cashRegObj.pay_total_price, true, data?.balance) > 0 ?
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <p>+Balans</p>
                                                        <p className='text-danger'>  <NumericFormat displayType="text"
                                                            thousandSeparator
                                                            decimalScale={2}
                                                            value={qarzi([...clinetValue], cashRegObj.pay_total_price, true, data?.balance)} /> </p>
                                                    </div> : '') : '')
                                        }
                                    </div>
                                    <div className="card-footer">

                                        {/* <button className='btn btn-white border' type='button'
                                                onClick={() => {
                                                    setUseBalance(!useBalance)
                                                    // setValue('pay_total_price', 0)
                                                    // setValue('pay_type', '')
                                                }}
                                            >
                                                <div className="form-check form-switch">
                                                    <input className="form-check-input float-end" type="checkbox" role="switch" checked={useBalance} />
                                                </div>
                                            </button> */}
                                        <button type='button' className='btn btn-primary d-flex gap-2 align-items-center w-100  justify-content-center btn-xl'>
                                            Balans
                                            {/* bage  bg-whte */}
                                            <span className='badge bg-white fw-bold text-primary'>
                                                <NumericFormat displayType="text"
                                                    thousandSeparator
                                                    decimalScale={2}
                                                    // value={useBalance ?  (data?.balance ?? 0) > (cashRegObj.pay_total_price) ? (data?.balance ?? 0) - (cashRegObj.pay_total_price ?? 0) : 0 : (data?.balance ?? 0)}
                                                    value={activeTab2 > 0 ? qarzi([...clinetValue], cashRegObj.pay_total_price, true, data?.balance) : (data?.balance ?? 0)}

                                                />
                                            </span>
                                        </button>
                                        <div className="d-flex flex-wrap  my-2">
                                            {
                                                payStatus
                                                    ?.filter((res: any) => {
                                                        if (res?.key == 'cash') {
                                                            return true
                                                        }

                                                        return +user?.setting?.[`is_reg_${res?.key}_pay`]
                                                    })
                                                    ?.map((item: any, index: any) => {
                                                        return (<div className="col-6 p-1 mb-1">
                                                            <button
                                                                // disabled={cashRegObj.pay_total_price < 0 ? index == 0 ? false : true : false}
                                                                type="button"
                                                                onClick={
                                                                    () => {

                                                                        setActiveTab2(item?.value)
                                                                        // setValue('pay_type', item.key, {
                                                                        //     shouldValidate: true,
                                                                        // });
                                                                        setCashRegObj({
                                                                            ...cashRegObj,
                                                                            pay_type: item.key
                                                                        })

                                                                        let jami = [...clinetValue]?.reduce((a: any, b: any) => a + (+b.is_active > 0 ? +(b.qty * b.price) - (chegirmaHisobla({ ...b, total_price: (+b.qty * b.price) })) : 0), 0) as any

                                                                        let tolayapti = cashRegObj?.pay_total_price as any
                                                                        // let tolayapti = getValues('pay_total_price') as any
                                                                        let toladi = [...clinetValue]?.reduce((a: any, b: any) => a + +b.pay_price, 0) as any
                                                                        let qarzianiq = [...clinetValue]?.reduce((a: any, b: any) => a + +b.is_active ? 0 : +b.pay_price, 0) as any
                                                                        let tolanyotkan = jami - toladi;
                                                                        // let tolanyotkan = tolayapti > 0 ? tolayapti : jami - toladi;
                                                                        if (item?.value == 4) {
                                                                            tolanyotkan = 0
                                                                            // setUseBalance(false)
                                                                            setPayStatus((prev: any) => prev.map((item2: any, index: number) => {
                                                                                return {
                                                                                    ...item2,
                                                                                    price: 0
                                                                                }
                                                                            }))
                                                                            setCashRegObj({
                                                                                ...cashRegObj,
                                                                                pay_total_price: 0
                                                                            })
                                                                            // setValue('pay_total_price', 0, {
                                                                            //     shouldValidate: true,
                                                                            // });
                                                                            // setDebtErorr(true)
                                                                        } else {
                                                                            // setDebtErorr(false)

                                                                            // let balansdan  = qarzi([...clinetValue], tolanyotkan, true, data?.balance, true,true)
                                                                            // tolanyotkan  = balansdan
                                                                            setPayStatus((prev: any) => prev.map((item2: any, index: number) => {
                                                                                if (item2?.value == item?.value) {
                                                                                    return {
                                                                                        ...item2,
                                                                                        price: tolanyotkan
                                                                                    }
                                                                                }
                                                                                return {
                                                                                    ...item2,
                                                                                    price: 0
                                                                                }
                                                                            }))
                                                                            // setValue('pay_total_price', tolanyotkan, {
                                                                            //     shouldValidate: true,
                                                                            // });
                                                                            setCashRegObj({
                                                                                ...cashRegObj,
                                                                                pay_total_price: tolanyotkan
                                                                            })
                                                                        }






                                                                    }
                                                                }
                                                                className={`w-100 btn btn-lg btn-${activeTab2 === item?.value ? 'primary' : 'secondary'}`}
                                                            >
                                                                {item?.icon} {' '}
                                                                {item?.label}</button>
                                                        </div>)

                                                    })
                                            }
                                            <div className="col-6   p-1 mb-1">
                                                <button className='btn-lg  w-100 btn btn-danger'
                                                    type='button'
                                                    onClick={debtToggle}
                                                >
                                                    <FaHandHoldingUsd size={24} />  {' '}
                                                    Qarz</button>
                                            </div>
                                            <div className="col-6   p-1 mb-1">
                                                <button className='btn-lg  w-100 btn btn-warning'
                                                    type='button'
                                                    onClick={() => {
                                                        setClintCopyValue(() => clinetValue?.map((item: any) => +item?.is_pay ? item : { ...item, is_discount: true }))
                                                        discountToggle()
                                                    }}
                                                >Chegirma</button>
                                            </div>
                                            <div className="col-12  p-1 mb-1">
                                                <button className="w-100  btn-xl btn btn-success" >To'lash</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <Nav tabs >
                            <NavItem>
                                <NavLink
                                    style={{
                                        cursor: 'pointer'
                                    }}
                                    className={classnames({ active: activeTab === '2' })}
                                    onClick={() => toggleTab('1')}
                                >
                                    Mijozning shaxsiy ma'lumotlari
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    style={{
                                        cursor: 'pointer'
                                    }}
                                    className={classnames({ active: activeTab === '1' })}
                                    onClick={() => toggleTab('2')}
                                >
                                    Xizmatlar bilan ishlash
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    style={{
                                        cursor: 'pointer'
                                    }}
                                    className='bg-success text-white'
                                >
                                    Jami: {' '}
                                    <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={clinetValue?.reduce((a: any, b: any) => a + +(b?.price ?? 0) * (b?.qty ?? 1), 0)} /> {' '}
                                    so'm
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent activeTab={activeTab} className='p-0'>
                            <TabPane tabId='1'>

                            </TabPane>
                            <TabPane tabId="2">
                                
                            </TabPane>
                        </TabContent> */}


                    </div>

                    <div className={`modal-footer ${+user?.is_cash_reg ? 'd-none' : ''}`}>
                        {/* <button type="button" className="btn btn-success"
                            onClick={() => {

                                setItem(() => {
                                    return {
                                        ...getValues(),
                                    }
                                })
                                setModal3(() => true)
                            }}
                        >
                            Grafik
                        </button> */}
                        <button type="submit" disabled={data?.id > 0 || sendRole ? false : true} className="btn btn-primary" >Qo'shish</button>
                        {/* <button type="button" className="btn btn-primary"
                            onClick={() => {
                                if (activeTab == 1) {
                                    setActiveTab('2')
                                } else {
                                    setActiveTab('1')
                                }
                            }}
                        >
                            {
                                activeTab == 1 ? <>
                                    keyingi <FaAngleDoubleRight />
                                </> : <>
                                    <FaAngleDoubleLeft /> oldingi
                                </>
                            }



                        </button> */}
                        <button type="button" className="btn btn-danger" onClick={toggle}>Ortga</button>
                    </div>
                </form>

            </Modal >
            <ReferringDoctorAdd
                modal={modal2} setModal={setModal2}
                registerAdd={true}
                data={{
                    phone: '995192378',
                    workplace: "-"
                }}
            />
            {/* qarz */}
            <Modal backdrop="static" keyboard={false} centered={true} isOpen={debtModal} toggle={debtToggle} role='dialog' >
                <form onSubmit={(e: any) => {
                    e.preventDefault()
                    sendApi({ ...getValues() }, true)
                }}>

                    <div className="modal-header">
                        <h3 className="modal-title">
                            Qarzdorlik
                        </h3>
                    </div>
                    <div className="modal-body ">
                        <div className='form-input my-4'>
                            <div className="input-group">
                                <label className="input-group-text bg-info text-white  w-25" htmlFor="html5-text-input"> muddati</label>
                                <input
                                    required={cashRegObj.debt_price > 0 ? true : false}

                                    type="date"
                                    onChange={((e: any) => {
                                        setNumberData(() => {
                                            return {
                                                ...numberData,
                                                payment_deadline: e.target.value
                                            }
                                        })
                                    })}
                                    className="form-control" />
                            </div>
                            <ErrorInput>
                                {errors.payment_deadline?.message?.toString() || hasError?.errors?.payment_deadline?.toString()}
                            </ErrorInput>
                        </div>
                        <div className="form-input my-4">
                            <div className="input-group">
                                <label className="input-group-text bg-info text-white  w-25" htmlFor="html5-text-input">Izoh</label>
                                <input className="form-control" required={+cashRegObj.debt_price > 0 ? true : false}
                                    onChange={((e: any) => {
                                        setNumberData(() => {
                                            return {
                                                ...numberData,
                                                debt_comment: e.target.value
                                            }
                                        })
                                    })}

                                    placeholder='Izoh' type="text" id="html5-text-input" />
                            </div>
                            <ErrorInput>
                                {errors.debt_comment?.message?.toString() || hasError?.errors?.debt_comment?.toString()}
                            </ErrorInput>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button className='btn btn-primary'>Saqlash</button>
                        <button className='btn btn-danger' type='button' onClick={() => debtToggle()}>ortga</button>
                    </div>
                </form>

            </Modal>
            {/* chegirma */}
            <Modal backdrop="static" keyboard={false} centered={true} isOpen={discountModal} toggle={discountToggle} role='dialog' size='xl' >
                <form onSubmit={(e: any) => {
                    e.preventDefault()
                    setClientValue(() => clintCopyValue)
                    setNumberData(() => {
                        return {
                            ...numberData,
                            discount: 0,

                        }
                    })
                    setClintCopyValue([])
                    discountToggle()
                }}>


                    <div className="modal-header">
                        <h1 className='modal-title'>Chegirma</h1>
                    </div>
                    <div className="modal-body">
                        <div className="row">
                            <div className="form-input my-4 col-6">
                                <div className={`input-group `}>
                                    <label className="input-group-text bg-info text-white  w-25" htmlFor="html5-text-input">Chegirma</label>
                                    <NumericFormat
                                        placeholder='chegirma'
                                        value={numberData?.discount ?? 0}
                                        isAllowed={
                                            (values: any) => {
                                                let ttoalPrice = clintCopyValue?.filter((item: any) => item?.status != 'old' && +item?.is_discount)?.reduce((a: any, b: any) => a + totalCalc(b), 0)
                                                const { floatValue } = values;
                                                return clintCopyValue?.filter((item: any) => item?.status != 'old' && +item?.is_discount)?.length > 0 ? (floatValue > 100 ? ttoalPrice >= floatValue : true) : false
                                            }}
                                        thousandSeparator
                                        onChange={(e: any) => {
                                            let discount = +e.target.value.replace(/,/g, '')
                                            setClintCopyValue(() => chegirmaTaqsimlash(clintCopyValue, discount))

                                            setNumberData(() => {
                                                return {
                                                    ...numberData,
                                                    discount: discount
                                                }
                                            })

                                        }}
                                        className='form-control'
                                    />
                                </div>
                                <ErrorInput>
                                    {errors.discount?.message?.toString() || hasError?.errors?.discount?.toString()}
                                </ErrorInput>
                            </div>
                            <div className="form-input my-4 col-6">
                                <div className="input-group">
                                    <label className="input-group-text bg-info text-white  w-25" htmlFor="html5-text-input">Izoh</label>
                                    <select
                                        onChange={(e: any) => {
                                            setNumberData(() => {
                                                return {
                                                    ...numberData,
                                                    discount_comment: e.target.value
                                                }
                                            })
                                        }}
                                        className="form-control" id=""
                                        required={+numberData?.discount > 0 ? true : false}
                                    >
                                        <option value="">Tanlang</option>
                                        <option value="Kam ta'minlangan">Kam ta'minlangan</option>
                                        <option value="Direktor tanishi">Direktor tanishi</option>
                                        <option value="Nogironligi mavjud">Nogironligi mavjud</option>
                                        <option value="Doimiy mijoz">Doimiy mijoz</option>

                                    </select>
                                </div>
                                <ErrorInput>
                                    {errors.discount_comment?.message?.toString() || hasError?.errors?.discount_comment?.toString()}
                                </ErrorInput>
                            </div>
                        </div>

                        <div style={{
                            maxHeight: `${window.innerHeight / 2.5}px`,
                            overflow: 'auto'
                        }}>
                            <table className='table table-bordered'>
                                <thead>
                                    <tr>
                                        <th>№</th>
                                        <th>Xizmat turi</th>
                                        <th>soni</th>
                                        <th>Narxi</th>
                                        <th>Jami</th>
                                        <th>Chegirma</th>
                                        <th>Foydalanuvchilar</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        clintCopyValue?.length > 0 ?
                                            clintCopyValue?.map((item: any, index: any) => {
                                                return (
                                                    <tr>
                                                        <td key={item.index} className={` p-1  ${+item?.is_active ? (item?.total_price == item?.pay_price ? 'bg-success text-white' : item?.total_price != item?.pay_price && item?.pay_price > 0 ? 'bg-info text-white' : 'bg-warning text-white') : 'bg-danger text-white'}  h-100 `}>{index + 1}</td>
                                                        <td>{item?.service?.name ?? item?.name}</td>
                                                        <td>
                                                            <NumericFormat displayType="text"
                                                                thousandSeparator
                                                                value={item?.price ?? 0} />
                                                        </td>
                                                        <td>
                                                            <NumericFormat displayType="text"
                                                                thousandSeparator
                                                                decimalScale={0}
                                                                value={item?.qty ?? 1} />
                                                        </td>
                                                        <td>
                                                            <NumericFormat displayType="text"
                                                                thousandSeparator
                                                                decimalScale={2}
                                                                value={(item?.price ?? 0) * (item?.qty ?? 1)} />
                                                        </td>
                                                        <td style={{
                                                            width: '12rem'
                                                        }}  >
                                                            <div className="input-group ">
                                                                <div className="input-group-text">
                                                                    <input className="form-check-input" type="checkbox" id="defaultCheck1"
                                                                        checked={+item?.is_discount ? true : false}
                                                                        disabled={item?.status == 'old'}
                                                                        onChange={(e: any) => {
                                                                            let checked = +e.target.checked
                                                                            // if(item?.status=='old')
                                                                            setNumberData(() => {
                                                                                return {
                                                                                    ...numberData,
                                                                                    discount: 0
                                                                                }
                                                                            })
                                                                            setClintCopyValue(() => clintCopyValue?.map((res: any) => {
                                                                                if (res?.id == item?.id) {
                                                                                    return {
                                                                                        ...res,
                                                                                        discount: 0,
                                                                                        is_discount: checked
                                                                                    }
                                                                                }
                                                                                return !res?.is_pay ? { ...res, discount: 0 } : res
                                                                            }))
                                                                        }}
                                                                    />

                                                                </div>
                                                                <NumericFormat
                                                                    isAllowed={
                                                                        (values: any) => {
                                                                            let ttoalPrice = item.qty * item.price
                                                                            const { floatValue } = values;
                                                                            return ttoalPrice >= floatValue
                                                                        }}

                                                                    readOnly={+item?.is_active && item?.edit ? false : true}
                                                                    className='form-control w-50'
                                                                    thousandSeparator
                                                                    decimalScale={2}
                                                                    onChange={(e: any) => {
                                                                        let price = +e.target.value.replace(/,/g, '')
                                                                        setClintCopyValue(() => clintCopyValue?.map((res: any) => {
                                                                            if (res?.id == item?.id) {
                                                                                return {
                                                                                    ...res,
                                                                                    discount: price
                                                                                }
                                                                            }
                                                                            return res
                                                                        }))


                                                                    }}

                                                                    value={item?.discount}

                                                                />
                                                                <button className='btn btn-info btn-sm'
                                                                    type='button'
                                                                    onClick={() => {
                                                                        setClintCopyValue(() => clintCopyValue?.map((res: any) => {
                                                                            if (res?.id == item?.id) {
                                                                                return {
                                                                                    ...res,
                                                                                    edit: !item?.edit
                                                                                }
                                                                            }
                                                                            return res
                                                                        }))
                                                                    }}
                                                                >
                                                                    <AiFillEdit />
                                                                </button>
                                                            </div>

                                                        </td>
                                                        <td  >
                                                            <select className="form-control" id=""
                                                            // disabled={+data?.discount_price > 0 ? true : false}
                                                            // required={+getValues('discount') > 0 ? true : false}
                                                            >
                                                                <option value="">Tanlang</option>
                                                                <option value="Kam ta'minlangan">Kam ta'minlangan</option>
                                                                <option value="Direktor tanishi">Direktor tanishi</option>
                                                                <option value="Nogironligi mavjud">Nogironligi mavjud</option>
                                                                <option value="Doimiy mijoz">Doimiy mijoz</option>

                                                            </select>

                                                        </td>
                                                    </tr>
                                                )
                                            })
                                            :
                                            <tr className='p-1'>
                                                <td colSpan={6} className='text-center'>Mavjud emas</td>
                                            </tr>
                                    }
                                </tbody>
                            </table>

                            {/* <Table
                                isSuccess={true}
                                isLoading={false}
                                top={100}
                                scrollRole={true}
                                extraKeys={["servicetype_", "price_", "count_", "total_", 'discount_',
                                    'doctor_'
                                ]}
                                columns={[
                                    {
                                        title: '№',
                                        key: 'id',
                                        renderItem: (value: any, target: any) => {
                                            return <td key={target.index} className={` p-1  ${+target?.is_active ? (target?.total_price == target?.pay_price ? 'bg-success text-white' : target?.total_price != target?.pay_price && target?.pay_price > 0 ? 'bg-info text-white' : 'bg-warning text-white') : 'bg-danger text-white'}  h-100 `}>
                                                <span>
                                                    {target.index + 1}

                                                </span>
                                            </td>

                                        },
                                    },
                                    {
                                        title: 'Xizmat turi',
                                        key: 'servicetype_',
                                        render: (value: any, data: any) => {
                                            return value?.service?.name ?? value?.name
                                        }
                                    },

                                    {
                                        title: 'Narxi',
                                        key: 'price_',
                                        render: (value: any, data: any) => {
                                            return <>
                                                <NumericFormat displayType="text"
                                                    thousandSeparator
                                                    decimalScale={2}
                                                    value={value?.price ?? 0} />
                                            </>
                                        }
                                    },
                                    {
                                        title: 'soni',
                                        key: 'count_',
                                        render: (value: any, data: any) => {
                                            return <>

                                                <NumericFormat displayType="text"
                                                    thousandSeparator
                                                    decimalScale={2}
                                                    value={value?.qty ?? 1} />

                                            </>
                                        }
                                    },
                                    {
                                        title: 'Jami',
                                        key: 'total_',
                                        render: (value: any, data: any) => {
                                            return <>

                                                <NumericFormat displayType="text"
                                                    thousandSeparator
                                                    decimalScale={2}
                                                    value={(value?.price ?? 0) * (value?.qty ?? 1)} />
                                            </>
                                        }
                                    },
                                    {
                                        title: 'Chegirma',
                                        key: 'discount_',
                                        renderItem: (value: any, data: any) => {
                                            let chegirma = value?.discount ?? 0

                                            if (chegirma <= 100) {
                                                chegirma = ((value?.total_price) / 100) * chegirma
                                            }
                                            else {
                                                chegirma = chegirma
                                            }
                                            return <td style={{
                                                width: '10rem'
                                            }}  >
                                                <div className="input-group ">
                                                    <NumericFormat
                                                        readOnly={+value?.is_active && value?.edit ? false : true}
                                                        className='form-control w-50'
                                                        thousandSeparator
                                                        decimalScale={2}
                                                        onChange={(e: any) => {
                                                            let price = +e.target.value.replace(/,/g, '')
                                                            setClintCopyValue(() => clintCopyValue?.map((res: any) => {
                                                                if (res?.id == value?.id) {
                                                                    return {
                                                                        ...res,
                                                                        discount: price
                                                                    }
                                                                }
                                                                return res
                                                            }))


                                                        }}

                                                        value={value?.discount}

                                                    />
                                                    <button className='btn btn-info btn-sm'

                                                        onClick={() => {
                                                            setClintCopyValue(() => clintCopyValue?.map((res: any) => {
                                                                if (res?.id == value?.id) {
                                                                    return {
                                                                        ...res,
                                                                        edit: !value?.edit
                                                                    }
                                                                }
                                                                return res
                                                            }))
                                                        }}
                                                    >
                                                        <AiFillEdit />
                                                    </button>
                                                </div>

                                            </td>
                                        }
                                    },
                                    {
                                        title: 'Foydalanuvchilar',
                                        key: 'doctor_',
                                        renderItem: (value: any, data: any) => {
                                            return <td  >
                                                <select {...register('discount_comment')} name='discount_comment' className="form-control" id=""
                                                    disabled={+data?.discount_price > 0 ? true : false}
                                                    required={+getValues('discount') > 0 ? true : false}
                                                >
                                                    <option value="">Tanlang</option>
                                                    <option value="Kam ta'minlangan">Kam ta'minlangan</option>
                                                    <option value="Direktor tanishi">Direktor tanishi</option>
                                                    <option value="Nogironligi mavjud">Nogironligi mavjud</option>
                                                    <option value="Doimiy mijoz">Doimiy mijoz</option>

                                                </select>

                                            </td>
                                        }
                                    },
                                    // {
                                    //     title: 'Izoh',
                                    //     key: 'comment_',
                                    //     render: (value: any, data: any) => {
                                    //         return <>

                                    //             <NumericFormat displayType="text"
                                    //                 thousandSeparator
                                    //                 decimalScale={2}
                                    //                 value={(value?.price ?? 0) * (value?.qty ?? 1)} />
                                    //         </>
                                    //     }
                                    // },
                                ]}
                                dataSource={
                                    clintCopyValue
                                }
                            /> */}
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button className='btn btn-primary' >Saqlash</button>
                        <button className='btn btn-danger' type='button' onClick={() => {
                            discountToggle()
                            setNumberData(() => {
                                return {
                                    ...numberData,
                                    discount: 0
                                }
                            })
                        }}>Ortga</button>
                    </div>
                </form>

            </Modal >
            {/* monoblok rejim */}
            <Modal Modal backdrop="static" fullscreen keyboard={false} centered={true} isOpen={isMonoBlock} toggle={monoblokToggle} role='dialog' className='h-100 d-block' >
                <div>

                    {/* <div className="modal-header">
                        <h3 className="modal-title">
                            Xizmatlar
                        </h3>
                    </div> */}
                    <button onClick={() => {
                        setIsMonoBlock(false)
                        setSelectData({
                            ...selectData,
                            department_id: false
                        })
                        setServiceIdData(() => [])
                    }} type="button"
                        style={{
                            position: 'fixed',
                            top: '5px',
                            right: '5px',
                            zIndex: 1
                        }}
                        className="btn btn-danger cursor-pointer" >
                        X
                    </button>
                    <div className="modal-body"
                        style={{
                            height: `${window.innerHeight / 1.1}px`,
                            overflow: 'hidden'
                        }}
                    >
                        <div className="row ">
                            <div className="col-3 border-end border-2">
                                <h3>Bo'limlar</h3>
                                <div
                                    style={
                                        {
                                            height: `${window.innerHeight / 1.1}px`,
                                            overflow: 'auto',
                                            paddingBottom: "8rem"
                                        }
                                    }

                                >
                                    {
                                        departmentData?.map((item: any, index: number) => (
                                            <div className="d-flex align-items-center gap-2 mb-2">
                                                <p className='bg-info text-white p-3 rounded fw-bold mb-0 d_width'>
                                                    {item?.main_room}
                                                </p>
                                                <button className={`m-0 btn bg-${selectData?.department_id?.value > 0 ? (selectData?.department_id?.value == item.id ? 'info text-white' : 'label-secondary') : index == 0 ? 'info text-white' : 'label-secondary'}  p-3 rounded w-100 fw-bold cursor-pointer`}
                                                    onClick={() => {
                                                        setSelectData({
                                                            ...selectData,
                                                            department_id: {
                                                                label: item.name,
                                                                value: item.id,
                                                                data: item
                                                            }
                                                        })
                                                    }}
                                                >
                                                    {item?.name}
                                                </button>
                                            </div>
                                        ))
                                    }
                                </div>

                            </div>
                            <div className="col-9">
                                <h3>Xizmatlar</h3>
                                <div className="row">
                                    <div className="col-6 border-end border-4 ">
                                        <div style={
                                            {
                                                height: `${window.innerHeight / 1.1}px`,
                                                overflow: 'auto',
                                                paddingBottom: '6rem'
                                            }
                                        }
                                        >
                                            {
                                                ([...groupAndLimitServices(serviceData
                                                    .filter((item: any) => selectData?.department_id?.value > 0 ? item.department.id == selectData?.department_id?.value : item.department.id == departmentData?.[0]?.id), 16, 0)])?.map((item2: any) => (
                                                        <div >
                                                            <p className='mb-0 fw-bold text-info'>{item2.type}</p>
                                                            {item2?.items.map((item: any, index: number) => (
                                                                <div>
                                                                    <label htmlFor={`${item.id}-${index}`} className='hover-monoblok d-flex align-items-center py-1 gap-2 cursor-pointer fw-bold'
                                                                        style={{
                                                                            fontSize: '1.3rem'
                                                                        }}
                                                                    >
                                                                        <input className="form-check-input" checked={serviceIdData?.find((target: any) => target?.id == item.id) ? true : false} type="checkbox" id={`${item.id}-${index}`}
                                                                            onChange={(e: any) => {
                                                                                let find = serviceIdData?.find((target: any) => target?.id == item.id)
                                                                                if (find) {
                                                                                    setServiceIdData(() => serviceIdData?.filter((target: any) => target?.id != item.id))
                                                                                } else {
                                                                                    setServiceIdData(() => [
                                                                                        ...serviceIdData,
                                                                                        item
                                                                                    ])
                                                                                }
                                                                            }}
                                                                        />
                                                                        <span >
                                                                            {item.name} - <span className='text-primary'>
                                                                                <NumericFormat displayType="text"
                                                                                    thousandSeparator
                                                                                    decimalScale={2}
                                                                                    value={item.price} />
                                                                            </span>
                                                                        </span>
                                                                    </label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ))
                                            }
                                        </div>
                                    </div>
                                    <div className="col-6 ">
                                        <div style={
                                            {
                                                height: `${window.innerHeight / 1.1}px`,
                                                overflow: 'auto'
                                            }
                                        }
                                            className='pb-1'
                                        >
                                            {
                                                ([...groupAndLimitServices(serviceData
                                                    .filter((item: any) => selectData?.department_id?.value > 0 ? item.department.id == selectData?.department_id?.value : item.department.id == departmentData?.[0]?.id), 0, 16)])?.map((item2: any) => (
                                                        <div >
                                                            <p className='mb-0 fw-bold text-info'>{item2.type}</p>
                                                            {item2?.items.map((item: any, index: number) => (
                                                                <div>
                                                                    <label htmlFor={`${item.id}-${index}`} className='hover-monoblok d-flex align-items-center py-1 gap-2 cursor-pointer fw-bold'
                                                                        style={{
                                                                            fontSize: '1.3rem'
                                                                        }}
                                                                    >
                                                                        <input className="form-check-input" checked={serviceIdData?.find((target: any) => target?.id == item.id) ? true : false} type="checkbox" id={`${item.id}-${index}`}
                                                                            onChange={(e: any) => {
                                                                                let find = serviceIdData?.find((target: any) => target?.id == item.id)
                                                                                if (find) {
                                                                                    setServiceIdData(() => serviceIdData?.filter((target: any) => target?.id != item.id))
                                                                                } else {
                                                                                    setServiceIdData(() => [
                                                                                        ...serviceIdData,
                                                                                        item
                                                                                    ])
                                                                                }
                                                                            }}
                                                                        />
                                                                        <span >
                                                                            {item.name} - <span className='text-primary'>
                                                                                <NumericFormat displayType="text"
                                                                                    thousandSeparator
                                                                                    decimalScale={2}
                                                                                    value={item.price} />
                                                                            </span>
                                                                        </span>
                                                                    </label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ))
                                            }
                                        </div>
                                    </div>



                                </div>


                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button className='btn btn-primary'
                            onClick={() => {
                                let e = serviceIdData?.map((res: any) => {
                                    return {
                                        label: res?.name,
                                        value: res?.id,
                                        data: res
                                    }
                                })
                                setActiveTab2('0')
                                setCashRegObj(() => ({ pay_total_price: 0, discount: 0, debt_price: 0 }))
                                setNumberData(() => ({ payment_deadline: 0, debt_comment: '', discount_comment: '' }))
                                let result = e
                                setSelectData(() => {
                                    return {
                                        ...selectData,
                                        service_id: result,
                                    }
                                })
                                let dep = getUniqueDepartments(e ?? [])?.filter((res: any) => !new Set(data?.client_time?.map((item: any) => item?.department_id)).has(res?.id))
                                if (dep?.length > 0) {
                                    for (let key of dep) {
                                        let find = clientTime?.find((item: any) => item?.department.id == key?.id)
                                        if (find) {
                                            setClientTime(() => clientTime?.map((res: any) => {
                                                return res?.department.id == key?.id ? {
                                                    department: key,
                                                    agreement_time: false

                                                } : res
                                            }))
                                        } else {
                                            setClientTime([...clientTime, { department: key }])
                                        }
                                        //   setClientTime(()=>clin)
                                    }
                                }
                                let newsdata = clientTime?.filter((res: any) => res.status != 'old');

                                for (let key of newsdata) {
                                    if (!dep?.find((item: any) => item?.id == key?.department?.id)) {
                                        setClientTime(() => clientTime?.filter((res: any) => res?.department.id != key?.department.id))
                                    }
                                }
                                setClientValue(() => [
                                    ...clinetValue?.filter((item: any) => item.status == 'old'),
                                    ...result
                                        ?.map((item: any) => {
                                            return {
                                                ...item?.data,
                                                owner: item?.owner,
                                                pay_price: item?.pay_price ?? 0,
                                                id: nanoid(),
                                                is_active: 1,
                                                service_id: item?.value,
                                                department_id: item?.data?.department?.id,
                                                total_price: (+item?.qty > 0 ? item?.qty : 1) * item?.price,
                                                discount: 0,
                                                qty: 1
                                            }
                                        }),
                                ])


                                // setSelectData(() => {
                                //     return {
                                //         service_id: serviceIdData?.map((res: any) => {
                                //             return {
                                //                 label: res?.name,
                                //                 value: res?.id,
                                //                 data: res
                                //             }
                                //         })
                                //     }
                                // })


                                // if (+data?.id > 0) {
                                //     if (result?.length == 0) {
                                //         setSelectData({
                                //             ...selectData,
                                //             service_id: [],
                                //             department_id: false,
                                //         })
                                //         let resdata = data?.client_value?.map((item: any) => {
                                //             return {
                                //                 status: 'old',
                                //                 ...item?.service,
                                //                 qty: +item?.qty,
                                //                 pay_price: item?.pay_price,
                                //                 is_active: +item?.is_active ? 1 : 0,
                                //                 service_id: item?.service_id,
                                //                 department_id: item?.department_id,
                                //                 id: item?.id,
                                //                 price: item?.price,
                                //                 owner: item?.owner,
                                //                 total_price: +item?.total_price > 0 ? (+item?.qty > 0 ? item?.qty : 1) * item?.price : (+item?.qty > 0 ? item?.qty : 1) * item?.price,
                                //                 discount: item?.discount ?? 0,


                                //             }
                                //         })
                                //         console.log('resdata', resdata);
                                //         setClientValue(() => resdata)
                                //     }

                                //     else {
                                //         console.log(e);

                                //         setSelectData({
                                //             ...selectData,
                                //             service_id: result,
                                //             department_id: false,
                                //         })
                                //         setClientValue(() => [
                                //             ...data?.client_value?.map((item: any) => {
                                //                 return {
                                //                     status: 'old',
                                //                     ...item?.service,
                                //                     qty: +item?.qty,
                                //                     pay_price: item?.pay_price,
                                //                     is_active: +item?.is_active ? 1 : 0,
                                //                     service_id: item?.service_id,
                                //                     department_id: item?.department_id,
                                //                     id: item?.id,
                                //                     owner: item?.owner,
                                //                     price: item?.price,
                                //                     total_price: +item?.total_price > 0 ? (+item?.qty > 0 ? item?.qty : 1) * item?.price : (+item?.qty > 0 ? item?.qty : 1) * item?.price,
                                //                     discount: item?.discount ?? 0,
                                //                     is_pay: +item?.is_pay ? 1 : 0,




                                //                 }
                                //             }),
                                //             ...result
                                //                 .map((item: any) => {
                                //                     return {
                                //                         ...item?.data,
                                //                         pay_price: item?.pay_price ?? 0,
                                //                         is_active: 1,
                                //                         id: nanoid(),
                                //                         department_id: item?.data?.department?.id,
                                //                         service_id: item?.value,
                                //                         discount: 0,
                                //                         total_price: (+item?.qty > 0 ? item?.qty : 1) * item?.price,
                                //                         qty: 1

                                //                     }
                                //                 }),
                                //         ])
                                //     }
                                // } else {

                                //     setClientValue(() => [
                                //         ...result
                                //             ?.map((item: any) => {
                                //                 return {
                                //                     ...item?.data,
                                //                     owner: item?.owner,
                                //                     pay_price: item?.pay_price ?? 0,
                                //                     id: nanoid(),
                                //                     is_active: 1,
                                //                     service_id: item?.value,
                                //                     department_id: item?.data?.department?.id,
                                //                     total_price: (+item?.qty > 0 ? item?.qty : 1) * item?.price,
                                //                     discount: 0,
                                //                     qty: 1
                                //                 }
                                //             }),
                                //     ])
                                // }


                                monoblokToggle()

                            }}

                        >Saqlash</button>
                    </div>
                </div>

            </Modal >
            {/* navbat tanlash model */}
            <Modal Modal backdrop="static" keyboard={false} size='lg' centered={true} isOpen={isQueueModal} toggle={queueToggle} role='dialog' >
                <div>
                    <div className="modal-header">
                        <h3 className="modal-title">
                            Navbat
                        </h3>
                        <button onClick={queueToggle} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body ">
                        {
                            queueNumberTargtet?.limit &&
                            Array.from({ length: Math.ceil(queueNumberTargtet.limit.length / 10) }).map((_, rowIndex) => (
                                <div className="d-flex gap-2 mb-2" key={rowIndex}>
                                    {queueNumberTargtet.limit
                                        .slice(rowIndex * 10, rowIndex * 10 + 10)
                                        .map((item: any) => (
                                            <button
                                                disabled={new Set(queueNumberTargtet?.data).has(item)}
                                                key={item}
                                                className={`fokus_none  w-100 btn-lg  ${new Set(queueNumberTargtet?.data).has(item) ? 'btn btn-success' : queueNumber === item ? 'btn btn-primary' : 'btn btn-hover-primary'
                                                    }`}

                                                onClick={() => {
                                                    if (queueNumber === item) {
                                                        setQueueNumber(0)
                                                    } else {
                                                        setQueueNumber(item)
                                                    }
                                                }}
                                            >
                                                {item}
                                            </button>
                                        ))}
                                </div>
                            ))
                        }
                    </div>
                    <div className="modal-footer">
                        <button className='btn btn-primary'
                            onClick={() => {
                                if (queueNumber > 0) {
                                    let find = queueNumberData?.find((item: any) => item?.department?.id === queueNumberTargtet?.department?.id)
                                    if (find) {
                                        find?.data?.push(queueNumber)
                                        setQueueNumberData(() => queueNumberData?.map((item: any) => {
                                            if (item?.department?.id === queueNumberTargtet?.department?.id) {
                                                return {
                                                    ...item,
                                                    queue_number: queueNumber
                                                }
                                            } else {
                                                return item
                                            }
                                        }))
                                    } else {
                                        setQueueNumberData(() => [...queueNumberData, { department: queueNumberTargtet?.department, queue_number: queueNumber }])
                                    }
                                    setQueueNumber(0)
                                    setQueueNumberTarget({} as any)
                                    queueToggle()
                                }

                            }}
                        >Saqlash</button>
                    </div>
                </div>

            </Modal >
            {/* camera tanlash model */}
            <Modal Modal backdrop="static" keyboard={false} size='xl' centered={true} isOpen={isOpenCamera} toggle={cameraToggle} role='dialog' >
                <div>
                    <div className="modal-header">
                        <div>
                            <h3 className="modal-title">
                                Xizmat nomi: {checkProductItem?.service?.name ?? checkProductItem?.name}
                                <span className='badge bg-primary mx-2'> {checkProductItem?.qty * (checkProductItem?.service_product ?? [])?.reduce((a: any, b: any) => a + +b?.qty, 0)} dona</span>
                            </h3>
                        </div>
                        <button onClick={() => {
                            cameraToggle()
                            setCameraReset(() => true)
                            setCheckProductItem(() => ({}) as any)
                        }} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body ">
                        <div className="row">
                            <div className={`col-${checkProductItem?.status == 'old' ? '12' : '6'}`}>
                                <div style={{
                                    maxHeight: `${window.innerHeight / 2.5}px`,
                                    overflow: 'auto'
                                }}>

                                    {
                                        loading ? 'loading' : checkProductItem?.service_product?.map((item: any) => {
                                            const client_use_product = checkProductItem?.client_use_product
                                            const totalQty = (checkProductItem?.client_use_product ?? [])?.filter((pro: any) => pro?.product_id === item?.product?.id)?.reduce((a: any, b: any) => a + +b?.qty, 0)
                                            return (
                                                <div className="my-1">
                                                    <table className="table table-bordered  ">
                                                        <tbody className="w-auto" >
                                                            <tr >
                                                                <td className={` w-25 ${totalQty == item?.qty * checkProductItem?.qty ? 'bg-success text-white' : 'bg-danger text-white'}`}
                                                                >
                                                                    <span>maxsulot nomi </span> <br />
                                                                    <h4 className={` mb-0 ${totalQty == item?.qty * checkProductItem?.qty ? 'bg-success text-white' : ' text-white'}`}>  {item?.product?.name}</h4>
                                                                </td>
                                                                <td className="w-25">
                                                                    <span>Buyurtma</span> <br />
                                                                    <h4 className="mb-0">
                                                                        {item?.qty * checkProductItem?.qty}
                                                                    </h4>
                                                                </td>
                                                                <td className="w-25">
                                                                    <span>Yigildi</span> <br />
                                                                    <h4 className="mb-0">
                                                                        {totalQty}
                                                                    </h4>
                                                                </td>
                                                            </tr>
                                                        </tbody>

                                                    </table>
                                                    {
                                                        client_use_product
                                                            ?.filter((pro: any) => pro?.product_id === item?.product?.id)
                                                            ?.length > 0 ?
                                                            client_use_product
                                                                ?.filter((pro: any) => pro?.product_id === item?.product?.id)
                                                                ?.map((res: any) => (
                                                                    <div className="d-flex align-items-center gap-2 my-1">
                                                                        <div className="d-flex gap-4 align-items-center">
                                                                            <p className="white-space fw-bold mb-0">{dateFormat(res?.product_reception_item?.manufacture_date)} dan </p>
                                                                            <p className="white-space fw-bold mb-0">  {dateFormat(res?.product_reception_item?.expiration_date)} gacha </p>
                                                                        </div>
                                                                        <div className="w-25">
                                                                            <NumericFormat
                                                                                disabled={true}
                                                                                value={res?.qty}
                                                                                thousandSeparator
                                                                                className='form-control'

                                                                            />
                                                                        </div>
                                                                    </div>
                                                                )) : <p className="white-space fw-bold alert alert-danger">
                                                                To'liq yig'ilmadi
                                                            </p>
                                                    }
                                                </div>
                                            )
                                        })
                                    }

                                </div>
                            </div>
                            <div className="col-6">
                                {
                                    loading || cameraReset ? '' : <video id="video"
                                    ></video>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button className='btn btn-primary'
                            onClick={() => {
                                cameraToggle()
                                setCameraReset(() => true)
                                setCheckProductItem(() => ({}) as any)
                            }}
                        >Ortga</button>
                    </div>
                </div>

            </Modal >
            <iframe ref={iframeRef} style={{ display: 'none' }} title="print-frame" />

        </>
    )
}

export default ClientAdd