import React, { useEffect, useRef, useState } from 'react'
// import Layout from 'layouts/Layout'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../service/store/store';
import { query } from '../../../componets/api/Query';
import { isExpenseAdd, isExpenseEdit, isExpenseDefaultApi } from '../../../service/reducer/ExpenseReducer';
import { ReducerType } from '../../../interface/interface';
import Loader from '../../../componets/api/Loader';
import { isFindFunction } from '../../../service/reducer/MenuReducer';
import Input from '../../../componets/inputs/Input';
import { NumericFormat, PatternFormat } from 'react-number-format';
import ErrorInput from '../../../componets/inputs/ErrorInput';
import axios from 'axios';
import { MdDeleteForever } from 'react-icons/md';
import Swal from 'sweetalert2';
import { json } from 'react-router-dom';
import ExpenseTypeAdd from '../expense-type/ExpenseTypeAdd';
// import { isAddExpense, isEditExpense } from '../service/reducer/ExpenseReducer';
export const pay_type = [
    {
        label: 'Naqd',
        value: 'cash',
        key: 'cash',
        price: 0
    },
    {
        label: 'plastik',
        value: 'card',
        key: 'card',
        price: 0
    },
    {
        label: "o'tkazma",
        value: 'transfer',
        key: 'transfer',
        price: 0
    },
]
const ExpenseAdd = ({ data, modal, setModal, setData = function () { }, resetItem = false }: { setData?: any, data?: any, modal?: boolean; setModal?: any, resetItem?: boolean }) => {
    const { findData } = useSelector((state: ReducerType) => state.MenuReducer)
    const { isLoading, sendLoading, isSuccessApi, hasError } = useSelector((state: ReducerType) => state.ExpenseReducer)
    const dispatch = useDispatch<AppDispatch>()
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
    const schema = yup
        .object()
        .shape({
            price: yup.string().required("Narx kiriting!"),
            expense_type_id: yup.string().required("Xizmat turini kiriting!"),
            pay_type: yup.string().required("To'lov turini kiriting!"),
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
    const [modal2, setModal2] = useState(false)
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
            let expense_type_id = expenseTypeData?.find((item: any) => item?.id == data?.expense_type.id);
            setValue('expense_type_id', expense_type_id?.id, {
                shouldValidate: true,
            });
            setSelectData(() => {
                return {
                    expense_type_id: {
                        value: expense_type_id?.id,
                        label: expense_type_id?.name
                    },
                    pay_type: pay_type.find((item: any) => item?.value == data?.pay_type)
                }
            })


        } else {
            let s = getValues(), resetObj = {};
            for (let key in getValues()) {
                resetObj = {
                    ...resetObj, [key]: ''
                }
            }
            setSelectData(() => {
                return {
                    expense_type_id: false,
                    pay_type: false
                }
            })
            setExpenseValue(() => [])

            reset(
                resetObj
            )
        }
        if (isSuccessApi) {
            setData(() => { })
            setModal(enter)
            dispatch(isExpenseDefaultApi())
        }
    }, [modal, data, isLoading, isSuccessApi])
    const toggle = () => {
        setModal(!modal)
        setEnter(() => false)
        setSelectData(() => {
            return {
                expense_type_id: false,
                pay_type: false
            }
        })
    };
    const [expenseValue, setExpenseValue] = useState<any>([])
    const send = (e: any) => {
        // if (id?.toString()?.length ?? 0 > 0) {
        //   dispatch(isProductEdit({ query: query({ ...data, product_value: JSON.stringify(product_values) }, ['photo']), file: file, id: id }))
        // } else {
        //   dispatch(isProductAdd({ query: query({ ...data, product_value: JSON.stringify(product_values) }, ['photo']), file: file }))
        // }
        if (data?.id?.toString()?.length ?? 0 > 0) {
            dispatch(isExpenseEdit({ query: query({ ...data, ...e, expense_type_id: `${selectData?.expense_type_id?.value}` }), id: data?.id }))
            /////// dispatch(isCostEdit(data)) 
        } else {
            dispatch(isExpenseAdd({ query: query({ ...data, ...e, expense_type_id: `${selectData?.expense_type_id?.value}` }) }))
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
    const { expenseTypeData } = useSelector((state: ReducerType) => state.ExpenseTypeReducer)

    return (
        <>
            <Loader loading={sendLoading} />
            <Modal centered={true} isOpen={modal} toggle={toggle} role='dialog' size='lg' backdrop="static" keyboard={false}>
                <form onSubmit={handleSubmit(send)} className="size_16">
                    <div className="modal-header">
                        <h5 className="modal-title" id="modalCenterTitle">{data?.id > 0 ? 'Xarajat ' : "Xarajat qo'shish"}</h5>
                        <button onClick={toggle} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body">
                        <div className='row' >
                            <div className="col-12 mb-1">
                                <label className="form-label">Xizmat turi</label>
                                <input type="hidden" {...register('expense_type_id')} name='expense_type_id' />
                                <div className="d-flex">
                                    <div className="w-100">
                                        <Select
                                            name='name3'
                                            value={selectData?.expense_type_id}
                                            onChange={(e: any) => {
                                                setSelectData({
                                                    ...selectData,
                                                    expense_type_id: e
                                                })

                                                setValue('expense_type_id', e.value, {
                                                    shouldValidate: true,
                                                });
                                            }}
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                            // value={userBranch}
                                            options={
                                                dataSelect(expenseTypeData)
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
                                    {errors.expense_type_id?.message?.toString() || hasError?.errors?.expense_type_id?.toString()}
                                </ErrorInput>
                            </div>
                            <div className="col-12 mb-1">
                                <label className="form-label">To'lov turi</label>
                                <input type="hidden" {...register('pay_type')} name='pay_type' />
                                <div className="d-flex">
                                    <div className="w-100">
                                        <Select
                                            name='name3'
                                            value={selectData?.pay_type}
                                            onChange={(e: any) => {
                                                setSelectData({
                                                    ...selectData,
                                                    pay_type: e
                                                })

                                                setValue('pay_type', e.value, {
                                                    shouldValidate: true,
                                                });
                                            }}
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                            // value={userBranch}
                                            options={
                                                pay_type
                                            } />

                                    </div>

                                </div>
                                <ErrorInput>
                                    {errors.pay_type?.message?.toString() || hasError?.errors?.pay_type?.toString()}
                                </ErrorInput>
                            </div>
                            <div className="col-12 mb-1">
                                <label className="form-label">Narxi</label>
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
            <ExpenseTypeAdd
                modal={modal2} setModal={setModal2}
            />
        </>
    )
}

export default ExpenseAdd