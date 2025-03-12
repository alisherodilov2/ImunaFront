import React, { useEffect, useRef, useState } from 'react'
// import Layout from '../layouts/Layout'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../../service/store/store';
import { query } from '../../../../componets/api/Query';
import { isServiceAdd, isServiceEdit, isServiceDefaultApi } from '../../../../service/reducer/ServiceReducer';
import { ReducerType } from '../../../../interface/interface';
import Loader from '../../../../componets/api/Loader';
import { isFindFunction } from '../../../../service/reducer/MenuReducer';
import Input from '../../../../componets/inputs/Input';
import { NumericFormat, PatternFormat } from 'react-number-format';
import ErrorInput from '../../../../componets/inputs/ErrorInput';
import Select from 'react-select';
import axios from 'axios';
import { MdDeleteForever } from 'react-icons/md';
import Swal from 'sweetalert2';
import { json } from 'react-router-dom';
import DepartmentAdd from '../department/DepartmentAdd';
import ServiceTypeAdd from '../service-type/ServiceTypeAdd';
import Table from '../../../../componets/table/Table';
// import { isAddService, isEditService } from '../../service/reducer/ServiceReducer';
const ServiceSetting = ({ data, modal, setModal, setData = function () { }, resetItem = false }: { setData?: any, data?: any, modal?: boolean; setModal?: any, resetItem?: boolean }) => {
    const { departmentData, } = useSelector((state: ReducerType) => state.DepartmentReducer)
    const { serviceTypeData } = useSelector((state: ReducerType) => state.ServiceTypeReducer)

    const [modal2, setModal2] = useState(false)
    const [modal3, setModal3] = useState(false)
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
    const { isLoading, sendLoading, isSuccessApi, hasError } = useSelector((state: ReducerType) => state.ServiceReducer)
    const dispatch = useDispatch<AppDispatch>()
    const schema = yup
        .object()
        .shape({
            // department_id: yup.string().required("Bo'lim nomi kiriting!"),
            // name: yup.string().required("Xizmat nomi kiriting!"),
            // price: yup.string().required("Narxi kiriting!"),
            // doctor_contribution_price: yup.string().required("Doktor ulushi kiriting!"),
            // kounteragent_contribution_price: yup.string().required("Kounteragent ulushi kiriting!"),
            // kounteragent_doctor_contribution_price: yup.string().required("Kounterdoktor ulushi kiriting!"),
            // servicetype_id: yup.string().required("Xizmat turi kiriting!"),

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
    const valueMap = (data: any) => {
        if (data?.length > 0) {
            return data?.map((item: any) => {
                return {
                    qty: item?.qty,
                    value: item?.product_id,
                    data: item.product,
                    label: item?.product?.name
                }
            })
        }
        return []
    }
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
            setServiceValue(() => [])

            setSelectData(() => {
                return false
            })
            reset(
                resetObj
            )


        }
        if (Object.keys(data ?? {})?.length > 0) {

            if (data?.service_product?.length > 0) {
                setServiceProduct(() => valueMap(data?.service_product))
            }

        } else {
            let s = getValues(), resetObj = {};
            for (let key in getValues()) {
                resetObj = {
                    ...resetObj, [key]: ''
                }
            }
            setServiceValue(() => [])
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
            dispatch(isServiceDefaultApi())
        }
    }, [modal, data, isLoading, isSuccessApi])
    const toggle = () => {
        setModal(!modal)
        setEnter(() => false)
        setData(() => { })
        setServiceProduct(() => [])
    };
    const [serviceProduct, setServiceProduct] = useState<any>([])
    const [serviceValue, setServiceValue] = useState<any>([])
    const send = (e: any) => {
        // if (id?.toString()?.length ?? 0 > 0) {
        //   dispatch(isProductEdit({ query: query({ ...data, product_value: JSON.stringify(product_values) }, ['photo']), file: file, id: id }))
        // } else {
        //   dispatch(isProductAdd({ query: query({ ...data, product_value: JSON.stringify(product_values) }, ['photo']), file: file }))
        // }
        dispatch(isServiceEdit({
            query: query({
                ...data, ...e, probirka: `${e?.probirka ? 0 : 1}`, service_product_status: '1', service_product: JSON.stringify(serviceProduct?.map((item: any) => {
                    return {
                        value: item?.value,
                        qty: item?.qty
                    }
                }))
            }), id: data?.id
        }))
        /////// dispatch(isCostEdit(data)) 

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

    const { productData } = useSelector((state: ReducerType) => state.ProductReducer)
    useEffect(() => {
        if (isSuccessApi) {
            setData(() => { })
            setModal(!modal)
            setEnter(() => false)
            setData(() => { })
            setServiceProduct(() => [])
        }
    }, [modal, data, isLoading, isSuccessApi])
    return (
        <>
            <Loader loading={sendLoading} />
            <Modal centered={true} isOpen={modal} toggle={toggle} role='dialog' size='xl' backdrop="static" keyboard={false}>
                <form onSubmit={handleSubmit(send)} className="size_16">
                    <div className="modal-header">
                        <h5 className="modal-title" id="modalCenterTitle">Maxsulot biriktirish</h5>
                        <button onClick={toggle} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body">
                        <div className="row">
                            <div className="col-8">
                                <div className="card" style={{
                                    height: `${window.innerHeight / 1.7}px`,
                                    overflow: 'auto'
                                }}>
                                    <Table

                                        paginationRole={false}
                                        isLoading={false}
                                        isSuccess={true}
                                        top={100}
                                        scrollRole={true}

                                        localEditFunction={(e: any) => {
                                            // setItem(() => {
                                            //     return {
                                            //         ...e,
                                            //         product_reception_id: data?.id
                                            //     }
                                            // })
                                            console.log();
                                            setModal2(true)
                                        }}
                                        extraKeys={[
                                            // 'id_',
                                            'name_',
                                            'qty_',
                                        ]}
                                        localDelete={true}
                                        localFunction={true}
                                        deleteLocalFunction={(e: any) => {
                                            console.log('e', e);
                                            // deleteItem(e, data?.id)
                                        }}
                                        columns={[

                                            {
                                                title: 'Nomi',
                                                key: 'name_',
                                                render: (value: any, data: any) => {
                                                    return <>
                                                        {value?.data?.name}
                                                    </>
                                                }
                                            },

                                            {
                                                title: 'Soni',
                                                key: 'qty_',
                                                render: (value: any, data: any) => {
                                                    return <div className="d-flex">
                                                        <div className="btn-group" role="group" aria-label="Basic example">
                                                            <button type="button" className="btn btn-danger btn-sm"
                                                                onClick={() => {
                                                                    // setClientValue(() => {
                                                                    //     return clinetValue?.map((res: any) => {
                                                                    //         if (res?.id == item?.id) {
                                                                    //             return {
                                                                    //                 ...res,
                                                                    //                 qty: res?.qty > 1 ? res?.qty - 1 : 1
                                                                    //             }
                                                                    //         }
                                                                    //         return res
                                                                    //     })
                                                                    // })
                                                                    setServiceProduct(() => {
                                                                        return serviceProduct?.map((res: any) => {
                                                                            if (value?.value == res?.value) {
                                                                                return {
                                                                                    ...res,
                                                                                    qty: +res?.qty > 1 ? +res?.qty - 1 : 1
                                                                                }
                                                                            }
                                                                            return res
                                                                        })
                                                                    })
                                                                }}

                                                            >-</button>
                                                            <button type="button" className="btn  btn-sm"><NumericFormat displayType="text"
                                                                thousandSeparator
                                                                decimalScale={2}
                                                                value={value?.qty ?? 1} />
                                                            </button>
                                                            <button type="button"
                                                                //  disabled={item?.status == 'old' ? true : false}
                                                                className="btn btn-success btn-sm"
                                                                onClick={() => {
                                                                    setServiceProduct(() => {
                                                                        return serviceProduct?.map((res: any) => {
                                                                            if (value?.value == res?.value) {
                                                                                return {
                                                                                    ...res,
                                                                                    qty: +(res?.qty ?? 1) + 1
                                                                                }
                                                                            }
                                                                            return res
                                                                        })
                                                                    })
                                                                    // setClientValue(() => {
                                                                    //     return clinetValue?.map((res: any) => {
                                                                    //         if (res?.id == item?.id) {
                                                                    //             return {
                                                                    //                 ...res,
                                                                    //                 qty: (res?.qty ?? 1) + 1
                                                                    //             }
                                                                    //         }
                                                                    //         return res
                                                                    //     })
                                                                    // })

                                                                }}


                                                            >+</button>
                                                        </div>
                                                        <button className=" btn btn-sm btn-danger"
                                                            type='button'

                                                            onClick={() => {


                                                                Swal.fire({
                                                                    title: "Ma'lumotni o'chirasizmi?",
                                                                    showDenyButton: true,
                                                                    showCancelButton: true,
                                                                    confirmButtonText: 'Ha',
                                                                    denyButtonText: `Yo'q`,
                                                                }).then((result: any) => {
                                                                    if (result.isConfirmed) {
                                                                        setServiceProduct(() =>
                                                                            serviceProduct?.filter((res: any) => value?.value != res?.value)
                                                                        )
                                                                        // })
                                                                        // setClientValue(() => clinetValue?.filter((res: any) => res.id != item.id))

                                                                        // setSelectData({
                                                                        //     ...selectData,
                                                                        //     service_id: selectData.service_id.filter((res: any) => res.value != item.id)
                                                                        // })
                                                                        Swal.fire({
                                                                            position: 'top-end',
                                                                            icon: 'success',
                                                                            title: "Malumot o'chirildi",
                                                                            showConfirmButton: false,
                                                                            timer: 2500
                                                                        })
                                                                    }
                                                                })
                                                            }}

                                                        >
                                                            <MdDeleteForever />
                                                        </button>
                                                    </div>

                                                }
                                            },


                                        ]}
                                        dataSource={
                                            serviceProduct
                                        }
                                    />
                                </div>
                            </div>
                            <div className="col-4">
                                <Select
                                    isMulti
                                    name='name3'
                                    value={serviceProduct}
                                    onChange={(e: any) => {
                                        let old = serviceProduct;
                                        let value = e
                                        if (value?.length == 0) {
                                            setServiceProduct(() => [])
                                        } else
                                            if (value?.length == old.length - 1) { //// delete
                                                // let deleteId = old?.find()
                                                let find = old.filter((item: any) => new Set(value?.map((res: any) => res?.value)).has(item?.value));
                                                setServiceProduct(() => find)

                                            } else if (value?.length == old.length + 1) { //// add
                                                let find = value.filter((item: any) => !new Set(old?.map((res: any) => res?.value)).has(item?.value));
                                                setServiceProduct(() => [...old, {
                                                    ...find[0],
                                                    qty: 1
                                                }])
                                            }
                                        // setServiceProduct(() => e)
                                        // setSelectData({
                                        //     ...selectData,
                                        //     product_id: e,
                                        //     product_category_id: {
                                        //         value: e.data?.prodcut_category?.id,
                                        //         label: e.data?.prodcut_category?.name
                                        //     }
                                        // })

                                        // setValue('product_id', e.value, {
                                        //     shouldValidate: true,
                                        // });
                                    }}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    // value={userBranch}
                                    options={

                                        dataSelect(productData)
                                    } />
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

            </Modal >

        </>
    )
}

export default ServiceSetting