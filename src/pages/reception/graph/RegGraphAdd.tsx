import React, { useEffect, useRef, useState } from 'react'
// import Layout from '../layouts/Layout'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Toast, ToastHeader, ToastBody, TabPane, TabContent, NavItem, Nav, NavLink, PopoverBody, PopoverHeader, Popover, Spinner } from 'reactstrap'
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
import { MdDeleteForever, MdToday } from 'react-icons/md';
import Swal from 'sweetalert2';
import { json, useLocation } from 'react-router-dom';
import { AppDispatch } from '../../../service/store/store';
import { isEditGraphAchive, isGraphAdd, isGraphDefaultApi, isGraphEdit, isGrapItemDelete } from '../../../service/reducer/GraphReducer';
import DepartmentAdd from '../../director/services/department/DepartmentAdd';
import Table from '../../../componets/table/Table';
import { nanoid } from '@reduxjs/toolkit';
import { FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import ClientAdd from '../register/ClientAdd';
import { toast, ToastContainer } from 'react-toastify';
import { fullName } from '../../../helper/fullName';
import { addOneDay, phoneFormatNumber } from '../../../helper/graphHelper';
import { isChangeClietStatus, isTornametClient } from '../../../service/reducer/ClientReducer';
import { use_status } from '../register/Client';
import { calculateAge } from '../../../helper/calculateAge';
import AtHomeClietAdd from '../register/AtHomeClietAdd';
import ReClientAdd from '../register/ReClientAdd';
import { dateFormat } from '../../../service/helper/day';
// import { isAddGraph, isEditGraph } from '../../graph/reducer/GraphReducer';


const RegGraphAdd = ({ data, modal, setModal, setData = function () { }, resetItem = false }: { setData?: any, data?: any, modal?: boolean; setModal?: any, resetItem?: boolean }) => {
    const [isQueueModal, setIsQueueModal] = useState(false)
    const queueToggle = () => {
        setIsQueueModal(!isQueueModal)
    }
    const [queueNumberData, setQueueNumberData] = useState([] as any)
    const [queueNumber, setQueueNumber] = useState(0 as any)
    const [queueNumberTargtet, setQueueNumberTarget] = useState({} as any)
    const isCheckQueue = async (id: any, number?: any) => {
        try {
            setLoading(() => true)
            let res = await axios.get(`/graph/shelf-number-limit/${id}`)
            const { result } = res.data
            let find = data?.client_value?.find((findItem: any) => findItem?.service?.department.id === id)
            console.log('setQueueNumber', find);
            console.log('number', number);
            if (number > 0) {
                setQueueNumber(() => number)
            }
            setQueueNumberTarget(() => {
                return {
                    ...result,
                    data: result?.data?.filter((item: any) => item != find?.queue_number)
                }
            })

            queueToggle()
        } catch (error) {

        }
        finally {
            setLoading(() => false)
        }

    }
    const { serviceData, } = useSelector((state: ReducerType) => state.ServiceReducer)
    const { user, } = useSelector((state: ReducerType) => state.ProfileReducer)
    const { departmentData, } = useSelector((state: ReducerType) => state.DepartmentReducer)
    const { graphData } = useSelector((state: ReducerType) => state.GraphReducer)
    const { treatmentData } = useSelector((state: ReducerType) => state.TreatmentReducer)
    const [modal2, setModal2] = useState(false)
    const [modal3, setModal3] = useState(false)
    const { serviceTypeData } = useSelector((state: ReducerType) => state.ServiceTypeReducer)
    const dataSelect = (data: any) => {
        return data?.map((item: any) => {
            return {
                value: item?.id, label: `${item?.name || item?.type} ${item?.price ? `(${item?.price} so'm)` : ''}`,
                data: item
            }
        })
    }
    const [selectData, setSelectData] = useState({
        department: {
            value: 0,
            label: ''
        },
        treatment_id: {
            value: 0,
            label: ''
        }

    } as any)
    const [loading, setLoading] = useState(false)
    const graphItemDelete = async (target: any, achiveId?: any) => {
        try {
            setLoading(() => true)
            let res = await axios.post('/graph/item-delete', achiveId && data?.use_status == 'at_home' ? {
                graph_item_achive_id: achiveId,
            } : target)
            const { result } = res.data
            console.log(result);
            if (result?.graph_achive) {
                dispatch(isEditGraphAchive(result?.graph_achive))
            } else if (result?.graph_item_achive_id > 0) {
                let deletedata = graphItem?.filter((res: any) => res?.id !== +result?.graph_item_achive_id)
                setGraphItem(() => deletedata)
                return;
            } else {
                dispatch(isGrapItemDelete(+result?.id))
                // setGraphItem(() => graphItem?.filter((res: any) => res?.id !== +data?.graph_item_id))
            }

            let deletedata = graphItem?.filter((res: any) => res?.id !== +target?.graph_item_id)
            if (deletedata?.length == 0) {
                setGraphItem(() => [{ agreement_date: '', id: nanoid() }])
            } else {
                setGraphItem(() => deletedata)
            }
            // setModal(false)
        } catch (error) {
        } finally {
            setLoading(() => false)
        }
    }
    const workingDateCheck = async (data: any, i: any, department: any) => {
        try {
            setLoading(() => true)
            let res = await axios.get(`/graph/working-date-check?date=${data}&department_id=${department?.value}`)
            const { result } = res.data
            console.log(result);
            if (!result?.is_working) {
                setGraphItem(graphItem?.map((_: any, index: number) => {
                    if (index === i) {
                        return {
                            ..._,
                            agreement_time: '',
                            agreement_date: '',
                            agreement_time_data: []
                        }
                    }
                    return _
                }))
                if (result?.end_time) {
                    alert('Ish vaqti tugadi')

                } else {

                    alert('ish kuni emas')
                }
            } else
                if (result?.data?.length > 0) {
                    let filterData = result?.data
                        ?.filter((filterItem: any) => !graphItem?.map((kk: any) => kk.agreement_time).includes(filterItem)
                        )
                        ?.map((item: any) => {
                            return {
                                label: item,
                                value: item,
                            }
                        })
                    console.log(filterData);
                    console.log(graphItem?.map((kk: any) => kk.agreement_time));

                    setGraphItem(graphItem?.map((_: any, index: number) => {
                        if (index === i) {
                            return {
                                ..._,
                                agreement_time: '',
                                agreement_date: data,
                                department: department,
                                agreement_time_data: result?.data
                                    ?.filter((filterItem: any) => !graphItem?.map((kk: any) => kk.agreement_time?.value).includes(filterItem)
                                    )
                                    ?.map((item: any) => {
                                        return {
                                            label: item,
                                            value: item,
                                        }
                                    })
                            }
                        }
                        return _
                    }))
                } else if (result?.data?.length == 0) {
                    setGraphItem(graphItem?.map((_: any, index: number) => {
                        if (index === i) {
                            return {
                                ..._,
                                agreement_time: '',
                                agreement_date: '',
                                department: {},
                                agreement_time_data: []
                            }
                        }
                        return _
                    }))
                    alert('vaqt qolmagan')
                }

            // dispatch(isGrapItemDelete(+result?.id))
            // setGraphItem(() => graphItem?.filter((res: any) => res?.id !== +result?.id))
            // setModal(false)
        } catch (error) {
        } finally {
            setLoading(() => false)
        }
    }
    const { findData } = useSelector((state: ReducerType) => state.MenuReducer)
    const { graph_achive_target } = useSelector((state: ReducerType) => state.GraphReducer)
    const { pathname } = useLocation()
    const { isLoading, sendLoading, isSuccessApi, hasError } = useSelector((state: ReducerType) => state.GraphReducer)
    const dispatch = useDispatch<AppDispatch>()
    const schema = yup
        .object()
        .shape({
            first_name: yup.string().required("Familiyasi kiriting!"),
            // last_name: yup.string().required("Ismi kiriting!"),
            // phone: yup.string().required("Telefon raqami kiriting!"),
            // phone: yup.string().nullable(),
            treatment_id: yup.string().required("Muolaja turini kiriting!"),
            department_id: yup.string().required("Bo'limni turini kiriting!"),
            use_status: yup.string().required("Status kiriting!"),
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
    const [graphItem, setGraphItem] = useState<any>([
        {
            id: nanoid(),
            agreement_date: '',
            agreement_time: '',
            graph_item_value: []
        }
    ])
    const [item, setItem] = useState<any>({})

    const [clinetValue, setGraphValue] = useState([] as any)
    const [activeTab, setActiveTab] = useState('1' as any);
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
                if (key != 'department_id') {
                    resetObj = {
                        ...resetObj, [key]: ''
                    }
                }
            }
            setGraphValue(() => [])
            setGraphItem(() => [{
                id: nanoid(),
                agreement_date: '',
                agreement_time: '',
                graph_item_value: []
            }])

            setSelectData(() => {
                return false
            })
            reset(
                resetObj
            )
            if (data?.department_id > 0 && data?.graphtype_id > 0) {
                // let department_id = departmentData?.find((item: any) => item?.id == data?.department_id);
                // let graphtype_id = graphData?.find((item: any) => item?.id == data?.graphtype_id);
                // setSelectData(() => {
                //     return {
                //         department_id: {
                //             value: department_id?.id,
                //             label: department_id?.name
                //         },
                //         graphtype_id: {
                //             value: graphtype_id?.id,
                //             label: graphtype_id?.type
                //         },
                //     }
                // })
                setValue('department_id', data?.department_id.id, {
                    shouldValidate: true,
                });
                setValue('graphtype_id', data?.graphtype_id.id, {
                    shouldValidate: true,
                });
            }

        }
        console.log(data);

        if (Object.keys(data ?? {})?.length > 0) {
            console.log('data', data);

            if (data?.graph_item?.length > 0) {
                // console.log('data?.graph_item0', );

                let resdata = data?.graph_item?.map((res: any) => {
                    return {
                        ...res,
                        agreement_time: {
                            value: res?.agreement_time,
                            label: res?.agreement_time
                        },
                        status: 'old',
                        // department_id: res?.department_id,
                        // department: {
                        //     value: res?.department?.id,
                        //     label: res?.department?.name
                        // },
                        // service: res?.graph_item_value?.map((item: any) => {
                        //     return {
                        //         ...item,
                        //         label: item?.service.name,
                        //         value: item?.service.id,
                        //         service: {
                        //             label: item?.service.name,
                        //             value: item?.service.id,
                        //         },
                        //     }
                        // })
                    }
                })
                console.log('resdata0', resdata);
                setGraphItem(() => resdata)

            }
            if (data?.use_status == 'at_home') {
                let resdata = data?.graph_archive?.graph_archive_item?.map((res: any) => {
                    return {
                        ...res,
                        agreement_time: {
                            value: res?.agreement_time,
                            label: res?.agreement_time
                        },
                        status: 'old',
                        // department_id: res?.department_id,
                        // department: {
                        //     value: res?.department?.id,
                        //     label: res?.department?.name
                        // },
                        // service: res?.graph_item_value?.map((item: any) => {
                        //     return {
                        //         ...item,
                        //         label: item?.service.name,
                        //         value: item?.service.id,
                        //         service: {
                        //             label: item?.service.name,
                        //             value: item?.service.id,
                        //         },
                        //     }
                        // })
                    }
                })
                console.log('resdata0', resdata);
                setGraphItem(() => resdata)
            }
            console.log('data?.department', data?.department);
            if (data?.department) {
                setValue('treatment_id', data?.treatment?.id, {
                    shouldValidate: true,
                });
                setSelectData(() => {
                    return {
                        ...selectData,
                        department: {
                            value: data?.department?.id,
                            label: data?.department?.name
                        },
                    }
                })
            }
            // let department_id = departmentData?.find((item: any) => item?.id == data?.department.id);
            // let graphtype_id = graphData?.find((item: any) => item?.id == data?.graphtype.id);
            // setValue('department_id', data?.department.id, {
            //     shouldValidate: true,
            // });
            // if (data?.treatment) {
            setValue('treatment_id', data?.treatment?.id ?? 0, {
                shouldValidate: true,
            });
            setValue('department_id', data?.department?.id ?? 0, {
                shouldValidate: true,
            });
            setSelectData(() => {
                return {
                    ...selectData,
                    treatment_id: {
                        value: data?.treatment?.id,
                        label: data?.treatment?.name,
                        data: data?.treatment
                    },
                    department: {
                        value: data?.department?.id,
                        label: data?.department?.name
                    },
                    use_status: use_status?.find((res: any) => res.value == data?.use_status)
                }
            })

            // }
            for (let key in data) {
                setValue(key, data?.[key as string], {
                    shouldValidate: true,
                });

                // extraFuntion(data?.[key], key)
            }

            // setGraphValue(() => data?.graph_value)


        }
        if (isSuccessApi) {
            console.log('ssssss', {
                person_id: getValues('person_id'),
                use_stauts: getValues('use_status')
            });

            // dispatch(isChangeClietStatus({
            //     person_id: getValues('person_id'),
            //     use_stauts: getValues('use_status')
            // }))
            setData(() => { })
            setModal(false)
            console.log('pathname', pathname);

            // if (pathname == '/') {

            // }
            // console.log('graph_achive_target', graph_achive_target);

            // if (+graph_achive_target?.person_id > 0) {
            //     dispatch(isTornametClient(graph_achive_target))
            // }
            dispatch(isGraphDefaultApi())
            let s = getValues(), resetObj = {};
            for (let key in getValues()) {
                resetObj = {
                    ...resetObj, [key]: ''
                }
            }
            setGraphItem(() => [{
                id: nanoid(), agreement_date: '',
            }])
            setGraphValue(() => [])
            setSelectData(() => {
                return false
            })
            reset(
                resetObj
            )
        }
    }, [modal, data, isLoading, isSuccessApi])
    const referringDoctorDataSelect = (data: any) => {
        if (data?.length > 0) {

            return data?.map((item: any) => {
                return {
                    value: item?.id, label: fullName(item),
                    data: item
                }
            })
        }
        return []
    }
    const [complateLoading, setComplateLoading] = useState(false)
    const { referringDoctorData, } = useSelector((state: ReducerType) => state.ReferringDoctorReducer)


    const handleConfirmation = (confirm: any, toastId: any) => {
        if (confirm) {
            let find = JSON.parse(toastId);
            console.log(find);
            console.log('toastId', toastId);
            toast.dismiss(); // Dismiss specific toast
            if (find) {
                let s = getValues(), resetObj = {};
                for (let key in getValues()) {
                    resetObj = {
                        ...resetObj, [key]: ''
                    }
                }
                for (let key in find) {
                    if (key == 'id') {

                    } else {
                        setValue(key, find?.[key as string], {
                            shouldValidate: true,
                        });
                    }

                }
            }

        } else {
            toast.dismiss(toastId); // Dismiss specific toast
        }
    };
    const [autocomplateText, setAutocomplateText] = useState('' as any)
    // const autocomplate = async (target: string) => {
    //     try {
    //         setComplateLoading(true)
    //         let res = await axios.get(`/client/autocomplate${target}`)
    //         const { result } = res.data
    //         console.log('autocomplate', result);
    //         if (result?.length > 0) {
    //             for (let index = 0; index < result?.length; index++) {
    //                 const toastId = JSON.stringify(result?.[index] ?? "{}");
    //                 toast.info(
    //                     <div className='d-flex justify-content-between align-items-center toast_card gap-2 w-100'>
    //                         <p className='m-0 p-0'>
    //                             {fullName(result?.[index])}
    //                         </p>
    //                         <p className='m-0 p-0'>
    //                             {result[index]?.data_birth}
    //                         </p>
    //                         <p className='m-0 p-0'>
    //                             {phoneFormatNumber(result[index]?.phone)}
    //                         </p>
    //                     </div>,
    //                     {
    //                         toastId,
    //                         className: 'custom-toast',
    //                         position: 'top-center',
    //                         autoClose: false,
    //                         closeOnClick: false,
    //                         draggable: true,
    //                         pauseOnHover: false,
    //                         closeButton: ({ closeToast }) => (
    //                             <div className="custom-close-button d-flex justify-content-center align-items-center">
    //                                 <button type='button' className='btn btn-sm btn-success' onClick={() => handleConfirmation(true, toastId)}>Ha</button>
    //                                 <button type='button' className='btn btn-sm btn-danger' onClick={() => handleConfirmation(false, toastId)}>Yo'q</button>
    //                             </div>
    //                         ),
    //                     }
    //                 );
    //             }
    //         }

    //     } catch (error) {

    //     }
    //     finally {
    //         setComplateLoading(false)
    //     }
    // }
    const toggle = () => {
        setModal(!modal)
        setData(() => { })
        setEnter(() => false)
        let s = getValues(), resetObj = {};
        for (let key in getValues()) {
            resetObj = {
                ...resetObj, [key]: ''
            }
        }
        setGraphValue(() => [])
        // setGraphItem() => [])
        setGraphItem(() => [{ id: nanoid(), agreement_date: '' }])
        setSelectData(() => {
            return false
        })
        setSelectData(() => {
            return false
        })
        reset(
            resetObj
        )
        setActiveTab('1')
    };
    const [regItem, setRegItem] = useState<any>({})
    const [openCashRegModal, setOpenCashRegModal] = useState(false)
    const [regModal, setRegModal] = useState(false)
    const sendApi = (e: any) => {
        if (data?.id?.toString()?.length ?? 0 > 0) {
            dispatch(isGraphEdit({
                query: query({
                    ...data, ...e,
                    shelf_number: `${e?.shelf_number > 0 ? e?.shelf_number : 0}`,
                    person_id: `${e?.person_id ? e?.person_id : 0}`,
                    treatment_id: `${e?.treatment_id ? e?.treatment_id : 0}`,
                    department_id: `${e?.department_id ? e?.department_id : 0}`,
                    at_home_client_id: `${data?.at_home_client_id ? data?.at_home_client_id : 0}`,
                    re_client_id: `${data?.client_id ? data?.client_id : 0}`,
                    graph_archive_id: `${+data?.graph_archive_id > 0 ? e?.graph_archive_id : 0}`,
                    graph_item: JSON.stringify(graphItem?.map((res: any) => {
                        return {
                            department_id: res?.department?.value,
                            agreement_date: res?.agreement_date,
                            agreement_time: res?.agreement_time?.value,
                            id: res?.id,
                            is_assigned: +res?.is_assigned ? '1' : 0
                            // graph_item_value: res?.service?.map((graph_item_value_item: any) => {
                            //     return {
                            //         service_id: graph_item_value_item?.value,
                            //     }
                            // })
                        }
                    }))
                }), id: data?.id
            }))
            /////// dispatch(isCostEdit(data)) 
        } else {
            dispatch(isGraphAdd({
                query: query({
                    ...data, ...e,
                    shelf_number: `${e?.shelf_number > 0 ? e?.shelf_number : 0}`,
                    re_client_id: `${data?.client_id ? data?.client_id : 0}`,
                    target_client_id: `${data?.target_client_id ? data?.target_client_id : 0}`,
                    person_id: `${e?.person_id ? e?.person_id : 0}`,
                    at_home_client_id: `${data?.at_home_client_id ? data?.at_home_client_id : 0}`,
                    treatment_id: `${e?.treatment_id ? e?.treatment_id : 0}`,
                    referring_doctor_id: `${e?.referring_doctor_id ? e?.referring_doctor_id : 0}`,
                    department_id: `${e?.department_id ? e?.department_id : 0}`,
                    graph_archive_id: `${+data?.graph_archive_id > 0 ? e?.graph_archive_id : 0}`,
                    graph_item: JSON.stringify(graphItem?.map((res: any) => {
                        return {
                            department_id: e.department_id,
                            is_assigned: +res?.is_assigned ? '1' : 0,
                            agreement_date: res?.agreement_date,
                            agreement_time: res?.agreement_time?.value,
                            graph_item_value: res?.service?.map((graph_item_value_item: any) => {
                                return {
                                    service_id: graph_item_value_item?.value,
                                }
                            })
                        }
                    }))
                })
            }))
        }
    }
    const send = (e: any) => {
        console.log('send', e);
        console.log('selectData', selectData);

        // uyda test uchun registratsiya ochilishi kerak
        if (e?.use_status == 'at_home') {
            // selectData?.treatment_id
            let graphItemres = graphItem?.filter((res: any) => +res?.is_assigned && !Number.isInteger(res?.id)) as any; //// ynagi qoshilganlarni aniqlaydi
            // if(data?.use_status=='treatment'){

            // }else{

            // }
            // ozgarish qilinga  yani ptichka qoyilganlarni topish kerak
            let changeTruedata = graphItem?.filter((res: any) => {
                if (Number.isInteger(res?.id)) {
                    return data?.graph_archive?.graph_archive_item?.find((item: any) => item?.id == res?.id && res?.is_assigned && !item?.is_assigned)
                }
                return false
            })
            let canselTruedata = graphItem?.filter((res: any) => {
                if (Number.isInteger(res?.id)) {
                    return data?.graph_archive?.graph_archive_item?.find((item: any) => item?.id == res?.id && !res?.is_assigned && item?.is_assigned)
                }
                return false
            })
            let isOpenCashReg = graphItem?.find((res: any) => {
                // if (!Number.isInteger(res?.id)) {
                return data?.graph_archive?.graph_archive_item?.find((item: any) => item?.id == res?.id && +res?.is_assigned != +item?.is_assigned)
                // }
                return false
            })
            console.log('isOpenCashReg || graphItemres?.length > 0', isOpenCashReg);
            console.log('graphItemres?.length > 0', graphItemres?.length);
            console.log('canselTruedata?.length > 0', canselTruedata?.length);

            if ((isOpenCashReg || graphItemres?.length > 0 || changeTruedata?.length > 0) || (data?.use_status == 'treatment' && graphItem?.filter((res: any) => +res?.is_assigned).length > 0)) {
                const { treatment_service_item } = selectData?.treatment_id?.data ? selectData?.treatment_id?.data : data?.treatment
                let treatment_service_item_value = [] as any;
                if (data?.use_status == 'treatment') {
                    for (let key of graphItem?.filter((res: any) => +res?.is_assigned)) {
                        for (let res of treatment_service_item) {
                            treatment_service_item_value = [...treatment_service_item_value, {
                                is_atHome: true,
                                is_at_home: true,
                                ...res.service,
                                id: nanoid(),
                                qty: 1,
                                service_id: res?.service?.id,
                                service: res?.service,
                                total_price: res?.service?.price,
                                created_at: key.agreement_date
                            }]
                        }
                    }
                } else
                    if (graphItemres.length > 0 || changeTruedata?.length > 0) {
                        // treatment_service_item_value = treatment_service_item?.map((res: any) => {
                        //     return {
                        //         is_atHome: true,
                        //         is_at_home: true,
                        //         ...res.service,
                        //         id: nanoid(),
                        //         qty: graphItemres?.length + changeTruedata?.length,
                        //         service_id: res?.service?.id,
                        //         service: res?.service,
                        //         total_price: res?.service?.price * (graphItemres?.length + changeTruedata?.length),
                        //     }
                        // })
                        for (let key of graphItemres) {
                            for (let res of treatment_service_item) {
                                treatment_service_item_value = [...treatment_service_item_value, {
                                    is_atHome: true,
                                    is_at_home: true,
                                    ...res.service,
                                    id: nanoid(),
                                    qty: 1,
                                    service_id: res?.service?.id,
                                    service: res?.service,
                                    total_price: res?.service?.price,
                                    created_at: key.agreement_date
                                }]
                            }
                        }

                        for (let key of changeTruedata) {
                            for (let res of treatment_service_item) {
                                treatment_service_item_value = [...treatment_service_item_value, {
                                    is_atHome: true,
                                    is_at_home: true,
                                    ...res.service,
                                    id: nanoid(),
                                    qty: 1,
                                    service_id: res?.service?.id,
                                    service: res?.service,
                                    total_price: res?.service?.price,
                                    created_at: key.agreement_date
                                }]
                            }
                        }
                        // treatment_service_item_value = graphItemres?.map((res: any) => {
                        //     return {
                        //         is_atHome: true,
                        //         is_at_home: true,
                        //         ...res.service,
                        //         id: nanoid(),
                        //         qty: graphItemres?.length + changeTruedata?.length,
                        //         service_id: res?.service?.id,
                        //         service: res?.service,
                        //         total_price: res?.service?.price * (graphItemres?.length + changeTruedata?.length),
                        //     }
                        // })
                    }
                // console.log('treatment_service_item_value', treatment_service_item_value);

                let clientValue = [
                    ...data?.at_home_data?.client_value?.map((res: any) => {
                        let find = canselTruedata?.find((item: any) => +res?.is_at_home && Date.parse(dateFormat(item?.agreement_date)) == Date.parse(dateFormat(res?.created_at)))
                        if (find) {
                            return {
                                ...res,
                                is_active: '0'
                            }
                        }
                        return res
                    }),


                ]
                console.log('clientValue', clientValue);

                let rr = {


                    ...data?.at_home_data,
                    client_value: clientValue
                }
                console.log('rr', rr);
                console.log('treatment_service_item', treatment_service_item);

                setRegItem(() => {
                    return {
                        is_atHome: true,
                        ...data?.at_home_data,
                        client_value: [
                            ...data?.at_home_data?.client_value?.map((res: any) => {
                                let find = canselTruedata?.find((item: any) => Date.parse(dateFormat(item?.agreement_date)) == Date.parse(dateFormat(res?.created_at)))
                                if (find) {
                                    return {
                                        ...res,
                                        is_active: 0
                                    }
                                }
                                return res
                            }),
                            ...treatment_service_item_value
                        ]
                    }
                })
                setRegModal(true)
            } else {
                sendApi(e)
            }

        } else {
            sendApi(e)
        }


        // sendApi(e)
        // 
        // if (id?.toString()?.length ?? 0 > 0) {
        //   dispatch(isProductEdit({ query: query({ ...data, product_value: JSON.stringify(product_values) }, ['photo']), file: file, id: id }))
        // } else {
        //   dispatch(isProductAdd({ query: query({ ...data, product_value: JSON.stringify(product_values) }, ['photo']), file: file }))
        // }

    }

    const cardRef = useRef<HTMLDivElement>(null);
    const scrollToBottom = () => {
        if (cardRef.current) {
            // Scroll to the bottom of the card
            // cardRef.current.scrollTo({
            //     top: cardRef.current.scrollHeight - cardRef.current.graphHeight,
            //     behavior: 'smooth', // Enables smooth scrolling
            // });
        }
    };
    const toggleTab = (tab: any) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    };
    return (
        <>
            <Loader loading={sendLoading} />
            <Modal centered={true} isOpen={modal} toggle={toggle} role='dialog' size='xl' backdrop="static" keyboard={false}>
                <form onSubmit={handleSubmit(send)} className="size_16">

                    <div className="modal-header">
                        <div className="d-flex gap-5 ">

                            <h5 className="modal-title" id="modalCenterTitle">Muolajaga yo'naltirish</h5>
                            <h3 className='fw-blod'>
                                Yoshi:{calculateAge(data?.data_birth, user?.graph_format_date)}
                            </h3>
                        </div>
                        <button onClick={toggle} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body">
                        <div className="row">

                            <div className="col-4 mb-1">
                                <label className="form-label">F.I.O</label>
                                <Input type="text" placeholder="F.I.O"  {...register('first_name')} name='first_name'
                                    error={errors.first_name?.message?.toString() || hasError?.errors?.first_name?.toString()}
                                />
                            </div>
                            {/* <div className="col-4 mb-1">
                                <label className="form-label">Ismi</label>
                                <Input type="text" placeholder="Ismi"  {...register('last_name')} name='last_name'
                                    error={errors.last_name?.message?.toString() || hasError?.errors?.last_name?.toString()}
                                />
                            </div> */}
                            {/* <div className="col-4 mb-1">
                                <label className="form-label">Ismi</label>
                                <Input type="text" placeholder="Ismi"  {...register('data_birth')} name='data_birth'
                                    onChange={(e: any) => {
                                        let value = e.target.value
                                        setValue('data_birth', value, {
                                            shouldValidate: true
                                        })
                                        if (value.length > 0 && getValues('phone')?.length == 9) {
                                            let target = `?data_birth=${value}&phone=${getValues('phone')}`
                                            if (autocomplateText !== target) {
                                                setAutocomplateText(target)
                                                autocomplate(target)
                                            }


                                        }
                                        else {
                                            setAutocomplateText('')
                                        }
                                    }}
                                    error={errors.data_birth?.message?.toString() || hasError?.errors?.data_birth?.toString()}
                                />
                            </div> */}

                            {/* <div className="col-4 mb-1">
                                <label className="form-label">Tug'ilgan sanasi</label>
                                <Input type="date" placeholder="Ismi"  {...register('data_birth')} name='data_birth'

                                    error={errors.data_birth?.message?.toString() || hasError?.errors?.data_birth?.toString()}
                                />
                            </div> */}
                            <div className="col-4 mb-1">
                                <label className="form-label">Telefon raqami</label>
                                <input type="hidden" {...register('phone')} name='phone' />
                                <div className="input-group">
                                    <div className="input-group-text">
                                        +998
                                    </div>
                                    <PatternFormat
                                        format="(##) ###-##-##"
                                        mask="_"
                                        // disabled={getValues('data_birth')?.length > 0 ? false : true}
                                        value={getValues('phone')}
                                        allowEmptyFormatting
                                        className='form-control'
                                        placeholder="+998 (___) ___-____"
                                        onChange={(e: any) => {
                                            let value = e.target.value.replace(/[^\d]/g, '');
                                            console.log(value);

                                            setValue('phone', value, {
                                                shouldValidate: true,
                                            });
                                            // if (value.length == 9) {
                                            //     let target = `?phone=${value}&data_birth=${getValues('data_birth')}`
                                            //     if (autocomplateText !== target) {
                                            //         setAutocomplateText(target)
                                            //         autocomplate(target)
                                            //     }


                                            // }
                                            // else {
                                            //     setAutocomplateText('')
                                            // }
                                        }}
                                    />
                                    {
                                        complateLoading ? <div className="input-group-text">
                                            <Spinner animation="border" />
                                        </div> : ''
                                    }
                                </div>
                                <ErrorInput>
                                    {errors.phone?.message?.toString() || hasError?.errors?.phone?.toString()}
                                </ErrorInput>

                            </div>
                            {/* <div className="col-4 mb-1">
                                <label className="form-label">jinsi</label>
                                <div className="d-flex gap-3">
                                    <div className="form-check ">
                                        <input className="form-check-input" type="radio" id="male" {...register('sex')} name='sex' value={'male'} />
                                        <label className="form-check-label" htmlFor="male"> erkak </label>
                                    </div>
                                    <div className="form-check ">
                                        <input className="form-check-input" type="radio" id="female" {...register('sex')} name='sex' value={'female'} />
                                        <label className="form-check-label" htmlFor="female"> ayol </label>
                                    </div>
                                </div>
                                <ErrorInput>
                                    {errors.sex?.message?.toString() || hasError?.errors?.sex?.toString()}
                                </ErrorInput>
                            </div>
                            <div className="col-4 mb-1">
                                <label className="form-label">Fuqoroligi</label>
                                <div className="d-flex gap-3">
                                    <div className="form-check ">
                                        <input className="form-check-input" type="radio" id="uz" {...register('citizenship')} name='citizenship' value={'uz'} />
                                        <label className="form-check-label" htmlFor="uz"> Uzbek </label>
                                    </div>
                                    <div className="form-check ">
                                        <input className="form-check-input" type="radio" id="chet" {...register('citizenship')} name='citizenship' value={'chet'} />
                                        <label className="form-check-label" htmlFor="chet"> Chet'ellik </label>
                                    </div>
                                </div>
                                <ErrorInput>
                                    {errors.citizenship?.message?.toString() || hasError?.errors?.citizenship?.toString()}
                                </ErrorInput>
                            </div> */}
                            <div className="col-4 mb-1">
                                <label className="form-label">Muolaja turi</label>
                                <div className="d-flex">
                                    <div className="w-100">
                                        <Select
                                            name='name3'
                                            value={selectData?.treatment_id}
                                            required
                                            onChange={(e: any) => {
                                                setSelectData({
                                                    ...selectData,
                                                    treatment_id: e
                                                })
                                                setValue('treatment_id', e.value, {
                                                    shouldValidate: true,
                                                });
                                            }}
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                            // value={userBranch}
                                            options={
                                                dataSelect(treatmentData)
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
                                <ErrorInput>
                                    {errors.treatment_id?.message?.toString() || hasError?.errors?.treatment_id?.toString()}
                                </ErrorInput>
                            </div>
                            <div className="col-4 mb-1">

                                <label className="form-label">bolim</label>
                                <div className="d-flex">
                                    <div className="w-100">
                                        <Select
                                            required
                                            name='name3'
                                            value={selectData?.department}
                                            onChange={(e: any) => {
                                                setSelectData({
                                                    ...selectData,
                                                    department: e
                                                })
                                                setValue('department_id', e.value, {
                                                    shouldValidate: true,
                                                });

                                                // setGraphItem(graphItem?.map((_: any, index: number) => {
                                                //     if (index === i) {
                                                //         return {
                                                //             ..._,
                                                //             department: e,
                                                //             agreement_time: '',
                                                //             agreement_date: '',
                                                //         }
                                                //     }
                                                //     return _
                                                // }))
                                            }}
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                            // value={userBranch}
                                            options={
                                                [

                                                    ...dataSelect(departmentData)
                                                ]
                                            } />
                                    </div>

                                </div>
                                <ErrorInput>
                                    {errors.department_id?.message?.toString() || hasError?.errors?.department_id?.toString()}
                                </ErrorInput>


                            </div>
                            <div className="col-4">
                                <label className="form-label">Status</label>
                                <div className="d-flex">
                                    <div className="w-100">
                                        <Select
                                            isDisabled={data?.is_cash_open == true ? data?.graph_archive?.graph_archive_item?.filter((res: any) => +res?.is_assigned).length > 0 : false}
                                            name='name3'
                                            required
                                            value={selectData?.use_status}
                                            onChange={(e: any) => {
                                                setSelectData({
                                                    ...selectData,
                                                    use_status: e
                                                })
                                                setValue('use_status', e.value, {
                                                    shouldValidate: true,
                                                })


                                            }}
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                            // value={userBranch}
                                            options={
                                                use_status
                                            } />
                                    </div>
                                    <ErrorInput>
                                        {errors.use_status?.message?.toString() || hasError?.errors?.use_status?.toString()}
                                    </ErrorInput>
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
                            {
                                getValues('use_status') == 'treatment' ?
                                    <div className="col-4">
                                        <label className="form-label opacity-0" >Status</label>
                                        <div className="form-control border-0">
                                            <button
                                                type='button'
                                                onClick={() => {
                                                    isCheckQueue(selectData?.department?.value, getValues('shelf_number'))
                                                }}
                                                className='btn btn-info'>
                                                Javon raqami <span className='badge bg-white text-info ms-2'>{getValues('shelf_number') ?? '-'}</span>
                                            </button>
                                        </div>
                                    </div>
                                    : ''
                            }
                        </div>
                        <div className="row">


                            {/* <div className="col-4">
                                <label className="form-label">Yullanma</label>
                                <div className="d-flex">
                                    <div className="w-100">

                                        <Select
                                            name='name3'
                                            value={selectData?.referring_doctor_id}
                                            onChange={(e: any) => {
                                                setSelectData({
                                                    ...selectData,
                                                    referring_doctor_id: e
                                                })
                                                setValue('referring_doctor_id', e.value, {
                                                    shouldValidate: true,
                                                })


                                            }}
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                            options={
                                                [
                                                    {
                                                        value: 0,
                                                        label: 'Barchasi'
                                                    },
                                                    ...referringDoctorDataSelect(referringDoctorData)
                                                ]
                                            } />
                                    </div>
                                </div>
                            </div> */}
                        </div>
                        <div
                            ref={cardRef}
                            style={{
                                // maxHeight: `${window.innerHeight / 2.2}px`,
                                // overflowY: 'auto',
                                // overflowX: 'hidden',
                                padding: '0.5rem 0.5rem 0.5rem 0.5rem',
                                border: '1px solid #dee2e6',
                                marginTop: '0.5rem',
                                display: graphItem?.length > 0 ? 'block' : 'none'
                            }}>
                            <div className="d-flex gap-2 align-items-center flex-wrap">
                                {
                                    graphItem?.map((item: any, i: number) => {
                                        return (
                                            <div className=" my-2" key={i}>
                                                {/* <button className="d-absolute btn btn-sm btn-danger"
                                                type='button'
                                                onClick={() => {
                                                    console.log(item);

                                                    Swal.fire({
                                                        title: "Ma'lumotni o'chirasizmi?",
                                                        showDenyButton: true,
                                                        showCancelButton: true,
                                                        confirmButtonText: 'Ha',
                                                        denyButtonText: `Yo'q`,
                                                    }).then((result: any) => {
                                                        if (result.isConfirmed) {
                                                            if (item?.status == 'old') {
                                                                graphItemDelete({
                                                                    graph_item_id: item.id
                                                                })
                                                            }
                                                            setGraphItem(graphItem?.filter((_: any, index: number) => index !== i))
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
                                            </button> */}
                                                {/* <div className="col-4">
                                                <label className="form-label">bolim</label>
                                                <div className="d-flex">
                                                    <div className="w-100">
                                                        <Select
                                                            name='name3'
                                                            required
                                                            value={item?.department}
                                                            onChange={(e: any) => {



                                                                setGraphItem(graphItem?.map((_: any, index: number) => {
                                                                    if (index === i) {
                                                                        return {
                                                                            ..._,
                                                                            department: e,
                                                                            agreement_time: '',
                                                                            agreement_date: '',
                                                                        }
                                                                    }
                                                                    return _
                                                                }))
                                                            }}
                                                            className="basic-multi-select"
                                                            classNamePrefix="select"
                                                            // value={userBranch}
                                                            options={
                                                                [

                                                                    ...dataSelect(departmentData)
                                                                ]
                                                            } />
                                                    </div>

                                                </div>
                                            </div> */}

                                                <label className="form-label">{i + 1} - Kun</label>
                                                <div className="input-group">
                                                    {
                                                        getValues('use_status') == 'at_home' ?
                                                            <div className="input-group-text">
                                                                <input className="form-check-input mt-0" type="checkbox" aria-label="Checkbox for following text input"
                                                                    checked={+item?.is_assigned ? true : false}
                                                                    onChange={(e: any) => {
                                                                        setGraphItem(graphItem?.map((_: any, index: number) => {
                                                                            if (index === i) {
                                                                                return {
                                                                                    ..._,
                                                                                    is_assigned: e.target.checked,
                                                                                }
                                                                            }
                                                                            return _
                                                                        }))
                                                                    }}
                                                                />
                                                            </div> : ''
                                                    }

                                                    <Input type="date" value={item.agreement_date}
                                                        // min={user?.graph_format_date}
                                                        // readOnly={+item?.department?.value > 0 ? false : true}
                                                        placeholder="Xona nomeri" required={true} onChange={(e: any) => {
                                                            setGraphItem(graphItem?.map((_: any, index: number) => {
                                                                if (index === i) {
                                                                    return {
                                                                        ..._,
                                                                        agreement_date: e.target.value,
                                                                        agreement_time: '',
                                                                        agreement_time_data: []

                                                                    }
                                                                }
                                                                return _
                                                            }))
                                                        }}
                                                    />
                                                    {/* <button className='btn btn-info btn-sm'
                                                        disabled={+item?.department?.value > 0 ? false : true}
                                                        type='button'
                                                        onClick={() => {
                                                            if (item.agreement_date?.length > 0) {
                                                                workingDateCheck(item?.agreement_date, i, item?.department)
                                                            } else {
                                                                workingDateCheck(user?.graph_format_date, i, item?.department)
                                                            }
                                                        }}

                                                    >
                                                        <MdToday />
                                                    </button> */}
                                                    <button
                                                        // disabled={graphItem?.length==1 && graphItem[0]?.agreement_date?.length==0 ? true : false}
                                                        disabled={getValues('use_status') == 'at_home' && Number.isInteger(+item?.id) && item?.id > 0 ? true : false}
                                                        className="btn btn-sm btn-danger"
                                                        type='button'
                                                        onClick={() => {
                                                            console.log(item);

                                                            Swal.fire({
                                                                title: "Ma'lumotni o'chirasizmi?",
                                                                showDenyButton: true,
                                                                showCancelButton: true,
                                                                confirmButtonText: 'Ha',
                                                                denyButtonText: `Yo'q`,
                                                            }).then((result: any) => {
                                                                if (result.isConfirmed) {
                                                                    if (item?.status == 'old') {
                                                                        if (data?.use_status == 'at_home') {
                                                                            graphItemDelete({
                                                                                graph_item_id: item.id
                                                                            }, item.id)
                                                                        } else {

                                                                            graphItemDelete({
                                                                                graph_item_id: item.id
                                                                            })
                                                                        }
                                                                    }
                                                                    let deletedata = graphItem?.filter((_: any, index: number) => index !== i);
                                                                    if (deletedata?.length > 0) {
                                                                        setGraphItem(deletedata)
                                                                    }
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
                                                    {
                                                        i == graphItem?.length - 1 ? <button className='btn btn-primary ' onClick={() => {
                                                            let date = addOneDay(user?.graph_format_date);
                                                            if (graphItem?.at(-1)?.agreement_date?.length > 0) {
                                                                date = addOneDay(graphItem?.at(-1)?.agreement_date)
                                                            }
                                                            setGraphItem([...graphItem, {
                                                                id: nanoid(),
                                                                room_type: '',
                                                                room_number: '',
                                                                agreement_date: date
                                                            }])
                                                            setTimeout(() => {
                                                                scrollToBottom();
                                                            }, 100);
                                                        }} type='button' >+</button> : ''
                                                    }
                                                </div>
                                                {/* <div className="col-2">
                                                <label className="form-label">Kelishuv vaqti</label>
                                                <Select
                                                    name='name3'
                                                    isDisabled={item.agreement_date?.length > 0 && (item?.agreement_time?.length == 0 || item?.agreement_time?.value == '') ? false : true}
                                                    value={item?.agreement_time}
                                                    onChange={(e: any) => {
                                                     
                                                        setGraphItem(graphItem?.map((_: any, index: number) => {
                                                            if (index === i) {
                                                                return {
                                                                    ..._,
                                                                    agreement_time: e
                                                                }
                                                            }
                                                            return _
                                                        }))
                                                    }}
                                                    className="basic-multi-select"
                                                    classNamePrefix="select"
                                                    options={
                                                        item?.agreement_time_data
                                                    } />
                                              
                                            </div>
                                            <div className="col-4">
                                                <label className="form-label">Xizmatlar</label>

                                                <div className="d-flex">
                                                    <div className="w-100">
                                                        <Select
                                                            name='name3'
                                                            required
                                                            value={item?.service}
                                                            isMulti
                                                            onChange={(e: any) => {
                                                                setSelectData({
                                                                    ...selectData,
                                                                    service: e,
                                                                })

                                                                setGraphValue(() => [
                                                                    ...e?.map((item: any) => item.data)
                                                                ])
                                                                setGraphItem(graphItem?.map((_: any, index: number) => {
                                                                    if (index === i) {
                                                                        return {
                                                                            ..._,
                                                                            service: e
                                                                        }
                                                                    }
                                                                    return _
                                                                }))
                                                            }}
                                                            className="basic-multi-select"
                                                            classNamePrefix="select"
                                                            options={
                                                                [

                                                                    ...dataSelect(serviceData.filter((item_: any) => item_.department.id == item?.department?.value))]
                                                            } />
                                                    </div>
                                                </div>
                                            </div> */}


                                            </div>
                                        )
                                    })
                                }
                                {/* <div>
                                   
                                </div> */}
                            </div>
                        </div>

                    </div>
                    <div className="modal-footer">
                        {
                            data?.is_cash_open ?
                                <button type="button" className="btn btn-warning"
                                    onClick={() => {
                                        setOpenCashRegModal(true)
                                        setRegItem(() => {
                                            return {
                                                is_atHome: true,
                                                ...data?.at_home_data,
                                                client_value: [
                                                    ...data?.at_home_data?.client_value
                                                ]
                                            }
                                        })
                                        setRegModal(true)
                                    }}

                                >Kassa</button>
                                : ''
                        }
                        <button type="submit" className="btn btn-primary" >Qo'shish</button>

                        <button type="button" className="btn btn-danger" onClick={toggle}>Ortga</button>
                    </div>
                    <ToastContainer />
                </form>
            </Modal >
            <Loader loading={loading} />
            {/* navbat tanlash model */}

            <Modal Modal backdrop="static" keyboard={false} size='lg' centered={true} isOpen={isQueueModal} toggle={queueToggle} role='dialog' >
                <div>
                    <div className="modal-header">
                        <h3 className="modal-title">
                            Navbat
                        </h3>
                        <button onClick={queueToggle} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body ">
                        {
                            queueNumberTargtet?.limit &&
                            Array.from({ length: Math.ceil(queueNumberTargtet.limit.length / 10) }).map((_, rowIndex) => (
                                <div className="d-flex gap-2 mb-2" key={rowIndex}>
                                    {queueNumberTargtet.limit
                                        .slice(rowIndex * 10, rowIndex * 10 + 10)
                                        .map((item: any) => (
                                            <button
                                                disabled={new Set(queueNumberTargtet?.data).has(item)}
                                                key={item}
                                                className={`fokus_none  w-100 btn-lg  ${new Set(queueNumberTargtet?.data).has(item) ? 'btn btn-success' : +queueNumber === item ? 'btn btn-primary' : 'btn btn-hover-primary'
                                                    }`}

                                                onClick={() => {
                                                    if (+queueNumber === item) {
                                                        setQueueNumber(0)
                                                    } else {
                                                        setQueueNumber(item)
                                                    }
                                                }}
                                            >
                                                {item}
                                            </button>
                                        ))}
                                </div>
                            ))
                        }
                    </div>
                    <div className="modal-footer">
                        <button className='btn btn-primary'
                            onClick={() => {
                                if (queueNumber > 0) {
                                    let find = queueNumberData?.find((item: any) => item?.department?.id === queueNumberTargtet?.department?.id)
                                    if (find) {
                                        find?.data?.push(queueNumber)
                                        setQueueNumberData(() => queueNumberData?.map((item: any) => {
                                            if (item?.department?.id === queueNumberTargtet?.department?.id) {
                                                return {
                                                    ...item,
                                                    queue_number: queueNumber
                                                }
                                            } else {
                                                return item
                                            }
                                        }))
                                    } else {
                                        setQueueNumberData(() => [...queueNumberData, { department: queueNumberTargtet?.department, queue_number: queueNumber }])
                                    }
                                    setQueueNumber(0)
                                    setQueueNumberTarget({} as any)
                                    setValue('shelf_number', queueNumber, { shouldValidate: true })
                                    queueToggle()
                                }

                            }}
                        >Saqlash</button>
                    </div>
                </div>

            </Modal >
            {
                regModal ? <ClientAdd
                    modal={regModal}
                    atHomeFunction={() => {
                        if (openCashRegModal) {
                            toggle()
                        } else
                            if (getValues('use_status') == 'at_home') {
                                sendApi({
                                    ...data,
                                    ...getValues(),
                                })
                            }
                    }}
                    setModal={setRegModal}
                    data={regItem}
                /> : <></>
            }

        </>
    )
}

export default RegGraphAdd