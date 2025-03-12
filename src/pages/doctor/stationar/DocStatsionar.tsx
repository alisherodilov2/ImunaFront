import React, { useEffect, useLayoutEffect, useState } from 'react'
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
import { addDaysToDate, statitionarDate } from '../../../helper/clientHelper'
const DocStatsionar = () => {
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
        phone: '',
        person_id: '',
        probirka: '',
        data_birth: '',
        status: {
            label: 'Davolanishda',
            value: 'process'
        },
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
            let res = await axios.get(`/client/doctor-statsianar${target}`)
            const { result } = res.data
            setData(result)
        } catch (error) {

        }
        finally {
            setDataload(false)
        }
    }
    useEffect(() => {

        const fetchPosts = async () => {
          await  docGet('')
        };
        fetchPosts()
        return () => {
             
        };
    }, [])

    const [cash, setCash] = useState(false)
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
                        <div className={`col-2 `}>
                            <Select
                                isDisabled={isLoading ? true : false}
                                name='name'
                                value={search.status}
                                onChange={(e: any) => {
                                    setSearch((res: any) => {
                                        return {
                                            ...res,
                                            phone: '',
                                            person_id: '',
                                            data_birth: '',
                                            full_name: '',
                                            department: false,
                                            status: e
                                        }
                                    })
                                    docGet(`?status=${e.value}&page=1&per_page=${data?.per_page}`)
                                }}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                options={
                                    [

                                        {
                                            label: 'Davolanishda',
                                            value: 'process'
                                        },
                                        {
                                            label: 'Yakunlangan',
                                            value: 'finish'
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
                        <button className="btn btn-primary " type="button" onClick={() => {
                            setModal(true)
                            setItem(() => {
                                return {
                                    reset: true
                                }
                            })
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
                            'stat_date_',
                            'finish_date_',
                            'person_id_',
                            'full_name_',
                            'phone_',
                            'room_',
                            'days_'
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
                                title: 'Kelgan vaqti',
                                key: 'stat_date_',
                                render: (value: any, data: any) => {
                                    return value?.admission_date
                                }
                            },
                            {
                                title: 'Ketgan  vaqti',
                                key: 'finish_date_',
                                render: (value: any, data: any) => {
                                    return +value?.is_finish_statsionar ? value?.finish_statsionar_date : '-'
                                }
                            },
                            {
                                title: 'Id',
                                key: 'person_id_',
                                render: (value: any, data: any) => {
                                    return formatId(value?.person_id)
                                }
                            },
                            {
                                title: 'Ismi',
                                key: 'full_name_',
                                render: (value: any, data: any) => {
                                    return <b>{fullName(value)}</b>
                                }
                            },
                            {
                                title: 'Telefon',
                                key: 'phone_',
                                render: (value: any, data: any) => {
                                    return parseInt(value.phone) > 0 ? `+998${value.phone}` : '-'
                                }
                            },
                            {
                                title: 'Xonasi',
                                key: 'room_',
                                render: (value: any, data: any) => {
                                    return `${value?.statsionar_room?.type} ${value?.statsionar_room?.room_index}`
                                }
                            },
                            {
                                title: 'Kuni',
                                key: 'days_',
                                render: (value: any, data: any) => {
                                    const { client_value } = value
                                    let qty = 0;
                                    let res_qty = 0;
                                    if (+value?.is_finish_statsionar) {
                                        qty = value.day_qty > 0 ? value.day_qty : statitionarDate(value?.admission_date, value?.finish_statsionar_date)?.length
                                        res_qty = qty
                                    } else {
                                        qty = value.day_qty > 0 ? value.day_qty : statitionarDate(value?.admission_date, user?.graph_format_date)?.length;
                                        res_qty = value?.admission_date === user?.graph_format_date ? 0 : value.day_qty > 0 ? statitionarDate(value?.admission_date, addDaysToDate(value?.admission_date, value.day_qty))?.length : statitionarDate(value?.admission_date, user?.graph_format_date)?.length

                                    }


                                    return <>

                                        {qty}/{res_qty}

                                    </>
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

        </Content>
    )
}

export default DocStatsionar