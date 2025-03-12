import React, { useEffect, useState } from 'react'
// import Layout from '../layouts/Layout'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { useForm } from "react-hook-form";
import * as yup from "yup";
import Select from 'react-select';
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../service/store/store';
import { query } from '../../componets/api/Query';
import { isOrderAdd, isOrderEdit, isOrderDefaultApi } from '../../service/reducer/OrderReducer';
import { ReducerType } from '../../interface/interface';
import Loader from '../../componets/api/Loader';
import { isFindFunction } from '../../service/reducer/MenuReducer';
import Input from '../../componets/inputs/Input';
import { NumericFormat, PatternFormat } from 'react-number-format';
import ErrorInput from '../../componets/inputs/ErrorInput';
import CustomerAdd from '../custmer/CustomerAdd';
// import { isAddOrder, isEditOrder } from '../../service/reducer/OrderReducer';
const OrderAdd = ({ data, modal, setModal, setData = function () { }, resetItem = false }: { setData?: any, data?: any, modal?: boolean; setModal?: any, resetItem?: boolean }) => {
    const { customerData } = useSelector((state: ReducerType) => state.CustomerReducer)
    const dataSelect = (data: any) => {
        let res= [...data].sort((a: any, b: any) => b.id - a.id);
        return res?.map((item: any) => {
            return {
                value: item?.id, label: item?.full_name,
                data: item
            }
        })
    }
    const [modal2, setModal2] = useState(false)
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
    const { isLoading, sendLoading, isSuccessApi, hasError } = useSelector((state: ReducerType) => state.OrderReducer)
    const dispatch = useDispatch<AppDispatch>()
    const schema = yup
        .object()
        .shape({
            full_name: yup.string().required("MIJOZ kiriting!"),
            // phone: yup.string().required("Telefon kiriting!")
            //     // .test(
            //     //     'valid-format',
            //     //     'Phone number must start with 998',
            //     //     (val: any) => val && val.replace(/[^\d]/g, '').startsWith('998')
            //     // )
            //     .test(
            //         'valid-length',
            //         'Phone number must have exactly 9 digits after the country code',
            //         (val: any) => {
            //             const phoneNumber = val && val.replace(/[^\d]/g, ''); // Remove non-numeric characters
            //             return phoneNumber && phoneNumber.slice(3).length === 9; // Check if digits after '998' are exactly 9
            //         }
            //     )
            // ,
            qty: yup.string().required("Kamera soni kiriting!"),
            price: yup.string().required("narx kiriting!"),
            master_salary: yup.string().required("usta hizmat haqini kiriting!"),
            address: yup.string().required("manzilni kiriting!"),
            target_adress: yup.string().required("Moljal kiriting!"),
            warranty_period_quantity: yup.string().required("Kafolat muddati kiriting!"),
            warranty_period_type: yup.string().required("Kafolat muddati kiriting!"),
            comment: yup.string().required("Izoh kiriting!"),
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
            let customer = customerData?.find((item: any) => item?.id == data?.customer_id);
            console.log(customer);

            setSelectData(() => {
                return {
                    customer_id: {
                        value: customer?.id,
                        label: customer?.full_name
                    }
                }
            })
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
            setSelectData(() => {
                return {
                    customer_id: false
                }
            });
        }
        if (isSuccessApi) {
            setData(() => { })
            setModal(enter)
            dispatch(isOrderDefaultApi())
            setSelectData(() => {
                return {
                    customer_id: false
                }
            });
        }
    }, [modal, data, isLoading, isSuccessApi])
    const toggle = () => {
        setModal(!modal)
        setEnter(() => false)
        setSelectData(() => {
            return {
                customer_id: false
            }
        });
    };
    const send = (e: any) => {
        // if (id?.toString()?.length ?? 0 > 0) {
        //   dispatch(isProductEdit({ query: query({ ...data, product_value: JSON.stringify(product_values) }, ['photo']), file: file, id: id }))
        // } else {
        //   dispatch(isProductAdd({ query: query({ ...data, product_value: JSON.stringify(product_values) }, ['photo']), file: file }))
        // }
        if (data?.id?.toString()?.length ?? 0 > 0) {
            dispatch(isOrderEdit({ query: query({ ...data, ...e, customer_id: `${e.customer_id}`, type: 'is_edit', phone: e.phone.replace(/[^\d]/g, ''), }), id: data?.id }))
            setSelectData(() => {
                return {
                    customer_id: false
                }
            });
            /////// dispatch(isCostEdit(data)) 
        } else {
            dispatch(isOrderAdd({ query: query({ ...data, ...e, customer_id: `${e.customer_id}`, phone: e.phone.replace(/[^\d]/g, ''), }) }))
            setSelectData(() => {
                return {
                    customer_id: false
                }
            });
        }
    }



    return (
        <>
            <Loader loading={sendLoading} />
            <Modal centered={true} isOpen={modal} toggle={toggle} role='dialog' size='xl' backdrop="static" keyboard={false} >
                <form onSubmit={handleSubmit(send)} className="size_16">
                    <div className="modal-header">
                        <h5 className="modal-title" id="modalCenterTitle">{data?.id ? 'Buyurtma tahrirlash' : "Buyurtma qo'shish"}</h5>
                        <button onClick={toggle} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body">
                        <div className='row' >
                            <div className="col-6 mb-2">
                                <label className="form-label">Mijoz</label>
                                <div className="d-flex">
                                    <div className="w-100">
                                    <input type="hidden" {...register('customer_id')} name='customer_id' />

                                        <Select
                                            isDisabled={data?.id ? true : false}
                                            name='name3'
                                            value={selectData?.customer_id}
                                            onChange={(e: any) => {
                                                setSelectData({
                                                    ...selectData,
                                                    customer_id: e
                                                })
                                                for (let key in e.data) {
                                                    setValue(key, e.data[key], {
                                                        shouldValidate: true,
                                                    });

                                                }
                                                setValue('customer_id', e.value, {
                                                    shouldValidate: true,
                                                });
                                            }}
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                            // value={userBranch}
                                            options={
                                                dataSelect(customerData)
                                            } />
                                    </div>
                                    <Button
                                        id="popoverButton" type="button"
                                        onClick={() => {
                                            setModal2(() => true)
                                        }}
                                        // onFocus={togglePopover}
                                        className="btn btn-icon btn-primary input-group-text">
                                        <span className="tf-icons bx bx-plus" />
                                    </Button>
                                </div>
                                <ErrorInput>
                                    {errors.full_name?.message?.toString() || hasError?.errors?.full_name?.toString()}
                                </ErrorInput>

                            </div>

                            <div className="col-6 mb-1">
                                <label className="form-label">Telefon</label>
                                {/* <Input type="number" placeholder="Telefon raqam kiriting"  {...register('phone')} name='phone'
                                    error={errors.phone?.message?.toString() || hasError?.errors?.phone?.toString()}
                                /> */}
                                <input type="hidden" {...register('phone')} name='phone' />
                                <PatternFormat
                                    disabled
                                    format="+998 (##) ###-##-##"
                                    mask="_"
                                    value={getValues('phone')}
                                    allowEmptyFormatting
                                    className='form-control'
                                    placeholder="+998 (___) ___-____"
                                    onChange={(e: any) => {
                                        setValue('phone', e.target.value, {
                                            shouldValidate: true,
                                        });
                                    }}
                                />
                                <ErrorInput>
                                    {errors.phone?.message?.toString() || hasError?.errors?.phone?.toString()}
                                </ErrorInput>

                            </div>
                            <div className="col-2 mb-1">
                                <label className="form-label">Kamera soni</label>
                                <input type="hidden"
                                    {...register('qty')} name='qty'

                                />
                                <NumericFormat

                                    value={getValues('qty')}
                                    // prefix="Uzs"
                                    thousandSeparator
                                    onChange={(e: any) => {
                                        setValue('qty', e.target.value.replace(/,/g, ''), {
                                            shouldValidate: true,
                                        });

                                    }}
                                    className='form-control'
                                />
                                <ErrorInput>
                                    {errors.qty?.message?.toString() || hasError?.errors?.qty?.toString()}
                                </ErrorInput>


                            </div>
                            <div className="col-3 mb-1">
                                <label className="form-label">Jami</label>
                                <input type="hidden"
                                    {...register('price')} name='price'

                                />

                                <NumericFormat

                                    value={getValues('price')}
                                    // prefix="Uzs"
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
                            <div className="col-3 mb-1">
                                <label className="form-label">usta hizmati</label>
                                <input type="hidden"
                                    {...register('master_salary')} name='master_salary'

                                />
                                <NumericFormat

                                    value={getValues('master_salary')}
                                    // prefix="Uzs"
                                    thousandSeparator
                                    onChange={(e: any) => {
                                        setValue('master_salary', e.target.value.replace(/,/g, ''), {
                                            shouldValidate: true,
                                        });

                                    }}
                                    className='form-control'
                                />
                                <ErrorInput>
                                    {errors.master_salary?.message?.toString() || hasError?.errors?.master_salary?.toString()}
                                </ErrorInput>

                            </div>
                            <div className="col-2 mb-1">
                                <label className="form-label">Usta hizmati jami</label>
                                <NumericFormat
                                    disabled
                                    value={(getValues('master_salary') * getValues('qty')) || 0}
                                    // prefix="Uzs"
                                    thousandSeparator

                                    className='form-control'
                                />
                                <ErrorInput>
                                    {errors.master_salary?.message?.toString() || hasError?.errors?.master_salary?.toString()}
                                </ErrorInput>

                            </div>
                            <div className="col-2 mb-1">
                                <label className="form-label">Kafolat muddati</label>
                                <input type="hidden"
                                    {...register('warranty_period_quantity')} name='warranty_period_quantity'

                                />
                                <div className="input-group border-danger">

                                    <NumericFormat

                                        value={getValues('warranty_period_quantity')}
                                        // prefix="Uzs"
                                        thousandSeparator
                                        onChange={(e: any) => {
                                            setValue('warranty_period_quantity', e.target.value.replace(/,/g, ''), {
                                                shouldValidate: true,
                                            });

                                        }}
                                        className='form-control'
                                    />

                                    <select className="form-select"
                                        {...register('warranty_period_type')} name='warranty_period_type'
                                        id="inputGroupSelect01">
                                        {/* <option selected>tanlang</option> */}
                                        {
                                            // dedlineData?.map((item: any) => (
                                            //     <option key={nanoid()} value={item?.value}>{item?.label}</option>
                                            //     ))
                                        }
                                        {/* <option value='day'>Kun</option>
                                        <option value='week'>Hafta</option>
                                        <option value='month'>Oy</option> */}
                                        <option value='month'>Oy</option>
                                        <option value='year'>Yil</option>
                                    </select>
                                </div>
                                <ErrorInput>
                                    {errors.warranty_period_quantity?.message?.toString() || hasError?.errors?.warranty_period_quantity?.toString()}
                                </ErrorInput>


                            </div>
                            <div className="col-12 mb-1">
                                <label className="form-label">Izoh kiriting</label>
                                <textarea className={`form-control ${errors.comment?.message?.toString() || hasError?.comment?.address?.toString() ? 'border-danger' : ''}`} placeholder="Izoh kiriting"  {...register('comment')} name='comment'
                                ></textarea>

                                <ErrorInput>
                                    {errors.comment?.message?.toString() || hasError?.errors?.comment?.toString()}
                                </ErrorInput>
                            </div>
                            <div className="col-12 mb-1">
                                <label className="form-label">Manzilni kiriting</label>
                                <Input type="text" placeholder="Manzilni kiriting"  {...register('address')} name='address'
                                    disabled={true}
                                    error={errors.address?.message?.toString() || hasError?.errors?.address?.toString()}
                                />
                            </div>
                            <div className="col-12 mb-1">
                                <label className="form-label">Mo'ljal  kiriting</label>
                                <Input type="text" placeholder="Mo'ljal  kiriting"  {...register('target_adress')} name='target_adress'
                                    disabled={true}
                                    error={errors.target_adress?.message?.toString() || hasError?.errors?.target_adress?.toString()}
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
            <CustomerAdd
                modal={modal2} setModal={setModal2}
            />
        </>
    )
}

export default OrderAdd