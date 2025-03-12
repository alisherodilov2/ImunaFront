import React, { useEffect, useRef, useState } from 'react'
// import Layout from '../layouts/Layout'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Toast, ToastHeader, ToastBody, TabPane, TabContent, NavItem, Nav, NavLink, PopoverBody, PopoverHeader, Popover } from 'reactstrap'
import classnames from 'classnames';
import { get, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from 'react-redux';
import { query, queryObj } from '../../componets/api/Query';
import { ReducerType } from '../../interface/interface';
import Loader from '../../componets/api/Loader';
import Input from '../../componets/inputs/Input';
import { NumericFormat, PatternFormat } from 'react-number-format';
import ErrorInput from '../../componets/inputs/ErrorInput';
import Select from 'react-select';
import axios from 'axios';
import { MdAttachMoney, MdDeleteForever } from 'react-icons/md';
import Swal from 'sweetalert2';
import { json } from 'react-router-dom';
import { AppDispatch } from '../../service/store/store';
import { isCashRegItem, isCashRegItem2, isClearChekPrintData, isClientAdd, isClientDefaultApi, isClientEdit } from '../../service/reducer/ClientReducer';
import DepartmentAdd from '../director/services/department/DepartmentAdd';
import Table from '../../componets/table/Table';
import { nanoid } from '@reduxjs/toolkit';
import { fullName } from '../../helper/fullName';
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleRight, FaCashRegister } from 'react-icons/fa';
import { cashRegisterValidateCheck } from './validate/CashRegisterValidate';
import { formatId } from '../../helper/idGenerate';
import { cashRegCalc, cashRegCurrentDebt, cashRegCurrentDiscout, cashRegCurrontPrice, cashRegDebt, cashRegDiscount, cashRegDiscountFun, cashRegTotalPrice, debtRegTotalPrice } from '../../helper/cashRegCalc';
import { generateCheck } from '../../helper/generateCheck';
import { chegirmaHisobla, chegirmaTaqsimlash, jsonClintValueData, repotTable } from '../../helper/cashRegHelper';
import { AiFillEdit } from 'react-icons/ai';
// import { isAddClient, isEditClient } from '../../client/reducer/ClientReducer';

const CashRegister = ({ data, modal, setModal, setData = function () { }, resetItem = false }: { setData?: any, data?: any, modal?: boolean; setModal?: any, resetItem?: boolean }) => {

    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const [payStatus, setPayStatus] = useState([
        {
            label: 'Naqd',
            value: 1,
            key: 'cash',
            price: 0
        },
        {
            label: 'plastik',
            value: 2,
            key: 'card',
            price: 0
        },
        {
            label: "o'tkazma",
            value: 3,
            key: 'transfer',
            price: 0
        },
        {
            label: 'Aralash',
            value: 4,
            key: 'mix',
        },

    ])
    const [validate, setValidate] = useState(() => cashRegisterValidateCheck({}))
    const { serviceData, } = useSelector((state: ReducerType) => state.ServiceReducer)
    const { departmentData, } = useSelector((state: ReducerType) => state.DepartmentReducer)
    const { user } = useSelector((state: ReducerType) => state.ProfileReducer)
    const [modal2, setModal2] = useState(false)
    const [modal3, setModal3] = useState(false)
    const { serviceTypeData } = useSelector((state: ReducerType) => state.ServiceTypeReducer)
    const dataSelect = (data: any) => {
        let res = [...data].sort((a: any, b: any) => b.id - a.id);
        return res?.map((item: any) => {
            return {
                value: item?.id, label: `${item?.name || item?.type} ${item?.price ? `(${item?.price} so'm)` : ''}`,
                data: item
            }
        })
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
    } as any)
    const { findData } = useSelector((state: ReducerType) => state.MenuReducer)
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
            citizenship: yup.string().required("Fuqoroligi kiriting!"),
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
        resolver: yupResolver(validate),
        defaultValues: {
            ...data
        }

    });
    const [clinetValue, setClientValue] = useState([] as any)
    const [activeTab, setActiveTab] = useState('1' as any);
    const [activeTab2, setActiveTab2] = useState(0 as any);
    const [enter, setEnter] = useState(false);
    const [item, setItem] = useState<any>({})

    useEffect(() => {
        if (data?.client_value?.length > 0 && clinetValue?.length == 0) {
            setClientValue(() => data?.client_value)
        }
        console.log(data);

        // if(+data?.discount_price>0){
        //     setValue('discount', data?.discount_price, {
        //         shouldDirty: true
        //     })
        // }

        if (isSuccessApi) {
            setUseBalance(false)
            // if (check_print_data?.client_value?.length > 0) {
            //     console.log('check_print_data', check_print_data);
            //     generateCheck({
            //         target: check_print_data,
            //         iframeRef: iframeRef,
            //         name: user?.owner?.name,
            //         client_time: check_print_data?.client_time
            //     })
            //     dispatch(isClearChekPrintData())
            // }


            setDebtModal(false)
            setDiscountModal(false)
            setNumberData({
                debt: 0,
                discount: 0,
                discount_comment: '',
                payment_deadline: '',
                debt_comment: '',
                discount_send: false
            })
            setPayStatus([
                {
                    label: 'Naqd',
                    value: 1,
                    key: 'cash',
                    price: 0
                },
                {
                    label: 'plastik',
                    value: 2,
                    key: 'card',
                    price: 0
                },
                {
                    label: "o'tkazma",
                    value: 3,
                    key: 'transfer',
                    price: 0
                },
                {
                    label: 'Aralash',
                    value: 4,
                    key: 'mix',

                },
            ]
            )

            setData(() => { })
            setModal(enter)
            dispatch(isClientDefaultApi())
            let s = getValues(), resetObj = {};
            for (let key in getValues()) {
                resetObj = {
                    ...resetObj, [key]: ''
                }
            }
            setValue('pay_type', '', {
                shouldValidate: false,
            });
            setClientValue(() => [])
            setSelectData(() => {
                return false
            })
            reset(
                resetObj
            )
        }
    }, [modal, isLoading, isSuccessApi, payStatus])
    const discounToggle = () => {
        setDiscountModal(!discountModal)
    }
    const debtToggle = () => {
        setDebtModal(!debtModal)
    }
    const toggle = () => {
        dispatch(isCashRegItem())
        dispatch(isCashRegItem2())
        setDebtErorr(false)
        setData({})
        setUseBalance(false)
        setClientValue([])
        setNumberData({
            debt: 0,
            discount: 0,
            discount_comment: '',
            payment_deadline: '',
            debt_comment: '',
            discount_send: false
        })
        let s = getValues(), resetObj = {};
        for (let key in getValues()) {
            resetObj = {
                ...resetObj, [key]: '',
                pay_type: '',
                debt_price: 0,
                debt: 0,
                pay_total_price: 0,
                discount: 0
            }
        }
        reset(
            resetObj
        )
        setPayStatus((prev: any) => prev.map((item2: any, index: number) => {
            return {
                ...item2,
                price: 0
            }
        }))
        setActiveTab2(0)
        setModal(!modal)
        setEnter(() => false)
    };
    const totalPrice = () => (clinetValue?.filter((item: any) => item?.is_active)?.reduce((acc: number, cur: any) => acc + +(cur?.qty ?? 1) * +(cur?.price ?? 0), 0) ?? 0)
    const discountCalc = (e: any) => {
        let res = e ?? 0
        if (res == 0) return 0
        if (e <= 100) {
            return (totalPrice() / 100) * e
        } else {
            return +e
        }
    }
    const sendApi = (e: any) => {
        let clintValuedata = jsonClintValueData({ data: clinetValue, discount: e?.discount, pay_total_price: e?.pay_total_price });

        dispatch(isClientAdd({
            query: queryObj({
                ...data, ...e,
                use_balance: useBalance ? '1' : '0',
                discount_comment: numberData?.discount_comment ?? '-',
                debt_comment: numberData?.debt_comment ?? '-',
                parent_id: null,
                debt_price: `${e?.debt_price ?? 0}`,
                payment_deadline: `${numberData?.payment_deadline ?? '-'}`,
                discount_price: `${(e?.discount) ?? 0}`,
                pay_total_price: `${e?.pay_total_price ?? 0}`,
                id: `${+data?.id > 0 ? data?.id : 0}`,
                status: 'payed',
                client_value: JSON.stringify(clintValuedata)
            })
        }))

        dispatch(isCashRegItem())
        dispatch(isCashRegItem2())
    }

    const send = (e: any) => {
        if (clinetValue?.length == 0) {
            alert("Xizmatlarni tanlang!")
        } else {
            let clintValuedata = jsonClintValueData({ data: clinetValue, discount: e?.discount, pay_total_price: e?.pay_total_price })
            let jami = clinetValue?.reduce((a: any, b: any) => a + (+b.is_active ? +b.total_price - (chegirmaHisobla(b)) : 0), 0) as any
            let toladi = clinetValue?.reduce((a: any, b: any) => a + +b.pay_price, 0) as any
            if (e.pay_total_price < 0 && payStatus?.reduce((a: any, b: any) => a + b?.price, 0) != e.pay_total_price) {
                alert('qaytarish uchun boshqa tolov turini tanlang!')
            } else {
                if (jami - toladi - e.pay_total_price > 0 && Math.abs(+e.debt_price) > 0) {
                    if (numberData?.debt_comment?.length > 0 && numberData?.payment_deadline?.length > 0) {
                        sendApi(e)
                    } else {
                        debtToggle()
                    }
                } else {
                    sendApi(e)
                }
                // dispatch(isClientAdd({
                //     query: queryObj({
                //         ...data, ...e,
                //         discount_comment: numberData?.discount_comment ?? '-',
                //         debt_comment: numberData?.debt_comment ?? '-',
                //         parent_id: null,
                //         debt_price: `${e?.debt_price ?? 0}`,
                //         payment_deadline: `${numberData?.payment_deadline ?? '-'}`,
                //         discount_price: `${(e?.discount) ?? 0}`,
                //         pay_total_price: `${e?.pay_total_price ?? 0}`,
                //         id: `${+data?.id > 0 ? data?.id : 0}`,
                //         status: 'payed',
                //         client_value: JSON.stringify(clintValuedata)
                //     })
                // }))
            }

            // if (e.pay_total_price > 0 || e.debt_price > 0) {
            // } else {
            //     alert('Hatolik majud')
            // }
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

    const cardRef = useRef<HTMLDivElement>(null);
    const scrollToBottom = () => {
        if (cardRef.current) {
            // Scroll to the bottom of the card
            cardRef.current.scrollTo({
                top: cardRef.current.scrollHeight - cardRef.current.clientHeight,
                behavior: 'smooth', // Enables smooth scrolling
            });
        }
    };
    const toggleTab = (tab: any) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    };
    const toggleTab2 = (tab: any) => {
        if (activeTab2 !== tab) {
            setActiveTab2(tab);
        }
    };
    const [useBalance, setUseBalance] = useState(false)
    const [numberData, setNumberData] = useState({
        debt: 0,
        discount: 0,
        discount_comment: '',
        payment_deadline: '',
        debt_comment: '',
        discount_send: false
    } as any)
    const [debtErorr, setDebtErorr] = useState(false)
    const [discountModal, setDiscountModal] = useState(false)
    const [debtModal, setDebtModal] = useState(false)
    const [discountErorr, setDiscountErorr] = useState(false)
    const [resetAll, setResetAll] = useState(false)
    const [priceAdd, setPriceAdd] = useState(false)
    const [clintCopyValue, setClintCopyValue] = useState([] as any)
    return (
        <>
            <Loader loading={sendLoading} />
            <Modal centered={true} isOpen={modal} toggle={toggle} role='dialog' size='xl' backdrop="static" keyboard={false}>
                <form onSubmit={handleSubmit(send)} className='size_16' >

                    <div className="modal-header">
                        <div className="d-flex align-items-center justify-content-between w-100">
                            <h5 className="modal-title" id="modalCenterTitle">To'lov qilish</h5>
                            <div className="btn btn-group">

                                {/* <button type='button' className='btn btn-success'>
                                    <MdAttachMoney size={24} />+
                                </button> */}
                            </div>
                        </div>
                        <button onClick={toggle} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body">
                        <div className="row">
                            <div className="col-126">
                                <div className="divider text-start-center">
                                    <div className="divider-text">Mijozning shaxsiy ma'lumotlari</div>
                                </div>
                                <div style={{
                                    // height: `${window.innerHeight / 2.2}px`,
                                    // overflow: 'auto'
                                }}>
                                    <Table
                                        top={100}
                                        scrollRole={true}
                                        extraKeys={[
                                            'full_name_',
                                            'data_birth_',
                                            'phone_',
                                            'person_id_',
                                        ]}
                                        columns={[
                                            {
                                                title: "F.I.O",
                                                key: 'full_name_',
                                                render: (value: any, data: any) => {
                                                    return <b>{fullName(value)}</b>
                                                }
                                            },
                                            {
                                                title: "Tug'ilgan sanasi",
                                                key: 'data_birth_',
                                                render: (value: any, data: any) => {
                                                    return value?.data_birth
                                                }
                                            },
                                            {
                                                title: 'Tel',
                                                key: 'phone_',
                                                render: (value: any, data: any) => {
                                                    return `+998${value?.phone}`
                                                }
                                            },
                                            {
                                                title: 'ID',
                                                key: 'person_id_',
                                                render: (value: any, data: any) => {
                                                    return formatId(value?.person_id)
                                                }
                                            },

                                        ]}
                                        dataSource={
                                            [data]
                                        }
                                    />
                                </div>
                                <div className="divider text-center-center align-items-center  w-100">
                                    <div className="divider-text">Xizmat va tolovlar bilan ishlash bo'limi</div>
                                </div>
                                <div style={{
                                    maxHeight: `${window.innerHeight / 2.5}px`,
                                    overflow: 'auto'
                                }}>
                                    <Table
                                        //  exportFile={true}
                                        //  importFile={true}
                                        isSuccess={true}
                                        isLoading={false}
                                        // errorMassage={{}}
                                        top={100}
                                        scrollRole={true}
                                        // editRole=
                                        // localEdit={false}
                                        extraButtonRole={true}
                                        extraButton={
                                            (item: any) => {
                                                return <>
                                                    <div className="form-check d-flex justify-content-center">
                                                        <input className="form-check-input" type="checkbox" id="defaultCheck1"
                                                            checked={+item?.is_active ? true : false}
                                                            onChange={(e: any) => {
                                                                setActiveTab2(0)
                                                                setValue('pay_total_price', 0, {
                                                                    shouldValidate: true,
                                                                });
                                                                setValue('debt_price', 0, {
                                                                    shouldValidate: true,
                                                                })
                                                                setValue('discount', 0, {
                                                                    shouldValidate: true,
                                                                })
                                                                setResetAll(true)
                                                                setTimeout(() => {
                                                                    setResetAll(false)
                                                                }, 0);
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
                                                    </div>



                                                </>

                                            }
                                        }

                                        extraKeys={["servicetype_", "price_", "count_", 'discount_',
                                            // 'comment_'
                                            'qoldi_'
                                        ]}
                                        columns={[
                                            {
                                                title: '№',
                                                key: 'id',
                                                renderItem: (value: any, target: any) => {
                                                    let result = 'danger' as any;
                                                    if (+target?.is_active && (+target?.total_price - chegirmaHisobla(target) - +target?.pay_price) == 0) {
                                                        result = 'success'
                                                    } else if (+target?.is_active && (+target?.total_price - chegirmaHisobla(target) - +target?.pay_price) != 0 && +target?.pay_price > 0) {
                                                        result = 'info'
                                                    } else if (+target?.is_active && target?.pay_price == 0) {
                                                        result = 'warning'
                                                    }
                                                    return <td key={target.index} className={` p-1 bg-${result} text-white  h-100 `}>
                                                        <span>
                                                            {target.index + 1}
                                                            {/* {chegirmaHisobla(target) -target?.total_price} */}
                                                            {/* {+target?.total_price - chegirmaHisobla(target) - +target?.pay_price} */}

                                                        </span>
                                                    </td>

                                                },
                                            },

                                            // {
                                            //     title: "Bo'limi",
                                            //     key: 'department_',
                                            //     render: (value: any, data: any) => {
                                            //         return <button className='btn btn-sm'

                                            //         >
                                            //             {value?.service?.department?.name}
                                            //         </button>
                                            //     }
                                            // },
                                            {
                                                title: 'Xizmat turi',
                                                key: 'servicetype_',
                                                render: (value: any, data: any) => {
                                                    return value?.service?.name
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
                                                title: 'Chegirma',
                                                key: 'discount_',
                                                render: (value: any, data: any) => {
                                                    let chegirma = value?.discount ?? 0

                                                    if (chegirma <= 100) {
                                                        chegirma = ((value?.total_price) / 100) * chegirma
                                                    }
                                                    else {
                                                        chegirma = chegirma
                                                    }
                                                    return <>

                                                        <NumericFormat displayType="text"
                                                            thousandSeparator
                                                            decimalScale={2}
                                                            value={chegirma} />

                                                    </>
                                                }
                                            },


                                            {
                                                title: 'Jami',
                                                key: 'qoldi_',
                                                render: (value: any, data: any) => {
                                                    let chegirma = value?.discount ?? 0

                                                    if (chegirma <= 100) {
                                                        chegirma = ((value?.total_price) / 100) * chegirma
                                                    }
                                                    else {
                                                        chegirma = chegirma
                                                    }
                                                    return <>

                                                        <NumericFormat displayType="text"
                                                            thousandSeparator
                                                            decimalScale={2}
                                                            value={value?.total_price - chegirma} />

                                                    </>
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
                                            clinetValue
                                        }
                                    />
                                </div>
                                <div className="text-end "
                                    style={{
                                        marginRight: '2rem'
                                    }}
                                >
                                    <p className='fw-bold'>
                                        Jami: <NumericFormat displayType="text" thousandSeparator decimalScale={2} value={clinetValue
                                            ?.filter((item: any) => +item?.is_active)
                                            ?.reduce((acc: number, cur: any) => acc + +cur.total_price - chegirmaHisobla(cur), 0)} />
                                    </p>
                                </div>
                                {/* <h3 className='text-center'>
                                    Jami: <NumericFormat displayType="text" thousandSeparator decimalScale={2} value={clinetValue
                                        ?.filter((item: any) => +item?.is_active)
                                        ?.reduce((acc: number, cur: any) => acc + +cur.total_price, 0)} />
                                </h3> */}

                                <div className="divider text-start-center">
                                    <div className="divider-text">Hisobot</div>
                                </div>
                                <div style={{
                                    // height: `${window.innerHeight / 2.2}px`,
                                    // overflow: 'auto'
                                }}>
                                    <Table
                                        top={100}
                                        scrollRole={true}

                                        columns={[
                                            {
                                                title: "Jami to'lov",
                                                key: 'total_price',
                                                render: (value: any, data: any) => {
                                                    return <NumericFormat displayType="text"
                                                        thousandSeparator
                                                        decimalScale={2}
                                                        value={value} />
                                                }
                                            },

                                            {
                                                title: "Chegirma",
                                                key: 'discount',
                                                render: (value: any, data: any) => {
                                                    return <NumericFormat displayType="text"
                                                        thousandSeparator
                                                        decimalScale={2}
                                                        value={value} />
                                                }
                                            },
                                            {
                                                title: "To'lanayotgan",
                                                key: 'tolanyotkan',
                                                render: (value: any, data: any) => {
                                                    return <NumericFormat displayType="text"
                                                        thousandSeparator
                                                        decimalScale={2}
                                                        value={value} />
                                                }
                                            },
                                            {
                                                title: 'Qarz',
                                                key: 'debt',
                                                render: (value: any, data: any) => {
                                                    return <NumericFormat displayType="text"
                                                        thousandSeparator
                                                        decimalScale={2}
                                                        value={value} />
                                                }
                                            },
                                            {
                                                title: "To'langan",
                                                key: 'old_pay_total_price',
                                                render: (value: any, data: any) => {
                                                    return <NumericFormat displayType="text"
                                                        thousandSeparator
                                                        decimalScale={2}
                                                        value={value} />
                                                }
                                            },


                                        ]}
                                        dataSource={
                                            [
                                                // {
                                                // total_price: cashRegTotalPrice(clinetValue),
                                                // discount: +!data?.is_pay ? cashRegCurrentDiscout(clinetValue, +(getValues('discount') ?? 0)) :
                                                //     cashRegDiscount(data?.client_payment?.at(0)?.total_price, data?.client_payment?.at(0)?.discount),
                                                // // debt: +!data?.is_pay ? (getValues('pay_type')?.length == 0) ? 0 : cashRegCurrentDebt(clinetValue, +(getValues('discount') ?? 0), +(getValues('debt_price') ?? 0)) : cashRegTotalPrice(clinetValue) - cashRegDiscount(cashRegTotalPrice(clinetValue), (+(data?.discount_price ?? 0) + +(getValues('discount') ?? 0))) - data?.pay_total_price,
                                                // old_pay_total_price: 0,
                                                // debt: +data?.is_pay ? (getValues('debt_price') > 0 ? getValues('debt_price')- +cashRegDiscount(data?.client_payment?.at(0)?.total_price, data?.client_payment?.at(0)?.discount) : data?.total_price - data?.pay_total_price) - +cashRegDiscount(data?.client_payment?.at(0)?.total_price, data?.client_payment?.at(0)?.discount) : (getValues('debt_price') ?? 0),
                                                // // debt: +getValues('debt_price')>0 ? +getValues('debt_price') : +!data?.is_pay ? (getValues('pay_type')?.length == 0) ? 0 : cashRegCurrentDebt(clinetValue, +(getValues('discount') ?? 0), +(getValues('debt_price') ?? 0)) : cashRegTotalPrice(clinetValue) - cashRegDiscount(cashRegTotalPrice(clinetValue), (+(data?.discount_price ?? 0) + +(getValues('discount') ?? 0))) - data?.pay_total_price,
                                                // pay_total_price: +data?.is_pay ? (cashRegTotalPrice(clinetValue) - cashRegDiscount(data?.client_payment?.at(0)?.total_price, data?.client_payment?.at(0)?.discount) - (data?.pay_total_price)) : getValues('pay_total_price') ?? 0,

                                                // // +data?.is_pay ? +(data?.pay_total_price ?? 0) - +(getValues('debt_price') ?? 0) : cashRegCurrontPrice(clinetValue, ((data?.discount_price ?? 0) + +(getValues('discount') ?? 0)), +(data?.pay_total_price ?? 0) + +(getValues('debt_price') ?? 0))
                                                // // pay_total_price: cashRegCurrontPrice(clinetValue, ((data?.discount_price ?? 0) + +(getValues('discount') ?? 0)), +(data?.pay_total_price ?? 0) + +(getValues('debt_price') ?? 0)),
                                                // }
                                                repotTable(clinetValue, +(getValues('discount') ?? 0), +(getValues('pay_total_price') ?? 0), debtErorr, +data?.discount_price)
                                            ]
                                        }
                                    />
                                </div>

                                <div className="divider text-start-center">
                                    <div className="divider-text">To'lov qabul qilish</div>
                                </div>
                                <div className="row">
                                    <div className="col-5 ">
                                        <div className="d-flex gap-1 ">

                                            <button type='button' className='btn btn-warning' onClick={() => {
                                                discounToggle()
                                                setClintCopyValue(() => clinetValue)
                                            }}>
                                                Chegirma
                                            </button>
                                            <button type='button' className='btn btn-danger' onClick={() => {
                                                debtToggle()
                                            }}>
                                                Qarz
                                            </button>
                                        </div>
                                        {/* <div className="form-input my-4">
                                            <div className={`input-group ${discountErorr ? 'border-danger' : ''}`}>
                                                <label className="input-group-text bg-info text-white  w-25" htmlFor="html5-text-input">Chegirma</label>
                                                <NumericFormat
                                                    placeholder='chegirma'
                                                    disabled={+data?.discount_price > 0 ? true : false}
                                                    value={data?.discount_price > 0 ? data?.discount_price : getValues('discount')}
                                                    thousandSeparator
                                                    onChange={(e: any) => {
                                                        let discount = +e.target.value.replace(/,/g, '')
                                                        let umumiysumma = clinetValue?.reduce((a: any, b: any) => a + (+b?.is_active ? +b.total_price : 0), 0);
                                                        let tolangan = clinetValue?.reduce((a: any, b: any) => a + (+b.pay_price), 0)
                                                        let chegirma = discount as any;
                                                        if (discount <= 100) {
                                                            chegirma = ((umumiysumma / 100) * discount)
                                                        }
                                                        if (umumiysumma - (+chegirma) > 0) {
                                                            setValue('discount', discount, {
                                                                shouldValidate: true,
                                                            });
                                                            setDiscountErorr(false)
                                                        } else {
                                                            setDiscountErorr(true)
                                                        }
                                                        setValue('pay_total_price', 0, {
                                                            shouldValidate: true,
                                                        })

                                                        // let value = (clinetValue
                                                        //     ?.filter((item: any) => item?.is_active)
                                                        //     ?.reduce((acc: number, cur: any) => acc + +(cur?.qty ?? 1) * +(cur?.price ?? 0), 0) - discountCalc(discount)) - (getValues('debt_price') ?? 0);
                                                        // if (activeTab2 == '4') {
                                                        //     value = 0
                                                        // }
                                                        // setValue('pay_total_price', value, {
                                                        //     shouldValidate: true,
                                                        // });
                                                        // if (+(discount ?? 0) > 0 && +(getValues('debt_price') ?? 0) > 0) {
                                                        //     setValidate(cashRegisterValidateCheck({
                                                        //         role: 'debt_and_discount',
                                                        //     }));
                                                        // } else if (+(discount ?? 0) > 0) {
                                                        //     setValidate(cashRegisterValidateCheck({
                                                        //         role: 'discount',
                                                        //     }))
                                                        // } else if (+(getValues('debt_price') ?? 0) > 0) {
                                                        //     setValidate(cashRegisterValidateCheck({
                                                        //         role: 'debt',
                                                        //     }))
                                                        // }
                                                        setValue('debt_price', 0, {
                                                            shouldValidate: true,
                                                        })
                                                        setValue('pay_type', '', {
                                                            shouldValidate: true,
                                                        });
                                                        setActiveTab2('0');
                                                    }}
                                                    className='form-control'
                                                />
                                            </div>
                                            <ErrorInput>
                                                {errors.discount?.message?.toString() || hasError?.errors?.discount?.toString()}
                                            </ErrorInput>
                                        </div>
                                        <div className="form-input my-4">
                                            <div className="input-group">
                                                <label className="input-group-text bg-info text-white  w-25" htmlFor="html5-text-input">Izoh</label>
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
                                            </div>
                                            <ErrorInput>
                                                {errors.discount_comment?.message?.toString() || hasError?.errors?.discount_comment?.toString()}
                                            </ErrorInput>
                                        </div>
                                        <div className="form-input my-4">
                                            <div className="input-group">
                                                <label className="input-group-text bg-info text-white  w-25" htmlFor="html5-text-input">Qarz</label>
                                                <NumericFormat
                                                    placeholder='qarz'
                                                    disabled={getValues('pay_total_price') >= 0 ? false : true}
                                                    value={getValues('debt_price')}
                                                    thousandSeparator
                                                    // disabled

                                                    onChange={(e: any) => {
                                                        const debt_price = +e.target.value.replace(/,/g, '');
                                                        console.log('debt_price', debt_price);
                                                        let discount = (getValues('discount') ?? 0) + +data?.discount_price;

                                                        let umumiysumma = clinetValue?.reduce((a: any, b: any) => a + (+b?.is_active ? +b.total_price : 0), 0);
                                                        let chegirma = discount as any;
                                                        if (discount <= 100) {
                                                            chegirma = ((umumiysumma / 100) * discount)
                                                        }
                                                        let tolangan = clinetValue?.reduce((a: any, b: any) => a + (+b.pay_price), 0)
                                                        if (umumiysumma - chegirma - tolangan > 0 && (umumiysumma - chegirma - tolangan) - debt_price > 0) {
                                                            setValue('debt_price', debt_price, {
                                                                shouldValidate: true,
                                                            })
                                                        } else {
                                                            setValue('debt_price', 0, {
                                                                shouldValidate: true,
                                                            })
                                                        }

                                                        setValue('pay_total_price', 0, {
                                                            shouldValidate: true,
                                                        })

                                                        // if (+(getValues('discount') ?? 0) > 0 && +(debt_price ?? 0) > 0) {
                                                        //     setValidate(cashRegisterValidateCheck({
                                                        //         role: 'debt_and_discount',
                                                        //     }));
                                                        // } else if (+(getValues('discount') ?? 0) > 0) {
                                                        //     setValidate(cashRegisterValidateCheck({
                                                        //         role: 'discount',
                                                        //     }))
                                                        // } else if (+(debt_price ?? 0) > 0) {
                                                        //     setValidate(cashRegisterValidateCheck({
                                                        //         role: 'debt',
                                                        //     }))
                                                        // }

                                                        // let value = (clinetValue
                                                        //     ?.filter((item: any) => item?.is_active)
                                                        //     ?.reduce((acc: number, cur: any) => acc + +(cur?.qty ?? 1) * +(cur?.price ?? 0), 0)
                                                        //     -
                                                        //     discountCalc(getValues('discount'))
                                                        // )

                                                        //     - debt_price;
                                                        // // if (activeTab2 == '4') {
                                                        // //     value = 0
                                                        // // }

                                                        // setValue('pay_total_price', value, {
                                                        //     shouldValidate: true,
                                                        // });



                                                        // if (debt_price < 10) {
                                                        //     setNumberData((prev: any) => ({ ...prev, debt: 0 }));
                                                        //     setValue('debt_price', 0, {
                                                        //         shouldValidate: true,
                                                        //     });
                                                        // } else {
                                                        //     setNumberData((prev: any) => ({ ...prev, debt: debt_price }));

                                                        //     setValue('debt_price', debt_price, {
                                                        //         shouldValidate: true,
                                                        //     });
                                                        // }


                                                        setActiveTab2('0');
                                                        setValue('pay_type', '', {
                                                            shouldValidate: true,
                                                        });

                                                    }}
                                                    className='form-control'
                                                />
                                            </div>
                                            <ErrorInput>
                                                {errors.debt_price?.message?.toString() || hasError?.errors?.debt_price?.toString()}
                                            </ErrorInput>
                                        </div>
                                        <div className='form-input my-4'>
                                            <div className="input-group">
                                                <label className="input-group-text bg-info text-white  w-25" htmlFor="html5-text-input"> muddati</label>
                                                <input
                                                    required={+getValues('debt_price') > 0 ? true : false}

                                                    type="date" {...register('payment_deadline')} name='payment_deadline' className="form-control" />
                                            </div>
                                            <ErrorInput>
                                                {errors.payment_deadline?.message?.toString() || hasError?.errors?.payment_deadline?.toString()}
                                            </ErrorInput>
                                        </div>
                                        <div className="form-input my-4">
                                            <div className="input-group">
                                                <label className="input-group-text bg-info text-white  w-25" htmlFor="html5-text-input">Izoh</label>
                                                <input className="form-control" required={+getValues('debt_price') > 0 ? true : false}  {...register('debt_comment')} name='debt_comment' placeholder='Izoh' type="text" id="html5-text-input" />
                                            </div>
                                            <ErrorInput>
                                                {errors.debt_comment?.message?.toString() || hasError?.errors?.debt_comment?.toString()}
                                            </ErrorInput>
                                        </div> */}
                                    </div>
                                    <div className="col-7">

                                        {/* {JSON.stringify(clinetValue)} */}
                                        <div className='btn-group mt-4'>
                                            {
                                                clinetValue?.reduce((a: any, b: any) => a + (+b.is_active ? +b.total_price - (chegirmaHisobla(b)) : 0), 0) - clinetValue?.reduce((a: any, b: any) => a + +b.pay_price, 0) > 0 ?
                                                    <button className='btn btn-white border' type='button'
                                                        onClick={() => {
                                                            setUseBalance(!useBalance)
                                                            setValue('pay_total_price', 0)
                                                            setValue('pay_type', '')
                                                        }}
                                                    >
                                                        <div className="form-check form-switch">
                                                            <input className="form-check-input float-end" type="checkbox" role="switch" checked={useBalance} />
                                                        </div>
                                                    </button> : ''
                                            }
                                            <button type='button' className='btn btn-primary d-flex gap-2 align-items-center'>
                                                Balans
                                                {/* bage  bg-whte */}
                                                <span className='badge bg-white fw-bold text-primary'>
                                                    <NumericFormat displayType="text"
                                                        thousandSeparator
                                                        decimalScale={2}
                                                        value={useBalance ? (data?.balance ?? 0) > (getValues('pay_total_price') ?? 0) ? (data?.balance ?? 0) - (getValues('pay_total_price') ?? 0) : 0 : (data?.balance ?? 0)} />
                                                </span>
                                            </button>
                                            {/* <button className='btn btn-white border-primary'>
                                                
                                              
                                                <label htmlFor="">Balansdan</label>

                                            </button> */}
                                            {
                                                payStatus?.map((item: any) => {
                                                    return <button
                                                        type="button"
                                                        onClick={
                                                            () => {

                                                                setPriceAdd(false)
                                                                setValue('pay_type', item.key, {
                                                                    shouldValidate: true,
                                                                });

                                                                let jami = clinetValue?.reduce((a: any, b: any) => a + (+b.is_active ? +b.total_price - (chegirmaHisobla(b)) : 0), 0) as any
                                                                let tolayapti = getValues('pay_total_price') as any
                                                                let toladi = clinetValue?.reduce((a: any, b: any) => a + +b.pay_price, 0) as any
                                                                let qarzianiq = clinetValue?.reduce((a: any, b: any) => a + b.is_active ? 0 : +b.pay_price, 0) as any
                                                                let tolanyotkan = tolayapti > 0 ? tolayapti : jami - toladi;
                                                                // let tolanyotkan = qarzianiq > 0 ? qarzianiq - jami : jami;
                                                                // let toladi = clinetValue?.reduce((a: any, b: any) => a + +b.pay_price, 0) as any
                                                                // if (jami == 0) {
                                                                //     tolanyotkan = - toladi
                                                                // }

                                                                if (item?.value == 4 || activeTab2 == 4) {
                                                                    tolanyotkan = 0
                                                                    setUseBalance(false)
                                                                    setPayStatus((prev: any) => prev.map((item2: any, index: number) => {
                                                                        return {
                                                                            ...item2,
                                                                            price: 0
                                                                        }
                                                                    }))
                                                                    setValue('pay_total_price', 0, {
                                                                        shouldValidate: true,
                                                                    });
                                                                    setDebtErorr(true)
                                                                } else {
                                                                    setDebtErorr(false)
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
                                                                    setValue('pay_total_price', tolanyotkan, {
                                                                        shouldValidate: true,
                                                                    });
                                                                }


                                                                setActiveTab2(item?.value)




                                                            }
                                                        }
                                                        className={`btn  btn-md ${activeTab2 === item?.value ? 'btn-info' : 'btn-outline-info'}`}
                                                    >{item?.label}</button>
                                                })
                                            }


                                        </div>
                                        {
                                            activeTab2 == 4 ? <>
                                                {
                                                    payStatus?.filter((item: any,) => item?.value != 4)?.map((item: any, index: any) => {
                                                        return <div className="form-input my-4">
                                                            <div className="input-group">
                                                                <label className="input-group-text bg-info text-white  w-25" htmlFor="html5-text-input">{item?.label}</label>
                                                                <NumericFormat
                                                                    disabled={getValues('pay_total_price') >= 0 ? false : true}
                                                                    isAllowed={(e: any) => {
                                                                        console.log(e);
                                                                        const { value } = e
                                                                        let total = payStatus?.slice(0, 3)
                                                                            ?.filter((totalItem: any,) => item?.value != totalItem.value)
                                                                            ?.reduce((a: any, b: any) => a + (+b?.price), 0);
                                                                        let jami = clinetValue?.reduce((a: any, b: any) => a + (+b.is_active ? +b.total_price - (chegirmaHisobla(b)) : 0), 0) as any
                                                                        let toladi = clinetValue?.reduce((a: any, b: any) => a + +b.pay_price, 0) as any
                                                                        console.log(value);
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
                                                                        let discount = getValues('discount') ?? 0
                                                                        let debt = getValues('debt_price') ?? 0
                                                                        let pay_total_price = value
                                                                        let umumiysumma = clinetValue?.reduce((a: any, b: any) => a + (+b?.is_active ? +b.total_price : 0), 0);
                                                                        let chegirma = discount as any;
                                                                        if (discount <= 100) {
                                                                            chegirma = ((umumiysumma / 100) * discount)
                                                                        }

                                                                        let tolangan = clinetValue?.reduce((a: any, b: any) => a + (+b.pay_price), 0)
                                                                        if (total + value == 0) {
                                                                            if (umumiysumma - chegirma - tolangan > 0) {
                                                                                setValue('debt_price', (umumiysumma - chegirma - tolangan) - total, {
                                                                                    shouldValidate: true,
                                                                                });
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
                                                                            setValue('pay_total_price', 0, {
                                                                                shouldValidate: true,
                                                                            });
                                                                        } else {
                                                                            if ((umumiysumma - chegirma - tolangan) - (value + total) >= 0) {
                                                                                setValue('debt_price', ((umumiysumma - chegirma - tolangan) - (value + total)), {
                                                                                    shouldValidate: true,
                                                                                });
                                                                                setValue('pay_total_price', total + value, {
                                                                                    shouldValidate: true,
                                                                                });
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

                                            </> : (activeTab2 > 0 && getValues('pay_type')?.length > 0) && <div className="form-input my-4">
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
                                                        // disabled
                                                        onChange={(e: any) => {
                                                            setPriceAdd(true)
                                                            let value = +e.target.value.replace(/,/g, '') as any; // Virgullarni olib tashlash
                                                            if (value == 0) {
                                                                setDebtErorr(true)
                                                            } else {
                                                                setDebtErorr(false)
                                                            }
                                                            let discount = getValues('discount') ?? 0
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
                                                                setValue('pay_total_price', 0, {
                                                                    shouldValidate: true,
                                                                });
                                                                setValue('debt_price', tolanyotkan, {
                                                                    shouldValidate: true,
                                                                });
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
                                                                setValue('debt_price', (tolanyotkan) - value, {
                                                                    shouldValidate: true,
                                                                });
                                                                setValue('pay_total_price', value, {
                                                                    shouldValidate: true,
                                                                });
                                                                // }
                                                            }
                                                            //     if (umumiysumma - chegirma - tolangan > 0 && (umumiysumma - chegirma - tolangan) - value > 0) {
                                                            //         setPayStatus((prev: any) => prev.map((item2: any, index: number) => {
                                                            //             if (item2?.value == activeTab2) {
                                                            //                 return {
                                                            //                     ...item2,
                                                            //                     price: tolangan
                                                            //                 }
                                                            //             }
                                                            //             return {
                                                            //                 ...item2,
                                                            //                 price: 0
                                                            //             }
                                                            //         }))
                                                            //         setValue('pay_total_price', tolangan, {
                                                            //             shouldValidate: true,
                                                            //         });
                                                            //     }
                                                            // setValue('debt_price', tolangan, {
                                                            //     shouldValidate: true,
                                                            // });
                                                            // let debt = 0, total = 0
                                                            // if (+data?.is_pay) {

                                                            //     total = debtRegTotalPrice(clinetValue) as any
                                                            //     if (total == 0) {
                                                            //         if (data?.debt_price >= value) {
                                                            //             debt = data?.debt_price - value
                                                            //         } else {
                                                            //             value = 0
                                                            //             debt = data?.debt_price
                                                            //         }
                                                            //     } else {
                                                            //         if (total + +data?.debt_price - value >= 0) {
                                                            //             debt = total + +data?.debt_price - value
                                                            //         } else {
                                                            //             value = 0
                                                            //             debt = total + +data?.debt_price
                                                            //         }
                                                            //     }

                                                            // } else {
                                                            //     let discoutn = getValues('discount') ?? 0
                                                            //     // debt = (getValues('debt_price') ?? 0)
                                                            //     total = cashRegTotalPrice(clinetValue) as any

                                                            //     if (discoutn > 0) {
                                                            //         total = cashRegDiscountFun(total, discoutn)
                                                            //     }

                                                            //     if (total > 0 && total >= value) {
                                                            //         // total = total - value
                                                            //         debt = total - value
                                                            //     } else {
                                                            //         value = 0
                                                            //         debt = total
                                                            //     }

                                                            // }

                                                            // setPayStatus((prev: any) => prev.map((item2: any, index: number) => {
                                                            //     if (item2?.value == activeTab2) {
                                                            //         return {
                                                            //             ...item2,
                                                            //             price: value
                                                            //         }
                                                            //     }
                                                            //     return item2
                                                            // }))
                                                            // setValue('pay_total_price', value, {
                                                            //     shouldValidate: true,
                                                            // });
                                                            // setValue('debt_price', debt, {
                                                            //     shouldValidate: true,
                                                            // });
                                                            // let total = (clinetValue?.filter((item: any) => item?.is_active)?.reduce((acc: number, cur: any) => acc + +(cur?.qty ?? 1) * +(cur?.price ?? 0), 0) ?? 0 - (data?.pay_total_price ?? 0) + (data?.discount_price ?? 0)) - discountCalc(getValues('discount'))
                                                            // setValue('pay_total_price', total - (total - value), {
                                                            //     shouldValidate: true,
                                                            // });
                                                            // setValue('debt_price', (total - value), {
                                                            //     shouldValidate: true,
                                                            // });

                                                        }}
                                                        className='form-control'
                                                    />
                                                </div>
                                            </div>
                                        }
                                        {
                                            useBalance && (getValues('pay_total_price') ?? 0) > 0 ? <p>
                                                Balans:
                                                <span className='text-danger fw-bold'>
                                                    <NumericFormat displayType="text"
                                                        thousandSeparator
                                                        decimalScale={2}
                                                        value={
                                                            (data?.balance ?? 0) > (getValues('pay_total_price') ?? 0) ? Math.abs(data?.balance - (data?.balance ?? 0) - (getValues('pay_total_price') ?? 0)) : data?.balance
                                                        } />
                                                </span>

                                            </p> : ''
                                        }

                                        {
                                            errors.pay_type?.message?.toString() && <div className="alert alert-danger" role="alert">{errors.pay_type?.message?.toString()}</div>
                                        }
                                    </div>

                                </div>
                                {
                                    errors.pay_total_price?.message?.toString() && <div className="alert alert-danger" role="alert">{errors.pay_total_price?.message?.toString()}</div>
                                }
                            </div>
                            {/* <div className="col-6">
                               
                               
                            </div> */}
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
                                    1-qadam
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
                                    2-qadam
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
                    <div className="modal-footer">
                        {/* 
                        {
                            activeTab == '2' &&
                            <button
                                type='submit'
                                onClick={() => {
                                    setEnter(() => false)
                                }}
                                className="btn btn-primary" data-bs-dismiss="modal">
                                saqlash
                            </button>
                        }
                        <button
                            type={
                                'button'
                            }
                            onClick={() => {
                                if (activeTab == '1') {
                                    setActiveTab('2')
                                }
                                if (activeTab == '2') {
                                    setActiveTab('1')
                                }
                            }}
                            className="btn btn-primary" data-bs-dismiss="modal">
                            {
                                activeTab == '1' ? <>
                                    2-qadam  <FaAngleDoubleRight />
                                </> : <>
                                    <FaAngleDoubleLeft />1-qadam
                                </>}
                        </button> */}
                        <button
                            type='submit'
                            onClick={() => {
                                setEnter(() => false)
                            }}
                            className="btn btn-primary" data-bs-dismiss="modal">
                            Qabul qilish
                        </button>

                        <button type="button" className="btn btn-danger" onClick={toggle}>Ortga</button>
                    </div>
                </form>
            </Modal >
            <DepartmentAdd
                modal={modal2} setModal={setModal2}
            />
            <Modal backdrop="static" keyboard={false} centered={true} isOpen={discountModal} toggle={discounToggle} role='dialog' size='xl' >
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
                    discounToggle()
                }}>


                    <div className="modal-header">
                        <h1 className='modal-title'>Chegirma</h1>
                    </div>
                    <div className="modal-body">
                        <div className="row">
                            <div className="form-input my-4 col-6">
                                <div className={`input-group ${discountErorr ? 'border-danger' : ''}`}>
                                    <label className="input-group-text bg-info text-white  w-25" htmlFor="html5-text-input">Chegirma</label>
                                    <NumericFormat
                                        placeholder='chegirma'
                                        value={numberData?.discount ?? 0}
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
                            <Table
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
                                            return value?.service?.name
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
                            />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button className='btn btn-primary' >Saqlash</button>
                        <button className='btn btn-danger' type='button' onClick={() => {
                            discounToggle()
                            setNumberData(() => {
                                return {
                                    ...numberData,
                                    discount: 0
                                }
                            })
                        }}>Ortga</button>
                    </div>
                </form>

            </Modal>

            <Modal backdrop="static" keyboard={false} centered={true} isOpen={debtModal} toggle={debtToggle} role='dialog' >
                <form onSubmit={(e: any) => {
                    e.preventDefault()
                    sendApi({ ...getValues() })
                }}>

                    <div className="modal-header">
                        <h3 className="modal-title">
                            Qarzdorlik
                        </h3>
                    </div>
                    <div className="modal-body">
                        <div className='form-input my-4'>
                            <div className="input-group">
                                <label className="input-group-text bg-info text-white  w-25" htmlFor="html5-text-input"> muddati</label>
                                <input
                                    required={+getValues('debt_price') > 0 ? true : false}

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
                                <input className="form-control" required={+getValues('debt_price') > 0 ? true : false}
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

            <iframe ref={iframeRef} style={{ display: 'none' }} title="print-frame" />
        </>
    )
}

export default CashRegister