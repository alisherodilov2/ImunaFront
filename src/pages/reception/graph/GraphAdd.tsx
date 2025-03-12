import React, { useEffect, useRef, useState } from 'react'
// import Layout from '../layouts/Layout'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Toast, ToastHeader, ToastBody, TabPane, TabContent, NavItem, Nav, NavLink, PopoverBody, PopoverHeader, Popover, Spinner } from 'reactstrap'
import classnames from 'classnames';
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from 'react-redux';
import { query } from '../../../componets/api/Query';
import { ReducerType } from '../../../interface/interface';
import Loader from '../../../componets/api/Loader';
import Input from '../../../componets/inputs/Input';
import { NumericFormat, PatternFormat } from 'react-number-format';
import ErrorInput from '../../../componets/inputs/ErrorInput';
import Select from 'react-select';
import axios from 'axios';
import { MdDeleteForever, MdToday } from 'react-icons/md';
import Swal from 'sweetalert2';
import { json } from 'react-router-dom';
import { AppDispatch } from '../../../service/store/store';
import { isGraphAdd, isGraphDefaultApi, isGraphEdit, isGrapItemDelete } from '../../../service/reducer/GraphReducer';
import DepartmentAdd from '../../director/services/department/DepartmentAdd';
import Table from '../../../componets/table/Table';
import { nanoid } from '@reduxjs/toolkit';
import { FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import ClientAdd from '../register/ClientAdd';
import { phoneFormatNumber } from '../../../helper/graphHelper';
import { fullName } from '../../../helper/fullName';
import { toast, ToastContainer } from 'react-toastify';
// import { isAddGraph, isEditGraph } from '../../graph/reducer/GraphReducer';


const GraphAdd = ({ data, modal, setModal, setData = function () { }, resetItem = false }: { setData?: any, data?: any, modal?: boolean; setModal?: any, resetItem?: boolean }) => {
    const { serviceData, } = useSelector((state: ReducerType) => state.ServiceReducer)
    const { user, } = useSelector((state: ReducerType) => state.ProfileReducer)
    const { departmentData, } = useSelector((state: ReducerType) => state.DepartmentReducer)
    const { graphData } = useSelector((state: ReducerType) => state.GraphReducer)

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
    const [loading, setLoading] = useState(false)
    const graphItemDelete = async (data: any) => {
        try {
            setLoading(() => true)
            let res = await axios.post('/graph/item-delete', data)
            const { result } = res.data
            console.log(result);

            dispatch(isGrapItemDelete(+result?.id))
            setGraphItem(() => graphItem?.filter((res: any) => res?.id !== +result?.id))
            setModal(false)
        } catch (error) {
        } finally {
            setLoading(() => false)
        }
    }
    const workingDateCheck = async (data: any, i: any) => {
        try {
            setLoading(() => true)

            let res = await axios.get(`/graph/working-date-check?date=${data}&department_id=${graphData?.department?.value}`)
            const { result } = res.data
            console.log(result);
            if (!result?.is_working) {
                alert('ish kuni emas')
            } else
                if (result?.data?.length > 0) {
                    setGraphItem(graphItem?.map((_: any, index: number) => {
                        if (index === i) {
                            return {
                                ..._,
                                agreement_time: '',
                                agreement_date: data,
                                agreement_time_data: result?.data
                                    ?.filter((filterItem: any) => !graphItem?.map((kk: any) => kk.agreement_time?.value).includes(filterItem)
                                    )
                                    ?.map((item: any) => {
                                        return {
                                            label: item,
                                            value: item,
                                        }
                                    })
                            }
                        }
                        return _
                    }))
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
    const { findData } = useSelector((state: ReducerType) => state.MenuReducer)
    const { isLoading, sendLoading, isSuccessApi, hasError } = useSelector((state: ReducerType) => state.GraphReducer)
    const dispatch = useDispatch<AppDispatch>()
    const schema = yup
        .object()
        .shape({
            first_name: yup.string().required("Familiyasi kiriting!"),
            // last_name: yup.string().required("Ismi kiriting!"),
            // phone: yup.string().required("Telefon raqami kiriting!"),
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
    const [graphItem, setGraphItem] = useState<any>([
        {
            agreement_date: '',
            agreement_time: '',
            graph_item_value: []
        }
    ])
    const [item, setItem] = useState<any>({})
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
    const [clinetValue, setGraphValue] = useState([] as any)
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
                if (key != 'department_id') {
                    resetObj = {
                        ...resetObj, [key]: ''
                    }
                }
            }
            setGraphValue(() => [])
            setGraphItem(() => [{
                agreement_date: '',
                agreement_time: '',
                graph_item_value: []
            }])

            setSelectData(() => {
                return false
            })
            reset(
                resetObj
            )
            if (data?.department_id > 0 && data?.graphtype_id > 0) {
                // let department_id = departmentData?.find((item: any) => item?.id == data?.department_id);
                // let graphtype_id = graphData?.find((item: any) => item?.id == data?.graphtype_id);
                // setSelectData(() => {
                //     return {
                //         department_id: {
                //             value: department_id?.id,
                //             label: department_id?.name
                //         },
                //         graphtype_id: {
                //             value: graphtype_id?.id,
                //             label: graphtype_id?.type
                //         },
                //     }
                // })
                setValue('department_id', data?.department_id.id, {
                    shouldValidate: true,
                });
                setValue('graphtype_id', data?.graphtype_id.id, {
                    shouldValidate: true,
                });
            }

        }
        console.log(data);

        if (data?.graph_item?.length > 0) {
            // console.log('data?.graph_item0', );

            let resdata = data?.graph_item?.map((res: any) => {
                return {

                    ...res,
                    agreement_time: {
                        value: res?.agreement_time,
                        label: res?.agreement_time
                    },
                    status: 'old',
                    department_id: res?.department_id,
                    service: res?.graph_item_value?.map((item: any) => {
                        return {
                            ...item,
                            label: item?.service.name,
                            value: item?.service.id,
                            service: {
                                label: item?.service.name,
                                value: item?.service.id,
                            },
                        }
                    })
                }
            })
            console.log('resdata0', resdata);

            setGraphItem(() => resdata)
            setSelectData(() => {
                return {
                    ...selectData,
                    service_id: dataSelect(resdata)
                }
            })
        }
        if (Object.keys(data ?? {})?.length > 0) {
            // let department_id = departmentData?.find((item: any) => item?.id == data?.department.id);
            // let graphtype_id = graphData?.find((item: any) => item?.id == data?.graphtype.id);
            // setValue('department_id', data?.department.id, {
            //     shouldValidate: true,
            // });
            // setValue('graphtype_id', data?.graphtype.id, {
            //     shouldValidate: true,
            // });
            // setSelectData(() => {
            //     return {
            //         department_id: {
            //             value: department_id?.id,
            //             label: department_id?.name
            //         },
            //         graphtype_id: {
            //             value: graphtype_id?.id,
            //             label: graphtype_id?.type
            //         },
            //     }
            // })
            for (let key in data) {
                setValue(key, data?.[key as string], {
                    shouldValidate: true,
                });

                // extraFuntion(data?.[key], key)
            }
            // setGraphValue(() => data?.graph_value)


        } else {

        }
        if (isSuccessApi) {
            setData(() => { })
            setModal(enter)

            dispatch(isGraphDefaultApi())
            let s = getValues(), resetObj = {};
            for (let key in getValues()) {
                resetObj = {
                    ...resetObj, [key]: ''
                }
            }
            setGraphValue(() => [])
            setSelectData(() => {
                return false
            })
            reset(
                resetObj
            )
        }
    }, [modal, data])

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
        setGraphValue(() => [])

        setSelectData(() => {
            return false
        })
        reset(
            resetObj
        )
        setActiveTab('1')
    };
    const send = (e: any) => {
        // if (id?.toString()?.length ?? 0 > 0) {
        //   dispatch(isProductEdit({ query: query({ ...data, product_value: JSON.stringify(product_values) }, ['photo']), file: file, id: id }))
        // } else {
        //   dispatch(isProductAdd({ query: query({ ...data, product_value: JSON.stringify(product_values) }, ['photo']), file: file }))
        // }
        if (data?.id?.toString()?.length ?? 0 > 0) {
            dispatch(isGraphEdit({
                query: query({
                    ...data, ...e,
                    person_id: `${e?.person_id ? e?.person_id : 0}`,
                    department_id: `${graphData?.department?.value}`,
                    graph_item: JSON.stringify(graphItem?.map((res: any) => {
                        return {
                            department_id: graphData?.department?.value,
                            agreement_date: res?.agreement_date,

                            agreement_time: res?.agreement_time?.value,
                            id: res?.id,
                            // graph_item_value: res?.service?.map((graph_item_value_item: any) => {
                            //     return {
                            //         service_id: graph_item_value_item?.value,
                            //     }
                            // })
                        }
                    }))
                }), id: data?.id
            }))
            /////// dispatch(isCostEdit(data)) 
        } else {
            dispatch(isGraphAdd({
                query: query({
                    ...data, ...e,
                    person_id: `${e?.person_id ? e?.person_id : 0}`,
                    department_id: `${graphData?.department?.value}`,
                    graph_item: JSON.stringify(graphItem?.map((res: any) => {
                        return {
                            department_id: graphData?.department?.value,
                            agreement_date: res?.agreement_date,
                            agreement_time: res?.agreement_time?.value,
                            // graph_item_value: res?.service?.map((graph_item_value_item: any) => {
                            //     return {
                            //         service_id: graph_item_value_item?.value,
                            //     }
                            // })
                        }
                    }))
                })
            }))
        }
    }

    const cardRef = useRef<HTMLDivElement>(null);
    const scrollToBottom = () => {
        if (cardRef.current) {
            // Scroll to the bottom of the card
            // cardRef.current.scrollTo({
            //     top: cardRef.current.scrollHeight - cardRef.current.graphHeight,
            //     behavior: 'smooth', // Enables smooth scrolling
            // });
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
            <Modal centered={true} isOpen={modal} toggle={toggle} role='dialog' size='xl' backdrop="static" keyboard={false}>
                <form onSubmit={handleSubmit(send)} className="size_16">

                    <div className="modal-header">
                        <h5 className="modal-title" id="modalCenterTitle">Muolajaga yo'naltirish</h5>
                        <button onClick={toggle} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body">
                        <div className="row">

                            <div className="col-4 mb-1">
                                <label className="form-label">F.I.O</label>
                                <Input type="text" placeholder="F.I.O"  {...register('first_name')} name='first_name'
                                    error={errors.first_name?.message?.toString() || hasError?.errors?.first_name?.toString()}
                                />
                            </div>
                            {/* <div className="col-4 mb-1">
                                <label className="form-label">Ismi</label>
                                <Input type="text" placeholder="Ismi"  {...register('last_name')} name='last_name'
                                    error={errors.last_name?.message?.toString() || hasError?.errors?.last_name?.toString()}
                                />
                            </div> */}
                            {/* <div className="col-4 mb-1">
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
                            </div> */}
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
                                        // disabled={getValues('data_birth')?.length > 0 ? false : true}
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
                                            // if (value.length == 9) {
                                            //     let target = `?phone=${value}&data_birth=${getValues('data_birth')}`
                                            //     if (autocomplateText !== target) {
                                            //         setAutocomplateText(target)
                                            //         autocomplate(target)
                                            //     }


                                            // }
                                            // else {
                                            //     setAutocomplateText('')
                                            // }
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

                            {/* <div className="col-4 mb-1">
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
                            <div className="col-4 mb-1">
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
                        {/* <div className="col-6 mb-1">

                            <label className="form-label">bolim</label>
                            <div className="d-flex">
                                <div className="w-100">
                                    <Select
                                        name='name3'
                                        required
                                        value={selectData?.department}
                                        onChange={(e: any) => {
                                            setSelectData({
                                                ...selectData,
                                                department: e
                                            })
                                            setValue('department_id', e.value, {
                                                shouldValidate: true,
                                            });

                                            // setGraphItem(graphItem?.map((_: any, index: number) => {
                                            //     if (index === i) {
                                            //         return {
                                            //             ..._,
                                            //             department: e,
                                            //             agreement_time: '',
                                            //             agreement_date: '',
                                            //         }
                                            //     }
                                            //     return _
                                            // }))
                                        }}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        // value={userBranch}
                                        options={
                                            [

                                                ...dataSelect(departmentData)
                                            ]
                                        } />
                                </div>

                            </div>
                            <ErrorInput>
                                {errors.department_id?.message?.toString() || hasError?.errors?.department_id?.toString()}
                            </ErrorInput>


                        </div> */}
                        {/* <button className='btn btn-primary btn-sm' onClick={() => {
                            setGraphItem([...graphItem, {
                                room_type: '',
                                room_number: '',
                            }])
                            setTimeout(() => {
                                scrollToBottom();
                            }, 100);
                        }} type='button' >Muolaja qo'shish</button> */}
                        <div
                            ref={cardRef}
                            style={{
                                // maxHeight: `${window.innerHeight / 2.2}px`,
                                // overflowY: 'auto',
                                // overflowX: 'hidden',
                                padding: '0.5rem 0.5rem 0.5rem 0.5rem',
                                border: '1px solid #dee2e6',
                                marginTop: '0.5rem',
                                display: graphItem?.length > 0 ? 'block' : 'none'
                            }}>
                            <div className="d-flex gap-2 align-items-center flex-wrap">
                                {
                                    graphItem?.map((item: any, i: number) => {
                                        return (
                                            <div className=" my-2" key={i}>
                                                {/* <button className="d-absolute btn btn-sm btn-danger"
                                                type='button'
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
                                                            if (item?.status == 'old') {
                                                                graphItemDelete({
                                                                    graph_item_id: item.id
                                                                })
                                                            }
                                                            setGraphItem(graphItem?.filter((_: any, index: number) => index !== i))
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
                                            </button> */}
                                                {/* <div className="col-4">
                                                <label className="form-label">bolim</label>
                                                <div className="d-flex">
                                                    <div className="w-100">
                                                        <Select
                                                            name='name3'
                                                            required
                                                            value={item?.department}
                                                            onChange={(e: any) => {



                                                                setGraphItem(graphItem?.map((_: any, index: number) => {
                                                                    if (index === i) {
                                                                        return {
                                                                            ..._,
                                                                            department: e,
                                                                            agreement_time: '',
                                                                            agreement_date: '',
                                                                        }
                                                                    }
                                                                    return _
                                                                }))
                                                            }}
                                                            className="basic-multi-select"
                                                            classNamePrefix="select"
                                                            // value={userBranch}
                                                            options={
                                                                [

                                                                    ...dataSelect(departmentData)
                                                                ]
                                                            } />
                                                    </div>

                                                </div>
                                            </div> */}

                                                <label className="form-label">{i + 1} - Kun</label>
                                                <div className="input-group">
                                                    <Input type="date" value={item.agreement_date}
                                                        min={user?.graph_format_date}
                                                        // readOnly={+item?.department?.value > 0 ? false : true}
                                                        placeholder="Xona nomeri" required={true} onChange={(e: any) => {
                                                            setGraphItem(graphItem?.map((_: any, index: number) => {
                                                                if (index === i) {
                                                                    return {
                                                                        ..._,
                                                                        agreement_date: e.target.value,
                                                                        agreement_time: '',
                                                                        agreement_time_data: []

                                                                    }
                                                                }
                                                                return _
                                                            }))
                                                        }}
                                                    />
                                                    {
                                                        +graphData?.department?.data?.is_graph_time ?
                                                            <>
                                                                <button className='btn btn-info btn-sm'
                                                                    type='button'
                                                                    onClick={() => {
                                                                        if (item.agreement_date?.length > 0) {
                                                                            workingDateCheck(item?.agreement_date, i)
                                                                        } else {
                                                                            workingDateCheck(user?.graph_format_date, i)
                                                                        }
                                                                    }}

                                                                >
                                                                    <MdToday />
                                                                </button>
                                                                <Select
                                                                    name='name3'
                                                                    isDisabled={item.agreement_date?.length > 0 && (item?.agreement_time?.length == 0 || item?.agreement_time?.value == '') ? false : true}
                                                                    value={item?.agreement_time}
                                                                    onChange={(e: any) => {

                                                                        setGraphItem(graphItem?.map((_: any, index: number) => {
                                                                            if (index === i) {
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
                                                            </> : ''
                                                    }

                                                    <button
                                                        // disabled={graphItem?.length==1 && graphItem[0]?.agreement_date?.length==0 ? true : false}
                                                        className="btn btn-sm btn-danger"
                                                        type='button'
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
                                                                    if (item?.status == 'old') {
                                                                        graphItemDelete({
                                                                            graph_item_id: item.id
                                                                        })
                                                                    }
                                                                    let deletedata = graphItem?.filter((_: any, index: number) => index !== i);
                                                                    if (deletedata?.length > 0) {
                                                                        setGraphItem(deletedata)
                                                                    }
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
                                                    {
                                                        i == graphItem?.length - 1 ? <button className='btn btn-primary ' onClick={() => {
                                                            setGraphItem([...graphItem, {
                                                                room_type: '',
                                                                room_number: '',
                                                            }])
                                                            setTimeout(() => {
                                                                scrollToBottom();
                                                            }, 100);
                                                        }} type='button' >+</button> : ''
                                                    }
                                                </div>
                                                {/* <div className="col-2">
                                                <label className="form-label">Kelishuv vaqti</label>
                                                <Select
                                                    name='name3'
                                                    isDisabled={item.agreement_date?.length > 0 && (item?.agreement_time?.length == 0 || item?.agreement_time?.value == '') ? false : true}
                                                    value={item?.agreement_time}
                                                    onChange={(e: any) => {
                                                     
                                                        setGraphItem(graphItem?.map((_: any, index: number) => {
                                                            if (index === i) {
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
                                                    options={
                                                        item?.agreement_time_data
                                                    } />
                                              
                                            </div>
                                            <div className="col-4">
                                                <label className="form-label">Xizmatlar</label>

                                                <div className="d-flex">
                                                    <div className="w-100">
                                                        <Select
                                                            name='name3'
                                                            required
                                                            value={item?.service}
                                                            isMulti
                                                            onChange={(e: any) => {
                                                                setSelectData({
                                                                    ...selectData,
                                                                    service: e,
                                                                })

                                                                setGraphValue(() => [
                                                                    ...e?.map((item: any) => item.data)
                                                                ])
                                                                setGraphItem(graphItem?.map((_: any, index: number) => {
                                                                    if (index === i) {
                                                                        return {
                                                                            ..._,
                                                                            service: e
                                                                        }
                                                                    }
                                                                    return _
                                                                }))
                                                            }}
                                                            className="basic-multi-select"
                                                            classNamePrefix="select"
                                                            options={
                                                                [

                                                                    ...dataSelect(serviceData.filter((item_: any) => item_.department.id == item?.department?.value))]
                                                            } />
                                                    </div>
                                                </div>
                                            </div> */}


                                            </div>
                                        )
                                    })
                                }
                                {/* <div>
                                   
                                </div> */}
                            </div>
                            {/* {
                                graphItem?.map((item: any, i: number) => {
                                    return (
                                        <div className="row d-relative my-2" key={i}>
                                            <button className="d-absolute btn btn-sm btn-danger"
                                                type='button'
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
                                                            if (item?.status == 'old') {
                                                                graphItemDelete({
                                                                    graph_item_id: item.id
                                                                })
                                                            }
                                                            setGraphItem(graphItem?.filter((_: any, index: number) => index !== i))
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
                                            <div className="col-2">
                                                <label className="form-label">Kelishuv sanasi</label>
                                                <div className="input-group">
                                                    <Input type="date" value={item.agreement_date}
                                                        min={user?.graph_format_date}
                                                        placeholder="Xona nomeri" required={true} onChange={(e: any) => {

                                                            setGraphItem(graphItem?.map((_: any, index: number) => {
                                                                if (index === i) {
                                                                    return {
                                                                        ..._,
                                                                        agreement_date: e.target.value,
                                                                        agreement_time: '',
                                                                        agreement_time_data: []
                                                                    }
                                                                }
                                                                return _
                                                            }))
                                                        }}
                                                    />
                                                    <button className='btn btn-info btn-sm'
                                                        type='button'
                                                        onClick={() => {
                                                            if (item.agreement_date?.length > 0) {
                                                                workingDateCheck(item?.agreement_date, i)
                                                            } else {
                                                                workingDateCheck(user?.graph_format_date, i)
                                                            }
                                                        }}

                                                    >
                                                        <MdToday />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="col-2">
                                                <label className="form-label">Kelishuv vaqti</label>
                                             
                                            <div className="col-8">
                                                <label className="form-label">Xizmatlar</label>

                                                <div className="d-flex">
                                                    <div className="w-100">
                                                        <Select
                                                            name='name3'
                                                            required
                                                            value={item?.service}
                                                            isMulti
                                                            onChange={(e: any) => {
                                                                setSelectData({
                                                                    ...selectData,
                                                                    service: e,
                                                                })

                                                                setGraphValue(() => [
                                                                    ...e?.map((item: any) => item.data)
                                                                ])
                                                                setGraphItem(graphItem?.map((_: any, index: number) => {
                                                                    if (index === i) {
                                                                        return {
                                                                            ..._,
                                                                            service: e
                                                                        }
                                                                    }
                                                                    return _
                                                                }))
                                                            }}
                                                            className="basic-multi-select"
                                                            classNamePrefix="select"
                                                            options={
                                                                [

                                                                    ...dataSelect(serviceData.filter((item_: any) => item_.department.id == graphData?.department?.value))]
                                                            } />
                                                    </div>
                                                    
                                                </div>
                                            </div>


                                        </div>
                                    )
                                })
                            } */}
                        </div>

                    </div>
                    <div className="modal-footer">
                        {
                            data?.id && graphItem?.length == 1 ?
                                <button type="button" className="btn btn-success" onClick={() => {
                                    // alert(JSON.stringify(data?.department))
                                    console.log('data', data);

                                    const {
                                        phone,
                                        first_name,
                                        last_name,
                                        sex,
                                        data_birth,
                                        person_id,
                                        citizenship
                                    } = data

                                    let result = {
                                        phone,
                                        first_name,
                                        last_name,
                                        sex,
                                        data_birth,
                                        person_id,
                                        citizenship,
                                        id: 0,
                                        agreement_time: graphItem.at(0).agreement_time,
                                        agreement_date: graphItem.at(0).agreement_date,
                                        graph_item_id: graphItem.at(0)?.id,
                                        department: data?.department,
                                        client_value: data?.graph_archive?.treatment?.treatment_service_item
                                            ?.map((res: any) => {
                                                console.log(res.service);
                                                return {
                                                    ...res,
                                                    service_id: res.service?.id,
                                                    ...res?.service,
                                                    id: 0,


                                                }
                                            }),

                                        // client_time: [
                                        //     {
                                        //         agreement_time: graphItem.at(0)?.agreement_time,
                                        //         department: graphData?.department?.data
                                        //     }
                                        // ]
                                    }
                                    console.log('result', result);

                                    setItem(() => result)
                                    setModal3(() => true)

                                }}>Royhatga olish</button> : ''
                        }
                        <button type="submit" className="btn btn-primary" >Qo'shish</button>


                        <button type="button" className="btn btn-danger" onClick={toggle}>Ortga</button>
                    </div>
                    <ToastContainer />
                </form>

            </Modal >
            <Loader loading={loading} />
            <ClientAdd
                modal={modal3} setModal={setModal3}
                setExtraModalClose={toggle}
                setData={setItem} data={item} />
        </>
    )
}

export default GraphAdd