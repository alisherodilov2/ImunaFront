import React, { useEffect, useRef, useState } from 'react'
// import Layout from '../layouts/Layout'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Toast, ToastHeader, ToastBody, TabPane, TabContent, NavItem, Nav, NavLink, PopoverBody, PopoverHeader, Popover } from 'reactstrap'
import classnames from 'classnames';
import { useForm } from "react-hook-form";
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
import { MdDeleteForever } from 'react-icons/md';
import Swal from 'sweetalert2';
// import { json, json } from 'react-router-dom';
import { AppDispatch } from '../../../service/store/store';
import { isClientAdd, isClientDefaultApi, isClientEdit } from '../../../service/reducer/ClientReducer';
import DepartmentAdd from '../../director/services/department/DepartmentAdd';
import Table from '../../../componets/table/Table';
import { nanoid } from '@reduxjs/toolkit';
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaBoxOpen, FaHome, FaHospitalSymbol, FaPrint } from 'react-icons/fa';
import { isGrapItemDelete } from '../../../service/reducer/GraphReducer';
import GraphAdd from '../graph/GraphAdd';
import RegGraphAdd from '../graph/RegGraphAdd';
import { fullName, masulRegUchunFullName } from '../../../helper/fullName';
import { getCurrentDateTime } from '../../../helper/dateFormat';
import { formatId } from '../../../helper/idGenerate';
import ReClientAdd from './ReClientAdd';
import { generateCheck } from '../../../helper/generateCheck';
import { clientvalidateCheck } from './validate/clientValidate';
import { formatDateMonthName, graphAChiveStatus } from '../../../helper/graphHelper';
import { findMaxGraphItem } from '../../../helper/treatmentHelper';
import { calculateAge } from '../../../helper/calculateAge';
import TableLoader from '../../../componets/table/TableLoader';
import { grapAchiveStatus } from '../../../helper/clientHelper';
import { use_status } from '../../cash_register/WelcomeCashRegister';
// import { isAddClient, isEditClient } from '../../client/reducer/ClientReducer';
const ClientAllSetting = ({ data, modal, setModal, setData = function () { }, resetItem = false, setExtraModalClose = function () { }, graph = false, reRegister = false, clientAddModal, clientItem }: { clientAddModal?: any, clientItem?: any, graph?: boolean, reRegister?: boolean, setData?: any, data?: any, modal?: boolean; setModal?: any, resetItem?: boolean, setExtraModalClose?: Function }) => {
    const { serviceData, } = useSelector((state: ReducerType) => state.ServiceReducer)
    const { user, } = useSelector((state: ReducerType) => state.ProfileReducer)
    const { departmentData, } = useSelector((state: ReducerType) => state.DepartmentReducer)
    const { clientData } = useSelector((state: ReducerType) => state.ClientReducer)
    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const [modal2, setModal2] = useState(false)
    const [modal3, setModal3] = useState(false)
    const { serviceTypeData } = useSelector((state: ReducerType) => state.ServiceTypeReducer)
    const dataSelect = (data: any) => {
        let res = [...data];
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
    const { isLoading, sendLoading, isSuccessApi, hasError } = useSelector((state: ReducerType) => state.ClientReducer)
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
        resolver: yupResolver(clientvalidateCheck({
            setting: user?.setting
        })),
        defaultValues: {
            ...data
        }

    });
    const [clinetValue, setClientValue] = useState([] as any)
    const [activeTab, setActiveTab] = useState('1' as any);
    const [parentActiveTab, setParentActiveTab] = useState('1' as any);
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
        if (data?.client_value?.length > 0) {
            let resdata = data?.client_value?.map((item: any) => {
                return {
                    status: 'old',
                    ...item?.service,
                    pay_price: item?.pay_price ?? 0,
                    is_active: item?.is_active ?? 0,
                    qty: +item?.qty,
                    service_id: item?.service_id,
                    price: item?.price,
                    id: item?.id,
                }
            })


            setClientValue(() => resdata)
            setSelectData(() => {
                return {
                    ...selectData,
                    service_id: []
                }
            })
        }
        if (Object.keys(data ?? {})?.length > 0) {
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
            setModal(enter)
            if (data?.graph_item_id > 0) {
                setExtraModalClose()
                dispatch(isGrapItemDelete(+data?.graph_item_id))
            }
            dispatch(isClientDefaultApi())
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
        }
    }, [modal, data, isLoading, isSuccessApi])

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
        setClientValue(() => [])

        setSelectData(() => {
            return false
        })
        reset(
            resetObj
        )
        setActiveTab('1')
        setParentActiveTab('1')
    };
    const [item, setItem] = useState({} as any)

    const send = (e: any) => {

        const {
            first_name, last_name, phone, person_id, data_birth, citizenship, sex
        } = e
        console.log('mappppp', clinetValue?.map((res: any) => {
            return {
                id: res?.id ?? 0,
                service_id: res?.service_id,
                price: res.price,
                qty: res.qty ?? 1,
                is_probirka: res?.department?.probirka
            }
        }));

        dispatch(isClientAdd({
            query: queryObj({
                first_name: first_name,
                last_name: last_name,
                phone: phone,
                person_id: `${person_id}`,
                data_birth: data_birth,
                citizenship: citizenship,
                sex: sex,
                person_edit: '1',
            })
        }))
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
    const parenttoggleTab = (tab: any) => {
        if (parentActiveTab !== tab) {
            setParentActiveTab(tab);
        }
    };
    return (
        <>
            <Loader loading={sendLoading} />
            <Modal centered={true} isOpen={modal} toggle={toggle} role='dialog' size='xl' backdrop="static" keyboard={false} fullscreen>
                <form onSubmit={handleSubmit(send)} className='size_16'>

                    <div className="modal-header">
                        <div className="d-flex align-items-center gap-2">
                            <h5 className="modal-title mb-0" id="modalCenterTitle">Mijoz malumotlari</h5>
                            <h4 className='fw-blod mb-0'>
                                Yoshi:{data?.data_birth?.length > 0 ? calculateAge(data?.data_birth, user?.graph_format_date) : 0}
                            </h4>
                            <h4 className='fw-blod mb-0'>
                                ID:{formatId(data?.person_id)}
                            </h4>
                        </div>
                        <button onClick={toggle} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body">
                        <div className="d-flex justify-content-between align-items-center">
                            <Nav tabs >
                                <NavItem>
                                    <NavLink
                                        style={{
                                            cursor: 'pointer'
                                        }}
                                        className={classnames({ active: parentActiveTab === '1' })}
                                        onClick={() => parenttoggleTab('1')}
                                    >
                                        Mijoz ma'lumotlari
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        style={{
                                            cursor: 'pointer'
                                        }}
                                        className={classnames({ active: parentActiveTab === '2' })}
                                        onClick={() => parenttoggleTab('2')}
                                    >
                                        Tashriflar
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        style={{
                                            cursor: 'pointer'
                                        }}
                                        className={classnames({ active: parentActiveTab === '3' })}
                                        onClick={() => parenttoggleTab('3')}
                                    >
                                        To'lovlar
                                    </NavLink>
                                </NavItem>
                                {
                                    data?.treatment?.length > 0 ?
                                        <NavItem>
                                            <NavLink
                                                style={{
                                                    cursor: 'pointer'
                                                }}
                                                className={classnames({ active: parentActiveTab === '4' })}
                                                onClick={() => parenttoggleTab('4')}
                                            >
                                                Muolaja
                                            </NavLink>
                                        </NavItem> : <></>
                                }
                                {
                                    data?.at_home?.length > 0 ?
                                        <NavItem>
                                            <NavLink
                                                style={{
                                                    cursor: 'pointer'
                                                }}
                                                className={classnames({ active: parentActiveTab === '5' })}
                                                onClick={() => parenttoggleTab('5')}
                                            >
                                                Uyda
                                            </NavLink>
                                        </NavItem> : <></>
                                }
                            </Nav>
                            <div className="d-flex gap-2">
                                {
                                    reRegister ?
                                        <button className='btn btn-warning' type='button'
                                            onClick={() => {
                                                const {
                                                    first_name, last_name, phone, person_id, data_birth, citizenship, sex,
                                                    parent_id, id
                                                } = data

                                                clientItem(() => {
                                                    return {
                                                        first_name: first_name,
                                                        last_name: last_name,
                                                        phone: phone,
                                                        person_id: person_id,
                                                        parent_id: id,
                                                        data_birth: data_birth,
                                                        citizenship: citizenship
                                                        , sex: sex
                                                    }
                                                })
                                                clientAddModal(true)
                                            }}
                                        >Qayta ko'rik</button> : ''
                                }
                                {
                                    graph ?
                                        <button className='btn btn-success' type='button'
                                            onClick={() => {
                                                const {
                                                    first_name, last_name, phone, person_id, data_birth, citizenship, sex
                                                } = data
                                                setModal2(true)
                                                setItem(() => {
                                                    return {
                                                        first_name: first_name,
                                                        last_name: last_name,
                                                        phone: phone,
                                                        person_id: person_id,
                                                        data_birth: data_birth,
                                                        citizenship: citizenship
                                                        , sex: sex
                                                    }
                                                })
                                            }}


                                        >Grafik</button> : ''
                                }
                            </div>
                        </div>
                        <TabContent activeTab={parentActiveTab} className='p-0'>
                            <TabPane tabId='1'>
                                <div className='row' >
                                    <div className="col-4 mb-1">
                                        <label className="form-label">ID</label>
                                        <Input type="text" placeholder="Familiyasi"
                                            value={formatId(data?.person_id)} readOnly
                                        />
                                    </div>
                                    <div className="col-4 mb-1">
                                        <label className="form-label">F.I.SH</label>
                                        <Input type="text" placeholder="Familiyasi"  {...register('first_name')} name='first_name'
                                            error={errors.first_name?.message?.toString() || hasError?.errors?.first_name?.toString()}
                                        />
                                    </div>
                                    {/* <div className="col-4 mb-1">
                                        <label className="form-label">Ismi</label>
                                        <Input type="text" placeholder="Ismi"  {...register('last_name')} name='last_name'
                                            error={errors.last_name?.message?.toString() || hasError?.errors?.last_name?.toString()}
                                        />
                                    </div> */}
                                    <div className="col-4 mb-1">
                                        <label className="form-label">Tug'ilgan sanasi</label>
                                        <Input type="date" placeholder="Ismi"  {...register('data_birth')} name='data_birth'
                                            error={errors.data_birth?.message?.toString() || hasError?.errors?.data_birth?.toString()}
                                        />
                                    </div>
                                    <div className="col-4 mb-1">
                                        <label className="form-label">Telefon raqami</label>
                                        <input type="hidden" {...register('phone')} name='phone' />
                                        <div className="input-group">
                                            <div className="input-group-text">
                                                +998
                                            </div>
                                            <PatternFormat
                                                format="(##) ###-##-##"
                                                mask="_"
                                                value={getValues('phone')}
                                                allowEmptyFormatting
                                                className='form-control'
                                                placeholder="+998 (___) ___-____"
                                                onChange={(e: any) => {
                                                    setValue('phone', e.target.value.replace(/[^\d]/g, ''), {
                                                        shouldValidate: true,
                                                    });
                                                }}
                                            />
                                        </div>
                                        <ErrorInput>
                                            {errors.phone?.message?.toString() || hasError?.errors?.phone?.toString()}
                                        </ErrorInput>

                                    </div>
                                    <div className="col-4 mb-1">
                                        <label className="form-label">jinsi</label>
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
                                    </div>
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
                                </div>
                            </TabPane>
                            <TabPane tabId="2">
                                <div className="card" style={{
                                    height: `${window.innerHeight / 1.7}px`,
                                    overflow: 'auto'
                                }}>
                                    <Table
                                        paginationRole={false}
                                        top={100}
                                        scrollRole={true}
                                        extraKeys={[
                                            'full_name_',
                                            // 'phone_',
                                            // 'person_id_',
                                            // 'probirka_',
                                            'total_price_',
                                            'client_item_count',
                                            'queue_item_count',
                                            'status_',
                                            'result_ss'
                                        ]}
                                        columns={[
                                            {
                                                title: '№',
                                                key: 'id',
                                                render: (value: any, data: any) => {
                                                    return <div key={data.index} className='d-flex  align-items-center gap-1'>

                                                        <span>
                                                            {((data?.index + 1))}
                                                        </span>
                                                    </div>
                                                }
                                            },
                                            {
                                                title: "F.I.O",
                                                key: 'full_name_',
                                                render: (value: any, data: any) => {
                                                    return <b
                                                    >
                                                        {fullName(value)}
                                                        <br />
                                                        <span className='text-info register_date'  >
                                                            {getCurrentDateTime(value?.created_at)}
                                                        </span>
                                                    </b>
                                                }
                                            },
                                            // {
                                            //     title: 'Tel',
                                            //     key: 'phone_',
                                            //     render: (value: any, data: any) => {
                                            //         return `+998${value?.phone}`
                                            //     }
                                            // },
                                            // {
                                            //     title: 'ID',
                                            //     key: 'person_id_',
                                            //     render: (value: any, data: any) => {
                                            //         return formatId(value?.person_id)
                                            //     }
                                            // },
                                            // {
                                            //     title: 'Probirka',
                                            //     key: 'probirka_',
                                            //     render: (value: any, data: any) => {
                                            //         return <NumericFormat displayType="text"
                                            //             thousandSeparator
                                            //             decimalScale={2}
                                            //             value={value?.probirka_count || 0} />
                                            //     }
                                            // },
                                            {
                                                title: 'Summa',
                                                key: 'total_price_',
                                                render: (value: any, data: any) => {
                                                    return <NumericFormat displayType="text"
                                                        thousandSeparator
                                                        decimalScale={2}
                                                        value={value?.total_price} />
                                                }
                                            },
                                            {
                                                title: 'Xizmatlar',
                                                key: 'client_item_count',
                                                render: (value: any) => {
                                                    let data = [] as any;
                                                    let serviceId = [] as any
                                                    for (let res of value?.client_value) {
                                                        if (!serviceId?.find((resItem: any) => resItem == res?.service?.id)) {

                                                            data.push(<p className={
                                                                `mb-1 text-white badge bg-${value?.client_result?.find((resItem: any) => resItem?.department_id == res?.department_id && resItem?.is_check_doctor == 'finish') ? 'success' : 'secondary'}`
                                                            }>
                                                                {res?.service?.name}
                                                            </p>)
                                                            serviceId.push(res?.service?.id)
                                                        }
                                                    }
                                                    return <div className="d-flex align-items-center gap-1 flex-wrap">
                                                        {/* {
                                                            value?.client_value?.map((res: any, index: number) => {
                                                                return <p className={
                                                                    `mb-1 text-white badge bg-${value?.client_result?.find((resItem: any) => resItem?.department_id == res?.department_id && resItem?.is_check_doctor == 'finish') ? 'success' : 'secondary'}`
                                                                }>
                                                                    {res?.service?.name}
                                                                </p>
                                                            })
                                                        } */}
                                                        {data}
                                                    </div>
                                                }
                                            },
                                            {
                                                title: 'Navbatlar',
                                                key: 'queue_item_count',
                                                render: (value: any, data: any) => {
                                                    return <div className="d-flex align-items-center gap-1 flex-wrap">
                                                        {
                                                            value?.client_result?.map((res: any, index: number) => {
                                                                let depFind = value?.client_value?.filter((res2: any) => !res2?.is_at_home)?.find((resItem: any) => resItem?.department?.id == res?.department?.id);
                                                                let qu_number = depFind.queue_number
                                                                if (+depFind?.service?.department?.is_reg_time) {
                                                                    qu_number = value?.client_time?.find((kk: any) => kk.department?.id == res?.department?.id)?.agreement_time
                                                                }
                                                                return <p className={
                                                                    `mb-1 text-white badge bg-${value?.client_result?.find((resItem: any) => resItem?.department_id == res?.department_id && resItem?.is_check_doctor == 'finish') ? 'success' : 'secondary'}`
                                                                }>
                                                                    {`${depFind?.service?.department?.letter} - ${qu_number}`}
                                                                </p>
                                                            })
                                                        }
                                                    </div>
                                                }
                                            },
                                            {
                                                title: 'Status',
                                                key: 'status_',
                                                render: (value: any, data: any) => {
                                                    let status = use_status?.find((res: any) => res.value == value.use_status)
                                                    const { finish_department_count, department_count } = value

                                                    return <button className={`btn  btn-${finish_department_count == department_count ? 'success' : 'secondary'} rounded-pill btn-sm `}  >
                                                        {status ? status?.label : 'Ambulator'}
                                                    </button>
                                                }
                                            },
                                            {
                                                title: 'Natijlar',
                                                key: 'result_ss',

                                                render: (value: any, data: any) => {
                                                    return <button className='btn btn-sm btn-info'
                                                        onClick={() => {
                                                            window.open(`${user?.setting?.result_domain}?client_id=${value?.id}`, '_blank')
                                                        }}

                                                    >Yuklab olish</button>
                                                }
                                            }

                                        ]}
                                        dataSource={
                                            data?.client_item
                                        }
                                    />
                                </div>
                            </TabPane>
                            <TabPane tabId="3">
                                <div className="card" style={{
                                    height: `${window.innerHeight / 1.7}px`,
                                    overflow: 'auto'
                                }}>
                                    <Table
                                        paginationRole={false}
                                        top={100}
                                        scrollRole={true}
                                        extraKeys={[
                                            'full_name_',
                                            // 'phone_',
                                            // 'person_id_',
                                            // 'probirka_',
                                            'total_price_',
                                            'pay_total_price_',
                                            'cash_price_',
                                            'card_price_',
                                            'transfer_price_',
                                            'discount_',
                                            'debt_',
                                            'balance_',
                                            'qaytatildi_',
                                            'payment_deadline_',
                                            // 'client_item_count',
                                            'qabul_qildi',
                                            'created_at_',
                                            'print_',
                                        ]}
                                        columns={[
                                            {
                                                title: '№',
                                                key: 'id',
                                                render: (value: any, data: any) => {
                                                    return <div key={data.index} className='d-flex  align-items-center gap-1'>

                                                        <span>
                                                            {((data?.index + 1))}
                                                        </span>
                                                    </div>
                                                }
                                            },
                                            {
                                                title: "F.I.O",
                                                key: 'full_name_',
                                                render: (value: any) => {
                                                    return <

                                                        >
                                                        {fullName(data)}
                                                    </>
                                                }
                                            },
                                            // {
                                            //     title: 'Tel',
                                            //     key: 'phone_',
                                            //     render: (value: any, data: any) => {
                                            //         return `+ 998${ value?.phone}`
                                            //     }
                                            // },
                                            // {
                                            //     title: 'ID',
                                            //     key: 'person_id_',
                                            //     render: (value: any, data: any) => {
                                            //         return formatId(value?.person_id)
                                            //     }
                                            // },
                                            {
                                                title: 'umumiy tolov',
                                                key: 'total_price_',
                                                render: (value: any, data: any) => {
                                                    return <NumericFormat displayType="text"
                                                        thousandSeparator
                                                        decimalScale={2}
                                                        value={(value?.total_price ?? 0)} />
                                                }
                                            },
                                            {
                                                title: "To'landi",
                                                key: 'pay_total_price_',
                                                render: (value: any, data: any) => {
                                                    return <NumericFormat displayType="text"
                                                        thousandSeparator
                                                        decimalScale={2}
                                                        value={(value?.pay_total_price ?? 0)} />
                                                }
                                            },

                                            {
                                                title: 'Naqd',
                                                key: 'cash_price_',
                                                render: (value: any, data: any) => {
                                                    return <NumericFormat displayType="text"
                                                        thousandSeparator
                                                        decimalScale={2}
                                                        value={(value?.cash_price ?? 0)} />
                                                }
                                            },
                                            {
                                                title: 'Plastik',
                                                key: 'card_price_',
                                                render: (value: any, data: any) => {
                                                    return <NumericFormat displayType="text"
                                                        thousandSeparator
                                                        decimalScale={2}
                                                        value={(value?.card_price ?? 0)} />
                                                }
                                            },
                                            {
                                                title: "O'tkazma",
                                                key: 'transfer_price_',
                                                render: (value: any, data: any) => {
                                                    return <NumericFormat displayType="text"
                                                        thousandSeparator
                                                        decimalScale={2}
                                                        value={(value?.transfer_price ?? 0)} />
                                                }
                                            },
                                            {
                                                title: 'chegirma',
                                                key: 'discount_',
                                                render: (value: any, data: any) => {
                                                    return <NumericFormat displayType="text"
                                                        thousandSeparator
                                                        decimalScale={2}
                                                        value={(value?.discount ?? 0)} />
                                                }
                                            },
                                            {
                                                title: 'qarz',
                                                key: 'debt_',
                                                render: (value: any, data: any) => {
                                                    return <NumericFormat displayType="text"
                                                        thousandSeparator
                                                        decimalScale={2}
                                                        value={(value?.debt_price ?? 0)} />
                                                }
                                            },
                                            {
                                                title: 'Balansdan',
                                                key: 'balance_',
                                                render: (value: any, data: any) => {
                                                    return <NumericFormat displayType="text"
                                                        thousandSeparator
                                                        decimalScale={2}
                                                        value={(value?.balance ?? 0)} />
                                                }
                                            },
                                            {
                                                title: 'Qaytarildi',
                                                key: 'qaytatildi_',
                                                render: (value: any, data: any) => {
                                                    return <NumericFormat displayType="text"
                                                        thousandSeparator
                                                        decimalScale={2}
                                                        value={(value?.back_total_price ?? 0)} />
                                                }
                                            },
                                            {
                                                title: 'qaytarish muddati',
                                                key: 'payment_deadline_',
                                                render: (value: any, data: any) => {
                                                    return (value?.payment_deadline ?? '-')
                                                }
                                            },
                                            {
                                                title: 'Qabul qildi',
                                                key: 'qabul_qildi',
                                                render: (value: any, data: any) => {
                                                    return value?.user ? masulRegUchunFullName(value?.user) : '-'
                                                }
                                            },
                                            // {
                                            //     title: 'Xizmatlar',
                                            //     key: 'client_item_count',
                                            //     render: (value: any, data: any) => {
                                            //         return <><NumericFormat displayType="text"
                                            //             thousandSeparator
                                            //             decimalScale={2}
                                            //             value={value?.service_count} /> /0 </>
                                            //     }
                                            // },
                                            {
                                                title: "To'langan vaqti",
                                                key: 'created_at_',
                                                render: (value: any, data: any) => {
                                                    return `${getCurrentDateTime(value?.created_at)}`
                                                }
                                            },
                                            {
                                                title: "Check",
                                                key: 'print_',
                                                render: (value: any) => {
                                                    return <button type='button' className='btn btn-sm btn-info'
                                                        onClick={() => {
                                                            let find = data?.client_item?.find((res: any) => res?.id == value?.client_id)
                                                            let json = JSON.parse(value?.client_value_id_data ?? "[]")
                                                            if (json?.length > 0) {
                                                                generateCheck({
                                                                    target: {
                                                                        ...find,
                                                                        client_value: find?.client_value?.filter((res: any) => new Set(json).has(res?.id)),
                                                                    },
                                                                    iframeRef: iframeRef,
                                                                    name: user?.owner?.name,
                                                                    client_time: value?.client_time_archive,
                                                                    user: user
                                                                })
                                                            }

                                                        }}>
                                                        <FaPrint />
                                                    </button>
                                                }

                                            },

                                        ]}
                                        dataSource={
                                            data?.client_item?.map((res: any) => res.client_payment)?.flatMap((res: any) => res)
                                        }
                                    />
                                </div>
                            </TabPane>
                            <TabPane tabId="4">
                                <div className="card" style={{
                                    height: `${window.innerHeight / 1.4}px`,
                                    overflow: 'auto'
                                }}>







                                    <table className="table table-bordered " >
                                        <thead>
                                            <tr>
                                                <th>F.I.SH</th>
                                                <th>Telefon</th>
                                                <th>Yoshi</th>

                                                {
                                                    data?.treatment?.length > 0 ? findMaxGraphItem(data?.treatment)?.graph_archive_item?.map((res: any, index: number) => {
                                                        return (
                                                            <th className='p-1'>{
                                                                // +search?.index.value >= 0 ? +search?.index.value + 1 : 
                                                                (index + 1)
                                                            } - Kun</th>
                                                        )
                                                    }) : <th>
                                                        1-kun
                                                    </th>
                                                }

                                                <th>Izoh</th>
                                                <th className='d-flex justify-content-between align-items-center'>
                                                    <span>Holati</span>


                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                false ? <tr>
                                                    <td colSpan={5}>
                                                        <div className='bg-white rounded p-1 text-center d-flex  align-items-center gap-3 justify-content-center'>
                                                            <TableLoader />
                                                            <h4 className='mb-0'>Yuklanmoqda</h4>
                                                        </div>
                                                    </td>
                                                </tr>
                                                    :
                                                    data?.treatment?.length > 0 ? data?.treatment?.filter((item: any) => item.use_status == 'treatment')?.map((item: any) => {
                                                        return (
                                                            <tr>
                                                                <td className='p-1'>{fullName(item?.person)}</td>
                                                                <td className='p-1'>{item?.person?.phone}</td>
                                                                <td className='p-1'>{calculateAge(item?.person?.data_birth, user?.graph_format_date)}</td>
                                                                {
                                                                    findMaxGraphItem(data?.treatment?.filter((item: any) => item.use_status == 'treatment'))?.graph_archive_item?.map((res: any, index: number) => {
                                                                        {
                                                                            let response = item?.graph_archive_item[index]
                                                                            return response ? (
                                                                                <td className={`p-0 m-0 cursor-pointer`}
                                                                                    onClick={() => {
                                                                                        // if(+response?.is_at_home)
                                                                                        if (!response?.is_at_home && (response?.client_id == 0 || response?.client_id == null)) {

                                                                                            const {
                                                                                                phone,
                                                                                                first_name,
                                                                                                last_name,
                                                                                                sex,
                                                                                                data_birth,
                                                                                                person_id,
                                                                                                citizenship
                                                                                            } = item.person
                                                                                            let result = {
                                                                                                phone,
                                                                                                first_name,
                                                                                                last_name,
                                                                                                sex,
                                                                                                data_birth,
                                                                                                person_id,
                                                                                                citizenship,
                                                                                                id: 0,
                                                                                                department: response?.graph_item?.at(0)?.department,
                                                                                                agreement_time: response.agreement_time,
                                                                                                agreement_date: response.agreement_date,
                                                                                                graph_item_id: response.graph_item_id,
                                                                                                graph_achive_id: `${item?.id}`,
                                                                                                client_value: item?.treatment?.treatment_service_item
                                                                                                    ?.map((res: any) => {
                                                                                                        console.log(res.service);
                                                                                                        return {
                                                                                                            ...res,
                                                                                                            service_id: res.service?.id,
                                                                                                            ...res?.service,
                                                                                                            id: 0,


                                                                                                        }
                                                                                                    })
                                                                                                // client_value: graphItem.at(0)?.graph_item_value?.map((res: any) => {
                                                                                                //     console.log(res.service);
                                                                                                //     return {
                                                                                                //         ...res,
                                                                                                //         service_id: res.service?.id,
                                                                                                //         ...res?.service,
                                                                                                //         id: 0

                                                                                                //     }
                                                                                                // })
                                                                                            }

                                                                                            // setItem(() => result)
                                                                                            // setModal4(() => true)
                                                                                        }
                                                                                    }}

                                                                                >

                                                                                    <p
                                                                                        className={`p-1 mb-0 fw-bold d-flex align-items-center  gap-2  ${Date.parse(user?.graph_format_date) == Date.parse(response?.agreement_date) ? 'border-animate' : 'border-notanimate'} text-white bg-${+response?.is_at_home ? 'info' : graphAChiveStatus(response, user?.graph_format_date, user?.time)}`}
                                                                                    >
                                                                                        {
                                                                                            +response?.is_at_home ?
                                                                                                <span>
                                                                                                    <FaHome size={24} />
                                                                                                </span> : <span>
                                                                                                    <FaHospitalSymbol size={24} />
                                                                                                </span>
                                                                                        }
                                                                                        {formatDateMonthName(response?.agreement_date)}
                                                                                    </p>
                                                                                    {/* {response?.agreement_date} */}
                                                                                </td>
                                                                            ) : <td>-</td>
                                                                        }
                                                                    })
                                                                }
                                                                <td className='p-1 text_wrap'>{item?.comment ?? '-'}</td>
                                                                <td className='p-1 text_wrap'>{grapAchiveStatus(item)}</td>

                                                            </tr>
                                                        )
                                                    }) :
                                                        <tr>
                                                            <td colSpan={6} >
                                                                <div className='bg-white rounded p-1 text-center d-flex  align-items-center gap-3 justify-content-center'>
                                                                    <FaBoxOpen size={44} />
                                                                    <h4 className='mb-0'>Malumot topilmadi</h4>
                                                                </div>
                                                            </td>
                                                        </tr>
                                            }

                                        </tbody>



                                    </table>

                                </div>
                            </TabPane>
                            <TabPane tabId="5">
                                <table className="table table-bordered " >
                                    <thead>
                                        <tr>
                                            <th>F.I.SH</th>
                                            <th>Telefon</th>
                                            <th>Yoshi</th>

                                            {
                                                data?.at_home?.length > 0 ? findMaxGraphItem(data?.at_home)?.graph_archive_item?.map((res: any, index: number) => {
                                                    return (
                                                        <th className='p-1'>{
                                                            // +search?.index.value >= 0 ? +search?.index.value + 1 : 
                                                            (index + 1)
                                                        } - Kun</th>
                                                    )
                                                }) : <th>
                                                    1-kun
                                                </th>
                                            }

                                            <th>Izoh</th>
                                            <th className='d-flex justify-content-between align-items-center'>
                                                <span>Holati</span>


                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            false ? <tr>
                                                <td colSpan={5}>
                                                    <div className='bg-white rounded p-1 text-center d-flex  align-items-center gap-3 justify-content-center'>
                                                        <TableLoader />
                                                        <h4 className='mb-0'>Yuklanmoqda</h4>
                                                    </div>
                                                </td>
                                            </tr>
                                                :
                                                data?.at_home?.length > 0 ? data?.at_home?.map((item: any) => {
                                                    return (
                                                        <tr>
                                                            <td className='p-1'>{fullName(item?.person)}</td>
                                                            <td className='p-1'>{item?.person?.phone}</td>
                                                            <td className='p-1'>{calculateAge(item?.person?.data_birth, user?.graph_format_date)}</td>
                                                            {
                                                                findMaxGraphItem(data?.at_home)?.graph_archive_item?.map((res: any, index: number) => {
                                                                    {
                                                                        let response = item?.graph_archive_item[index]
                                                                        return response ? (
                                                                            <td className={`p-0 m-0 cursor-pointer`}
                                                                                onClick={() => {
                                                                                    // if (response?.client_id == 0 || response?.client_id == null) {

                                                                                    //     const {
                                                                                    //         phone,
                                                                                    //         first_name,
                                                                                    //         last_name,
                                                                                    //         sex,
                                                                                    //         data_birth,
                                                                                    //         person_id,
                                                                                    //         citizenship
                                                                                    //     } = item.person
                                                                                    //     let result = {
                                                                                    //         phone,
                                                                                    //         first_name,
                                                                                    //         last_name,
                                                                                    //         sex,
                                                                                    //         data_birth,
                                                                                    //         person_id,
                                                                                    //         citizenship,
                                                                                    //         id: 0,
                                                                                    //         department: response?.graph_item?.at(0)?.department,
                                                                                    //         agreement_time: response.agreement_time,
                                                                                    //         agreement_date: response.agreement_date,
                                                                                    //         graph_item_id: response.graph_item_id,
                                                                                    //         graph_achive_id: `${item?.id}`,
                                                                                    //         // client_value: graphItem.at(0)?.graph_item_value?.map((res: any) => {
                                                                                    //         //     console.log(res.service);
                                                                                    //         //     return {
                                                                                    //         //         ...res,
                                                                                    //         //         service_id: res.service?.id,
                                                                                    //         //         ...res?.service,
                                                                                    //         //         id: 0

                                                                                    //         //     }
                                                                                    //         // })
                                                                                    //     }

                                                                                    //     setItem(() => result)
                                                                                    //     setModal4(() => true)
                                                                                    // }
                                                                                }}

                                                                            >
                                                                                <p
                                                                                    className={`p-1 mb-0 fw-bold d-flex align-items-center gap-2    
                                                                                                                                                        
                                                                                                                                                           ${+response?.is_at_home ? 'bg-info text-white' : ` ${Date.parse(user?.graph_format_date) == Date.parse(response?.agreement_date) ? 'border-animate' : 'border-notanimate'} text-white bg-${+response?.is_assigned ? Date.parse(user?.graph_format_date) >= Date.parse(response?.agreement_date) ? 'success' : 'warning' : 'danger'

                                                                                            }  `} 
                                                                                                                                                          `


                                                                                    }

                                                                                >

                                                                                    {
                                                                                        +response?.is_at_home ?
                                                                                            <span>
                                                                                                <FaHospitalSymbol size={24} />
                                                                                            </span> : <span>
                                                                                                <FaHome size={24} />
                                                                                            </span>
                                                                                    }
                                                                                    {formatDateMonthName(response?.agreement_date)}
                                                                                </p>
                                                                                {/* {response?.agreement_date} */}
                                                                            </td>
                                                                        ) : <td>-</td>
                                                                    }
                                                                })
                                                            }
                                                            <td className='p-1 text_wrap'>{item?.comment ?? '-'}</td>
                                                            <td className='p-1 text_wrap'>{grapAchiveStatus(item)}</td>

                                                        </tr>
                                                    )
                                                }) :
                                                    <tr>
                                                        <td colSpan={6} >
                                                            <div className='bg-white rounded p-1 text-center d-flex  align-items-center gap-3 justify-content-center'>
                                                                <FaBoxOpen size={44} />
                                                                <h4 className='mb-0'>Malumot topilmadi</h4>
                                                            </div>
                                                        </td>
                                                    </tr>
                                        }

                                    </tbody>



                                </table>
                            </TabPane>
                        </TabContent>


                    </div>
                    <div className="modal-footer">
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
                        {
                            parentActiveTab == 1 &&
                            <button type="submit" className="btn btn-primary" >Saqlash</button>
                        }
                        {/* <button type="button" className="btn btn-primary"
                            onClick={() => {
                                if (parentActiveTab == 1) {
                                    setActiveTab('2')
                                } else {
                                    setActiveTab('1')
                                }
                            }}
                        >
                            {
                                parentActiveTab == 1 ? <>
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
            {
                modal ? <RegGraphAdd
                    modal={modal2} setModal={setModal2}
                    setData={setItem} data={item} /> : ''
            }

            {/* <ReClientAdd
                modal={modal3} setModal={setModal3}
                setData={setItem} data={item} /> */}
            {
                modal ? <iframe ref={iframeRef} style={{ display: 'none' }} title="print-frame" /> : ''
            }
        </>
    )
}

export default ClientAllSetting