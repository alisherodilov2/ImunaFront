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
import { isAddAllDebtClient, isClientAddExcelFile, isClientCurrentPage, isClientDelete, isClientGet, isClientPageLimit, isTornametClient } from '../../../service/reducer/ClientReducer'
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
import { isTreatmentGet } from '../../../service/reducer/TreatmentReducer'
import { isReferringDoctorGet } from '../../../service/reducer/ReferringDoctorReducer'
const Bloodtest = () => {
    const dataSelect = (data: any) => {
        let res = [...data].sort((a: any, b: any) => b.id - a.id);
        return res?.map((item: any) => {
            return {
                value: item?.id, label: item?.name || item?.type,
                data: item
            }
        })
    }
    const { user, target_branch } = useSelector((state: ReducerType) => state.ProfileReducer)
    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const [data, setData] = useState({
        data: [],
        start_date: '',
        end_date: ''
    } as any)
    // const dispatch = useDispatch<AppDispatch>()
    const clientAllData = async (data?: any) => {
        try {
            setData({
                start_date: '',
                end_date: '',
                data: [],
            })
            setLoad(() => true)
            let res = await axios.get(`/client/bloodtest?${data ?? ''}`)
            const { result } = res.data
            // setData(() => result)
            setData(() => result)
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
    const { departmentData, } = useSelector((state: ReducerType) => state.DepartmentReducer)
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
        branch: target_branch == 'all' ? { label: 'Barcha filallar', value: 'all' } : (target_branch > 0 ? user?.branch?.find((item: any) => item?.value == target_branch) : user?.branch?.at(0)),
        full_name: '',
        phone: '',
        person_id: '',
        probirka: '',
        data_birth: '',
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
        clientAllData(`branch_id=${target_branch > 0 || target_branch == 'all' ? target_branch : user?.branch?.at(0)?.value}`)


    }, [])
    useEffect(() => {

    }, [])
    const [sendLoading, setSendLoading] = useState(false)
    const bloodtestAccept = async (id: any) => {
        try {
            setSendLoading(() => true)
            let res = await axios.get('/client/bloodtest/accept/' + id)
            const { result } = res.data
            setData(() => {
                return {
                    ...data,
                    data: data?.data.map((item: any) => item.person_id === result.person_id ? {
                        ...item,
                        client_item: item?.client_item?.map((item2: any) => item2?.id === result?.id ? { ...result, } : item2)

                    } : item),
                }

            })

        } catch (error) {

        }
        finally {
            setSendLoading(() => false)
        }
    }
    const [cash, setCash] = useState(false)
    return (
        <Content loading={sendLoading}  >
            <br />
            <Navbar />
            <div className="container-fluid flex-grow-1 py-1 size_16 ">
                <div className="d-block d-lg-flex my-1 gap-0 gap-lg-3">
                    <form className='row w-auto w-lg-100'>
                        <div className={`col-lg-${user?.is_main_branch ? 4 : 3} d-flex align-items-center gap-1`}>
                            <Input type='date'
                                disabled={load}

                                onChange={(e: any) => {
                                    let value = e.target.value
                                    if (value && value.length > 0) {
                                        clientAllData(`end_date=${data?.end_date}&start_date=${value}&branch_id=${search?.branch?.value}`)
                                    }
                                }}
                                value={data?.start_date}
                            />
                            <Input type='date'
                                disabled={load}
                                onChange={(e: any) => {
                                    let value = e.target.value
                                    if (value && value.length > 0) {
                                        clientAllData(`end_date=${data?.end_date}&start_date=${value}&branch_id=${search?.branch?.value}`)
                                    }
                                }}
                                value={data?.start_date}
                            />
                        </div>

                        <div className="col-2   d-none d-lg-block">
                            <Input
                                disabled={load}

                                placeholder='F.I.O Izlash...' onChange={(e: any) => {
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
                                            // dispatch(isClientGet(`?start_date=${clientData?.start_date}&end_date=${clientData?.end_date}&full_name=${e.target.value?.trim().toLowerCase()}`))
                                            clientAllData(`end_date=${data?.end_date}&start_date=${data?.start_date}&branch_id=${search?.branch?.value}&full_name=${e.target.value?.trim().toLowerCase()}`)
                                        }
                                    }
                                }
                                value={search?.full_name}
                            />
                        </div>
                        <div className="col-2  d-none d-lg-block">
                            <Input
                                disabled={load}

                                placeholder='Telefon Izlash...' onChange={(e: any) => {
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
                                            // dispatch(isClientGet(`?start_date=${clientData?.start_date}&end_date=${clientData?.end_date}&phone=${e.target.value?.trim().toLowerCase()}`))
                                            clientAllData(`end_date=${data?.end_date}&start_date=${data?.start_date}&branch_id=${search?.branch?.value}&phone=${e.target.value?.trim().toLowerCase()}`)
                                        }
                                    }
                                }
                                value={search?.phone}
                            />
                        </div>
                        <div className="col-1  d-none d-lg-block">
                            <Input
                                disabled={load}

                                placeholder='ID Izlash...' onChange={(e: any) => {
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
                                            // dispatch(isClientGet(`?start_date=${clientData?.start_date}&end_date=${clientData?.end_date}&person_id=${e.target.value?.trim().toLowerCase()}`))
                                            clientAllData(`end_date=${data?.end_date}&start_date=${data?.start_date}&branch_id=${search?.branch?.value}&person_id=${e.target.value?.trim().toLowerCase()}`)
                                        }
                                    }
                                }
                                value={search?.person_id}
                            />
                        </div>
                        <div className="col-2  d-none d-lg-block">
                            <Input
                                disabled={load}
                                type='date' onChange={(e: any) => {
                                    setSearch((res: any) => {
                                        return {
                                            ...res,
                                            data_birth: e.target.value
                                        }
                                    })
                                }}
                                onKeyDown={
                                    (e: any) => {
                                        if (e.key === 'Enter' && e.target.value?.trim().length > 0) {
                                            // dispatch(isClientGet(`?start_date=${clientData?.start_date}&end_date=${clientData?.end_date}&data_birth=${e.target.value?.trim().toLowerCase()}`))
                                            clientAllData(`end_date=${data?.end_date}&start_date=${data?.start_date}&branch_id=${search?.branch?.value}&data_birth=${e.target.value?.trim().toLowerCase()}`)
                                        }
                                    }
                                }
                                value={search?.data_birth}
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
                                    full_name: '',
                                    data_birth: '',
                                    phone: '',
                                    person_id: '',
                                    branch: user?.branch?.at(0)
                                }
                            })
                            clientAllData()
                        }}
                        top={100}
                        scrollRole={true}
                        editRole={false}
                        deleteRole={false}
                        limit={pageLimit}
                        extraKeys={[

                            'full_name',
                            'phone_',
                            'data_birth_',
                            'person_id_',
                            'probirka'

                            // 'created_at_'
                        ]}
                        extraButtonRole={true}
                        extraButton={function (item: any) {
                            const { is_check_doctor, id } = item.client_item?.at(-1).client_result?.at(-1)
                            return is_check_doctor == 'start' ? <p className='alert alert-success'>
                                Qabul qilindi
                            </p> : <>
                                <button className='btn btn-warning btn-sm'
                                    onClick={() => {
                                        bloodtestAccept(id)
                                    }}
                                >
                                    Qabul qilish
                                </button>
                            </>
                        }}
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
                                        allShow(value?.person_id)
                                    }}>

                                        <b>{fullName(value)}</b>
                                        <br />
                                        <span className='text-info register_date'  >
                                            {getCurrentDateTime(value?.client_item?.at(-1)?.created_at)}
                                        </span>
                                        <br />

                                    </td>
                                }
                            },
                            {
                                title: 'Tel',
                                key: 'phone_',
                                render: (value: any, data: any) => {
                                    return `+998${value.phone}`
                                }
                            },
                            {
                                title: 'Tugilgan sana',
                                key: 'data_birth_',
                                render: (value: any, data: any) => {
                                    return value.data_birth
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
                                title: 'Probirka',
                                key: 'probirka',
                                render: (value: any, data: any) => {
                                    return (value?.client_item?.at(-1)?.probirka_id)
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
                    load ? '' :
                        <Pagination
                            setPageLimit={(e: any) => {
                                // setNumberOfPages(Math.ceil(clientData?.length / e))
                                // setPageLimit(e)
                                // dispatch(isClientCurrentPage(1))
                                // dispatch(isClientPageLimit(e))

                                (clientAllData(`start_date=${data?.start_date}&end_date=${data?.end_date}&data_birth=${search?.data_birth}&full_name=${search?.full_name}&person_id=${search?.person_id}&phone=${search?.phone}&page=${1}&per_page=${e}`))
                            }}

                            pageLmit={data?.per_page}
                            current={data?.current_page} total={data?.last_page} count={(e: any) => {

                                (clientAllData(`start_date=${data?.start_date}&end_date=${data?.end_date}&data_birth=${search?.data_birth}&full_name=${search?.full_name}&person_id=${search?.person_id}&phone=${search?.phone}&page=${e}&per_page=${data?.per_page}`))
                            }} />
                }
            </div>

        </Content>
    )
}

export default Bloodtest