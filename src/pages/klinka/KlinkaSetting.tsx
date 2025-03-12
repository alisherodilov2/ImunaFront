import React, { useEffect, useState } from 'react'
// import Layout from '../layouts/Layout'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../service/store/store';
import { query, queryObj } from '../../componets/api/Query';
import { isUsersAdd, isUsersEdit, isUsersDefaultApi } from '../../service/reducer/UserReducer';
import { ReducerType } from '../../interface/interface';
import Loader from '../../componets/api/Loader';
import { isFindFunction } from '../../service/reducer/MenuReducer';
import Input from '../../componets/inputs/Input';
import { NumericFormat, PatternFormat } from 'react-number-format';
import ErrorInput from '../../componets/inputs/ErrorInput';
import uploadFileIcon from '../../assets/upload-file.svg'
import Select from 'react-select';
import axios from 'axios';
import { domain } from '../../main';
import { isKlinkaEdit } from '../../service/reducer/KlinkaReducer';
// import { isAddUsers, isEditUsers } from '../../service/reducer/UsersReducer';
const KlinkaSetting = ({ data, modal, setModal, setData = function () { }, resetItem = false }: { setData?: any, data?: any, modal?: boolean; setModal?: any, resetItem?: boolean }) => {
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
    const { isLoading, sendLoading, isSuccessApi, hasError } = useSelector((state: ReducerType) => state.KlinkaReducer)
    const dispatch = useDispatch<AppDispatch>()
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
    const [checkbox, setCheckbox] = useState({
        is_cash_reg: false,
        is_marketing: false,
        is_template: false,
        is_gijja: false,
        is_excel_repot: false

    } as any)
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
            setCheckbox(
                {
                    is_marketing: +data?.is_marketing ? true : false,
                    is_cash_reg: +data?.is_cash_reg ? true : false,
                    is_template: +data?.is_template ? true : false,
                    is_gijja: +data?.is_gijja ? true : false,
                    is_excel_repot: +data?.is_excel_repot ? true : false


                }
            )
            if (data?.user_template_item?.length > 0) {
                setSelectData(() => {
                    return {
                        ...selectData,
                        user_template_item: data?.user_template_item?.map((item: any) => {
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
            setSelectData(() => {
                return false
            })
            reset(
                resetObj
            )
        }
        if (isSuccessApi) {
            setData(() => { })
            setModal(enter)
            setCheckbox(
                {
                    is_marketing: false,
                    is_cash_reg: false,
                    is_template: false,
                    is_gijja: false,
                    is_excel_repot: false
                }
            )
            dispatch(isUsersDefaultApi())
        }
    }, [modal, data, isLoading, isSuccessApi])
    const toggle = () => {
        setModal(!modal)
        setEnter(() => false)
        setCheckbox(
            {
                is_marketing: false,
                is_cash_reg: false,
                is_template: false,
                is_gijja: false,
                is_excel_repot: false
            }
        )
    };
    const send = (e: any) => {
        dispatch(isKlinkaEdit({
            query: query({
                is_gijja: checkbox?.is_gijja ? '1' : '0',
                is_template: checkbox?.is_template ? '1' : '0',
                is_marketing: checkbox?.is_marketing ? '1' : '0',
                is_excel_repot: checkbox?.is_excel_repot ? '1' : '0',
            }),
            file: files
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

                            <div className="col-8">

                                <div className="col-12 d-flex gap-2 align-items-center my-1">
                                <div className='d-flex gap-2 align-items-center'>
                                        <label htmlFor="is_excel_repot">Bug'alteriya</label>
                                        <div className="form-check ">
                                            <input className="form-check-input float-end" type="checkbox" role="switch"
                                                checked={+checkbox?.is_excel_repot ? true : false}
                                                onChange={(e: any) => {
                                                    console.log(+e.target.checked);
                                                    setCheckbox({
                                                        ...checkbox,
                                                        is_excel_repot: e.target.checked
                                                    })
                                                    setValue('is_excel_repot', e.target.checked ? '1' : '0', {
                                                        shouldValidate: false,
                                                    })

                                                }}

                                            />
                                        </div>


                                    </div>
                                    <div className='d-flex gap-2 align-items-center'>
                                        <label htmlFor="is_cash_reg">Gijja statistka</label>
                                        <div className="form-check ">
                                            <input className="form-check-input float-end" type="checkbox" role="switch"
                                                checked={+checkbox?.is_gijja ? true : false}
                                                onChange={(e: any) => {
                                                    console.log(+e.target.checked);
                                                    setCheckbox({
                                                        ...checkbox,
                                                        is_gijja: e.target.checked
                                                    })
                                                    setValue('is_gijja', e.target.checked ? '1' : '0', {
                                                        shouldValidate: false,
                                                    })

                                                }}

                                            />
                                        </div>


                                    </div>
                                    <div className='d-flex gap-2 align-items-center'>
                                        <label htmlFor="is_cash_reg">Marketing</label>
                                        <div className="form-check ">
                                            <input className="form-check-input float-end" type="checkbox" role="switch"
                                                checked={+checkbox?.is_marketing ? true : false}
                                                onChange={(e: any) => {
                                                    console.log(+e.target.checked);
                                                    setCheckbox({
                                                        ...checkbox,
                                                        is_marketing: e.target.checked
                                                    })
                                                    setValue('is_marketing', e.target.checked ? '1' : '0', {
                                                        shouldValidate: false,
                                                    })

                                                }}

                                            />
                                        </div>


                                    </div>
                                    <div className='d-flex gap-2 align-items-center'>
                                        <label htmlFor="is_cash_reg">Shablon</label>
                                        <div className="form-check ">
                                            <input className="form-check-input float-end" type="checkbox" role="switch"
                                                checked={+checkbox?.is_template ? true : false}
                                                onChange={(e: any) => {
                                                    console.log(+e.target.checked);
                                                    setCheckbox({
                                                        ...checkbox,
                                                        is_template: e.target.checked
                                                    })
                                                    setValue('is_template', e.target.checked ? '1' : '0', {
                                                        shouldValidate: false,
                                                    })

                                                }}

                                            />
                                        </div>


                                    </div>

                                    {/* <div className='d-flex gap-2 align-items-center'>
                                        <label htmlFor="is_template">Tolov</label>
                                        <div className="form-check ">
                                            <input className="form-check-input"
                                                checked={checkbox?.is_template}
                                                onChange={(e: any) => {
                                                    console.log(+e.target.checked);
                                                    setCheckbox({
                                                        ...checkbox,
                                                        is_template: e.target.checked
                                                    })
                                                    setValue('is_template', e.target.checked ? '1' : '0', {
                                                        shouldValidate: false,
                                                    })

                                                }}
                                                type="checkbox" id="is_template" />
                                        </div>
                                    </div> */}
                                </div>
                                {/* <div>
                                    <Select
                                        name='name3'
                                        value={selectData?.user_template_item}
                                        isMulti
                                        onChange={(e: any) => {
                                            // console.log('select');
                                            setSelectData({
                                                ...selectData,
                                                user_template_item: e,
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
                                </div> */}
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

export default KlinkaSetting