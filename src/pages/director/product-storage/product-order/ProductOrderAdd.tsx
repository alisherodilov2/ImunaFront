import React, { useEffect, useRef, useState } from 'react'
// import Layout from '../layouts/Layout'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../../service/store/store';
import { query } from '../../../../componets/api/Query';
import { isProductOrderAdd, isProductOrderEdit, isProductOrderDefaultApi } from '../../../../service/reducer/ProductOrderReducer';
import { ReducerType } from '../../../../interface/interface';
import Loader from '../../../../componets/api/Loader';
import { isFindFunction } from '../../../../service/reducer/MenuReducer';
import Input from '../../../../componets/inputs/Input';
import { NumericFormat, PatternFormat } from 'react-number-format';
import ErrorInput from '../../../../componets/inputs/ErrorInput';
import axios from 'axios';
import { MdDeleteForever } from 'react-icons/md';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { json } from 'react-router-dom';
import { nanoid } from '@reduxjs/toolkit';
// import { isAddProductOrder, isEditProductOrder } from '../../service/reducer/ProductOrderReducer';
const ProductOrderAdd = ({ data, modal, setModal, setData = function () { }, resetItem = false }: { setData?: any, data?: any, modal?: boolean; setModal?: any, resetItem?: boolean }) => {
    const { findData } = useSelector((state: ReducerType) => state.MenuReducer)
    const { isLoading, sendLoading, isSuccessApi, hasError } = useSelector((state: ReducerType) => state.ProductOrderReducer)
    const dispatch = useDispatch<AppDispatch>()
    const [modal2, setModal2] = useState(false);
    const schema = yup
        .object()
        .shape({

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
    const [productOrderItem, setProductOrderItem] = useState([{ id: nanoid() }] as any)

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

            setProductOrderItem(() => data?.product_order_item?.map((res: any) => {
                return {
                    product: {
                        value: res?.product?.id,
                        label: res?.product?.name
                    },
                    qty: res?.qty,
                    id: res?.id
                }
            }))
        } else {
            let s = getValues(), resetObj = {};
            for (let key in getValues()) {
                resetObj = {
                    ...resetObj, [key]: ''
                }
            }
            setProductOrderItem(() => [{ id: nanoid() }])

            reset(
                resetObj
            )
        }
        if (isSuccessApi) {
            setData(() => { })
            setSelectData(() => {
                return {
                    productOrder_category_id: false
                }
            })
            setProductOrderItem(() => [{ id: nanoid() }])
            setModal(enter)
            dispatch(isProductOrderDefaultApi())
        }
    }, [modal, data, isLoading, isSuccessApi])
    const toggle = () => {
        setModal(!modal)
        setProductOrderItem(() => [{ id: nanoid() }])
        setData(() => { })
        setEnter(() => false)
        setSelectData(() => {
            return {
                productOrder_category_id: false
            }
        })
    };

    const [productOrderValue, setProductOrderValue] = useState<any>([])
    const send = (e: any) => {
        // if (id?.toString()?.length ?? 0 > 0) {
        //   dispatch(isProductOrderEdit({ query: query({ ...data, productOrder_value: JSON.stringify(productOrder_values) }, ['photo']), file: file, id: id }))
        // } else {
        //   dispatch(isProductOrderAdd({ query: query({ ...data, productOrder_value: JSON.stringify(productOrder_values) }, ['photo']), file: file }))
        // }
        let prodcut_order_item = (productOrderItem?.map((res: any) => {
            return {
                id: res?.id,
                qty: res?.qty,
                product_id: res?.product.value
            }
        }))
        if (prodcut_order_item?.length == 0) {
            alert("Maxsulotlarni tanlang!")

        } else {
            if (data?.id?.toString()?.length ?? 0 > 0) {
                dispatch(isProductOrderEdit({ query: query({ ...data, ...e, prodcut_order_item: JSON.stringify(prodcut_order_item) }), id: data?.id }))
                /////// dispatch(isCostEdit(data)) 
            } else {
                dispatch(isProductOrderAdd({ query: query({ ...data, ...e, prodcut_order_item: JSON.stringify(prodcut_order_item) }) }))
            }
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
    const { productData } = useSelector((state: ReducerType) => state.ProductReducer)
    return (
        <>
            <Loader loading={sendLoading} />
            <Modal centered={true} isOpen={modal} toggle={toggle} role='dialog' size='lg' backdrop="static" keyboard={false}>
                <form onSubmit={handleSubmit(send)} className="size_16">
                    <div className="modal-header">
                        <h5 className="modal-title" id="modalCenterTitle">{data?.id?.length > 0 ? 'Maxsulot taxrirlash ' : "Maxsulot qo'shish"}</h5>
                        <button onClick={toggle} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body">
                        <div className='' >
                            {
                                productOrderItem?.map((item: any) => {
                                    return (
                                        <div className="row my-2">
                                            <div className="col-6">
                                                <label className="form-label">Maxsulot</label>
                                                <Select
                                                    name='name3'
                                                    value={item?.product}
                                                    onChange={(e: any) => {
                                                        setProductOrderItem(productOrderItem?.map((res: any) => {
                                                            if (res?.id == item?.id) {
                                                                return {
                                                                    ...res,
                                                                    product: e
                                                                }
                                                            }
                                                            return res
                                                        }))
                                                    }}
                                                    className="basic-multi-select"
                                                    classNamePrefix="select"
                                                    required
                                                    // value={userBranch}
                                                    options={
                                                        dataSelect(
                                                            productData
                                                                ?.filter((kk: any) => {
                                                                    if (productOrderItem?.length > 0) {
                                                                        return !new Set(productOrderItem.map((res: any) => res?.product?.value)).has(kk?.id)
                                                                    }
                                                                    return true
                                                                })

                                                        )
                                                    } />
                                            </div>
                                            <div className="col-6">
                                                <label className="form-label">Soni</label>
                                                <div className="input-group">
                                                    <NumericFormat
                                                        value={item?.qty}
                                                        thousandSeparator
                                                        required
                                                        onChange={(e: any) => {

                                                            setProductOrderItem(productOrderItem?.map((res: any) => {
                                                                if (res?.id == item?.id) {
                                                                    return {
                                                                        ...res,
                                                                        qty: e.target.value.replace(/,/g, '')
                                                                    }
                                                                }
                                                                return res
                                                            }))
                                                        }
                                                        }
                                                        className='form-control'

                                                    />
                                                    <button type='button' className='btn btn-sm btn-danger'
                                                        onClick={() => {
                                                            Swal.fire({
                                                                title: "Ma'lumotni o'chirasizmi?",
                                                                showDenyButton: true,
                                                                showCancelButton: true,
                                                                confirmButtonText: 'Ha',
                                                                denyButtonText: `Yo'q`,
                                                            }).then((result) => {
                                                                if (result.isConfirmed) {
                                                                    setProductOrderItem(productOrderItem?.filter((res: any) => res?.id != item?.id))
                                                                }
                                                            })
                                                        }}>
                                                        <MdDeleteForever />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            <button className='btn btn-primary' type='button'
                                disabled={productData
                                    ?.filter((kk: any) => {
                                        if (productOrderItem?.length > 0) {
                                            return !new Set(productOrderItem.map((res: any) => res?.product?.value)).has(kk?.id)
                                        }
                                        return true
                                    })?.length == 0}
                                onClick={() => {
                                    setProductOrderItem([...productOrderItem, { id: nanoid() }])
                                }}>+</button>
                            {/* <div className="col-12 mb-1">
                         
                                <input type="hidden" {...register('productOrder_category_id')} name='productOrder_category_id' />
                                <div className="d-flex">
                                 

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
                                    {errors.productOrder_category_id?.message?.toString() || hasError?.errors?.productOrder_category_id?.toString()}
                                </ErrorInput>
                            </div> */}


                        </div>


                    </div>
                    <div className="modal-footer">
                        <button
                            onClick={() => setEnter(() => false)}
                            className="btn btn-primary" data-bs-dismiss="modal">
                            Saqlash
                        </button>

                        <button type="button" className="btn btn-danger" onClick={() => {
                            toggle()
                            setSelectData(() => {
                                return {
                                    productOrder_category_id: false
                                }
                            })
                        }
                        }>Ortga</button>
                    </div>
                </form>

            </Modal>

        </>
    )
}

export default ProductOrderAdd