import React, { useEffect, useRef, useState } from 'react'
import Layout from '../../../layout/Layout'
import Navbar from '../../../layout/Navbar'
import Table from '../../../componets/table/Table'
import Input from '../../../componets/inputs/Input'
import Pagination from '../../../componets/pagination/Pagination'
import { read, utils, writeFileXLSX } from 'xlsx'
import { useDispatch, useSelector } from 'react-redux'
import { ReducerType } from '../../../interface/interface'
import Swal from 'sweetalert2'
import Content from '../../../layout/Content'
import { NumericFormat } from 'react-number-format'
import { query } from '../../../componets/api/Query'
import axios from 'axios'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Select from 'react-select';
import { AppDispatch } from '../../../service/store/store'
import { isAddAllDebtClient, isClientAddExcelFile, isClientCurrentPage, isClientDelete, isClientGet, isClientPageLimit, isDeleteAllDebtClient, isTornametClient } from '../../../service/reducer/ClientReducer'
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
import { isGraphGet } from '../../../service/reducer/GraphReducer'
import { BiCalendarCheck } from 'react-icons/bi'
import { AiFillEdit } from 'react-icons/ai'
import { FaRegPlusSquare } from 'react-icons/fa'
import { generateCheck } from '../../../helper/generateCheck'
import { chegirmaHisobla } from '../../../helper/cashRegHelper'
import { isTreatmentGet } from '../../../service/reducer/TreatmentReducer'
import { isReferringDoctorGet } from '../../../service/reducer/ReferringDoctorReducer'
const AllClient = () => {
    const dataSelect = (data: any) => {
        let res = [...data].sort((a: any, b: any) => b.id - a.id);
        return res?.map((item: any) => {
            return {
                value: item?.id, label: item?.name || item?.type,
                data: item
            }
        })
    }
    const { debtClientData } = useSelector((state: ReducerType) => state.ClientReducer)
    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const [data, setData] = useState({
        data: [],
        start_date: '',
        end_date: ''
    } as any)
    // const dispatch = useDispatch<AppDispatch>()
    const clientAllData = async (data: any) => {
        try {
            setLoad(() => true)
            dispatch(isAddAllDebtClient({}))

            let res = await axios.get(`/client/counterparty-all-client?start_date=${data?.start_date ?? ''}&end_date=${data?.end_date ?? ''}&full_name=${data?.full_name ?? ''}&phone=${data?.phone ?? ''}&all=${data?.all ?? '0'}&page=${data?.current_page ?? 1}&per_page=${data?.per_page ?? 50}&branch_id=${data?.branch?.value ?? ''}`)
            const { result } = res.data
            // setData(() => result)
            dispatch(isAddAllDebtClient(result))
        } catch (error) {

        } finally {
            setLoad(() => false)
        }
    }
    const treatmentShow = async (person_id: any) => {
        try {
            setLoad(() => true)
            let res = await axios.get(`/graph/treatment-show?person_id=${person_id}`)
            const { result } = res.data

            setItem2({ ...(result?.graph ?? {}), ...result?.graph_archive?.person, use_status: 'treatment', graph_archive_id: result?.graph_archive?.id, treatment: result?.graph_archive?.treatment })
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
    const { user, } = useSelector((state: ReducerType) => state.ProfileReducer)
    const [modal, setModal] = useState(false)
    const [modaledit, setModaledit] = useState(false)
    const [modal2, setModal2] = useState(false)
    const [modal3, setModal3] = useState(false)
    const [item, setItem] = useState({} as any)
    const [item2, setItem2] = useState({} as any)
    const { page, clientData, massage, isLoading, isSuccess, pageLimit } = useSelector((state: ReducerType) => state.ClientReducer)
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

    const allShow = async (id: any) => {
        try {
            setLoad(() => true)
            let res = await axios.get('/client?show_person_id=' + id)
            const { result } = res.data
            setItem({})
            setModaledit(true)
            setItem(() => {
                return {

                    ...result
                }
            })
            setItem(() => result)
            // setCash(() => true)
        } catch (error) {

        } finally {
            setLoad(() => false)
        }
    }

    const [serachText, setSerachText] = useState('')
    const [load, setLoad] = useState(false)
    const orderShow = async (id: any) => {
        try {
            setLoad(() => true)
            let res = await axios.get('/?client_id=' + id)
            const { result } = res.data
            setItem2(() => result)

            setModal2(() => true)
        } catch (error) {

        } finally {
            setLoad(() => false)
        }
    }
    const [search, setSearch] = useState({
        full_name: '',
        ref_full_name: '',
        phone: '',
        person_id: '',
        probirka: '',
        data_birth: '',
        branch: user?.branch?.at(0)
    } as any)
    const filter = (data: any, serachData: any) => {
        let response = data as any
        if (serachData?.full_name?.trim()?.length > 0) {
            response = response?.filter((res: any) =>
                (res?.first_name)?.toString().toLowerCase().includes(serachData?.full_name?.toString().toLowerCase()) || (res?.last_name)?.toString().toLowerCase().includes(serachData?.full_name?.toString().toLowerCase())

            )
        }
        if (serachData?.phone?.trim()?.length > 0) {
            response = response?.filter((res: any) =>
                (res?.phone)?.toString().toLowerCase().includes(serachData?.phone?.toString().toLowerCase()))

        }
        if (serachData?.ref_full_name?.trim()?.length > 0) {
            response = response?.filter((res: any) =>
                (`${res?.referring_doctor?.first_name} ${res?.referring_doctor?.last_name}`)?.toString().toLowerCase().includes(serachData?.ref_full_name?.toString().toLowerCase()))

        }
        // if (serachData?.full_name?.length > 0 && serachData?.phone?.length == 0 && serachData?.person_id?.length == 0 && serachData?.probirka?.length == 0 && serachData?.data_birth?.length == 0) {
        //     return data.filter((item: any) => fullName(item)?.toString().toLowerCase().includes(serachData?.full_name?.toString().toLowerCase()))
        // }
        // if (serachData?.full_name?.length > 0 && serachData?.phone?.length > 0 && serachData?.person_id?.length == 0 && serachData?.probirka?.length == 0 && serachData?.data_birth?.length == 0) {
        //     return data.filter((item: any) =>
        //         fullName(item)?.toString().toLowerCase().includes(serachData?.full_name?.toString().toLowerCase())
        //         && item?.phone?.toString().toLowerCase().includes(serachData?.phone?.toString().toLowerCase())
        //     )

        // }
        // if (serachData?.full_name?.length > 0 && serachData?.phone?.length > 0 && serachData?.person_id?.length > 0 && serachData?.probirka?.length == 0 && serachData?.data_birth?.length == 0) {
        //     return data.filter((item: any) =>
        //         fullName(item)?.toString().toLowerCase().includes(serachData?.full_name?.toString().toLowerCase())
        //         && item?.phone?.toString().toLowerCase().includes(serachData?.phone?.toString().toLowerCase())
        //         && item?.person_id?.toString().toLowerCase().includes(serachData?.person_id?.toString().toLowerCase())
        //     )

        // }
        // if (serachData?.full_name?.length > 0 && serachData?.phone?.length > 0 && serachData?.person_id?.length > 0 && serachData?.probirka?.length > 0 && serachData?.data_birth?.length == 0) {
        //     return data.filter((item: any) =>
        //         fullName(item)?.toString().toLowerCase().includes(serachData?.full_name?.toString().toLowerCase())
        //         && item?.phone?.toString().toLowerCase().includes(serachData?.phone?.toString().toLowerCase())
        //         && item?.person_id?.toString().toLowerCase().includes(serachData?.person_id?.toString().toLowerCase())
        //         && item?.probirka_count?.toString().toLowerCase().includes(serachData?.probirka?.toString().toLowerCase())
        //     )

        // }
        // if (serachData?.full_name?.length > 0 && serachData?.phone?.length > 0 && serachData?.person_id?.length > 0 && serachData?.probirka?.length > 0 && serachData?.data_birth?.length > 0) {
        //     return data.filter((item: any) =>
        //         fullName(item)?.toString().toLowerCase().includes(serachData?.full_name?.toString().toLowerCase())
        //         && item?.phone?.toString().toLowerCase().includes(serachData?.phone?.toString().toLowerCase())
        //         && item?.person_id?.toString().toLowerCase().includes(serachData?.person_id?.toString().toLowerCase())
        //         && item?.probirka_count?.toString().toLowerCase().includes(serachData?.probirka?.toString().toLowerCase())
        //         && Date.parse(item?.data_birth) === Date.parse(serachData?.data_birth)
        //     )
        // }

        // if (serachData?.full_name?.length == 0 && serachData?.phone?.length > 0 && serachData?.person_id?.length == 0 && serachData?.probirka?.length == 0 && serachData?.data_birth?.length == 0) {
        //     return data.filter((item: any) =>
        //         item?.phone?.toString().toLowerCase().includes(serachData?.phone?.toString().toLowerCase())
        //     )
        // }
        // if (serachData?.full_name?.length == 0 && serachData?.phone?.length == 0 && serachData?.person_id?.length > 0 && serachData?.probirka?.length == 0 && serachData?.data_birth?.length == 0) {
        //     return data.filter((item: any) =>
        //         item?.person_id?.toString().toLowerCase().includes(serachData?.person_id?.toString().toLowerCase())
        //     )
        // }
        // if (serachData?.full_name?.length == 0 && serachData?.phone?.length == 0 && serachData?.person_id?.length == 0 && serachData?.probirka?.length > 0 && serachData?.data_birth?.length == 0) {
        //     return data.filter((item: any) =>
        //         item?.probirka_count?.toString().toLowerCase().includes(serachData?.probirka?.toString().toLowerCase())
        //     )
        // }
        // if (serachData?.full_name?.length == 0 && serachData?.phone?.length == 0 && serachData?.person_id?.length == 0 && serachData?.probirka?.length == 0 && serachData?.data_birth?.length > 0) {
        //     return data.filter((item: any) =>
        //         Date.parse(item?.data_birth) === Date.parse(serachData?.data_birth)
        //     )
        // }

        // if (serachData?.full_name?.length == 0 && serachData?.phone?.length > 0 && serachData?.person_id?.length > 0 && serachData?.probirka?.length == 0 && serachData?.data_birth?.length == 0) {
        //     return data.filter((item: any) =>
        //         item?.phone?.toString().toLowerCase().includes(serachData?.phone?.toString().toLowerCase())
        //         && item?.person_id?.toString().toLowerCase().includes(serachData?.person_id?.toString().toLowerCase())
        //     )
        // }
        // if (serachData?.full_name?.length == 0 && serachData?.phone?.length > 0 && serachData?.person_id?.length == 0 && serachData?.probirka?.length > 0 && serachData?.data_birth?.length == 0) {
        //     return data.filter((item: any) =>
        //         item?.phone?.toString().toLowerCase().includes(serachData?.phone?.toString().toLowerCase())
        //         && item?.probirka_count?.toString().toLowerCase().includes(serachData?.probirka?.toString().toLowerCase())
        //     )
        // }
        // if (serachData?.full_name?.length == 0 && serachData?.phone?.length > 0 && serachData?.person_id?.length == 0 && serachData?.probirka?.length == 0 && serachData?.data_birth?.length > 0) {
        //     return data.filter((item: any) =>
        //         item?.phone?.toString().toLowerCase().includes(serachData?.phone?.toString().toLowerCase())
        //         && Date.parse(item?.data_birth) === Date.parse(serachData?.data_birth)
        //     )
        // }
        return response;
        // return Array.isArray(data) ? [...data].sort((a: any, b: any) => {
        //     const dateA = a ? Date.parse(a.client_item?.at(-1)) : 0;
        //     const dateB = b ? Date.parse(b.client_item?.at(-1)) : 0;
        //     return dateA - dateB;
        // }) : [];


        // if (serachData?.clienttype?.value === 'all' && serachData?.department?.value === 'all' && serachData.text === '') {
        //     return data
        // }
        // if (serachData?.clienttype?.value !== 'all' && serachData?.department?.value === 'all' && serachData.text === '') {
        //     return data.filter((item: any) => item.clienttype.id === serachData?.clienttype?.value)
        // }
        // if (serachData?.clienttype?.value === 'all' && serachData?.department?.value !== 'all' && serachData.text === '') {
        //     return data.filter((item: any) => item.department.id === serachData?.department?.value)
        // }
        // if (serachData?.clienttype?.value !== 'all' && serachData?.department?.value !== 'all' && serachData.text === '') {
        //     return data.filter((item: any) => item.clienttype.id === serachData?.clienttype?.value && item.department.id === serachData?.department?.value)
        // }
        // if (serachData?.clienttype?.value === 'all' && serachData?.department?.value === 'all' && serachData.text !== '') {
        //     return data.filter((item: any) => (item?.name?.toString().toLowerCase().includes(serachData.text)))
        // }
        // if (serachData?.clienttype?.value === 'all' && serachData?.department?.value !== 'all' && serachData.text !== '') {
        //     return data.filter((item: any) => item.department.id === serachData?.department?.value && (item?.name?.toString().toLowerCase().includes(serachData.text)))
        // }
        // if (serachData?.clienttype?.value !== 'all' && serachData?.department?.value === 'all' && serachData.text !== '') {
        //     return data.filter((item: any) => item.clienttype.id === serachData?.clienttype?.value && (item?.name?.toString().toLowerCase().includes(serachData.text)))
        // }

        // if (serachData?.clienttype?.value !== 'all' && serachData?.department?.value !== 'all' && serachData.text !== '') {
        //     return data.filter((item: any) => item.department.id === serachData?.department?.value && item.clienttype.id === serachData?.clienttype?.value && (item?.name?.toString().toLowerCase().includes(serachData.text)))
        // }


    }
    const [show, setShow] = useState(false)

    const { id, clienttype_id, department_id } = useParams() as any
    useEffect(() => {
        // if ((department_id && +department_id > 0) && (clienttype_id && +clienttype_id > 0)) {
        //     dispatch(isClientGet(`?department_id=${department_id}&clienttype_id=${clienttype_id}`))
        // } else {
        //     dispatch(isClientGet(''))
        // }
        // console.log('graph_achive_target', graph_achive_target);


        // dispatch(isServiceGet(''))
        // dispatch(isGraphGet(''))
        // dispatch(isDepartmentGet(''))
        // dispatch(isTreatmentGet(''))
        // dispatch(isReferringDoctorGet(''))
        clientAllData(data)


    }, [])
    useEffect(() => {

    }, [])
    const [sendLoad, setSendLoad] = useState(false)
    const directorDelete = async (id: any) => {
        try {
            setSendLoad(() => true)
            const res = await axios.delete(`/client/director-delete/${id}`)
            const { result } = res.data
            if (result) {
                dispatch(isDeleteAllDebtClient(result?.data))
            }
        }
        catch (error) {
            console.log(error);
        }
        finally {
            setSendLoad(() => false)
        }

    }
    const [cash, setCash] = useState(false)
    return (
        <Content loading={sendLoad} >
            <br />
            <Navbar />
            <div className="container-fluid flex-grow-1 py-1 size_16 ">
                <div className="my-1 ">
                    <form className='row w-auto w-lg-100'>
                        <div className={`${user?.is_main_branch ? 'd-none' : 'col-lg-3 col-12 my-2'}`}>
                            <Select
                                name='name'
                                value={search?.branch}
                                onChange={(e: any) => {
                                    setSearch((res: any) => {
                                        return {
                                            ...res,
                                            phone: '',
                                            ref_full_name: '',
                                            full_name: '',
                                            person_id: '',
                                            data_birth: '',
                                            department: false,
                                            branch: e,
                                        }
                                    })
                                    clientAllData({
                                        ...debtClientData,
                                        branch: e,
                                        start_date: '',
                                        end_date: ''
                                    })
                                    // setSearch((res: any) => {
                                    //     return {
                                    //         ...res,
                                    //         branch: e,
                                    //         all: false,
                                    //         client_status: '',
                                    //         is_today: false
                                    //     }
                                    // })
                                    // dispatch(isStatisticaGet(`?branch_id=${e?.value ?? ''}`))

                                    // dispatch(isGraphGet(`?year=${graphData?.current_year?.value ?? ''}&month=${e?.value ?? ''}&department_id=${graphData?.department?.value ?? ''}`))
                                }}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                options={
                                    [
                                        {
                                            value: 'all',
                                            label: 'Barcha filallar'
                                        },
                                        ...(user?.branch ?? [])
                                    ]
                                } />
                        </div>
                        <div className=" col-lg-3 col-12 my-2">
                            <div className="d-flex gap-2">
                                <Input type='date'
                                    disabled={load ? true : false}
                                    onChange={(e: any) => {
                                        let value = e.target.value
                                        setSearch((res: any) => {
                                            return {
                                                ...res,
                                                phone: '',
                                                ref_full_name: '',
                                                full_name: '',
                                                person_id: '',
                                                data_birth: '',
                                                department: false
                                            }
                                        })
                                        if (value && value.length > 0) {
                                            clientAllData({
                                                ...debtClientData,
                                                branch: search?.branch,
                                                start_date: value,
                                            })
                                        }
                                    }}
                                    value={debtClientData?.start_date}
                                />
                                <Input type='date'
                                    disabled={load ? true : false}
                                    min={debtClientData?.start_date} onChange={(e: any) => {
                                        let value = e.target.value
                                        setSearch((res: any) => {
                                            return {
                                                ...res,
                                                ref_full_name: '',
                                                phone: '',
                                                full_name: '',
                                                person_id: '',
                                                data_birth: '',
                                                department: false
                                            }
                                        })
                                        if (value && value.length > 0) {
                                            clientAllData({
                                                ...debtClientData,
                                                branch: search?.branch,
                                                end_date: value
                                            })
                                        }
                                    }}
                                    value={debtClientData?.end_date}
                                />
                            </div>
                        </div>

                        <div className=" col-lg-2 col-12 my-2">
                            <Input placeholder='F.I.O Izlash...' disabled={load ? true : false} onChange={(e: any) => {
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
                                                    ref_full_name: '',
                                                    phone: '',
                                                    person_id: '',
                                                    data_birth: '',
                                                    department: false
                                                }
                                            })


                                            clientAllData({
                                                ...debtClientData,
                                                all: 1,
                                                branch: search?.branch,
                                                full_name: e.target.value
                                            })
                                        }
                                    }
                                }
                                value={search?.full_name}
                            />
                        </div>
                        <div className={`col-2 d-none d-lg-block my-2`}>
                            <Input placeholder='Telefon Izlash...' disabled={load ? true : false} onChange={(e: any) => {
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
                                                    ref_full_name: '',
                                                    full_name: '',
                                                    person_id: '',
                                                    data_birth: '',
                                                    department: false
                                                }
                                            })

                                            clientAllData({
                                                all: 1,
                                                ...debtClientData,
                                                branch: search?.branch,
                                                phone: e.target.value
                                            })


                                        }
                                    }
                                }
                                value={search?.phone}
                            />
                        </div>
                        <div className={`col-2 d-none d-lg-block my-2`}>
                            <Input placeholder='kounterdoktor Izlash...' disabled={load ? true : false} onChange={(e: any) => {
                                setSearch((res: any) => {
                                    return {
                                        ...res,

                                        ref_full_name: e.target.value?.trim().toLowerCase()
                                    }
                                })

                            }}
                                onKeyDown={
                                    (e: any) => {
                                        setSearch((res: any) => {
                                            return {
                                                ...res,
                                                ref_full_name: e.target.value?.trim().toLowerCase()
                                            }
                                        })
                                        if (e.key === 'Enter' && e.target.value?.trim().length > 0) {
                                            setSearch((res: any) => {
                                                return {
                                                    ...res,
                                                    full_name: '',
                                                    person_id: '',
                                                    data_birth: '',
                                                    department: false,
                                                    phone: ''
                                                }
                                            })

                                            clientAllData({
                                                all: 1,
                                                ...debtClientData,
                                                branch: search?.branch,
                                                ref_full_name: e.target.value
                                            })


                                        }
                                    }
                                }
                                value={search?.ref_full_name}
                            />
                        </div>
                    </form>
                </div>

                <div className="card" style={{
                    height: `${window.innerHeight / 1.4}px`,
                    overflow: 'auto'
                }}>
                    <Table



                        paginationRole={false}

                        isLoading={load}
                        isSuccess={true}
                        reloadData={true}
                        reloadDataFunction={() => {

                            setSearch((res: any) => {
                                return {
                                    phone: '',
                                    full_name: '',
                                    person_id: '',
                                    data_birth: '',
                                    ref_full_name: '',
                                    department: false,
                                    branch: user?.branch?.at(0)
                                }
                            })
                            clientAllData({
                                ...debtClientData,
                                start_date: '',
                                end_date: ''
                            })
                        }}
                        top={100}
                        scrollRole={true}
                        editRole={false}
                        deleteRole={false}
                        limit={pageLimit}
                        extraButtonRole={user?.role == 'director'}
                        extraButton={(data: any) => {
                            return <>
                                <button type='button' className='btn btn-sm btn-danger'
                                    onClick={() => {
                                        Swal.fire({
                                            title: "Ma'lumotni o'chirasizmi?",
                                            showDenyButton: true,
                                            showCancelButton: true,
                                            confirmButtonText: 'Ha',
                                            denyButtonText: `Yo'q`,
                                        }).then((result) => {
                                            if (result.isConfirmed) {
                                                directorDelete(data?.id)
                                            }
                                        })
                                    }}>
                                    <MdDeleteForever />
                                </button>
                            </>
                        }}
                        extraKeys={[
                            'full_name',
                            // 'phone_',
                            // 'data_birth_',
                            'service_',
                            'person_id_',
                            // 'probirka_',
                            // 'total_price',
                            // kassa

                            'debt_price_',
                            // 'qaytarilgan',
                            'dedline_date_',
                            'doc',
                            'Klinka'

                            // 'created_at_'
                        ]}

                        columns={[
                            {
                                title: '№',
                                key: 'id',
                                renderItem: (value: any, data: any) => {

                                    return <td key={data.index} className={``}>
                                        <span>
                                            {((data?.index + 1) + (page * pageLimit) - pageLimit)}
                                        </span>
                                    </td>
                                }
                            },
                            {
                                title: "F.I.O",
                                key: 'full_name',
                                renderItem: (value: any, data: any) => {
                                    return <td onClick={() => {
                                    }}>

                                        <b>{fullName(value)}</b>
                                        <br />
                                        <span className='text-info register_date'  >
                                            {getCurrentDateTime(value?.created_at)}
                                        </span>
                                    </td>
                                }
                            },
                            // {
                            //     title: 'Tel',
                            //     key: 'phone_',
                            //     render: (value: any, data: any) => {
                            //         return `+998${value.phone}`
                            //     }
                            // },
                            // {
                            //     title: 'Tugilgan sana',
                            //     key: 'data_birth_',
                            //     render: (value: any, data: any) => {
                            //         return value.data_birth
                            //     }
                            // },
                            {
                                title: 'Xizmatlar',
                                key: 'service_',
                                render: (value: any) => {
                                    let data = [] as any;
                                    let serviceId = [] as any
                                    const { client_value, client_result } = value
                                    for (let res of client_value) {
                                        if (!serviceId?.find((resItem: any) => resItem == res?.service?.id)) {
                                            data.push(<p className={
                                                `mb-1 text-white badge bg-secondary`
                                            }>
                                                {res?.service?.name}
                                            </p>)
                                            serviceId.push(res?.service?.id)
                                        }
                                    }
                                    return <div className="d-flex align-items-center gap-1 flex-wrap ">
                                        {/* {
                                            client_value?.map((res: any, index: number) => {
                                                return <p className={
                                                    `mb-1 text-white badge bg-${client_result?.find((resItem: any) => resItem?.department_id == res?.department_id && resItem?.is_check_doctor == 'finish') ? 'success' : 'secondary'}`
                                                }>
                                                    {res?.service?.name}
                                                </p>
                                            })
                                        } */}
                                        {data}
                                    </div>
                                }
                            },
                            {
                                title: 'ID',
                                key: 'person_id_',
                                render: (value: any, data: any) => {
                                    return formatId(value?.person_id)
                                }
                            },

                            {
                                title: 'Jami ',
                                key: 'debt_price_',
                                render: (value: any, data: any) => {
                                    const { total_price, pay_total_price, discount, discount_price, client_value, client_payment } = value
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={total_price} />
                                }
                            },
                            {
                                title: "To'landi ",
                                key: 'dedline_date_',
                                render: (value: any, data: any) => {
                                    const { total_price, pay_total_price, discount, discount_price, client_value, client_payment } = value
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={pay_total_price} />
                                }
                            },
                            {
                                title: "Doktor",
                                key: 'doc',
                                render: (value: any, data: any) => {
                                    const { total_price, pay_total_price, discount, discount_price, client_value, client_payment, referring_doctor } = value
                                    return <p>
                                        {referring_doctor ? fullName(referring_doctor) : '-'}
                                    </p>
                                }
                            },
                            {
                                title: "Klinka",
                                key: 'Klinka',
                                render: (value: any, data: any) => {
                                    const { owner } = value?.user ?? {}
                                    return <p>
                                        {owner?.name ?? '-'}
                                    </p>
                                }
                            },

                            // {
                            //     title: 'Qaytarilgan',
                            //     key: 'qaytarilgan',

                            //     render: (value: any, data: any) => {

                            //         const { total_price, pay_total_price, discount_price, client_payment, client_value, back_total_price } = value
                            //         let qaytarilyapdi = client_value?.reduce((a: any, b: any) => a + (+b?.is_active ? 0 : +(b.total_price - chegirmaHisobla(b))), 0)



                            //         return <NumericFormat displayType="text"
                            //             thousandSeparator
                            //             decimalScale={2}
                            //             value={back_total_price} />
                            //     }
                            // },






                        ]}
                        dataSource={
                            filter(debtClientData?.data, search)
                        }
                    />
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
                                let all = 0;
                                if (search?.full_name?.length > 0 || search?.phone?.length > 0 || search?.ref_full_name?.length > 0) {
                                    all = 1
                                } else {
                                    all = 0
                                }
                                clientAllData({
                                    all: all,
                                    per_page: e,
                                    ...debtClientData,
                                    ...search,
                                    current_page: 1
                                })

                            }}

                            pageLmit={debtClientData?.per_page}
                            current={debtClientData?.current_page} total={debtClientData?.last_page} count={(e: any) => {
                                let all = 0;
                                if (search?.full_name?.length > 0 || search?.phone?.length > 0 || search?.ref_full_name?.length > 0) {
                                    all = 1
                                } else {
                                    all = 0
                                }
                                clientAllData({
                                    all: all,
                                    per_page: debtClientData?.per_page,
                                    ...debtClientData,
                                    ...search,
                                    current_page: e
                                })

                                // dispatch(isClientGet(`?start_date=${clientData?.start_date}&end_date=${clientData?.end_date}&data_birth=${search?.data_birth}&full_name=${search?.full_name}&person_id=${search?.person_id}&status=${clientData?.use_status}&phone=${search?.phone}&page=${e}&per_page=${clientData?.per_page}&department_id=${search?.department_id ?? ''}`))
                            }} />
                }


            </div>
            <CashRegister
                modal={cash} setModal={setCash}
                data={item} setData={setItem} />
        </Content>
    )
}

export default AllClient