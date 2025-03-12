import React, { useEffect, useState } from 'react'
// import Layout from '../layouts/Layout'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../service/store/store';
import { query } from '../../../componets/api/Query';
import { isReferringDoctorAdd, isReferringDoctorEdit, isReferringDoctorDefaultApi } from '../../../service/reducer/ReferringDoctorReducer';
import { ReducerType } from '../../../interface/interface';
import Loader from '../../../componets/api/Loader';
import { isFindFunction } from '../../../service/reducer/MenuReducer';
import Select from 'react-select';
import Input from '../../../componets/inputs/Input';
import { NumericFormat, PatternFormat } from 'react-number-format';
import ErrorInput from '../../../componets/inputs/ErrorInput';

import axios from 'axios';
import { domain } from '../../../main';
import { set } from 'date-fns';
import { nanoid } from '@reduxjs/toolkit';
import { fullName } from '../../../helper/fullName';
// import { isAddReferringDoctor, isEditReferringDoctor } from '../../service/reducer/ReferringDoctorReducer';
const ReferringDoctorService = ({ data, modal, setModal, setData = function () { }, resetItem = false }: { setData?: any, data?: any, modal?: boolean; setModal?: any, resetItem?: boolean }) => {
    const [choiseFile, setChoiseFile] = useState('')
    const [file, setFile] = useState(null) as any;
    const [files, setFiles] = useState({
        logo_photo: null,
        blank_file: null,
        user_photo: null
    }) as any;
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
    const { findData } = useSelector((state: ReducerType) => state.MenuReducer)
    const { isLoading, sendLoading, isSuccessApi, hasError } = useSelector((state: ReducerType) => state.ReferringDoctorReducer)
    const [sendData, setSendData] = useState([] as any)
    const dispatch = useDispatch<AppDispatch>()
    const schema = yup
        .object()
        .shape({
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
            first_name: yup.string().required("Familiyasi kiriting!"),
            last_name: yup.string().required("Ismi kiriting!"),
            workplace: yup.string().required("Ish joyi kiriting!"),
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
            setSendData(() => data?.contribution ?? [])

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
            dispatch(isReferringDoctorDefaultApi())
        }
    }, [modal, data, isLoading, isSuccessApi])
    const toggle = () => {
        setModal(!modal)
        setEnter(() => false)
    };
    /*************  ✨ Codeium Command ⭐  *************/
    /******  499dd124-7486-4159-b690-085dd91135e2  *******/
    const send = (e: any) => {
        // if (id?.toString()?.length ?? 0 > 0) {
        //   dispatch(isProductEdit({ query: query({ ...data, product_value: JSON.stringify(product_values) }, ['photo']), file: file, id: id }))
        // } else {
        //   dispatch(isProductAdd({ query: query({ ...data, product_value: JSON.stringify(product_values) }, ['photo']), file: file }))
        // }
        if (data?.id?.toString()?.length ?? 0 > 0) {
            dispatch(isReferringDoctorEdit({
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
            dispatch(isReferringDoctorAdd({
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
    const [selectData, setSelectData] = useState<any>({
        department_id: false,
        name: ''
    });
    const [loading, setLoading] = useState(false);
    const sendApi = async (e: any) => {
        try {
            console.log(e, 'e');

            setLoading(true)
            let fomrData = new FormData();
            fomrData.append('ref_doc_service_contribution', JSON.stringify(e));
            let res = await axios.post('/referring-doctor/service/' + data?.id, fomrData)
            const { result } = res.data;
            setData(() => { })
            setAllPrice(() => 0)
            setSendData(() => [])
            setSelectData(() => {
                return {
                    department_id: false
                }
            })
            toggle()

        } catch (error) {

        }
        finally {
            setLoading(false)
        }
    }
    const [allPrice, setAllPrice] = useState(0 as any);
    return (
        <>
            <Loader loading={loading} />
            <Modal centered={true} isOpen={modal} toggle={toggle} role='dialog' size='xl' backdrop="static" keyboard={false} >
                <form onSubmit={handleSubmit(send)} className='size_16'>
                    <div className="modal-header">

                        <h5 className="modal-title" id="modalCenterTitle">
                            <b>
                                shifokor:{fullName(data?.user)}
                            </b>
                            <br />
                            Xizmatlar
                        </h5>
                        <button onClick={toggle} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body">
                        <div className="row">
                            <div className="col-12">
                                <label className="form-label">Xizmat nomi</label>
                                <input type="text" className='form-control'
                                    onChange={(e: any) => {
                                        setSelectData({
                                            ...selectData,
                                            name: e.target.value
                                        })
                                    }}
                                    value={selectData?.name}

                                />
                            </div>
                            <div className="col-6">
                                <label className="form-label">Bo'lim nomi</label>
                                <input type="hidden" {...register('department_id')} name='department_id' />
                                <div className="d-flex">
                                    <div className="w-100">

                                        <Select
                                            // isDisabled={data?.department?.id>0 ? true : false}
                                            name='name3'
                                            value={selectData?.department_id}
                                            onChange={(e: any) => {
                                                setSelectData({
                                                    ...selectData,
                                                    department_id: e
                                                })
                                            }}
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                            // value={userBranch}
                                            options={
                                                [
                                                    {
                                                        value: 0,
                                                        label: 'Barchasi'
                                                    },
                                                    ...dataSelect(
                                                        [
                                                            ...new Set(data?.service?.map((item: any) => item?.department.id))
                                                        ]?.map((res: any) => {
                                                            return data?.service?.find((item: any) => item?.department.id === res)?.department
                                                        })

                                                        // data?.service?.map((item: any) => item?.department)

                                                    )]
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
                            <div className="col-6">
                                <label className="form-label">Umumiy ulushi</label>
                                <NumericFormat
                                    value={allPrice}
                                    thousandSeparator
                                    required
                                    onChange={(e: any) => {
                                        let value = e.target.value.replace(/,/g, '')
                                        console.log(value);
                                        setAllPrice(value)
                                        setSendData(() => data?.service
                                            ?.filter((item: any) => item?.name?.trim()?.toLowerCase().includes(selectData?.name?.trim()?.toLowerCase()))
                                            ?.filter((item: any) => selectData?.department_id?.value > 0 ? item?.department.id == selectData?.department_id?.value : true)
                                            ?.map((item: any) => {
                                                return {
                                                    service_id: item?.id,
                                                    contribution_price: value
                                                }
                                            }))
                                    }
                                    }
                                    className='form-control'

                                />
                            </div>
                        </div>
                        <br />

                        <div>
                            <table className="table table-bordered " >
                                <thead>
                                    <tr>
                                        <th scope="col">№</th>
                                        <th scope="col">Bo'lim</th>
                                        <th scope="col">Nomi</th>
                                        <th scope="col">Ulushi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data?.service?.length > 0 ?
                                            data?.service
                                                ?.filter((item: any) => selectData?.department_id?.value > 0 ? item?.department.id == selectData?.department_id?.value : true)
                                                ?.filter((item: any) => item?.name?.toLowerCase().includes(selectData?.name?.toLowerCase()))


                                                ?.map((item: any, index: number) => {
                                                    let ulush = data?.contribution?.find((item2: any) => item?.id === item2?.service_id)
                                                    let aniq = sendData?.find((item2: any) => item2?.service_id === item?.id)
                                                    return (
                                                        <tr className=' hover-table' key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{item?.department?.name}</td>
                                                            <td>{item?.name}</td>
                                                            <td>
                                                                <NumericFormat
                                                                    value={`${aniq?.contribution_price}`.length > 0 ? aniq?.contribution_price : ulush?.contribution_price ?? 0}
                                                                    thousandSeparator
                                                                    required
                                                                    onChange={(e: any) => {
                                                                        let value = e.target.value.replace(/,/g, '')
                                                                        console.log(value);

                                                                        let findSend = sendData?.find((item2: any) => item2?.service_id === item?.id) as any
                                                                        if (findSend) {
                                                                            setSendData(() => sendData?.map((item2: any) => {
                                                                                if (item2?.service_id === item?.id) {
                                                                                    return {
                                                                                        ...item2,
                                                                                        contribution_price: value
                                                                                    }
                                                                                }
                                                                                return item2
                                                                            }))
                                                                        } else {
                                                                            setSendData(() => [...sendData, {
                                                                                contribution_price: value,
                                                                                service_id: item?.id
                                                                            }])
                                                                        }

                                                                    }
                                                                    }
                                                                    className='form-control w-auto'

                                                                />

                                                            </td>
                                                        </tr>
                                                    )
                                                }) : <tr>
                                                <td colSpan={3} className='text-center'>
                                                    Malumot mavjud emas
                                                </td>
                                            </tr>
                                    }
                                </tbody>
                            </table>
                        </div>

                    </div>
                    <div className="modal-footer">
                        <button
                            onClick={() => {
                                sendApi(sendData)
                            }}
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

export default ReferringDoctorService