import React, { useEffect, useState } from 'react'
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
import { isClientAddExcelFile, isClientCurrentPage, isClientDelete, isClientGet, isClientPageLimit } from '../../../service/reducer/ClientReducer'
import { isDepartmentGet } from '../../../service/reducer/DepartmentReducer'
import { exportToExcel } from '../../../helper/exportToExcel'
import { isServiceTypeGet } from '../../../service/reducer/ServiceTypeReducer'
import { isServiceGet } from '../../../service/reducer/ServiceReducer'
import { fullName } from '../../../helper/fullName'
import { MdContentCopy } from 'react-icons/md'
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
import { addDaysToDate, clientTableColumn, statitionarDate } from '../../../helper/clientHelper'
import { calculateAge } from '../../../helper/calculateAge'
import { Modal } from 'reactstrap'
import { isPatientComplaintGet } from '../../../service/reducer/PatientComplaintReducer'
import { isPatientDiagnosisGet } from '../../../service/reducer/PatientDiagnosisReducer'
const DocClientAll = () => {
    const dataSelect = (data: any) => {
        let res = [...data].sort((a: any, b: any) => b.id - a.id);
        return res?.map((item: any) => {
            return {
                value: item?.id, label: item?.name || item?.type,
                data: item
            }
        })
    }
    const { departmentData, } = useSelector((state: ReducerType) => state.DepartmentReducer)
    const [modal, setModal] = useState(false)
    const [modaledit, setModaledit] = useState(false)
    const [modal2, setModal2] = useState(false)
    const [modal3, setModal3] = useState(false)
    const [item, setItem] = useState({} as any)
    const { user } = useSelector((state: ReducerType) => state.ProfileReducer)
    const [item2, setItem2] = useState({} as any)
    const { page, clientData, massage, isLoading, isSuccess, pageLimit } = useSelector((state: ReducerType) => state.ClientReducer)
    // const [pageLmit, setPageLimit] = useState(() => 5)
    const [numberOfPages, setNumberOfPages] = useState(Math.ceil(clientData?.data?.length / pageLimit))

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
        phone: '',
        person_id: '',
        probirka: '',
        data_birth: '',
        status: {
            label: 'Davolanishda',
            value: 'process'
        },
        diagnosis: false,
        complaint: false,
        is_statsionar: false,
        start_age: '',
        end_age: '',
        sex: ''
    } as any)
    const filter = (data: any, serachData: any) => {
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
        return data;
        // return Array.isArray(data) ? [...data].sort((a: any, b: any) => {
        //     const dateA = a?.client_item?.at(-1) ? Date.parse(a.client_item?.at(-1)) : 0;
        //     const dateB = b?.client_item?.at(-1) ? Date.parse(b.client_item?.at(-1)) : 0;
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
    const [isFilter, setIsFilter] = useState(false)
    const isFilterToggle = () => {
        setIsFilter(() => !isFilter)
    }

    const [show, setShow] = useState(false)
    const [dataLoad, setDataload] = useState(false)
    const [data, setData] = useState({
        data: []
    }) as any

    const docGet = async (target: any) => {
        try {
            setData({
                data: []
            })
            setDataload(true)
            let res = await axios.get(`/client/doctor-client-all${target}`)
            const { result } = res.data
            setData(result)
        } catch (error) {

        }
        finally {
            setDataload(false)
        }
    }
    useEffect(() => {

        const fetchPosts = () => {
            docGet('')
            dispatch(isPatientComplaintGet(''))
            dispatch(isPatientDiagnosisGet(''))
        };
        return () => {
            fetchPosts();
        };
    }, [])
    const [cash, setCash] = useState(false)
    const { patientComplaintData } = useSelector((state: ReducerType) => state.PatientComplaintReducer)
    const { patientDiagnosisData } = useSelector((state: ReducerType) => state.PatientDiagnosisReducer)
    return (
        <Content loading={load} >
            <Navbar />
            <div className="container-fluid flex-grow-1 py-1 size_16 ">
                <div className="d-flex my-1 gap-3">
                    <form className='row w-100'>
                        {/* <div className="col-2">
                            <Input type='date' onChange={(e: any) => {
                                let value = e.target.value
                                if (value && value.length > 0) {
                                    dispatch(isClientGet(`?start_date=${value}&end_date=${clientData?.end_date}`))
                                }
                            }}
                                value={clientData?.start_date}
                            />
                        </div>
                        <div className="col-2">
                            <Input type='date' min={clientData?.start_date} onChange={(e: any) => {
                                let value = e.target.value
                                if (value && value.length > 0) {
                                    dispatch(isClientGet(`?start_date=${clientData?.start_date}&end_date=${value}`))
                                }
                            }}
                                value={clientData?.end_date}
                            />
                        </div> */}
                        <div className="col-3">
                            <Input placeholder='F.I.O Izlash...' onChange={(e: any) => {
                                setSearch((res: any) => {
                                    return {
                                        ...res,
                                        full_name: e.target.value?.trim().toLowerCase()
                                    }
                                })

                            }}
                                onKeyDown={
                                    (e: any) => {
                                        if (e.key === 'Enter') {
                                            docGet(`?start_date=${clientData?.start_date}&end_date=${clientData?.end_date}&full_name=${e.target.value?.trim().toLowerCase()}&page=1&per_page=${data?.per_page}`)
                                        }
                                    }
                                }
                                value={search?.full_name}
                            />
                        </div>
                        <div className="col-2">
                            <Input placeholder='Telefon Izlash...' onChange={(e: any) => {
                                setSearch((res: any) => {
                                    return {
                                        ...res,
                                        phone: e.target.value?.trim().toLowerCase()
                                    }
                                })

                            }}
                                onKeyDown={
                                    (e: any) => {
                                        if (e.key === 'Enter') {
                                            docGet(`?start_date=${clientData?.start_date}&end_date=${clientData?.end_date}&phone=${e.target.value?.trim().toLowerCase()}&page=1&per_page=${data?.per_page}`)
                                        }
                                    }
                                }
                                value={search?.phone}
                            />
                        </div>
                        <div className="col-1">
                            <Input placeholder='ID Izlash...' onChange={(e: any) => {
                                setSearch((res: any) => {
                                    return {
                                        ...res,
                                        person_id: e.target.value?.trim().toLowerCase()
                                    }
                                })
                            }}
                                onKeyDown={
                                    (e: any) => {
                                        if (e.key === 'Enter') {
                                            docGet(`?start_date=${clientData?.start_date}&end_date=${clientData?.end_date}&person_id=${e.target.value?.trim().toLowerCase()}&page=1&per_page=${data?.per_page}`)
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
                        <div className="col-2">
                            <Input type='date' onChange={(e: any) => {
                                setSearch((res: any) => {
                                    return {
                                        ...res,
                                        data_birth: e.target.value
                                    }
                                })
                            }}
                                onKeyDown={
                                    (e: any) => {
                                        if (e.key === 'Enter') {
                                            docGet(`?start_date=${clientData?.start_date}&end_date=${clientData?.end_date}&data_birth=${e.target.value?.trim().toLowerCase()}&page=1&per_page=${data?.per_page}`)
                                        }
                                    }
                                }
                                value={search?.data_birth}
                            />
                        </div>

                    </form>
                    <div className='d-flex justify-content-center align-items-center gap-1'>
                        {
                            checkData?.length > 0 ?
                                <button className="btn btn-danger " type="button" onClick={() => {
                                    deleteAll()
                                }}>O'chirish</button> : ''
                        }
                        <button className="btn btn-primary " type="button" onClick={() => {
                            setIsFilter(true)
                        }}>izlash</button>
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
                    </div>
                </div>
                <div className="card" style={{
                    height: `${window.innerHeight / 1.4}px`,
                    overflow: 'auto'
                }}>
                    <Table


                        page={page}

                        deletedispatchFunction={isClientDelete}
                        setNumberOfPages={setNumberOfPages}
                        paginationRole={true}
                        localEditFunction={(e: any) => {
                            setItem(() => e?.client_item?.at(-1))

                            setModal(true)
                        }}
                        errorMassage={massage}
                        isLoading={dataLoad}
                        isSuccess={true}
                        reloadData={true}
                        reloadDataFunction={() => {
                            // dispatch(isClientGet('?is_payment=1'))
                            docGet('')
                        }}
                        top={100}
                        scrollRole={true}
                        editRole={false}
                        deleteRole={false}
                        limit={pageLimit}
                        showRole={false}
                        showFunction={(item: any) => {
                            setShow(true)
                            setItem(() => item.client_item)
                        }}
                        extraButtonRole={true}
                        extraButton={(item: any) => {
                            return <>

                                {/* <button className='btn btn-warning btn-sm'
                                    onClick={() => {
                                        // payShow(item?.client_item?.at(-1)?.id)
                                        setCash(() => true)
                                        setItem(() => { })
                                        setItem(() => {
                                            return {
                                                ...item?.client_item?.at(-1),
                                                pay_type: '',
                                                reset_: true

                                            }
                                        })
                                    }}
                                >
                                    tolov
                                </button> */}

                                {/* <button className='btn btn-success btn-sm'
                                    onClick={() => {
                                        const {
                                            first_name, last_name, phone, person_id, data_birth, citizenship, sex
                                        } = item?.client_item?.at(-1)
                                        setModal3(true)
                                        setItem(() => {
                                            return {
                                                first_name: first_name,
                                                last_name: last_name,
                                                phone: phone,
                                                person_id: person_id,
                                                data_birth: data_birth,
                                                citizenship: citizenship
                                                , sex: sex
                                            }
                                        })
                                    }}
                                >
                                    <BiCalendarCheck size={24} />
                                </button>
                                <button className='btn btn-warning btn-sm'
                                    onClick={() => {
                                        payShow(item?.client_item?.at(-1)?.id)
                                        // setCash(true)
                                        // setItem(() => {
                                        //     return {
                                        //         ...item?.client_item?.at(-1),
                                        //         id: 0
                                        //     }
                                        // })
                                    }}
                                >
                                    tolov
                                </button>
                                <button className='btn btn-warning btn-sm'
                                    onClick={() => {
                                        setModal(true)
                                        setItem(() => {
                                            return {
                                                ...item?.client_item?.at(-1),
                                                id: 0
                                            }
                                        })
                                    }}
                                >
                                    <IoMdRepeat size={24} />
                                </button> */}
                            </>
                        }}
                        extraKeys={[
                            'full_name',
                            // 'pass_number_',
                            'phone_',
                            'data_birth_',
                            'person_id_'
                        ]}
                        columns={[
                            {
                                title: '№',
                                key: 'id',
                                renderItem: (value: any, data: any) => {
                                    return <td key={data.index} className={` p-1 h-100`}>
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
                                        allShow(value?.person_id)
                                    }}>

                                        <b>{fullName(value)}</b>
                                        <br />
                                        <span className='text-info register_date'  >
                                            {getCurrentDateTime(value.created_at)}
                                        </span>
                                    </td>
                                }
                            },
                            // {
                            //     title: 'Pasport',
                            //     key: 'pass_number_',

                            //     render: (value: any, data: any) => {
                            //         return value.pass_number ?? '-'
                            //     }
                            // },
                            {
                                title: 'Tel',
                                key: 'phone_',
                                render: (value: any, data: any) => {

                                    return parseInt(value.phone) > 0 ? `+998${value.phone}` : '-'
                                }
                            },
                            {
                                title: 'Yoshi',
                                key: 'data_birth_',
                                render: (value: any, data: any) => {
                                    return value.data_birth == null || value.data_birth == 'null' ? '-' : calculateAge(value.data_birth, user?.graph_format_date)
                                }
                            },
                            {
                                title: 'ID',
                                key: 'person_id_',
                                render: (value: any, data: any) => {
                                    let res = value
                                    return res?.is_statsionar ? <span className='text-danger'>S{formatId(value?.person_id)}</span> : formatId(value?.person_id)
                                }
                            },

                        ]}
                        dataSource={
                            filter(data?.data, search)
                        }
                    />
                </div>
                <br />
                {
                    dataLoad ? '' :
                        <Pagination

                            setPageLimit={(e: any) => {
                                // setNumberOfPages(Math.ceil(clientData?.length / e))
                                // setPageLimit(e)
                                // dispatch(isClientCurrentPage(1))
                                // dispatch(isClientPageLimit(e))

                                docGet(`?start_date=${clientData?.start_date}&end_date=${clientData?.end_date}&data_birth=${search?.data_birth}&full_name=${search?.full_name}&person_id=${search?.person_id}&status=${clientData?.use_status}&phone=${search?.phone}&page=${1}&per_page=${e}&department_id=${search?.department_id ?? ''}`)
                            }}

                            pageLmit={data?.per_page}
                            current={data?.current_page} total={data?.last_page} count={(e: any) => {

                                docGet(`?start_date=${clientData?.start_date}&end_date=${clientData?.end_date}&data_birth=${search?.data_birth}&full_name=${search?.full_name}&person_id=${search?.person_id}&status=${search?.status}&phone=${search?.phone}&page=${e}&per_page=${data?.per_page}&department_id=${search?.department_id ?? ''}`)
                            }} />
                }
            </div>
            <CashRegister
                modal={cash} setModal={setCash}
                data={item} setData={setItem} />
            <Modal Modal backdrop="static" keyboard={false} size='lg' centered={true} isOpen={isFilter} toggle={isFilterToggle} role='dialog' >
                <div className="modal-header">
                    <div>
                        <h3 className="modal-title">
                            Filter
                        </h3>
                    </div>
                    <button onClick={() => {
                        isFilterToggle()
                        // setCheckProductItem(() => ({}) as any)
                    }} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                </div>
                <div className="modal-body">
                    <div className="row">
                        <div className="col-4 mb-1">
                            <Select
                                name='name'
                                placeholder='Shikoyat'
                                value={search?.complaint}
                                onChange={(e: any) => {
                                    setSearch((res: any) => {
                                        return {
                                            ...res,
                                            complaint: e
                                        }
                                    })
                                }}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                options={
                                    [
                                        {
                                            label: 'Hammasi',
                                            value: 'all'
                                        },
                                        ...dataSelect(patientComplaintData)
                                    ]
                                } />
                        </div>
                        <div className="col-4 mb-1">
                            <Select
                                name='name'
                                placeholder='Diagnos'
                                value={search?.diagnosis}
                                onChange={(e: any) => {
                                    setSearch((res: any) => {
                                        return {
                                            ...res,
                                            diagnosis: e
                                        }
                                    })
                                }}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                options={
                                    [
                                        {
                                            label: 'Hammasi',
                                            value: 'all'
                                        },
                                        ...dataSelect(patientDiagnosisData)
                                    ]
                                } />
                        </div>
                        <div className="col-4 mb-1">
                            <Select
                                name='name'
                                placeholder='Ambulator/Statsionar'
                                value={search?.is_statsionar}
                                onChange={(e: any) => {
                                    setSearch((res: any) => {
                                        return {
                                            ...res,
                                            is_statsionar: e
                                        }
                                    })
                                }}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                options={
                                    [
                                        {
                                            label: 'Hammasi',
                                            value: 'all'
                                        },
                                        {
                                            label: 'Ambulator',
                                            value: '0'
                                        },
                                        {
                                            label: 'Stationar',
                                            value: '1'
                                        },
                                        // ...dataSelect(departmentData)
                                    ]
                                } />
                        </div>
                        <div className="col-4 mb-1">
                            <Input required type="input" placeholder="yoshdan "
                                value={search?.start_age}
                                onChange={(e: any) => {
                                    setSearch((res: any) => {
                                        return {
                                            ...res,
                                            start_age: e.target.value
                                        }
                                    })
                                }}
                            />
                        </div>
                        <div className="col-4 mb-1">
                            <Input required type="input" placeholder="gacha "
                                value={search?.end_age}
                                onChange={(e: any) => {
                                    setSearch((res: any) => {
                                        return {
                                            ...res,
                                            end_age: e.target.value
                                        }
                                    })
                                }} />
                        </div>
                        <div className="col-4 mb-1">
                            <div className="d-flex gap-3">
                                <div className="form-check ">
                                    <input className="form-check-input" type="radio" id="male" name='sex' value={'male'}
                                        onChange={(e: any) => {
                                            setSearch((res: any) => {
                                                return {
                                                    ...res,
                                                    sex: e.target.value
                                                }
                                            })
                                        }}
                                    />
                                    <label className="form-check-label" htmlFor="male"> erkak </label>
                                </div>
                                <div className="form-check ">
                                    <input className="form-check-input" type="radio" id="female" name='sex' value={'female'}
                                        onChange={(e: any) => {
                                            setSearch((res: any) => {
                                                return {
                                                    ...res,
                                                    sex: e.target.value
                                                }
                                            })
                                        }}

                                    />
                                    <label className="form-check-label" htmlFor="female"> ayol </label>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 mb-1">
                            <p >Operatsiya</p>
                            <div className="d-flex gap-3">
                                <div className="form-check ">
                                    <input className="form-check-input" type="radio" id="male" name='sex' value={'male'} />
                                    <label className="form-check-label" htmlFor="male"> Bo'lgan </label>
                                </div>
                                <div className="form-check ">
                                    <input className="form-check-input" type="radio" id="female" name='sex' value={'female'} />
                                    <label className="form-check-label" htmlFor="female"> Bo'lmagan </label>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 mb-1">
                            <p >Yo'llanma</p>
                            <div className="d-flex gap-3">
                                <div className="form-check ">
                                    <input className="form-check-input" type="radio" id="male" name='sex' value={'male'} />
                                    <label className="form-check-label" htmlFor="male"> Yo'llanma orqali </label>
                                </div>
                                <div className="form-check ">
                                    <input className="form-check-input" type="radio" id="female" name='sex' value={'female'} />
                                    <label className="form-check-label" htmlFor="female"> O'zi kelgan </label>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 mb-1">
                            <Input required type="input" placeholder="operatsiya turi " />
                        </div>
                        <div className="col-6 mb-1">
                            <Input required type="input" placeholder="operator " />
                        </div>
                    </div>

                </div>
                <div className="modal-footer">
                    <button className='btn btn-primary'

                        onClick={() => {
                            // isFilterToggle()
                            let resultQury = '' as any
                            // docGet(`?full_name=${e.target.value?.trim().toLowerCase()}&page=1&per_page=${data?.per_page}`)
                        }}
                    >Izlash</button>
                    <button className='btn btn-danger'
                        onClick={() => {
                            isFilterToggle()
                        }}
                    >Ortga</button>
                </div>

            </Modal>
        </Content>
    )
}

export default DocClientAll