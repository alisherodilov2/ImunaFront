import React, { useEffect, useState } from 'react'
// import Layout from '../layouts/Layout'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../../service/store/store';
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
import { isTreatmentEdit } from '../../../../service/reducer/TreatmentReducer';
// import { isAddUsers, isEditUsers } from '../../service/reducer/UsersReducer';
const TreatmentServiceItem = ({ data, modal, setModal, setData = function () { }, resetItem = false }: { setData?: any, data?: any, modal?: boolean; setModal?: any, resetItem?: boolean }) => {
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
    const { isLoading, sendLoading, isSuccessApi, hasError } = useSelector((state: ReducerType) => state.TreatmentReducer)
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
        is_shikoyat: false,
        is_diagnoz: false,
        is_payment: false,
        is_editor: false
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

        if (data?.treatment_service_item?.length > 0) {
            setTreatmentServiceItem(() => data?.treatment_service_item?.map((item: any) => {
                return {
                    value: item?.service.id, label: item?.service?.name, data: item.service
                }
            }))
        }
        if (isSuccessApi) {
            setTreatmentServiceItem(() => [])
            setData(() => { })
            setModal(enter)
            setCheckbox(
                {
                    is_diagnoz: false,
                    is_shikoyat: false,
                    is_payment: false,
                    is_editor: false
                }
            )
            dispatch(isUsersDefaultApi())
        }
    }, [modal, data, isLoading, isSuccessApi])
    const toggle = () => {
        setModal(!modal)
        setEnter(() => false)
        setTreatmentServiceItem(() => [])
        setCheckbox(
            {
                is_diagnoz: false,
                is_shikoyat: false,
                is_payment: false,
                is_editor: false
            }
        )
    };
    const [treatmentServiceItem, setTreatmentServiceItem] = useState([])
    const send = (e: any) => {
        dispatch(isTreatmentEdit({
            query: queryObj({
                is_setting: '1',
                treatment_service_item: JSON.stringify(treatmentServiceItem),
            }), id: data?.id
        }))
    }
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
                        <Select
                            // isDisabled={data?.department?.id>0 ? true : false}
                            name='name3'
                            value={treatmentServiceItem}
                            isMulti
                            onChange={(e: any) => {
                                setTreatmentServiceItem(e)
                            }}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            // value={userBranch}
                            options={
                                dataSelect(serviceData)
                            } />
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

export default TreatmentServiceItem