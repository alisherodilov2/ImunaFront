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
export const kunlar = [
    { label: "dushanba", value: "1", is_working: true },
    { label: "seshanba", value: "2", is_working: true },
    { label: "chorshanba", value: "3", is_working: true },
    { label: "payshanba", value: "4", is_working: true },
    { label: "juma", value: "5", is_working: true },
    { label: "shanba", value: "6", is_working: true },
    { label: "yakshanba", value: "0", is_working: false }
];

const UsersAdd = ({ data, modal, setModal, setData = function () { }, resetItem = false }: { setData?: any, data?: any, modal?: boolean; setModal?: any, resetItem?: boolean }) => {
    const [choiseFile, setChoiseFile] = useState('')

    const [file, setFile] = useState(null) as any;
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
    const [validate, setValidate] = useState(() => validateCheck({ edit: +data?.id ? false : true }) as any);
    const schema = yup
        .object()
        .shape({
            role: yup.string().required("Xodimning mustaxasisligi kiriting!"),
            full_name: yup.string().required("Familiyasi kiriting!"),
            password: yup.string().required("Ismi kiriting!"),
            con_password: yup.string().required("Parol kiritng kiriting!").oneOf([yup.ref('password')], "Parol mos kelmadi!"),
            name: yup.string().required("Nomini kiriting!"),
            phone: yup.string().required("Telefon kiriting!")
                .test(
                    'valid-length',
                    'Phone number must have exactly 9 digits after the country code',
                    (val: any) => {
                        const phoneNumber = val && val.replace(/[^\d]/g, ''); // Remove non-numeric characters
                        return phoneNumber && phoneNumber.length === 9; // Check if digits after '998' are exactly 9
                    }
                )
            ,
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
        resolver: yupResolver(validate),
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
            if (data?.department_id > 0) {
                let department_id = departmentData?.find((item: any) => item?.id == data?.department_id);
                setSelectData(() => {
                    return {
                        ...selectData,
                        department_id: {
                            value: department_id?.id,
                            label: department_id?.name
                        },
                    }
                })
                setValue('department_id', data?.department_id, {
                    shouldValidate: true,
                });

            }

        }
        if (Object.keys(data ?? {})?.length > 0) {
            let department_id = departmentData?.find((item: any) => item?.id == data?.department_id);
            let role = user_role?.find((item: any) => item?.value == data?.role);
            setSelectData(() => {
                return {
                    ...selectData,
                    role: role,
                    department_id: {
                        value: department_id?.id,
                        label: department_id?.name
                    },
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
            dispatch(isUsersDefaultApi())
        }
    }, [modal, data, isLoading, isSuccessApi])
    const toggle = () => {
        setModal(!modal)
        setEnter(() => false)
    };
    const send = (e: any) => {
        // if (id?.toString()?.length ?? 0 > 0) {
        //   dispatch(isProductEdit({ query: query({ ...data, product_value: JSON.stringify(product_values) }, ['photo']), file: file, id: id }))
        // } else {
        //   dispatch(isProductAdd({ query: query({ ...data, product_value: JSON.stringify(product_values) }, ['photo']), file: file }))
        // }
        if (data?.id?.toString()?.length ?? 0 > 0) {
            dispatch(isUsersEdit({
                query: queryObj({
                    ...data, ...e,
                    is_primary_agent: e.is_primary_agent ? '1' : '0',
                    department_id: `${e?.department_id ?? 0}`,
                    user_phone: e?.user_phone?.replace(/[^\d]/g, '')
                    ,
                }),
                file: files
                , id: data?.id
            }))
            /////// dispatch(isCostEdit(data)) 
        } else {
            dispatch(isUsersAdd({
                query: queryObj({
                    ...data, ...e,
                    is_primary_agent: e.is_primary_agent ? '1' : '0',
                    department_id: `${e?.department_id ?? 0}`,
                    user_phone: e?.user_phone?.replace(/[^\d]/g, '')
                    ,
                }),
                file: files
            }))
        }
    }


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
                                        <label htmlFor="user_photo" className="cursor-pointer  border rounded" tabIndex={0}
                                        >
                                            <img src={
                                                choiseFile?.length > 0 ? `${domain}/storage${choiseFile.trim()}` :
                                                    files?.user_photo == null ? data?.user_photo?.length > 0 ? `${domain}${data?.user_photo}` : uploadFileIcon : URL.createObjectURL(files?.user_photo)
                                            } alt="user-avatar" className="d-block rounded object-contain" height={200} width={200} id="uploadedAvatar" />
                                            <input
                                                onChange={(e: any) => {
                                                    if (e.target.files[0]) {
                                                        setChoiseFile('')
                                                        setFiles(() => {
                                                            return {
                                                                ...files,
                                                                user_photo: e.target.files[0]
                                                            }
                                                        })
                                                    }
                                                }}
                                                type="file" id="user_photo" className="account-file-input" hidden accept="image/png, image/jpeg" />
                                        </label>
                                    </div>
                                    <div>
                                        <p>Rasmi</p>

                                        <button
                                            onClick={() => {
                                                setFiles(() => {
                                                    return {
                                                        ...files,
                                                        user_photo: null
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
                                {
                                    selectData?.role?.value === 'counterparty' ?
                                        <div className=" my-1 d-flex my-1">
                                            <label className="form-label user-select" htmlFor='is_primary_agent'>Ushbu agentni asosiy deb belgilaysizmi?
                                            </label>
                                            <div className="form-check form-switch">
                                                <input className="form-check-input float-end"
                                                    {...register('is_primary_agent')} name='is_primary_agent' type="checkbox" id='is_primary_agent' role="switch"
                                                />
                                            </div>
                                        </div> : ''
                                }
                            </div>
                            <div className="col-lg-8 col-12">
                                <div className="row">
                                    <div className="col-lg-6 col-md-6 col-12 mb-1">
                                        <label className="form-label">Familiyasi</label>
                                        <Input type="text" placeholder="Familiyasi kiriting"  {...register('full_name')} name='full_name'
                                            error={errors.full_name?.message?.toString() || hasError?.errors?.full_name?.toString()}
                                        />
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-12 mb-1">
                                        <label className="form-label">Ismi</label>
                                        <Input type="text" placeholder="Ismi kiriting"  {...register('name')} name='name'
                                            error={errors.name?.message?.toString() || hasError?.errors?.name?.toString()}
                                        />
                                    </div>
                                    <div className="col-lg-6 col-md-6 mb-1">
                                        <label className="form-label">Telefon raqami</label>
                                        <input type="hidden" {...register('user_phone')} name='user_phone' />
                                        <div className="input-group">
                                            <div className="input-group-text">
                                                +998
                                            </div>
                                            <PatternFormat
                                                format="(##) ###-##-##"
                                                mask="_"
                                                value={getValues('user_phone')}
                                                allowEmptyFormatting
                                                className='form-control'
                                                placeholder="+998 (___) ___-____"
                                                onChange={(e: any) => {
                                                    setValue('user_phone', e.target.value.replace(/[^\d]/g, ''), {
                                                        shouldValidate: true,
                                                    });
                                                }}
                                            />
                                        </div>
                                        <ErrorInput>
                                            {errors.user_phone?.message?.toString() || hasError?.errors?.user_phone?.toString()}
                                        </ErrorInput>

                                    </div>



                                    <div className="col-lg-6 col-md-6 mb-1">
                                        <label className="form-label">Xodimning mustaxasisligi</label>
                                        <input type="hidden" {...register('role')} name='role' />
                                        <Select
                                            name='name3'
                                            value={selectData?.role}
                                            onChange={(e: any) => {
                                                setSelectData({
                                                    ...selectData,
                                                    role: e
                                                })
                                                setValidate(() => validateCheck(
                                                    {
                                                        role: e.value,
                                                        edit: +data?.id ? true : false
                                                    }
                                                ))
                                                setValue('role', e.value, {
                                                    shouldValidate: true,
                                                });
                                            }}
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                            // value={userBranch}
                                            options={
                                                user_role
                                            } />
                                        <ErrorInput>
                                            {errors.role?.message?.toString() || hasError?.errors?.role?.toString()}
                                        </ErrorInput>

                                    </div>
                                    {/* shifokor va labaratoriya bolsa */}
                                    {
                                        selectData?.role?.value === 'laboratory' || selectData?.role?.value === 'doctor' ?
                                            <>
                                                <div className="col-lg-6 col-md-6 mb-1">
                                                    <label className="form-label">Bo'lim nomi</label>
                                                    <input type="hidden" {...register('department_id')} name='department_id' />
                                                    <div className="d-flex">
                                                        <div className="w-100">
                                                            <Select
                                                                name='name3'
                                                                value={selectData?.department_id}
                                                                onChange={(e: any) => {
                                                                    setSelectData({
                                                                        ...selectData,
                                                                        department_id: e
                                                                    })

                                                                    setValue('department_id', e.value, {
                                                                        shouldValidate: true,
                                                                    });
                                                                }}
                                                                className="basic-multi-select"
                                                                classNamePrefix="select"
                                                                // value={userBranch}
                                                                options={
                                                                    dataSelect(departmentData?.filter((item: any) => selectData?.role?.value === 'laboratory' ? item.probirka : !item.probirka))
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
                                                        {errors.department_id?.message?.toString() || hasError?.errors?.department_id?.toString()}
                                                    </ErrorInput>
                                                </div>
                                                <div className="col-lg-6 col-md-6 mb-1">
                                                    <label className="form-label">Statsionar ulushi</label>
                                                    <input type="hidden" {...register('inpatient_share_price')} name='inpatient_share_price' />
                                                    <NumericFormat
                                                        value={getValues('inpatient_share_price')}
                                                        thousandSeparator
                                                        onChange={(e: any) => {
                                                            setValue('inpatient_share_price', e.target.value.replace(/,/g, ''), {
                                                                shouldValidate: true,
                                                            });

                                                        }}
                                                        className='form-control'
                                                    />
                                                    <ErrorInput>
                                                        {errors.inpatient_share_price?.message?.toString() || hasError?.errors?.inpatient_share_price?.toString()}
                                                    </ErrorInput>
                                                </div>
                                            </>
                                            : ''
                                    }

                                    <div className="col-lg-6 col-md-6 mb-1">
                                        <label className="form-label">Paroli</label>
                                        <Input type="password" placeholder="******"  {...register('password')} name='password'
                                            error={errors.password?.message?.toString() || hasError?.errors?.password?.toString()}
                                        />
                                    </div>
                                    <div className="col-lg-6 col-md-6 mb-1">
                                        <label className="form-label">Parolni qayta kiriting</label>
                                        <Input type="password" placeholder="******"  {...register('con_password')} name='con_password'
                                            error={errors.con_password?.message?.toString() || hasError?.errors?.con_password?.toString()}
                                        />
                                    </div>
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
            <DepartmentAdd
                modal={modal2} setModal={setModal2}
            />
        </>
    )
}

export default UsersAdd