import React, { useEffect, useRef, useState } from 'react'
// import Layout from '../layouts/Layout'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../service/store/store';
import { query, queryObj } from '../../../componets/api/Query';
import { isTemplateAdd, isTemplateEdit, isTemplateDefaultApi } from '../../../service/reducer/TemplateReducer';
import { ReducerType } from '../../../interface/interface';
import Loader from '../../../componets/api/Loader';
import { isFindFunction } from '../../../service/reducer/MenuReducer';
import Input from '../../../componets/inputs/Input';
import { NumericFormat, PatternFormat } from 'react-number-format';
import ErrorInput from '../../../componets/inputs/ErrorInput';
import axios from 'axios';
import { MdDeleteForever } from 'react-icons/md';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { json } from 'react-router-dom';
import { nanoid } from '@reduxjs/toolkit';
// import { isAddTemplate, isEditTemplate } from '../../service/reducer/TemplateReducer';
export const template_type = [
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'select', label: 'Select' },
]
const TemplateAdd = ({ data, modal, setModal, setData = function () { }, resetItem = false }: { setData?: any, data?: any, modal?: boolean; setModal?: any, resetItem?: boolean }) => {
    const { findData } = useSelector((state: ReducerType) => state.MenuReducer)
    const { isLoading, sendLoading, isSuccessApi, hasError } = useSelector((state: ReducerType) => state.TemplateReducer)
    const dispatch = useDispatch<AppDispatch>()
    const schema = yup
        .object()
        .shape({
            name: yup.string().required("Shablon nomi kiriting!"),
            type: yup.string().required("Bo'lim qavati kiriting!"),
            is_photo: yup.string().nullable(),
            is_comment: yup.string().nullable(),
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
    const { templateCategoryData } = useSelector((state: ReducerType) => state.TemplateCategoryReducer)
    const dataSelect = (data: any) => {
        let res = [...data];
        return res?.map((item: any) => {
            return {
                value: item?.id, label: item?.name,
                data: item
            }
        })
    }
    const [enter, setEnter] = useState(false);
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
    const [checkbox, setCheckbox] = useState({
        is_comment: false,
        is_photo: false
    })
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
                if (key == 'type') {
                    setSelectData({
                        type: template_type?.find((item: any) => item?.value == data?.[key as string])
                    })
                }
                setValue(key, data?.[key as string], {
                    shouldValidate: true,
                });

                // extraFuntion(data?.[key], key)
            }
            setCheckbox(
                {
                    is_comment: +data?.is_comment ? true : false,
                    is_photo: +data?.is_photo ? true : false,
                }
            )

            setTemplateValue(() => data?.template_item?.map((res: any) => {
                return {
                    template_category_id: {
                        value: res?.template_category?.id,
                        label: res?.template_category?.name
                    },
                    id: res?.id,
                    is_comment: +res?.is_comment ? true : false,
                    value_1: res?.value_1 ?? '-',
                    value_2: res?.value_2 ?? '-',
                    value_3: res?.value_3 ?? '-',
                }
            }))


        } else {
            let s = getValues(), resetObj = {};
            for (let key in getValues()) {
                resetObj = {
                    ...resetObj, [key]: ''
                }
            }
            setTemplateValue(() => [])

            reset(
                resetObj
            )
        }
        if (isSuccessApi) {
            setData(() => { })
            setModal(enter)
            dispatch(isTemplateDefaultApi())
            setCheckbox(
                {
                    is_comment: false,
                    is_photo: false,
                }
            )
        }
    }, [modal, data, isLoading, isSuccessApi])
    const toggle = () => {
        setModal(!modal)
        setEnter(() => false)
        setCheckbox(
            {
                is_comment: false,
                is_photo: false,
            }
        )
    };
    const [templateValue, setTemplateValue] = useState<any>([])
    const send = (e: any) => {
        console.log(e, e);

        // if (id?.toString()?.length ?? 0 > 0) {
        //   dispatch(isProductEdit({ query: query({ ...data, product_value: JSON.stringify(product_values) }, ['photo']), file: file, id: id }))
        // } else {
        //   dispatch(isProductAdd({ query: query({ ...data, product_value: JSON.stringify(product_values) }, ['photo']), file: file }))
        // }
        if (data?.id?.toString()?.length ?? 0 > 0) {
            dispatch(isTemplateEdit({
                query: queryObj({
                    is_comment: `${+e?.is_comment ? '1' : '0'}`,
                    is_photo: `${+e?.is_photo ? '1' : '0'}`,
                    ...data, ...e, template_item: JSON.stringify(templateValue?.map((res: any) => {
                        return {
                            id: res?.id ?? 0,
                            is_comment: res?.is_comment ? '1' : "0", 
                            template_category_id: res?.template_category_id.value,
                            value_1: res?.value_1 ?? '-',
                            value_2: res?.value_2 ?? '-',
                            value_3: res?.value_3 ?? '-',
                        }
                    }
                    ))

                }), id: data?.id
            }))
            /////// dispatch(isCostEdit(data)) 
        } else {
            dispatch(isTemplateAdd({
                query: queryObj({
                    ...data, ...e,
                    is_comment: `${e?.is_comment ? '1' : '0'}`,
                    is_photo: `${e?.is_photo ? 1 : 0}`,
                    template_item: JSON.stringify(templateValue?.map((res: any) => {
                        return {
                            id: res?.id ?? 0,
                            is_comment: res?.is_comment ? '1' : "0", 
                            template_category_id: res?.template_category_id.value,
                            value_1: res?.value_1 ?? '-',
                            value_2: res?.value_2 ?? '-',
                            value_3: res?.value_3 ?? '-',
                        }
                    }
                    ))
                })
            }))
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
            <Modal centered={true} isOpen={modal} toggle={toggle} role='dialog' size='xl' backdrop="static" keyboard={false}>
                <form onSubmit={handleSubmit(send)} className="size_16">
                    <div className="modal-header">
                        <h5 className="modal-title" id="modalCenterTitle">{data?.id?.length > 0 ? 'Bo`lim ' : "Bo`lim qo'shish"}</h5>
                        <button onClick={toggle} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body">
                        <div className='row' >
                            <div className="col-6 mb-1">
                                <label className="form-label">Shablon nomi</label>
                                <Input type="text" placeholder="Shablon nomi"  {...register('name')} name='name'
                                    error={errors.name?.message?.toString() || hasError?.errors?.name?.toString()}
                                />
                            </div>
                            <div className="col-6 mb-1">
                                <label className="form-label">Shahblon turi</label>
                                <input type="hidden" {...register('type')} name='type' />
                                <div className="d-flex">
                                    <div className="w-100">
                                        <Select
                                            name='name3'
                                            value={selectData?.type}
                                            onChange={(e: any) => {
                                                setSelectData({
                                                    ...selectData,
                                                    type: e
                                                })

                                                setValue('type', e.value, {
                                                    shouldValidate: true,
                                                });
                                            }}
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                            // value={userBranch}
                                            options={
                                                // dataSelect(departmentData)
                                                template_type
                                            } />
                                    </div>
                                    {/* <button
                                        type="button"
                                        onClick={() => {
                                            setModal2(() => true)
                                        }}
                                        // onFocus={togglePopover}
                                        className="btn btn-icon btn-primary input-group-text">
                                        <span className="tf-icons bx bx-plus" />
                                    </button> */}
                                </div>
                                <ErrorInput>
                                    {errors.type?.message?.toString() || hasError?.errors?.type?.toString()}
                                </ErrorInput>
                            </div>
                            {
                                getValues('type') === 'select' &&
                                <div className="col-12 d-flex gap-2 align-items-center my-1">
                                    <div className='d-flex gap-2 align-items-center'>
                                        <label htmlFor="rasmli">Rasmli</label>
                                        <div className="form-check ">
                                            <input className="form-check-input float-end" type="checkbox" role="switch"
                                                checked={+checkbox?.is_photo ? true : false}
                                                onChange={(e: any) => {
                                                    console.log(+e.target.checked);
                                                    setCheckbox({
                                                        ...checkbox,
                                                        is_photo: e.target.checked
                                                    })
                                                    setValue('is_photo', e.target.checked ? 1 : 0, {
                                                        shouldValidate: false,
                                                    })

                                                }}

                                            />
                                        </div>


                                    </div>
                                    <div className='d-flex gap-2 align-items-center'>
                                        <label htmlFor="Izoh">Izoh</label>
                                        <div className="form-check ">
                                            <input className="form-check-input"
                                                checked={+checkbox?.is_comment ? true : false}
                                                onChange={(e: any) => {
                                                    console.log(+e.target.checked);
                                                    setCheckbox({
                                                        ...checkbox,
                                                        is_comment: e.target.checked
                                                    })
                                                    setValue('is_comment', e.target.checked ? 1 : 0, {
                                                        shouldValidate: false,
                                                    })

                                                }}
                                                type="checkbox" id="Izoh" />
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>

                        <button className='btn btn-primary btn-sm' onClick={() => {
                            setTemplateValue([...templateValue, {
                                room_type: '',
                                room_number: '',
                                id: nanoid()
                            }])
                            setTimeout(() => {
                                scrollToBottom();
                            }, 100);
                        }} type='button' >Qo'shimcha xona</button>
                        <div
                            // ref={cardRef}
                            style={{
                                // maxHeight: `${window.innerHeight / 2.2}px`,
                                // overflowY: 'auto',
                                // overflowX: 'hidden',
                                padding: '0.5rem 0.5rem 0.5rem 0.5rem',
                                border: '1px solid #dee2e6',
                                marginTop: '0.5rem',
                                display: templateValue?.length > 0 ? 'block' : 'none'
                            }}>

                            {
                                templateValue?.map((item: any, i: number) => {
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
                                                            setTemplateValue(templateValue?.filter((_: any, index: number) => item.id !== _.id))
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
                                            <div className={`col-${getValues('type') === 'select' ? '3' : '6'} mb-1`}>
                                                <label className="form-label">Categoriya</label>
                                                <div className="d-flex">
                                                    <div className="w-100">
                                                        <Select
                                                            name='name3'
                                                            value={item?.template_category_id}
                                                            onChange={(e: any) => {
                                                                setTemplateValue(templateValue?.map((_: any, index: number) => {
                                                                    if (_.id === item.id) {
                                                                        return {
                                                                            ..._,
                                                                            template_category_id: e
                                                                        }
                                                                    }
                                                                    return _
                                                                }))
                                                            }}
                                                            className="basic-multi-select"
                                                            classNamePrefix="select"
                                                            // value={userBranch}
                                                            options={
                                                                dataSelect(templateCategoryData)
                                                            } />
                                                    </div>
                                                    {/* <button
                                        type="button"
                                        onClick={() => {
                                            setModal2(() => true)
                                        }}
                                        // onFocus={togglePopover}
                                        className="btn btn-icon btn-primary input-group-text">
                                        <span className="tf-icons bx bx-plus" />
                                    </button> */}
                                                </div>

                                            </div>
                                            <div className={`col-${getValues('type') === 'select' ? '3' : '6'}`}>
                                                <label className="form-label">Qiymat 1</label>
                                                <div className="input-group">
                                                    <div className={`input-group-text ${getValues('type') === 'select' ? 'd-none' : ''}`}>
                                                    <div className="form-check ">
                                                        <input className="form-check-input"
                                                            // checked={checkbox?.is_payment}
                                                            checked={+item.is_comment ? true : false}
                                                            value={+item.is_comment ? 1 : 0}

                                                            onChange={(e: any) => {
                                                                console.log(+e.target.checked);
                                                                setTemplateValue(templateValue?.map((_: any, index: number) => {
                                                                    if (_.id === item.id) {
                                                                        return {
                                                                            ..._,
                                                                            is_comment: e.target.checked
                                                                        }
                                                                    }
                                                                    return _
                                                                }))
                                                            }}
                                                            type="checkbox" id="is_payment" />
                                                    </div>
                                             
                                                    </div>
                                                    <Input type="text" value={item.value_1} placeholder="Qiymat 1" required={true} onChange={(e: any) => {
                                                        setTemplateValue(templateValue?.map((_: any, index: number) => {
                                                            if (_.id === item.id) {
                                                                return {
                                                                    ..._,
                                                                    value_1: e.target.value
                                                                }
                                                            }
                                                            return _
                                                        }))
                                                    }}
                                                    />
                                                </div>
                                            </div>
                                            {
                                                getValues('type') === 'select' && (
                                                    <>
                                                        <div className="col-3">
                                                            <label className="form-label">Qiymat 2</label>
                                                            <Input type="text" value={item.value_2} placeholder="Qiymat 1" required={true} onChange={(e: any) => {
                                                                setTemplateValue(templateValue?.map((_: any, index: number) => {
                                                                    if (_.id === item.id) {
                                                                        return {
                                                                            ..._,
                                                                            value_2: e.target.value
                                                                        }
                                                                    }
                                                                    return _
                                                                }))
                                                            }}
                                                            />
                                                        </div>
                                                        <div className="col-3">
                                                            <label className="form-label">Qiymat 3</label>
                                                            <Input type="text" value={item?.value_3} placeholder="Qiymat 1" required={true} onChange={(e: any) => {
                                                                setTemplateValue(templateValue?.map((_: any, index: number) => {
                                                                    if (_.id === item.id) {
                                                                        return {
                                                                            ..._,
                                                                            value_3: e.target.value
                                                                        }
                                                                    }
                                                                    return _
                                                                }))
                                                            }}
                                                            />
                                                        </div>
                                                    </>
                                                )
                                            }

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

export default TemplateAdd