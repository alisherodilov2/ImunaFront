import React, { useEffect, useRef, useState } from 'react'
// import Layout from '../layouts/Layout'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../../service/store/store';
import { query } from '../../../../componets/api/Query';
import { isProductAdd, isProductEdit, isProductDefaultApi } from '../../../../service/reducer/ProductReducer';
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
import ProductCategoryAdd from '../product-category/ProductCategoryAdd';
// import { isAddProduct, isEditProduct } from '../../service/reducer/ProductReducer';
const ProductAdd = ({ data, modal, setModal, setData = function () { }, resetItem = false }: { setData?: any, data?: any, modal?: boolean; setModal?: any, resetItem?: boolean }) => {
    const { findData } = useSelector((state: ReducerType) => state.MenuReducer)
    const { isLoading, sendLoading, isSuccessApi, hasError } = useSelector((state: ReducerType) => state.ProductReducer)
    const dispatch = useDispatch<AppDispatch>()
    const [modal2, setModal2] = useState(false);
    const schema = yup
        .object()
        .shape({
            name: yup.string().required("Nomi kiriting!"),
            product_category_id: yup.string().required("Minumal miqdori kiriting!"),
            alert_min_qty: yup.string().required("Minumal miqdori kiriting!"),
            price: yup.string().required("narxi kiriting!"),
            alert_dedline_day: yup.string().required("ogohlatirish muddatini kiriting!"),
            expiration_day: yup.string().required("Saqlash muudatini kiriting!"),
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
            let product_category_id = productCategoryData?.find((item: any) => item?.id == data?.prodcut_category.id);
            setValue('product_category_id', product_category_id?.id, {
                shouldValidate: true,
            });
            setSelectData(() => {
                return {
                    product_category_id: {
                        value: product_category_id?.id,
                        label: product_category_id?.name
                    },
                }
            })

        } else {
            let s = getValues(), resetObj = {};
            for (let key in getValues()) {
                resetObj = {
                    ...resetObj, [key]: ''
                }
            }
            setProductValue(() => [])

            reset(
                resetObj
            )
        }
        if (isSuccessApi) {
            setData(() => { })
            setSelectData(() => {
                return {
                    product_category_id: false
                }
            })
            setModal(enter)
            dispatch(isProductDefaultApi())
        }
    }, [modal, data, isLoading, isSuccessApi])
    const toggle = () => {
        setModal(!modal)
        setData(() => { })
        setEnter(() => false)
        setSelectData(() => {
            return {
                product_category_id: false
            }
        })
    };
    const [productValue, setProductValue] = useState<any>([])
    const send = (e: any) => {
        // if (id?.toString()?.length ?? 0 > 0) {
        //   dispatch(isProductEdit({ query: query({ ...data, product_value: JSON.stringify(product_values) }, ['photo']), file: file, id: id }))
        // } else {
        //   dispatch(isProductAdd({ query: query({ ...data, product_value: JSON.stringify(product_values) }, ['photo']), file: file }))
        // }
        if (data?.id?.toString()?.length ?? 0 > 0) {
            dispatch(isProductEdit({ query: query({ ...data, ...e, product_category_id: `${e.product_category_id}` }), id: data?.id }))
            /////// dispatch(isCostEdit(data)) 
        } else {
            dispatch(isProductAdd({ query: query({ ...data, ...e, product_category_id: `${e.product_category_id}` }) }))
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
    const { productCategoryData } = useSelector((state: ReducerType) => state.ProductCategoryReducer)
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
                        <div className='row' >
                            <div className="col-12 mb-1">
                                <label className="form-label">Maxsulot turi</label>
                                <input type="hidden" {...register('product_category_id')} name='product_category_id' />
                                <div className="d-flex">
                                    <div className="w-100">
                                        <Select
                                            name='name3'
                                            value={selectData?.product_category_id}
                                            onChange={(e: any) => {
                                                setSelectData({
                                                    ...selectData,
                                                    product_category_id: e
                                                })

                                                setValue('product_category_id', e.value, {
                                                    shouldValidate: true,
                                                });
                                            }}
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                            // value={userBranch}
                                            options={
                                                dataSelect(productCategoryData)
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
                                    {errors.product_category_id?.message?.toString() || hasError?.errors?.product_category_id?.toString()}
                                </ErrorInput>
                            </div>
                            <div className="col-12 mb-1">
                                <label className="form-label"> Nomi</label>
                                <Input type="text" placeholder="Nomi"  {...register('name')} name='name'
                                    error={errors.name?.message?.toString() || hasError?.errors?.name?.toString()}
                                />

                            </div>
                            <div className="col-12 mb-1">
                                <label className="form-label">Narxi</label>
                                <NumericFormat
                                    value={getValues('price')}
                                    thousandSeparator
                                    required
                                    onChange={(e: any) => {
                                        setValue('price', e.target.value.replace(/,/g, ''), {
                                            shouldValidate: true
                                        })
                                    }
                                    }
                                    className='form-control'

                                />
                                <ErrorInput>
                                    {errors.price?.message?.toString() || hasError?.errors?.price?.toString()}
                                </ErrorInput>
                            </div>
                            <div className="col-12 mb-1">
                                <label className="form-label">Minum</label>
                                <NumericFormat
                                    value={getValues('alert_min_qty')}
                                    thousandSeparator
                                    required
                                    onChange={(e: any) => {
                                        setValue('alert_min_qty', e.target.value.replace(/,/g, ''), {
                                            shouldValidate: true
                                        })
                                    }
                                    }
                                    className='form-control'

                                />
                                <ErrorInput>
                                    {errors.alert_min_qty?.message?.toString() || hasError?.errors?.alert_min_qty?.toString()}
                                </ErrorInput>
                            </div>
                            <div className="col-12 mb-1">
                                <label className="form-label">Saqlash muddati</label>
                                <NumericFormat
                                    value={getValues('expiration_day')}
                                    thousandSeparator
                                    required
                                    onChange={(e: any) => {
                                        setValue('expiration_day', e.target.value.replace(/,/g, ''), {
                                            shouldValidate: true
                                        })
                                    }
                                    }
                                    className='form-control'

                                />
                                <ErrorInput>
                                    {errors.expiration_day?.message?.toString() || hasError?.errors?.expiration_day?.toString()}
                                </ErrorInput>
                            </div>
                            <div className="col-12 mb-1">
                                <label className="form-label">muddat statusi</label>
                                <NumericFormat
                                    value={getValues('alert_dedline_day')}
                                    thousandSeparator
                                    required
                                    onChange={(e: any) => {
                                        setValue('alert_dedline_day', e.target.value.replace(/,/g, ''), {
                                            shouldValidate: true
                                        })
                                    }
                                    }
                                    className='form-control '

                                />
                                <ErrorInput>
                                    {errors.alert_dedline_day?.message?.toString() || hasError?.errors?.alert_dedline_day?.toString()}
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

                        <button type="button" className="btn btn-danger" onClick={() => {
                            toggle()
                            setSelectData(() => {
                                return {
                                    product_category_id: false
                                }
                            })
                        }
                        }>Ortga</button>
                    </div>
                </form>

            </Modal>
            <ProductCategoryAdd
                modal={modal2} setModal={setModal2}
            />
        </>
    )
}

export default ProductAdd