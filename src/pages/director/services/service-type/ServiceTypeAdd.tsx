import React, { useEffect, useRef, useState } from 'react'
// import Layout from '../layouts/Layout'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../../service/store/store';
import { query } from '../../../../componets/api/Query';
import { isServiceTypeAdd, isServiceTypeEdit, isServiceTypeDefaultApi } from '../../../../service/reducer/ServiceTypeReducer';
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
// import { isAddServiceType, isEditServiceType } from '../../service/reducer/ServiceTypeReducer';
const ServiceTypeAdd = ({ data, modal, setModal, setData = function () { }, resetItem = false }: { setData?: any, data?: any, modal?: boolean; setModal?: any, resetItem?: boolean }) => {
    const { departmentData, } = useSelector((state: ReducerType) => state.DepartmentReducer)
    const [modal2, setModal2] = useState(false)
    const dataSelect = (data: any) => {
        let res = [...data].sort((a: any, b: any) => b.id - a.id);
        return res?.map((item: any) => {
            return {
                value: item?.id, label: item?.name,
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
    const { isLoading, sendLoading, isSuccessApi, hasError } = useSelector((state: ReducerType) => state.ServiceTypeReducer)
    const dispatch = useDispatch<AppDispatch>()
    const schema = yup
        .object()
        .shape({
            department_id: yup.string().required("Bo'lim nomi kiriting!"),
            type: yup.string().required("Xizmat turi kiriting!"),

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
            setServiceTypeValue(() => [])

            setSelectData(() => {
                return false
            })
            reset(
                resetObj
            )
            if (data?.department_id > 0) {
                let department_id = departmentData?.find((item: any) => item?.id == data?.department_id);
                setSelectData(() => {
                    return {
                        department_id: {
                            value: department_id?.id,
                            label: department_id?.name
                        }
                    }
                })
                setValue('department_id', data?.department_id, {
                    shouldValidate: true,
                });
            }

        }
        if (Object.keys(data ?? {})?.length > 0) {
            let department_id = departmentData?.find((item: any) => item?.id == data?.department_id);
            setSelectData(() => {
                return {
                    department_id: {
                        value: department_id?.id,
                        label: department_id?.name
                    }
                }
            })
            for (let key in data) {
                setValue(key, data?.[key as string], {
                    shouldValidate: true,
                });

                // extraFuntion(data?.[key], key)
            }
            setServiceTypeValue(() => data?.serviceType_value)


        } else {
            let s = getValues(), resetObj = {};
            for (let key in getValues()) {
                resetObj = {
                    ...resetObj, [key]: ''
                }
            }
            setServiceTypeValue(() => [])
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
            dispatch(isServiceTypeDefaultApi())
        }
    }, [modal, data, isLoading, isSuccessApi])
    const toggle = () => {
        setModal(!modal)
        setEnter(() => false)
    };
    const [serviceTypeValue, setServiceTypeValue] = useState<any>([])
    const send = (e: any) => {
        // if (id?.toString()?.length ?? 0 > 0) {
        //   dispatch(isProductEdit({ query: query({ ...data, product_value: JSON.stringify(product_values) }, ['photo']), file: file, id: id }))
        // } else {
        //   dispatch(isProductAdd({ query: query({ ...data, product_value: JSON.stringify(product_values) }, ['photo']), file: file }))
        // }
        if (data?.id?.toString()?.length ?? 0 > 0) {
            dispatch(isServiceTypeEdit({ query: query({ ...data, ...e, probirka: `${e?.probirka ? 0 : 1}`, serviceType_value: JSON.stringify(serviceTypeValue) }), id: data?.id }))
            /////// dispatch(isCostEdit(data)) 
        } else {
            dispatch(isServiceTypeAdd({ query: query({ ...data, ...e, probirka: `${e?.probirka ? 0 : 1}`, serviceType_value: JSON.stringify(serviceTypeValue) }) }))
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
                                <Input type="text" placeholder="Bo'lim qavati"  {...register('type')} name='type'
                                    error={errors.type?.message?.toString() || hasError?.errors?.type?.toString()}
                                />
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
        </>
    )
}

export default ServiceTypeAdd