import React, { useEffect, useState } from 'react'
import Layout from '../../layout/Layout'
import Navbar from '../../layout/Navbar'
import Table from '../../componets/table/Table'
import Input from '../../componets/inputs/Input'
import Pagination from '../../componets/pagination/Pagination'
import { read, utils, writeFileXLSX } from 'xlsx'
import { useDispatch, useSelector } from 'react-redux'
import { ReducerType } from '../../interface/interface'
import Swal from 'sweetalert2'
import Content from '../../layout/Content'
import { NumericFormat } from 'react-number-format'
import { query } from '../../componets/api/Query'
import axios from 'axios'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Select from 'react-select';
import { AppDispatch } from '../../service/store/store'
import { isClientAddExcelFile, isClientCurrentPage, isClientDelete, isClientGet, isClientPageLimit, isDoctorTargetData } from '../../service/reducer/ClientReducer'
import { isDepartmentGet } from '../../service/reducer/DepartmentReducer'
import { isServiceTypeGet } from '../../service/reducer/ServiceTypeReducer'
import { isServiceGet } from '../../service/reducer/ServiceReducer'
import { fullName } from '../../helper/fullName'
import { MdContentCopy, MdNotifications } from 'react-icons/md'
import { IoMdRepeat } from 'react-icons/io'
import CashRegister from '../cash_register/CashRegister'
import { formatId } from '../../helper/idGenerate'
import { getCurrentDateTime } from '../../helper/dateFormat'
import { cashRegDiscount } from '../../helper/cashRegCalc'
import { isGraphGet } from '../../service/reducer/GraphReducer'
import { BiCalendarCheck } from 'react-icons/bi'
import { AiFillEdit } from 'react-icons/ai'
import { FaCheckCircle, FaRegPlusSquare, FaUserClock } from 'react-icons/fa'
import { generateCheck } from '../../helper/generateCheck'
import { calculateAge } from '../../helper/calculateAge'
import DoctorReg from './doctor-reg/DoctorReg'
import DoctorMobileWelcome from './DoctorMobileWelcome'
import Loader from '../../componets/api/Loader'
import ClientAdd from '../reception/register/ClientAdd'
import { numberStatus } from '../../helper/doctorRegHelper'
export const statusColor = (status: any, route?: any) => {
    if (status === 'finish') {
        if (route) {
            return 'finish';
        }
        return 'success';
    }
    if (status === 'start' || status === 'pause') {
        if (route) {
            return 'in_room';
        }
        return 'danger';
    }
    if (route) {
        return 'waiting';
    }
    return 'secondary';

}

const DoctorDesctoWelcome = () => {
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
    const { user } = useSelector((state: ReducerType) => state.ProfileReducer)
    const [modal, setModal] = useState(false)
    const [modaledit, setModaledit] = useState(false)
    const [modal2, setModal2] = useState(false)
    const [modal3, setModal3] = useState(false)
    const [item, setItem] = useState({} as any)
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
    const alertSoket = async (data: any) => {
        try {
            console.log(data);
            let queue_number = data.client_value?.find((res: any) => res?.queue_number > 0)
            let number = `${user?.department?.letter} - ${queue_number?.queue_number ?? 0}`
            setLoad(() => true)
            let res = await axios.get(`/client/alert-soket/1?number=${number}&room=${user?.department?.main_room ?? '-'}`)

        } catch (error) {

        }
        finally {
            setLoad(() => false)
        }
    }
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

    const payShow = async (id: any) => {
        try {
            setLoad(() => true)
            let res = await axios.get('/client?client_id=' + id)
            const { result } = res.data
            setItem(() => result)
            setCash(() => true)
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
    } as any)

    const filter = (data: any, serachData: any) => {

        let response = data as any;
        console.log(serachData);

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


        return response


    }



    const [show, setShow] = useState(false)
    const [tab, setTab] = useState({
        label: 'Barchasi',
        value: 'mix'
    } as any)
    const { id, clienttype_id, department_id } = useParams() as any

    useEffect(() => {
        const fetchPosts = () => {
            if (window.innerWidth > 992) {
                dispatch(isClientGet('?is_finish=mix'))
                dispatch(isServiceGet('?is_all=all'))
                dispatch(isGraphGet(''))
                dispatch(isDepartmentGet(''))
            }
        };
        return () => {
            fetchPosts();
        };
    }, [])
    const [cash, setCash] = useState(false)
    const path = useNavigate()
    const allShow = async (data: any) => {
        try {
            setLoad(() => true)
            let res = await axios.get(`/client?doctor_show_person_id=${data?.person_id}&is_finish=${statusColor(data?.client_item?.at(-1)?.client_result?.at(-1)?.is_check_doctor, true)}`)
            const { result } = res.data
            console.log(result);
            dispatch(isDoctorTargetData({
                ...result?.data,
                time: result?.time,
                target: result?.data?.client_item?.at(-1)
            }))
            path(`/customer/${statusColor(result?.data?.client_item?.at(-1)?.client_result?.at(-1)?.is_check_doctor, true)}/${result?.data?.person_id}`)
            // setCash(() => true)
        } catch (error) {

        } finally {
            setLoad(() => false)
        }
    }

    return (
        // <Content loading={load} >
        //     <Navbar />
        <>

            <div className="">
                <div className="my-1 gap-3 d-none d-lg-flex">
                    <form className='row w-100'>
                        <div className="col-3 d-flex gap-1">
                            <div className='w-50'>

                                <Input type='date' disabled={isLoading ? true : false} onChange={(e: any) => {
                                    let value = e.target.value
                                    if (value && value.length > 0) {
                                        dispatch(isClientGet(`?start_date=${value}&end_date=${clientData?.end_date}&is_finish=${tab.value}`))
                                    }
                                }}
                                    value={clientData?.start_date}
                                />
                            </div>
                            <div className='w-50'>
                                <Input type='date' disabled={isLoading ? true : false} min={clientData?.start_date} onChange={(e: any) => {
                                    let value = e.target.value
                                    if (value && value.length > 0) {
                                        dispatch(isClientGet(`?start_date=${clientData?.start_date}&end_date=${value}&is_finish=${tab.value}`))
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
                                        if (e.key === 'Enter') {
                                            setSearch((res: any) => {
                                                return {
                                                    ...res,
                                                    phone: '',
                                                    person_id: '',
                                                    data_birth: '',
                                                }
                                            })
                                            dispatch(isClientGet(`?start_date=${clientData?.start_date}&end_date=${clientData?.end_date}&full_name=${e.target.value?.trim().toLowerCase()}&is_finish=${tab.value}`))
                                        }
                                    }
                                }
                                value={search?.full_name}
                            />
                        </div>
                        <div className="col-2">
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
                                        if (e.key === 'Enter') {
                                            setSearch((res: any) => {
                                                return {
                                                    ...res,
                                                    full_name: '',
                                                    person_id: '',
                                                    data_birth: '',
                                                }
                                            })
                                            dispatch(isClientGet(`?start_date=${clientData?.start_date}&end_date=${clientData?.end_date}&phone=${e.target.value?.trim().toLowerCase()}&is_finish=${tab.value}`))
                                        }
                                    }
                                }
                                value={search?.phone}
                            />
                        </div>
                        <div className="col-3 gap-2 d-flex">
                            <div className="w-50">

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
                                            if (e.key === 'Enter') {
                                                setSearch((res: any) => {
                                                    return {
                                                        ...res,
                                                        phone: '',
                                                        full_name: '',
                                                        data_birth: '',
                                                    }
                                                })
                                                dispatch(isClientGet(`?start_date=${clientData?.start_date}&end_date=${clientData?.end_date}&person_id=${e.target.value?.trim().toLowerCase()}&is_finish=${tab.value}`))
                                            }
                                        }
                                    }
                                    value={search?.person_id}
                                />
                            </div>
                            <div className="w-50">
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
                                            if (e.key === 'Enter') {
                                                setSearch((res: any) => {
                                                    return {
                                                        ...res,
                                                        phone: '',
                                                        full_name: '',
                                                        person_id: '',
                                                    }
                                                })
                                                dispatch(isClientGet(`?start_date=${clientData?.start_date}&end_date=${clientData?.end_date}&data_birth=${e.target.value?.trim().toLowerCase()}&is_finish=${tab.value}`))
                                            }
                                        }
                                    }
                                    value={search?.data_birth}
                                />
                            </div>
                        </div>
                        <div className="col-2">
                            <Select
                                name='name'
                                value={tab}
                                isDisabled={isLoading ? true : false}
                                onChange={(e: any) => {
                                    setSearch((res: any) => {
                                        return {
                                            ...res,
                                            phone: '',
                                            full_name: '',
                                            person_id: '',
                                            data_birth: '',
                                        }
                                    })
                                    dispatch(isClientGet(`?start_date=${clientData?.start_date}&end_date=${clientData?.end_date}&is_finish=${e.value}`))
                                    setTab((res: any) => e)
                                    // dispatch(isGraphGet(`?year=${graphData?.current_year?.value ?? ''}&month=${e?.value ?? ''}&department_id=${user?.department.id ?? ''}`))
                                }}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                options={
                                    [

                                        {
                                            label: "Barchasi",
                                            value: "mix"
                                        },
                                        {
                                            label: "Kutilyabdi",
                                            value: "waiting"
                                        },
                                        {
                                            label: "Tekshirimoqda",
                                            value: "in_room"
                                        },
                                        {
                                            label: "Tayyor",
                                            value: "finish"
                                        },

                                    ]
                                } />
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
                        {
                            +user?.can_accept ?
                                <button className="btn btn-primary " type="button" onClick={() => {
                                    setModal(true)
                                    setItem(() => {
                                        return {
                                            reset: true
                                        }
                                    })
                                }}>Qoshish</button> : ''
                        }
                    </div>
                </div>
                <div className="card d-none d-lg-block" style={{
                    height: `${window.innerHeight / 1.4}px`,
                    overflow: 'auto'
                }}>
                    <Table


                        trConditionClassFunction={(e: any) => {
                            console.log('coni', e);
                            const { is_pay } = e.client_item.at(-1) || {}
                            return +is_pay ? '' : 'bg-secondary text-white'
                        }}
                        deletedispatchFunction={isClientDelete}
                        setNumberOfPages={setNumberOfPages}
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
                            dispatch(isClientGet('?is_finish=mix'))
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
                            const { is_pay, client_value, client_result, id } = item?.client_item?.at(-1) || {}
                            let is_result = client_result?.at(-1)?.is_check_doctor == 'finish'
                            return <>
                                {
                                    +is_pay ? <>
                                        <button className={`btn btn-sm btn-${is_result ? 'success' : 'danger'} rounded-pill btn-icon  btn-xl`}

                                            type='button'
                                            onClick={() => {
                                                alertSoket({
                                                    client_value: client_value,
                                                    client_result: client_result
                                                })
                                            }}
                                        >
                                            {
                                                is_result ? <FaCheckCircle size={16} /> : <MdNotifications size={16} />
                                            }


                                        </button>
                                        <button className='btn btn-info btn-sm'
                                            onClick={() => {
                                                allShow(item)
                                                // dispatch(isDoctorTargetData({
                                                // }))
                                                // path(`/customer/${item?.person_id}`)
                                                // path('/customer/'+item.client_item?.at(-1).id)
                                                // setItem(() => item.client_item.at(-1))
                                                // setModal(true)
                                            }}
                                        >
                                            Batafsil
                                        </button>
                                    </>


                                        : +user?.can_accept ? <button className='btn btn-info btn-sm'
                                            onClick={() => {
                                                allShow(item)
                                                // dispatch(isDoctorTargetData({
                                                // }))
                                                // path(`/customer/${item?.person_id}`)
                                                // path('/customer/'+item.client_item?.at(-1).id)
                                                // setItem(() => item.client_item.at(-1))
                                                // setModal(true)
                                            }}
                                        >
                                            Batafsil
                                        </button> : ''
                                }

                            </>
                        }}
                        extraKeys={[
                            'full_name',
                            'phone_',
                            'data_birth_',
                            'person_id_',
                            // 'probirka_',
                            // kassa
                            // 'client_item_count',
                            'welcome_count_',
                            'queue_number_',
                            'created_at_'
                        ]}
                        columns={[
                            {
                                title: '№',
                                key: 'id',
                                renderItem: (value: any, data: any,) => {
                                    const { is_check_doctor, client_value, client_result } = data?.client_item?.at(-1) ?? {}
                                    return <td className={`bg-${statusColor(client_result?.at(-1)?.is_check_doctor)} text-white`}>
                                        <span>
                                            {((data?.index + 1) + (page * pageLimit) - pageLimit)}
                                        </span>
                                    </td>
                                }
                            },
                            {
                                title: "F.I.O",
                                key: 'full_name',
                                render: (value: any, data: any) => {
                                    return <b>{fullName(value)}</b>
                                }
                            },
                            {
                                title: 'Tel',
                                key: 'phone_',
                                render: (value: any, data: any) => {
                                    return `+998${value?.client_item?.at(-1)?.phone}`
                                }
                            },
                            {
                                title: 'Yoshi',
                                key: 'data_birth_',
                                render: (value: any, data: any) => {
                                    return calculateAge(value?.client_item?.at(-1)?.data_birth, user?.graph_format_date)
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
                                title: 'Tashriflar soni',
                                key: 'welcome_count_',
                                render: (value: any, data: any) => {
                                    return <>
                                        <NumericFormat displayType="text"
                                            thousandSeparator
                                            decimalScale={2}
                                            value={value?.welcome_count} /></>
                                }
                            },
                            {
                                title: 'Navbati',
                                key: 'queue_number_',
                                renderItem: (value: any, data: any,) => {
                                    const { is_check_doctor, client_value } = value?.client_item?.at(-1) ?? {}
                                    return <td className={``}>
                                        <NumericFormat displayType="text"
                                            thousandSeparator
                                            decimalScale={2}
                                            value={client_value?.at(0)?.queue_number} /></td>
                                }
                            },
                            {
                                title: 'Kelgan vaqti',
                                key: 'created_at_',
                                render: (value: any, data: any) => {
                                    return `${getCurrentDateTime(value?.client_item.at(-1)?.created_at)}`
                                }

                            },

                        ]}
                        dataSource={
                            filter(clientData?.data, search)
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

                                dispatch(isClientGet(`?is_finish=${tab?.value}&start_date=${clientData?.start_date}&end_date=${clientData?.end_date}&data_birth=${search?.data_birth}&full_name=${search?.full_name}&person_id=${search?.person_id}&status=${clientData?.use_status}&phone=${search?.phone}&page=${1}&per_page=${e}`))
                            }}

                            pageLmit={clientData?.per_page}
                            current={clientData?.current_page} total={clientData?.last_page} count={(e: any) => {

                                dispatch(isClientGet(`?is_finish=${tab?.value}&start_date=${clientData?.start_date}&end_date=${clientData?.end_date}&data_birth=${search?.data_birth}&full_name=${search?.full_name}&person_id=${search?.person_id}&status=${clientData?.use_status}&phone=${search?.phone}&page=${e}&per_page=${clientData?.per_page}`))
                            }} />
                }
            </div>

            <Loader loading={load} />
            <ClientAdd
                modal={modal} setModal={setModal}
                setData={setItem} data={item} />
        </>


        // </Content>
    )
}

export default DoctorDesctoWelcome