import React, { useEffect, useRef, useState } from 'react'
// import Layout from '../layouts/Layout'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { useForm } from "react-hook-form";
import Select from 'react-select';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../service/store/store';
import { query, queryObj } from '../../componets/api/Query';
import { isBranchAdd, isBranchEdit, isBranchDefaultApi } from '../../service/reducer/BranchReducer';
import { ReducerType } from '../../interface/interface';
import Loader from '../../componets/api/Loader';
import { isFindFunction } from '../../service/reducer/MenuReducer';
import Input from '../../componets/inputs/Input';
import { NumericFormat, PatternFormat } from 'react-number-format';
import ErrorInput from '../../componets/inputs/ErrorInput';
import axios from 'axios';
import { MdDeleteForever } from 'react-icons/md';
import Swal from 'sweetalert2';
import { json } from 'react-router-dom';
import KlinkaAdd from '../klinka/KlinkaAdd';
// import { isAddBranch, isEditBranch } from 'service/reducer/BranchReducer';
const BranchAdd = ({ data, modal, setModal, setData = function () { }, resetItem = false }: { setData?: any, data?: any, modal?: boolean; setModal?: any, resetItem?: boolean }) => {
    const { branchData } = useSelector((state: ReducerType) => state.BranchReducer)
    const [modal2, setModal2] = useState(false)
    const { isLoading, sendLoading, isSuccessApi, hasError } = useSelector((state: ReducerType) => state.BranchReducer)
    const dispatch = useDispatch<AppDispatch>()
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
            main_branch_id: yup.string().required("Bosh filial kiriting!"),
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
    const { klinkaData } = useSelector((state: ReducerType) => state.KlinkaReducer)

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
            setSelectData(() => {
                return {
                    branch_id: data?.branch_items
                        ?.map((res: any) => {
                            return {
                                value: res?.target_branch?.id,
                                label: res?.target_branch?.name,
                                data: res?.target_branch

                            }
                        }),
                    main_branch_id: {
                        value: data?.main_branch_id,
                        label: data?.main_branch?.name,
                        data: data?.main_branch
                    }
                }
            })


        } else {
            let s = getValues(), resetObj = {};
            for (let key in getValues()) {
                resetObj = {
                    ...resetObj, [key]: ''
                }
            }
            setBranchValue(() => [])
            setSelectData(() => {
                return {
                    branch_id: [],
                    main_branch_id: false
                }
            })
            reset(
                resetObj
            )
        }
        if (isSuccessApi) {
            setSelectData(() => {
                return {
                    branch_id: [],
                    main_branch_id: false
                }
            })
            setData(() => { })
            setModal(enter)
            dispatch(isBranchDefaultApi())
        }
    }, [modal, data, isLoading, isSuccessApi])
    const toggle = () => {
        setModal(!modal)
        setEnter(() => false)
        setData(() => { })
        setSelectData(() => {
            return {
                branch_id: [],
                main_branch_id: false
            }
        })
    };
    const [branchValue, setBranchValue] = useState<any>([])
    const send = (e: any) => {
        // if (id?.toString()?.length ?? 0 > 0) {
        //   dispatch(isProductEdit({ query: query({ ...data, product_value: JSON.stringify(product_values) }, ['photo']), file: file, id: id }))
        // } else {
        //   dispatch(isProductAdd({ query: query({ ...data, product_value: JSON.stringify(product_values) }, ['photo']), file: file }))
        // }
        if (selectData?.branch_id?.length > 0) {

            if (data?.id?.toString()?.length ?? 0 > 0) {

                dispatch(isBranchEdit({ query: queryObj({ ...data, ...e, branch_id: JSON.stringify(selectData?.branch_id?.map((item: any) => item?.value)) }), id: data?.id }))
                /////// dispatch(isCostEdit(data)) 
            } else {
                dispatch(isBranchAdd({ query: queryObj({ ...data, ...e, branch_id: JSON.stringify(selectData?.branch_id?.map((item: any) => item?.value)) }) }))
            }
        } else {
            alert("filiallar tanlang!")
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
            <Modal centered={true} isOpen={modal} toggle={toggle} role='dialog' size='lg' backdrop="static" keyboard={false}>
                <form onSubmit={handleSubmit(send)} className="size_16">
                    <div className="modal-header">
                        <h5 className="modal-title" id="modalCenterTitle">{data?.id?.length > 0 ? 'Filialni tahrirlash' : "Filial qo'shish"}</h5>
                        <button onClick={toggle} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body">
                        <div className="col-12 mb-1">
                            <label className="form-label">Bosh shifoxona</label>
                            <input type="hidden" {...register('main_branch_id')} name='main_branch_id' />
                            <div className="d-flex">
                                <div className="w-100">
                                    <Select
                                        name='name3'
                                        value={selectData?.main_branch_id}
                                        onChange={(e: any) => {
                                            setSelectData({
                                                ...selectData,
                                                main_branch_id: e,
                                            })

                                            setValue('main_branch_id', e.value, {
                                                shouldValidate: true,
                                            });
                                        }}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        // value={userBranch}
                                        options={
                                            dataSelect(klinkaData?.filter((item: any) => !new Set(
                                                [
                                                    ...branchData

                                                        ?.flatMap(((res: any) => res?.branch_items))?.map((res: any) => res.target_branch_id),
                                                    ...branchData?.map((res: any) => res?.main_branch_id),

                                                ]?.filter((res: any) => data?.id > 0 ? res != data?.main_branch_id : true)
                                            ).has(item?.id)
                                            )


                                            )


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
                                {errors.main_branch_id?.message?.toString() || hasError?.errors?.main_branch_id?.toString()}
                            </ErrorInput>
                        </div>
                        <div className="col-12 mb-1">
                            <label className="form-label">Filiallar</label>
                            <div className="d-flex">
                                <div className="w-100">
                                    <Select
                                        name='name3'
                                        isMulti
                                        value={selectData?.branch_id}
                                        onChange={(e: any) => {
                                            setSelectData({
                                                ...selectData,
                                                branch_id: e
                                            })
                                            setValue('branch_id', JSON.stringify(e), {
                                                shouldValidate: true,
                                            });
                                        }}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        // value={userBranch}
                                        options={
                                            dataSelect(klinkaData
                                                ?.filter((item: any) => !new Set(
                                                    [
                                                        ...branchData
                                                            ?.filter((res: any) => data?.id > 0 ? res?.main_branch_id != data?.main_branch_id : true)
                                                            ?.flatMap(((res: any) => res?.branch_items))?.map((res: any) => res.target_branch_id),
                                                        ...branchData?.map((res: any) => res?.main_branch_id),

                                                    ]
                                                ).has(item?.id)
                                                )
                                                ?.filter((item: any) => selectData?.main_branch_id?.value > 0 ? item?.id != selectData?.main_branch_id?.value : true))
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
                                {errors.branch_id?.message?.toString() || hasError?.errors?.branch_id?.toString()}
                            </ErrorInput>
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
            <KlinkaAdd
                modal={modal2} setModal={setModal2}
            />

        </>
    )
}

export default BranchAdd