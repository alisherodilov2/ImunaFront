import React, { useEffect, useRef, useState } from 'react'
// import Layout from '../layouts/Layout'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../../service/store/store';
import { query } from '../../../../componets/api/Query';
import Select from 'react-select';
import { isMaterialExpenseAdd, isMaterialExpenseEdit, isMaterialExpenseDefaultApi } from '../../../../service/reducer/MaterialExpenseReducer';
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
// import { isAddMaterialExpense, isEditMaterialExpense } from '../../service/reducer/MaterialExpenseReducer';
const MaterialExpenseAdd = ({ data, modal, setModal, setData = function () { }, resetItem = false }: { setData?: any, data?: any, modal?: boolean; setModal?: any, resetItem?: boolean }) => {
    const { findData } = useSelector((state: ReducerType) => state.MenuReducer)
    const { isLoading, sendLoading, isSuccessApi, hasError } = useSelector((state: ReducerType) => state.MaterialExpenseReducer)
    const dispatch = useDispatch<AppDispatch>()
    const schema = yup
        .object()
        .shape({
            comment: yup.string().required("Bo'lim nomi kiriting!"),
            product_id: yup.string().required("Bo'lim nomi kiriting!"),

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
            setValue('product_id', data?.product?.id, {
                shouldValidate: true,
            });
            setSelectData(() => {
                return {
                    product_id: {
                        value: data?.product?.id,
                        label: data?.product?.name,
                        data: data?.product
                    }
                }
            })

        } else {
            let s = getValues(), resetObj = {};
            for (let key in getValues()) {
                resetObj = {
                    ...resetObj, [key]: ''
                }
            }
            setMaterialExpenseValue(() => [])

            reset(
                resetObj
            )
        }
        if (isSuccessApi) {
            setData(() => { })
            setModal(enter)
            dispatch(isMaterialExpenseDefaultApi())
            setSelectData(() => {
                return {
                    product_id: false
                }
            })
        }
    }, [modal, data, isLoading, isSuccessApi])
    const toggle = () => {
        setModal(!modal)
        setEnter(() => false)
        setSelectData(() => {
            return {
                product_id: false
            }
        })
    };
    const dataSelect = (data: any) => {
        if (data?.length > 0) {
            return data?.map((item: any) => {
                return {
                    value: item?.id, label: item?.name,
                    data: item
                }
            })
        }
        return []
    }
    const [selectData, setSelectData] = useState({
        pay_type: {
            value: 'Tolov turini tanlang',
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
    const [materialExpenseValue, setMaterialExpenseValue] = useState<any>([])
    const send = (e: any) => {
        // if (id?.toString()?.length ?? 0 > 0) {
        //   dispatch(isProductEdit({ query: query({ ...data, product_value: JSON.stringify(product_values) }, ['photo']), file: file, id: id }))
        // } else {
        //   dispatch(isProductAdd({ query: query({ ...data, product_value: JSON.stringify(product_values) }, ['photo']), file: file }))
        // }
        if (data?.id?.toString()?.length ?? 0 > 0) {
            dispatch(isMaterialExpenseEdit({ query: query({ ...data, ...e, product_id:`${e.product_id}`, qty:`${e.qty}`}), id: data?.id }))
            /////// dispatch(isCostEdit(data)) 
        } else {
            dispatch(isMaterialExpenseAdd({ query: query({ ...data, ...e,product_id:`${e.product_id}`,qty:`${e.qty}` }) }))
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
    const { productData, } = useSelector((state: ReducerType) => state.ProductReducer)

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
                            <input type="hidden" {...register('qty')} name='qty' />
                            <div className="col-12 mb-1">
                                <label className="form-label">Maxsulot</label>
                                <input type="hidden" {...register('product_id')} name='product_id' />
                                <div className="d-flex">
                                    <div className="w-100">
                                        <Select
                                            required
                                            name='name3'
                                            value={selectData?.product_id}
                                            onChange={(e: any) => {
                                                let qty = e.data.qty - e.data.use_qty
                                                if (qty <= 0) {
                                                    alert()
                                                } else {
                                                    setSelectData({
                                                        ...selectData,
                                                        product_id: e,
                                                        product_category_id: {
                                                            value: e.data?.prodcut_category?.id,
                                                            label: e.data?.prodcut_category?.name
                                                        }
                                                    })
                                                    setValue('product_id', e.value, {
                                                        shouldValidate: true,
                                                    });

                                                    setValue('qty', 1, {
                                                        shouldValidate: true,
                                                    });

                                                }
                                            }}
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                            // value={userBranch}
                                            options={
                                                dataSelect(productData?.filter((item: any) => +item?.qty- +item?.use_qty>0))
                                            } />

                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            let qty =selectData.product_id.data.qty - selectData.product_id.data.use_qty
                                            let currebtQty = getValues('qty')
                                            if (currebtQty>1) {
                                                setValue('qty', currebtQty - 1, {
                                                    shouldValidate: true,
                                                })
                                            }
                                        }}
                                        // onFocus={togglePopover}
                                        className="btn btn-icon btn-danger input-group-text">
                                        <span className="tf-icons bx bx-minus" />
                                    </button>
                                    <button
                                        type="button"
                                        
                                        // onFocus={togglePopover}
                                        className="btn btn-icon btn-primary input-group-text">
                                        {getValues('qty')>0 ? getValues('qty') : 0}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            let qty =selectData.product_id.data.qty - selectData.product_id.data.use_qty as any;
                                            // if(data?.id>0){
                                            //     qty = qty - data.qty
                                            // }
                                            let currebtQty = getValues('qty')
                                            
                                            if (currebtQty+1<=qty) {
                                                setValue('qty', currebtQty + 1, {
                                                    shouldValidate: true,
                                                })
                                            }else{
                                                alert('maxsulot yetmaydi')
                                            }
                                        }}
                                        // onFocus={togglePopover}
                                        className="btn btn-icon btn-primary input-group-text">
                                        <span className="tf-icons bx bx-plus" />
                                    </button>
                                </div>
                                <ErrorInput>
                                    {errors.product_id?.message?.toString() || hasError?.errors?.product_id?.toString()}
                                </ErrorInput>
                            </div>

                            <div className="mb-b col-12">
                                <label className="form-label">Izoh</label>
                                <Input type="text" placeholder="Izoh"  {...register('comment')} name='comment'
                                    error={errors.comment?.message?.toString() || hasError?.errors?.comment?.toString()}
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

export default MaterialExpenseAdd