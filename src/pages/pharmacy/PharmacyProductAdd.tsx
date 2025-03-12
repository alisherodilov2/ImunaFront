import React, { useEffect, useRef, useState } from 'react'
// import Layout from '../layouts/Layout'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../service/store/store';
import { query } from '../../componets/api/Query';
import { isPharmacyProductAdd, isPharmacyProductEdit, isPharmacyProductDefaultApi } from '../../service/reducer/PharmacyProductReducer';
import { ReducerType } from '../../interface/interface';
import Loader from '../../componets/api/Loader';
import { isFindFunction } from '../../service/reducer/MenuReducer';
import Input from '../../componets/inputs/Input';
import { NumericFormat, PatternFormat } from 'react-number-format';
import ErrorInput from '../../componets/inputs/ErrorInput';
import axios from 'axios';
import { MdDeleteForever } from 'react-icons/md';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { json } from 'react-router-dom';
import { addDays } from '../../helper/productHelper';
// import { isAddPharmacyProduct, isEditPharmacyProduct } from'service/reducer/PharmacyProductReducer';
const PharmacyProductAdd = ({ data, modal, setModal, setData = function () { }, resetItem = false, is_home = false, product_id = 0 }: { product_id?: any, is_home?: any, setData?: any, data?: any, modal?: boolean; setModal?: any, resetItem?: boolean }) => {
    const { findData } = useSelector((state: ReducerType) => state.MenuReducer)
    const { user } = useSelector((state: ReducerType) => state.ProfileReducer)
    const { productCategoryData } = useSelector((state: ReducerType) => state.ProductCategoryReducer)
    const { productData,
    } = useSelector((state: ReducerType) => state.ProductReducer)
    const [modal2, setModal2] = useState(false);
    const [modal3, setModal3] = useState(false);
    const { isLoading, sendLoading, isSuccessApi, hasError } = useSelector((state: ReducerType) => state.PharmacyProductReducer)
    const dispatch = useDispatch<AppDispatch>()
    const schema = yup
        .object()
        .shape({
            price: yup.string().required("Narxini kiriting!"),
            qty: yup.string().required("Miqdorini kiriting!"),
            // product_category_id: yup.string().required("Kategoriyani kiriting!"),
            product_id: yup.string().required("Maxsulot kiriting!"),

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
        if (product_id > 0) {
            let findProduct = productData?.find((item: any) => item?.id === +product_id)
            setSelectData({
                product_id: {
                    value: findProduct?.id,
                    label: findProduct?.name,
                    data: findProduct,
                },
                product_category_id: false
            })
            setValue('product_id', findProduct?.id, {
                shouldValidate: true
            })
        }
        if (Object.keys(data ?? {})?.length > 0) {

            for (let key in data) {
                setValue(key, data?.[key as string], {
                    shouldValidate: true,
                });

                // extraFuntion(data?.[key], key)
            }
            if(product_id==0){
                setSelectData({
                    product_id: {
                        value: data?.prodcut?.id,
                        label: data?.prodcut?.name,
                        data: data?.prodcut,
                    },
                    product_category_id: false
                })
                setValue('product_id', data?.prodcut?.id, {
                    shouldValidate: true
                })
            }
           
            setPharmacyProductValue(() => data?.pharmacyProduct_value)


        } else {
            let s = getValues(), resetObj = {};
            for (let key in getValues()) {
                resetObj = {
                    ...resetObj, [key]: ''
                }
            }
            setPharmacyProductValue(() => [])

            reset(
                resetObj
            )
        }
        if (isSuccessApi) {
            setData(() => { })
            setModal(enter)
            setSelectData({
                product_id: false,
                product_category_id: false
            })
            dispatch(isPharmacyProductDefaultApi())
        }
    }, [modal, data, isLoading, isSuccessApi])
    const toggle = () => {
        setModal(!modal)
        setEnter(() => false)
        setSelectData({
            product_id: false,
            product_category_id: false
        })
    };
    const [pharmacyProductValue, setPharmacyProductValue] = useState<any>([])
    const send = (e: any) => {
        // if (id?.toString()?.length ?? 0 > 0) {
        //   dispatch(isProductEdit({ query: query({ ...data, product_value: JSON.stringify(product_values) }, ['photo']), file: file, id: id }))
        // } else {
        //   dispatch(isProductAdd({ query: query({ ...data, product_value: JSON.stringify(product_values) }, ['photo']), file: file }))
        // }
        if (data?.id?.toString()?.length ?? 0 > 0) {
            dispatch(isPharmacyProductEdit({ query: query({ ...data, ...e, product_category_id: `${e.product_category_id}`, product_id: `${e.product_id}` }), id: data?.id }))
            /////// dispatch(isCostEdit(data)) 
        } else {
            dispatch(isPharmacyProductAdd({ query: query({ ...data, ...e, product_category_id: `${e.product_category_id}`, product_id: `${e.product_id}`, is_home: is_home ? '1' : '0' }) }))
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
    return (
        <>
            <Loader loading={sendLoading} />
            <Modal centered={true} isOpen={modal} toggle={toggle} role='dialog' size='lg' backdrop="static" keyboard={false}>
                <form onSubmit={handleSubmit(send)} className="size_16">
                    <div className="modal-header">
                        <h5 className="modal-title" id="modalCenterTitle">Maxsulot qabul qilish</h5>
                        <button onClick={toggle} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body">
                        <div className='row' >
                            {/* <div className="col-12 mb-1">
                                <label className="form-label">Maxsulot turi</label>
                                <input type="hidden" {...register('product_category_id')} name='product_category_id' />
                                <div className="d-flex">
                                    <div className="w-100">
                                        <Select
                                            required
                                            name='name3'
                                            value={selectData?.product_category_id}
                                            onChange={(e: any) => {
                                                setSelectData({
                                                    ...selectData,
                                                    product_category_id: e,
                                                    product_id: false
                                                })

                                                setValue('product_category_id', e.value, {
                                                    shouldValidate: true,
                                                });


                                                // setSelectData({
                                                //     ...selectData,
                                                //     product_id: {
                                                //         value: '',
                                                //         label: ''
                                                //     }
                                                // })

                                                setValue('product_id', 0, {
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
                            </div> */}
                            <div className="col-12 mb-1">
                                <label className="form-label">Maxsulot</label>
                                <input type="hidden" {...register('product_id')} name='product_id' />
                                <div className="d-flex">
                                    <div className="w-100">
                                        <Select
                                            required
                                            isDisabled={product_id>0}
                                            name='name3'
                                            value={selectData?.product_id}
                                            onChange={(e: any) => {
                                                setSelectData({
                                                    ...selectData,
                                                    product_id: e,

                                                })
                                                setValue('expiration_date', addDays(user?.graph_format_date, e?.data?.expiration_day), {
                                                    shouldValidate: true
                                                })

                                                setValue('product_id', e.value, {
                                                    shouldValidate: true,
                                                });
                                            }}
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                            // value={userBranch}
                                            options={
                                                dataSelect(productData)
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
                                    {errors.product_id?.message?.toString() || hasError?.errors?.product_id?.toString()}
                                </ErrorInput>
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
                                <label className="form-label">Miqdori</label>
                                <NumericFormat
                                    value={getValues('qty')}
                                    thousandSeparator
                                    required
                                    onChange={(e: any) => {
                                        setValue('qty', e.target.value.replace(/,/g, ''), {
                                            shouldValidate: true
                                        })
                                    }
                                    }
                                    className='form-control'

                                />
                                <ErrorInput>
                                    {errors.qty?.message?.toString() || hasError?.errors?.qty?.toString()}
                                </ErrorInput>
                            </div>
                            <div className="col-12 mb-1">
                                <label className="form-label"> Muddati</label>
                                <Input required type="date" placeholder="Nomi" readOnly  {...register('expiration_date')} name='expiration_date'
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

export default PharmacyProductAdd