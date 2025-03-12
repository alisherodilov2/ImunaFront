import React, { useEffect, useState } from 'react'
// import Layout from '../layouts/Layout'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../service/store/store';
import { query } from '../../componets/api/Query';
import { isKlinkaAdd, isKlinkaEdit, isKlinkaDefaultApi } from '../../service/reducer/KlinkaReducer';
import { ReducerType } from '../../interface/interface';
import Loader from '../../componets/api/Loader';
import { isFindFunction } from '../../service/reducer/MenuReducer';
import Input from '../../componets/inputs/Input';
import { NumericFormat, PatternFormat } from 'react-number-format';
import ErrorInput from '../../componets/inputs/ErrorInput';
import uploadFileIcon from '../../assets/upload-file.svg'

import axios from 'axios';
import { domain } from '../../main';
// import { isAddKlinka, isEditKlinka } from '../../service/reducer/KlinkaReducer';
const KlinkaAdd = ({ data, modal, setModal, setData = function () { }, resetItem = false }: { setData?: any, data?: any, modal?: boolean; setModal?: any, resetItem?: boolean }) => {
    const [choiseFile, setChoiseFile] = useState('')
    const [file, setFile] = useState(null) as any;
    const [files, setFiles] = useState({
        logo_photo: null,
        blank_file: null,
        user_photo: null
    }) as any;
    const { findData } = useSelector((state: ReducerType) => state.MenuReducer)
    const { isLoading, sendLoading, isSuccessApi, hasError } = useSelector((state: ReducerType) => state.KlinkaReducer)
    const dispatch = useDispatch<AppDispatch>()
    const schema = yup
        .object()
        .shape({
            full_name: yup.string().required("MIJOZ kiriting!"),
            user_phone: yup.string().required("Telefon kiriting!")
                .test(
                    'valid-length',
                    'Phone number must have exactly 9 digits after the country code',
                    (val: any) => {
                        const phoneNumber = val && val.replace(/[^\d]/g, ''); // Remove non-numeric characters
                        return phoneNumber && phoneNumber.length === 9; // Check if digits after '998' are exactly 9
                    }
                )
            ,
            phone_1: yup.string().nullable()
                .test(
                    'valid-length',
                    'Phone number must have exactly 9 digits after the country code',
                    (val: any) => {
                        const phoneNumber = val && val.replace(/[^\d]/g, ''); // Remove non-numeric characters
                        return phoneNumber?.length>0 ?  phoneNumber.length === 9 : true; // Check if digits after '998' are exactly 9
                    }
                )
            ,
            phone_2: yup.string().nullable()
                .test(
                    'valid-length',
                    'Phone number must have exactly 9 digits after the country code',
                    (val: any) => {
                        const phoneNumber = val && val.replace(/[^\d]/g, ''); // Remove non-numeric characters
                        return phoneNumber?.length>0 ?  phoneNumber.length === 9 : true; // Check if digits after '998' are exactly 9
                    }
                )
            ,
            phone_3: yup.string().nullable()
                .test(
                    'valid-length',
                    'Phone number must have exactly 9 digits after the country code',
                    (val: any) => {
                        const phoneNumber = val && val.replace(/[^\d]/g, ''); // Remove non-numeric characters
                        return phoneNumber?.length>0 ?  phoneNumber.length === 9 : true; // Check if digits after '998' are exactly 9
                    }
                )
            ,

            site_url: yup.string().required("Sayt kiriting!"),
            name: yup.string().required("Nomini kiriting!"),
            // sms_api: yup.string().required("sms_api kiriting!"),
            off_date: yup.string().required("off_date kiriting!"),
            telegram_id: yup.string().required("telegram_id kiriting!"),
            license: yup.string().required("license kiriting!"),
            location: yup.string().required("location kiriting!"),
            address: yup.string().required("manzilni kiriting!"),
            // logo_check: yup.string().required("logo kiriting!"),
            // blank_check: yup.string().required("blank kiriting!"),
            // user_check: yup.string().required("rasm kiriting!"),
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
            reset(
                resetObj
            )
        }
        if (isSuccessApi) {
            setData(() => { })
            setModal(enter)
            dispatch(isKlinkaDefaultApi())
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
            dispatch(isKlinkaEdit({
                query: query({
                    ...data, ...e,
                    phone_1: e?.phone_1?.replace(/[^\d]/g, ''),
                    phone_2: e?.phone_2?.replace(/[^\d]/g, ''),
                    phone_3: e?.phone_3?.replace(/[^\d]/g, ''),
                    user_phone: e?.user_phone?.replace(/[^\d]/g, '')
                    ,
                }),
                file: files
                , id: data?.id
            }))
            /////// dispatch(isCostEdit(data)) 
        } else {
            dispatch(isKlinkaAdd({
                query: query({
                    ...data, ...e,
                    phone_1: e?.phone_1?.replace(/[^\d]/g, ''),
                    phone_2: e?.phone_2?.replace(/[^\d]/g, ''),
                    phone_3: e?.phone_3?.replace(/[^\d]/g, ''),
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
            <Modal centered={true} isOpen={modal} toggle={toggle} role='dialog' size='xl' backdrop="static" keyboard={false} >
                <form onSubmit={handleSubmit(send)} className='size_16'>
                    <div className="modal-header">
                        <h5 className="modal-title" id="modalCenterTitle">{+data?.id > 0 ? 'Klinka tahrirlash ' : "Klinka qo'shish"}</h5>
                        <button onClick={toggle} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body">
                        <div className="divider text-start-center">
                            <div className="divider-text">1-qadam(Klinka) </div>
                        </div>
                        <div className='row' >
                            <div className="col-3">
                                <div className="d-flex  justify-content-center  align-items-center gap-4">
                                <div className="button-wrapper">
                                        <label htmlFor="logo_photo" className="cursor-pointer position-relative  border rounded" tabIndex={0}
                                        >
                                            <img src={
                                                choiseFile?.length > 0 ? `${domain}/storage${choiseFile.trim()}` :
                                                    files?.logo_photo == null ? data?.logo_photo?.length > 0 ? `${domain}${data?.logo_photo}` : uploadFileIcon : URL.createObjectURL(files?.logo_photo)
                                            } alt="user-avatar" className="d-block rounded object-contain" height={100} width={100} id="uploadedAvatar" />
                                            <input
                                             required={data?.id > 0 ? false : true}
                                                onChange={(e: any) => {
                                                    if (e.target.files[0]) {
                                                        setChoiseFile('')
                                                        setValue('blank_check', 1, {
                                                            shouldValidate: true,
                                                        });
                                                        setFiles(() => {
                                                            return {
                                                                ...files,
                                                                logo_photo: e.target.files[0]
                                                            }
                                                        })
                                                    }
                                                }}
                                                type="file"  id="logo_photo" className="account-file-input opacity-0 position-absolute top-0 left-0  "  accept="image/png, image/jpeg" />
                                        </label>
                                    </div>
                                    <div>
                                        <p>Logo</p>

                                        <button
                                            onClick={() => {
                                                setFiles(() => {
                                                    return {
                                                        ...files,
                                                        logo_photo: null
                                                    }
                                                })
                                                setValue('logo_check', '', {
                                                    shouldValidate: false,
                                                });
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
                                <input type="hidden" {...register('logo_check')} name='logo_check' />
                                <ErrorInput>
                                    {errors.logo_check?.message?.toString() || hasError?.errors?.logo_check?.toString()}
                                </ErrorInput>
                            </div>
                            <div className="col-9">
                                <div className="row">
                                    <div className="col-4 mb-1">
                                        <label className="form-label">Klinka Nomi</label>
                                        <Input type="text" placeholder="Klinka nomi"  {...register('name')} name='name'
                                            error={errors.name?.message?.toString() || hasError?.errors?.name?.toString()}
                                        />
                                    </div>
                                    <div className="col-8 mb-1">
                                        <label className="form-label">Manzil</label>
                                        <Input type="text" placeholder="Manzil kiriting"  {...register('address')} name='address'
                                            error={errors.address?.message?.toString() || hasError?.errors?.address?.toString()}
                                        />
                                    </div>
                                    <div className="col-12 mb-1">
                                        <label className="form-label">Lokatsiya</label>
                                        <Input type="text" placeholder="Lokatsiya kiriting"  {...register('location')} name='location'
                                            error={errors.location?.message?.toString() || hasError?.errors?.location?.toString()}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-4 mb-1">
                                <label className="form-label">SMS api</label>
                                <Input type="text" placeholder="Klinka ism-sharifini kiriting"  {...register('sms_api')} name='sms_api'
                                    error={errors.sms_api?.message?.toString() || hasError?.errors?.sms_api?.toString()}
                                />


                            </div>
                            <div className="col-4 mb-1">
                                <label className="form-label">SMS device id</label>
                                <Input type="text" placeholder="device_id kiriting"  {...register('device_id')} name='device_id'
                                    error={errors.device_id?.message?.toString() || hasError?.errors?.device_id?.toString()}
                                />


                            </div>
                            <div className="col-4 mb-1">
                                <label className="form-label">Telefon 1</label>
                                {/* <Input type="number" placeholder="Telefon raqam kiriting"  {...register('phone')} name='phone'
                                    error={errors.phone?.message?.toString() || hasError?.errors?.phone?.toString()}
                                /> */}
                                <label className="form-label">Telefon raqami</label>
                                <input type="hidden" {...register('phone_1')} name='phone_1' />
                                <div className="input-group">
                                    <div className="input-group-text">
                                        +998
                                    </div>
                                    <PatternFormat
                                        format="(##) ###-##-##"
                                        mask="_"
                                        value={getValues('phone_1')}
                                        allowEmptyFormatting
                                        className='form-control'
                                        placeholder="+998 (___) ___-____"
                                        onChange={(e: any) => {
                                            setValue('phone_1', e.target.value.replace(/[^\d]/g, ''), {
                                                shouldValidate: true,
                                            });
                                        }}
                                    />
                                </div>



                                <ErrorInput>
                                    {errors.phone_1?.message?.toString() || hasError?.errors?.phone_1?.toString()}
                                </ErrorInput>

                            </div>
                            <div className="col-6 mb-1">
                                <label className="form-label">Telefon  2</label>
                                {/* <Input type="number" placeholder="Telefon raqam kiriting"  {...register('phone')} name='phone'
                                    error={errors.phone?.message?.toString() || hasError?.errors?.phone?.toString()}
                                /> */}
                                <input type="hidden" {...register('phone_2')} name='phone_2' />
                                <div className="input-group">
                                    <div className="input-group-text">
                                        +998
                                    </div>
                                    <PatternFormat
                                        format="(##) ###-##-##"
                                        mask="_"
                                        value={getValues('phone_2')}
                                        allowEmptyFormatting
                                        className='form-control'
                                        placeholder="+998 (___) ___-____"
                                        onChange={(e: any) => {
                                            setValue('phone_2', e.target.value.replace(/[^\d]/g, ''), {
                                                shouldValidate: true,
                                            });
                                        }}
                                    />
                                </div>
                                <ErrorInput>
                                    {errors.phone_2?.message?.toString() || hasError?.errors?.phone_2?.toString()}
                                </ErrorInput>

                            </div>
                            <div className="col-6 mb-1">
                                <label className="form-label">Telefon 3</label>
                                {/* <Input type="number" placeholder="Telefon raqam kiriting"  {...register('phone')} name='phone'
                                    error={errors.phone?.message?.toString() || hasError?.errors?.phone?.toString()}
                                /> */}
                                <input type="hidden" {...register('phone_3')} name='phone_3' />
                                <div className="input-group">
                                    <div className="input-group-text">
                                        +998
                                    </div>
                                    <PatternFormat
                                        format="(##) ###-##-##"
                                        mask="_"
                                        value={getValues('phone_3')}
                                        allowEmptyFormatting
                                        className='form-control'
                                        placeholder="+998 (___) ___-____"
                                        onChange={(e: any) => {
                                            setValue('phone_3', e.target.value.replace(/[^\d]/g, ''), {
                                                shouldValidate: true,
                                            });
                                        }}
                                    />
                                </div>
                                <ErrorInput>
                                    {errors.phone_3?.message?.toString() || hasError?.errors?.phone_3?.toString()}
                                </ErrorInput>

                            </div>
                            <div className="col-3">
                                <div className="d-flex  justify-content-center  align-items-center gap-4">
                                    <div className="button-wrapper">
                                        <label htmlFor="blank_file" className="cursor-pointer position-relative  border rounded" tabIndex={0}
                                        >
                                            <img src={
                                                choiseFile?.length > 0 ? `${domain}/storage${choiseFile.trim()}` :
                                                    files?.blank_file == null ? data?.blank_file?.length > 0 ? `${domain}${data?.blank_file}` : uploadFileIcon : URL.createObjectURL(files?.blank_file)
                                            } alt="user-avatar" className="d-block rounded object-contain" height={100} width={100} id="uploadedAvatar" />
                                            <input
                                             required={data?.id > 0 ? false : true}
                                                onChange={(e: any) => {
                                                    if (e.target.files[0]) {
                                                        setChoiseFile('')
                                                        setValue('blank_check', 1, {
                                                            shouldValidate: true,
                                                        });
                                                        setFiles(() => {
                                                            return {
                                                                ...files,
                                                                blank_file: e.target.files[0]
                                                            }
                                                        })
                                                    }
                                                }}
                                                type="file"  id="blank_file" className="account-file-input opacity-0 position-absolute top-0 left-0  "  accept="image/png, image/jpeg" />
                                        </label>
                                    </div>
                                    <div>
                                        <p>Blanka</p>

                                        <button
                                            onClick={() => {
                                                setFiles(() => {
                                                    setValue('blank_check', '', {
                                                        shouldValidate: false,
                                                    });
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
                                <input type="hidden" {...register('blank_check')} name='blank_check' />
                                <ErrorInput>
                                    {errors.blank_check?.message?.toString() || hasError?.errors?.blank_check?.toString()}
                                </ErrorInput>
                            </div>
                            <div className="col-9">
                                <div className="row">
                                    <div className="col-4 mb-1">
                                        <label className="form-label">litzensiya</label>
                                        <Input type="text" placeholder="litzensiya kiriting"  {...register('license')} name='license'
                                            error={errors.license?.message?.toString() || hasError?.errors?.license?.toString()}
                                        />
                                    </div>
                                    <div className="col-8 mb-1">
                                        <label className="form-label">sayt</label>
                                        <Input type="text" placeholder="sayt kiriting"  {...register('site_url')} name='site_url'
                                            error={errors.site_url?.message?.toString() || hasError?.errors?.site_url?.toString()}
                                        />
                                    </div>
                                    <div className="col-4 mb-1">
                                        <label className="form-label">telegram_id </label>
                                        <Input type="text" placeholder="telegram_id  kiriting"  {...register('telegram_id')} name='telegram_id'
                                            error={errors.telegram_id?.message?.toString() || hasError?.errors?.telegram_id?.toString()}
                                        />
                                    </div>
                                    <div className="col-4 mb-1">
                                        <label className="form-label">O'chish sansi </label>
                                        <Input type="date"  {...register('off_date')} name='off_date'
                                            error={errors.off_date?.message?.toString() || hasError?.errors?.off_date?.toString()}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="divider text-start-center">
                            <div className="divider-text">2-qadam (Direktor)</div>
                        </div>
                        <div className="row">
                            <div className="col-3">
                                <div className="d-flex  justify-content-center  align-items-center gap-4">
                                    <div className="button-wrapper">
                                        <label htmlFor="user_photo" className="cursor-pointer position-relative border rounded" tabIndex={0}
                                        >
                                            <img src={
                                                choiseFile?.length > 0 ? `${domain}/storage${choiseFile.trim()}` :
                                                    files?.user_photo == null ? data?.user_photo?.length > 0 ? `${domain}${data?.user_photo}` : uploadFileIcon : URL.createObjectURL(files?.user_photo)
                                            } alt="user-avatar" className="d-block rounded object-contain" height={100} width={100} id="uploadedAvatar" />
                                            <input
                                             required={data?.id > 0 ? false : true}
                                                onChange={(e: any) => {
                                                    if (e.target.files[0]) {
                                                        setChoiseFile('')
                                                        setValue('user_check', 1, {
                                                            shouldValidate: true,
                                                        });
                                                        setFiles(() => {
                                                            return {
                                                                ...files,
                                                                user_photo: e.target.files[0]
                                                            }
                                                        })
                                                    }
                                                }}
                                                type="file"   id="user_photo" className="account-file-input opacity-0 position-absolute top-0 left-0  "  accept="image/png, image/jpeg" />
                                        </label>
                                    </div>
                                    <div>
                                        <p>Rasmi</p>

                                        <button
                                            onClick={() => {
                                                setValue('user_check', '', {
                                                    shouldValidate: false,
                                                });
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
                                <input type="hidden" {...register('user_check')} name='user_check' />
                                <ErrorInput>
                                    {errors.user_check?.message?.toString() || hasError?.errors?.user_check?.toString()}
                                </ErrorInput>
                            </div>
                            <div className="col-9">
                                <div className="row">
                                    <div className="col-8 mb-1">
                                        <label className="form-label">I.F</label>
                                        <Input type="text" placeholder="I.F kiriting"  {...register('full_name')} name='full_name'
                                            error={errors.full_name?.message?.toString() || hasError?.errors?.full_name?.toString()}
                                        />
                                    </div>
                                    <div className="col-4 mb-1">
                                        <label className="form-label">Telefon </label>
                                        {/* <Input type="number" placeholder="Telefon raqam kiriting"  {...register('phone')} name='phone'
                                    error={errors.phone?.message?.toString() || hasError?.errors?.phone?.toString()}
                                /> */}
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
                                    <div className="col-12 mb-1">
                                        <label className="form-label">Parol</label>
                                        <Input type="password" placeholder="******"  {...register('password')} name='password'
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

        </>
    )
}

export default KlinkaAdd