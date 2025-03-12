import React, { useEffect, useRef, useState } from 'react'
// import Layout from '../layouts/Layout'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../../service/store/store';
import { query } from '../../../../componets/api/Query';
import { isServiceAdd, isServiceEdit, isServiceDefaultApi } from '../../../../service/reducer/ServiceReducer';
import { ReducerType } from '../../../../interface/interface';
import Loader from '../../../../componets/api/Loader';
import { isFindFunction } from '../../../../service/reducer/MenuReducer';
import Input from '../../../../componets/inputs/Input';
import { NumericFormat, PatternFormat } from 'react-number-format';
import ErrorInput from '../../../../componets/inputs/ErrorInput';
import Select from 'react-select';
import axios from 'axios';
import { MdDeleteForever } from 'react-icons/md';
import Swal from 'sweetalert2';
import { json } from 'react-router-dom';
import DepartmentAdd from '../department/DepartmentAdd';
import ServiceTypeAdd from '../service-type/ServiceTypeAdd';
// import { isAddService, isEditService } from '../../service/reducer/ServiceReducer';
const ServiceAdd = ({ data, modal, setModal, setData = function () { }, resetItem = false }: { setData?: any, data?: any, modal?: boolean; setModal?: any, resetItem?: boolean }) => {
    const { departmentData, } = useSelector((state: ReducerType) => state.DepartmentReducer)
    const { serviceTypeData } = useSelector((state: ReducerType) => state.ServiceTypeReducer)

    const [modal2, setModal2] = useState(false)
    const [modal3, setModal3] = useState(false)
    const dataSelect = (data: any) => {
        let res = [...data].sort((a: any, b: any) => b.id - a.id);
        return res?.map((item: any) => {
            return {
                value: item?.id, label: item?.name || item?.type,
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
    const { isLoading, sendLoading, isSuccessApi, hasError } = useSelector((state: ReducerType) => state.ServiceReducer)
    const dispatch = useDispatch<AppDispatch>()
    const schema = yup
        .object()
        .shape({
            department_id: yup.string().required("Bo'lim nomi kiriting!"),
            name: yup.string().required("Xizmat nomi kiriting!"),
            // short_name: yup.string().nul,
            price: yup.string().required("Narxi kiriting!"),
            doctor_contribution_price: yup.string().required("Doktor ulushi kiriting!"),
            kounteragent_contribution_price: yup.string().required("Kounteragent ulushi kiriting!"),
            kounteragent_doctor_contribution_price: yup.string().required("Kounterdoktor ulushi kiriting!"),
            servicetype_id: yup.string().required("Xizmat turi kiriting!"),
            is_change_price: yup.string().nullable(),

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
            setServiceValue(() => [])

            setSelectData(() => {
                return false
            })
            reset(
                resetObj
            )
            if (data?.department_id > 0 && data?.servicetype_id > 0) {
                let department_id = departmentData?.find((item: any) => item?.id == data?.department_id);
                let servicetype_id = serviceTypeData?.find((item: any) => item?.id == data?.servicetype_id);
                setSelectData(() => {
                    return {
                        department_id: {
                            value: department_id?.id,
                            label: department_id?.name
                        },
                        servicetype_id: {
                            value: servicetype_id?.id,
                            label: servicetype_id?.type
                        },
                    }
                })
                setValue('department_id', data?.department_id.id, {
                    shouldValidate: true,
                });
                setValue('servicetype_id', data?.servicetype_id.id, {
                    shouldValidate: true,
                });
            }

        }
        if (Object.keys(data ?? {})?.length > 0) {
            let department_id = departmentData?.find((item: any) => item?.id == data?.department.id);
            let servicetype_id = serviceTypeData?.find((item: any) => item?.id == data?.servicetype.id);
            setValue('department_id', data?.department.id, {
                shouldValidate: true,
            });
            setValue('servicetype_id', data?.servicetype.id, {
                shouldValidate: true,
            });
            setSelectData(() => {
                return {
                    department_id: {
                        value: department_id?.id,
                        label: department_id?.name
                    },
                    servicetype_id: {
                        value: servicetype_id?.id,
                        label: servicetype_id?.type
                    },
                }
            })
            for (let key in data) {
                setValue(key, data?.[key as string], {
                    shouldValidate: true,
                });

                // extraFuntion(data?.[key], key)
            }
            setServiceValue(() => data?.service_value)


        } else {
            let s = getValues(), resetObj = {};
            for (let key in getValues()) {
                resetObj = {
                    ...resetObj, [key]: ''
                }
            }
            setServiceValue(() => [])
            setSelectData(() => {
                return false
            })
            reset(
                resetObj
            )
        }
        if (isSuccessApi) {
            setData(() => { })
            setModal(enter)
            dispatch(isServiceDefaultApi())
        }
    }, [modal, data, isLoading, isSuccessApi])
    const toggle = () => {
        setModal(!modal)
        setEnter(() => false)
    };
    const [serviceValue, setServiceValue] = useState<any>([])
    const send = (e: any) => {
        // if (id?.toString()?.length ?? 0 > 0) {
        //   dispatch(isProductEdit({ query: query({ ...data, product_value: JSON.stringify(product_values) }, ['photo']), file: file, id: id }))
        // } else {
        //   dispatch(isProductAdd({ query: query({ ...data, product_value: JSON.stringify(product_values) }, ['photo']), file: file }))
        // }
        if (data?.id?.toString()?.length ?? 0 > 0) {
            dispatch(isServiceEdit({ query: query({ ...data, ...e, is_change_price: `${e?.is_change_price ? 1 : 0}`, probirka: `${e?.probirka ? 0 : 1}`, service_value: JSON.stringify(serviceValue) }), id: data?.id }))
            /////// dispatch(isCostEdit(data)) 
        } else {
            dispatch(isServiceAdd({ query: query({ ...data, ...e, is_change_price: `${e?.is_change_price ? 1 : 0}`, probirka: `${e?.probirka ? 0 : 1}`, service_value: JSON.stringify(serviceValue) }) }))
        }
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

    return (
        <>
            <Loader loading={sendLoading} />
            <Modal centered={true} isOpen={modal} toggle={toggle} role='dialog' size='lg' backdrop="static" keyboard={false}>
                <form onSubmit={handleSubmit(send)} className="size_16">
                    <div className="modal-header">
                        <h5 className="modal-title" id="modalCenterTitle">{data?.id?.length > 0 ? 'Bo`lim ' : "Bo`lim qo'shish"}</h5>
                        <button onClick={toggle} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body">
                        <div className='row' >

                            <div className="col-6 mb-1">
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

                                                setValue('department_id', e.value, {
                                                    shouldValidate: true,
                                                });
                                            }}
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                            // value={userBranch}
                                            options={
                                                dataSelect(departmentData)
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
                                    {errors.department_id?.message?.toString() || hasError?.errors?.department_id?.toString()}
                                </ErrorInput>
                            </div>
                            <div className="col-6 mb-1">
                                <label className="form-label">Xizmat turi</label>
                                <input type="hidden" {...register('servicetype_id')} name='servicetype_id' />
                                <div className="d-flex">
                                    <div className="w-100">

                                        <Select
                                            name='name3'
                                            value={selectData?.servicetype_id}
                                            onChange={(e: any) => {
                                                setSelectData({
                                                    ...selectData,
                                                    servicetype_id: e
                                                })

                                                setValue('servicetype_id', e.value, {
                                                    shouldValidate: true,
                                                });
                                            }}
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                            // value={userBranch}
                                            options={
                                                dataSelect(serviceTypeData)
                                            } />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setModal3(() => true)
                                        }}
                                        // onFocus={togglePopover}
                                        className="btn btn-icon btn-primary input-group-text">
                                        <span className="tf-icons bx bx-plus" />
                                    </button>
                                </div>
                                <ErrorInput>
                                    {errors.servicetype_id?.message?.toString() || hasError?.errors?.servicetype_id?.toString()}
                                </ErrorInput>
                            </div>
                            <div className="col-6 mb-1">
                                <label className="form-label">Xizmat nomi</label>
                                <Input type="text" placeholder="Xizmat nomi"  {...register('name')} name='name'
                                    error={errors.name?.message?.toString() || hasError?.errors?.name?.toString()}
                                />
                            </div>
                            <div className="col-6 mb-1">
                                <label className="form-label">Qisqartma nomi</label>
                                <Input type="text" placeholder="Xizmat nomi"  {...register('short_name')} name='short_name'
                                    error={errors.name?.message?.toString() || hasError?.errors?.name?.toString()}
                                />
                            </div>
                            <div className="col-6 mb-1">
                                <label className="form-label">Narxi</label>
                                <input type="hidden" {...register('price')} name='price' />
                                <div className="input-group">
                                    <NumericFormat
                                        value={getValues('price')}
                                        thousandSeparator
                                        onChange={(e: any) => {
                                            setValue('price', e.target.value.replace(/,/g, ''), {
                                                shouldValidate: true,
                                            });

                                        }}
                                        className='form-control'
                                    />
                                    <div className="input-group-text">
                                        <div className="form-check form-switch cursor-pointer">
                                            <input className="form-check-input float-end" type="checkbox" role="switch"
                                                onChange={(e) => {
                                                    console.log(e.target.checked);

                                                    setValue('is_change_price', e.target.checked, {
                                                        shouldValidate: true
                                                    })
                                                    // send(`is_change_price=${e.target.checked ? '1' : '0'}`)
                                                }}
                                                checked={+getValues('is_change_price') ? true : false}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <ErrorInput>
                                    {errors.price?.message?.toString() || hasError?.errors?.price?.toString()}
                                </ErrorInput>
                            </div>
                            <div className="col-6 mb-1">
                                <label className="form-label">Doktor ulushi</label>
                                <input type="hidden" {...register('doctor_contribution_price')} name='doctor_contribution_price' />
                                <NumericFormat
                                    value={getValues('doctor_contribution_price')}
                                    thousandSeparator
                                    onChange={(e: any) => {
                                        setValue('doctor_contribution_price', e.target.value.replace(/,/g, ''), {
                                            shouldValidate: true,
                                        });

                                    }}
                                    className='form-control'
                                />
                                <ErrorInput>
                                    {errors.doctor_contribution_price?.message?.toString() || hasError?.errors?.doctor_contribution_price?.toString()}
                                </ErrorInput>
                            </div>
                            <div className="col-6 mb-1">
                                <label className="form-label">Kounteragent ulushi</label>
                                <input type="hidden" {...register('kounteragent_contribution_price')} name='kounteragent_contribution_price' />
                                <NumericFormat
                                    value={getValues('kounteragent_contribution_price')}
                                    thousandSeparator
                                    onChange={(e: any) => {
                                        setValue('kounteragent_contribution_price', e.target.value.replace(/,/g, ''), {
                                            shouldValidate: true,
                                        });

                                    }}
                                    className='form-control'
                                />
                                <ErrorInput>
                                    {errors.kounteragent_contribution_price?.message?.toString() || hasError?.errors?.kounteragent_contribution_price?.toString()}
                                </ErrorInput>
                            </div>
                            <div className="col-6 mb-1">
                                <label className="form-label">Kounterdoktor ulushi</label>
                                <input type="hidden" {...register('kounteragent_doctor_contribution_price')} name='kounteragent_doctor_contribution_price' />
                                <NumericFormat
                                    value={getValues('kounteragent_doctor_contribution_price')}
                                    thousandSeparator
                                    onChange={(e: any) => {
                                        setValue('kounteragent_doctor_contribution_price', e.target.value.replace(/,/g, ''), {
                                            shouldValidate: true,
                                        });

                                    }}
                                    className='form-control'
                                />
                                <ErrorInput>
                                    {errors.kounteragent_doctor_contribution_price?.message?.toString() || hasError?.errors?.kounteragent_doctor_contribution_price?.toString()}
                                </ErrorInput>
                            </div>
                        </div>


                    </div>
                    <div className="modal-footer">
                        <button
                            onClick={() => setEnter(() => false)}
                            className="btn btn-primary" data-bs-dismiss="modal">
                            Saqlash
                        </button>

                        <button type="button" className="btn btn-danger" onClick={toggle}>Ortga</button>
                    </div>
                </form>

            </Modal>
            <DepartmentAdd
                modal={modal2} setModal={setModal2}
            />
            <ServiceTypeAdd
                modal={modal3} setModal={setModal3}
            />
        </>
    )
}

export default ServiceAdd