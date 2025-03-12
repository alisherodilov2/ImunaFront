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
import { kounteragentCalcPriceTotal } from '../../../helper/userHelper';
// import { isAddUsers, isEditUsers } from '../../service/reducer/UsersReducer';
const UserSettingCounterparty = ({ data, modal, setModal, setData = function () { }, resetItem = false }: { setData?: any, data?: any, modal?: boolean; setModal?: any, resetItem?: boolean }) => {
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
            // ambulatory_service_id: yup.string().required("Ambulot reja servicsi kiriting!"),
            // treatment_service_id: yup.string().required("Muolja reja servicsi kiriting!"),
            treatment_plan_qty: yup.string().required("Muolja reja plan sonini kiriting!"),
            ambulatory_plan_qty: yup.string().required("Ambulot reja plan sonini kiriting!"),
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
        is_main: false,
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
                    is_main: +data?.is_main ? true : false,

                }
            )
            // setValue('ambulatory_service_id', data?.ambulatory_service?.id, {
            //     shouldValidate: true,
            // });
            // setValue('treatment_service_id', data?.treatment_service?.id, {
            //     shouldValidate: true,
            // });
            setSelectData(() => {
                return {
                    ...selectData,
                    treatment_service_id: data?.user_counterparty_plan
                        ?.filter((item: any) => item?.status === 'treatment')?.map((res: any) => {
                            return {
                                value: res?.service_id, label: res?.service?.name,
                                data: res?.service
                            }
                        }),
                    ambulatory_service_id: data?.user_counterparty_plan
                        ?.filter((item: any) => item?.status === 'ambulatory')?.map((res: any) => {
                            return {
                                value: res?.service_id, label: res?.service?.name,
                                data: res?.service
                            }
                        }),
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
            setCheckbox(
                {
                    is_main: false,

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
                is_main: false,

            }
        )
    };
    const send = (e: any) => {
        dispatch(isUsersEdit({
            query: queryObj({
                ambulatory_plan_qty: `${e.ambulatory_plan_qty}`,
                treatment_plan_qty: `${e.treatment_plan_qty}`,
                is_main: `${checkbox.is_main ? 1 : 0}`,
                user_counterparty_plan: JSON.stringify(
                    [
                        ...selectData?.ambulatory_service_id?.map((res: any) => {
                            return {
                                service_id: res?.value,
                                status: 'ambulatory'
                            }   
                        }),
                        ...selectData?.treatment_service_id?.map((res: any) => {
                            return {
                                service_id: res?.value,
                                status: 'treatment'
                            }
                        }),
                    ]
                ),
                ambulatory_service_id: selectData?.ambulatory_service_id?.at(0)?.value,
                treatment_service_id: selectData?.treatment_service_id?.at(0)?.value,
                counterparty_setting: '1'
            })
            ,
            file: files
            , id: data?.id
        }))
    }
    const { templateData } = useSelector((state: ReducerType) => state.TemplateReducer)
    const { serviceData } = useSelector((state: ReducerType) => state.ServiceReducer)

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
                        <div className="mb-1">
                            <div className='d-flex gap-2 align-items-center'>
                                <label htmlFor="is_cash_reg">Asosiy</label>
                                <div className="form-check ">
                                    <input className="form-check-input float-end" type="checkbox" role="switch"
                                        checked={+checkbox?.is_main ? true : false}
                                        onChange={(e: any) => {
                                            console.log(+e.target.checked);
                                            setCheckbox({
                                                ...checkbox,
                                                is_main: e.target.checked
                                            })
                                            setValue('is_main', e.target.checked ? '1' : '0', {
                                                shouldValidate: false,
                                            })

                                        }}

                                    />
                                </div>


                            </div>
                        </div>
                        <div className="mb-1">
                            <label className="form-label">Ambulot reja</label>
                            <div className='row'>
                                <div className="col-lg-8 col-12 my-2">
                                    <Select
                                        // isDisabled={data?.department?.id>0 ? true : false}
                                        name='name3'
                                        isMulti
                                        required
                                        value={selectData?.ambulatory_service_id}
                                        onChange={(e: any) => {
                                            setSelectData({
                                                ...selectData,
                                                ambulatory_service_id: e
                                            })
                                            // setValue('ambulatory_service_id', e?.value)
                                        }}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        // value={userBranch}
                                        options={
                                            [

                                                ...dataSelect(serviceData)]
                                        } />
                                    <ErrorInput>
                                        {errors.ambulatory_service_id?.message?.toString() || hasError?.errors?.ambulatory_service_id?.toString()}
                                    </ErrorInput>
                                </div>
                                <div className="col-lg-2 col-6 my-2">
                                    <input type="hidden" {...register('ambulatory_plan_qty')} name='ambulatory_plan_qty' />
                                    <NumericFormat
                                        value={getValues('ambulatory_plan_qty')}
                                        thousandSeparator
                                        onChange={(e: any) => {

                                            setValue('ambulatory_plan_qty', e.target.value.replace(/,/g, ''), {
                                                shouldValidate: true,
                                            });

                                        }}
                                        className='form-control'
                                    />
                                    <ErrorInput>
                                        {errors.ambulatory_plan_qty?.message?.toString() || hasError?.errors?.ambulatory_plan_qty?.toString()}
                                    </ErrorInput>
                                </div>
                                <div className="col-lg-2  col-6 my-2">
                                    <NumericFormat
                                        value={getValues('ambulatory_plan_qty') * (selectData?.ambulatory_service_id?.at(0)?.data?.price)}
                                        disabled
                                        thousandSeparator

                                        className='form-control'
                                    />
                                </div>
                            </div>

                        </div>
                        <div className="mb-1">
                            <label className="form-label">Muolja reja</label>
                            <div className='row'>
                                <div className="col-lg-8 col-12 my-2">
                                    <Select
                                        // isDisabled={data?.department?.id>0 ? true : false}
                                        name='name3'
                                        value={selectData?.treatment_service_id}
                                        isMulti
                                        required
                                        onChange={(e: any) => {
                                            setSelectData({
                                                ...selectData,
                                                treatment_service_id: e
                                            })

                                        }}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        // value={userBranch}
                                        options={
                                            [

                                                ...dataSelect(serviceData)]
                                        } />
                                    <ErrorInput>
                                        {errors.treatment_service_id?.message?.toString() || hasError?.errors?.treatment_service_id?.toString()}
                                    </ErrorInput>
                                </div>
                                <div className="col-lg-2 col-6 my-2">
                                    <input type="hidden" {...register('treatment_plan_qty')} name='treatment_plan_qty' />
                                    <NumericFormat
                                        value={getValues('treatment_plan_qty')}
                                        thousandSeparator
                                        onChange={(e: any) => {
                                            setValue('treatment_plan_qty', e.target.value.replace(/,/g, ''), {
                                                shouldValidate: true,
                                            });

                                        }}
                                        className='form-control'
                                    />
                                    <ErrorInput>
                                        {errors.treatment_plan_qty?.message?.toString() || hasError?.errors?.treatment_plan_qty?.toString()}
                                    </ErrorInput>
                                </div>
                                <div className="col-lg-2 col-6 my-2">
                                    <NumericFormat
                                        value={getValues('treatment_plan_qty') * (selectData?.treatment_service_id?.at(0)?.data)?.price}
                                        disabled
                                        thousandSeparator

                                        className='form-control'
                                    />
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

export default UserSettingCounterparty