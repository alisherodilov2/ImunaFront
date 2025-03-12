import React, { useEffect, useState } from 'react'
// import Layout from '../layouts/Layout'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../service/store/store';
import { query } from '../../componets/api/Query';
import { isCustomerAdd, isCustomerEdit, isCustomerDefaultApi } from '../../service/reducer/CustomerReducer';
import { ReducerType } from '../../interface/interface';
import Loader from '../../componets/api/Loader';
import { isFindFunction } from '../../service/reducer/MenuReducer';
import Input from '../../componets/inputs/Input';
import { NumericFormat, PatternFormat } from 'react-number-format';
import ErrorInput from '../../componets/inputs/ErrorInput';
import axios from 'axios';
// import { isAddCustomer, isEditCustomer } from '../../service/reducer/CustomerReducer';
const CustomerAdd = ({ data, modal, setModal, setData = function () { }, resetItem = false }: { setData?: any, data?: any, modal?: boolean; setModal?: any, resetItem?: boolean }) => {
    const { findData } = useSelector((state: ReducerType) => state.MenuReducer)
    const { isLoading, sendLoading, isSuccessApi, hasError } = useSelector((state: ReducerType) => state.CustomerReducer)
    const dispatch = useDispatch<AppDispatch>()
    const schema = yup
        .object()
        .shape({
            full_name: yup.string().required("MIJOZ kiriting!"),
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
         
            address: yup.string().required("manzilni kiriting!"),
            target_adress: yup.string().required("Moljal kiriting!"),
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
            reset(
                resetObj
            )
        }
        if (isSuccessApi) {
            setData(() => { })
            setModal(enter)
            dispatch(isCustomerDefaultApi())
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
            dispatch(isCustomerEdit({ query: query({ ...data, ...e, phone:e.phone.replace(/[^\d]/g, ''), }), id: data?.id }))
            /////// dispatch(isCostEdit(data)) 
        } else {
            dispatch(isCustomerAdd({ query: query({ ...data, ...e,phone:e.phone.replace(/[^\d]/g, ''), }) }))
        }
    }


    return (
        <>
            <Loader loading={sendLoading} />
            <Modal centered={true} isOpen={modal} toggle={toggle} role='dialog' size='lg' backdrop="static" keyboard={false}>
                <form onSubmit={handleSubmit(send)} className="size_16">
                    <div className="modal-header">
                        <h5 className="modal-title" id="modalCenterTitle">{data?.id?.length > 0 ? 'Mijoz ' : "Mijoz qo'shish"}</h5>
                        <button onClick={toggle} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body">
                        <div className='row' >
                            <div className="col-6 mb-1">
                                <label className="form-label">Mijoz ism-sharifini kiriting</label>
                                <Input type="text" placeholder="Mijoz ism-sharifini kiriting"  {...register('full_name')} name='full_name'
                                    error={errors.full_name?.message?.toString() || hasError?.errors?.full_name?.toString()}
                                />

                            </div>
                            <div className="col-6 mb-1">
                                <label className="form-label">Telefon</label>
                                {/* <Input type="number" placeholder="Telefon raqam kiriting"  {...register('phone')} name='phone'
                                    error={errors.phone?.message?.toString() || hasError?.errors?.phone?.toString()}
                                /> */}
                                <input type="hidden" {...register('phone')} name='phone' />
                                <PatternFormat
                                    format="+998 (##) ###-##-##"
                                    mask="_"
                                    value={getValues('phone')}
                                    allowEmptyFormatting
                                    className='form-control'
                                    placeholder="+998 (___) ___-____"
                                    onChange={(e: any) => {
                                        console.log(e.target.value);
                                        
                                        setValue('phone', e.target.value.replace(/[^\d]/g, '').slice(3), {
                                            shouldValidate: true,
                                        });
                                    }}
                                />
                                <ErrorInput>
                                    {errors.phone?.message?.toString() || hasError?.errors?.phone?.toString()}
                                </ErrorInput>

                            </div>
                       
                            <div className="col-12 mb-1">
                                <label className="form-label">Manzilni kiriting</label>
                                <Input type="text" placeholder="Manzilni kiriting"  {...register('address')} name='address'
                                    error={errors.address?.message?.toString() || hasError?.errors?.address?.toString()}
                                />
                            </div>
                            <div className="col-12 mb-1">
                                <label className="form-label">Mo'ljal  kiriting</label>
                                <Input type="text" placeholder="Mo'ljal  kiriting"  {...register('target_adress')} name='target_adress'
                                    error={errors.address?.message?.toString() || hasError?.errors?.address?.toString()}
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

        </>
    )
}

export default CustomerAdd