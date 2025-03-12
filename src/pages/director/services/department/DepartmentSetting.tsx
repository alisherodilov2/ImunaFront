
import React, { useEffect, useState } from 'react'
// import Layout from '../layouts/Layout'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from 'react-redux';
import { query, queryObj } from '../../../../componets/api/Query';
import { isUsersAdd, isUsersEdit, isUsersDefaultApi } from '../../../../service/reducer/UserReducer';
import { ReducerType } from '../../../../interface/interface';
import Loader from '../../../../componets/api/Loader';
import { isFindFunction } from '../../../../service/reducer/MenuReducer';
import Input from '../../../../componets/inputs/Input';
import { NumericFormat, PatternFormat } from 'react-number-format';
import ErrorInput from '../../../../componets/inputs/ErrorInput';
import uploadFileIcon from '../../../assets/upload-file.svg'
import Select from 'react-select';
import axios from 'axios';
import { domain } from '../../../../main';
import DepartmentAdd from '../../services/department/DepartmentAdd';
// import { validateCheck } from './validate/ValidateData';
import { AppDispatch } from '../../../../service/store/store';
import { isDepartmentEdit } from '../../../../service/reducer/DepartmentReducer';
// import { isAddUsers, isEditUsers } from '../../service/reducer/UsersReducer';
const DepartmentSetting = ({ data, modal, setModal, setData = function () { }, resetItem = false }: { setData?: any, data?: any, modal?: boolean; setModal?: any, resetItem?: boolean }) => {
    const [choiseFile, setChoiseFile] = useState('')
    const [file, setFile] = useState(null) as any;
    const [days, setDays] = useState(
        [
            { label: "dushanba", value: "1", is_working: true },
            { label: "seshanba", value: "2", is_working: true },
            { label: "chorshanba", value: "3", is_working: true },
            { label: "payshanba", value: "4", is_working: true },
            { label: "juma", value: "5", is_working: true },
            { label: "shanba", value: "6", is_working: true },
            { label: "yakshanba", value: "7", is_working: false }
        ] as any
    )
    const [checkbox, setCheckbox] = useState({
        is_payment: false,
        is_chek_print:false,
        is_reg_time: false,
        is_graph_time: false,
        is_queue_number: false,
        is_operation:false

    })
    const [files, setFiles] = useState({
        logo_photo: null,
        blank_file: null,
        user_photo: null
    }) as any;
    const [modal2, setModal2] = useState(false)

    const dataSelect = (data: any) => {
        let res = [...data].sort((a: any, b: any) => b.id - a.id);
        return res?.map((item: any) => {
            return {
                value: item?.id, label: item?.name,
                data: item
            }
        })
    }
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
    const { departmentData } = useSelector((state: ReducerType) => state.DepartmentReducer)
    const { isLoading, sendLoading, isSuccessApi, hasError } = useSelector((state: ReducerType) => state.DepartmentReducer)
    const dispatch = useDispatch<AppDispatch>()
    // const [validate, setValidate] = useState(() => validateCheck({ edit: +data?.id ? false : true }));
    const schema = yup
        .object()
        .shape({
            // duration: yup.string().required("Xodimning mustaxasisligi kiriting!"),
            // full_name: yup.string().required("Familiyasi kiriting!"),

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
        if (data?.reset) {
            let s = getValues(), resetObj = {};
            for (let key in getValues()) {
                resetObj = {
                    ...resetObj, [key]: ''
                }
            }

            setSelectData(() => {
                return false
            })
            reset(
                resetObj
            )


        }
        if (Object.keys(data ?? {})?.length > 0) {
            let res = JSON.parse(data?.working_days ?? "[]")
            if (res?.length > 0) {
                setDays(() => res)
            }
            setCheckbox(() => {
                return {
                    is_payment: data?.is_payment,
                    is_chek_print: data?.is_chek_print,
                    is_reg_time: data?.is_reg_time,
                    is_graph_time: data?.is_graph_time,
                    is_queue_number: data?.is_queue_number,
                    is_operation: data?.is_operation,
                }
            })
            
            if (data?.department_template_item
                ?.length > 0) {
                setSelectData(() => {
                    return {
                        ...selectData,
                        department_template_item: data?.department_template_item?.map((item: any) => {
                            return {
                                value: item?.template
                                    ?.id, label: item?.template?.name,
                                data: item
                            }
                        })
                    }
                })
            }
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
            setDays([
                { label: "dushanba", value: "1", is_working: true },
                { label: "seshanba", value: "2", is_working: true },
                { label: "chorshanba", value: "3", is_working: true },
                { label: "payshanba", value: "4", is_working: true },
                { label: "juma", value: "5", is_working: true },
                { label: "shanba", value: "6", is_working: true },
                { label: "yakshanba", value: "0", is_working: false }
            ])
            setSelectData(() => {
                return false
            })
            reset(
                resetObj
            )
        }
        if (isSuccessApi) {
            setData(() => { })
            setDays([
                { label: "dushanba", value: "1", is_working: true },
                { label: "seshanba", value: "2", is_working: true },
                { label: "chorshanba", value: "3", is_working: true },
                { label: "payshanba", value: "4", is_working: true },
                { label: "juma", value: "5", is_working: true },
                { label: "shanba", value: "6", is_working: true },
                { label: "yakshanba", value: "7", is_working: false }
            ])
            dispatch(isUsersDefaultApi())
            setModal(() => false)
        }
    }, [modal, data, isLoading, isSuccessApi])
    const toggle = () => {
        setModal(!modal)
        setEnter(() => false)
        setCheckbox(
            {
                is_chek_print: false,
                is_payment: false,
                is_reg_time: false,
                is_graph_time: false,
                is_queue_number: false,
                is_operation:false

            }
        )
    };
    const send = (e: any) => {
        dispatch(isDepartmentEdit({
            query: queryObj({
                is_setting:'1',
                ...data, ...e,
                is_chek_print: checkbox?.is_chek_print ? '1' : '0',
                is_payment: checkbox?.is_payment ? '1' : '0',
                is_reg_time: checkbox?.is_reg_time ? '1' : '0',
                is_graph_time: checkbox?.is_graph_time ? '1' : '0',
                is_queue_number: checkbox?.is_queue_number ? '1' : '0',
                is_operation: checkbox?.is_operation ? '1' : '0',
                working_days: JSON.stringify(days),
                department_template_item: JSON.stringify(selectData?.department_template_item?.map((res: any) => {
                    return {
                        template_id: res.value,
                    }
                })),
                // can_accept: e.can_accept ? '1' : '0',
                duration: `${e?.duration}`,
            })
            , id: data?.id
        }))
    }
    const { templateData } = useSelector((state: ReducerType) => state.TemplateReducer)

    return (
        <>
            <Loader loading={sendLoading} />
            <Modal centered={true} isOpen={modal} toggle={toggle} role='dialog' size='xl' backdrop="static" keyboard={false}>
                <form onSubmit={handleSubmit(send)} className="size_16">
                    <div className="modal-header">
                        <h5 className="modal-title" id="modalCenterTitle">{+data?.id > 0 ? 'Users tahrirlash ' : "Users qo'shish"}</h5>
                        <button onClick={toggle} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body">

                        <div className="row">

                            <div className="row">
                                <div className="col-2">
                                    <div className="mb-1">
                                        <div className='d-flex gap-2 align-items-center'>
                                            <div className="form-check ">
                                                <input className="form-check-input"
                                                    checked={+checkbox?.is_chek_print ? true : false}
                                                    onChange={(e: any) => {
                                                        console.log(+e.target.checked);
                                                        setCheckbox({
                                                            ...checkbox,
                                                            is_chek_print: e.target.checked
                                                        })
                                                        setValue('is_chek_print', e.target.checked ? '1' : '0', {
                                                            shouldValidate: false,
                                                        })
                                                    }}
                                                    type="checkbox" id="is_chek_print" />
                                            </div>
                                            <label htmlFor="is_chek_print">chek print</label>
                                        </div>
                                    </div>
                                    <div className="mb-1">
                                        <div className='d-flex gap-2 align-items-center'>
                                            <div className="form-check ">
                                                <input className="form-check-input"
                                                    checked={+checkbox?.is_payment ? true : false}
                                                    onChange={(e: any) => {
                                                        console.log(+e.target.checked);
                                                        setCheckbox({
                                                            ...checkbox,
                                                            is_payment: e.target.checked
                                                        })
                                                        setValue('is_payment', e.target.checked ? '1' : '0', {
                                                            shouldValidate: false,
                                                        })
                                                    }}
                                                    type="checkbox" id="is_payment" />
                                            </div>
                                            <label htmlFor="is_payment">Tolov</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-2">
                                    <div className="mb-1">
                                        <div className='d-flex gap-2 align-items-center'>
                                            <div className="form-check ">
                                                <input className="form-check-input"
                                                    checked={+checkbox?.is_reg_time ? true : false}
                                                    onChange={(e: any) => {
                                                        console.log(+e.target.checked);
                                                        setCheckbox({
                                                            ...checkbox,
                                                            is_reg_time: e.target.checked
                                                        })
                                                        setValue('is_reg_time', e.target.checked ? '1' : '0', {
                                                            shouldValidate: false,
                                                        })
                                                    }}
                                                    type="checkbox" id="is_reg_time" />
                                            </div>
                                            <label htmlFor="is_reg_time">Register vaqt</label>
                                        </div>
                                    </div>
                                    <div className="mb-1">
                                        <div className='d-flex gap-2 align-items-center'>
                                            <div className="form-check ">
                                                <input className="form-check-input"
                                                    checked={+checkbox?.is_graph_time ? true : false}
                                                    onChange={(e: any) => {
                                                        console.log(+e.target.checked);
                                                        setCheckbox({
                                                            ...checkbox,
                                                            is_graph_time: e.target.checked
                                                        })
                                                        setValue('is_graph_time', e.target.checked ? '1' : '0', {
                                                            shouldValidate: false,
                                                        })
                                                    }}
                                                    type="checkbox" id="is_graph_time" />
                                            </div>
                                            <label htmlFor="is_graph_time">Grafik vaqt</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-2">
                                    <div className="mb-1">
                                        <div className='d-flex gap-2 align-items-center'>
                                            <div className="form-check ">
                                                <input className="form-check-input"
                                                    checked={+checkbox?.is_queue_number ? true : false}
                                                    onChange={(e: any) => {
                                                        console.log(+e.target.checked);
                                                        setCheckbox({
                                                            ...checkbox,
                                                            is_queue_number: e.target.checked
                                                        })
                                                        setValue('is_queue_number', e.target.checked ? '1' : '0', {
                                                            shouldValidate: false,
                                                        })
                                                    }}
                                                    type="checkbox" id="is_queue_number" />
                                            </div>
                                            <label htmlFor="is_queue_number">Navbat</label>
                                        </div>
                                    </div>
                                    <div className="mb-1">
                                        <div className='d-flex gap-2 align-items-center'>
                                            <div className="form-check ">
                                                <input className="form-check-input"
                                                    checked={+checkbox?.is_operation ? true : false}
                                                    onChange={(e: any) => {
                                                        console.log(+e.target.checked);
                                                        setCheckbox({
                                                            ...checkbox,
                                                            is_operation: e.target.checked
                                                        })
                                                        setValue('is_operation', e.target.checked ? '1' : '0', {
                                                            shouldValidate: false,
                                                        })
                                                    }}
                                                    type="checkbox" id="is_queue_number" />
                                            </div>
                                            <label htmlFor="is_queue_number">Operatsiya</label>
                                        </div>
                                    </div>
                                  
                                </div>
                                
                                <div className="col-2">
                                    <div className="mb-1">
                                        <label className="form-label">Ko'rik davomiyligi</label>
                                        <Input type="text" placeholder="minutda kiriting"  {...register('duration')} name='duration'

                                        />
                                    </div>
                                </div>
                                <div className="col-2">
                                    <div className="mb-1">
                                        <label className="form-label">ish Soati (dan)</label>
                                        <Input type="time" placeholder="minutda kiriting"  {...register('work_start_time')} name='work_start_time' required={true}
                                        />
                                    </div>
                                </div>
                                <div className="col-2">
                                    <div className="mb-1">
                                        <label className="form-label">ish Soati (gacha)</label>
                                        <Input type="time" placeholder="minutda kiriting"  {...register('work_end_time')} name='work_end_time' required={true}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="form-input">
                                    <label className="form-label">Ish kunlari</label>

                                    <div className='d-flex gap-2'>


                                        {
                                            days?.map((item: any, index: number) => {
                                                return (
                                                    <div className="d-flex">

                                                        <div className="form-check d-flex justify-content-center">
                                                            <input className="form-check-input" type="checkbox" id={"day" + index}
                                                                checked={+item?.is_working ? true : false}
                                                                onChange={(e: any) => {
                                                                    setDays((prev: any) =>
                                                                        prev.map((target: any) => {
                                                                            if (item?.value == target.value) {
                                                                                return {
                                                                                    ...target,
                                                                                    is_working: e.target.checked
                                                                                }
                                                                            }
                                                                            return target
                                                                        })
                                                                    )
                                                                }}

                                                            />
                                                        </div>
                                                        <label htmlFor={"day" + index}>{item?.label}</label>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <div>
                                    <Select
                                        name='name3'
                                        value={selectData?.department_template_item}
                                        isMulti
                                        onChange={(e: any) => {
                                            // console.log('select');
                                            setSelectData({
                                                ...selectData,
                                                department_template_item: e,
                                            })

                                        }}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        // value={userBranch}
                                        options={
                                            [

                                                ...dataSelect(templateData)
                                            ]
                                        } />
                                </div>
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

export default DepartmentSetting