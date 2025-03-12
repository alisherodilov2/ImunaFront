import React, { useEffect, useRef, useState } from 'react'
// import Layout from '../layouts/Layout'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Toast, ToastHeader, ToastBody, TabPane, TabContent, NavItem, Nav, NavLink, PopoverBody, PopoverHeader, Popover, Spinner } from 'reactstrap'
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
import { json } from 'react-router-dom';
import { AppDispatch } from '../../../service/store/store';
import { isClientAdd, isClientDefaultApi, isClientEdit } from '../../../service/reducer/ClientReducer';
import DepartmentAdd from '../../director/services/department/DepartmentAdd';
import Table from '../../../componets/table/Table';
import { nanoid } from '@reduxjs/toolkit';
import { FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import { isGrapItemDelete } from '../../../service/reducer/GraphReducer';
import GraphAdd from '../graph/GraphAdd';
import RegGraphAdd from '../graph/RegGraphAdd';
import { fullName, masulRegUchunFullName } from '../../../helper/fullName';
import { phoneFormatNumber } from '../../../helper/graphHelper';
import { toast } from 'react-toastify';
// import { isAddClient, isEditClient } from '../../client/reducer/ClientReducer';
const ReClientAdd = ({ data, modal, setModal, setData = function () { }, resetItem = false, setExtraModalClose = function () { }, }: { setData?: any, data?: any, modal?: boolean; setModal?: any, resetItem?: boolean, setExtraModalClose?: Function }) => {
    const { serviceData, } = useSelector((state: ReducerType) => state.ServiceReducer)
    const { user, } = useSelector((state: ReducerType) => state.ProfileReducer)
    const { departmentData, } = useSelector((state: ReducerType) => state.DepartmentReducer)
    const { clientData } = useSelector((state: ReducerType) => state.ClientReducer)

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
            // citizenship: yup.string().required("Fuqoroligi kiriting!"),
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
        resolver: yupResolver(schema),
        defaultValues: {
            ...data
        }

    });
    const [clinetValue, setClientValue] = useState([] as any)
    const [activeTab, setActiveTab] = useState('1' as any);
    const [enter, setEnter] = useState(false);
    const [complateLoading, setComplateLoading] = useState(false)
    const handleConfirmation = (confirm: any, toastId: any) => {
        if (confirm) {
            let find = JSON.parse(toastId);
            console.log(find);
            console.log('toastId', toastId);
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
    const [autocomplateText, setAutocomplateText] = useState('' as any)
    const autocomplate = async (target: string) => {
        try {
            setComplateLoading(true)
            let res = await axios.get(`/client/autocomplate${target}`)
            const { result } = res.data
            console.log('autocomplate', result);
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
                                    <button type='button' className='btn btn-sm btn-success' onClick={() => handleConfirmation(true, toastId)}>Ha</button>
                                    <button type='button' className='btn btn-sm btn-danger' onClick={() => handleConfirmation(false, toastId)}>Yo'q</button>
                                </div>
                            ),
                        }
                    );
                }
            }

        } catch (error) {

        }
        finally {
            setComplateLoading(false)
        }
    }
    const { referringDoctorData, } = useSelector((state: ReducerType) => state.ReferringDoctorReducer)
    const{ advertisementsData } = useSelector((state: ReducerType) => state.AdvertisementsReducer)

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
                    department_id: item?.department_id,
                    price: item?.price,
                    id: item?.id,
                }
            })
            console.log('resdata', resdata);


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
    };
    // const [item, setItem] = useState({} as any)
    const send = (e: any) => {
        if (clinetValue?.length == 0) {
            alert("Xizmatlarni tanlang!")
        } else {
           

            dispatch(isClientAdd({
                query: queryObj({
                    ...data, ...e,
                    parent_id: null,
                    referring_doctor_id: `${e.referring_doctor_id ?? 0}`,
                    advertisements_id: `${e.advertisements_id ?? 0}`,
                    graph_item_id: `${+e?.graph_item_id > 0 ? e?.graph_item_id : 0}`,
                    id: `${+data?.id > 0 ? data?.id : 0}`,
                    edit_parent_id: `${+data?.parent_id > 0 ? data?.parent_id : 0}`,
                    autocomplate_id: `${+data?.parent_id > 0 ? data?.parent_id : 0}`,
                    client_value: JSON.stringify(
                        clinetValue?.map((res: any) => {
                            return {
                                id: res?.id ?? 0,
                                service_id: res?.service_id,
                                price: res.price,
                                department_id: res?.department_id,
                                qty: res.qty ?? 1,
                                is_probirka: res?.department?.probirka
                            }
                        })

                    )
                })
            }))
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
    return (
        <>
            <Loader loading={sendLoading} />
            <Modal centered={true} isOpen={modal} toggle={toggle} role='dialog' size='xl' backdrop="static" keyboard={false} fullscreen>
                <form onSubmit={handleSubmit(send)} className="size_16">

                    <div className="modal-header">
                        <h5 className="modal-title" id="modalCenterTitle">{data?.id?.length > 0 ? 'Bo`lim ' : "Bo`lim qo'shish"}</h5>
                        <button onClick={toggle} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body overflow-none">
                        <div className="row">
                            <div className="col-6">
                                <div className='row' >

                                    <div className="col-6 mb-1">
                                        <label className="form-label">Familiyasi</label>
                                        <Input type="text" placeholder="Familiyasi"  {...register('first_name')} name='first_name'
                                            error={errors.first_name?.message?.toString() || hasError?.errors?.first_name?.toString()}
                                        />
                                    </div>
                                    <div className="col-6 mb-1">
                                        <label className="form-label">Ismi</label>
                                        <Input type="text" placeholder="Ismi"  {...register('last_name')} name='last_name'
                                            error={errors.last_name?.message?.toString() || hasError?.errors?.last_name?.toString()}
                                        />
                                    </div>
                                    <div className="col-6 mb-1">
                                        <label className="form-label">Tug'ilgan sanasi</label>
                                        <Input type="date" placeholder="Ismi"  {...register('data_birth')} name='data_birth'
                                            onChange={(e: any) => {
                                                let value = e.target.value
                                                setValue('data_birth', value, {
                                                    shouldValidate: true
                                                })
                                                if (value.length > 0 && getValues('phone')?.length == 9) {
                                                    let target = `?data_birth=${value}&phone=${getValues('phone')}`
                                                    if (autocomplateText !== target) {
                                                        setAutocomplateText(target)
                                                        autocomplate(target)
                                                    }


                                                }
                                                else {
                                                    setAutocomplateText('')
                                                }
                                            }}
                                            error={errors.data_birth?.message?.toString() || hasError?.errors?.data_birth?.toString()}
                                        />
                                    </div>
                                    <div className="col-6 mb-1">
                                        <label className="form-label">Telefon raqami</label>
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
                                                    console.log(value);

                                                    setValue('phone', value, {
                                                        shouldValidate: true,
                                                    });
                                                    if (value.length == 9) {
                                                        let target = `?phone=${value}&data_birth=${getValues('data_birth')}`
                                                        if (autocomplateText !== target) {
                                                            setAutocomplateText(target)
                                                            autocomplate(target)
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

                                    </div>
                                    <div className="col-6 mb-1">
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
                                    {/* <div className="col-12 mb-1">
                                        <label className="form-label">Manzil</label>
                                        <Input type="text" placeholder="Familiyasi"  {...register('address')} name='address'
                                        />
                                    </div> */}
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
                                    <div className="col-6 mb-1">
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
                                                            ...referringDoctorDataSelect(referringDoctorData)
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
                                            {errors.referring_doctor_id?.message?.toString() || hasError?.errors?.department_id?.toString()}
                                        </ErrorInput>
                                    </div>

                                    <div className="col-6 mb-1">
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
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="col-12 mb-1">
                                    <label className="form-label">Bo'lim nomi</label>
                                    <input type="hidden" {...register('department_id')} name='department_id' />
                                    <div className="d-flex">
                                        <div className="w-100">

                                            <Select
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
                                <div className="col-12 mb-1">
                                    <label className="form-label">Xizmatlar</label>
                                    <div className="d-flex">
                                        <div className="w-100">
                                            <Select
                                                name='name3'
                                                value={selectData?.service_id}
                                                isMulti
                                                onChange={(e: any) => {
                                                    // console.log('select');
                                                    let result = e
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
                                                                    is_active: item?.is_active ?? 0,
                                                                    service_id: item?.service_id,
                                                                    department_id: item?.department_id,

                                                                    id: item?.id,
                                                                    price: item?.price
                                                                }
                                                            })
                                                            console.log('resdata', resdata);
                                                            setClientValue(() => resdata)
                                                        }

                                                        else {
                                                            console.log(e);

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
                                                                        pay_price: item?.pay_price ?? 0,
                                                                        is_active: item?.is_active ?? 0,
                                                                        service_id: item?.service_id,
                                                                        department_id: item?.department_id,
                                                                        id: item?.id,
                                                                        price: item?.price
                                                                    }
                                                                }),
                                                                ...result
                                                                    .map((item: any) => {
                                                                        return {
                                                                            ...item?.data,
                                                                            pay_price: item?.pay_price ?? 0,
                                                                            is_active: item?.is_active ?? 0,
                                                                            id: nanoid(),
                                                                            service_id: item?.value,
                                                                            department_id: item?.data?.department?.id,
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
                                                                        pay_price: item?.pay_price ?? 0,
                                                                        id: nanoid(),
                                                                        is_active: item?.is_active ?? 0,
                                                                        service_id: item?.value,
                                                                        department_id: item?.data?.department?.id,
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
                                                            ?.filter((item: any) => {
                                                                return +data?.id > 0 ? (data?.client_value?.find((res: any) => res?.service.id == item?.id) ? false : true) : true
                                                            })
                                                            .filter((item: any) => selectData?.department_id?.value > 0 ? item.department.id == selectData?.department_id?.value : true))]
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
                                <div style={{
                                    maxHeight: `${window.innerHeight / 2.2}px`,
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
                                        localDelete={true}
                                        localFunction={true}
                                        // extraButton={(item: any) => {
                                        //     return <div className='d-flex gap-1'>
                                        //         <div className="btn-group" role="group" aria-label="Basic example">
                                        //             <button type="button" className="btn btn-danger btn-sm"
                                        //                 onClick={() => {
                                        //                     setClientValue(() => {
                                        //                         return clinetValue?.map((res: any) => {
                                        //                             if (res?.id == item?.id) {
                                        //                                 return {
                                        //                                     ...res,
                                        //                                     qty: res?.qty > 1 ? res?.qty - 1 : 1
                                        //                                 }
                                        //                             }
                                        //                             return res
                                        //                         })
                                        //                     })
                                        //                 }}

                                        //             >-</button>
                                        //             <button type="button" className="btn  btn-sm">{
                                        //                 item?.qty ?? 1
                                        //             }</button>
                                        //             <button type="button"
                                        //                 //  disabled={item?.status == 'old' ? true : false}
                                        //                 className="btn btn-success btn-sm"
                                        //                 onClick={() => {
                                        //                     setClientValue(() => {
                                        //                         return clinetValue?.map((res: any) => {
                                        //                             if (res?.id == item?.id) {
                                        //                                 return {
                                        //                                     ...res,
                                        //                                     qty: (res?.qty ?? 1) + 1
                                        //                                 }
                                        //                             }
                                        //                             return res
                                        //                         })
                                        //                     })

                                        //                 }}


                                        //             >+</button>
                                        //         </div>
                                        //         <button className=" btn btn-sm btn-danger"
                                        //             type='button'
                                        //             disabled={data?.id > 0 ? (data?.client_value?.find((res: any) => res?.service_id == item?.service_id) ? true : false) : false}
                                        //             onClick={() => {
                                        //                 console.log(item);

                                        //                 Swal.fire({
                                        //                     title: "Ma'lumotni o'chirasizmi?",
                                        //                     showDenyButton: true,
                                        //                     showCancelButton: true,
                                        //                     confirmButtonText: 'Ha',
                                        //                     denyButtonText: `Yo'q`,
                                        //                 }).then((result: any) => {
                                        //                     if (result.isConfirmed) {
                                        //                         setClientValue(() => clinetValue?.filter((res: any) => res.id != item.id))

                                        //                         setSelectData({
                                        //                             ...selectData,
                                        //                             service_id: selectData.service_id.filter((res: any) => res.value != item.id)
                                        //                         })
                                        //                         Swal.fire({
                                        //                             position: 'top-end',
                                        //                             icon: 'success',
                                        //                             title: "Malumot o'chirildi",
                                        //                             showConfirmButton: false,
                                        //                             timer: 2500
                                        //                         })
                                        //                     }
                                        //                 })
                                        //             }}

                                        //         >
                                        //             <MdDeleteForever />
                                        //         </button>
                                        //     </div>
                                        // }}
                                        // extraButtonRole={true}
                                        // deleteLocalFunction={
                                        //     (id: any, item: any) => {
                                        //         setClientValue(() => clinetValue?.filter((res: any) => res.id != id))

                                        //         setSelectData({
                                        //             ...selectData,
                                        //             service_id: selectData.service_id.filter((res: any) => res.value != id)
                                        //         })

                                        //     }
                                        // }
                                        // deleteRole={true}
                                        extraKeys={["department_",
                                            //  "servicetype_",
                                            'count_',
                                            "price_",
                                            "who_",
                                        ]}
                                        columns={[
                                            {
                                                title: '№',
                                                key: 'id',
                                                renderItem: (value: any, target: any) => {
                                                    return <td key={target.index} className={` p-1  ${+data?.id ? (+data?.is_pay ? (+target?.is_active ? (target?.qty * target?.price - target?.pay_price == 0 ? 'bg-success text-white' : 'bg-warning text-white') : (target?.status == 'old' ? 'bg-danger text-white' : 'bg-warning text-white')) : (target?.status == 'old' ? 'bg-warning text-white' : 'bg-warning text-white')) : ''}  h-100 `}>
                                                        <span>
                                                            {target.index + 1}

                                                        </span>
                                                    </td>

                                                },
                                            },
                                            {
                                                title: "Xizmat ",
                                                key: 'department_',
                                                render: (value: any, data: any) => {

                                                    return <button className='btn btn-sm'

                                                    >
                                                        {value?.name}
                                                    </button>
                                                }
                                            },
                                            {
                                                title: "Xizmat ",
                                                key: 'count_',
                                                render: (item: any) => {

                                                    return <div className='d-flex gap-1'>
                                                        <div className="btn-group" role="group" aria-label="Basic example">
                                                            <button type="button" className="btn btn-danger btn-sm"
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
                                                            <button type="button" className="btn  btn-sm">{
                                                                item?.qty ?? 1
                                                            }</button>
                                                            <button type="button"
                                                                //  disabled={item?.status == 'old' ? true : false}
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
                                                        <button className=" btn btn-sm btn-danger"
                                                            type='button'
                                                            disabled={data?.id > 0 ? (data?.client_value?.find((res: any) => res?.service_id == item?.service_id) ? true : false) : false}
                                                            onClick={() => {
                                                                console.log(item);

                                                                Swal.fire({
                                                                    title: "Ma'lumotni o'chirasizmi?",
                                                                    showDenyButton: true,
                                                                    showCancelButton: true,
                                                                    confirmButtonText: 'Ha',
                                                                    denyButtonText: `Yo'q`,
                                                                }).then((result: any) => {
                                                                    if (result.isConfirmed) {
                                                                        setClientValue(() => clinetValue?.filter((res: any) => res.id != item.id))

                                                                        setSelectData({
                                                                            ...selectData,
                                                                            service_id: selectData.service_id.filter((res: any) => res.value != item.id)
                                                                        })
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
                                                    </div>
                                                }
                                            },
                                            // {
                                            //     title: 'Xizmat turi',
                                            //     key: 'servicetype_',
                                            //     render: (value: any, data: any) => {
                                            //         return value?.servicetype?.type
                                            //     }
                                            // },

                                            {
                                                title: 'Narxi',
                                                key: 'price_',
                                                render: (value: any, data: any) => {
                                                    return <NumericFormat displayType="text"
                                                        thousandSeparator
                                                        decimalScale={2}
                                                        value={value?.price ?? 0} />
                                                }
                                            },
                                            {
                                                title: 'Kim tomonidan',
                                                key: 'who_',
                                                render: (value: any, data: any) => {
                                                    return `Qabulxona: ${masulRegUchunFullName(user)}`
                                                }
                                            },
                                        ]}
                                        dataSource={
                                            clinetValue
                                        }
                                    />
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
                        </Nav> */}



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
                        <button type="submit" className="btn btn-primary" >Qo'shish</button>
                        <button type="button" className="btn btn-primary"
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



                        </button>

                        <button type="button" className="btn btn-danger" onClick={toggle}>Ortga</button>
                    </div>
                </form>

            </Modal >
            {/* <RegGraphAdd
                modal={modal3} setModal={setModal3}
                setData={setItem} data={item} /> */}


        </>
    )
}

export default ReClientAdd