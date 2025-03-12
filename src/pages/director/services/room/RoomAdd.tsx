import React, { useEffect, useRef, useState } from 'react'
// import Layout from '../layouts/Layout'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../../service/store/store';
import { query, queryObj } from '../../../../componets/api/Query';
import { isRoomAdd, isRoomEdit, isRoomDefaultApi } from '../../../../service/reducer/RoomReducer';
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
// import { isAddRoom, isEditRoom } from '../../service/reducer/RoomReducer';
const RoomAdd = ({ data, modal, setModal, setData = function () { }, resetItem = false }: { setData?: any, data?: any, modal?: boolean; setModal?: any, resetItem?: boolean }) => {
    const { findData } = useSelector((state: ReducerType) => state.MenuReducer)
    const { isLoading, sendLoading, isSuccessApi, hasError } = useSelector((state: ReducerType) => state.RoomReducer)
    const dispatch = useDispatch<AppDispatch>()
    const schema = yup
        .object()
        .shape({
            type: yup.string().required("Xona turi kiriting!"),
            number: yup.string().required("Xona raqami kiriting!"),
            room_index: yup.string().required("O'rin raqami kiriting!"),
            price: yup.string().required("Narxi kiriting!"),

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
            setRoomValue(() => data?.room_value)


        } else {
            let s = getValues(), resetObj = {};
            for (let key in getValues()) {
                resetObj = {
                    ...resetObj, [key]: ''
                }
            }
            setRoomValue(() => [])

            reset(
                resetObj
            )
        }
        if (isSuccessApi) {
            setData(() => { })
            setModal(enter)
            dispatch(isRoomDefaultApi())
        }
    }, [modal, data, isLoading, isSuccessApi])
    const toggle = () => {
        setModal(!modal)
        setEnter(() => false)
    };
    const [roomValue, setRoomValue] = useState<any>([])
    const send = (e: any) => {
        // if (id?.toString()?.length ?? 0 > 0) {
        //   dispatch(isProductEdit({ query: query({ ...data, product_value: JSON.stringify(product_values) }, ['photo']), file: file, id: id }))
        // } else {
        //   dispatch(isProductAdd({ query: query({ ...data, product_value: JSON.stringify(product_values) }, ['photo']), file: file }))
        // }
        if (data?.id?.toString()?.length ?? 0 > 0) {
            dispatch(isRoomEdit({ query: queryObj({ ...data, ...e, }), id: data?.id }))
            /////// dispatch(isCostEdit(data)) 
        } else {
            dispatch(isRoomAdd({ query: queryObj({ ...data, ...e, }) }))
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
                                <label className="form-label">Xona turi</label>
                                <Input type="text" placeholder="Xona turi"  {...register('type')} name='type'
                                    error={errors.type?.message?.toString() || hasError?.errors?.type?.toString()}
                                />

                            </div>
                            <div className="col-6 mb-1">
                                <label className="form-label">Xona raqami</label>
                                <Input type="text" placeholder="Xona raqami"  {...register('number')} name='number'
                                    error={errors.number?.message?.toString() || hasError?.errors?.number?.toString()}
                                />

                            </div>
                            <div className="col-6 mb-1">
                                <label className="form-label">	O'rin raqami</label>
                                <Input type="text" placeholder="O'rin raqami"  {...register('room_index')} name='room_index'
                                    error={errors.room_index?.message?.toString() || hasError?.errors?.room_index?.toString()}
                                />
                            </div>
                            <div className="col-6 mb-1">
                                <label className="form-label">	Narxi</label>
                                <input type="hidden" {...register('price')} name='price' />
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
                                <ErrorInput>
                                    {errors.price?.message?.toString() || hasError?.errors?.price?.toString()}
                                </ErrorInput>
                            </div>
                            <div className="col-6 mb-1">
                                <label className="form-label">	Shifokor ulushi</label>
                                <input type="hidden" {...register('doctor_contribution')} name='doctor_contribution' />
                                <NumericFormat
                                    value={getValues('doctor_contribution')}
                                    thousandSeparator
                                    onChange={(e: any) => {
                                        setValue('doctor_contribution', e.target.value.replace(/,/g, ''), {
                                            shouldValidate: true,
                                        });

                                    }}
                                    className='form-control'
                                />
                                <ErrorInput>
                                    {errors.doctor_contribution?.message?.toString() || hasError?.errors?.doctor_contribution?.toString()}
                                </ErrorInput>
                            </div>
                            <div className="col-6 mb-1">
                                <label className="form-label">	Hamshira ulushi</label>
                                <input type="hidden" {...register('nurse_contribution')} name='nurse_contribution' />
                                <NumericFormat
                                    value={getValues('nurse_contribution')}
                                    thousandSeparator
                                    onChange={(e: any) => {
                                        setValue('nurse_contribution', e.target.value.replace(/,/g, ''), {
                                            shouldValidate: true,
                                        });

                                    }}
                                    className='form-control'
                                />
                                <ErrorInput>
                                    {errors.nurse_contribution?.message?.toString() || hasError?.errors?.nurse_contribution?.toString()}
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

        </>
    )
}

export default RoomAdd