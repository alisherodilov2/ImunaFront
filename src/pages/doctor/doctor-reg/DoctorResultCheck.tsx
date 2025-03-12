import React, { useEffect, useRef, useState } from 'react'
// import Layout from '../layouts/Layout'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Toast, ToastHeader, ToastBody, TabPane, TabContent, NavItem, Nav, NavLink, PopoverBody, PopoverHeader, Popover, Spinner } from 'reactstrap'
import classnames from 'classnames';
import Navbar from '../../../layout/Navbar'
// import { CKEditor } from '@ckeditor/ckeditor5-react';
import { CKEditor } from 'ckeditor4-react';
// @ts-ignore
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import uploadFileIcon from '../../../assets/upload-file.svg'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { set, useForm } from "react-hook-form";
import * as yup from "yup";
import { useTimer } from 'react-timer-hook';
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from 'react-redux';
import { query, queryObj } from '../../../componets/api/Query';
import { ReducerType } from '../../../interface/interface';
import Loader from '../../../componets/api/Loader';
import Input from '../../../componets/inputs/Input';
import { NumericFormat, PatternFormat } from 'react-number-format';
import ErrorInput from '../../../componets/inputs/ErrorInput';
import Select from 'react-select';
import axios, { all } from 'axios';
import { MdDelete, MdDeleteForever, MdNotifications } from 'react-icons/md';
import Swal from 'sweetalert2';
import { json, Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { AppDispatch } from '../../../service/store/store';
import { isClientAdd, isClientDefaultApi, isClientEdit, isDoctorTargetData } from '../../../service/reducer/ClientReducer';
import DepartmentAdd from '../../director/services/department/DepartmentAdd';
import Table from '../../../componets/table/Table';
import { nanoid } from '@reduxjs/toolkit';
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaCheckCircle, FaCircle, FaPauseCircle, FaPlayCircle, FaPlus, FaPrint, FaRegEdit } from 'react-icons/fa';
import { isGrapItemDelete } from '../../../service/reducer/GraphReducer';
import { fullName, masulRegUchunFullName } from '../../../helper/fullName';
import { phoneFormatNumber } from '../../../helper/graphHelper';
import { dateFormat } from '../../../service/helper/day';
import { calculateAge } from '../../../helper/calculateAge';
import { formatId } from '../../../helper/idGenerate';
import Content from '../../../layout/Content';
import { getCurrentDateTime } from '../../../helper/dateFormat';
import { date } from '../../../service/helper/date';
import { groupTemplateItemsByCategory, newGroupTemplateItemsByCategory, templateGroupByCategory } from '../../../helper/cutomerHelper';
import Slider from "react-slick";
import { domain } from '../../../main';
import { MyTimer, timeData } from './MyTimer';
import { statusColor } from '../DoctorDesctoWelcome';
import { isDepartmentGet } from '../../../service/reducer/DepartmentReducer';
import { isDoctorTemplateGet } from '../../../service/reducer/DoctorTemplateReducer';
import { generateDoctorTemplate } from '../../../helper/generateDoctorTemplate';
import { docregprintcheckbox, docregprintheader, docregprintselect } from '../../../helper/doctorRegHelper';
import { certificateHtml } from './certificateHtml';
import { isPatientDiagnosisGet } from '../../../service/reducer/PatientDiagnosisReducer';
import { isPatientComplaintGet } from '../../../service/reducer/PatientComplaintReducer';
import PatientDiagnosisAdd from '../patient-diagnosis/PatientDiagnosisAdd';
import PatientComplaintAdd from '../patient-complaint/PatientComplaintAdd';

// import { isAddClient, isEditClient } from '../../client/reducer/ClientReducer';
const DoctorResultCheck = () => {
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        centerPadding: "60px",
        className: "center",
        slidesToShow: 4,
        slidesToScroll: 4
    };
    const [htmlCode, setHtmlCode] = useState<string>('<h1>Bu yerda chop qilinadigan matn bor</h1>');
    const iframeRef = useRef<any>(null);
    const iframeRefLab = useRef<any>(null);
    const iframeRefCert = useRef<any>(null);
    const { serviceData, } = useSelector((state: ReducerType) => state.ServiceReducer)
    const { data } = useSelector((state: ReducerType) => state.ClientReducer)
    const { user, } = useSelector((state: ReducerType) => state.ProfileReducer)
    const template = groupTemplateItemsByCategory(user?.department?.department_template_item)
    const [diagnosisModal, setDiagnosisModal] = useState(false)
    const [complaintisModal, setComplatentModal] = useState(false)
    const { departmentData, } = useSelector((state: ReducerType) => state.DepartmentReducer)
    const { clientData } = useSelector((state: ReducerType) => state.ClientReducer)
    // const [data, setData] = useState({} as any)
    const [modal2, setModal2] = useState(false)
    const [modal3, setModal3] = useState(false)
    const { serviceTypeData } = useSelector((state: ReducerType) => state.ServiceTypeReducer)
    const dataSelect = (data: any) => {
        let res = [...data];
        return res?.map((item: any) => {
            return {
                value: item?.id, label: `${item?.name || item?.type} ${item?.price ? `(${item?.price} so'm)` : ''}`,
                data: item
            }
        })
    }
    const alertSoket = async () => {
        try {
            console.log(data.target.client_value?.find((res: any) => res?.queue_number > 0));
            let queue_number = data.target.client_value?.find((res: any) => res?.queue_number > 0)
            let number = `${user?.department?.letter} - ${queue_number?.queue_number ?? 0}`
            setLoad(() => true)
            let res = await axios.get(`/client/alert-soket/1?number=${number}&room=${user?.department?.main_room ?? '-'}`)

        } catch (error) {

        }
        finally {
            setLoad(() => false)
        }
    }
    const [content, setContent] = useState<string>('<p>Start writing here...</p>');
    const [htmlcheckboxData, setHtmlcheckboxData] = useState<any>([]);
    const [htmlparentItem, setHtmlparentItem] = useState<any>([]);

    const handleChange = (evt: any) => {
        const newContent = evt.editor.getData();
        setContent(newContent);
    };
    const APi_url = domain + '/api/v3/file-upload'

    const [complateLoading, setComplateLoading] = useState(false)
    const handleConfirmation = (confirm: any, toastId: any) => {
        if (confirm) {
            let find = JSON.parse(toastId);
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
                        setValue('paretn_id', find?.[key as string], {
                            shouldValidate: true,
                        });
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
    useEffect(() => {
        setCrkRole(() => true)
        if (+user?.is_editor > 0) {
            dispatch(isDoctorTemplateGet(''))
        }
    }, [])

    const autocomplate = async (target: string) => {
        try {
            setComplateLoading(true)
            let res = await axios.get(`/client/autocomplate${target}`)
            const { result } = res.data
            if (result?.length > 0) {
                for (let index = 0; index < result?.length; index++) {
                    const toastId = JSON.stringify(result[index]);
                    toast.info(
                        <div className='d-flex justify-content-between align-items-center toast_card gap-2 w-100'>
                            <p className='m-0 p-0'>
                                {fullName(result[index])}
                            </p>
                            <p className='m-0 p-0'>
                                {result[index]?.data_birth}
                            </p>
                            <p className='m-0 p-0'>
                                {phoneFormatNumber(result[index]?.phone)}
                            </p>
                        </div>,
                        {
                            toastId,
                            className: 'custom-toast',
                            position: 'top-center',
                            autoClose: false,
                            closeOnClick: false,
                            draggable: true,
                            pauseOnHover: false,
                            closeButton: ({ closeToast }) => (
                                <div className="custom-close-button d-flex justify-content-center align-items-center">
                                    <button type='button' className='btn btn-sm btn-success' onClick={() => handleConfirmation(true, toastId)}>Ha</button>
                                    <button type='button' className='btn btn-sm btn-danger' onClick={() => handleConfirmation(false, toastId)}>Yo'q</button>
                                </div>
                            ),
                        }
                    );
                }
            }

        } catch (error) {

        }
        finally {
            setComplateLoading(false)
        }
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
            // last_name: yup.string().required("Ismi kiriting!"),
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
            ...data,
        }
    });
    // const {  } = useSelector((state: ReducerType) => state.ClientReducer)

    const [clinetValue, setClientValue] = useState([] as any)
    const [activeTab, setActiveTab] = useState('1' as any);
    const [enter, setEnter] = useState(false);
    const { id } = useParams();
    const [load, setLoad] = useState(false)
    const path = useNavigate()
    const [room, setRoom] = useState([] as any)
    const [roomTarget, setRoomTarget] = useState({} as any)
    const [certificate, setCertificate] = useState({
        id: 0,
        serial_number_1: '',
        serial_number_2: '',
        date_1: '',
        date_2: '',
        client_id: 0,
        department_id: 0
    } as any)
    const [roomModal, setRoomModal] = useState(false)
    const certificateSend = async (certificate: any) => {
        try {
            setLoad(() => true)
            let formdata = new FormData()
            for (let key in certificate) {
                formdata.append(key, certificate[key])
            }
            formdata.append('client_id', data?.target?.id)
            formdata.append('department_id', user?.department?.id)
            let res = await axios.post(`/client/certificate`, formdata)
            const { result } = res.data
            dispatch(isDoctorTargetData({
                ...data,
                target: {
                    ...data?.target,
                    client_certificate: result
                }
            }))
        } catch (error) {

        } finally {
            setLoad(() => false)

        }
    }
    const doctorRoom = async () => {
        try {
            setLoad(() => true)
            let res = await axios.get(`/client/doctor-room?status=empty`)
            const { result } = res.data
            console.log('room', result);
            if (result?.department_value?.length == 0) {
                if (result?.empty) {
                    alert("Bo'sh  xona topilmadi")
                } else {
                    // start boshlashi kerak
                    // setRoomTarget(() => result)
                    console.log('result', result);

                    doctorResult(templateResult, 'start', result.id)
                }
            } else {
                let room = [] as any;
                if (!result?.empty) {
                    room = [...room, result]
                }
                room = [...room, ...result?.department_value?.filter((item: any) => !item?.empty)]
                if (room?.length > 0) {
                    setRoom(() => room)
                    setRoomModal(true)
                } else {
                    alert("Bo'sh  xona topilmadi")
                }
            }
            // setRoom(() => result)
            // if (result?.length > 0) {
            //     setRoomModal(true)
            // } else {
            //     alert("Bo'sh  xona topilmadi")
            // }

        } catch (error) {
        } finally {
            setLoad(() => false)
        }
    }
    const allShow = async (id: any, target?: any, department?: any) => {
        try {
            setLoad(() => true)
            let res = await axios.get(`/client?doctor_show_person_id=${id}&target_id=${target ?? 0}&is_finish=${department ? 'finish' : pathname?.split('/').at(-2)}&department_id=${department ?? 0}`)
            const { result } = res.data

            if (+result?.client_item?.at(0)?.client_result.at(-1)?.doctor?.is_editor) {
                setCrkRole(() => true)
            } else {
                setCrkRole(() => false)
            }
            if (+result?.data?.id > 0) {


                if (department > 0) {
                    dispatch(isDoctorTargetData({
                        ...result?.data,
                        time: 0,
                        target: false
                    }))

                    setDateTargetId(0)
                    let departmentFind = departmentData?.find((res: any) => res?.id == department)
                    setDepartmentTarget({
                        label: departmentFind?.name,
                        value: departmentFind?.id,
                    })
                    setCertificate(() => result?.data?.client_item?.at(-1)?.client_certificate)
                } else {
                    let user = target ? result?.data?.client_item?.find((res: any) => res?.id == target) : result?.data?.client_item?.at(-1)
                    dispatch(isDoctorTargetData({
                        ...result?.data,
                        time: result?.time,
                        target: user
                    }))
                    console.log('serrrrr', user);

                    setCertificate(() => user?.client_certificate)
                    setDepartmentTarget({
                        label: "Tibbiy ko'rik tanlang",
                        value: '',
                    })
                    path(`/customer/${statusColor(user?.client_result.at(-1)?.is_check_doctor, true)}/${user?.person_id}`)
                }
            } else if (result?.message?.length > 0) {
                alert(result?.message)
            } else {
                path('/')
            }
            // path(`/customer/${result?.person_id}`)
            // setCash(() => true)
        } catch (error) {
            path('/')
        } finally {
            setLoad(() => false)
        }
    }
    const doctorResult = async (target: any, status?: any, roomId?: any) => {
        try {
            setLoad(() => true)
            let formData = new FormData();
            if (roomTarget?.id > 0) {
                formData.append('room_id', roomTarget?.id)
            }
            if (roomId > 0) {
                formData.append('room_id', roomId)

            }
            formData.append('template_result', JSON.stringify(
                [...target?.filter((res: any) => res?.status != 'photo' && res?.status != 'ckreditor')?.map((res: any) => {
                    return {
                        ...res,

                    }
                }),
                ...ckeditorData?.map((res: any) => {
                    return {
                        status: 'ckreditor',
                        description: res?.data,
                        doctor_template_id: res?.doctor_template_id?.value ?? 0,
                        id: res.id,
                        value: res?.value
                    }
                })
                ]
            ))
            if (status) {
                formData.append('is_check_doctor', status)
            }
            let photodata = target?.filter((res: any) => res?.status == 'photo');
            if (photodata?.length > 0) {
                for (let key of photodata) {
                    console.log(key);
                    if (key?.photo) {
                        formData.append(`photo_${key.template_id}`, key?.photo);
                    }
                }
            }

            let res = await axios.post(`/client/doctor-result/${data?.target?.id}`, formData)
            const { result } = res.data
            dispatch(isDoctorTargetData({
                ...data,
                time: result?.time,
                client_item: data?.client_item?.map((item: any) => item.id === result.data.id ? result.data : item),
                target: result?.data
            }))
            path(`/customer/${statusColor(result?.data?.client_result.at(-1)?.is_check_doctor, true)}/${result?.data?.person_id}`)
            setRoomModal(false)
            setTemplateResult(() => result?.data?.template_result)
            // path(`/customer/${result?.person_id}`)
            // setCash(() => true)
        } catch (error) {
            // path('/')
        } finally {
            setLoad(() => false)
        }
    }
    const [templateResult, setTemplateResult] = useState([] as any)
    const [crkRole, setCrkRole] = useState(() => false)
    useEffect(() => {



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
            setTemplateResult(() => data?.target?.template_result?.filter((res: any) => res?.status != 'ckreditor'))
            let ckreditorOld = data?.target?.template_result?.filter((res: any) => res?.status == 'ckreditor')
            if (ckreditorOld?.length > 0) {
                setCkeditorData(() => ckreditorOld
                    ?.map((res: any) => {
                        return {
                            data: res?.description,
                            id: res?.id,
                            value: res?.value,
                            doctor_template_id: {
                                label: res?.doctor_template?.name,
                                value: res?.doctor_template?.id,
                                data: res?.doctor_template
                            }
                        }
                    })
                )
            } else {
                setCkeditorData(() => [
                    {
                        id: nanoid(),
                        doctor_template_id: false,
                        data: '',
                        value: '',
                    }
                ])
            }
            setSelectData(() => {
                return {
                    ...selectData
                }
            })
            for (let key in data) {
                setValue(key, data?.[key as string], {
                    shouldValidate: true,
                });

                // extraFuntion(data?.[key], key)
            }
            setCertificate(() => data?.target?.client_certificate)
            // setTemplateResult(() => data?.target?.template_result)
        } else {
            if ((id ?? '')?.length > 0) {
                // if(Object.keys(selectData).length == 0){
                allShow(id)
                // }
            }
        }

    }, [data])
    useEffect(() => {
        dispatch(isDepartmentGet(''))
        if (+user?.is_editor > 0) {
            setCrkRole(true)
        } else {
            setCrkRole(false)
        }
    }, [])
    useEffect(() => {
        if (+user?.is_diagnoz) {
            dispatch(isPatientDiagnosisGet(''))
        }
        if (+user?.is_shikoyat) {
            dispatch(isPatientComplaintGet(''))
        }
    }, [])
    const [autocomplateText, setAutocomplateText] = useState('' as any)
    const doctorRoomtoggle = () => {
        setRoomModal(() => false)
    }
    const [isEditorLoaded, setIsEditorLoaded] = useState(false);
    const { pathname } = useLocation();
    const { doctorTemplateData } = useSelector((state: ReducerType) => state.DoctorTemplateReducer)
    const { patientComplaintData } = useSelector((state: ReducerType) => state.PatientComplaintReducer)
    const { patientDiagnosisData } = useSelector((state: ReducerType) => state.PatientDiagnosisReducer)

    const toggle = () => {
        // setModal(!modal)
        // setData(() => { })
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
        setActiveTab('1')
    };
    // const [item, setItem] = useState({} as any)
    const send = (e: any) => {
        if (clinetValue?.length == 0) {
            alert("Xizmatlarni tanlang!")
        } else {


            // dispatch(isClientAdd({
            //     query: queryObj({
            //         ...data, ...e,
            //         graph_item_id: `${+e?.graph_item_id > 0 ? e?.graph_item_id : 0}`,
            //         id: `${+data?.id > 0 ? data?.id : 0}`,
            //         parent_id: null,
            //         edit_parent_id: `${+data?.parent_id > 0 ? data?.parent_id : 0}`,
            //         client_value: JSON.stringify(
            //             clinetValue?.map((res: any) => {
            //                 return {
            //                     id: res?.id ?? 0,
            //                     service_id: res?.service_id,
            //                     department_id: res?.department_id,
            //                     price: res.price,
            //                     qty: res.qty ?? 1,
            //                     is_probirka: res?.department?.probirka
            //                 }
            //             })

            //         )
            //     })
            // }))
        }
        // if (id?.toString()?.length ?? 0 > 0) {
        //   dispatch(isProductEdit({ query: query({ ...data, product_value: JSON.stringify(product_values) }, ['photo']), file: file, id: id }))
        // } else {
        //   dispatch(isProductAdd({ query: query({ ...data, product_value: JSON.stringify(product_values) }, ['photo']), file: file }))
        // }
        // if (data?.id?.toString()?.length ?? 0 > 0) {
        //     dispatch(isClientEdit({ query: query({ ...data, ...e, probirka: `${e?.probirka ? 0 : 1}`, client_value: JSON.stringify(clinetValue) }), id: data?.id }))
        //     /////// dispatch(isCostEdit(data)) 
        // } else {
        //     dispatch(isClientAdd({ query: query({ ...data, ...e, probirka: `${e?.probirka ? 0 : 1}`, client_value: JSON.stringify(clinetValue) }) }))
        // }

    }
    console.log('templateResult', templateResult);

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
    const [targetTemplate, setTargetTemplate] = useState(() => user?.department?.department_template_item?.at(0)?.id ?? 0 as any)

    const {
        totalSeconds,
        seconds,
        minutes,
        hours,
        days,
        isRunning,
        start,
        pause,
        resume,
        restart,
    } = useTimer({ expiryTimestamp: new Date(), onExpire: () => console.warn('onExpire called') });
    useEffect(() => {
        if (data?.target?.client_result?.at(-1)?.is_check_doctor == 'pause') {
            console.log('pause', data?.target?.client_result?.at(-1)?.is_check_doctor);
            const time = new Date();
            let second = data?.target?.client_result?.at(-1)?.duration - (data?.target?.client_result?.at(-1)?.use_duration ?? 0) as any;
            if (second < 0) {
                second = 0
            }
            time.setSeconds(time.getSeconds() + second);
            restart(time)
            pause()
        } else
            if (data?.target?.client_result?.at(-1)?.is_check_doctor == 'start') {
                const time = new Date();
                let second = data?.target?.client_result?.at(-1)?.duration - ((data?.target?.client_result?.at(-1)?.use_duration ?? 0)) as any;
                if (data?.time > 0) {
                    second = second - (data?.time ?? 0)
                }
                if (second <= 0) {
                    second = 0
                }
                time.setSeconds(time.getSeconds() + second);
                restart(time)
                start()
            }
            else {
                const time = new Date();
                time.setSeconds(time.getSeconds() + 0);
                restart(time)
            }
    }, [data])
    const [departmentTarget, setDepartmentTarget] = useState({
        label: "Tibbiy ko'rik tanlang",
        value: 0
    } as any)
    const [dateTargetId, setDateTargetId] = useState(0)
    const [ckeditorData, setCkeditorData] = useState([
        {
            id: nanoid(),
            doctor_template_id: false,
            data: '',
            value: '',
        }
    ] as any)
    const [ckeditorLoad, setCkeditorLoad] = useState({
        load: false,
        index: 0
    } as any)
    const [isMonoBlock, setIsMonoBlock] = useState(false)
    const monoblokToggle = () => {
        setIsMonoBlock(!isMonoBlock)
        // setSelectData({
        //     ...selectData,
        //     department_id: false
        // })
    }
    const [isMonoBlockRetsept, setIsMonoBlockRetsept] = useState(false)
    const monoblokToggleRetsept = () => {
        setIsMonoBlockRetsept(!isMonoBlockRetsept)
        // setSelectData({
        //     ...selectData,
        //     department_id: false
        // })
    }
    const [medicineData, setMedicineData] = useState([] as any)
    const [medicineItemCheck, setMedicineItemCheck] = useState([] as any)
    const [medicineItem, setMedicineItem] = useState([] as any)
    const [medicineDataTarget, setMedicineDataTarget] = useState({
        medicines: []
    } as any)
    const [medicineDataRetsept, setMedicineDataRetsept] = useState([] as any)
    const [medicineItemCheckRetsept, setMedicineItemCheckRetsept] = useState([] as any)
    const [medicineItemRetsept, setMedicineItemRetsept] = useState([] as any)
    const [medicineDataTargetRetsept, setMedicineDataTargetRetsept] = useState({
        medicines: []
    } as any)


    const getMedicine = async (medicine = true) => {
        try {
            setLoad(() => true)
            let res = await axios.get(`/medicine-type/medicine`)
            const { result } = res.data
            if (medicine) {
                setMedicineItemCheck(() => medicineItem)
                setMedicineData(result)
                setMedicineDataTarget(result?.at(0) ?? {})
                setIsMonoBlock(() => true)
            } else {
                setMedicineItemCheckRetsept(() => medicineItemRetsept)
                setMedicineDataRetsept(result)
                setMedicineDataTargetRetsept(result?.at(0) ?? {})
                setIsMonoBlockRetsept(() => true)
            }

        } catch (error) {

        }
        finally {
            setLoad(() => false)
        }
    }
    const updateIframeContent = (content: string) => {
        const iframeDoc = iframeRef.current?.contentDocument;
        if (iframeDoc) {
            iframeDoc.open();
            iframeDoc.open();
            // Faqat body tagidagi kontentni yozish va meta va titleni olib tashlash
            iframeDoc.write(`
            <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title></title>
    <style>
        title{
            display: none;
        }
       
        table,
        th,
        td {
            border: 1px solid black;
            border-collapse: collapse;
        }
        table{
            border: 2px solid black;
        }
        table{
            width: 100%;
        }
    
        td {
            padding: 5px;
            font-size: 16px;
            font-weight: normal;
        }
             /* Har bir sahifaning boshidagi matn */
              .page-header {
                font-size: 18px;
                font-weight: bold;
                text-align: center;
                margin-top: 20px;
              }
              /* Har bir sahifa uchun ajratish */
             
              /* @page CSS qoidasini qo'llash */
            @media print {
             .page-break {
                page-break-before: always;
              }
                // body {
                //   margin: 0;
                //   padding: 0;
                // }
                /* Brauzerning avtomatik header/footer-ni olib tashlash */
                .header, .footer {
                  display: none;
                }
                @page {
                  margin: 1rem 2rem;
                }
              }
    </style>
</head>

<body>
<div>   ${content}</div>
</body>

</html>
            `);
            iframeDoc.close();
        }
    };
    const handlePrint = () => {
        if (iframeRef.current) {
            const iframeWindow = iframeRef.current.contentWindow;
            iframeWindow.print(); // Iframe ichidagi matnni chop qilish
        }
    };
    const updateIframeContentLab = (content: string) => {
        const iframeDoc = iframeRefLab.current?.contentDocument;
        if (iframeDoc) {
            iframeDoc.open();
            iframeDoc.open();
            // Faqat body tagidagi kontentni yozish va meta va titleni olib tashlash
            iframeDoc.write(`
            <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title></title>
    <style>
        title{
            display: none;
        }
       
        table,
        th,
        td {
            border: 1px solid black;
            border-collapse: collapse;
        }
            

        table{
            border: 2px solid black;
        }
        table{
            width: 100%;
        }
    
        td {
            padding: 5px;
            font-size: 16px;
            font-weight: normal;
        }
             /* Har bir sahifaning boshidagi matn */
              .page-header {
                font-size: 18px;
                font-weight: bold;
                text-align: center;
                margin-top: 20px;
              }
              /* Har bir sahifa uchun ajratish */
             
              /* @page CSS qoidasini qo'llash */
            @media print {
             .page-break {
                page-break-before: always;
              }
                // body {
                //   margin: 0;
                //   padding: 0;
                // }
                /* Brauzerning avtomatik header/footer-ni olib tashlash */
                .header, .footer {
                  display: none;
                }
                @page {
                  margin: 1rem 2rem;
                }
              }
    </style>
</head>

<body>
<div>   ${content}</div>
</body>

</html>
            `);
            iframeDoc.close();
        }
    };
    const handlePrintLab = () => {
        if (iframeRefLab.current) {
            const iframeWindow = iframeRefLab.current.contentWindow;
            iframeWindow.print(); // Iframe ichidagi matnni chop qilish
        }
    };
    const waitForQrCodeToLoad = (iframeDoc: Document) => {
        return new Promise<void>((resolve) => {
            const qrCodeImg = iframeDoc.querySelector('img[src^="https://api.qrserver.com/v1/create-qr-code"]');
            if (qrCodeImg) {
                qrCodeImg.addEventListener('load', () => resolve());
            } else {
                resolve(); // Resolve immediately if no QR code is found
            }
        });
    };
    const updateIframeContentChek = async (content: any) => {
        const iframeDoc = iframeRefCert.current?.contentDocument;
        if (iframeDoc) {
            iframeDoc.open();
            iframeDoc.write(certificateHtml(content, user));
            iframeDoc.close();

            // Wait for QR code to load
            await waitForQrCodeToLoad(iframeDoc);
            console.log('QR Code loaded');
        }
    };

    const handlePrintChek = async () => {
        const iframeDoc = iframeRefCert.current?.contentDocument;
        const iframeWindow = iframeRefCert.current?.contentWindow;
        if (iframeDoc && iframeWindow) {
            await waitForQrCodeToLoad(iframeDoc); // Wait for QR code
            iframeWindow.print(); // Print only after QR code is ready
        }
    };
    return (
        <>
            <Loader loading={load} />
            <div className='doc_reg_m'>

                <Content >
                    <Navbar />
                    <div className='container-fluid flex-grow-1 py-1 size_16'>
                        <div className="row">


                            <ToastContainer />
                            {data?.id > 0 ?
                                <>
                                    <div className='col-9'>
                                        <div className={`d-${+user?.is_shikoyat ? 'flex' : 'none'} align-items-center gap-2 position-relative mb-1`}>
                                            <p
                                                className='mb-0'
                                                style={{
                                                    minWidth: '210px',
                                                    whiteSpace: 'nowrap',
                                                    fontSize: '12px'
                                                }}
                                            >BEMORNING KELGANDAGI SHIKOYATI:</p>
                                            {/* <input type="text" className='form-control' /> */}
                                            <div className='w-100'>
                                                <Select
                                                    name='name3'
                                                    isMulti

                                                    value={selectData?.complaint}
                                                    onChange={(e: any) => {
                                                        setSelectData({
                                                            ...selectData,
                                                            complaint: e
                                                        })


                                                    }}
                                                    className="basic-multi-select"
                                                    classNamePrefix="select"
                                                    placeholder={"Shikoyat tanlang "}
                                                    // value={userBranch}
                                                    options={
                                                        [
                                                            {
                                                                value: 0,
                                                                label: 'Barchasi'
                                                            },
                                                            ...dataSelect(patientComplaintData)
                                                        ]
                                                    } />
                                            </div>
                                            <button
                                                style={{
                                                    position: 'absolute',
                                                    right: '5px',
                                                    zIndex: 1
                                                }}
                                                onClick={() => {
                                                    setComplatentModal(true)
                                                }}
                                                className='btn btn-success rounded-pill btn-icon btn-sm'>+</button>
                                        </div>
                                        <div className={`d-${+user?.is_diagnoz ? 'flex' : 'none'}  align-items-center gap-2 position-relative mb-1`}>
                                            <p
                                                className='mb-0'
                                                style={{
                                                    minWidth: '210px',
                                                    whiteSpace: 'nowrap',
                                                    fontSize: '12px'
                                                }}
                                            >DIAGNOZ:</p>
                                            {/* <input type="text" className='form-control' /> */}
                                            <div className="w-100">
                                                <Select
                                                    name='name3'
                                                    isMulti

                                                    value={selectData?.diagnosis}
                                                    onChange={(e: any) => {
                                                        setSelectData({
                                                            ...selectData,
                                                            diagnosis: e
                                                        })


                                                    }}
                                                    className="basic-multi-select"
                                                    classNamePrefix="select"
                                                    placeholder={"Diagnoz tanlang "}
                                                    // value={userBranch}
                                                    options={
                                                        [
                                                            {
                                                                value: 0,
                                                                label: 'Barchasi'
                                                            },
                                                            ...dataSelect(patientDiagnosisData)

                                                        ]
                                                    } />
                                            </div>
                                            <button
                                                style={{
                                                    position: 'absolute',
                                                    right: '5px',
                                                    zIndex: 1
                                                }}
                                                onClick={() => {
                                                    setDiagnosisModal(true)
                                                }}
                                                className='btn btn-success rounded-pill btn-icon btn-sm'>+</button>
                                        </div>


                                        {/* dorilar */}
                                        <div>
                                            <div className='d-flex align-items-center justify-content-between mb-2'>
                                                <div className="d-flex gap-2">
                                                    <input type="text" className='form-control w-100' placeholder='ДОРИЛАР' />
                                                    <button className='btn btn-primary'
                                                        onClick={() => {
                                                            getMedicine()
                                                        }}

                                                    >Tanlash</button>
                                                </div>
                                                <div className="flex align-items-center gap-2">
                                                    <button className='btn btn-success btn-sm rounded-pill btn-icon '
                                                        onClick={() => {
                                                            setMedicineItem(() => [
                                                                ...medicineItem,
                                                                {
                                                                    id: nanoid(),
                                                                    name: '',
                                                                    type: '',
                                                                    qty: '',
                                                                    day: '',
                                                                    many_day: '',
                                                                    comment: ''
                                                                }
                                                            ])
                                                            // getMedicine()

                                                        }}

                                                    ><FaPlus /></button>
                                                    <button className='btn btn-danger btn-sm rounded-pill btn-icon '
                                                        onClick={() => {

                                                        }}
                                                    >
                                                        <MdDelete />
                                                    </button>
                                                    <button className='btn btn-info btn-sm rounded-pill btn-icon '
                                                        onClick={() => {

                                                        }}
                                                    ><FaPrint /> </button>
                                                </div>
                                            </div>
                                            <table className='table table-bordered '>
                                                <thead>
                                                    <tr className='bg-primary '>
                                                        <th className='text-white'>Nomi</th>
                                                        <th className='text-white'>Turi</th>
                                                        <th className='text-white'>Kuni</th>
                                                        <th className='text-white'>Maxal</th>
                                                        <th className='text-white'>Soni</th>
                                                        <th className='text-white'>Izoh</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        medicineItem?.map((item: any, index: any) => (
                                                            <tr>
                                                                <td>

                                                                    <input type="text" value={item?.name}
                                                                        name='name'
                                                                        className='form-control'
                                                                        onChange={(e: any) => {
                                                                            setMedicineItem((prev: any) => prev.map((item2: any, index2: any) => item2?.id === item?.id ? { ...item2, [e.target.name]: e.target.value } : item2))
                                                                        }}
                                                                    />

                                                                </td>
                                                                <td>
                                                                    <input type="text" value={item?.type}
                                                                        name='type'
                                                                        className='form-control'
                                                                        onChange={(e: any) => {
                                                                            setMedicineItem((prev: any) => prev.map((item2: any, index2: any) => item2?.id === item?.id ? { ...item2, [e.target.name]: e.target.value } : item2))
                                                                        }}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input type="text" value={item?.day}
                                                                        name='day'
                                                                        className='form-control'
                                                                        onChange={(e: any) => {
                                                                            setMedicineItem((prev: any) => prev.map((item2: any, index2: any) => item2?.id === item?.id ? { ...item2, [e.target.name]: e.target.value } : item2))
                                                                        }}
                                                                    />

                                                                    {/* {item?.day} */}
                                                                </td>
                                                                <td>
                                                                    <input type="text" value={item?.many_day}
                                                                        name='many_day'
                                                                        className='form-control'
                                                                        onChange={(e: any) => {
                                                                            setMedicineItem((prev: any) => prev.map((item2: any, index2: any) => item2?.id === item?.id ? { ...item2, [e.target.name]: e.target.value } : item2))
                                                                        }}
                                                                    />
                                                                    {/* {item?.many_day} */}
                                                                </td>
                                                                <td>
                                                                    <input type="text" value={item?.qty}
                                                                        name='qty'
                                                                        className='form-control'
                                                                        onChange={(e: any) => {
                                                                            setMedicineItem((prev: any) => prev.map((item2: any, index2: any) => item2?.id === item?.id ? { ...item2, [e.target.name]: e.target.value } : item2))
                                                                        }}
                                                                    />
                                                                    {/* {item?.qty} */}
                                                                </td>
                                                                <td className='d-flex align-items-center justify-content-between'>
                                                                    <span>
                                                                        <input type="text" value={item?.comment}
                                                                            name='comment'
                                                                            className='form-control'
                                                                            onChange={(e: any) => {
                                                                                setMedicineItem((prev: any) => prev.map((item2: any, index2: any) => item2?.id === item?.id ? { ...item2, [e.target.name]: e.target.value } : item2))
                                                                            }}
                                                                        />

                                                                        {/* {item?.comment} */}
                                                                    </span>

                                                                    <button className='btn btn-danger btn-sm rounded-pill btn-icon '
                                                                        onClick={() => {
                                                                            Swal.fire({
                                                                                title: "Ma'lumotni o'chirasizmi?",
                                                                                showDenyButton: true,
                                                                                showCancelButton: true,
                                                                                confirmButtonText: 'Ha',
                                                                                denyButtonText: `Yo'q`,
                                                                            }).then((result) => {
                                                                                if (result.isConfirmed) {
                                                                                    setMedicineItem(medicineItem?.filter((id: any) => id?.id !== item?.id))
                                                                                }
                                                                            })
                                                                        }}
                                                                    >
                                                                        <MdDelete />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    }

                                                </tbody>
                                            </table>
                                        </div>
                                        {/* retsept */}
                                        <div>
                                            <div className='d-flex align-items-center justify-content-between mb-2'>
                                                <div className="d-flex gap-2">
                                                    <input type="text" className='form-control w-100' placeholder='retsept' />
                                                    <button className='btn btn-primary'
                                                        onClick={() => {
                                                            getMedicine(false)
                                                        }}

                                                    >Tanlash</button>
                                                </div>
                                                <div className="flex align-items-center gap-2">
                                                    <button className='btn btn-success btn-sm rounded-pill btn-icon '
                                                        onClick={() => {
                                                            setMedicineItemRetsept(() => [
                                                                ...medicineItemRetsept,
                                                                {
                                                                    id: nanoid(),
                                                                    name: '',
                                                                    type: '',
                                                                    qty: '',
                                                                    day: '',
                                                                    many_day: '',
                                                                    comment: ''
                                                                }
                                                            ])
                                                            // getMedicine()

                                                        }}

                                                    ><FaPlus /></button>
                                                    <button className='btn btn-danger btn-sm rounded-pill btn-icon '
                                                        onClick={() => {

                                                        }}
                                                    >
                                                        <MdDelete />
                                                    </button>
                                                    <button className='btn btn-info btn-sm rounded-pill btn-icon '
                                                        onClick={() => {

                                                        }}
                                                    ><FaPrint /> </button>
                                                </div>
                                            </div>
                                            <table className='table table-bordered '>
                                                <thead>
                                                    <tr className='bg-primary '>
                                                        <th className='text-white'>Nomi</th>
                                                        <th className='text-white'>Turi</th>
                                                        <th className='text-white'>Kuni</th>
                                                        <th className='text-white'>Maxal</th>
                                                        <th className='text-white'>Soni</th>
                                                        <th className='text-white'>Izoh</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        medicineItemRetsept?.map((item: any, index: any) => (
                                                            <tr>
                                                                <td>

                                                                    <input type="text" value={item?.name}
                                                                        name='name'
                                                                        className='form-control'
                                                                        onChange={(e: any) => {
                                                                            setMedicineItemRetsept((prev: any) => prev.map((item2: any, index2: any) => item2?.id === item?.id ? { ...item2, [e.target.name]: e.target.value } : item2))
                                                                        }}
                                                                    />

                                                                </td>
                                                                <td>
                                                                    <input type="text" value={item?.type}
                                                                        name='type'
                                                                        className='form-control'
                                                                        onChange={(e: any) => {
                                                                            setMedicineItemRetsept((prev: any) => prev.map((item2: any, index2: any) => item2?.id === item?.id ? { ...item2, [e.target.name]: e.target.value } : item2))
                                                                        }}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input type="text" value={item?.day}
                                                                        name='day'
                                                                        className='form-control'
                                                                        onChange={(e: any) => {
                                                                            setMedicineItemRetsept((prev: any) => prev.map((item2: any, index2: any) => item2?.id === item?.id ? { ...item2, [e.target.name]: e.target.value } : item2))
                                                                        }}
                                                                    />

                                                                    {/* {item?.day} */}
                                                                </td>
                                                                <td>
                                                                    <input type="text" value={item?.many_day}
                                                                        name='many_day'
                                                                        className='form-control'
                                                                        onChange={(e: any) => {
                                                                            setMedicineItemRetsept((prev: any) => prev.map((item2: any, index2: any) => item2?.id === item?.id ? { ...item2, [e.target.name]: e.target.value } : item2))
                                                                        }}
                                                                    />
                                                                    {/* {item?.many_day} */}
                                                                </td>
                                                                <td>
                                                                    <input type="text" value={item?.qty}
                                                                        name='qty'
                                                                        className='form-control'
                                                                        onChange={(e: any) => {
                                                                            setMedicineItemRetsept((prev: any) => prev.map((item2: any, index2: any) => item2?.id === item?.id ? { ...item2, [e.target.name]: e.target.value } : item2))
                                                                        }}
                                                                    />
                                                                    {/* {item?.qty} */}
                                                                </td>
                                                                <td className='d-flex align-items-center justify-content-between'>
                                                                    <span>
                                                                        <input type="text" value={item?.comment}
                                                                            name='comment'
                                                                            className='form-control'
                                                                            onChange={(e: any) => {
                                                                                setMedicineItemRetsept((prev: any) => prev.map((item2: any, index2: any) => item2?.id === item?.id ? { ...item2, [e.target.name]: e.target.value } : item2))
                                                                            }}
                                                                        />

                                                                        {/* {item?.comment} */}
                                                                    </span>

                                                                    <button className='btn btn-danger btn-sm rounded-pill btn-icon '
                                                                        onClick={() => {
                                                                            Swal.fire({
                                                                                title: "Ma'lumotni o'chirasizmi?",
                                                                                showDenyButton: true,
                                                                                showCancelButton: true,
                                                                                confirmButtonText: 'Ha',
                                                                                denyButtonText: `Yo'q`,
                                                                            }).then((result) => {
                                                                                if (result.isConfirmed) {
                                                                                    setMedicineItemRetsept(medicineItemRetsept?.filter((id: any) => id?.id !== item?.id))
                                                                                }
                                                                            })
                                                                        }}
                                                                    >
                                                                        <MdDelete />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    }

                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="size_16 doctor-form_reg">

                                            <div className=" overflow-none">
                                                {/* mediadai chiqadi */}
                                                <div className='border border-3 rounded-3 p-2 border-primary d-md-block d-lg-none  cursor-pointer'>
                                                    <div className="d-flex justify-content-between align-items-star">
                                                        <h3 className='fw-bold'>{fullName(data)}</h3>
                                                        <p className='p-0 m-0 text-center rounded-pill bg-primary text-white' style={{
                                                            width: '30px',
                                                            height: '30px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}>{data?.client_item?.length}</p>
                                                    </div>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <h4 className='fw-bold text-info'>{`+998 ${phoneFormatNumber(data?.phone)}`}</h4>
                                                        <p className='fw-bold'>Yoshi: {calculateAge(data?.data_birth, user?.graph_format_date)}</p>
                                                    </div>
                                                </div>
                                                {/* desktopda chiqadi */}



                                                <div className="my-2 d-flex row d-lg-none responsive___davolashrejasi p-1">
                                                    <div className="col-12 mb-2">
                                                        <Select
                                                            name='name3'
                                                            // value={selectData?.department_id}
                                                            onChange={(e: any) => {
                                                                // setSelectData({
                                                                //     ...selectData,
                                                                //     department_id: e
                                                                // })


                                                            }}
                                                            className="basic-multi-select"
                                                            classNamePrefix="select"
                                                            placeholder={"Davolash rejasi "}
                                                            // value={userBranch}
                                                            options={
                                                                [
                                                                    {
                                                                        value: 0,
                                                                        label: 'Barchasi'
                                                                    },

                                                                ]
                                                            } />
                                                    </div>
                                                    <div className="col-12" >
                                                        <Select
                                                            name='name3'
                                                            // value={selectData?.department_id}
                                                            value={{
                                                                value: data?.target ? data?.target?.id : 0,
                                                                label: data?.target ? dateFormat(data?.target?.created_at) : 'Barchasi',
                                                                data: data?.target,
                                                            }}
                                                            onChange={(e: any) => {
                                                                setSelectData({
                                                                    ...selectData,
                                                                    tashrif: e
                                                                })
                                                                if (e?.data) {
                                                                    allShow(e?.data?.person_id, e?.data?.id)
                                                                } else {

                                                                    dispatch(isDoctorTargetData({
                                                                        ...data,
                                                                        target: e?.data
                                                                    }))
                                                                }

                                                                console.log(e?.data?.template_result);
                                                                // setTargetTemplate(() => 0)
                                                                // let saveid = targetTemplate
                                                                // setTimeout(() => {
                                                                //     setTargetTemplate(() => targetTemplate)
                                                                // }, 50);
                                                                setTemplateResult(() => [])
                                                                setTemplateResult(() => e?.data?.template_result ?? [])
                                                            }}
                                                            className="basic-multi-select"
                                                            classNamePrefix="select"
                                                            placeholder={"Tashriflar sanasi"}
                                                            // value={userBranch}
                                                            options={
                                                                [
                                                                    {
                                                                        value: 0,
                                                                        label: 'Barchasi'
                                                                    },
                                                                    ...data?.client_item?.map((item: any) => {
                                                                        return {
                                                                            value: item?.id,
                                                                            label: dateFormat(item?.created_at),
                                                                            data: item
                                                                        }
                                                                    })

                                                                ]
                                                            } />
                                                    </div>
                                                </div>
                                                <div

                                                    // ref={scrollRef}
                                                    // onMouseDown={handleMouseDown}
                                                    // onMouseLeave={handleMouseLeave}
                                                    // onMouseUp={handleMouseUp}
                                                    // onMouseMove={handleMouseMove}
                                                    // onTouchStart={handleTouchStart}
                                                    // onTouchEnd={handleTouchEnd}
                                                    // onTouchMove={handleTouchMove}
                                                    className="my-2 d-flex d-lg-none w-100 p-1 overflow-auto ">

                                                    {/* <Slider {...settings}> */}
                                                    {
                                                        [
                                                            ...user?.department?.department_template_item
                                                        ]?.map((res: any) => (
                                                            <button type="button" className={`btn ${targetTemplate === res?.id ? 'btn-primary' : 'border-primary'}`} id='corusel__btn'
                                                                onClick={() => {
                                                                    setTargetTemplate(res?.id)
                                                                }}
                                                            >{
                                                                    res?.template?.name
                                                                }</button>
                                                        ))
                                                    }
                                                    {/* </Slider> */}
                                                    {/* <div className="btn-group w-100" role="group" aria-label="Basic example">
                                     
                                    </div> */}
                                                </div>

                                                <hr className='bg-primary my-1 d-none d-lg-block' style={{ height: '2px' }} />
                                                {
                                                    +user?.is_certificates && +user?.department?.is_certificate ? <form onSubmit={(e: any) => {
                                                        e.preventDefault();
                                                        certificateSend(certificate)
                                                    }}>
                                                        <p>Sertifkat</p>
                                                        <div className="row my-2">
                                                            <div className="col-4">
                                                                <label htmlFor="">Seriya 1</label>
                                                                <input type="text" className='form-control'
                                                                    name='serial_number_1'
                                                                    required={certificate?.date_1 ? true : false}
                                                                    value={certificate?.serial_number_1 ?? ''}
                                                                    onChange={(e: any) => {
                                                                        setCertificate({ ...certificate, serial_number_1: e.target.value })
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="col-4">
                                                                <label htmlFor="">sana</label>
                                                                <input type="date" className='form-control'
                                                                    value={certificate?.date_1 ?? ''}
                                                                    required={certificate?.serial_number_1 ? true : false}
                                                                    onChange={(e: any) => {
                                                                        setCertificate({ ...certificate, date_1: e.target.value })
                                                                    }}

                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="row my-2">
                                                            <div className="col-4">
                                                                <label htmlFor="">Seriya 2</label>
                                                                <input type="text" className='form-control'

                                                                    value={certificate?.serial_number_2 == null ? '' : certificate?.serial_number_2 ?? ''}
                                                                    required={certificate?.date_2 ? true : false}
                                                                    onChange={(e: any) => {
                                                                        setCertificate({ ...certificate, serial_number_2: e.target.value })
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="col-4">
                                                                <label htmlFor="">sana</label>
                                                                <input type="date" className='form-control'
                                                                    value={certificate?.date_2 ?? ''}
                                                                    required={certificate?.serial_number_2 ? true : false}
                                                                    onChange={(e: any) => {
                                                                        setCertificate({ ...certificate, date_2: e.target.value })
                                                                    }}

                                                                />
                                                            </div>
                                                        </div>
                                                        <button className='btn btn-primary'>Saqalash</button>
                                                        <button className='btn btn-primary' type='button' onClick={() => {
                                                            updateIframeContentChek({
                                                                ...data,
                                                                ...certificate,
                                                                clinic_name: user?.owner?.name
                                                            })
                                                            handlePrintChek()
                                                        }}>Print</button>
                                                    </form> : ''
                                                }
                                                {

                                                    departmentTarget?.value == 0 && crkRole ?
                                                        <div className="crkkk">

                                                            {
                                                                load ? <p>Loading editor...</p> :
                                                                    ckeditorData?.map((res: any, index: any) => (
                                                                        <div className='crk-container my-2 '>
                                                                            <div className="row">
                                                                                <div className="col-12 ">
                                                                                    <div className="row my-1">
                                                                                        <div className='col-4'>
                                                                                            <input type="text" className='form-control' placeholder='Title'
                                                                                                value={res.value}
                                                                                                onChange={(e: any) => {
                                                                                                    setCkeditorData(() => ckeditorData?.map((item: any, i: any) => item.id == res.id ? { ...item, value: e.target.value } : item));
                                                                                                }}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="d-flex col-4 gap-1">
                                                                                            <div className='w-100'>
                                                                                                <Select
                                                                                                    name='name3'
                                                                                                    value={res?.doctor_template_id}
                                                                                                    onChange={(e: any) => {
                                                                                                        setCkeditorLoad(() => {
                                                                                                            return {
                                                                                                                load: true,
                                                                                                                index: index
                                                                                                            }
                                                                                                        })
                                                                                                        setCkeditorData(() => ckeditorData?.map((item: any, i: any) => item.id == res.id ? { ...item, doctor_template_id: e, data: e.data?.data, value: e.data.name } : item));
                                                                                                        console.log(e.data?.data);
                                                                                                        setTimeout(() => {
                                                                                                            setCkeditorLoad(() => {
                                                                                                                return {
                                                                                                                    load: false,
                                                                                                                    index: 0
                                                                                                                }
                                                                                                            })
                                                                                                        }, 0)

                                                                                                    }}
                                                                                                    className="basic-multi-select"
                                                                                                    classNamePrefix="select"
                                                                                                    placeholder={" SHABLON TANLANG "}
                                                                                                    // value={userBranch}
                                                                                                    options={
                                                                                                        [
                                                                                                            ...dataSelect(doctorTemplateData)

                                                                                                        ]
                                                                                                    } />
                                                                                            </div>


                                                                                        </div>
                                                                                        <div className="col-4 d-flex justify-content-end gap-2">
                                                                                            <div>
                                                                                                <button className='btn btn-success btn-sm rounded-pill btn-icon '
                                                                                                    onClick={() => {
                                                                                                        setCkeditorData(() => [
                                                                                                            ...ckeditorData,
                                                                                                            {
                                                                                                                doctor_template_id: false,
                                                                                                                data: '',
                                                                                                                id: nanoid()
                                                                                                            }
                                                                                                        ]);
                                                                                                    }}

                                                                                                ><FaPlus /></button>
                                                                                            </div>
                                                                                            <div>
                                                                                                <button className='btn btn-danger btn-sm rounded-pill btn-icon '
                                                                                                    onClick={() => {
                                                                                                        setCkeditorLoad(() => {
                                                                                                            return {
                                                                                                                load: true,
                                                                                                                index: index - 1
                                                                                                            }
                                                                                                        })
                                                                                                        let del = ckeditorData?.filter((item: any, i: any) => item.id != res.id);
                                                                                                        setCkeditorData(() => del);
                                                                                                        if (del?.length == 0) {
                                                                                                            setCkeditorData(() => [
                                                                                                                {
                                                                                                                    id: nanoid(),
                                                                                                                    doctor_template_id: false,
                                                                                                                    data: '',
                                                                                                                    value: '',
                                                                                                                }
                                                                                                            ]);
                                                                                                        }
                                                                                                        setTimeout(() => {
                                                                                                            setCkeditorLoad(() => {
                                                                                                                return {
                                                                                                                    load: false,
                                                                                                                    index: 0
                                                                                                                }
                                                                                                            })
                                                                                                        }, 0)

                                                                                                    }}
                                                                                                >
                                                                                                    <MdDelete />
                                                                                                </button>
                                                                                            </div>
                                                                                            <div>
                                                                                                <button className='btn btn-info btn-sm rounded-pill btn-icon '
                                                                                                    onClick={() => {
                                                                                                        // generateDoctorTemplate({
                                                                                                        //     target: res.data
                                                                                                        // })
                                                                                                        let table = `
                                                                               <table>
        <tr>
            <td>Mijozning F.I.SH</td>
            <td>${fullName(data?.target)}</td>
            <td
            rowspan="2"
            colspan="2"
            >TEKSHIRUV
                <br>
                NATIJALARI
            </td>
        </tr>
        <tr>
            <td>
                Tug'ilgan yili
            </td>
            <td>
                ${data?.target?.data_birth}
            </td>
        </tr>
        <tr>
            <td>
                Kelgan sanasi
            </td>
            <td>
                ${getCurrentDateTime(data?.target?.created_at)}
            </td>
            <td>Namuna</td>
            <td>0</td>
        </tr>
        <tr>
            <td>
                Manzil
            </td>
            <td>-</td>
            <td>ID</td>
            <td>${formatId(data?.target?.person_id)}</td>
        </tr>
    </table>
                                                                                
                                                                                `
                                                                                                        updateIframeContent(`
                                                                                ${table}
                                                                                <h4 style="text-align: center;">${res.value}</h4>
                                                                                ${res.data}`)
                                                                                                        // setHtmlCode(() => res.data)
                                                                                                        // if (iframeRef.current) {
                                                                                                        //     const iframeWindow = iframeRef.current.contentWindow;
                                                                                                        //     iframeWindow.print(); // Iframe ichidagi matnni chop qilish
                                                                                                        // }
                                                                                                        handlePrint()
                                                                                                    }}
                                                                                                ><FaPrint /> </button>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    {
                                                                                        ckeditorLoad?.load && ckeditorLoad?.index == index ? 'Loading editor...' :
                                                                                            <CKEditor

                                                                                                className='form-control'
                                                                                                // debug={true}
                                                                                                editorUrl="https://cdn.ckeditor.com/4.22.1/full-all/ckeditor.js"
                                                                                                onLoaded={(event: any) => {
                                                                                                    setIsEditorLoaded(true);
                                                                                                    event.editor.setData(res.data);
                                                                                                }}
                                                                                                onConfigLoaded={(event: any) => {
                                                                                                    setIsEditorLoaded(true);
                                                                                                    event.editor.setData(res.data);
                                                                                                }}
                                                                                                onLoadSnapshot={(event: any) => {
                                                                                                    setIsEditorLoaded(true);
                                                                                                    event.editor.setData(res.data);
                                                                                                }}
                                                                                                onInstanceReady={(event: any) => {
                                                                                                    setIsEditorLoaded(true); // CKEditor tayyor bo‘lsa yuklanish holatini o‘zgartirish
                                                                                                    event.editor.setData(res.data); // CKEditor qiymatini dasturiy to‘ldirish
                                                                                                }}

                                                                                                initData={res?.data ?? '<></>'}
                                                                                                onChange={(e: any) => {
                                                                                                    console.log(e.editor.getData());
                                                                                                    console.log(index);
                                                                                                    const value = e.editor.getData(); // CKEditor ma'lumotlarini olish
                                                                                                    setCkeditorData(() => ckeditorData?.map((item: any, i: any) => item.id == res.id ? { ...item, data: value } : item));
                                                                                                    //     },

                                                                                                }}
                                                                                                config={
                                                                                                    {
                                                                                                        height: 'auto', /* O'lchamni avtomatik ravishda sozlash */
                                                                                                        resize_enabled: false, /* O'lchamni foydalanuvchi tomonidan o'zgartirishni cheklash */
                                                                                                        autoGrow_onStartup: true, /* Dastlabki holatda o'lchamni avtomatik ravishda sozlash */
                                                                                                        autoGrow_minHeight: 100, /* Minimal balandlik */
                                                                                                        autoGrow_maxHeight: 500, /* Maksimal balandlik */
                                                                                                        autoGrow_bottomSpace: 50, /* Tugatish bo'shlig'i */
                                                                                                        overflow: 'hidden', /* Skrollni olib tashlash */
                                                                                                        allowedContent: true,
                                                                                                        uploadUrl: APi_url,

                                                                                                        filebrowserUploadUrl: APi_url,
                                                                                                        filebrowserImageUploadUrl: APi_url,
                                                                                                        // on: {
                                                                                                        //     change: (event: any) => {
                                                                                                        //         const data = event.editor.getData(); // CKEditor ma'lumotlarini olish
                                                                                                        //         setCkeditorData(() => ckeditorData?.map((item: any, i: any) => i == index ? { ...item, data:data } : item));
                                                                                                        //     },
                                                                                                        // }
                                                                                                    }

                                                                                                }

                                                                                                name="my-ckeditor"

                                                                                                style={{
                                                                                                    borderColor: 'blue',
                                                                                                    height: '100%',

                                                                                                }
                                                                                                }
                                                                                            // type="inline"
                                                                                            />
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))

                                                            }
                                                            {/* <CKEditor
                                                // debug={true}
                                                editor={ClassicEditor}
                                                //  editorUrl="https://cdn.ckeditor.com/4.18.0/full-all/ckeditor.js"
                                                config={
                                                    {



                                                        ckfinder: {

                                                            options: {
                                                                chooseFiles: true,

                                                            },

                                                            openerMethod: 'modal',
                                                            uploadUrl: APi_url,


                                                        },


                                                        // allowedContent: true,
                                                        // filebrowserUploadUrl: APi_url,
                                                        // filebrowserImageUploadUrl: APi_url,
                                                    }}

                                                data={`${res.data}`}

                                                onChange={(e: any, editor: any) => {
                                                    let findckreditor = templateResult?.find((resItem: any) => resItem?.status == 'ckreditor')
                                                    const data = editor.getData(); // CKEditor ma'lumotlarini olish
                                                    console.log('Editor data:', data); // Matnni konsolda ko'rsatish
                                                    if (findckreditor) {
                                                        setTemplateResult(() =>
                                                            templateResult?.map((resItem: any) => resItem?.status == 'ckreditor' ? { ...resItem, description: data } : resItem))
                                                    } else {
                                                        setTemplateResult(() => {
                                                            return [
                                                                ...templateResult,
                                                                {
                                                                    // template_id: parentItem?.template_id,
                                                                    // template_item_id: res?.id,
                                                                    description: data,
                                                                    status: 'ckreditor'
                                                                }
                                                            ]
                                                        })
                                                    }

                                                }}


                                            /> */}
                                                            <br />
                                                            <br />
                                                            <div className="d-flex justify-content-center align-items-center gap-2">

                                                                <button
                                                                    disabled={departmentTarget?.value > 0 ? true : false}
                                                                    className='btn btn-primary '

                                                                    onClick={() => {
                                                                        doctorResult(templateResult, data?.target?.client_result?.at(-1)?.is_check_doctor)
                                                                    }}

                                                                >Saqlash</button>
                                                                <button className='btn btn-danger'
                                                                    onClick={() => {
                                                                        // generateDoctorTemplate({
                                                                        //     target: res.data
                                                                        // })
                                                                        let table = `
                                                                               <table>
        <tr>
            <td>Mijozning F.I.SH</td>
            <td>${fullName(data?.target)}</td>
            <td
            rowspan="2"
            colspan="2"
            >TEKSHIRUV
                <br>
                NATIJALARI
            </td>
        </tr>
        <tr>
            <td>
                Tug'ilgan yili
            </td>
            <td>
                ${data?.target?.data_birth}
            </td>
        </tr>
        <tr>
            <td>
                Kelgan sanasi
            </td>
            <td>
                ${getCurrentDateTime(data?.target?.created_at)}
            </td>
            <td>Namuna</td>
            <td>0</td>
        </tr>
        <tr>
            <td>
                Manzil
            </td>
            <td>-</td>
            <td>ID</td>
            <td>${formatId(data?.target?.person_id)}</td>
        </tr>
    </table>
                                                                                
                                                                                `

                                                                        let dataText = '';
                                                                        ckeditorData?.map((item: any) => {
                                                                            dataText += `
                                                                                      <h1 style="text-align: center;">${item.value}</h1>
                                                                                    ${item?.data}
                                                                                    `
                                                                        })
                                                                        updateIframeContent(`
                                                                                ${table}
                                                                                ${dataText}`)
                                                                        // setHtmlCode(() => res.data)
                                                                        // if (iframeRef.current) {
                                                                        //     const iframeWindow = iframeRef.current.contentWindow;
                                                                        //     iframeWindow.print(); // Iframe ichidagi matnni chop qilish
                                                                        // }
                                                                        handlePrint()
                                                                    }}
                                                                >print</button>
                                                            </div>

                                                            {
                                                                data?.target ? ((data?.target?.client_result?.at(-1)?.doctor_id > 0 &&

                                                                    data?.target?.client_result?.at(-1)?.doctor_id != user?.id)
                                                                    ? '' :
                                                                    <div className="d-flex gap-2  justify-content-center my-2">
                                                                        {
                                                                            data?.target?.client_result?.at(-1)?.is_check_doctor == 'finish' ? <>

                                                                            </> : <>
                                                                                <button className='btn btn-success rounded-pill btn-icon btn-xl'
                                                                                    type='button'
                                                                                    onClick={() => {
                                                                                        if (+data?.target?.client_result?.at(-1)?.room_id > 0) {
                                                                                            if (data?.target?.client_result?.at(-1)?.is_check_doctor != 'finish' || data?.target?.client_result?.at(-1)?.is_check_doctor == 'pause' || data?.target?.client_result?.at(-1)?.is_check_doctor == 'start') {
                                                                                                doctorResult(templateResult, 'start')
                                                                                            }
                                                                                        } else {
                                                                                            doctorRoom()
                                                                                        }
                                                                                    }}
                                                                                ><FaPlayCircle size={24} /> </button>
                                                                                <button className='btn btn-warning rounded-pill btn-icon btn-xl '
                                                                                    type='button'
                                                                                    onClick={() => {
                                                                                        if (data?.target?.client_result?.at(-1)?.is_check_doctor == 'start') {
                                                                                            doctorResult(templateResult, 'pause')
                                                                                        }
                                                                                    }}
                                                                                ><FaPauseCircle size={24} /></button>

                                                                            </>
                                                                        }

                                                                        <button className='btn btn-info rounded-pill btn-icon btn-xl' type='button'
                                                                            onClick={() => {
                                                                                Swal.fire({
                                                                                    title: "Ma'lumotni tasdqilaysizmi?",
                                                                                    showDenyButton: true,
                                                                                    showCancelButton: false,
                                                                                    confirmButtonText: 'Ha',
                                                                                    denyButtonText: `Yo'q`,
                                                                                }).then((result) => {
                                                                                    if (result.isConfirmed) {
                                                                                        doctorResult(templateResult, 'finish')
                                                                                    }
                                                                                })
                                                                            }}
                                                                            disabled={data?.target ? ((data?.target?.client_result?.at(-1)?.doctor_id > 0 && data?.target?.client_result?.at(-1)?.doctor_id != user?.id) ? true : false) : true}
                                                                        ><FaCheckCircle size={24} /></button>
                                                                        <button className='btn btn-secondary rounded-pill btn-icon  btn-xl'

                                                                            type='button'
                                                                            onClick={() => {
                                                                                let table = docregprintheader(data?.target)
                                                                                let parentItem = user?.department?.department_template_item?.find((res: any) => res?.id == targetTemplate)
                                                                                console.log('parentItem', parentItem);

                                                                                let checkboxData = newGroupTemplateItemsByCategory(parentItem?.template)
                                                                                if (parentItem?.template?.type == 'select') {
                                                                                    let body = docregprintselect(checkboxData, templateResult, parentItem, {
                                                                                        date: dateFormat(data?.target?.created_at, '/', false),
                                                                                        full_name: masulRegUchunFullName(data?.target?.client_result?.at(-1)?.doctor),
                                                                                    })
                                                                                    console.log('body', body);
                                                                                    updateIframeContentLab(`
                                                                            ${table}
                                                                            ${body}
                                                                         `)

                                                                                } else {
                                                                                    let body = docregprintcheckbox(checkboxData, templateResult, parentItem, {
                                                                                        date: dateFormat(data?.target?.created_at, '/', false),
                                                                                        full_name: masulRegUchunFullName(data?.target?.client_result?.at(-1)?.doctor),
                                                                                    })
                                                                                    console.log('body', body);
                                                                                    updateIframeContentLab(`
                                                                            ${table}
                                                                            ${body}
                                                                         `)

                                                                                }

                                                                                handlePrintLab()
                                                                            }}
                                                                        ><FaPrint size={24} />  </button>
                                                                        <button className='btn btn-danger rounded-pill btn-icon  btn-xl'

                                                                            type='button'
                                                                            onClick={() => {
                                                                                alertSoket()
                                                                            }}
                                                                        ><MdNotifications size={24} />  </button>

                                                                    </div>) : ''
                                                            }
                                                        </div> : ''
                                                }

                                                {
                                                    !crkRole && +data?.client_item?.at(0)?.client_result.at(-1)?.doctor?.is_editor ? (data?.client_item
                                                        ?.filter((res: any) => dateTargetId > 0 ? res?.id == dateTargetId : true)

                                                        ?.map((item: any, dayIndex: any) => {
                                                            const template_result = item.template_result?.filter((m: any) => m.status == 'ckreditor')
                                                            console.log('template_result');

                                                            return <div className="crkkk border border-5 border-primary rounded p-2">
                                                                <p className='p-0 mb-0'>
                                                                    {+dateTargetId == 0 ? `${dayIndex + 1} - kun` : dateFormat(item?.created_at, '/', false)}
                                                                </p>
                                                                {
                                                                    load ? <p>Loading editor...</p> :
                                                                        template_result?.map((res: any, index: any) => (
                                                                            <div className='crk-container my-2 '>
                                                                                <div className="row">
                                                                                    <div className="col-12">
                                                                                        <div className="row my-1">
                                                                                            <div className='col-4'>
                                                                                                <input type="text" className='form-control' placeholder='Title'
                                                                                                    value={res.value}
                                                                                                    disabled
                                                                                                    onChange={(e: any) => {
                                                                                                        setCkeditorData(() => ckeditorData?.map((item: any, i: any) => item.id == res.id ? { ...item, value: e.target.value } : item));
                                                                                                    }}
                                                                                                />
                                                                                            </div>
                                                                                            <div className="d-flex col-4 gap-1">
                                                                                                <div className='w-100'>
                                                                                                    <Select
                                                                                                        isDisabled
                                                                                                        name='name3'
                                                                                                        value={res?.doctor_template_id}
                                                                                                        onChange={(e: any) => {
                                                                                                            setCkeditorLoad(() => {
                                                                                                                return {
                                                                                                                    load: true,
                                                                                                                    index: index
                                                                                                                }
                                                                                                            })
                                                                                                            setCkeditorData(() => ckeditorData?.map((item: any, i: any) => item.id == res.id ? { ...item, doctor_template_id: e, data: e.data?.data, value: e.data.name } : item));
                                                                                                            console.log(e.data?.data);
                                                                                                            setTimeout(() => {
                                                                                                                setCkeditorLoad(() => {
                                                                                                                    return {
                                                                                                                        load: false,
                                                                                                                        index: 0
                                                                                                                    }
                                                                                                                })
                                                                                                            }, 0)

                                                                                                        }}
                                                                                                        className="basic-multi-select"
                                                                                                        classNamePrefix="select"
                                                                                                        placeholder={" SHABLON TANLANG "}
                                                                                                        // value={userBranch}
                                                                                                        options={
                                                                                                            [
                                                                                                                ...dataSelect(doctorTemplateData)

                                                                                                            ]
                                                                                                        } />
                                                                                                </div>



                                                                                            </div>
                                                                                            <div className="col-4 d-flex justify-content-end">
                                                                                                <button className='btn btn-info  btn-sm'
                                                                                                    onClick={() => {
                                                                                                        // generateDoctorTemplate({
                                                                                                        //     target: res.data
                                                                                                        // })
                                                                                                        let table = `
                                                                               <table>
        <tr>
            <td>Mijozning F.I.SH</td>
            <td>${fullName(item)}</td>
            <td
            rowspan="2"
            colspan="2"
            >TEKSHIRUV
                <br>
                NATIJALARI
            </td>
        </tr>
        <tr>
            <td>
                Tug'ilgan yili
            </td>
            <td>
                ${item?.data_birth}
            </td>
        </tr>
        <tr>
            <td>
                Kelgan sanasi
            </td>
            <td>
                ${getCurrentDateTime(item?.created_at)}
            </td>
            <td>Namuna</td>
            <td>0</td>
        </tr>
        <tr>
            <td>
                Manzil
            </td>
            <td>-</td>
            <td>ID</td>
            <td>${formatId(item?.person_id)}</td>
        </tr>
    </table>
                                                                                
                                                                                `
                                                                                                        updateIframeContent(`
                                                                                ${table}
                                                                                <h4 style="text-align: center;">${res.value}</h4>
                                                                                ${res.description}`)
                                                                                                        // setHtmlCode(() => res.data)
                                                                                                        // if (iframeRef.current) {
                                                                                                        //     const iframeWindow = iframeRef.current.contentWindow;
                                                                                                        //     iframeWindow.print(); // Iframe ichidagi matnni chop qilish
                                                                                                        // }
                                                                                                        handlePrint()
                                                                                                    }}
                                                                                                ><FaPrint size={16} /> </button>
                                                                                            </div>
                                                                                        </div>

                                                                                        {
                                                                                            ckeditorLoad?.load && ckeditorLoad?.index == index ? 'Loading editor...' :
                                                                                                <CKEditor

                                                                                                    className='form-control'
                                                                                                    // debug={true}
                                                                                                    editorUrl="https://cdn.ckeditor.com/4.22.1/full-all/ckeditor.js"
                                                                                                    readOnly={true}
                                                                                                    onLoaded={(event: any) => {
                                                                                                        setIsEditorLoaded(true);
                                                                                                        event.editor.setData(res.description);
                                                                                                    }}
                                                                                                    onConfigLoaded={(event: any) => {
                                                                                                        setIsEditorLoaded(true);
                                                                                                        event.editor.setData(res.description);
                                                                                                    }}
                                                                                                    onLoadSnapshot={(event: any) => {
                                                                                                        setIsEditorLoaded(true);
                                                                                                        event.editor.setData(res.description);
                                                                                                    }}
                                                                                                    onInstanceReady={(event: any) => {
                                                                                                        setIsEditorLoaded(true); // CKEditor tayyor bo‘lsa yuklanish holatini o‘zgartirish
                                                                                                        event.editor.setData(res.description); // CKEditor qiymatini dasturiy to‘ldirish
                                                                                                    }}

                                                                                                    initData={res.description ?? '<></>'}
                                                                                                    onChange={(e: any) => {
                                                                                                        console.log(e.editor.getData());
                                                                                                        console.log(index);
                                                                                                        const value = e.editor.getData(); // CKEditor ma'lumotlarini olish
                                                                                                        setCkeditorData(() => ckeditorData?.map((item: any, i: any) => item.id == res.id ? { ...item, data: value } : item));
                                                                                                        //     },

                                                                                                    }}

                                                                                                    config={
                                                                                                        {

                                                                                                            height: 'auto', /* O'lchamni avtomatik ravishda sozlash */
                                                                                                            resize_enabled: false, /* O'lchamni foydalanuvchi tomonidan o'zgartirishni cheklash */
                                                                                                            autoGrow_onStartup: true, /* Dastlabki holatda o'lchamni avtomatik ravishda sozlash */
                                                                                                            autoGrow_minHeight: 100, /* Minimal balandlik */
                                                                                                            autoGrow_maxHeight: 500, /* Maksimal balandlik */
                                                                                                            autoGrow_bottomSpace: 50, /* Tugatish bo'shlig'i */
                                                                                                            overflow: 'hidden', /* Skrollni olib tashlash */
                                                                                                            allowedContent: true,
                                                                                                            uploadUrl: APi_url,

                                                                                                            filebrowserUploadUrl: APi_url,
                                                                                                            filebrowserImageUploadUrl: APi_url,
                                                                                                            // on: {
                                                                                                            //     change: (event: any) => {
                                                                                                            //         const data = event.editor.getData(); // CKEditor ma'lumotlarini olish
                                                                                                            //         setCkeditorData(() => ckeditorData?.map((item: any, i: any) => i == index ? { ...item, data:data } : item));
                                                                                                            //     },
                                                                                                            // }
                                                                                                        }

                                                                                                    }

                                                                                                    name="my-ckeditor"

                                                                                                    style={{
                                                                                                        borderColor: 'blue',
                                                                                                        height: '100%',

                                                                                                    }
                                                                                                    }
                                                                                                // type="inline"
                                                                                                />
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ))

                                                                }

                                                                <br />
                                                                <br />
                                                                <div className="d-flex justify-content-center align-items-center gap-2">
                                                                    <button className='btn btn-danger'
                                                                        onClick={() => {
                                                                            // generateDoctorTemplate({
                                                                            //     target: res.data
                                                                            // })
                                                                            let table = `
                                                                               <table>
        <tr>
            <td>Mijozning F.I.SH</td>
            <td>${fullName(item)}</td>
            <td
            rowspan="2"
            colspan="2"
            >TEKSHIRUV
                <br>
                NATIJALARI
            </td>
        </tr>
        <tr>
            <td>
                Tug'ilgan yili
            </td>
            <td>
                ${item?.data_birth}
            </td>
        </tr>
        <tr>
            <td>
                Kelgan sanasi
            </td>
            <td>
                ${getCurrentDateTime(item?.created_at)}
            </td>
            <td>Namuna</td>
            <td>0</td>
        </tr>
        <tr>
            <td>
                Manzil
            </td>
            <td>-</td>
            <td>ID</td>
            <td>${formatId(item?.person_id)}</td>
        </tr>
    </table>
                                                                                
                                                                                `

                                                                            let dataText = '';
                                                                            template_result?.map((item: any) => {
                                                                                dataText += `
                                                                                      <h1 style="text-align: center;">${item.value}</h1>
                                                                                    ${item?.description}
                                                                                    `
                                                                            })
                                                                            updateIframeContent(`
                                                                                ${table}
                                                                                ${dataText}`)
                                                                            // setHtmlCode(() => res.data)
                                                                            // if (iframeRef.current) {
                                                                            //     const iframeWindow = iframeRef.current.contentWindow;
                                                                            //     iframeWindow.print(); // Iframe ichidagi matnni chop qilish
                                                                            // }
                                                                            handlePrint()
                                                                        }}
                                                                    >print</button>
                                                                </div>


                                                            </div>
                                                        })) : ''

                                                }

                                            </div>
                                        </div>
                                        {
                                            departmentTarget?.value > 0 || !crkRole ?
                                                <form onSubmit={(e: any) => {
                                                    e.preventDefault()

                                                }}>
                                                    <div className=''>
                                                        {
                                                            (
                                                                departmentTarget.value > 0 ? departmentData?.find((item: any) => item?.id == +departmentTarget?.value)?.department_template_item :
                                                                    user?.department?.department_template_item?.filter((res: any) => +departmentTarget?.value > 0 ? true : res?.id == targetTemplate)
                                                            )
                                                                ?.map((parentItem: any, dayIndex: any) => {
                                                                    console.log('data?.client_item', data);

                                                                    let checkboxData = newGroupTemplateItemsByCategory(parentItem?.template)

                                                                    console.log('checkboxData', checkboxData);
                                                                    console.log('parentItem', parentItem);

                                                                    return (
                                                                        <>
                                                                            <h1 className='text-center'>{parentItem?.template?.name}</h1>
                                                                            {
                                                                                parentItem?.template?.type == 'checkbox' ? <div className='row'>

                                                                                    {
                                                                                        data?.target ?
                                                                                            <div className='border border-primary col-12 col-lg-10 offset-0 offset-lg-1  border-2 rounded p-4 '>
                                                                                                {
                                                                                                    checkboxData?.map((item: any) => {
                                                                                                        let commentData = item
                                                                                                            ?.items?.filter((res: any) => +res?.is_comment)
                                                                                                        let notCommentData = item
                                                                                                            ?.items?.filter((res: any) => !new Set(commentData?.map((item: any) => item?.id))?.has(res?.id))
                                                                                                        let leftData = [...notCommentData]?.slice(0, notCommentData?.length / 2 + (notCommentData?.length % 2 == 0 ? 0 : 1))
                                                                                                        let rightData = [...notCommentData]?.slice(notCommentData?.length / 2 + (notCommentData?.length % 2 == 0 ? 0 : 1))

                                                                                                        return (
                                                                                                            <div className='my-2 ' >
                                                                                                                <h3 className='text-center my-2'>{item?.category_name}
                                                                                                                </h3>
                                                                                                                <div className='row gap-0 gap-md-2 gap-lg-0  d-md-flex'
                                                                                                                    style={{
                                                                                                                        // gap: '20rem'
                                                                                                                    }}
                                                                                                                >
                                                                                                                    <div className="col-12  responsive_checkbox"
                                                                                                                        style={{
                                                                                                                            paddingLeft: '10%'
                                                                                                                        }}>
                                                                                                                        {commentData
                                                                                                                            // ?.slice(0, item?.items?.length / 2 + (item?.items?.length % 2 == 0 ? 0 : 1))
                                                                                                                            ?.map((res: any) => {
                                                                                                                                let findcheckbox = templateResult?.find((resItem: any) => resItem?.template_item_id == res?.id && resItem?.template_id == parentItem?.template_id && resItem?.status == 'checkbox')
                                                                                                                                let findcomment = templateResult?.find((resItem: any) => resItem?.template_item_id == res?.id && resItem?.template_id == parentItem?.template_id && resItem?.status == 'is_comment')
                                                                                                                                return (
                                                                                                                                    <div className={` d-block d-lg-flex input-group ${+res?.is_comment ? 'my-1' : 0}`}>
                                                                                                                                        <div className={`${+res?.is_comment ? 'input-group-text d-block d-lg-flex form-check_width' : ''} `}>

                                                                                                                                            {


                                                                                                                                                <div className="form-check">
                                                                                                                                                    <label htmlFor={`defaultCheck${res.id}`} className='checkbox_label'>{res?.value_1} </label>
                                                                                                                                                    <input className="form-check-input" type="checkbox" id={`defaultCheck${res.id}`}
                                                                                                                                                        checked={+findcheckbox?.value ? true : false}
                                                                                                                                                        onChange={(e: any) => {
                                                                                                                                                            let check = e.target.checked
                                                                                                                                                            // template_item_id: res?.id,
                                                                                                                                                            // template_id: parentItem?.template_id,
                                                                                                                                                            let find = findcheckbox
                                                                                                                                                            if (find) {
                                                                                                                                                                setTemplateResult(() =>
                                                                                                                                                                    templateResult?.map((resItem: any) => resItem?.template_item_id == res?.id && resItem?.template_id == parentItem?.template_id && resItem?.status == 'checkbox' ? { ...resItem, value: check } : resItem))
                                                                                                                                                            } else {
                                                                                                                                                                setTemplateResult(() => {
                                                                                                                                                                    return [
                                                                                                                                                                        ...templateResult,
                                                                                                                                                                        {
                                                                                                                                                                            template_id: parentItem?.template_id,
                                                                                                                                                                            template_item_id: res?.id,
                                                                                                                                                                            value: check,
                                                                                                                                                                            status: 'checkbox'
                                                                                                                                                                        }
                                                                                                                                                                    ]
                                                                                                                                                                })
                                                                                                                                                            }

                                                                                                                                                        }}

                                                                                                                                                    />
                                                                                                                                                </div>

                                                                                                                                            }
                                                                                                                                        </div>
                                                                                                                                        {
                                                                                                                                            +res?.is_comment ?
                                                                                                                                                <input type="text" className='d-block d-lg-inline-block form-control responsive_comment_input'
                                                                                                                                                    placeholder='izoh..'
                                                                                                                                                    value={findcomment?.value}
                                                                                                                                                    onChange={(e: any) => {
                                                                                                                                                        let check = e.target.value
                                                                                                                                                        // template_item_id: res?.id,
                                                                                                                                                        // template_id: parentItem?.template_id,
                                                                                                                                                        let find = findcomment
                                                                                                                                                        if (find) {
                                                                                                                                                            setTemplateResult(() =>
                                                                                                                                                                templateResult?.map((resItem: any) => resItem?.template_item_id == res?.id && resItem?.template_id == parentItem?.template_id && resItem?.status == 'is_comment' ? { ...resItem, value: check } : resItem))
                                                                                                                                                        } else {
                                                                                                                                                            setTemplateResult(() => {
                                                                                                                                                                return [
                                                                                                                                                                    ...templateResult,
                                                                                                                                                                    {
                                                                                                                                                                        template_id: parentItem?.template_id,
                                                                                                                                                                        template_item_id: res?.id,
                                                                                                                                                                        value: check,
                                                                                                                                                                        status: 'is_comment'
                                                                                                                                                                    }
                                                                                                                                                                ]
                                                                                                                                                            })
                                                                                                                                                        }

                                                                                                                                                    }}

                                                                                                                                                /> : ''
                                                                                                                                        }

                                                                                                                                    </div>
                                                                                                                                )
                                                                                                                            })}


                                                                                                                    </div>
                                                                                                                    <div className="col-6  "
                                                                                                                        style={{
                                                                                                                            paddingLeft: '10%'
                                                                                                                        }}>

                                                                                                                        {leftData.map((res: any) => {
                                                                                                                            let findcheckbox = templateResult?.find((resItem: any) => resItem?.template_item_id == res?.id && resItem?.template_id == parentItem?.template_id && resItem?.status == 'checkbox')
                                                                                                                            let findcomment = templateResult?.find((resItem: any) => resItem?.template_item_id == res?.id && resItem?.template_id == parentItem?.template_id && resItem?.status == 'is_comment')
                                                                                                                            return (
                                                                                                                                <div className={` d-block d-lg-flex input-group ${+res?.is_comment ? 'my-1' : 0}`}>
                                                                                                                                    <div className={`${+res?.is_comment ? 'input-group-text d-block d-lg-flex form-check_width' : ''} `}>

                                                                                                                                        {


                                                                                                                                            <div className="form-check">
                                                                                                                                                <label htmlFor={`defaultCheck${res.id}`} className='checkbox_label'>{res?.value_1} </label>
                                                                                                                                                <input className="form-check-input" type="checkbox" id={`defaultCheck${res.id}`}
                                                                                                                                                    checked={+findcheckbox?.value ? true : false}
                                                                                                                                                    onChange={(e: any) => {
                                                                                                                                                        let check = e.target.checked
                                                                                                                                                        // template_item_id: res?.id,
                                                                                                                                                        // template_id: parentItem?.template_id,
                                                                                                                                                        let find = findcheckbox
                                                                                                                                                        if (find) {
                                                                                                                                                            setTemplateResult(() =>
                                                                                                                                                                templateResult?.map((resItem: any) => resItem?.template_item_id == res?.id && resItem?.template_id == parentItem?.template_id && resItem?.status == 'checkbox' ? { ...resItem, value: check } : resItem))
                                                                                                                                                        } else {
                                                                                                                                                            setTemplateResult(() => {
                                                                                                                                                                return [
                                                                                                                                                                    ...templateResult,
                                                                                                                                                                    {
                                                                                                                                                                        template_id: parentItem?.template_id,
                                                                                                                                                                        template_item_id: res?.id,
                                                                                                                                                                        value: check,
                                                                                                                                                                        status: 'checkbox'
                                                                                                                                                                    }
                                                                                                                                                                ]
                                                                                                                                                            })
                                                                                                                                                        }

                                                                                                                                                    }}

                                                                                                                                                />
                                                                                                                                            </div>

                                                                                                                                        }
                                                                                                                                    </div>
                                                                                                                                    {
                                                                                                                                        +res?.is_comment ?
                                                                                                                                            <input type="text" className='d-block d-lg-inline-block form-control responsive_comment_input'
                                                                                                                                                placeholder='izoh..'
                                                                                                                                                value={findcomment?.value}
                                                                                                                                                onChange={(e: any) => {
                                                                                                                                                    let check = e.target.value
                                                                                                                                                    // template_item_id: res?.id,
                                                                                                                                                    // template_id: parentItem?.template_id,
                                                                                                                                                    let find = findcomment
                                                                                                                                                    if (find) {
                                                                                                                                                        setTemplateResult(() =>
                                                                                                                                                            templateResult?.map((resItem: any) => resItem?.template_item_id == res?.id && resItem?.template_id == parentItem?.template_id && resItem?.status == 'is_comment' ? { ...resItem, value: check } : resItem))
                                                                                                                                                    } else {
                                                                                                                                                        setTemplateResult(() => {
                                                                                                                                                            return [
                                                                                                                                                                ...templateResult,
                                                                                                                                                                {
                                                                                                                                                                    template_id: parentItem?.template_id,
                                                                                                                                                                    template_item_id: res?.id,
                                                                                                                                                                    value: check,
                                                                                                                                                                    status: 'is_comment'
                                                                                                                                                                }
                                                                                                                                                            ]
                                                                                                                                                        })
                                                                                                                                                    }

                                                                                                                                                }}

                                                                                                                                            /> : ''
                                                                                                                                    }

                                                                                                                                </div>
                                                                                                                            )
                                                                                                                        })}


                                                                                                                    </div>
                                                                                                                    <div className="col-6  "
                                                                                                                        style={{
                                                                                                                            // paddingLeft: '10%'
                                                                                                                        }}>

                                                                                                                        {rightData?.map((res: any) => {
                                                                                                                            let findcheckbox = templateResult?.find((resItem: any) => resItem?.template_item_id == res?.id && resItem?.template_id == parentItem?.template_id && resItem?.status == 'checkbox')
                                                                                                                            let findcomment = templateResult?.find((resItem: any) => resItem?.template_item_id == res?.id && resItem?.template_id == parentItem?.template_id && resItem?.status == 'is_comment')
                                                                                                                            return (
                                                                                                                                <div className={` d-block d-lg-flex input-group ${+res?.is_comment ? 'my-1' : 0}`}>
                                                                                                                                    <div className={`${+res?.is_comment ? 'input-group-text d-block d-lg-flex form-check_width' : ''} `}>

                                                                                                                                        {


                                                                                                                                            <div className="form-check">
                                                                                                                                                <label htmlFor={`defaultCheck${res.id}`} className='checkbox_label'>{res?.value_1} </label>
                                                                                                                                                <input className="form-check-input" type="checkbox" id={`defaultCheck${res.id}`}
                                                                                                                                                    checked={+findcheckbox?.value ? true : false}
                                                                                                                                                    onChange={(e: any) => {
                                                                                                                                                        let check = e.target.checked
                                                                                                                                                        // template_item_id: res?.id,
                                                                                                                                                        // template_id: parentItem?.template_id,
                                                                                                                                                        let find = findcheckbox
                                                                                                                                                        if (find) {
                                                                                                                                                            setTemplateResult(() =>
                                                                                                                                                                templateResult?.map((resItem: any) => resItem?.template_item_id == res?.id && resItem?.template_id == parentItem?.template_id && resItem?.status == 'checkbox' ? { ...resItem, value: check } : resItem))
                                                                                                                                                        } else {
                                                                                                                                                            setTemplateResult(() => {
                                                                                                                                                                return [
                                                                                                                                                                    ...templateResult,
                                                                                                                                                                    {
                                                                                                                                                                        template_id: parentItem?.template_id,
                                                                                                                                                                        template_item_id: res?.id,
                                                                                                                                                                        value: check,
                                                                                                                                                                        status: 'checkbox'
                                                                                                                                                                    }
                                                                                                                                                                ]
                                                                                                                                                            })
                                                                                                                                                        }

                                                                                                                                                    }}

                                                                                                                                                />
                                                                                                                                            </div>

                                                                                                                                        }
                                                                                                                                    </div>
                                                                                                                                    {
                                                                                                                                        +res?.is_comment ?
                                                                                                                                            <input type="text" className='d-block d-lg-inline-block form-control responsive_comment_input'
                                                                                                                                                placeholder='izoh..'
                                                                                                                                                value={findcomment?.value}
                                                                                                                                                onChange={(e: any) => {
                                                                                                                                                    let check = e.target.value
                                                                                                                                                    // template_item_id: res?.id,
                                                                                                                                                    // template_id: parentItem?.template_id,
                                                                                                                                                    let find = findcomment
                                                                                                                                                    if (find) {
                                                                                                                                                        setTemplateResult(() =>
                                                                                                                                                            templateResult?.map((resItem: any) => resItem?.template_item_id == res?.id && resItem?.template_id == parentItem?.template_id && resItem?.status == 'is_comment' ? { ...resItem, value: check } : resItem))
                                                                                                                                                    } else {
                                                                                                                                                        setTemplateResult(() => {
                                                                                                                                                            return [
                                                                                                                                                                ...templateResult,
                                                                                                                                                                {
                                                                                                                                                                    template_id: parentItem?.template_id,
                                                                                                                                                                    template_item_id: res?.id,
                                                                                                                                                                    value: check,
                                                                                                                                                                    status: 'is_comment'
                                                                                                                                                                }
                                                                                                                                                            ]
                                                                                                                                                        })
                                                                                                                                                    }

                                                                                                                                                }}

                                                                                                                                            /> : ''
                                                                                                                                    }

                                                                                                                                </div>
                                                                                                                            )
                                                                                                                        })}


                                                                                                                    </div>

                                                                                                                    {/* <div className="col-6 responsive_checkbox"
                                                                                                        style={{
                                                                                                            paddingLeft: '10%'
                                                                                                        }}>
                                                                                                        {item?.items
                                                                                                        // ?.slice(item?.items?.length / 2 + (item?.items?.length % 2 == 0 ? 0 : 1))
                                                                                                        ?.map((res: any) => {
                                                                                                            let findcheckbox = templateResult?.find((resItem: any) => resItem?.template_item_id == res?.id && resItem?.template_id == parentItem?.template_id && resItem?.status == 'checkbox')
                                                                                                            let findcomment = templateResult?.find((resItem: any) => resItem?.template_item_id == res?.id && resItem?.template_id == parentItem?.template_id && resItem?.status == 'is_comment')

                                                                                                            return (
                                                                                                                <div>
                                                                                                                    <div className='d-block d-lg-flex input-group'>
                                                                                                                        <div className={`${+res?.is_comment ? 'input-group-text d-block d-lg-flex' : ''} `}>

                                                                                                                            {


                                                                                                                                <div className="form-check">
                                                                                                                                    <label htmlFor={`defaultCheck${res.id}`} className='checkbox_label'>{res?.value_1}</label>
                                                                                                                                    <input className="form-check-input" type="checkbox" id={`defaultCheck${res.id}`}
                                                                                                                                        checked={findcheckbox?.value ? true : false}
                                                                                                                                        onChange={(e: any) => {
                                                                                                                                            let check = e.target.checked
                                                                                                                                            // template_item_id: res?.id,
                                                                                                                                            // template_id: parentItem?.template_id,
                                                                                                                                            let find = findcheckbox
                                                                                                                                            if (find) {
                                                                                                                                                setTemplateResult(() =>
                                                                                                                                                    templateResult?.map((resItem: any) => resItem?.template_item_id == res?.id && resItem?.template_id == parentItem?.template_id && resItem?.status == 'checkbox' ? { ...resItem, value: check } : resItem))
                                                                                                                                            } else {
                                                                                                                                                setTemplateResult(() => {
                                                                                                                                                    return [
                                                                                                                                                        ...templateResult,
                                                                                                                                                        {
                                                                                                                                                            template_id: parentItem?.template_id,
                                                                                                                                                            template_item_id: res?.id,
                                                                                                                                                            value: check,
                                                                                                                                                            status: 'checkbox'
                                                                                                                                                        }
                                                                                                                                                    ]
                                                                                                                                                })
                                                                                                                                            }

                                                                                                                                        }}

                                                                                                                                    />
                                                                                                                                </div>

                                                                                                                            }
                                                                                                                        </div>
                                                                                                                        {
                                                                                                                            +res?.is_comment ?
                                                                                                                                <input type="text" className='d-block d-lg-inline-block responsive_comment_input form-control'
                                                                                                                                    value={findcomment?.value}
                                                                                                                                    onChange={(e: any) => {
                                                                                                                                        let check = e.target.value
                                                                                                                                        // template_item_id: res?.id,
                                                                                                                                        // template_id: parentItem?.template_id,
                                                                                                                                        let find = findcomment
                                                                                                                                        if (find) {
                                                                                                                                            setTemplateResult(() =>
                                                                                                                                                templateResult?.map((resItem: any) => resItem?.template_item_id == res?.id && resItem?.template_id == parentItem?.template_id && resItem?.status == 'is_comment' ? { ...resItem, value: check } : resItem))
                                                                                                                                        } else {
                                                                                                                                            setTemplateResult(() => {
                                                                                                                                                return [
                                                                                                                                                    ...templateResult,
                                                                                                                                                    {
                                                                                                                                                        template_id: parentItem?.template_id,
                                                                                                                                                        template_item_id: res?.id,
                                                                                                                                                        value: check,
                                                                                                                                                        status: 'is_comment'
                                                                                                                                                    }
                                                                                                                                                ]
                                                                                                                                            })
                                                                                                                                        }

                                                                                                                                    }}

                                                                                                                                /> : ''
                                                                                                                        }
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            )
                                                                                                        })}
                                                                                                    </div> */}

                                                                                                                </div>

                                                                                                            </div>
                                                                                                        )

                                                                                                    })
                                                                                                }

                                                                                                <button className='btn btn-primary text-center d-block m-auto' type='button'
                                                                                                    onClick={() => {
                                                                                                        doctorResult(templateResult, data?.target?.client_result?.at(-1)?.is_check_doctor)
                                                                                                    }}
                                                                                                >Saqlash</button>
                                                                                            </div> :
                                                                                            <div className={`${departmentTarget?.value > 0 ? '' : ' border border-5 rounded border-primary p-4'}`}>

                                                                                                <div className={`${departmentTarget?.value > 0 ? 'row' : 'row '}`}>
                                                                                                    {
                                                                                                        data?.client_item
                                                                                                            ?.filter((item: any) => dateTargetId > 0 ? item?.id == dateTargetId : true)
                                                                                                            ?.map((dataTargetItem: any, index: number) => {
                                                                                                                let templateResult = {} as any
                                                                                                                templateResult = dataTargetItem?.template_result

                                                                                                                return (
                                                                                                                    <div className={`border border-primary col-12 col-lg-6 mb-2  border-2 rounded p-4  ${departmentTarget?.value > 0 ? '' : (index == 0 ? '' : 'offset-0 offset-lg-3 ')}`}>
                                                                                                                        {
                                                                                                                            checkboxData?.map((item: any) => {

                                                                                                                                return (
                                                                                                                                    <div className='my-2 ' >
                                                                                                                                        <p >

                                                                                                                                            <span>
                                                                                                                                                {dateFormat(dataTargetItem?.created_at, '/', false)}
                                                                                                                                            </span>
                                                                                                                                            <span> || </span>
                                                                                                                                            <span>
                                                                                                                                                {index + 1}-kun
                                                                                                                                            </span>

                                                                                                                                        </p>
                                                                                                                                        <h1 className='text-center my-2'>{item?.category_name}</h1>
                                                                                                                                        <div className='row'
                                                                                                                                            style={{
                                                                                                                                                // gap: '20rem'
                                                                                                                                            }}
                                                                                                                                        >
                                                                                                                                            <div className="col-12  responsive_checkbox"
                                                                                                                                                style={{
                                                                                                                                                    paddingLeft: '10%'
                                                                                                                                                }}>
                                                                                                                                                {
                                                                                                                                                    item?.items
                                                                                                                                                        // ?.slice(0, item?.items?.length / 2 + (item?.items?.length % 2 == 0 ? 0 : 1))
                                                                                                                                                        ?.map((res: any) => {
                                                                                                                                                            let findcheckbox = templateResult?.find((resItem: any) => resItem?.template_item_id == res?.id && resItem?.template_id == parentItem?.template_id && resItem?.status == 'checkbox')
                                                                                                                                                            let findcomment = templateResult?.find((resItem: any) => resItem?.template_item_id == res?.id && resItem?.template_id == parentItem?.template_id && resItem?.status == 'is_comment')

                                                                                                                                                            return (
                                                                                                                                                                <div>
                                                                                                                                                                    <div className={` d-block d-lg-flex input-group ${+res?.is_comment ? 'my-1' : 0}`}>
                                                                                                                                                                        <div className={`${+res?.is_comment ? 'input-group-text d-block d-lg-flex form-check_width' : ''}  `}>
                                                                                                                                                                            {


                                                                                                                                                                                <div className="form-check ">
                                                                                                                                                                                    <label htmlFor={`defaultCheck${res.id}`} className='checkbox_label'>{res?.value_1}</label>
                                                                                                                                                                                    <input className="form-check-input" type="checkbox" id={`defaultCheck${res.id}`}
                                                                                                                                                                                        checked={findcheckbox?.value ? true : false}
                                                                                                                                                                                        disabled
                                                                                                                                                                                        onChange={(e: any) => {
                                                                                                                                                                                            let check = e.target.checked
                                                                                                                                                                                            // template_item_id: res?.id,
                                                                                                                                                                                            // template_id: parentItem?.template_id,
                                                                                                                                                                                            let find = findcheckbox
                                                                                                                                                                                            if (find) {
                                                                                                                                                                                                setTemplateResult(() =>
                                                                                                                                                                                                    templateResult?.map((resItem: any) => resItem?.template_item_id == res?.id && resItem?.template_id == parentItem?.template_id && resItem?.status == 'checkbox' ? { ...resItem, value: check } : resItem))
                                                                                                                                                                                            } else {
                                                                                                                                                                                                setTemplateResult(() => {
                                                                                                                                                                                                    return [
                                                                                                                                                                                                        ...templateResult,
                                                                                                                                                                                                        {
                                                                                                                                                                                                            template_id: parentItem?.template_id,
                                                                                                                                                                                                            template_item_id: res?.id,
                                                                                                                                                                                                            value: check,
                                                                                                                                                                                                            status: 'checkbox'
                                                                                                                                                                                                        }
                                                                                                                                                                                                    ]
                                                                                                                                                                                                })
                                                                                                                                                                                            }

                                                                                                                                                                                        }}

                                                                                                                                                                                    />
                                                                                                                                                                                </div>

                                                                                                                                                                            }

                                                                                                                                                                        </div>
                                                                                                                                                                        {
                                                                                                                                                                            +res?.is_comment ?
                                                                                                                                                                                <input type="text" className='d-block d-lg-inline-block responsive_comment_input  form-control'
                                                                                                                                                                                    value={findcomment?.value}
                                                                                                                                                                                    disabled
                                                                                                                                                                                    onChange={(e: any) => {
                                                                                                                                                                                        let check = e.target.value
                                                                                                                                                                                        // template_item_id: res?.id,
                                                                                                                                                                                        // template_id: parentItem?.template_id,
                                                                                                                                                                                        let find = findcomment
                                                                                                                                                                                        if (find) {
                                                                                                                                                                                            setTemplateResult(() =>
                                                                                                                                                                                                templateResult?.map((resItem: any) => resItem?.template_item_id == res?.id && resItem?.template_id == parentItem?.template_id && resItem?.status == 'is_comment' ? { ...resItem, value: check } : resItem))
                                                                                                                                                                                        } else {
                                                                                                                                                                                            setTemplateResult(() => {
                                                                                                                                                                                                return [
                                                                                                                                                                                                    ...templateResult,
                                                                                                                                                                                                    {
                                                                                                                                                                                                        template_id: parentItem?.template_id,
                                                                                                                                                                                                        template_item_id: res?.id,
                                                                                                                                                                                                        value: check,
                                                                                                                                                                                                        status: 'is_comment'
                                                                                                                                                                                                    }
                                                                                                                                                                                                ]
                                                                                                                                                                                            })
                                                                                                                                                                                        }

                                                                                                                                                                                    }}

                                                                                                                                                                                /> : ''
                                                                                                                                                                        }
                                                                                                                                                                    </div>
                                                                                                                                                                </div>
                                                                                                                                                            )
                                                                                                                                                        })}
                                                                                                                                            </div>
                                                                                                                                            {/* <div className="col-6 responsive_checkbox"
                                                                                                                            style={{
                                                                                                                                paddingLeft: '10%'
                                                                                                                            }}>
                                                                                                                            {item?.items?.slice(item?.items?.length / 2 + (item?.items?.length % 2 == 0 ? 0 : 1))?.map((res: any) => {
                                                                                                                                let findcheckbox = templateResult?.find((resItem: any) => resItem?.template_item_id == res?.id && resItem?.template_id == parentItem?.template_id && resItem?.status == 'checkbox')
                                                                                                                                let findcomment = templateResult?.find((resItem: any) => resItem?.template_item_id == res?.id && resItem?.template_id == parentItem?.template_id && resItem?.status == 'is_comment')

                                                                                                                                return (
                                                                                                                                    <div>
                                                                                                                                        <div className='d-block d-lg-flex input-group '>
                                                                                                                                            <div className={`${+res?.is_comment ? 'input-group-text d-block d-lg-flex' : ''} `}>

                                                                                                                                                {


                                                                                                                                                    <div className="form-check d-block d-lg-flex">
                                                                                                                                                        <label htmlFor={`defaultCheck${res.id}`} className='checkbox_label'>{res?.value_1}</label>
                                                                                                                                                        <input className="form-check-input" type="checkbox" id={`defaultCheck${res.id}`}
                                                                                                                                                            checked={findcheckbox?.value ? true : false}
                                                                                                                                                            disabled
                                                                                                                                                            onChange={(e: any) => {
                                                                                                                                                                let check = e.target.checked
                                                                                                                                                                // template_item_id: res?.id,
                                                                                                                                                                // template_id: parentItem?.template_id,
                                                                                                                                                                let find = findcheckbox
                                                                                                                                                                if (find) {
                                                                                                                                                                    setTemplateResult(() =>
                                                                                                                                                                        templateResult?.map((resItem: any) => resItem?.template_item_id == res?.id && resItem?.template_id == parentItem?.template_id && resItem?.status == 'checkbox' ? { ...resItem, value: check } : resItem))
                                                                                                                                                                } else {
                                                                                                                                                                    setTemplateResult(() => {
                                                                                                                                                                        return [
                                                                                                                                                                            ...templateResult,
                                                                                                                                                                            {
                                                                                                                                                                                template_id: parentItem?.template_id,
                                                                                                                                                                                template_item_id: res?.id,
                                                                                                                                                                                value: check,
                                                                                                                                                                                status: 'checkbox'
                                                                                                                                                                            }
                                                                                                                                                                        ]
                                                                                                                                                                    })
                                                                                                                                                                }

                                                                                                                                                            }}

                                                                                                                                                        />
                                                                                                                                                    </div>

                                                                                                                                                }
                                                                                                                                            </div>
                                                                                                                                        {
                                                                                                                                            +res?.is_comment ?
                                                                                                                                                <input type="text" className='d-block d-lg-inline-block responsive_comment_input  form-control'
                                                                                                                                                    value={findcomment?.value}
                                                                                                                                                    disabled
                                                                                                                                                    onChange={(e: any) => {
                                                                                                                                                        let check = e.target.value
                                                                                                                                                        // template_item_id: res?.id,
                                                                                                                                                        // template_id: parentItem?.template_id,
                                                                                                                                                        let find = findcomment
                                                                                                                                                        if (find) {
                                                                                                                                                            setTemplateResult(() =>
                                                                                                                                                                templateResult?.map((resItem: any) => resItem?.template_item_id == res?.id && resItem?.template_id == parentItem?.template_id && resItem?.status == 'is_comment' ? { ...resItem, value: check } : resItem))
                                                                                                                                                        } else {
                                                                                                                                                            setTemplateResult(() => {
                                                                                                                                                                return [
                                                                                                                                                                    ...templateResult,
                                                                                                                                                                    {
                                                                                                                                                                        template_id: parentItem?.template_id,
                                                                                                                                                                        template_item_id: res?.id,
                                                                                                                                                                        value: check,
                                                                                                                                                                        status: 'is_comment'
                                                                                                                                                                    }
                                                                                                                                                                ]
                                                                                                                                                            })
                                                                                                                                                        }

                                                                                                                                                    }}

                                                                                                                                                /> : ''
                                                                                                                                        }
                                                                                                                                        </div>
                                                                                                                                    </div>
                                                                                                                                )
                                                                                                                            })}
                                                                                                                        </div> */}

                                                                                                                                        </div>
                                                                                                                                    </div>
                                                                                                                                )

                                                                                                                            })
                                                                                                                        }
                                                                                                                    </div>
                                                                                                                )
                                                                                                            })
                                                                                                    }
                                                                                                    {
                                                                                                        +departmentTarget?.value > 0 ?
                                                                                                            <div className='col-12 d-flex justify-content-end'>
                                                                                                                <button className='btn btn-secondary'
                                                                                                                    onClick={() => {
                                                                                                                        let table = docregprintheader(data)
                                                                                                                        console.log('parentItem', parentItem);
                                                                                                                        let allData = data?.client_item
                                                                                                                            ?.filter((item: any) => dateTargetId > 0 ? item?.id == dateTargetId : true)
                                                                                                                        let bodyFlex = "" as any

                                                                                                                        for (let i = 0; i < allData?.length; i++) {
                                                                                                                            let templateResult = {} as any
                                                                                                                            templateResult = allData[i]?.template_result
                                                                                                                            bodyFlex += docregprintcheckbox(checkboxData, templateResult, parentItem,
                                                                                                                                {
                                                                                                                                    date: dateFormat(allData[i]?.created_at, '/', false),
                                                                                                                                    full_name: masulRegUchunFullName(allData[i]?.client_result?.at(-1)?.doctor),
                                                                                                                                }
                                                                                                                            )
                                                                                                                        }

                                                                                                                        updateIframeContentLab(`
                                                                                                            ${table}
                                                                                                            <div 
                                                                                                            style="display: grid;
                                                                                                            grid-template-columns: repeat(2, 1fr); gap:10px"
                                                                                                            >
                                                                                                            ${bodyFlex}
                                                                                                            </div>
                                                                                                         `)

                                                                                                                        handlePrintLab()
                                                                                                                    }}
                                                                                                                >Print</button>
                                                                                                            </div> : ''
                                                                                                    }
                                                                                                </div>
                                                                                                {
                                                                                                    <div className={`col-12 d-flex justify-content-end ${departmentTarget?.value > 0 ? 'd-none' : ''}`}>
                                                                                                        <button className='btn btn-secondary'
                                                                                                            onClick={(() => {
                                                                                                                let table = docregprintheader(data)
                                                                                                                console.log('parentItem', parentItem);
                                                                                                                let allData = data?.client_item
                                                                                                                    ?.filter((item: any) => dateTargetId > 0 ? item?.id == dateTargetId : true)
                                                                                                                let bodyFlex = "" as any

                                                                                                                for (let i = 0; i < allData?.length; i++) {
                                                                                                                    let templateResult = {} as any
                                                                                                                    templateResult = allData[i]?.template_result
                                                                                                                    bodyFlex += docregprintcheckbox(checkboxData, templateResult, parentItem, {
                                                                                                                        date: dateFormat(allData[i]?.created_at, '/', false),
                                                                                                                        index: i + 1,
                                                                                                                        full_name: masulRegUchunFullName(allData[i]?.client_result?.at(-1)?.doctor),
                                                                                                                    })
                                                                                                                }

                                                                                                                updateIframeContentLab(`
                                                                                                                ${table}
                                                                                                                <div 
                                                                                                                style="display: grid;
                                                                                                                grid-template-columns: repeat(2, 1fr); gap:10px"
                                                                                                                >
                                                                                                                ${bodyFlex}
                                                                                                                </div>
                                                                                                             `)

                                                                                                                handlePrintLab()
                                                                                                            })}

                                                                                                        >Print</button>
                                                                                                    </div>
                                                                                                }
                                                                                            </div>


                                                                                    }
                                                                                </div> :

                                                                                    <div >

                                                                                        {
                                                                                            data?.target ?
                                                                                                <div className='row'>
                                                                                                    <div className={`col-3 offset-lg-3  my-1 col-12 col-lg-6 `}>
                                                                                                        <div className="table-responsive text-nowrap col-12">
                                                                                                            <caption className={`bg-${templateResult?.filter((resItem: any) => resItem?.id > 0 && resItem?.template_id == parentItem?.template_id && resItem?.status == 'select').length >= checkboxData?.length ? 'primary' : 'danger'} d-flex text-white w-full d-flex justify-content-between align-items-center p-2 `}>
                                                                                                                <p className='p-0 mb-0'>
                                                                                                                    {+departmentTarget?.value > 0 ? `${dayIndex + 1} - kun` : dateFormat(data?.target?.created_at, '/', false)}
                                                                                                                </p>
                                                                                                                <p className='p-0 mb-0'>
                                                                                                                    {
                                                                                                                        data?.target?.client_result?.at(-1)?.doctor ? masulRegUchunFullName(data?.target?.client_result?.at(-1)?.doctor) : ''
                                                                                                                    }
                                                                                                                    {
                                                                                                                        // JSON.stringify(data?.target?.client_result?.at(-1))
                                                                                                                    }
                                                                                                                </p>

                                                                                                                {/* {checkboxData?.length}
                                                                                       {templateResult?.filter((resItem: any) => resItem?.id>0 && resItem?.template_id == parentItem?.template_id && resItem?.status == 'select').length} */}
                                                                                                            </caption>
                                                                                                            <table className="table table-bordered">
                                                                                                                <tbody>
                                                                                                                    {checkboxData?.map((res: any, index: number) => {
                                                                                                                        let findtarget = templateResult?.find((resItem: any) => resItem?.template_item_id == res?.items[0]?.id && resItem?.template_id == parentItem?.template_id && resItem?.status == 'select') ?? false
                                                                                                                        console.log('findtarget', findtarget);

                                                                                                                        let findtargetrow = templateResult?.filter((resItem: any) => resItem?.template_id == parentItem?.template_id && resItem?.value?.length > 0)
                                                                                                                        let findtargetphoto = templateResult?.find((resItem: any) => resItem?.template_id == parentItem?.template_id && resItem?.status == 'photo') ?? false
                                                                                                                        let findtargetcomment = templateResult?.find((resItem: any) => resItem?.template_id == parentItem?.template_id && resItem?.status == 'comment')
                                                                                                                        let idPhoito = nanoid()
                                                                                                                        return (
                                                                                                                            <>
                                                                                                                                <tr>
                                                                                                                                    <td>
                                                                                                                                        {res?.category_name}
                                                                                                                                    </td>
                                                                                                                                    <td>
                                                                                                                                        <select id="defaultSelect" className="form-select"
                                                                                                                                            value={findtarget?.value ?? ''}
                                                                                                                                            required
                                                                                                                                            onChange={(e: any) => {
                                                                                                                                                let find = findtarget
                                                                                                                                                if (find) {
                                                                                                                                                    setTemplateResult(() =>
                                                                                                                                                        templateResult?.map((resItem: any) => resItem?.template_item_id == res?.items[0]?.id && resItem?.template_id == parentItem?.template_id ? { ...resItem, value: e.target.value } : resItem))
                                                                                                                                                } else {
                                                                                                                                                    setTemplateResult(() => {
                                                                                                                                                        return [
                                                                                                                                                            ...templateResult,
                                                                                                                                                            {
                                                                                                                                                                template_id: parentItem?.template_id,
                                                                                                                                                                template_item_id: res?.items[0]?.id,
                                                                                                                                                                value: e.target.value,
                                                                                                                                                                status: 'select'
                                                                                                                                                            }
                                                                                                                                                        ]
                                                                                                                                                    })
                                                                                                                                                }
                                                                                                                                            }}
                                                                                                                                        >
                                                                                                                                            <option value={''}>Tanlang</option>
                                                                                                                                            <option value={res?.items[0]?.value_1}>{res?.items[0]?.value_1}</option>
                                                                                                                                            <option value={res?.items[0]?.value_2}>{res?.items[0]?.value_2}</option>
                                                                                                                                            <option value={res?.items[0]?.value_3}>{res?.items[0]?.value_3}</option>
                                                                                                                                        </select>
                                                                                                                                    </td>
                                                                                                                                    {
                                                                                                                                        +parentItem?.template?.is_photo && index == 0 ?
                                                                                                                                            <td rowSpan={3}>
                                                                                                                                                <div className="button-wrapper">
                                                                                                                                                    <label htmlFor={`blank_file__${idPhoito}`} className="cursor-pointer  border rounded" tabIndex={0}
                                                                                                                                                    >
                                                                                                                                                        <img src={findtargetphoto?.value?.includes('clients/') ? `${domain}/${findtargetphoto?.value}` : findtargetphoto?.value && findtargetphoto?.value?.length > 0 ? findtargetphoto?.value : uploadFileIcon} alt="user-avatar" className="d-block rounded object-contain" height={100} width={100} id="uploadedAvatar" />
                                                                                                                                                        <input

                                                                                                                                                            onChange={(e: any) => {
                                                                                                                                                                let find = findtargetphoto
                                                                                                                                                                if (find) {
                                                                                                                                                                    setTemplateResult(() =>
                                                                                                                                                                        templateResult?.map((resItem: any) => resItem?.status == 'photo' && resItem?.template_id == parentItem?.template_id ? { ...resItem, value: e.target.files[0] ? URL.createObjectURL(e.target.files[0]) : false, photo: e.target.files[0] ? e.target.files[0] : false, } : resItem))
                                                                                                                                                                } else {
                                                                                                                                                                    setTemplateResult(() => {
                                                                                                                                                                        return [
                                                                                                                                                                            ...templateResult,
                                                                                                                                                                            {

                                                                                                                                                                                template_id: parentItem?.template_id,
                                                                                                                                                                                template_item_id: false,
                                                                                                                                                                                value: e.target.files[0] ? URL.createObjectURL(e.target.files[0]) : false,
                                                                                                                                                                                photo: e.target.files[0] ? e.target.files[0] : false,
                                                                                                                                                                                status: 'photo'
                                                                                                                                                                            }
                                                                                                                                                                        ]
                                                                                                                                                                    })
                                                                                                                                                                }
                                                                                                                                                            }}
                                                                                                                                                            type="file" id={`blank_file__${idPhoito}`} required className="account-file-input" hidden accept="image/png, image/jpeg" />
                                                                                                                                                    </label>
                                                                                                                                                </div>
                                                                                                                                            </td> : (!+parentItem?.template?.is_photo ?
                                                                                                                                                <td className={`${findtarget?.value == res?.items[0]?.value_1 ? 'text-success' : (findtarget?.value == res?.items[0]?.value_2 ? 'text-warning' : findtarget?.value == res?.items[0]?.value_3 ? 'text-danger' : '')}`}>
                                                                                                                                                    <FaCircle size={24} />
                                                                                                                                                </td> : <></>)
                                                                                                                                    }

                                                                                                                                </tr>
                                                                                                                                {
                                                                                                                                    +parentItem?.template?.is_comment && index == checkboxData?.length - 1 ? <tr>
                                                                                                                                        <td colSpan={+parentItem?.template?.is_photo ? 2 : 3}>
                                                                                                                                            <input type="text" className='w-100 form-control'
                                                                                                                                                value={findtargetcomment?.value ?? '-'}
                                                                                                                                                // disabled={checkboxData?.length == findtargetrow?.length ? false : true}
                                                                                                                                                onChange={(e: any) => {
                                                                                                                                                    let find = findtargetcomment
                                                                                                                                                    if (find) {
                                                                                                                                                        setTemplateResult(() =>
                                                                                                                                                            templateResult?.map((resItem: any) => resItem?.template_id == parentItem?.template_id && resItem?.status == 'comment' ? { ...resItem, value: e.target.value, } : resItem))
                                                                                                                                                    } else {
                                                                                                                                                        setTemplateResult(() => {
                                                                                                                                                            return [
                                                                                                                                                                ...templateResult,
                                                                                                                                                                {

                                                                                                                                                                    template_id: parentItem?.template_id,
                                                                                                                                                                    template_item_id: false,
                                                                                                                                                                    value: e.target.value,
                                                                                                                                                                    status: 'comment'
                                                                                                                                                                }
                                                                                                                                                            ]
                                                                                                                                                        })
                                                                                                                                                    }
                                                                                                                                                }}
                                                                                                                                                placeholder='izoh' />
                                                                                                                                        </td> </tr> : ''
                                                                                                                                }
                                                                                                                            </>

                                                                                                                        )
                                                                                                                    })}


                                                                                                                </tbody>
                                                                                                            </table>
                                                                                                            <button className='btn btn-primary text-center d-block m-auto' type='button'
                                                                                                                onClick={() => {
                                                                                                                    doctorResult(templateResult, data?.target?.client_result?.at(-1)?.is_check_doctor)
                                                                                                                }}
                                                                                                            >Saqlash</button>
                                                                                                        </div>

                                                                                                    </div>
                                                                                                </div>
                                                                                                :
                                                                                                <div className={`${departmentTarget?.value > 0 ? ' row border border-5 border-primary rounded p-2' : 'row'}`}>
                                                                                                    {data?.client_item
                                                                                                        ?.filter((item: any) => dateTargetId > 0 ? item?.id == dateTargetId : true)
                                                                                                        ?.map((dataTargetItem: any, index: number) => {
                                                                                                            let templateResult = dataTargetItem?.template_result
                                                                                                            return (
                                                                                                                <div className={`col-3 ${departmentTarget?.value > 0 ? '' : (index == 0 ? 'offset-lg-1' : 'offset-lg-3')}   my-1 col-12 col-lg-${departmentTarget?.value > 0 ? 6 : 6} col-xl-${departmentTarget?.value > 0 ? 4 : 6} col-xxl-${departmentTarget?.value > 0 ? 3 : 6} `}>
                                                                                                                    <div className="table-responsive text-nowrap col-12">
                                                                                                                        <p>{dateFormat(dataTargetItem?.created_at, '/', false)}</p>
                                                                                                                        <caption className={`bg-${templateResult?.filter((resItem: any) => resItem?.id > 0 && resItem?.template_id == parentItem?.template_id && resItem?.status == 'select').length >= checkboxData?.length ? 'primary' : 'danger'} d-flex text-white w-full d-flex justify-content-between align-items-center p-2 `}>
                                                                                                                            <p className='p-0 mb-0'>
                                                                                                                                {index + 1}-kun
                                                                                                                            </p>
                                                                                                                            <p className='p-0 mb-0'>
                                                                                                                                {
                                                                                                                                    dataTargetItem?.client_result?.at(0)?.doctor?.id ? masulRegUchunFullName(dataTargetItem?.client_result?.at(0)?.doctor) : ''
                                                                                                                                }
                                                                                                                            </p>
                                                                                                                        </caption>
                                                                                                                        <table className="table table-bordered">
                                                                                                                            <tbody>
                                                                                                                                {checkboxData?.map((res: any, index: number) => {
                                                                                                                                    let findtarget = templateResult?.find((resItem: any) => resItem?.template_item_id == res?.items[0]?.id && resItem?.template_id == parentItem?.template_id && resItem?.status == 'select') ?? false
                                                                                                                                    console.log('findtarget', findtarget);

                                                                                                                                    let findtargetrow = templateResult?.filter((resItem: any) => resItem?.template_id == parentItem?.template_id && resItem?.value?.length > 0)
                                                                                                                                    let findtargetphoto = templateResult?.find((resItem: any) => resItem?.template_id == parentItem?.template_id && resItem?.status == 'photo') ?? false
                                                                                                                                    let findtargetcomment = templateResult?.find((resItem: any) => resItem?.template_id == parentItem?.template_id && resItem?.status == 'comment')
                                                                                                                                    let idPhoito = nanoid()
                                                                                                                                    return (
                                                                                                                                        <>
                                                                                                                                            <tr>
                                                                                                                                                <td>
                                                                                                                                                    {res?.category_name}
                                                                                                                                                </td>
                                                                                                                                                <td>
                                                                                                                                                    <select disabled id="defaultSelect" className="form-select"
                                                                                                                                                        value={findtarget?.value ? findtarget?.value : ''}
                                                                                                                                                        required
                                                                                                                                                        onChange={(e: any) => {
                                                                                                                                                            let find = findtarget
                                                                                                                                                            if (find) {
                                                                                                                                                                setTemplateResult(() =>
                                                                                                                                                                    templateResult?.map((resItem: any) => resItem?.template_item_id == res?.items[0]?.id && resItem?.template_id == parentItem?.template_id ? { ...resItem, value: e.target.value } : resItem))
                                                                                                                                                            } else {
                                                                                                                                                                setTemplateResult(() => {
                                                                                                                                                                    return [
                                                                                                                                                                        ...templateResult,
                                                                                                                                                                        {
                                                                                                                                                                            template_id: parentItem?.template_id,
                                                                                                                                                                            template_item_id: res?.items[0]?.id,
                                                                                                                                                                            value: e.target.value,
                                                                                                                                                                            status: 'select'
                                                                                                                                                                        }
                                                                                                                                                                    ]
                                                                                                                                                                })
                                                                                                                                                            }
                                                                                                                                                        }}
                                                                                                                                                    >
                                                                                                                                                        <option value={''}>Tanlang</option>
                                                                                                                                                        <option value={res?.items[0]?.value_1}>{res?.items[0]?.value_1}</option>
                                                                                                                                                        <option value={res?.items[0]?.value_2}>{res?.items[0]?.value_2}</option>
                                                                                                                                                        <option value={res?.items[0]?.value_3}>{res?.items[0]?.value_3}</option>
                                                                                                                                                    </select>
                                                                                                                                                </td>
                                                                                                                                                {
                                                                                                                                                    +parentItem?.template?.is_photo && index == 0 ?
                                                                                                                                                        <td rowSpan={3}>
                                                                                                                                                            <div className="button-wrapper">
                                                                                                                                                                <label htmlFor={`blank_file__${idPhoito}`} className="cursor-pointer  border rounded" tabIndex={0}
                                                                                                                                                                >
                                                                                                                                                                    <img src={findtargetphoto?.value?.includes('clients/') ? `${domain}/${findtargetphoto?.value}` : findtargetphoto?.value && findtargetphoto?.value?.length > 0 ? findtargetphoto?.value : uploadFileIcon} alt="user-avatar" className="d-block rounded object-contain" height={100} width={100} id="uploadedAvatar" />
                                                                                                                                                                    <input

                                                                                                                                                                        onChange={(e: any) => {
                                                                                                                                                                            let find = findtargetphoto
                                                                                                                                                                            if (find) {
                                                                                                                                                                                setTemplateResult(() =>
                                                                                                                                                                                    templateResult?.map((resItem: any) => resItem?.status == 'photo' && resItem?.template_id == parentItem?.template_id ? { ...resItem, value: e.target.files[0] ? URL.createObjectURL(e.target.files[0]) : false, photo: e.target.files[0] ? e.target.files[0] : false, } : resItem))
                                                                                                                                                                            } else {
                                                                                                                                                                                setTemplateResult(() => {
                                                                                                                                                                                    return [
                                                                                                                                                                                        ...templateResult,
                                                                                                                                                                                        {

                                                                                                                                                                                            template_id: parentItem?.template_id,
                                                                                                                                                                                            template_item_id: false,
                                                                                                                                                                                            value: e.target.files[0] ? URL.createObjectURL(e.target.files[0]) : false,
                                                                                                                                                                                            photo: e.target.files[0] ? e.target.files[0] : false,
                                                                                                                                                                                            status: 'photo'
                                                                                                                                                                                        }
                                                                                                                                                                                    ]
                                                                                                                                                                                })
                                                                                                                                                                            }
                                                                                                                                                                        }}
                                                                                                                                                                        type="file" id={`blank_file__${idPhoito}`} required
                                                                                                                                                                        disabled className="account-file-input" hidden accept="image/png, image/jpeg" />
                                                                                                                                                                </label>
                                                                                                                                                            </div>
                                                                                                                                                        </td> : (!+parentItem?.template?.is_photo ?
                                                                                                                                                            <td className={`${findtarget?.value == res?.items[0]?.value_1 ? 'text-success' : (findtarget?.value == res?.items[0]?.value_2 ? 'text-warning' : findtarget?.value == res?.items[0]?.value_2 ? '' : 'text-danger')}`}>
                                                                                                                                                                <FaCircle size={24} />
                                                                                                                                                            </td> : <></>)
                                                                                                                                                }

                                                                                                                                            </tr>
                                                                                                                                            {
                                                                                                                                                +parentItem?.template?.is_comment && index == checkboxData?.length - 1 ? <tr>
                                                                                                                                                    <td colSpan={checkboxData?.length}>
                                                                                                                                                        <input disabled type="text" className='w-100 form-control'
                                                                                                                                                            value={findtargetcomment?.value ?? '-'}
                                                                                                                                                            // disabled={checkboxData?.length == findtargetrow?.length ? false : true}
                                                                                                                                                            onChange={(e: any) => {
                                                                                                                                                                let find = findtargetcomment
                                                                                                                                                                if (find) {
                                                                                                                                                                    setTemplateResult(() =>
                                                                                                                                                                        templateResult?.map((resItem: any) => resItem?.template_id == parentItem?.template_id && resItem?.status == 'comment' ? { ...resItem, value: e.target.value, } : resItem))
                                                                                                                                                                } else {
                                                                                                                                                                    setTemplateResult(() => {
                                                                                                                                                                        return [
                                                                                                                                                                            ...templateResult,
                                                                                                                                                                            {

                                                                                                                                                                                template_id: parentItem?.template_id,
                                                                                                                                                                                template_item_id: false,
                                                                                                                                                                                value: e.target.value,
                                                                                                                                                                                status: 'comment'
                                                                                                                                                                            }
                                                                                                                                                                        ]
                                                                                                                                                                    })
                                                                                                                                                                }
                                                                                                                                                            }}
                                                                                                                                                            placeholder='izoh' />
                                                                                                                                                    </td> </tr> : ''
                                                                                                                                            }
                                                                                                                                        </>

                                                                                                                                    )
                                                                                                                                })}


                                                                                                                            </tbody>
                                                                                                                        </table>
                                                                                                                    </div>

                                                                                                                </div>
                                                                                                            )


                                                                                                        })}
                                                                                                    {
                                                                                                        +departmentTarget?.value > 0 ?
                                                                                                            <div className='col-12 d-flex justify-content-end'>
                                                                                                                <button className='btn btn-secondary'
                                                                                                                    onClick={(() => {
                                                                                                                        let table = docregprintheader(data)
                                                                                                                        console.log('parentItem', parentItem);
                                                                                                                        let allData = data?.client_item
                                                                                                                            ?.filter((item: any) => dateTargetId > 0 ? item?.id == dateTargetId : true)
                                                                                                                        let bodyFlex = "" as any

                                                                                                                        for (let i = 0; i < allData?.length; i++) {
                                                                                                                            let templateResult = {} as any
                                                                                                                            templateResult = allData[i]?.template_result
                                                                                                                            bodyFlex += docregprintselect(checkboxData, templateResult, parentItem,
                                                                                                                                {
                                                                                                                                    date: dateFormat(allData[i]?.created_at, '/', false),
                                                                                                                                    full_name: masulRegUchunFullName(allData[i]?.client_result?.at(-1)?.doctor),
                                                                                                                                }
                                                                                                                            )
                                                                                                                        }

                                                                                                                        updateIframeContentLab(`
                                                                                                                ${table}
                                                                                                                <div 
                                                                                                                style="display: grid;
                                                                                                                grid-template-columns: repeat(2, 1fr); gap:10px"
                                                                                                                >
                                                                                                                ${bodyFlex}
                                                                                                                </div>
                                                                                                             `)

                                                                                                                        handlePrintLab()
                                                                                                                    })}

                                                                                                                >Print</button>
                                                                                                            </div> : ''
                                                                                                    }
                                                                                                    {
                                                                                                        <div className={`col-12 d-flex justify-content-end ${departmentTarget?.value > 0 ? 'd-none' : ''}`}>
                                                                                                            <button className='btn btn-secondary'
                                                                                                                onClick={(() => {
                                                                                                                    let table = docregprintheader(data)
                                                                                                                    console.log('parentItem', parentItem);
                                                                                                                    let allData = data?.client_item
                                                                                                                        ?.filter((item: any) => dateTargetId > 0 ? item?.id == dateTargetId : true)
                                                                                                                    let bodyFlex = "" as any

                                                                                                                    for (let i = 0; i < allData?.length; i++) {
                                                                                                                        let templateResult = {} as any
                                                                                                                        templateResult = allData[i]?.template_result
                                                                                                                        bodyFlex += docregprintselect(checkboxData, templateResult, parentItem, {
                                                                                                                            date: dateFormat(allData[i]?.created_at, '/', false),
                                                                                                                            index: i + 1,
                                                                                                                            full_name: masulRegUchunFullName(allData[i]?.client_result?.at(-1)?.doctor),
                                                                                                                        })
                                                                                                                    }

                                                                                                                    updateIframeContentLab(`
                                                                                                                ${table}
                                                                                                                <div 
                                                                                                                style="display: grid;
                                                                                                                grid-template-columns: repeat(2, 1fr); gap:10px"
                                                                                                                >
                                                                                                                ${bodyFlex}
                                                                                                                </div>
                                                                                                             `)

                                                                                                                    handlePrintLab()
                                                                                                                })}

                                                                                                            >Print</button>
                                                                                                        </div>
                                                                                                    }
                                                                                                </div>
                                                                                        }
                                                                                    </div>

                                                                            }
                                                                        </>
                                                                    )



                                                                })
                                                        }
                                                    </div>
                                                    {
                                                        data?.target ? ((data?.target?.client_result?.at(-1)?.doctor_id > 0 &&

                                                            data?.target?.client_result?.at(-1)?.doctor_id != user?.id)
                                                            ? '' :
                                                            <div className="d-flex gap-2  justify-content-center my-2">
                                                                {
                                                                    data?.target?.client_result?.at(-1)?.is_check_doctor == 'finish' ? <>

                                                                    </> : <>
                                                                        <button className='btn btn-success rounded-pill btn-icon btn-xl'
                                                                            type='button'
                                                                            onClick={() => {
                                                                                if (+data?.target?.client_result?.at(-1)?.room_id > 0) {
                                                                                    if (data?.target?.client_result?.at(-1)?.is_check_doctor != 'finish' || data?.target?.client_result?.at(-1)?.is_check_doctor == 'pause' || data?.target?.client_result?.at(-1)?.is_check_doctor == 'start') {
                                                                                        doctorResult(templateResult, 'start')
                                                                                    }
                                                                                } else {
                                                                                    doctorRoom()
                                                                                }
                                                                            }}
                                                                        ><FaPlayCircle size={24} /> </button>
                                                                        <button className='btn btn-warning rounded-pill btn-icon btn-xl '
                                                                            type='button'
                                                                            onClick={() => {
                                                                                if (data?.target?.client_result?.at(-1)?.is_check_doctor == 'start') {
                                                                                    doctorResult(templateResult, 'pause')
                                                                                }
                                                                            }}
                                                                        ><FaPauseCircle size={24} /></button>
                                                                    </>
                                                                }

                                                                <button className='btn btn-info rounded-pill btn-icon btn-xl' type='button'
                                                                    onClick={() => {
                                                                        Swal.fire({
                                                                            title: "Ma'lumotni tasdqilaysizmi?",
                                                                            showDenyButton: true,
                                                                            showCancelButton: false,
                                                                            confirmButtonText: 'Ha',
                                                                            denyButtonText: `Yo'q`,
                                                                        }).then((result) => {
                                                                            if (result.isConfirmed) {
                                                                                doctorResult(templateResult, 'finish')
                                                                            }
                                                                        })
                                                                    }}
                                                                    disabled={data?.target ? ((data?.target?.client_result?.at(-1)?.doctor_id > 0 && data?.target?.client_result?.at(-1)?.doctor_id != user?.id) ? true : false) : true}
                                                                ><FaCheckCircle size={24} /></button>
                                                                <button className='btn btn-secondary rounded-pill btn-icon  btn-xl'

                                                                    type='button'
                                                                    onClick={() => {
                                                                        let table = docregprintheader(data?.target)

                                                                        let parentItem = user?.department?.department_template_item?.find((res: any) => res?.id == targetTemplate)
                                                                        console.log('parentItem', parentItem);
                                                                        let checkboxData = newGroupTemplateItemsByCategory(parentItem?.template)

                                                                        if (parentItem?.template?.type == 'select') {
                                                                            let body = docregprintselect(checkboxData, templateResult, parentItem,
                                                                                {
                                                                                    date: dateFormat(data?.target?.created_at, '/', false),
                                                                                    full_name: masulRegUchunFullName(data?.target?.client_result?.at(-1)?.doctor),
                                                                                }
                                                                            )
                                                                            console.log('body', body);
                                                                            updateIframeContentLab(`
                                                                    ${table}
                                                                    ${body}
                                                                 `)

                                                                        } else {
                                                                            let body = docregprintcheckbox(checkboxData, templateResult, parentItem,
                                                                                {
                                                                                    date: dateFormat(data?.target?.created_at, '/', false),
                                                                                    full_name: masulRegUchunFullName(data?.target?.client_result?.at(-1)?.doctor),
                                                                                }
                                                                            )
                                                                            console.log('body', body);
                                                                            updateIframeContentLab(`
                                                                    ${table}
                                                                    ${body}
                                                                 `)

                                                                        }

                                                                        handlePrintLab()
                                                                    }}
                                                                ><FaPrint size={24} />  </button>
                                                                <button className='btn btn-danger rounded-pill btn-icon  btn-xl'

                                                                    type='button'
                                                                    onClick={() => {
                                                                        alertSoket()
                                                                    }}
                                                                ><MdNotifications size={24} />  </button>
                                                            </div>) : ''
                                                    }
                                                </form> : ''
                                        }
                                    </div >
                                    <div className="col-3 border border-3 rounded-3   border-primary p-0 "

                                        style={{
                                            height: '100vh',
                                            position: 'sticky',
                                            top: 0
                                        }}
                                    >
                                        <div className="flex justify-content-between align-items-center gap-2 p-3">
                                            <h3 className='text-danger fw-bold mb-0 text-center '>
                                                {minutes.toString().padStart(2, '0')}: {seconds.toString().padStart(2, '0')}
                                            </h3>
                                            {
                                                data?.target ?
                                                    ((data?.target?.client_result?.at(-1)?.doctor_id > 0 &&

                                                        data?.target?.client_result?.at(-1)?.doctor_id != user?.id)
                                                        ? '' :
                                                        <div className="flex align-items-center gap-2">
                                                            <button className='btn btn-success rounded-pill btn-icon btn-xl'

                                                                onClick={() => {
                                                                    if (+data?.target?.client_result?.at(-1)?.room_id > 0) {
                                                                        if (data?.target?.client_result?.at(-1)?.is_check_doctor != 'finish' || data?.target?.client_result?.at(-1)?.is_check_doctor == 'pause' || data?.target?.client_result?.at(-1)?.is_check_doctor == 'start') {
                                                                            doctorResult(templateResult, 'start')
                                                                        }
                                                                    } else {
                                                                        doctorRoom()
                                                                    }
                                                                }}>
                                                                <FaPlayCircle size={24} />
                                                            </button>
                                                            <button className='btn btn-warning rounded-pill btn-icon btn-xl'
                                                                onClick={() => {
                                                                    if (data?.target?.client_result?.at(-1)?.is_check_doctor == 'start') {
                                                                        doctorResult(templateResult, 'pause')
                                                                    }
                                                                }}
                                                            >
                                                                <FaPauseCircle size={24} />
                                                            </button>

                                                        </div>) : ''
                                            }

                                        </div>
                                        <div className='bg-primary flex justify-content-between align-items-center text-white p-3'>
                                            <p className='mb-0'>ID:  {'  '}
                                                {formatId(data?.person_id)}
                                            </p>
                                            <p className='mb-0'>Navbat: {data?.target?.client_value?.at(0)?.queue_number}</p>
                                        </div>
                                        <div className="p-3  border-bottom border-3  px-3 ">
                                            <p className='mb-0 font-bold'>
                                                FIO: <span className='text-primary'>{fullName(data)}</span>
                                            </p>
                                            <p className='mb-0 font-bold'>
                                                Yo’llanma:<span className='text-primary'>O’zi kelgan</span>
                                            </p>
                                            <p className='mb-0 font-bold'>
                                                Yoshi:{calculateAge(data?.data_birth, user?.graph_format_date)}
                                            </p>
                                            <p className='mb-0 font-bold'>
                                                Telefon:{data?.phone ?? '-'}
                                            </p>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <p className='mb-0 font-bold '>
                                                    Manzil:{data?.address ?? '-'}
                                                </p>
                                                <button className='btn btn-sm'><FaRegEdit size={20} /></button>
                                            </div>
                                        </div>

                                        <div className="btn-group  w-100 my-3 px-3">
                                            <button className='btn btn-primary'>Tekshiruvlar</button>
                                            <button className='btn btn-secondary'>Retseptlar</button>
                                            <button className='btn btn-secondary'>Fayllar</button>
                                        </div>
                                        <div className="d-flex w-100 px-3">
                                            <Select
                                                name='name3'
                                                // value={selectData?.department_id}
                                                value={{
                                                    value: data?.target ? data?.target?.id : 0,
                                                    label: data?.target ? dateFormat(data?.target?.created_at) : 'Barchasi',
                                                    data: data?.target,
                                                }}
                                                onChange={(e: any) => {
                                                    setSelectData({
                                                        ...selectData,
                                                        tashrif: e
                                                    })
                                                    if (e?.data) {
                                                        allShow(e?.data?.person_id, e?.data?.id)
                                                    } else {

                                                        dispatch(isDoctorTargetData({
                                                            ...data,
                                                            target: e?.data
                                                        }))
                                                    }

                                                    console.log(e?.data?.template_result);
                                                    // setTargetTemplate(() => 0)
                                                    // let saveid = targetTemplate
                                                    // setTimeout(() => {
                                                    //     setTargetTemplate(() => targetTemplate)
                                                    // }, 50);
                                                    setTemplateResult(() => [])
                                                    setTemplateResult(() => e?.data?.template_result ?? [])
                                                }}
                                                className="basic-multi-select w-100"
                                                classNamePrefix="select"
                                                placeholder={"Tashriflar sanasi"}
                                                // value={userBranch}
                                                options={
                                                    [
                                                        {
                                                            value: 0,
                                                            label: 'Barchasi'
                                                        },
                                                        ...data?.client_item?.map((item: any) => {
                                                            return {
                                                                value: item?.id,
                                                                label: dateFormat(item?.created_at),
                                                                data: item
                                                            }
                                                        })

                                                    ]
                                                } />
                                            <div className="input-group-text bg-primary text-white">
                                                1
                                            </div>
                                        </div>
                                        <div className="p-3">
                                            <div className='overflow-auto '

                                                style={
                                                    {
                                                        height: '200px',
                                                    }
                                                }>
                                                {
                                                    departmentData?.map((depItem: any) => (
                                                        <div className="d-flex justify-content-between align-items-center border border-3 p-1 border-rounded my-1">
                                                            <div className='d-flex gap-2 align-items-center'>
                                                                <span
                                                                    className='bg-info'
                                                                    style={{
                                                                        display: 'block',
                                                                        width: '50px',
                                                                        height: '50px'
                                                                    }}
                                                                ></span>
                                                                <div>
                                                                    <p className='mb-0'>
                                                                        {depItem?.name}:  {depItem?.user?.full_name ?? '-'}:
                                                                    </p>
                                                                    <p className='mb-0'>
                                                                        Хизматлар: 1/0
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <button className='btn btn-success rounded-pill btn-icon btn-sm'>
                                                                3
                                                            </button>
                                                        </div>
                                                    ))
                                                }
                                            </div>

                                        </div>
                                        <div className="d-flex w-100 "
                                            style={{
                                                position: 'absolute',
                                                bottom: '0',
                                                left: 0,
                                                zIndex: 1
                                            }}

                                        >
                                            <button className='btn btn-primary w-100'
                                                onClick={() => {
                                                    Swal.fire({
                                                        title: "Ma'lumotni tasdqilaysizmi?",
                                                        showDenyButton: true,
                                                        showCancelButton: false,
                                                        confirmButtonText: 'Ha',
                                                        denyButtonText: `Yo'q`,
                                                    }).then((result) => {
                                                        if (result.isConfirmed) {
                                                            doctorResult(templateResult, 'finish')
                                                        }
                                                    })
                                                }}
                                                disabled={data?.target ? ((data?.target?.client_result?.at(-1)?.doctor_id > 0 && data?.target?.client_result?.at(-1)?.doctor_id != user?.id) ? true : false) : true}
                                            ><FaCheckCircle size={24}
                                                /> Tasdiqlash</button>
                                            <button className='btn btn-primary'
                                                onClick={() => {
                                                    let table = docregprintheader(data?.target)
                                                    let parentItem = user?.department?.department_template_item?.find((res: any) => res?.id == targetTemplate)
                                                    console.log('parentItem', parentItem);

                                                    let checkboxData = newGroupTemplateItemsByCategory(parentItem?.template)
                                                    if (parentItem?.template?.type == 'select') {
                                                        let body = docregprintselect(checkboxData, templateResult, parentItem, {
                                                            date: dateFormat(data?.target?.created_at, '/', false),
                                                            full_name: masulRegUchunFullName(data?.target?.client_result?.at(-1)?.doctor),
                                                        })
                                                        console.log('body', body);
                                                        updateIframeContentLab(`
                                            ${table}
                                            ${body}
                                         `)

                                                    } else {
                                                        let body = docregprintcheckbox(checkboxData, templateResult, parentItem, {
                                                            date: dateFormat(data?.target?.created_at, '/', false),
                                                            full_name: masulRegUchunFullName(data?.target?.client_result?.at(-1)?.doctor),
                                                        })
                                                        console.log('body', body);
                                                        updateIframeContentLab(`
                                            ${table}
                                            ${body}
                                         `)

                                                    }

                                                    handlePrintLab()
                                                }}
                                            ><FaPrint size={24} /></button>
                                        </div>

                                    </div>


                                </> : ''
                            }
                        </div>

                    </div>
                </Content >
            </div>

            <Modal centered={true} isOpen={roomModal} toggle={doctorRoomtoggle} role='dialog' size='lg' backdrop="static" keyboard={false} >
                <div className="modal-header">
                    <h1>Bosh xonalar</h1>
                </div>
                <div className="modal-body bg-grey">
                    <div className="row">

                        {
                            room?.map((item: any, index: any) => (
                                <div className="col-lg-3 col-md-4 col-sm-6 col-6 bg-white rounded p-1 my-2 "
                                    onClick={() => {
                                        setRoomTarget(item)
                                    }}

                                >
                                    <div className="card p-4 d-flex align-items-center gap-3 cursor-pointer">
                                        <p className={`bg-${roomTarget.id == item?.id ? 'success' : 'primary'} text-white p-1 rounded-pill text-center mobile_circle mb-0`}>
                                            {
                                                item?.client?.id > 0 ? `${user?.department?.letter} - ${item?.client?.client_value?.at(0)?.queue_number}` :
                                                    item?.main_room?.length > 0 ? `${item?.main_room}` : `${item?.room_type} - ${item?.room_number}`
                                            }
                                        </p>
                                        <div className="user-info">
                                            {/* <p className='fw-bold'>27.05.2024</p> */}
                                            {/* <h5 className='fw-bold mb-0'>
                                                {item?.client ? fullName(item?.client) : '-'}
                                            </h5> */}

                                        </div>
                                    </div>
                                    <div className="user-phonr">
                                        {/* <p className='fw-bold white-space'>ID: <span className='text-info'>{item?.client_item?.at(-1).id}</span> </p> */}
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="modal-footer">
                    <button className='btn btn-primary'
                        disabled={roomTarget.id > 0 ? false : true}
                        onClick={() => {
                            doctorResult(templateResult, 'start')
                        }}
                    >Band qilish</button>
                    <button className='btn btn-danger' onClick={doctorRoomtoggle}>Ortga</button>
                </div>

            </Modal>
            <PatientDiagnosisAdd
                modal={diagnosisModal}
                setModal={setDiagnosisModal}
                extraFun={(e: any) => {
                    if (e?.id) {
                        setSelectData({
                            ...selectData,
                            diagnosis: [...(selectData?.diagnosis ?? []), {
                                value: e.id,
                                label: e.name,
                                data: e
                            }]
                        })
                    }
                }}
            />
            <PatientComplaintAdd
                extraFun={(e: any) => {
                    if (e?.id) {
                        setSelectData({
                            ...selectData,
                            complaint: [...(selectData?.complaint ?? []), {
                                value: e.id,
                                label: e.name,
                                data: e
                            }]
                        })
                    }
                }}
                modal={complaintisModal}
                setModal={setComplatentModal}
            />

            {/* dorilar monoblok rejim */}
            <Modal Modal backdrop="static" fullscreen keyboard={false} centered={true} isOpen={isMonoBlock} toggle={monoblokToggle} role='dialog' className='h-100 d-block' >
                <div>

                    {/* <div className="modal-header">
                                    <h3 className="modal-title">
                                        Xizmatlar
                                    </h3>
                                </div> */}
                    <button onClick={() => {
                        setIsMonoBlock(false)
                        setMedicineItemCheck([])
                    }} type="button"
                        style={{
                            position: 'fixed',
                            top: '5px',
                            right: '5px',
                            zIndex: 1
                        }}
                        className="btn btn-danger cursor-pointer" >
                        X
                    </button>
                    <div className="modal-body"
                        style={{
                            height: `${window.innerHeight / 1.1}px`,
                            overflow: 'hidden'
                        }}
                    >
                        <div className="row ">
                            <div className="col-3 border-end border-2">
                                <h3>Dori tanlash</h3>
                                <div
                                    style={
                                        {
                                            height: `${window.innerHeight / 1.1}px`,
                                            overflow: 'auto',
                                            paddingBottom: "8rem"
                                        }
                                    }

                                >
                                    {
                                        medicineData?.map((item: any, index: number) => (
                                            <div className="d-flex align-items-center gap-2 mb-2">
                                                <button className={`m-0 btn bg-${item?.id == medicineDataTarget?.id ? 'info text-white' : 'label-secondary'}  p-3 rounded w-100 fw-bold cursor-pointer`}
                                                    onClick={() => {
                                                        // setSelectData({
                                                        //     ...selectData,
                                                        //     department_id: {
                                                        //         label: item.name,
                                                        //         value: item.id,
                                                        //         data: item
                                                        //     }
                                                        // })
                                                        setMedicineDataTarget(item)
                                                    }}
                                                >
                                                    {item?.name}
                                                </button>
                                            </div>
                                        ))
                                    }
                                </div>

                            </div>
                            <div className="col-9">
                                <h3>
                                    <label htmlFor={`${medicineDataTarget.id}-tt`} className='hover-monoblok d-flex align-items-center py-1 gap-2 cursor-pointer fw-bold'
                                        style={{
                                            fontSize: '1.3rem'
                                        }}
                                    >
                                        <input className="form-check-input"
                                            // checked={medicineItem?.filter((item: any) => item?.medicine_type_id == medicineDataTarget?.id)?.length == medicineDataTarget?.medicines.length ? true : false}
                                            type="checkbox"
                                            id={`${medicineDataTarget.id}-tt`}

                                            onChange={(e: any) => {
                                                let find = medicineItemCheck?.find((item: any) => item?.medicine_type_id == medicineDataTarget?.id)?.length == medicineDataTarget?.medicines.length
                                                if (find) {
                                                    setMedicineItemCheck(() => medicineItemCheck?.filter((target: any) => target?.medicine_type_id != medicineDataTarget?.id))
                                                } else {
                                                    setMedicineItemCheck(() => [
                                                        ...medicineItemCheck,
                                                        ...medicineDataTarget?.medicines
                                                    ])
                                                }
                                            }}
                                        />
                                        <span >
                                            Barchasi
                                        </span>
                                    </label>
                                </h3>
                                <div className="row">
                                    <div className="col-6 border-end border-4 ">
                                        <div style={
                                            {
                                                height: `${window.innerHeight / 1.1}px`,
                                                overflow: 'auto',
                                                paddingBottom: '6rem'
                                            }
                                        }
                                        >
                                            {
                                                (medicineDataTarget?.medicines ?? [])?.slice(0, 16)?.map((item: any, index: number) => {
                                                    let find = medicineItemCheck?.find((target: any) => target?.id == item.id)
                                                    return (
                                                        <div>
                                                            <label htmlFor={`${item.id}-${index}`} className='hover-monoblok d-flex align-items-center py-1 gap-2 cursor-pointer fw-bold'
                                                                style={{
                                                                    fontSize: '1.3rem'
                                                                }}
                                                            >
                                                                <input className="form-check-input"
                                                                    checked={find ? true : false}
                                                                    type="checkbox"
                                                                    id={`${item.id}-${index}`}

                                                                    onChange={(e: any) => {

                                                                        if (find) {
                                                                            setMedicineItemCheck(() => medicineItemCheck?.filter((target: any) => target?.id != item.id))
                                                                        } else {
                                                                            setMedicineItemCheck(() => [
                                                                                ...medicineItemCheck,
                                                                                item
                                                                            ])
                                                                        }
                                                                    }}
                                                                />
                                                                <span >
                                                                    {item.name}
                                                                </span>
                                                            </label>
                                                        </div>
                                                    )
                                                })
                                            }
                                            {/* {

                                                ([...groupAndLimitServices(serviceData
                                                    .filter((item: any) => selectData?.department_id?.value > 0 ? item.department.id == selectData?.department_id?.value : item.department.id == departmentData?.[0]?.id), 16, 0)])?.map((item2: any) => (
                                                        <div >
                                                            <p className='mb-0 fw-bold text-info'>{item2.type}</p>
                                                            {item2?.items.map((item: any, index: number) => (
                                                             
                                                            ))}
                                                        </div>
                                                    ))
                                            } */}
                                        </div>
                                    </div>
                                    <div className="col-6 ">
                                        <div style={
                                            {
                                                height: `${window.innerHeight / 1.1}px`,
                                                overflow: 'auto'
                                            }
                                        }
                                            className='pb-1'
                                        >
                                            {
                                                (medicineDataTarget?.medicines ?? [])?.slice(16)?.map((item: any, index: number) => {
                                                    let find = medicineItemCheck?.find((target: any) => target?.id == item.id)
                                                    return (
                                                        <div>
                                                            <label htmlFor={`${item.id}-${index}`} className='hover-monoblok d-flex align-items-center py-1 gap-2 cursor-pointer fw-bold'
                                                                style={{
                                                                    fontSize: '1.3rem'
                                                                }}
                                                            >
                                                                <input className="form-check-input"
                                                                    checked={find ? true : false}
                                                                    type="checkbox"
                                                                    id={`${item.id}-${index}`}

                                                                    onChange={(e: any) => {

                                                                        if (find) {
                                                                            setMedicineItemCheck(() => medicineItemCheck?.filter((target: any) => target?.id != item.id))
                                                                        } else {
                                                                            setMedicineItemCheck(() => [
                                                                                ...medicineItemCheck,
                                                                                item
                                                                            ])
                                                                        }
                                                                    }}
                                                                />
                                                                <span >
                                                                    {item.name}
                                                                </span>
                                                            </label>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>



                                </div>


                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button className='btn btn-primary'
                            onClick={() => {
                                setMedicineItem(() => medicineItemCheck)
                                setMedicineItemCheck([])
                                monoblokToggle()

                            }}

                        >Saqlash</button>
                    </div>
                </div>

            </Modal >
            {/* retsept monoblok rejim */}
            <Modal Modal backdrop="static" fullscreen keyboard={false} centered={true} isOpen={isMonoBlockRetsept} toggle={monoblokToggleRetsept} role='dialog' className='h-100 d-block' >
                <div>

                    {/* <div className="modal-header">
                                    <h3 className="modal-title">
                                        Xizmatlar
                                    </h3>
                                </div> */}
                    <button onClick={() => {
                        setIsMonoBlockRetsept(false)
                        setMedicineItemCheckRetsept([])
                    }} type="button"
                        style={{
                            position: 'fixed',
                            top: '5px',
                            right: '5px',
                            zIndex: 1
                        }}
                        className="btn btn-danger cursor-pointer" >
                        X
                    </button>
                    <div className="modal-body"
                        style={{
                            height: `${window.innerHeight / 1.1}px`,
                            overflow: 'hidden'
                        }}
                    >
                        <div className="row ">
                            <div className="col-3 border-end border-2">
                                <h3>Retsept tanlash</h3>
                                <div
                                    style={
                                        {
                                            height: `${window.innerHeight / 1.1}px`,
                                            overflow: 'auto',
                                            paddingBottom: "8rem"
                                        }
                                    }

                                >
                                    {
                                        medicineDataRetsept?.map((item: any, index: number) => (
                                            <div className="d-flex align-items-center gap-2 mb-2">
                                                <button className={`m-0 btn bg-${item?.id == medicineDataTargetRetsept?.id ? 'info text-white' : 'label-secondary'}  p-3 rounded w-100 fw-bold cursor-pointer`}
                                                    onClick={() => {
                                                        // setSelectData({
                                                        //     ...selectData,
                                                        //     department_id: {
                                                        //         label: item.name,
                                                        //         value: item.id,
                                                        //         data: item
                                                        //     }
                                                        // })
                                                        setMedicineDataTargetRetsept(item)
                                                    }}
                                                >
                                                    {item?.name}
                                                </button>
                                            </div>
                                        ))
                                    }
                                </div>

                            </div>
                            <div className="col-9">
                                <h3>
                                    <label htmlFor={`${medicineDataTargetRetsept.id}-tt`} className='hover-monoblok d-flex align-items-center py-1 gap-2 cursor-pointer fw-bold'
                                        style={{
                                            fontSize: '1.3rem'
                                        }}
                                    >
                                        <input className="form-check-input"
                                            // checked={medicineItem?.filter((item: any) => item?.medicine_type_id == medicineDataTarget?.id)?.length == medicineDataTarget?.medicines.length ? true : false}
                                            type="checkbox"
                                            id={`${medicineDataTargetRetsept.id}-tt`}

                                            onChange={(e: any) => {
                                                let find = medicineItemCheckRetsept?.find((item: any) => item?.medicine_type_id == medicineDataTargetRetsept?.id)?.length == medicineDataTargetRetsept?.medicines.length
                                                if (find) {
                                                    setMedicineItemCheckRetsept(() => medicineItemCheckRetsept?.filter((target: any) => target?.medicine_type_id != medicineDataTargetRetsept?.id))
                                                } else {
                                                    setMedicineItemCheckRetsept(() => [
                                                        ...medicineItemCheckRetsept,
                                                        ...medicineDataTargetRetsept?.medicines
                                                    ])
                                                }
                                            }}
                                        />
                                        <span >
                                            Barchasi
                                        </span>
                                    </label>
                                </h3>
                                <div className="row">
                                    <div className="col-6 border-end border-4 ">
                                        <div style={
                                            {
                                                height: `${window.innerHeight / 1.1}px`,
                                                overflow: 'auto',
                                                paddingBottom: '6rem'
                                            }
                                        }
                                        >
                                            {
                                                (medicineDataTargetRetsept?.medicines ?? [])?.slice(0, 16)?.map((item: any, index: number) => {
                                                    let find = medicineItemCheckRetsept?.find((target: any) => target?.id == item.id)
                                                    return (
                                                        <div>
                                                            <label htmlFor={`${item.id}-${index}`} className='hover-monoblok d-flex align-items-center py-1 gap-2 cursor-pointer fw-bold'
                                                                style={{
                                                                    fontSize: '1.3rem'
                                                                }}
                                                            >
                                                                <input className="form-check-input"
                                                                    checked={find ? true : false}
                                                                    type="checkbox"
                                                                    id={`${item.id}-${index}`}

                                                                    onChange={(e: any) => {

                                                                        if (find) {
                                                                            setMedicineItemCheckRetsept(() => medicineItemCheckRetsept?.filter((target: any) => target?.id != item.id))
                                                                        } else {
                                                                            setMedicineItemCheckRetsept(() => [
                                                                                ...medicineItemCheckRetsept,
                                                                                item
                                                                            ])
                                                                        }
                                                                    }}
                                                                />
                                                                <span >
                                                                    {item.name}
                                                                </span>
                                                            </label>
                                                        </div>
                                                    )
                                                })
                                            }
                                            {/* {

                                                ([...groupAndLimitServices(serviceData
                                                    .filter((item: any) => selectData?.department_id?.value > 0 ? item.department.id == selectData?.department_id?.value : item.department.id == departmentData?.[0]?.id), 16, 0)])?.map((item2: any) => (
                                                        <div >
                                                            <p className='mb-0 fw-bold text-info'>{item2.type}</p>
                                                            {item2?.items.map((item: any, index: number) => (
                                                             
                                                            ))}
                                                        </div>
                                                    ))
                                            } */}
                                        </div>
                                    </div>
                                    <div className="col-6 ">
                                        <div style={
                                            {
                                                height: `${window.innerHeight / 1.1}px`,
                                                overflow: 'auto'
                                            }
                                        }
                                            className='pb-1'
                                        >
                                            {
                                                (medicineDataTargetRetsept?.medicines ?? [])?.slice(16)?.map((item: any, index: number) => {
                                                    let find = medicineItemCheckRetsept?.find((target: any) => target?.id == item.id)
                                                    return (
                                                        <div>
                                                            <label htmlFor={`${item.id}-${index}`} className='hover-monoblok d-flex align-items-center py-1 gap-2 cursor-pointer fw-bold'
                                                                style={{
                                                                    fontSize: '1.3rem'
                                                                }}
                                                            >
                                                                <input className="form-check-input"
                                                                    checked={find ? true : false}
                                                                    type="checkbox"
                                                                    id={`${item.id}-${index}`}

                                                                    onChange={(e: any) => {

                                                                        if (find) {
                                                                            setMedicineItemCheckRetsept(() => medicineItemCheckRetsept?.filter((target: any) => target?.id != item.id))
                                                                        } else {
                                                                            setMedicineItemCheckRetsept(() => [
                                                                                ...medicineItemCheckRetsept,
                                                                                item
                                                                            ])
                                                                        }
                                                                    }}
                                                                />
                                                                <span >
                                                                    {item.name}
                                                                </span>
                                                            </label>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>



                                </div>


                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button className='btn btn-primary'
                            onClick={() => {
                                setMedicineItemRetsept(() => medicineItemCheckRetsept)
                                setMedicineItemCheckRetsept([])
                                monoblokToggleRetsept()

                            }}

                        >Saqlash</button>
                    </div>
                </div>

            </Modal >
            <iframe
                ref={iframeRef}
                srcDoc={`<html><body>${htmlCode}</body></html>`}
                style={{ display: 'none' }} // Iframeni ko'rinmas qilish
            ></iframe>
            <iframe
                ref={iframeRefLab}
                srcDoc={`<html><body>${htmlCode}</body></html>`}
                style={{ display: 'none' }} // Iframeni ko'rinmas qilish
            ></iframe>
            <iframe
                ref={iframeRefCert}
                srcDoc={`<html><body>${htmlCode}</body></html>`}
                style={{ display: 'none' }} // Iframeni ko'rinmas qilish
            ></iframe>
        </>
    )
}

export default DoctorResultCheck