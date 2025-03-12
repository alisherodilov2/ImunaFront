import React, { useEffect, useRef, useState } from 'react'
// import Layout from '../layouts/Layout'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../../service/store/store';
import { query, queryObj } from '../../../../componets/api/Query';
import { isDepartmentAdd, isDepartmentEdit, isDepartmentDefaultApi } from '../../../../service/reducer/DepartmentReducer';
import { ReducerType } from '../../../../interface/interface';
import Loader from '../../../../componets/api/Loader';
import { isFindFunction } from '../../../../service/reducer/MenuReducer';
import Input from '../../../../componets/inputs/Input';
import { NumericFormat, PatternFormat } from 'react-number-format';
import ErrorInput from '../../../../componets/inputs/ErrorInput';
import axios from 'axios';
import { MdDeleteForever } from 'react-icons/md';
import Swal from 'sweetalert2';
import { json } from 'react-router-dom';
import { nanoid } from '@reduxjs/toolkit';
// import { isAddDepartment, isEditDepartment } from '../../service/reducer/DepartmentReducer';
const DepartmentAdd = ({ data, modal, setModal, setData = function () { }, resetItem = false }: { setData?: any, data?: any, modal?: boolean; setModal?: any, resetItem?: boolean }) => {
    const { findData } = useSelector((state: ReducerType) => state.MenuReducer)
    const { isLoading, sendLoading, isSuccessApi, hasError } = useSelector((state: ReducerType) => state.DepartmentReducer)
    const dispatch = useDispatch<AppDispatch>()
    const schema = yup
        .object()
        .shape({
            name: yup.string().required("Bo'lim nomi kiriting!"),
            floor: yup.string().required("Bo'lim qavati kiriting!"),
            main_room: yup.string().required("Asosiy xona kiriting!"),
            letter: yup.string().required("Harf kiriting!"),

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
    const [status, setStatus] = useState({
        is_certificate: false,
        probirka: false
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
        if (Object.keys(data ?? {})?.length > 0) {
            for (let key in data) {

                setValue(key, data?.[key as string], {
                    shouldValidate: true,
                });

                // extraFuntion(data?.[key], key)
            }
            setStatus(() => {
                return {
                    is_certificate: +data?.is_certificate ? true : false,
                    probirka: +data?.probirka ? true : false
                }
            })
            setDepartmentValue(() => data?.department_value)


        } else {
            let s = getValues(), resetObj = {};
            for (let key in getValues()) {
                resetObj = {
                    ...resetObj, [key]: ''
                }
            }
            setDepartmentValue(() => [])

            reset(
                resetObj
            )
        }
        if (isSuccessApi) {
            setStatus(() => {
                return {
                    is_certificate: false,
                    probirka: false
                }
            })
            let s = getValues(), resetObj = {};
            for (let key in getValues()) {
                resetObj = {
                    ...resetObj, [key]: ''
                }
            }
            setDepartmentValue(() => [])
            setData(() => { })
            setModal(false)
            dispatch(isDepartmentDefaultApi())
        }
    }, [modal, data, isLoading, isSuccessApi])
    const toggle = () => {
        setModal(!modal)
        setEnter(() => false)
        setStatus(() => {
            return {
                is_certificate: false,
                probirka: false
            }
        })
        let s = getValues(), resetObj = {};
        for (let key in getValues()) {
            resetObj = {
                ...resetObj, [key]: ''
            }
        }
        setDepartmentValue(() => [])
        setData(() => { })
    };
    const [departmentValue, setDepartmentValue] = useState<any>([])
    const send = (e: any) => {
        // if (id?.toString()?.length ?? 0 > 0) {
        //   dispatch(isProductEdit({ query: query({ ...data, product_value: JSON.stringify(product_values) }, ['photo']), file: file, id: id }))
        // } else {
        //   dispatch(isProductAdd({ query: query({ ...data, product_value: JSON.stringify(product_values) }, ['photo']), file: file }))
        // }
        if (data?.id?.toString()?.length ?? 0 > 0) {
            dispatch(isDepartmentEdit({
                query: queryObj({
                    ...data, ...e, probirka: `${status?.probirka ? 1 : 0}`, is_certificate: `${status?.is_certificate ? 1 : 0}`, department_value: JSON.stringify(departmentValue),

                }), id: data?.id
            }))
            /////// dispatch(isCostEdit(data)) 
        } else {
            dispatch(isDepartmentAdd({ query: queryObj({ ...data, ...e, probirka: `${status?.probirka ? 1 : 0}`, is_certificate: `${status?.is_certificate ? 1 : 0}`, department_value: JSON.stringify(departmentValue) }) }))
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
                                <Input type="text" placeholder="Bo'lim nomi"  {...register('name')} name='name'
                                    error={errors.name?.message?.toString() || hasError?.errors?.name?.toString()}
                                />

                            </div>
                            <div className="col-6 mb-1">
                                <label className="form-label">Bo'lim qavati</label>
                                <Input type="text" placeholder="Bo'lim qavati"  {...register('floor')} name='floor'
                                    error={errors.floor?.message?.toString() || hasError?.errors?.floor?.toString()}
                                />

                            </div>
                            <div className="col-6 mb-1">
                                <label className="form-label">Asosiy xona</label>
                                <Input type="text" placeholder="Asosiy xona"  {...register('main_room')} name='main_room'
                                    error={errors.main_room?.message?.toString() || hasError?.errors?.main_room?.toString()}
                                />

                            </div>
                            <div className="col-6 mb-1">
                                <label className="form-label">Harf</label>
                                <Input type="text" placeholder="Harf"  {...register('letter')} name='letter'
                                    error={errors.letter?.message?.toString() || hasError?.errors?.letter?.toString()}
                                />
                            </div>
                            <div className="col-3 mb-1 d-flex my-1">
                                <label className="form-label user-select" htmlFor='Probirka'>Probirka</label>
                                <div className="form-check  ">
                                    <input className="form-check-input switch float-end"
                                        type="checkbox" id='Probirka'
                                        checked={status.probirka}
                                        onChange={(e: any) => {
                                            let value = e.target.checked;
                                            setStatus({ ...status, is_certificate: false, probirka: value })
                                        }}

                                    />
                                </div>
                            </div>
                            <div className="col-3 mb-1 d-flex my-1">
                                <label className="form-label user-select" htmlFor='is_certificate'>Sertifkat</label>
                                <div className="form-check ">
                                    <input className="form-check-input float-end"
                                        type="checkbox" id='is_certificate'
                                        checked={status.is_certificate}
                                        onChange={(e: any) => {
                                            let value = e.target.checked;
                                            setStatus({ ...status, is_certificate: value, probirka: false })
                                        }}

                                    />
                                </div>
                            </div>
                            <div className="col-6 mb-1">
                                <label className="form-label">
                                    Navbat soni</label>
                                <input type="hidden" {...register('queue_number_limit')} name='queue_number_limit' />
                                <NumericFormat
                                    value={getValues('queue_number_limit')}
                                    thousandSeparator
                                    onChange={(e: any) => {
                                        setValue('queue_number_limit', e.target.value.replace(/,/g, ''), {
                                            shouldValidate: true,
                                        });

                                    }}
                                    className='form-control'
                                />

                            </div>
                            <div className="col-6 mb-1">
                                <label className="form-label">
                                    javon soni</label>
                                <input type="hidden" {...register('shelf_number_limit')} name='shelf_number_limit' />
                                <NumericFormat
                                    value={getValues('shelf_number_limit')}
                                    thousandSeparator
                                    onChange={(e: any) => {
                                        setValue('shelf_number_limit', e.target.value.replace(/,/g, ''), {
                                            shouldValidate: true,
                                        });

                                    }}
                                    className='form-control'
                                />

                            </div>
                        </div>
                        <button className='btn btn-primary btn-sm' onClick={() => {
                            setDepartmentValue([...departmentValue, {
                                id: nanoid(),
                                room_type: '',
                                room_number: '',
                            }])
                            setTimeout(() => {
                                scrollToBottom();
                            }, 100);
                        }} type='button' >Qo'shimcha xona</button>
                        <div
                            ref={cardRef}
                            style={{
                                maxHeight: `${window.innerHeight / 2.2}px`,
                                overflowY: 'auto',
                                overflowX: 'hidden',
                                padding: '0.5rem 0.5rem 0.5rem 0.5rem',
                                border: '1px solid #dee2e6',
                                marginTop: '0.5rem',
                                display: departmentValue?.length > 0 ? 'block' : 'none'
                            }}>

                            {
                                departmentValue?.map((item: any, i: number) => {
                                    return (
                                        <div className="row d-relative my-2" key={i}>
                                            <button className="d-absolute btn btn-sm btn-danger"
                                                type='button'
                                                onClick={() => {
                                                    Swal.fire({
                                                        title: "Ma'lumotni o'chirasizmi?",
                                                        showDenyButton: true,
                                                        showCancelButton: true,
                                                        confirmButtonText: 'Ha',
                                                        denyButtonText: `Yo'q`,
                                                    }).then((result: any) => {
                                                        if (result.isConfirmed) {
                                                            setDepartmentValue(departmentValue?.filter((_: any, index: number) => _.id !== item?.id))
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
                                            <div className="col-6">
                                                <label className="form-label">Xona nomeri</label>
                                                <Input type="text" value={item.room_number} placeholder="Xona nomeri" required={true} onChange={(e: any) => {
                                                    setDepartmentValue(departmentValue?.map((_: any, index: number) => {
                                                        if (_.id == item?.id) {
                                                            return {
                                                                ..._,
                                                                room_number: e.target.value
                                                            }
                                                        }
                                                        return _
                                                    }))
                                                }}
                                                />
                                            </div>
                                            <div className="col-6">
                                                <label className="form-label">
                                                    Xona turi</label>
                                                <Input type="text" required={true} value={item.room_type} placeholder="Xona turi"
                                                    onChange={(e: any) => {
                                                        setDepartmentValue(departmentValue?.map((_: any, index: number) => {
                                                            if (_.id == item?.id) {
                                                                return {
                                                                    ..._,
                                                                    room_type: e.target.value
                                                                }
                                                            }
                                                            return _
                                                        }))
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )
                                })
                            }
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

        </>
    )
}

export default DepartmentAdd