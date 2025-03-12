import React, { useEffect, useState } from 'react'
// import Layout from '../layouts/Layout'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../service/store/store';
import { query, queryObj } from '../../../componets/api/Query';
import { isUsersAdd, isUsersEdit, isUsersDefaultApi } from '../../../service/reducer/UserReducer';
import { ReducerType } from '../../../interface/interface';
import Loader from '../../../componets/api/Loader';
import { isFindFunction } from '../../../service/reducer/MenuReducer';
import Input from '../../../componets/inputs/Input';
import { NumericFormat, PatternFormat } from 'react-number-format';
import ErrorInput from '../../../componets/inputs/ErrorInput';
import uploadFileIcon from '../../../assets/upload-file.svg'
import Select from 'react-select';
import axios from 'axios';
import { domain } from '../../../main';
import { user_role } from './UsersData';
import DepartmentAdd from '../services/department/DepartmentAdd';
import { validateCheck } from './validate/ValidateData';
// import { isAddUsers, isEditUsers } from '../../service/reducer/UsersReducer';
const UserSetting = ({ data, modal, setModal, setData = function () { }, resetItem = false }: { setData?: any, data?: any, modal?: boolean; setModal?: any, resetItem?: boolean }) => {
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
    const { isLoading, sendLoading, isSuccessApi, hasError } = useSelector((state: ReducerType) => state.UserReducer)
    const dispatch = useDispatch<AppDispatch>()
    const [validate, setValidate] = useState(() => validateCheck({ edit: +data?.id ? false : true }));
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
        is_shikoyat: false,
        is_diagnoz: false,
        is_payment: false,
        is_editor: false,
        is_certificates: false
    })
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
                    is_diagnoz: +data?.is_diagnoz ? true : false,
                    is_shikoyat: +data?.is_shikoyat ? true : false,
                    is_payment: +data?.is_payment ? true : false,
                    is_editor: +data?.is_editor ? true : false,
                    is_certificates: +data?.is_certificates ? true : false

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
                    is_diagnoz: false,
                    is_shikoyat: false,
                    is_payment: false,
                    is_editor: false,
                    is_certificates: false
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
                is_diagnoz: false,
                is_shikoyat: false,
                is_payment: false,
                is_editor: false,
                is_certificates: false
            }
        )
    };
    const send = (e: any) => {
        dispatch(isUsersEdit({
            query: queryObj({
                is_editor: checkbox?.is_editor ? '1' : '0',
                is_diagnoz: checkbox?.is_diagnoz ? '1' : '0',
                is_shikoyat: checkbox?.is_shikoyat ? '1' : '0',
                is_certificates: checkbox?.is_certificates ? '1' : '0',
                ...data, ...e,
                working_days: JSON.stringify(days),

                can_accept: e.can_accept ? '1' : '0',
                duration: `${e?.duration}`,
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
                            <div className="col-lg-4 col-12">
                                <div className="d-flex  justify-content-center  align-items-center gap-4">
                                    <div className="button-wrapper">
                                        <label htmlFor="blank_file" className="cursor-pointer  border rounded" tabIndex={0}
                                        >
                                            <img src={
                                                choiseFile?.length > 0 ? `${domain}/storage${choiseFile.trim()}` :
                                                    files?.blank_file == null ? data?.blank_file?.length > 0 ? `${domain}${data?.blank_file}` : uploadFileIcon : URL.createObjectURL(files?.blank_file)
                                            } alt="user-avatar" className="d-block rounded object-contain" height={200} width={200} id="uploadedAvatar" />
                                            <input
                                                onChange={(e: any) => {
                                                    if (e.target.files[0]) {
                                                        setChoiseFile('')
                                                        setFiles(() => {
                                                            return {
                                                                ...files,
                                                                blank_file: e.target.files[0]
                                                            }
                                                        })
                                                    }
                                                }}
                                                type="file" id="blank_file" className="account-file-input" hidden accept="image/png, image/jpeg" />
                                        </label>
                                    </div>
                                    <div>
                                        <p>Rasmi</p>

                                        <button
                                            onClick={() => {
                                                setFiles(() => {
                                                    return {
                                                        ...files,
                                                        blank_file: null
                                                    }
                                                })
                                            }}
                                            type="button" className="btn btn-outline-secondary account-image-reset ">
                                            <i className="bx bx-reset d-block d-sm-none" />
                                            <span className="d-none d-sm-block">reset</span>
                                        </button>
                                        {/* <button
                                                    onClick={() => {
                                                        setServerFilesModal(() => true)
                                                    }}
                                                    type="button" className="btn btn-outline-secondary account-image-reset ">
                                                    <i className="bx bx-reset d-block d-sm-none" />
                                                    <span className="d-none d-sm-block">Server</span>
                                                </button> */}
                                    </div>
                                </div>

                            </div>
                            <div className="col-lg-8 col-12">
                                <div className="mb-1">
                                    <label className="form-label">Shifokorning imzosi</label>
                                    <Input type="text" placeholder="Shifokorning imzosi"  {...register('doctor_signature')} name='doctor_signature'
                                    />
                                </div>
                                <div className="mb-1 py-1">
                                    <div className="  d-flex ">
                                        <label className="form-label user-select" htmlFor='can_accept'>Mijoz qabul qila oladimi?
                                        </label>
                                        <div className="form-check form-switch">
                                            <input className="form-check-input float-end"
                                                {...register('can_accept')} name='can_accept' type="checkbox" id='can_accept' role="switch"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 d-flex gap-2 align-items-center my-1 flex-wrap">
                                    <div className='d-flex gap-2 align-items-center'>
                                        <label htmlFor="is_editor">Editor</label>
                                        <div className="form-check ">
                                            <input className="form-check-input float-end" type="checkbox" role="switch"
                                                checked={+checkbox?.is_editor ? true : false}
                                                onChange={(e: any) => {
                                                    console.log(+e.target.checked);
                                                    setCheckbox({
                                                        ...checkbox,
                                                        is_editor: e.target.checked
                                                    })
                                                    setValue('is_editor', e.target.checked ? '1' : '0', {
                                                        shouldValidate: false,
                                                    })

                                                }}

                                            />
                                        </div>


                                    </div>
                                    <div className='d-flex gap-2 align-items-center'>
                                        <label htmlFor="rasmli">Shikoyat</label>
                                        <div className="form-check ">
                                            <input className="form-check-input float-end" type="checkbox" role="switch"
                                                checked={+checkbox?.is_shikoyat ? true : false}
                                                onChange={(e: any) => {
                                                    console.log(+e.target.checked);
                                                    setCheckbox({
                                                        ...checkbox,
                                                        is_shikoyat: e.target.checked
                                                    })
                                                    setValue('is_shikoyat', e.target.checked ? '1' : '0', {
                                                        shouldValidate: false,
                                                    })

                                                }}

                                            />
                                        </div>


                                    </div>
                                    <div className='d-flex gap-2 align-items-center'>
                                        <label htmlFor="Izoh">Diagnoz</label>
                                        <div className="form-check ">
                                            <input className="form-check-input"
                                                checked={+checkbox?.is_diagnoz ? true : false}
                                                onChange={(e: any) => {
                                                    console.log(+e.target.checked);
                                                    setCheckbox({
                                                        ...checkbox,
                                                        is_diagnoz: e.target.checked
                                                    })
                                                    setValue('is_diagnoz', e.target.checked ? '1' : '0', {
                                                        shouldValidate: false,
                                                    })

                                                }}
                                                type="checkbox" id="Izoh" />
                                        </div>
                                    </div>
                                    <div className='d-flex gap-2 align-items-center'>
                                        <label htmlFor="Izoh">Sertifkat</label>
                                        <div className="form-check ">
                                            <input className="form-check-input"
                                                checked={+checkbox?.is_certificates ? true : false}
                                                onChange={(e: any) => {
                                                    console.log(+e.target.checked);
                                                    setCheckbox({
                                                        ...checkbox,
                                                        is_certificates: e.target.checked
                                                    })
                                                    setValue('is_certificates', e.target.checked ? '1' : '0', {
                                                        shouldValidate: false,
                                                    })

                                                }}
                                                type="checkbox" id="is_certificates" />
                                        </div>
                                    </div>
                                    {/* <div className='d-flex gap-2 align-items-center'>
                                        <label htmlFor="is_payment">Tolov</label>
                                        <div className="form-check ">
                                            <input className="form-check-input"
                                                checked={checkbox?.is_payment}
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

export default UserSetting