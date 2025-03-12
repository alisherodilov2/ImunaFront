import React, { useEffect, useRef, useState } from 'react'
import Layout from '../../../layout/Layout'
import Navbar from '../../../layout/Navbar'
import Table from '../../../componets/table/Table'
import Input from '../../../componets/inputs/Input'
import Pagination from '../../../componets/pagination/Pagination'
import { read, utils, writeFileXLSX } from 'xlsx'
import { useDispatch, useSelector } from 'react-redux'
import { IoExit } from "react-icons/io5";
import { ReducerType } from '../../../interface/interface'
import Swal from 'sweetalert2'
import { GiExitDoor } from "react-icons/gi";
import Content from '../../../layout/Content'
import { NumericFormat } from 'react-number-format'
import { query } from '../../../componets/api/Query'
import axios from 'axios'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Select from 'react-select';
import { AppDispatch } from '../../../service/store/store'
import { isCashRegItem2, isClientAddExcelFile, isClientCurrentPage, isClientDelete, isClientGet, isClientPageLimit, isDoctorGet, isTornametClient } from '../../../service/reducer/ClientReducer'
import { isDepartmentGet } from '../../../service/reducer/DepartmentReducer'
import { exportToExcel } from '../../../helper/exportToExcel'
import { isServiceTypeGet } from '../../../service/reducer/ServiceTypeReducer'
import { isServiceGet } from '../../../service/reducer/ServiceReducer'
import { fullName, masulRegUchunFullName } from '../../../helper/fullName'
import { MdContentCopy, MdDeleteForever } from 'react-icons/md'
import { IoMdRepeat } from 'react-icons/io'
import CashRegister from '../../cash_register/CashRegister'
import { formatId } from '../../../helper/idGenerate'
import { getCurrentDateTime } from '../../../helper/dateFormat'
import { cashRegDiscount } from '../../../helper/cashRegCalc'
import GraphAdd from '../graph/GraphAdd'
import { isGraphGet } from '../../../service/reducer/GraphReducer'
import { BiCalendarCheck } from 'react-icons/bi'
import RegGraphAdd from '../graph/RegGraphAdd'
import { AiFillEdit } from 'react-icons/ai'
import { FaBoxOpen, FaHome, FaHospitalSymbol, FaPrint, FaRegPlusSquare } from 'react-icons/fa'
import { generateCheck } from '../../../helper/generateCheck'
import { chegirmaHisobla } from '../../../helper/cashRegHelper'
import { isTreatmentGet } from '../../../service/reducer/TreatmentReducer'
import { isReferringDoctorGet } from '../../../service/reducer/ReferringDoctorReducer'
import { isAdvertisementsGet } from '../../../service/reducer/AdvertisementsReducer'
import { clientTableColumn, fullRoomName, navbatGet, sortNavbat, statitionarDate, statitionarDateHome } from '../../../helper/clientHelper'
import { calculateAge } from '../../../helper/calculateAge'
import { dateFormat } from '../../../service/helper/day'
import StatsionarAdd from './StatsionarAdd'
import { findMaxGraphItem } from '../../../helper/treatmentHelper'
import TableLoader from '../../../componets/table/TableLoader'
import { formatDateMonthName, graphAChiveStatus } from '../../../helper/graphHelper'
export const use_status = [
    {
        label: 'Barchasi',
        value: ''
    },
    {
        label: 'Ambulator',
        value: 'ambulatory'
    },
    {
        label: 'Muolaja',
        value: 'treatment'
    },
    {
        label: 'uyda',
        value: 'at_home'
    }
]
const Statsionar = () => {
    const dataSelect = (data: any) => {
        let res = [...data].sort((a: any, b: any) => b.id - a.id);
        return res?.map((item: any) => {
            return {
                value: item?.id, label: item?.name || item?.type,
                data: item
            }
        })
    }
    // const iframeRef = useRef<HTMLIFrameElement | null>(null);

    const iframeRef = useRef<any>(null);
    const iframeRef2 = useRef<any>(null);
    const treatmentShow = async (person_id: any) => {
        try {
            setLoad(() => true)
            let res = await axios.get(`/graph/treatment-show?person_id=${person_id}`)
            const { result } = res.data

            setItem2({ ...(result?.graph ?? {}), ...result?.graph_archive?.person, use_status: result?.graph_archive.use_status, graph_archive_id: result?.graph_archive?.id, treatment: result?.graph_archive?.treatment, graph_archive: result?.graph_archive })
            setModal3(true)
            // setItem2({ ...result })
            // setItem({})
            // setItem(() => result)
            // setCash(() => true)
        } catch (error) {

        } finally {
            setLoad(() => false)
        }
    }

    const { graph_achive_target } = useSelector((state: ReducerType) => state.GraphReducer)
    const { departmentData, } = useSelector((state: ReducerType) => state.DepartmentReducer)
    const { user, } = useSelector((state: ReducerType) => state.ProfileReducer)
    const [modal, setModal] = useState(false)
    const [modaledit, setModaledit] = useState(false)
    const [modal2, setModal2] = useState(false)
    const [modal3, setModal3] = useState(false)
    const [item, setItem] = useState({} as any)
    const [item2, setItem2] = useState({} as any)
    const { page, clientData, massage, isLoading, isSuccess, pageLimit, cashRegModal2, cashRegItem2 } = useSelector((state: ReducerType) => state.ClientReducer)
    // const [pageLmit, setPageLimit] = useState(() => 5)
    const [numberOfPages, setNumberOfPages] = useState(Math.ceil(clientData?.data?.length / pageLimit))
    useEffect(() => {
    }, [numberOfPages])
    const [checkData, setCheckData] = useState([] as any)
    const checkFun = (item: any) => {
        let resultCheck = checkData?.find((checkItem: any) => checkItem?.id === item?.id);
        if (resultCheck) {
            return checkData.filter((checkItem: any) => checkItem?.id !== item?.id)
        }
        return [...checkData, item]
    }
    const dispatch = useDispatch<AppDispatch>()
    const deleteAll = () => {
        Swal.fire({
            title: "Ma'lumotni o'chirasizmi?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Ha',
            denyButtonText: `Yo'q`,
        }).then((result: any) => {
            if (result.isConfirmed) {
                dispatch(isClientDelete({ all: [...new Set(checkData?.map((idAll: any) => idAll?.id))] }))
                setCheckData([])
            }
        })
        // dispatch(deletedispatchFunction(id))

    }
    const [showItem, setShowItem] = useState({} as any)
    const allShow = async (id: any) => {
        try {
            setLoad(() => true)
            let res = await axios.get('/client?show_person_id=' + id)
            const { result } = res.data
            setShowItem({})
            setModaledit(true)
            setShowItem(() => {
                return {

                    ...result.data,
                    at_home: result.at_home,
                    treatment: result.treatment,
                }
            })
            // setItem(() => result)
            // setCash(() => true)
        } catch (error) {

        } finally {
            setLoad(() => false)
        }
    }

    const [serachText, setSerachText] = useState('')
    const [load, setLoad] = useState(false)
    const [data, setData] = useState({
        data: [],
        start_date: '',
        end_date: ''
    } as any)
    const doctorDataSelect = (data: any) => {
        if (data?.length > 0) {

            return data?.map((item: any) => {
                return {
                    value: item?.id, label: masulRegUchunFullName(item),
                    data: item
                }
            })
        }
        return []
    }
    const getData = async (data: any) => {
        try {
            setLoad(() => true)
            let res = await axios.get(`/client/statsianar?start_date=${data?.start_date ?? ''}&end_date=${data?.end_date ?? ''}&full_name=${data?.full_name ?? ''}&phone=${data?.phone ?? ''}&person_id=${data?.person_id ?? ''}&doctor_id=${data?.doctor?.value > 0 ? data?.doctor?.value : ''}&page=${data?.page ?? 1}&per_page=${data?.per_page ?? 5}&status=${data?.status?.length > 0 ? data?.status : ''}`)
            const { result } = res.data
            setData(() => result)
        } catch (error) {

        } finally {
            setLoad(() => false)
        }
    }
    const [search, setSearch] = useState({
        full_name: '',
        phone: '',
        person_id: '',
        probirka: '',
        data_birth: '',
        department: false
    } as any)
    const filter = (data: any, serachData: any) => {

        let response = data as any;

        if (serachData?.full_name?.trim()?.length > 0) {
            response = response?.filter((res: any) =>
                (res?.first_name)?.toString().toLowerCase().includes(serachData?.full_name?.toString().toLowerCase()) || (res?.last_name)?.toString().toLowerCase().includes(serachData?.full_name?.toString().toLowerCase())

            )
        }
        if (serachData?.phone?.trim()?.length > 0) {
            response = response?.filter((res: any) =>
                (res?.phone)?.toString().toLowerCase().includes(serachData?.phone?.toString().toLowerCase()))

        }
        if (serachData?.person_id?.trim()?.length > 0) {
            response = response?.filter((res: any) =>
                (res?.person_id)?.toString().toLowerCase().includes(serachData?.person_id?.toString().toLowerCase()))

        }
        if (+serachData?.department?.value > 0) {
            // alert('sss')
            return sortNavbat(response)

        }

        return sortNavbat(response, true)



    }
    const [show, setShow] = useState(false)
    const [roomData, setRoomData] = useState([] as any)
    const [docData, setDocData] = useState([] as any)

    const docGet = async () => {
        try {
            // setLoading(() => true)
            const res = await axios.get('/doctor')
            setDocData(() => res?.data?.result)
        }
        catch {

        }
        finally {
            // setLoading(() => false)
        }

    }
    const roomGet = async () => {
        try {
            setLoad(() => true)
            const res = await axios.get('/room/empty')
            setRoomData(() => res?.data?.result)
            setModal(true)
            setItem(() => {
                return {
                    reset: true
                }
            })
        }
        catch {

        }
        finally {
            setLoad(() => false)
        }

    }
    const { id, clienttype_id, department_id } = useParams() as any

    useEffect(() => {
        const fetchPosts = () => {
            getData(data)
            dispatch(isServiceGet(''))
            dispatch(isDepartmentGet(''))
            dispatch(isTreatmentGet(''))
            dispatch(isReferringDoctorGet(''))
            dispatch(isAdvertisementsGet(''))
            // roomGet()
            docGet()
        };
        return () => {
            fetchPosts();
        };
    }, [])
    useEffect(() => {

    }, [])
    const [cash, setCash] = useState(false as any)
    const [sendLoading, setSendLoading] = useState(false)
    const statsionarFinish = async (id: any, del?: any) => {
        try {
            setSendLoading(() => true)
            let fomrdata = new FormData()
            if (del) {
                fomrdata.append('is_delete', '1')
            }
            let res = await axios.post(`/client/statsianar-finish/${id}`, fomrdata)
            setData(() => {
                return {
                    ...data,
                    data: data?.data?.filter((item: any) => item?.id != id)
                }
            })
        } catch (error) {
        } finally {
            setSendLoading(() => false)
        }
    }
    const updateIframeContent = (content: string) => {
        const iframeDoc = iframeRef2.current?.contentDocument;
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
            .end-text{
                text-align: right;
            }
       
        table.table,
        th.table,
        td.table {
            border: 1px solid black;
            border-collapse: collapse;
        }
        table.table2,
        th.table2,
        td.table2 {
            border: 1px solid black;
            border-collapse: collapse;
        }
        table.table{
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
        if (iframeRef2.current) {
            const iframeWindow = iframeRef2.current.contentWindow;
            iframeWindow.print(); // Iframe ichidagi matnni chop qilish
        }
    };
    return (
        <Content loading={load || sendLoading} >
            <Navbar />
            <div className="container-fluid flex-grow-1 py-1 size_16 ">
                <div className="d-flex my-1 gap-3">
                    <form className='row w-100'>
                        <div className="col-3">
                            <div className="d-flex gap-2">
                                <Input type='date'
                                    disabled={load ? true : false}
                                    onChange={(e: any) => {
                                        let value = e.target.value
                                        if (value && value.length > 0) {
                                            getData({
                                                ...data,
                                                start_date: value
                                            })
                                        }
                                    }}
                                    value={data?.start_date}
                                />
                                <Input type='date'
                                    disabled={load ? true : false}
                                    min={data?.start_date} onChange={(e: any) => {
                                        let value = e.target.value
                                        if (value && value.length > 0) {
                                            getData({
                                                ...data,
                                                end_date: value
                                            })
                                        }
                                    }}
                                    value={data?.end_date}
                                />
                            </div>
                        </div>

                        <div className="col-2">
                            <Input placeholder='F.I.O Izlash...' disabled={isLoading ? true : false} onChange={(e: any) => {
                                setSearch((res: any) => {
                                    return {
                                        ...res,
                                        full_name: e.target.value?.trim().toLowerCase()
                                    }
                                })

                            }}
                                onKeyDown={
                                    (e: any) => {
                                        setSearch((res: any) => {
                                            return {
                                                ...res,
                                                full_name: e.target.value?.trim().toLowerCase()
                                            }
                                        })
                                        if (e.key === 'Enter' && e.target.value?.trim().length > 0) {
                                            setSearch((res: any) => {
                                                return {
                                                    ...res,
                                                    phone: '',
                                                    person_id: '',
                                                    data_birth: '',
                                                    doctor: false
                                                }
                                            })
                                            getData({
                                                ...data,
                                                full_name: e.target.value?.trim().toLowerCase()
                                            })
                                        }
                                    }
                                }
                                value={search?.full_name}
                            />
                        </div>
                        <div className={`col-2 ${+user?.setting?.is_reg_phone ? '' : 'd-none'}`}>
                            <Input placeholder='Telefon Izlash...' disabled={isLoading ? true : false} onChange={(e: any) => {
                                setSearch((res: any) => {
                                    return {
                                        ...res,
                                        phone: e.target.value?.trim().toLowerCase()
                                    }
                                })
                            }}
                                onKeyDown={
                                    (e: any) => {
                                        setSearch((res: any) => {
                                            return {
                                                ...res,
                                                phone: e.target.value?.trim().toLowerCase()
                                            }
                                        })
                                        if (e.key === 'Enter' && e.target.value?.trim().length > 0) {
                                            setSearch((res: any) => {
                                                return {
                                                    ...res,
                                                    full_name: '',
                                                    person_id: '',
                                                    data_birth: '',
                                                    doctor: false
                                                }
                                            })
                                            getData({
                                                ...data,
                                                phone: e.target.value?.trim().toLowerCase()
                                            })
                                        }
                                    }
                                }
                                value={search?.phone}
                            />
                        </div>
                        <div className={`col-1 ${+user?.setting?.is_reg_person_id ? '' : 'd-none'}`}>
                            <Input placeholder='ID Izlash...' disabled={isLoading ? true : false} onChange={(e: any) => {
                                setSearch((res: any) => {
                                    return {
                                        ...res,
                                        person_id: e.target.value?.trim().toLowerCase()
                                    }
                                })
                            }}
                                onKeyDown={
                                    (e: any) => {
                                        setSearch((res: any) => {
                                            return {
                                                ...res,
                                                person_id: e.target.value?.trim().toLowerCase()
                                            }
                                        })
                                        if (e.key === 'Enter' && e.target.value?.trim().length > 0) {
                                            setSearch((res: any) => {
                                                return {
                                                    ...res,
                                                    phone: '',
                                                    full_name: '',
                                                    data_birth: '',
                                                    doctor: false
                                                }
                                            })
                                            dispatch(isClientGet(`?start_date=${clientData?.start_date}&end_date=${clientData?.end_date}&person_id=${e.target.value?.trim().toLowerCase()}`))
                                        }
                                    }
                                }
                                value={search?.person_id}
                            />
                        </div>
                        {/* <div className="col-2">
                            <Input placeholder='probirka Izlash...' onChange={(e: any) => {
                                setSearch((res: any) => {
                                    return {
                                        ...res,
                                        probirka: e.target.value?.trim().toLowerCase()
                                    }
                                })
                            }}
                                value={search?.probirka}
                            />
                        </div> */}
                        <div className={`col-2 ${+user?.setting?.is_reg_data_birth ? '' : 'd-none'}`}>
                            <Input type='date' disabled={isLoading ? true : false} onChange={(e: any) => {
                                setSearch((res: any) => {
                                    return {
                                        ...res,
                                        data_birth: e.target.value
                                    }
                                })
                            }}
                                onKeyDown={
                                    (e: any) => {
                                        setSearch((res: any) => {
                                            return {
                                                ...res,
                                                data_birth: e.target.value
                                            }
                                        })
                                        if (e.key === 'Enter' && e.target.value?.trim().length > 0) {
                                            setSearch((res: any) => {
                                                return {
                                                    ...res,
                                                    phone: '',
                                                    person_id: '',
                                                    full_name: '',
                                                    doctor: false,

                                                }
                                            })
                                            dispatch(isClientGet(`?start_date=${clientData?.start_date}&end_date=${clientData?.end_date}&data_birth=${e.target.value?.trim().toLowerCase()}`))
                                        }
                                    }
                                }
                                value={search?.data_birth}
                            />
                        </div>

                        <div className="col-4">
                            <Select
                                name='name'
                                isDisabled={load ? true : false}
                                value={search?.doctor}
                                placeholder='Doktor Izlash...'
                                onChange={(e: any) => {
                                    setSearch((res: any) => {
                                        return {
                                            ...res,
                                            phone: '',
                                            person_id: '',
                                            data_birth: '',
                                            full_name: '',
                                            doctor: e
                                        }
                                    })
                                    getData({
                                        ...data,
                                        doctor: e
                                    })

                                }}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                options={
                                    [
                                        {
                                            label: 'Barchasi',
                                            value: '',
                                        },

                                        ...doctorDataSelect(docData)
                                    ]
                                } />
                        </div>
                        <div className={`col-2 `}>
                            <Select
                                isDisabled={isLoading ? true : false}
                                name='name'
                                onChange={(e: any) => {
                                    setSearch((res: any) => {
                                        return {
                                            ...res,
                                            phone: '',
                                            person_id: '',
                                            data_birth: '',
                                            full_name: '',
                                            department: false
                                        }
                                    })
                                    getData({
                                        ...data,
                                        status: e.value
                                    })
                                }}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                options={
                                    [

                                        {
                                            label: 'Bugun',
                                            value: 'today'
                                        },
                                        {
                                            label: 'Yakunlangan',
                                            value: 'finish'
                                        },
                                        {
                                            label: 'Davolanishda',
                                            value: 'process'
                                        },

                                    ]
                                } />
                        </div>
                    </form>
                    <div className='d-flex justify-content-center align-items-center gap-1'>
                        {
                            checkData?.length > 0 ?
                                <button className="btn btn-danger " type="button" onClick={() => {
                                    deleteAll()
                                }}>O'chirish</button> : ''
                        }
                        {/* <button className="btn btn-primary " type="button" onClick={() => {
                            setModal(true)
                            setItem(() => {
                                return {
                                    reset: true
                                }
                            })
                        }}>izlash</button> */}
                        {/* <button className='btn btn-success btn-sm'
                            onClick={() => {
                                setModal3(true)
                                setItem(() => {
                                    return {
                                        reset: false,
                                    }
                                })
                            }}
                        >
                            <BiCalendarCheck size={24} />
                        </button> */}
                        {
                            user?.role == 'director' ? '' : <button className="btn btn-primary " type="button" onClick={() => {
                                roomGet()
                            }}>Qoshish</button>
                        }

                    </div>
                </div>
                <div className="card" style={{
                    height: `${window.innerHeight / 1.4}px`,
                    overflow: 'auto'
                }}>
                    <table className="table table-bordered " >
                        <thead>
                            <tr>
                                <th>№</th>
                                <th>F.I.SH</th>
                                <th>Shifokor</th>
                                <th>Xona</th>
                                {/* <th>ID</th> */}
                                {/* <th>Telefon</th> */}
                                {/* <th>Yoshi</th> */}
                                {
                                    load ? '' :

                                        data?.data?.length > 0 ?
                                            Array.from({ length: Math.max(...data?.data?.map((item: any) => statitionarDateHome(item, user?.graph_format_date)?.length)) }).map((item: any, index: any) => {
                                                return (
                                                    <th>{index + 1}-kun</th>
                                                )
                                            }) : <th>
                                                1-kun
                                            </th>
                                }


                                <th className='d-flex justify-content-between align-items-center'>
                                    <span>Holati</span>

                                    <button type="button" className="btn btn-sm  btn-primary" onClick={() => {
                                        getData(data)

                                    }}>
                                        <i className="tf-icons bx bx-reset" />
                                    </button>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                load ? <tr>
                                    <td colSpan={5}>
                                        <div className='bg-white rounded p-1 text-center d-flex  align-items-center gap-3 justify-content-center'>
                                            <TableLoader />
                                            <h4 className='mb-0'>Yuklanmoqda</h4>
                                        </div>
                                    </td>
                                </tr>
                                    :
                                    data?.data?.length > 0 ? data?.data?.map((item: any, index: any) => {
                                        return (
                                            <tr>
                                                <td>{index + 1}</td>

                                                <td className='p-1 cursor-pointer' onClick={() => {
                                                    // allShow(item?.person_id)
                                                }}
                                                >
                                                    <span className='register_date'>
                                                        S{formatId(item?.person_id)}
                                                    </span>
                                                    <br />
                                                    <b>

                                                        {fullName(item)}
                                                    </b>
                                                    <br />
                                                    <span className='text-info register_date'  >
                                                        {/* {getCurrentDateTime(item?.client_item.at(-1).created_at)} */}
                                                        {item?.admission_date}
                                                    </span>
                                                </td>

                                                <td>{masulRegUchunFullName(item?.statsionar_doctor)}</td>
                                                {/* <td>S{formatId(item?.person_id)}</td> */}
                                                <td>{fullRoomName(item?.statsionar_room)}</td>
                                                {
                                                    statitionarDateHome(item, user?.graph_format_date)?.map((res: any, index: any, resLength: any) => (
                                                        <td className={
                                                            `text-white ${item?.day_qty > 0 && resLength?.length - 1 == index ? 'bg-danger' : (+item?.is_finish_statsionar ? statitionarDateHome(item, user?.graph_format_date)?.length - 1 == index ? 'bg-info' : 'bg-success' : Date.parse(res.date) < Date.parse(user?.graph_format_date) ? 'bg-success' : 'bg-warning')
                                                            //    :
                                                            //     Date.parse(res.date) < Date.parse(user?.graph_format_date) ?  'bg-success' :
                                                            //     !item?.is_finish_statsionar
                                                            //     ? 'bg-warning' : 'bg-info'



                                                            }`
                                                        }


                                                        >
                                                            {
                                                                index == 0 ? <IoExit size={18} /> : ''
                                                            }
                                                            {
                                                                item?.day_qty > 0 && resLength?.length - 1 == index ? <GiExitDoor size={18} /> : ''
                                                            }
                                                            {res?.dayName}
                                                        </td>
                                                    ))
                                                }
                                                {
                                                    Array.from({ length: Math.abs(statitionarDateHome(item, user?.graph_format_date)?.length - Math.max(...data?.data?.map((items: any) => statitionarDateHome(items, user?.graph_format_date)?.length))) }).map((item: any, index: any) => {
                                                        return (
                                                            <td>-</td>
                                                        )
                                                    })
                                                }

                                                <td className='d-flex gap-1 align-items-center'>

                                                    <button type='button' className='btn btn-sm btn-info'
                                                        onClick={() => {
                                                            // let find = data?.client_item?.find((res: any) => res?.id == value?.client_id)
                                                            // console.log('data?.client_item', data?.client_item);
                                                            // console.log('find', find);
                                                            // let json = JSON.parse(value?.client_value_id_data ?? "[]")
                                                            // console.log(json);
                                                            // if (json?.length > 0) {
                                                            //     generateCheck({
                                                            //         target: {
                                                            //             ...find,
                                                            //             client_value: find?.client_value?.filter((res: any) => new Set(json).has(res?.id)),
                                                            //         },
                                                            //         iframeRef: iframeRef,
                                                            //         name: user?.owner?.name,
                                                            //         client_time: value?.client_time_archive,
                                                            //         user: user
                                                            //     })
                                                            // }
                                                            generateCheck({
                                                                target: item,
                                                                iframeRef: iframeRef,
                                                                name: user?.owner?.name,
                                                                client_time: item?.client_time_archive,
                                                                user: user
                                                            })

                                                        }}>
                                                        chek <FaPrint />
                                                    </button>
                                                    <>


                                                    </>
                                                    {

                                                        user?.role == 'director' ? '' :
                                                            !item?.is_finish_statsionar ? <button className={`btn btn-sm btn-${+item?.is_finish_statsionar ? 'success' : 'warning'}`}
                                                                disabled={+item?.is_finish_statsionar ? true : false}
                                                                onClick={() => {
                                                                    statsionarFinish(item?.id)
                                                                }}

                                                            >
                                                                {+item?.is_finish_statsionar ? 'Yakunlandi' : 'Yakunlash'}
                                                            </button> : <button className={`btn btn-sm btn-success`}

                                                                onClick={() => {
                                                                    let dayQty = statitionarDate(item, user?.graph_format_date)?.length
                                                                    let table = `
                                                                               <table class="table">
        <tr class="table">
            <td class="table">Mijozning F.I.SH</td>
            <td class="table">${fullName(item)}</td>
            <td class="table"
            rowspan="2"
            colspan="2" 
            >TEKSHIRUV
                <br>
                NATIJALARI
            </td>
        </tr>
        <tr class="table">
            <td class="table">
                Tug'ilgan yili
            </td>
            <td class="table">
                ${item?.data_birth}
            </td>
        </tr>
        <tr class="table">
            <td class="table">
                Kelgan sanasi
            </td class="table">
            <td class="table">
                ${getCurrentDateTime(item?.admission_date)}
            </td class="table">
            <td class="table">Namuna</td>
            <td class="table">0</td>
        </tr>
        <tr class="table">
            <td class="table">
                Manzil
            </td>
            <td class="table">-</td>
            <td class="table">ID</td>
            <td class="table">S${formatId(item?.person_id)}</td>
        </tr>
    </table>
                                                                                
                                                                                `

                                                                    let xizmatlar_list = '';
                                                                    let index = 0;
                                                                    for (let key of item?.client_value) {
                                                                        xizmatlar_list += `<tr class="table2">
                                                              
                                                                    <td class="table2">${index + 1}</td>
                                                                    <td class="table2">${key?.service?.name}</td>
                                                                    <td class="table2">${key?.qty}</td>
                                                                    <td class="table2">${key?.price}</td>
                                                                    <td class="table2">${key?.total_price}</td>
                                                                    <td class="table2">${getCurrentDateTime(key?.created_at)}</td>
                                                                          </tr>
                                                                    `
                                                                        index += 1
                                                                    }


                                                                    let xizmatlar = `
                                                                    
                                                                        <table class="table2">
        <tr class="table2">
                <td class="table2">
                    №
                </td>
                <td class="table2">
                    Xizmat turi
                </td>
                <td class="table2">Miqdori</td>
                <td class="table2">Narxi</td>
                <td class="table2">Umumiy</td>
                <td class="table2">Sana</td>
            </tr>
            <tr class="table2">
            ${xizmatlar_list}
                <td class="table2">
                    O'rin
                </td>
                <td class="table2">
                   ${fullRoomName(item?.statsionar_room)}
                </td>
                <td class="table2">${dayQty}</td>
                <td class="table2">${item?.statsionar_room?.price}</td>
                <td class="table2">${item?.statsionar_room?.price.replace(/,/g, '') * dayQty}</td>
                <td class="table2">${item?.admission_date}</td>
            </tr>
            <tr>
            <td colspan="3" class="end-text">
            Jami to'lov:
            </td>
             <td>
            ${+item?.total_price - +(item?.discount ?? 0) + +item?.statsionar_room_price * dayQty}
            </td>
            </tr>
            <tr>
            <td colspan="3" class="end-text">
        Oldindan to'lov:
            </td>
             <td>
          0
            </td>
            </tr>
            <tr>
            <td colspan="3" class="end-text">
      Qarz:	
            </td>
             <td>
          ${(item?.total_price - item?.discount) + +((item?.statsionar_room_price * dayQty) - +(item?.statsionar_room_discount <= 100 ? ((item?.statsionar_room_price * dayQty) / 100) * item?.statsionar_room_discount : +item?.statsionar_room_discount)) - (+item?.pay_total_price + +item?.statsionar_room_price_pay)}
            </td>
            </tr>
            <tr>
            <td colspan="3" class="end-text">
          Chegirma:	
            </td>
             <td>
          ${+item?.discount + +((item?.statsionar_room_price * dayQty) - (item?.statsionar_room_discount <= 100 ? ((item?.statsionar_room_price * dayQty) / 100) * item?.statsionar_room_discount : +item?.statsionar_room_discount))}
            </td>
            </tr>
    </table>
                                                                    `


                                                                    updateIframeContent(`
                                                                                ${table} 
                                                                                <br/>
                                                                                ${xizmatlar}
                                                                                <h4 style="text-align: center;"></h4>
                                                                               `)
                                                                    // setHtmlCode(() => res.data)
                                                                    // if (iframeRef.current) {
                                                                    //     const iframeWindow = iframeRef.current.contentWindow;
                                                                    //     iframeWindow.print(); // Iframe ichidagi matnni chop qilish
                                                                    // }
                                                                    handlePrint()
                                                                }}

                                                            >
                                                                <FaPrint />
                                                            </button>
                                                    }



                                                    {
                                                        user?.role == 'director' ? '' : <>
                                                            <button className='btn btn-primary btn-sm'
                                                                // disabled={+item?.is_finish_statsionar ? true : false}
                                                                onClick={() => {
                                                                    setModal(true)
                                                                    setItem(() => {
                                                                        return {
                                                                            ...item,
                                                                            balance: item?.balance?.balance
                                                                        }
                                                                    })
                                                                }}
                                                            >
                                                                <FaRegPlusSquare />
                                                            </button>
                                                            <button className=" btn btn-sm btn-danger"
                                                                type='button'

                                                                // disabled={data?.id > 0 ? (data?.client_value?.find((res: any) => res?.service_id == item?.service_id) ? true : false) : false}
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
                                                                            statsionarFinish(item?.id, 1)
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


                                                        </>
                                                    }
                                                </td>

                                            </tr>
                                        )
                                    }) :
                                        <tr>
                                            <td colSpan={6} >
                                                <div className='bg-white rounded p-1 text-center d-flex  align-items-center gap-3 justify-content-center'>
                                                    <FaBoxOpen size={44} />
                                                    <h4 className='mb-0'>Malumot topilmadi</h4>
                                                </div>
                                            </td>
                                        </tr>
                            }

                        </tbody>



                    </table>
                </div>
                <br />
                {
                    load ? '' :
                        <Pagination
                            setPageLimit={(e: any) => {
                                // setNumberOfPages(Math.ceil(clientData?.length / e))
                                // setPageLimit(e)
                                // dispatch(isClientCurrentPage(1))
                                // dispatch(isClientPageLimit(e))

                                // dispatch(isClientGet(`?start_date=${clientData?.start_date}&end_date=${clientData?.end_date}&data_birth=${search?.data_birth}&full_name=${search?.full_name}&person_id=${search?.person_id}&status=${clientData?.use_status}&phone=${search?.phone}&page=${1}&per_page=${e}&department_id=${search?.department_id ?? ''}`))
                                getData({
                                    ...data,
                                    per_page: e,
                                    page: 1
                                })
                            }}

                            pageLmit={data?.per_page}
                            current={data?.current_page} total={data?.last_page} count={(e: any) => {

                                // dispatch(isClientGet(`?start_date=${clientData?.start_date}&end_date=${clientData?.end_date}&data_birth=${search?.data_birth}&full_name=${search?.full_name}&person_id=${search?.person_id}&status=${clientData?.use_status}&phone=${search?.phone}&page=${e}&per_page=${clientData?.per_page}&department_id=${search?.department_id ?? ''}`))
                                getData({
                                    ...data,
                                    per_page: clientData?.per_page,
                                    page: e
                                })
                            }} />
                }
            </div>
            {
                modal ?
                    <StatsionarAdd
                        modal={modal} setModal={setModal}
                        setData={setItem} data={item}
                        roomData={roomData}
                        docData={docData}
                        allData={data}
                        setChangeData={setData}
                    // reRegister
                    // setExtraModalClose2={()=>{

                    //     setCash(()=>true)
                    //     setItem(()=>cashRegItem2)
                    // }}
                    /> : ''
            }
            {/* <ClientAllSetting
                modal={modaledit} setModal={setModaledit}
                setData={setShowItem} data={showItem}
                graph={true}
                clientAddModal={setModal}
                clientItem={setItem}
                reRegister={true}

            />
            <ClientAllShow
                modal={show} setModal={setShow}
                data={item} /> */}

            {/* {
                +user?.is_cash_reg ?
                    <CashRegister
                        modal={cashRegModal2 || cash} setModal={setCash}
                        data={item?.id > 0 ? item : cashRegItem2} setData={setItem} /> : ''
            } */}


            <RegGraphAdd
                modal={modal3} setModal={setModal3}
                setData={setItem2} data={item2} />
            <iframe ref={iframeRef} style={{ display: 'none' }} title="print-frame" />
            <iframe ref={iframeRef2} style={{ display: 'none' }} title="print-frame" />
            {/* <iframe
                ref={iframeRef2}
                srcDoc={`<html><body></body></html>`}
                style={{ display: 'none' }} // Iframeni ko'rinmas qilish
                title="print-frame"
            ></iframe> */}
        </Content >
    )
}

export default Statsionar