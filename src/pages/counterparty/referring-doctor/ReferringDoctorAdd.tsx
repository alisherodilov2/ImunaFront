import React, { useEffect, useState } from 'react'
// import Layout from '../layouts/Layout'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../service/store/store';
import { query } from '../../../componets/api/Query';
import { isReferringDoctorAdd, isReferringDoctorEdit, isReferringDoctorDefaultApi } from '../../../service/reducer/ReferringDoctorReducer';
import { ReducerType } from '../../../interface/interface';
import Loader from '../../../componets/api/Loader';
import { isFindFunction } from '../../../service/reducer/MenuReducer';
import Input from '../../../componets/inputs/Input';
import { NumericFormat, PatternFormat } from 'react-number-format';
import ErrorInput from '../../../componets/inputs/ErrorInput';

import axios from 'axios';
import { domain } from '../../../main';
// import { isAddReferringDoctor, isEditReferringDoctor } from '../../service/reducer/ReferringDoctorReducer';
const ReferringDoctorAdd = ({ data, modal, setModal, setData = function () { }, resetItem = false, registerAdd = false }: { registerAdd?: boolean, setData?: any, data?: any, modal?: boolean; setModal?: any, resetItem?: boolean }) => {
    const [choiseFile, setChoiseFile] = useState('')
    const [file, setFile] = useState(null) as any;
    const [files, setFiles] = useState({
        logo_photo: null,
        blank_file: null,
        user_photo: null
    }) as any;
    const { findData } = useSelector((state: ReducerType) => state.MenuReducer)
    const { isLoading, sendLoading, isSuccessApi, hasError } = useSelector((state: ReducerType) => state.ReferringDoctorReducer)
    const dispatch = useDispatch<AppDispatch>()
    const schema = yup
        .object()
        .shape({
            phone: yup.string().required("Telefon kiriting!")
                .test(
                    'valid-length',
                    'Phone number must have exactly 9 digits after the country code',
                    (val: any) => {
                        const phoneNumber = val && val.replace(/[^\d]/g, ''); // Remove non-numeric characters
                        return phoneNumber && phoneNumber.length === 9; // Check if digits after '998' are exactly 9
                    }
                )
            ,
            first_name: yup.string().required("Familiyasi kiriting!"),
            last_name: yup.string().required("Ismi kiriting!"),
            workplace: yup.string().required("Ish joyi kiriting!"),
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
        if (Object.keys(data ?? {})?.length > 0) {
            for (let key in data) {
                setValue(key, data?.[key as string], {
                    shouldValidate: true,
                });

                // extraFuntion(data?.[key], key)
            }

        } else {
            let s = getValues(), resetObj = {};
            for (let key in getValues()) {
                resetObj = {
                    ...resetObj, [key]: ''
                }
            }
            setFiles(() => {
                return {
                    logo_photo: null,
                    blank_file: null,
                    user_photo: null
                }
            })
            reset(
                resetObj
            )
        }
        if (isSuccessApi) {
            setData(() => { })
            setModal(enter)
            dispatch(isReferringDoctorDefaultApi())
        }
    }, [modal, data, isLoading, isSuccessApi])
    const toggle = () => {
        setModal(!modal)
        setEnter(() => false)
    };
    const send = (e: any) => {
        // if (id?.toString()?.length ?? 0 > 0) {
        //   dispatch(isProductEdit({ query: query({ ...data, product_value: JSON.stringify(product_values) }, ['photo']), file: file, id: id }))
        // } else {
        //   dispatch(isProductAdd({ query: query({ ...data, product_value: JSON.stringify(product_values) }, ['photo']), file: file }))
        // }

        if (data?.id?.toString()?.length ?? 0 > 0) {
            dispatch(isReferringDoctorEdit({
                query: query({
                    ...data, ...e,
                    phone_1: e?.phone_1?.replace(/[^\d]/g, ''),
                    phone_2: e?.phone_2?.replace(/[^\d]/g, ''),
                    phone_3: e?.phone_3?.replace(/[^\d]/g, ''),
                    user_phone: e?.user_phone?.replace(/[^\d]/g, '')
                    ,
                }),
                file: files
                , id: data?.id
            }))
            /////// dispatch(isCostEdit(data)) 
        } else {
            if (registerAdd) {
                dispatch(isReferringDoctorAdd({
                    query: query({
                        first_name: e.first_name,
                        last_name: e.last_name,
                    }),
                    file: files
                }))
            } else {
                dispatch(isReferringDoctorAdd({
                    query: query({
                        ...data, ...e,
                        phone_1: e?.phone_1?.replace(/[^\d]/g, ''),
                        phone_2: e?.phone_2?.replace(/[^\d]/g, ''),
                        phone_3: e?.phone_3?.replace(/[^\d]/g, ''),
                        user_phone: e?.user_phone?.replace(/[^\d]/g, '')
                        ,
                    }),
                    file: files
                }))
            }
        }
    }


    return (
        <>
            <Loader loading={sendLoading} />
            <Modal centered={true} isOpen={modal} toggle={toggle} role='dialog' size='xl' backdrop="static" keyboard={false} >
                <form onSubmit={handleSubmit(send)} className='size_16'>
                    <div className="modal-header">
                        <h5 className="modal-title" id="modalCenterTitle">{+data?.id > 0 ? 'Shifokor tahrirlash ' : "Shifokor qo'shish"}</h5>
                        <button onClick={toggle} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body">

                        <div className="row">
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
                            {
                                registerAdd ? '' : <>
                                    <div className="col-6 mb-1">
                                        <label className="form-label">Ish joyi</label>
                                        <Input type="text" placeholder="Ish joyi"  {...register('workplace')} name='workplace'
                                            error={errors.workplace?.message?.toString() || hasError?.errors?.workplace?.toString()}
                                        />
                                    </div>
                                    <div className="col-6 mb-1">
                                        <label className="form-label">Telefon </label>

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
                                </>
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

export default ReferringDoctorAdd