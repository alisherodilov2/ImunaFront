import React, { useEffect, useRef, useState } from 'react'
// import Layout from 'layouts/Layout'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../service/store/store';
import { query, queryObj } from '../../../componets/api/Query';
import { isDoctorTemplateAdd, isDoctorTemplateEdit, isDoctorTemplateDefaultApi } from '../../../service/reducer/DoctorTemplateReducer';
import { ReducerType } from '../../../interface/interface';
import Loader from '../../../componets/api/Loader';
import { isFindFunction } from '../../../service/reducer/MenuReducer';
import Input from '../../../componets/inputs/Input';
import { NumericFormat, PatternFormat } from 'react-number-format';
import ErrorInput from '../../../componets/inputs/ErrorInput';
import axios from 'axios';
import { CKEditor } from 'ckeditor4-react';
import { MdDeleteForever } from 'react-icons/md';
import Swal from 'sweetalert2';
import { json } from 'react-router-dom';
import { domain } from '../../../main';
// import { isAddDoctorTemplate, isEditDoctorTemplate } from '../service/reducer/DoctorTemplateReducer';
const DoctorTemplateAdd = ({ data, modal, setModal, setData = function () { }, resetItem = false }: { setData?: any, data?: any, modal?: boolean; setModal?: any, resetItem?: boolean }) => {
    const { findData } = useSelector((state: ReducerType) => state.MenuReducer)
    
    const APi_url = domain + '/api/v3/file-upload'

    const { isLoading, sendLoading, isSuccessApi, hasError } = useSelector((state: ReducerType) => state.DoctorTemplateReducer)
    const dispatch = useDispatch<AppDispatch>()
    const schema = yup
        .object()
        .shape({
            name: yup.string().required("Bo'lim nomi kiriting!"),
            data: yup.string().required("Bo'lim nomi kiriting!"),

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
            setDoctorTemplateValue(() => data?.doctorTemplate_value)


        } else {
            let s = getValues(), resetObj = {};
            for (let key in getValues()) {
                resetObj = {
                    ...resetObj, [key]: ''
                }
            }
            setDoctorTemplateValue(() => [])

            reset(
                resetObj
            )
        }
        if (isSuccessApi) {
            setData(() => { })
            setModal(enter)
            let s = getValues(), resetObj = {};
            for (let key in getValues()) {
                resetObj = {
                    ...resetObj, [key]: ''
                }
            }
            setDoctorTemplateValue(() => [])

            reset(
                resetObj
            )
            dispatch(isDoctorTemplateDefaultApi())
        }
    }, [modal, data, isLoading, isSuccessApi])
    const toggle = () => {
        setModal(!modal)
        let s = getValues(), resetObj = {};
            for (let key in getValues()) {
                resetObj = {
                    ...resetObj, [key]: ''
                }
            }
            setDoctorTemplateValue(() => [])

            reset(
                resetObj
            )
        setEnter(() => false)
    };
    const [doctorTemplateValue, setDoctorTemplateValue] = useState<any>([])
    const send = (e: any) => {
        // if (id?.toString()?.length ?? 0 > 0) {
        //   dispatch(isProductEdit({ query: query({ ...data, product_value: JSON.stringify(product_values) }, ['photo']), file: file, id: id }))
        // } else {
        //   dispatch(isProductAdd({ query: query({ ...data, product_value: JSON.stringify(product_values) }, ['photo']), file: file }))
        // }
        if (data?.id?.toString()?.length ?? 0 > 0) {
            dispatch(isDoctorTemplateEdit({ query: queryObj({ ...data, ...e, }), id: data?.id }))
            /////// dispatch(isCostEdit(data)) 
        } else {
            dispatch(isDoctorTemplateAdd({ query: queryObj({ ...data, ...e, }) }))
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
                        <h5 className="modal-title" id="modalCenterTitle">{data?.id?.length > 0 ? 'Bo`lim ' : "Bo`lim qo'shish"}</h5>
                        <button onClick={toggle} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body">
                        <div className='row' >
                            <div className="col-12 mb-1">
                                <label className="form-label">Bo'lim nomi</label>
                                <Input type="text" placeholder="Bo'lim nomi"  {...register('name')} name='name'
                                    error={errors.name?.message?.toString() || hasError?.errors?.name?.toString()}
                                />

                            </div>
                            <div className="col-12 mb-1">
                                <label className="form-label">Bo'lim nomi</label>
                                {
                                    <CKEditor
                                        className='form-control'
                                        debug={true}
                                        editorUrl="https://cdn.ckeditor.com/4.22.1/full-all/ckeditor.js"
                                        initData={`${data?.id > 0 ? data?.data : ''}`}
                                        config={
                                            {
                                                allowedContent: true,
                                                uploadUrl: APi_url,
    
                                                filebrowserUploadUrl: APi_url,
                                                filebrowserImageUploadUrl: APi_url,
                                                on: {
                                                    change: (event: any) => {
                                                        const data = event.editor.getData(); // CKEditor 
                                                        setValue('data', data, {
                                                            shouldValidate: true,
                                                        });
                                                    },
                                                }
                                            }
    
                                        }
    
                                        name="my-ckeditor"
    
                                        style={{ borderColor: 'blue' }
                                        }
                                        type="classic"
                                    />  
                                }
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

export default DoctorTemplateAdd