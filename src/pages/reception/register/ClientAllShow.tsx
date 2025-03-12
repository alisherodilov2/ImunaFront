import React, { useEffect, useRef, useState } from 'react'
// import Layout from '../layouts/Layout'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Toast, ToastHeader, ToastBody, TabPane, TabContent, NavItem, Nav, NavLink, PopoverBody, PopoverHeader, Popover } from 'reactstrap'
import classnames from 'classnames';
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from 'react-redux';
import { query } from '../../../componets/api/Query';
import { ReducerType } from '../../../interface/interface';
import Loader from '../../../componets/api/Loader';
import Input from '../../../componets/inputs/Input';
import { NumericFormat, PatternFormat } from 'react-number-format';
import ErrorInput from '../../../componets/inputs/ErrorInput';
import Select from 'react-select';
import axios from 'axios';
import { MdDeleteForever } from 'react-icons/md';
import Swal from 'sweetalert2';
import { json } from 'react-router-dom';
import { AppDispatch } from '../../../service/store/store';
import DepartmentAdd from '../../director/services/department/DepartmentAdd';
import Table from '../../../componets/table/Table';
import { nanoid } from '@reduxjs/toolkit';
import { fullName } from '../../../helper/fullName';
import { formatId } from '../../../helper/idGenerate';
import { getCurrentDateTime } from '../../../helper/dateFormat';
// import { isAddClient, isEditClient } from '../../client/reducer/ClientReducer';
const ClientAllShow = ({ data, modal, setModal, setData = function () { }, resetItem = false }: { setData?: any, data?: any, modal?: boolean; setModal?: any, resetItem?: boolean }) => {
    const { serviceData, } = useSelector((state: ReducerType) => state.ServiceReducer)
    const { departmentData, } = useSelector((state: ReducerType) => state.DepartmentReducer)
    const { clientData } = useSelector((state: ReducerType) => state.ClientReducer)

    const [modal2, setModal2] = useState(false)
    const [modal3, setModal3] = useState(false)
    const { serviceTypeData } = useSelector((state: ReducerType) => state.ServiceTypeReducer)
    const dataSelect = (data: any) => {
        let res = [...data].sort((a: any, b: any) => b.id - a.id);
        return res?.map((item: any) => {
            return {
                value: item?.id, label: `${item?.name || item?.type} ${item?.price ? `(${item?.price} so'm)` : ''}`,
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
    const { isLoading, sendLoading, isSuccessApi, hasError } = useSelector((state: ReducerType) => state.ClientReducer)
    const dispatch = useDispatch<AppDispatch>()
    const schema = yup
        .object()
        .shape({
            first_name: yup.string().required("Familiyasi kiriting!"),
            last_name: yup.string().required("Ismi kiriting!"),
            data_birth: yup.string().required("Tug'ilgan sanasi kiriting!"),
            sex: yup.string().required("Jinsi kiriting!"),
            phone: yup.string().required("Telefon raqami kiriting!"),
            citizenship: yup.string().required("Fuqoroligi kiriting!"),
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
    const [clinetValue, setClientValue] = useState([] as any)
    const [activeTab, setActiveTab] = useState('1');
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
            setClientValue(() => [])

            setSelectData(() => {
                return false
            })
            reset(
                resetObj
            )
            if (data?.department_id > 0 && data?.clienttype_id > 0) {
                // let department_id = departmentData?.find((item: any) => item?.id == data?.department_id);
                // let clienttype_id = clientData?.find((item: any) => item?.id == data?.clienttype_id);
                // setSelectData(() => {
                //     return {
                //         department_id: {
                //             value: department_id?.id,
                //             label: department_id?.name
                //         },
                //         clienttype_id: {
                //             value: clienttype_id?.id,
                //             label: clienttype_id?.type
                //         },
                //     }
                // })
                setValue('department_id', data?.department_id.id, {
                    shouldValidate: true,
                });
                setValue('clienttype_id', data?.clienttype_id.id, {
                    shouldValidate: true,
                });
            }

        }
        if (data?.client_value?.length > 0) {
            let resdata = data?.client_value?.map((item: any) => {
                return {
                    ...item?.service,
                    service_id: item?.service_id,
                    price: item?.price
                }
            })
            setClientValue(() => resdata)
            setSelectData(() => {
                return {
                    ...selectData,
                    service_id: dataSelect(resdata)
                }
            })
        }
        if (Object.keys(data ?? {})?.length > 0) {
            // let department_id = departmentData?.find((item: any) => item?.id == data?.department.id);
            // let clienttype_id = clientData?.find((item: any) => item?.id == data?.clienttype.id);
            // setValue('department_id', data?.department.id, {
            //     shouldValidate: true,
            // });
            // setValue('clienttype_id', data?.clienttype.id, {
            //     shouldValidate: true,
            // });
            // setSelectData(() => {
            //     return {
            //         department_id: {
            //             value: department_id?.id,
            //             label: department_id?.name
            //         },
            //         clienttype_id: {
            //             value: clienttype_id?.id,
            //             label: clienttype_id?.type
            //         },
            //     }
            // })
            for (let key in data) {
                setValue(key, data?.[key as string], {
                    shouldValidate: true,
                });

                // extraFuntion(data?.[key], key)
            }
            // setClientValue(() => data?.client_value)


        } else {

        }

    }, [modal, data, isLoading, isSuccessApi])

    const toggle = () => {
        setModal(!modal)
        setEnter(() => false)
        let s = getValues(), resetObj = {};
        for (let key in getValues()) {
            resetObj = {
                ...resetObj, [key]: ''
            }
        }
        setClientValue(() => [])

        setSelectData(() => {
            return false
        })
        reset(
            resetObj
        )
    };


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
    const toggleTab = (tab: any) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    };
    return (
        <>
            <Modal centered={true} isOpen={modal} toggle={toggle} role='dialog' size='xl' backdrop="static" keyboard={false} >
                <div>

                    <div className="modal-header">
                        <h5 className="modal-title" id="modalCenterTitle">Batafsil</h5>
                        <button onClick={toggle} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body">
                        <div className="card" style={{
                            height: `${window.innerHeight / 1.7}px`,
                            overflow: 'auto'
                        }}>
                            <Table
                                top={100}
                                scrollRole={true}
                                extraKeys={[
                                    'full_name_',
                                    'phone_',
                                    'person_id_',
                                    // 'probirka_',
                                    'total_price_',
                                    'client_item_count',
                                    'created_at_'
                                ]}
                                columns={[
                                    {
                                        title: '№',
                                        key: 'id',
                                        render: (value: any, data: any) => {
                                            return <div key={data.index} className='d-flex  align-items-center gap-1'>

                                                <span>
                                                    {((data?.index + 1))}
                                                </span>
                                            </div>
                                        }
                                    },
                                    {
                                        title: "F.I.O",
                                        key: 'full_name_',
                                        render: (value: any, data: any) => {
                                            return <button className='btn btn-sm'

                                            >
                                                {fullName(value)}
                                            </button>
                                        }
                                    },
                                    {
                                        title: 'Tel',
                                        key: 'phone_',
                                        render: (value: any, data: any) => {
                                            return `+998${value?.phone}`
                                        }
                                    },
                                    {
                                        title: 'ID',
                                        key: 'person_id_',
                                        render: (value: any, data: any) => {
                                            return formatId(value?.person_id)
                                        }
                                    },
                                    // {
                                    //     title: 'Probirka',
                                    //     key: 'probirka_',
                                    //     render: (value: any, data: any) => {
                                    //         return <NumericFormat displayType="text"
                                    //             thousandSeparator
                                    //             decimalScale={2}
                                    //             value={value?.probirka_count || 0} />
                                    //     }
                                    // },
                                    {
                                        title: 'Summa',
                                        key: 'total_price_',
                                        render: (value: any, data: any) => {
                                            return <NumericFormat displayType="text"
                                                thousandSeparator
                                                decimalScale={2}
                                                value={value?.total_price} />
                                        }
                                    },
                                    {
                                        title: 'Xizmatlar',
                                        key: 'client_item_count',
                                        render: (value: any, data: any) => {
                                            return <><NumericFormat displayType="text"
                                            thousandSeparator
                                            decimalScale={2}
                                            value={value?.service_count} /> /0 </>
                                        }
                                    },
                                    {
                                        title: 'Kelgan vaqti',
                                        key: 'created_at_',
                                        render: (value: any, data: any) => {
                                            return `${getCurrentDateTime(value?.created_at)}`
                                        }

                                    },

                                ]}
                                dataSource={
                                    data
                                }
                            />
                        </div>
                    </div>
                    <div className="modal-footer">

                        <button type="button" className="btn btn-danger" onClick={toggle}>Ortga</button>
                    </div>
                </div>

            </Modal>
            <DepartmentAdd
                modal={modal2} setModal={setModal2}
            />

        </>
    )
}

export default ClientAllShow