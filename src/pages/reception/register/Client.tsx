import React, { useEffect, useRef, useState } from 'react'
import Layout from '../../../layout/Layout'
import Navbar from '../../../layout/Navbar'
import Table from '../../../componets/table/Table'
import Input from '../../../componets/inputs/Input'
import Pagination from '../../../componets/pagination/Pagination'
import { read, utils, writeFileXLSX } from 'xlsx'
import ClientAdd from './ClientAdd'
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
import { isAddRegisterClient, isCashRegItem2, isClientAddExcelFile, isClientCurrentPage, isClientDelete, isClientGet, isClientPageLimit, isClientReceptionGet, isTornametClient } from '../../../service/reducer/ClientReducer'
import { isDepartmentGet } from '../../../service/reducer/DepartmentReducer'
import { exportToExcel } from '../../../helper/exportToExcel'
import { isServiceTypeGet } from '../../../service/reducer/ServiceTypeReducer'
import { isServiceGet } from '../../../service/reducer/ServiceReducer'
import { fullName } from '../../../helper/fullName'
import { MdContentCopy } from 'react-icons/md'
import ClientAllShow from './ClientAllShow'
import { IoMdRepeat } from 'react-icons/io'
import CashRegister from '../../cash_register/CashRegister'
import { formatId } from '../../../helper/idGenerate'
import { getCurrentDateTime } from '../../../helper/dateFormat'
import { cashRegDiscount } from '../../../helper/cashRegCalc'
import GraphAdd from '../graph/GraphAdd'
import { isGraphGet } from '../../../service/reducer/GraphReducer'
import { BiCalendarCheck } from 'react-icons/bi'
import RegGraphAdd from '../graph/RegGraphAdd'
import ClientAllSetting from './ClientAllSetting'
import { AiFillEdit } from 'react-icons/ai'
import { FaPrint, FaRegPlusSquare } from 'react-icons/fa'
import { generateCheck } from '../../../helper/generateCheck'
import { chegirmaHisobla } from '../../../helper/cashRegHelper'
import { isTreatmentGet } from '../../../service/reducer/TreatmentReducer'
import { isReferringDoctorGet } from '../../../service/reducer/ReferringDoctorReducer'
import { isAdvertisementsGet } from '../../../service/reducer/AdvertisementsReducer'
import { clientTableColumn, navbatGet, sortNavbat } from '../../../helper/clientHelper'
import { calculateAge } from '../../../helper/calculateAge'
import { dateFormat } from '../../../service/helper/day'
import ChekPrintPage from './ChekPrintPage'
import { isPatientDiagnosisGet } from '../../../service/reducer/PatientDiagnosisReducer'
import { isPatientComplaintGet } from '../../../service/reducer/PatientComplaintReducer'
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
const Client = () => {
    const path = useNavigate()
    const dataSelect = (data: any) => {
        let res = [...data].sort((a: any, b: any) => b.id - a.id);
        return res?.map((item: any) => {
            return {
                value: item?.id, label: item?.name || item?.type,
                data: item
            }
        })
    }
    const iframeRef = useRef<HTMLIFrameElement | null>(null);


    const treatmentShow = async (person_id: any, at_home_data: any) => {
        try {
            setLoad(() => true)
            let res = await axios.get(`/graph/treatment-show?person_id=${person_id}`)
            const { result } = res.data

            setItem2({ ...(result?.graph ?? {}), ...result?.graph_archive?.person, use_status: result?.graph_archive.use_status, graph_archive_id: result?.graph_archive?.id, treatment: (result?.graph_archive?.treatment), graph_archive: result?.graph_archive, at_home_data: at_home_data, balance: result?.graph?.balance ?? result?.graph_archive?.balance, department: result?.graph?.department ?? result?.graph_archive?.department })
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
    const departmentDataLoad = useSelector((state: ReducerType) => state.DepartmentReducer.isLoading)
    const serviceDataLoad = useSelector((state: ReducerType) => state.ServiceReducer.isLoading)
    const { user, } = useSelector((state: ReducerType) => state.ProfileReducer)
    const [modal, setModal] = useState(false)
    const [modaledit, setModaledit] = useState(false)
    const [modal2, setModal2] = useState(false)
    const [modal3, setModal3] = useState(false)
    const [item, setItem] = useState({} as any)
    const [item2, setItem2] = useState({} as any)
    const { clientGet, page, clientData, massage, isLoading, isSuccess, pageLimit, cashRegModal2, cashRegItem2 } = useSelector((state: ReducerType) => state.ClientReducer)
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
        if (serachData?.check) {
            return response?.filter((item: any) => response?.filter((res: any) => item?.first_name == res?.first_name)?.length > 1)
        }
        if (+serachData?.department?.value > 0) {
            // alert('sss')
            return sortNavbat(response)

        }

        return sortNavbat(response, true)



    }
    const [show, setShow] = useState(false)

    const { id, clienttype_id, department_id } = useParams() as any
    useEffect(() => {

        // if ((department_id && +department_id > 0) && (clienttype_id && +clienttype_id > 0)) {
        //     dispatch(isClientGet(`?department_id=${department_id}&clienttype_id=${clienttype_id}&per_page=100`))
        // } else {
        //     dispatch(isClientGet('?per_page=100'))
        // }
        if (!clientGet) {
            dispatch(isClientGet('?per_page=100'))
            // dispatch(isClientReceptionGet('?per_page=100'))
            dispatch(isServiceGet(''))
            // dispatch(isGraphGet(''))
            dispatch(isDepartmentGet(''))
            dispatch(isTreatmentGet(''))
            dispatch(isReferringDoctorGet(''))
            dispatch(isAdvertisementsGet(''))
        }

    }, [])

    const [cash, setCash] = useState(false as any)
    return (
        <Content loading={load} >
            <Navbar />
            <div className="container-fluid flex-grow-1 py-1 size_16 ">
                <div className="d-flex my-1 gap-3">
                    <form className='row w-100'>
                        <div className="col-3">
                            <div className="d-flex gap-2">
                                <Input type='date'
                                    disabled={isLoading ? true : false}
                                    onChange={(e: any) => {
                                        let value = e.target.value
                                        if (value && value.length > 0) {
                                            dispatch(isClientGet(`?start_date=${value}&end_date=${clientData?.end_date}&per_page=100&page=1`))
                                        }
                                    }}
                                    value={clientData?.start_date}
                                />
                                <Input type='date'
                                    disabled={isLoading ? true : false}
                                    min={clientData?.start_date} onChange={(e: any) => {
                                        let value = e.target.value
                                        if (value && value.length > 0) {
                                            dispatch(isClientGet(`?start_date=${clientData?.start_date}&end_date=${value}&per_page=100&page=1`))
                                        }
                                    }}
                                    value={clientData?.end_date}
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
                                                    department: false
                                                }
                                            })
                                            dispatch(isClientGet(`?start_date=${clientData?.start_date}&end_date=${clientData?.end_date}&full_name=${e.target.value?.trim().toLowerCase()}&per_page=100&page=1`))
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
                                                    department: false
                                                }
                                            })
                                            dispatch(isClientGet(`?start_date=${clientData?.start_date}&end_date=${clientData?.end_date}&phone=${e.target.value?.trim().toLowerCase()}&per_page=100&page=1`))
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
                                                    department: false
                                                }
                                            })
                                            dispatch(isClientGet(`?start_date=${clientData?.start_date}&end_date=${clientData?.end_date}&person_id=${e.target.value?.trim().toLowerCase()}&per_page=100&page=1`))
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
                                                    department: false
                                                }
                                            })
                                            dispatch(isClientGet(`?start_date=${clientData?.start_date}&end_date=${clientData?.end_date}&data_birth=${e.target.value?.trim().toLowerCase()}&per_page=100&page=1`))
                                        }
                                    }
                                }
                                value={search?.data_birth}
                            />
                        </div>
                        <div className={`col-2 ${+user?.setting?.is_reg_status ? '' : 'd-none'}`}>
                            <Select
                                isDisabled={isLoading ? true : false}
                                name='name'
                                value={use_status.find((item: any) => item?.value == clientData?.use_status)}
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
                                    dispatch(isClientGet(`?start_date=${clientData?.start_date}&end_date=${clientData?.end_date}&status=${e.value}&per_page=100&page=1`))
                                }}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                options={
                                    use_status
                                } />
                        </div>
                        <div className="col-4">
                            <Select
                                name='name'

                                isDisabled={isLoading ? true : false}
                                value={search?.department}
                                onChange={(e: any) => {
                                    setSearch((res: any) => {
                                        return {
                                            ...res,
                                            phone: '',
                                            person_id: '',
                                            data_birth: '',
                                            full_name: '',
                                            department: e
                                        }
                                    })
                                    dispatch(isClientGet(`?start_date=${clientData?.start_date}&end_date=${clientData?.end_date}&department_id=${e.value}&per_page=100&page=1`))
                                    // setSearch((res: any) => {
                                    //     return {
                                    //         ...res,
                                    //         department: e
                                    //     }
                                    // })
                                    // dispatch(isGraphGet(`?year=${graphData?.current_year?.value ?? ''}&department_id=${e?.value ?? ''}&month=${graphData?.month?.value ?? ''}`))
                                }}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                options={
                                    [
                                        {
                                            label: 'Barchasi',
                                            value: '',
                                        },

                                        ...dataSelect(departmentData)
                                    ]
                                } />
                        </div>
                        <div className="col-4">
                            <input type="checkbox" checked={search?.check}
                                className='form-check-input'
                                onChange={((e: any) => {
                                    setSearch((res: any) => {
                                        return {
                                            ...search,
                                            check: e.target.checked
                                        }
                                    })
                                })}
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
                        <button className="btn btn-primary " type="button" onClick={() => {
                            // setModal(true)
                            // setItem(() => {
                            //     return {
                            //         reset: true
                            //     }
                            // })
                            dispatch(isAddRegisterClient({}))
                            path('/register')
                        }}
                        
                        // disabled={departmentDataLoad && serviceDataLoad}
                        >
                          {
                            departmentDataLoad && serviceDataLoad ? 'Xizmatlar yuklanmoqda' : 'Qoshish'
                          }  
                            </button>
                    </div>
                </div>
                <div className="card" style={{
                    height: `${window.innerHeight / 1.4}px`,
                    overflow: 'auto'
                }}>
                    <Table



                        deletedispatchFunction={isClientDelete}
                        paginationRole={false}
                        localEditFunction={(e: any) => {
                            setItem(() => e?.client_item?.at(-1))

                            setModal(true)
                        }}
                        errorMassage={massage}
                        isLoading={isLoading}
                        isSuccess={isSuccess}
                        reloadData={true}
                        reloadDataFunction={() => {
                            if ((department_id && +department_id > 0) && (clienttype_id && +clienttype_id > 0)) {
                                dispatch(isClientGet(`?department_id=${department_id}&clienttype_id=${clienttype_id}`))
                            } else {
                                dispatch(isClientGet('?per_page=100&page=1'))
                            }
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

                                {/* <select id="defaultSelect" className="form-select"
                                    value={item?.client_item?.at(-1)?.use_status}
                                    required
                                    onChange={(e: any) => {
                                        if (e.target.value === 'treatment') {
                                            const {
                                                first_name, last_name, phone, person_id, data_birth, citizenship, sex
                                            } = item
                                            setItem(() => {
                                                return {
                                                    first_name: first_name,
                                                    last_name: last_name,
                                                    phone: phone,
                                                    person_id: person_id,
                                                    data_birth: data_birth,
                                                    citizenship: citizenship
                                                    , sex: sex,
                                                    client_id: item?.client_item?.at(-1)?.id,
                                                    use_status: 'treatment',
                                                }
                                            })
                                            setModal3(true)

                                        }
                                    }}
                                >
                                    <option value={''}>Tanlang</option>
                                    <option value='treatment'>Muolaja</option>
                                </select> */}
                                {
                                    +user?.is_cash_reg ? <>
                                        <button className='btn btn-warning btn-sm'
                                            onClick={() => {
                                                let target = item?.client_item?.at(-1)
                                                generateCheck({
                                                    target: {
                                                        ...target,
                                                        client_value: target?.client_value?.filter((item: any) => +item?.is_active)
                                                    },
                                                    iframeRef: iframeRef,
                                                    name: user?.owner?.name,
                                                    client_time: item?.client_item?.at(-1)?.client_time,
                                                    user: user
                                                })
                                            }}
                                        >
                                            <FaPrint />
                                        </button>
                                        {/* <button className='btn btn-warning btn-sm'
                                            onClick={() => {
                                                // payShow(item?.client_item?.at(-1)?.id)
                                                setCash(() => true)
                                                setItem(() => { })
                                                setItem(() => {
                                                    return {
                                                        ...item?.client_item?.at(-1),
                                                        balance: item?.balance,
                                                        pay_type: '',
                                                        reset_: true

                                                    }
                                                })
                                            }}
                                        >
                                            tolov
                                        </button> */}
                                    </> : ''
                                }

                                <button className='btn btn-primary btn-sm'
                                    onClick={() => {
                                        const {
                                            first_name, last_name, phone, person_id, data_birth, citizenship, sex
                                        } = item?.client_item?.at(-1)
                                        console.log({
                                            ...item?.client_item?.at(-1),
                                            balance: item?.balance,
                                        });

                                        // // modalkasi
                                        // setModal(true)
                                        // setItem(() => {
                                        //     return {

                                        //         ...item?.client_item?.at(-1),
                                        //         balance: item?.balance,
                                        //         client_item_data: item?.client_item

                                        //     }
                                        // })
                                        // alohida paghe
                                        path('/register')
                                        dispatch(isAddRegisterClient({

                                            ...item?.client_item?.at(-1),
                                            balance: item?.balance,
                                            client_item_data: item?.client_item

                                        }))


                                    }}
                                >
                                    <FaRegPlusSquare />
                                </button>
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
                            ...clientTableColumn(user?.setting)
                            // 'phone_',
                            // 'data_birth_',
                            // 'person_id_',
                            // // 'probirka_',
                            // // 'total_price',
                            // // kassa
                            // 'pay_total_price',
                            // 'department_',
                            // // 'discount_price',
                            // // 'debt_price',
                            // // 'qaytarilgan',
                            // 'client_item_count',
                            // 'welcome_count_',
                            // 'status_',
                            // // 'created_at_'
                        ]}
                        columns={[
                            {
                                title: '№',
                                key: 'id',
                                renderItem: (value: any, data: any) => {
                                    const { total_price, pay_total_price, discount_price, is_pay, service_count, client_payment, discount } = data?.client_item?.at(-1)
                                    let result = total_price - discount - pay_total_price;

                                    // let discount = cashRegDiscount(client_payment?.at(0)?.total_price, client_payment?.at(0)?.discount)
                                    // if (discount == pay_total_price && discount == total_price - pay_total_price) {
                                    //     result = 0
                                    // } else {
                                    //     result = total_price - pay_total_price
                                    // }
                                    return <td key={data.index} className={` p-1  ${service_count == 0 ? 'bg-danger text-white' : (result == 0 ? 'bg-success text-white' : 'bg-danger text-white')}  h-100`}>
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
                                            {getCurrentDateTime(value?.client_item.at(-1).created_at)}
                                        </span>
                                    </td>
                                }
                            },
                            {
                                title: 'Pasport',
                                key: 'pass_number_',
                                condition_role: true,
                                condition: clientTableColumn(user?.setting, true, 'is_reg_pass_number', 'pass_number_'),
                                render: (value: any, data: any) => {
                                    return value?.client_item.at(-1).pass_number ?? '-'
                                }
                            },
                            {
                                title: 'Tel',
                                key: 'phone_',
                                condition_role: true,
                                condition: clientTableColumn(user?.setting, true, 'is_reg_phone', 'phone_'),
                                render: (value: any, data: any) => {

                                    return parseInt(value?.client_item.at(-1).phone) > 0 ? `+998${value?.client_item.at(-1).phone}` : '-'
                                }
                            },
                            {
                                title: 'Yoshi',
                                key: 'data_birth_',
                                condition_role: true,
                                condition: clientTableColumn(user?.setting, true, 'is_reg_data_birth', 'data_birth_'),
                                render: (value: any, data: any) => {
                                    return value?.client_item.at(-1).data_birth == null || value?.client_item.at(-1).data_birth == 'null' ? '-' : calculateAge(value?.client_item.at(-1).data_birth, user?.graph_format_date)
                                }
                            },
                            {
                                title: 'ID',
                                key: 'person_id_',
                                condition_role: true,
                                condition: clientTableColumn(user?.setting, true, 'is_reg_person_id', 'person_id_'),
                                render: (value: any, data: any) => {
                                    let res = value?.client_item.at(-1)
                                    return res?.is_statsionar ? <span className='text-danger'>S{formatId(value?.person_id)}</span> : formatId(value?.person_id)
                                }
                            },
                            // {
                            //     title: 'Probirka',
                            //     key: 'probirka_',
                            //     render: (value: any, data: any) => {
                            //         return <NumericFormat displayType="text"
                            //             thousandSeparator
                            //             decimalScale={2}
                            //             value={value?.client_item?.at(-1)?.probirka_count || 0} />
                            //     }
                            // },
                            // {
                            //     title: " Summa",
                            //     key: 'total_price',
                            //     render: (value: any, data: any) => {

                            //         return <NumericFormat displayType="text"
                            //             thousandSeparator
                            //             decimalScale={2}
                            //             value={value?.client_item?.at(-1)?.total_price ?? 0} />
                            //     }
                            // },
                            {
                                title: "To'langan",
                                key: 'pay_total_price',
                                condition_role: true,
                                condition: clientTableColumn(user?.setting, true, 'is_reg_pay', 'pay_total_price'),
                                render: (value: any, data: any) => {
                                    const { total_price, pay_total_price, discount_price, client_payment, client_value, discount, created_at } = value?.client_item?.at(-1)
                                    // let toladi = client_value?.reduce((a: any, b: any) => a + +b.pay_price, 0) as any
                                    // let jami = client_value?.reduce((a: any, b: any) => a + (+b.is_active ? +b.total_price - (chegirmaHisobla(b)) : 0), 0) as any
                                    let allData = value?.client_item?.filter((res: any) => Date.parse(dateFormat(res?.created_at)) == Date.parse(dateFormat(created_at)))

                                    let toladi = allData?.reduce((aa: any, bb: any) => aa + (bb.client_value?.reduce((a: any, b: any) => a + +b.pay_price, 0)), 0)
                                    let jami = allData?.reduce((aa: any, bb: any) => aa + (bb.client_value?.reduce((a: any, b: any) => a + (+b.is_active ? +b.total_price - (chegirmaHisobla(b)) : 0), 0)), 0)
                                    return <>
                                        <span className='text-success'>
                                            <NumericFormat displayType="text"
                                                thousandSeparator
                                                decimalScale={2}
                                                value={allData?.reduce((a: any, b: any) => a + +b?.pay_total_price, 0)} />
                                            {/* value={(value?.client_item?.at(-1)?.pay_total_price) ?? 0} /> */}
                                        </span>
                                        <span className={`text-warning ${discount > 0 ? '' : 'd-none'}`}>/

                                            <NumericFormat displayType="text"
                                                thousandSeparator
                                                decimalScale={2}
                                                value={discount} />
                                        </span>
                                        <span className={`text-danger ${jami - toladi > 0 ? '' : 'd-none'}`}>
                                            /
                                            <NumericFormat displayType="text"
                                                thousandSeparator
                                                decimalScale={2}
                                                value={jami - toladi} />
                                        </span>

                                    </>
                                }
                            },
                            // {
                            //     title: 'Chegirma',
                            //     key: 'discount_price',
                            //     render: (value: any, data: any) => {
                            //         const { total_price, pay_total_price, discount_price, client_payment, client_value, discount } = value?.client_item?.at(-1)
                            //         // let discount = cashRegDiscount(client_payment?.at(0)?.total_price, client_payment?.at(0)?.discount)
                            //         return <NumericFormat displayType="text"
                            //             thousandSeparator
                            //             decimalScale={2}
                            //             value={discount} />
                            //     }
                            // },
                            // {
                            //     title: 'Qarz',
                            //     key: 'debt_price',
                            //     render: (value: any, data: any) => {
                            //         const { total_price, pay_total_price, discount_price, client_value, client_payment } = value?.client_item?.at(-1)
                            //         let toladi = client_value?.reduce((a: any, b: any) => a + +b.pay_price, 0) as any
                            //         let jami = client_value?.reduce((a: any, b: any) => a + (+b.is_active ? +b.total_price - (chegirmaHisobla(b)) : 0), 0) as any
                            //         let result = pay_total_price;
                            //         let discount = cashRegDiscount(client_payment?.at(0)?.total_price, client_payment?.at(0)?.discount)
                            //         // let discount = cashRegDiscount(total_price, discount_price)
                            //         if (discount == pay_total_price && discount == total_price - pay_total_price) {
                            //             result = 0
                            //         } else {
                            //             result = total_price - pay_total_price
                            //         }
                            //         let tolangan = client_value?.reduce((a: any, b: any) => a + (+b?.is_active ? +b.total_price - +b.pay_price : 0), 0)


                            //         return <NumericFormat displayType="text"
                            //             thousandSeparator
                            //             decimalScale={2}
                            //             value={jami - toladi} />
                            //     }
                            // },
                            // {
                            //     title: 'Qaytarilgan',
                            //     key: 'qaytarilgan',

                            //     render: (value: any, data: any) => {

                            //         const { total_price, pay_total_price, discount_price, client_payment, client_value, back_total_price } = value?.client_item?.at(-1)
                            //         let qaytarilyapdi = client_value?.reduce((a: any, b: any) => a + (+b?.is_active ? 0 : +(b.total_price - chegirmaHisobla(b))), 0)



                            //         return <NumericFormat displayType="text"
                            //             thousandSeparator
                            //             decimalScale={2}
                            //             value={back_total_price} />
                            //     }
                            // },
                            {
                                title: "Bo'limlar",
                                key: 'department_',
                                condition_role: true,
                                condition: clientTableColumn(user?.setting, true, 'is_reg_department', 'department_'),
                                render: (value: any) => {
                                    const {
                                        client_value, client_result,
                                        created_at
                                    } = value?.client_item?.at(-1)

                                    let allData = value?.client_item?.filter((res: any) => Date.parse(dateFormat(res?.created_at)) == Date.parse(dateFormat(created_at)))
                                    let data = [] as any;
                                    for (let item of allData) {
                                        const { client_value, client_result } = item
                                        for (let res of (client_result ?? [])?.filter((res: any) => search?.department?.value > 0 ? res?.department_id == search?.department?.value : true)) {
                                            data.push(<p className={
                                                `mb-1 text-white badge bg-${res?.is_check_doctor == 'finish' ? 'success' : 'secondary'}`
                                            }>
                                                {client_value?.find((resItem: any) => resItem?.department_id == res?.department_id)?.service?.department?.name}
                                            </p>)
                                        }
                                    }
                                    return <div className="d-flex align-items-center gap-1 flex-wrap ">
                                        {/* {
                                            client_result?.map((res: any, index: number) => {
                                                return <p className={
                                                    `mb-1 text-white badge bg-${res?.is_check_doctor == 'finish' ? 'success' : 'secondary'}`
                                                }>
                                                    {client_value?.find((resItem: any) => resItem?.department_id == res?.department_id).service?.department?.name}
                                                </p>
                                            })
                                        } */}
                                        {data}
                                    </div>
                                }
                            },
                            {
                                title: 'Xizmatlar',
                                key: 'client_item_count',
                                condition_role: true,
                                condition: clientTableColumn(user?.setting, true, 'is_reg_service', 'client_item_count'),
                                render: (value: any) => {
                                    const {
                                        client_value, client_result,
                                        created_at,
                                    } = value?.client_item?.at(-1)
                                    let allData = value?.client_item?.filter((res: any) => Date.parse(dateFormat(res?.created_at)) == Date.parse(dateFormat(created_at)))


                                    let data = [] as any;
                                    let serviceId = [] as any
                                    for (let item of allData) {
                                        const { client_value, client_result } = item
                                        for (let res of (client_value ?? [])?.filter((res: any) => search?.department?.value > 0 ? res?.service?.department?.id == search?.department?.value : true)) {
                                            if (!serviceId?.find((resItem: any) => resItem == res?.service?.id)) {

                                                data.push(<p className={
                                                    `mb-1 text-white badge bg-${client_result?.find((resItem: any) => resItem?.department_id == res?.department_id && resItem?.is_check_doctor == 'finish') ? 'success' : 'secondary'}`
                                                }>
                                                    {res?.service?.name}
                                                </p>)
                                                serviceId.push(res?.service?.id)
                                            }
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
                                title: 'Navbat',
                                key: 'welcome_count_',
                                condition_role: true,
                                condition: clientTableColumn(user?.setting, true, 'is_reg_queue_number', 'welcome_count_'),
                                render: (value: any, data: any) => {
                                    const {
                                        client_value, client_time,
                                        queue_letter,
                                        created_at,
                                        id
                                    } = value?.client_item?.at(-1)
                                    let allData = value?.client_item
                                        ?.filter((res: any) => id != res?.id)
                                        ?.filter((res: any) => Date.parse(dateFormat(res?.created_at)) == Date.parse(dateFormat(created_at)))
                                    let quData = [] as any;
                                    for (let item of [value?.client_item?.at(-1), ...allData]) {
                                        const { queue_letter, client_value, client_time } = item
                                        let queue_letter_res = queue_letter;
                                        if (+search?.department?.value > 0) {
                                            // if (!search?.department?.data?.is_queue_number) {
                                            //     return '-'
                                            // }
                                            const q_n = client_value
                                                ?.filter((res: any) => !res?.is_at_home)
                                                ?.find((item: any) => +item?.department_id == search?.department?.value)
                                            let queue_number = q_n?.queue_number
                                            if (search?.department?.data?.is_reg_time) {
                                                queue_number = client_time?.find((item: any) => item?.department_id == q_n?.service?.department?.id)?.agreement_time ?? ''
                                            }
                                            queue_letter_res = `${search?.department?.data?.letter} - ${queue_number}`
                                        }
                                        let allNavbat = navbatGet(client_value?.filter((res: any) => !res?.is_at_home), client_time, queue_letter_res, search?.department)

                                        quData = [...quData, ...allNavbat]
                                            ?.filter((item: any) => !item.includes('undefined'))
                                    }
                                    let allNavbat = navbatGet(client_value?.filter((res: any) => !res?.is_at_home), client_time, queue_letter, search?.department)
                                    return <div className='my-1'>
                                        {
                                            [...new Set(quData)]
                                                ?.filter((item: any) => item?.split('-')?.[1]?.trim()?.length > 0)
                                                ?.length > 0 ?
                                                [...new Set(quData)]
                                                    ?.filter((item: any) => item?.split('-')?.[1]?.trim()?.length > 0)
                                                    ?.map((item: any, index: number) => {
                                                        return <p className="mb-1 d-block text-white badge bg-secondary">{item}</p>
                                                    }) : <p className="mb-1 d-block text-white badge bg-secondary">-</p>}
                                    </div>
                                    // return <div className='my-1'>
                                    //     {
                                    //         allNavbat?.length > 0 ?
                                    //             allNavbat?.map((item: any, index: number) => {
                                    //                 return <p className="mb-1 d-block text-white badge bg-secondary">{item}</p>
                                    //             }) : <p className="mb-1 d-block text-white badge bg-secondary">-</p>}
                                    // </div>
                                    // const q_n = client_value?.find((item: any) => +item?.service?.department?.is_queue_number)
                                    // let q_n_time = client_time?.find((item: any) => item?.department_id == q_n?.service?.department?.id)
                                    // return !q_n ? '-' : +q_n?.service?.department?.is_reg_time ? `${q_n?.service?.department?.letter} - ${q_n_time?.agreement_time}` : <>
                                    //     {q_n?.service?.department?.letter} - <NumericFormat displayType="text"
                                    //         thousandSeparator
                                    //         decimalScale={2}
                                    //         value={q_n?.queue_number} /></>
                                }
                            },
                            {
                                title: 'Status',
                                key: 'status_',
                                condition_role: true,
                                condition: clientTableColumn(user?.setting, true, 'is_reg_status', 'status_'),
                                render: (value: any, data: any) => {
                                    const {
                                        first_name, last_name, phone, person_id, data_birth, citizenship, sex,
                                        id,
                                        client_item
                                    } = value
                                    const { finish_department_count, department_count } = client_item?.at(-1)
                                    let status = use_status?.find((res: any) => res.value == value.use_status)
                                    let at_home_data = {
                                        ...value?.client_item?.at(-1),
                                        balance: value?.balance,
                                    }
                                    return <>
                                        <button className={`btn  btn-${department_count > 0 && finish_department_count == department_count ? 'success' : 'secondary'} rounded-pill btn-sm `} onClick={() => {
                                            if (status) {
                                                treatmentShow(person_id, at_home_data)
                                            } else {
                                                setItem2(() => {
                                                    return {
                                                        at_home_data: at_home_data,
                                                        first_name: first_name,
                                                        last_name: last_name,
                                                        phone: phone,
                                                        person_id: person_id,
                                                        data_birth: data_birth,
                                                        citizenship: citizenship
                                                        , sex: sex,
                                                        client_id: id,
                                                        target_client_id: id,
                                                        referring_doctor_id: client_item?.at(-1)?.referring_doctor_id,
                                                        at_home_client_id: client_item?.at(-1).id

                                                    }
                                                })
                                                setModal3(true)

                                            }
                                        }}>
                                            {status ? status?.label : 'Ambulator'}
                                        </button>
                                    </>
                                }
                            },

                            // {
                            //     title: 'Kelgan vaqti',
                            //     key: 'created_at_',
                            //     render: (value: any, data: any) => {
                            //         return `${getCurrentDateTime(value?.client_item.at(-1).created_at)}`
                            //     }

                            // },

                        ]}
                        dataSource={
                            filter(clientData?.data, search)
                            // filter([...clientData?.data ?? []]?.map((item: any) => +item.person_id == +graph_achive_target?.person_id ? {
                            //     ...item,
                            //     use_status: graph_achive_target.use_status
                            // } : item), search)
                        }
                    />
                </div>
                <br />
                {
                    isLoading ? '' :
                        <Pagination

                            setPageLimit={(e: any) => {
                                // setNumberOfPages(Math.ceil(clientData?.length / e))
                                // setPageLimit(e)
                                // dispatch(isClientCurrentPage(1))
                                // dispatch(isClientPageLimit(e))

                                dispatch(isClientGet(`?start_date=${clientData?.start_date}&end_date=${clientData?.end_date}&data_birth=${search?.data_birth}&full_name=${search?.full_name}&person_id=${search?.person_id}&status=${clientData?.use_status}&phone=${search?.phone}&page=${1}&per_page=${e}&department_id=${search?.department_id ?? ''}`))
                            }}

                            pageLmit={clientData?.per_page}
                            current={clientData?.current_page} total={clientData?.last_page} count={(e: any) => {

                                dispatch(isClientGet(`?start_date=${clientData?.start_date}&end_date=${clientData?.end_date}&data_birth=${search?.data_birth}&full_name=${search?.full_name}&person_id=${search?.person_id}&status=${clientData?.use_status}&phone=${search?.phone}&page=${e}&per_page=${clientData?.per_page}&department_id=${search?.department_id ?? ''}`))
                            }} />
                }
            </div>
            {
                modal ? <ClientAdd
                    modal={true} setModal={setModal}
                    setData={setItem} data={item}
                // setExtraModalClose2={()=>{

                //     setCash(()=>true)
                //     setItem(()=>cashRegItem2)
                // }}
                /> : <></>
            }

            {
                modaledit ? <ClientAllSetting
                    modal={true} setModal={setModaledit}
                    setData={setShowItem} data={showItem}
                    graph={true}
                    clientAddModal={setModal}
                    clientItem={setItem}
                    reRegister={true}

                /> : <></>
            }
            {
                show ? <ClientAllShow
                    modal={true} setModal={setShow}
                    data={item} /> : <></>
            }


            {
                +user?.is_cash_reg ?
                    <CashRegister
                        modal={cashRegModal2 || cash} setModal={setCash}
                        data={item?.id > 0 ? item : cashRegItem2} setData={setItem} /> : ''
            }
            {
                modal3 ? <RegGraphAdd
                    modal={true} setModal={setModal3}
                    setData={setItem2} data={item2} />
                    : <></>
            }
            <iframe ref={iframeRef} style={{ display: 'none' }} title="print-frame" />
            <ChekPrintPage />

        </Content>
    )
}

export default Client