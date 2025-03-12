import React, { useEffect, useRef, useState } from 'react'
// import Layout from '../layouts/Layout'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from 'react-redux';


import { NumericFormat, PatternFormat } from 'react-number-format';

import axios from 'axios';
import { MdDeleteForever } from 'react-icons/md';
import Swal from 'sweetalert2';
import { json } from 'react-router-dom';
import { nanoid } from '@reduxjs/toolkit';
import { ReducerType } from '../../../interface/interface';
import { AppDispatch } from '../../../service/store/store';
import { isComplaintTarget, isMedicineTypeAdd, isMedicineTypeDefaultApi, isMedicineTypeEdit } from '../../../service/reducer/MedicineTypeReducer';
import { queryObj } from '../../../componets/api/Query';
import Loader from '../../../componets/api/Loader';
import Input from '../../../componets/inputs/Input';
// import { isAddMedicineType, isEditMedicineType } from '../../service/reducer/MedicineTypeReducer';
const MedicineTypeAdd = ({ data, modal, setModal, setData = function () { }, extraFun = function () { }, resetItem = false }: { setData?: any, data?: any, modal?: boolean; setModal?: any, resetItem?: boolean, extraFun?: any }) => {
    const { findData } = useSelector((state: ReducerType) => state.MenuReducer)
    const { isLoading, sendLoading, isSuccessApi, hasError, complaintTarget } = useSelector((state: ReducerType) => state.MedicineTypeReducer)
    const dispatch = useDispatch<AppDispatch>()
    const schema = yup
        .object()
        .shape({
            name: yup.string().required("Shikoyat nomini kiriting!"),
            // floor: yup.string().required("Bo'lim qavati kiriting!"),
            // main_room: yup.string().required("Asosiy xona kiriting!"),
            // letter: yup.string().required("Harf kiriting!"),

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
            setMedicineTypeValue(() => data?.medicineType_value)


        } else {
            let s = getValues(), resetObj = {};
            for (let key in getValues()) {
                resetObj = {
                    ...resetObj, [key]: ''
                }
            }
            setMedicineTypeValue(() => [])

            reset(
                resetObj
            )
        }
        if (isSuccessApi) {
            extraFun(complaintTarget)
            dispatch(isComplaintTarget({}))
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
            setMedicineTypeValue(() => [])
            setData(() => { })
            setModal(false)
            dispatch(isMedicineTypeDefaultApi())
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
        setMedicineTypeValue(() => [])
        setData(() => { })
    };
    const [medicineTypeValue, setMedicineTypeValue] = useState<any>([])
    const send = (e: any) => {
        // if (id?.toString()?.length ?? 0 > 0) {
        //   dispatch(isProductEdit({ query: query({ ...data, product_value: JSON.stringify(product_values) }, ['photo']), file: file, id: id }))
        // } else {
        //   dispatch(isProductAdd({ query: query({ ...data, product_value: JSON.stringify(product_values) }, ['photo']), file: file }))
        // }
        if (data?.id?.toString()?.length ?? 0 > 0) {
            dispatch(isMedicineTypeEdit({
                query: queryObj({
                    ...data, ...e, probirka: `${status?.probirka ? 1 : 0}`, is_certificate: `${status?.is_certificate ? 1 : 0}`, medicineType_value: JSON.stringify(medicineTypeValue),

                }), id: data?.id
            }))
            /////// dispatch(isCostEdit(data)) 
        } else {
            dispatch(isMedicineTypeAdd({ query: queryObj({ ...data, ...e, probirka: `${status?.probirka ? 1 : 0}`, is_certificate: `${status?.is_certificate ? 1 : 0}`, medicineType_value: JSON.stringify(medicineTypeValue) }) }))
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
                        <h5 className="modal-title" id="modalCenterTitle">Shikoyat</h5>
                        <button onClick={toggle} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body">
                        <div className='row' >
                            <div className="col-12 mb-1">
                                <label className="form-label">Shikoyat nomi</label>
                                <Input type="text" placeholder="Shikoyat nom"  {...register('name')} name='name'
                                    error={errors.name?.message?.toString() || hasError?.errors?.name?.toString()}
                                />

                            </div>

                        </div>
                        <div
                            ref={cardRef}
                            style={{
                                maxHeight: `${window.innerHeight / 2.2}px`,
                                overflowY: 'auto',
                                overflowX: 'hidden',
                                padding: '0.5rem 0.5rem 0.5rem 0.5rem',
                                border: '1px solid #dee2e6',
                                marginTop: '0.5rem',
                                display: medicineTypeValue?.length > 0 ? 'block' : 'none'
                            }}>

                            {
                                medicineTypeValue?.map((item: any, i: number) => {
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
                                                            setMedicineTypeValue(medicineTypeValue?.filter((_: any, index: number) => _.id !== item?.id))
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
                                                    setMedicineTypeValue(medicineTypeValue?.map((_: any, index: number) => {
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
                                                        setMedicineTypeValue(medicineTypeValue?.map((_: any, index: number) => {
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

export default MedicineTypeAdd