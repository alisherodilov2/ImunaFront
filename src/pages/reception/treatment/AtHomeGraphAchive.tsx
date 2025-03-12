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
import { isChangeClientGraphAchiveTarget, isClientAddExcelFile, isClientCurrentPage, isClientDelete, isClientGet, isClientPageLimit } from '../../../service/reducer/ClientReducer'
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
import GraphAdd from '../graph/GraphAdd'
import { isAddGraphAchiveAll, isEditGraphAchive, isGraphGet } from '../../../service/reducer/GraphReducer'
import { BiCalendarCheck } from 'react-icons/bi'
import RegGraphAdd from '../graph/RegGraphAdd'
import { AiFillEdit } from 'react-icons/ai'
import { FaBoxOpen, FaCheckCircle, FaCircle, FaHome, FaHospitalSymbol, FaRegPlusSquare } from 'react-icons/fa'
import { generateCheck } from '../../../helper/generateCheck'
import { chegirmaHisobla } from '../../../helper/cashRegHelper'
import { calculateAge } from '../../../helper/calculateAge'
import { findMaxGraphItem } from '../../../helper/treatmentHelper'
import { isTreatmentGet } from '../../../service/reducer/TreatmentReducer'
import TableLoader from '../../../componets/table/TableLoader'
import { came_graph_archive_item_count, formatDateMonthName, generateDayArray, graphAChiveStatus } from '../../../helper/graphHelper'
import ClientAdd from '../register/ClientAdd'
import ClientAllSetting from '../register/ClientAllSetting'
import ChekPrintPage from '../register/ChekPrintPage'
const AtHomeGraphAchive = () => {
    const [data, setData] = useState([] as any)

    const [load, setLoad] = useState(false)
    const getData = async (data?: any) => {
        try {
            let query = ''
            if (data) {
                query = data
            }
            setLoad(() => true)
            let res = await axios.get(`/graph/at-home-treatment?${query}`)
            const { result } = res.data
            console.log(result);
            dispatch(isAddGraphAchiveAll(result))
            // setData(() => result)
            // setCash(() => true)
        } catch (error) {

        } finally {
            setLoad(() => false)
        }
    }
    const statusChange = async (id: any, status: any, comment?: any) => {
        try {
            setLoad(() => true)
            let res = await axios.post(`/graph/treatment/${id}`, {
                status: status,
                comment: comment ?? '-'
            })
            const { result } = res.data
            console.log(result);
            dispatch(isEditGraphAchive(result))
            Swal.fire("Saqlandi!", "", "success");
            // setCash(() => true)
        } catch (error) {

        } finally {
            setLoad(() => false)
        }
    }
    const dataSelect = (data: any) => {
        return data?.map((item: any) => {
            return {
                value: item?.id, label: item?.name || item?.type,
                data: item
            }
        })
    }
    const [clientShow, setClientShow] = useState(false)
    const [clientAllData, setClientAllData] = useState({} as any)
    const [showLoad, setShowLoad] = useState(false)
    const allShow = async (id: any) => {
        try {
            setShowLoad(() => true)
            let res = await axios.get('/client?show_person_id=' + id)
            const { result } = res.data
            setClientAllData({})
            setClientAllData(() => {
                return {

                    ...result.data,
                    at_home: result.at_home,
                    treatment: result.treatment,
                }
            })
            setClientShow(true)
        } catch (error) {

        } finally {
            setShowLoad(() => false)
        }
    }
    const { graph_achive, } = useSelector((state: ReducerType) => state.GraphReducer)
    const { treatmentData, } = useSelector((state: ReducerType) => state.TreatmentReducer)
    const { user, } = useSelector((state: ReducerType) => state.ProfileReducer)
    const [modal, setModal] = useState(false)
    const [modaledit, setModaledit] = useState(false)
    const [modal2, setModal2] = useState(false)
    const [modal3, setModal3] = useState(false)
    const [modal4, setModal4] = useState(false)
    const [item, setItem] = useState({} as any)
    const [item2, setItem2] = useState({} as any)
    const { client_graph_achive_target, page, clientData, massage, isLoading, isSuccess, pageLimit } = useSelector((state: ReducerType) => state.ClientReducer)
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

    const treatmentShow = async (graph_id: any, target: any) => {
        try {
            setLoad(() => true)
            let res = await axios.get(`/graph/treatment-show?graph_achive_id=${graph_id}`)
            const { result } = res.data
            // setItem({ ...result, ...target?.person, graph_archive_id: result?.id, treatment: result?.treatment,graph_archive:result })
            setItem({ ...result, ...result.person, use_status: result.use_status, graph_archive_id: result?.id, treatment: result?.treatment, graph_archive: result, at_home_data: result?.at_home_client,balance:result?.person?.balance,is_cash_open:true })
            setModal3(true)
            // setItem({})
            // setItem(() => result)
            // setCash(() => true)
        } catch (error) {

        } finally {
            setLoad(() => false)
        }
    }

    const [serachText, setSerachText] = useState('')

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
    const [days, setdays] = useState([]);
    const [search, setSearch] = useState({
        is_today: false,
        client_status: '',
        all: true,
        start_age: '',
        end_age: '',
        full_name: '',
        age: '',
        phone: '',
        status: {
            label: 'Muolajadagilar',
            value: ''
        },
        treatment_id: {
            label: 'Muolaja turi',
            value: ''
        },
        index: {
            label: 'Kun tanlang',
            value: '-'
        }
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

    const { id, clienttype_id, department_id } = useParams() as any
    useEffect(() => {
        getData()
        dispatch(isTreatmentGet(''))
        dispatch(isServiceGet(''))
        dispatch(isDepartmentGet(''))
        if (data?.came_graph_archive_item_count) {
            setdays(data?.came_graph_archive_item_count)
        }
    }, [])
    useEffect(() => {
        if (client_graph_achive_target?.id > 0) {
            dispatch(isAddGraphAchiveAll({
                ...graph_achive,
                data: graph_achive?.data?.map((item: any) => item?.id == client_graph_achive_target?.id ? client_graph_achive_target : item)
            }))
            dispatch(isChangeClientGraphAchiveTarget({}))
        }
    }, [client_graph_achive_target])
    const [cash, setCash] = useState(false)
    return (
        <Content loading={showLoad} >
            <Navbar />
            <div className="container-fluid flex-grow-1 py-1 size_16 ">
                <div className="d-flex my-1 gap-3">
                    <div className='row w-100'
                    // onSubmit={(e: any) => {
                    //     e.preventDefault()
                    // }}
                    >
                        {/* <div className="col-2 d-flex align-items-center gap-2">
                            <div className='d-flex gap-2 align-items-center'>
                                <label htmlFor="all">Hammasi</label>
                                <div className="form-check ">
                                    <input
                                        id='all'
                                        className="form-check-input float-end" type="checkbox" role="switch"
                                        checked={search?.all}
                                        onChange={(e: any) => {
                                            let value = e.target.checked
                                            setSearch((res: any) => {
                                                return {
                                                    ...res,
                                                    all: e.target.checked,
                                                    is_today: value ? false : true,
                                                    client_status: '',
                                                    index: {
                                                        label: 'Kun tanlang',
                                                        value: '-'
                                                    }
                                                }
                                            })
                                            let query = `end_age=${(search?.end_age)}&start_age=${(search?.start_age)}&phone=${search.phone}&full_name=${search?.full_name?.trim().toLowerCase()}&is_today=${value ? '0' : '1'}&index=-&treatment_id=${search?.treatment_id?.value ?? ''}&status=${search?.status?.value ?? ''}`
                                            getData(query)

                                            // console.log(+e.target.checked);
                                            // setCheckbox({
                                            //     ...checkbox,
                                            //     is_shikoyat: e.target.checked
                                            // })
                                            // setValue('is_shikoyat', e.target.checked ? '1' : '0', {
                                            //     shouldValidate: false,
                                            // })

                                        }}

                                    />
                                </div>


                            </div>
                            <div className='d-flex gap-2 align-items-center'>
                                <label htmlFor="is_today">Bugun</label>
                                <div className="form-check ">
                                    <input className="form-check-input float-end" type="checkbox" role="switch"
                                        // checked={checkbox?.is_shikoyat}
                                        id='is_today'
                                        checked={search?.is_today}
                                        onChange={(e: any) => {
                                            let value = e.target.checked
                                            setSearch((res: any) => {
                                                return {
                                                    ...res,
                                                    all: value ? false : true,
                                                    is_today: e.target.checked,
                                                    client_status: '',
                                                    index: {
                                                        label: 'Kun tanlang',
                                                        value: '-'
                                                    }
                                                }
                                            })
                                            let query = `end_age=${(search?.end_age)}&start_age=${(search?.start_age)}&phone=${search.phone}&full_name=${search?.full_name?.trim().toLowerCase()}&is_today=${value ? '1' : '0'}&index=-&treatment_id=${search?.treatment_id?.value ?? ''}&status=${search?.status?.value ?? ''}`
                                            getData(query)
                                        }}

                                    />
                                </div>


                            </div>
                        </div> */}

                        <div className="col-5">
                            <Select
                                name='name'
                                value={search?.treatment_id}
                                onChange={(e: any) => {
                                    setSearch((res: any) => {
                                        return {
                                            ...res,
                                            treatment_id: e,
                                            client_status: '',
                                            index: {
                                                label: 'Kun tanlang',
                                                value: '-'
                                            }
                                        }
                                    })

                                    let query = `end_age=${(search?.end_age)}&start_age=${(search?.start_age)}&phone=${search.phone}&full_name=${search?.full_name?.trim().toLowerCase()}&is_today=${search?.is_today ? '1' : '0'}&index=-&treatment_id=${e.value}&status=${search?.status?.value ?? ''}`
                                    getData(query)
                                    // dispatch(isGraphGet(`?year=${graphData?.current_year?.value ?? ''}&month=${e?.value ?? ''}&department_id=${graphData?.department?.value ?? ''}`))
                                }}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                options={
                                    [
                                        {
                                            label: 'Muolaja turi',
                                            value: ''
                                        },
                                        ...dataSelect(treatmentData)]
                                } />
                        </div>
                        <div className="col-2">
                            <Select
                                name='name'
                                value={search?.status}
                                onChange={(e: any) => {
                                    setSearch((res: any) => {
                                        return {
                                            ...res,
                                            status: e,
                                            client_status: '',
                                            index: {
                                                label: 'Kun tanlang',
                                                value: '-'
                                            }
                                        }
                                    })
                                    let query = `end_age=${(search?.end_age)}&start_age=${(search?.start_age)}&phone=${search.phone}&full_name=${search?.full_name?.trim().toLowerCase()}&is_today=${search?.is_today ? '1' : '0'}&index=-&status=${e?.value ?? ''}&treatment_id=${search?.treatment_id?.value ?? ''}`
                                    getData(query)
                                }}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                options={
                                    [
                                        {
                                            label: 'Muolajadagilar',
                                            value: ''
                                        },
                                        {
                                            label: 'Yakunlngan',
                                            value: 'finish'
                                        },
                                        {
                                            label: 'arxiv',
                                            value: 'archive'
                                        },
                                        {
                                            label: 'Barchasi',
                                            value: 'all'
                                        },
                                    ]
                                } />
                        </div>
                        <div className="col-2">
                            <Select
                                name='name'
                                value={search?.index}
                                onChange={(e: any) => {
                                    // if (search?.client_status?.length == 0) {
                                    setSearch((res: any) => {
                                        return {
                                            ...res,
                                            index: e,
                                            client_status: '',
                                        }
                                    })
                                    let query = `end_age=${(search?.end_age)}&start_age=${(search?.start_age)}&phone=${search.phone}&full_name=${search?.full_name?.trim().toLowerCase()}&is_today=${search?.is_today ? '1' : '0'}&index=${e?.value ?? ''}&treatment_id=${search?.treatment_id?.value ?? ''}&status=${search?.status?.value ?? ''}`
                                    getData(query)
                                    // }
                                }}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                options={
                                    [
                                        {
                                            label: 'Kun tanlang',
                                            value: '-'
                                        },
                                        ...came_graph_archive_item_count(graph_achive?.came_graph_archive_item_count)
                                    ]
                                } />
                        </div>
                        <div className="col-3 d-flex gap-2">
                            <Select
                                name='name'
                                value={search?.client_status}
                                onChange={(e: any) => {
                                    // if (search?.client_status?.length == 0) {
                                    setSearch((res: any) => {
                                        return {
                                            ...res,
                                            client_status: e
                                        }
                                    })
                                    let query = `${e?.value?.length > 0 ? `client_status=${e?.value}` : ''}&end_age=${(search?.end_age)}&start_age=${(search?.start_age)}&phone=${search.phone}&full_name=${search?.full_name?.trim().toLowerCase()}&is_today=${search?.is_today ? '1' : '0'}&index=${search.index.value ?? ''}&treatment_id=${search?.treatment_id?.value ?? ''}&status=${search?.status?.value ?? ''}`
                                    getData(query)


                                    // }
                                }}
                                className="basic-multi-select w-100"
                                classNamePrefix="select"
                                options={
                                    [
                                        {
                                            label: 'Barchasi',
                                            value: ''
                                        },
                                        {
                                            label: 'yangi mijozlar',
                                            value: 'new_client'
                                        },
                                        {
                                            label: 'Tugatgan mijozlar',
                                            value: 'finish_client'
                                        },
                                        {
                                            label: 'Dori olganlar',
                                            value: 'taken'
                                        },
                                        {
                                            label: 'Dori olmaydiganlar',
                                            value: 'not_taken'
                                        },
                                    ]
                                } />
                            <button className="btn btn-success " type="button" onClick={() => {
                                let resultData = [...[].map((item: any, index: number) => {
                                    return {
                                        ["№"]: index + 1,
                                        ["F.I.O"]: fullName(item),
                                        ["Tel"]: `+998${item?.phone}`,
                                        ["Ish joyi "]: item?.workplace,
                                    }
                                })]
                                exportToExcel(resultData)
                            }}>Eksport</button>
                        </div>
                        {/* <div className="col-3 d-flex gap-2">
                            <button className='btn btn-warning d-flex align-items-center gap-1'
                                onClick={() => {
                                    if (search?.client_status == 'new_client') {
                                        setSearch((res: any) => {
                                            return {
                                                ...res,
                                                client_status: ''
                                            }
                                        })
                                        let query = `end_age=${(search?.end_age)}&start_age=${(search?.start_age)}&phone=${search.phone}&full_name=${search?.full_name?.trim().toLowerCase()}&is_today=${search?.is_today ? '1' : '0'}&index=${search.index.value ?? ''}&treatment_id=${search?.treatment_id?.value ?? ''}&status=${search?.status?.value ?? ''}`
                                        getData(query)
                                    } else {
                                        setSearch((res: any) => {
                                            return {
                                                ...res,
                                                client_status: 'new_client'
                                            }
                                        })
                                        let query = `client_status=new_client&end_age=${(search?.end_age)}&start_age=${(search?.start_age)}&phone=${search.phone}&full_name=${search?.full_name?.trim().toLowerCase()}&is_today=${search?.is_today ? '1' : '0'}&index=${search.index.value ?? ''}&treatment_id=${search?.treatment_id?.value ?? ''}&status=${search?.status?.value ?? ''}`
                                        getData(query)
                                    }
                                }}
                                id='corusel__btn'

                            >
                                {
                                    search?.client_status == 'new_client' ? <FaCheckCircle size={24} /> : ''
                                }

                                Yangi mijozlar</button>
                            <button className='btn btn-primary d-flex align-items-center gap-1'
                                onClick={() => {
                                    if (search?.client_status == 'end_client') {
                                        setSearch((res: any) => {
                                            return {
                                                ...res,
                                                client_status: ''
                                            }
                                        })
                                        let query = `end_age=${(search?.end_age)}&start_age=${(search?.start_age)}&phone=${search.phone}&full_name=${search?.full_name?.trim().toLowerCase()}&is_today=${search?.is_today ? '1' : '0'}&index=${search.index.value ?? ''}&treatment_id=${search?.treatment_id?.value ?? ''}&status=${search?.status?.value ?? ''}`
                                        getData(query)
                                    } else {
                                        setSearch((res: any) => {
                                            return {
                                                ...res,
                                                client_status: 'end_client'
                                            }
                                        })
                                        let query = `client_status=end_client&end_age=${(search?.end_age)}&start_age=${(search?.start_age)}&phone=${search.phone}&full_name=${search?.full_name?.trim().toLowerCase()}&is_today=${search?.is_today ? '1' : '0'}&index=${search.index.value ?? ''}&treatment_id=${search?.treatment_id?.value ?? ''}&status=${search?.status?.value ?? ''}`
                                        getData(query)
                                    }
                                }}

                            >
                                {
                                    search?.client_status == 'end_client' ? <FaCheckCircle size={24} /> : ''
                                }
                                Tugatyotkanlar</button>
                            <button className='btn btn-warning d-flex align-items-center gap-1'
                                onClick={() => {
                                    if (search?.client_status == 'waiting') {

                                        setSearch((res: any) => {
                                            return {
                                                ...res,
                                                client_status: ''
                                            }
                                        })
                                        let query = `end_age=${(search?.end_age)}&start_age=${(search?.start_age)}&phone=${search.phone}&full_name=${search?.full_name?.trim().toLowerCase()}&is_today=${search?.is_today ? '1' : '0'}&index=${search.index.value ?? ''}&treatment_id=${search?.treatment_id?.value ?? ''}&status=${search?.status?.value ?? ''}`
                                        getData(query)
                                    } else {
                                        setSearch((res: any) => {
                                            return {
                                                ...res,
                                                client_status: 'waiting'
                                            }
                                        })
                                        let query = `client_status=waiting&end_age=${(search?.end_age)}&start_age=${(search?.start_age)}&phone=${search.phone}&full_name=${search?.full_name?.trim().toLowerCase()}&is_today=${search?.is_today ? '1' : '0'}&index=${search.index.value ?? ''}&treatment_id=${search?.treatment_id?.value ?? ''}&status=${search?.status?.value ?? ''}`
                                        getData(query)
                                    }
                                }}


                            >
                                {
                                    search?.client_status == 'waiting' ? <FaCheckCircle size={24} /> : ''
                                }

                                Kutilyapti</button>
                        </div> */}
                        <div className="col-3">
                            <Input placeholder='F.I.O Izlash...' onChange={(e: any) => {
                                setSearch((res: any) => {
                                    return {
                                        ...res,
                                        full_name: e.target.value?.trim().toLowerCase(),
                                        index: {
                                            label: 'Kun tanlang',
                                            value: '-'
                                        }
                                    }
                                })


                            }}
                                onKeyDown={
                                    (e: any) => {
                                        if (e.key === 'Enter') {
                                            let query = `end_age=${(search?.end_age)}&start_age=${(search?.start_age)}&phone=${search?.phone?.trim().toLowerCase()}&full_name=${e.target.value?.trim().toLowerCase()}&is_today=${search?.is_today ? '1' : '0'}&index=-&treatment_id=${search?.treatment_id?.value ?? ''}&status=${search?.status?.value ?? ''}`
                                            getData(query)
                                            setSearch((res: any) => {
                                                return {
                                                    ...res,
                                                    client_status: '',
                                                }
                                            })
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
                                        phone: e.target.value?.trim().toLowerCase(),
                                        index: {
                                            label: 'Kun tanlang',
                                            value: '-'
                                        }
                                    }
                                })

                            }}
                                onKeyDown={
                                    (e: any) => {
                                        if (e.key === 'Enter') {
                                            let query = `end_age=${(search?.end_age)}&start_age=${(search?.start_age)}&phone=${e.target.value?.trim().toLowerCase()}&full_name=${search?.full_name?.trim().toLowerCase()}&is_today=${search?.is_today ? '1' : '0'}&index=-&treatment_id=${search?.treatment_id?.value ?? ''}&status=${search?.status?.value ?? ''}`
                                            getData(query)
                                            setSearch((res: any) => {
                                                return {
                                                    ...res,
                                                    client_status: '',
                                                }
                                            })
                                        }
                                    }
                                }
                                value={search?.phone}
                            />
                        </div>
                        <div className="col-2">
                            <Input type='number' placeholder='Yoshi dan ' onChange={(e: any) => {
                                setSearch((res: any) => {
                                    return {
                                        ...res,
                                        start_age: e.target.value?.trim().toLowerCase(),
                                        // end_age: search?.end_age ? search?.end_age : e.target.value?.trim().toLowerCase(),
                                        index: {
                                            label: 'Kun tanlang',
                                            value: '-'
                                        }
                                    }
                                })

                            }}
                                onKeyDown={
                                    (e: any) => {
                                        if (e.key === 'Enter') {
                                            let query = `end_age=${(search?.end_age?.length > 0 ? search?.end_age : e.target.value)}&start_age=${(e.target.value)}&phone=${search.phone}&full_name=${search?.full_name?.trim().toLowerCase()}&is_today=${search?.is_today ? '1' : '0'}&index=-&treatment_id=${search?.treatment_id?.value ?? ''}&status=${search?.status?.value ?? ''}`
                                            getData(query)
                                            setSearch((res: any) => {
                                                return {
                                                    ...res,
                                                    client_status: '',
                                                }
                                            })
                                        }
                                    }
                                }
                                value={search?.start_date}
                            />
                        </div>
                        <div className="col-2">
                            <Input min={search?.start_age} type='number' placeholder='Yoshi gacha ' onChange={(e: any) => {
                                setSearch((res: any) => {
                                    return {
                                        ...res,
                                        end_age: e.target.value?.trim().toLowerCase(),
                                        // start_age: search?.start_age ? search?.start_age : e.target.value?.trim().toLowerCase(),
                                        index: {
                                            label: 'Kun tanlang',
                                            value: '-'
                                        }
                                    }
                                })

                            }}
                                onKeyDown={
                                    (e: any) => {
                                        if (e.key === 'Enter') {
                                            let query = `start_age=${(search?.start_age?.length > 0 ? search?.start_age : e.target.value)}&end_age=${(e.target.value)}&phone=${search.phone}&full_name=${search?.full_name?.trim().toLowerCase()}&is_today=${search?.is_today ? '1' : '0'}&index=-&treatment_id=${search?.treatment_id?.value ?? ''}&status=${search?.status?.value ?? ''}`
                                            getData(query)
                                            setSearch((res: any) => {
                                                return {
                                                    ...res,
                                                    client_status: '',
                                                }
                                            })
                                        }
                                    }
                                }
                                value={search?.end_age}
                            />
                        </div>
                        <div className="col-3">

                        </div>
                        {/* <div className="col-3 d-flex gap-2 justify-content-between">

                            <button className='btn btn-primary d-flex align-items-center gap-1'
                                onClick={() => {
                                    if (search?.client_status == 'in_room') {
                                        setSearch((res: any) => {
                                            return {
                                                ...res,
                                                client_status: ''
                                            }
                                        })
                                        let query = `end_age=${(search?.end_age)}&start_age=${(search?.start_age)}&phone=${search.phone}&full_name=${search?.full_name?.trim().toLowerCase()}&is_today=${search?.is_today ? '1' : '0'}&index=${search.index.value ?? ''}&treatment_id=${search?.treatment_id?.value ?? ''}&status=${search?.status?.value ?? ''}`
                                        getData(query)
                                    } else {
                                        setSearch((res: any) => {
                                            return {
                                                ...res,
                                                client_status: 'in_room'
                                            }
                                        })
                                        let query = `client_status=in_room&end_age=${(search?.end_age)}&start_age=${(search?.start_age)}&phone=${search.phone}&full_name=${search?.full_name?.trim().toLowerCase()}&is_today=${search?.is_today ? '1' : '0'}&index=${search.index.value ?? ''}&treatment_id=${search?.treatment_id?.value ?? ''}&status=${search?.status?.value ?? ''}`
                                        getData(query)
                                    }
                                }}

                            >
                                {
                                    search?.client_status == 'in_room' ? <FaCheckCircle size={24} /> : ''
                                }
                                Klinikada</button>
                            <button className='btn btn-success d-flex align-items-center gap-1'

                                onClick={() => {
                                    if (search?.client_status == 'finish') {
                                        setSearch((res: any) => {
                                            return {
                                                ...res,
                                                client_status: ''
                                            }
                                        })
                                        let query = `end_age=${(search?.end_age)}&start_age=${(search?.start_age)}&phone=${search.phone}&full_name=${search?.full_name?.trim().toLowerCase()}&is_today=${search?.is_today ? '1' : '0'}&index=${search.index.value ?? ''}&treatment_id=${search?.treatment_id?.value ?? ''}&status=${search?.status?.value ?? ''}`
                                        getData(query)
                                    } else {

                                        setSearch((res: any) => {
                                            return {
                                                ...res,
                                                client_status: 'finish'
                                            }
                                        })
                                        let query = `client_status=finish&end_age=${(search?.end_age)}&start_age=${(search?.start_age)}&phone=${search.phone}&full_name=${search?.full_name?.trim().toLowerCase()}&is_today=${search?.is_today ? '1' : '0'}&index=${search.index.value ?? ''}&treatment_id=${search?.treatment_id?.value ?? ''}&status=${search?.status?.value ?? ''}`
                                        getData(query)
                                    }
                                }}
                            >
                                {
                                    search?.client_status == 'finish' ? <FaCheckCircle size={24} /> : ''
                                }
                                Tasdiqlandi</button>
                            <button className='btn btn-danger d-flex align-items-center gap-1'
                                onClick={() => {
                                    if (search?.client_status == 'no_show') {
                                        setSearch((res: any) => {
                                            return {
                                                ...res,
                                                client_status: ''
                                            }
                                        })
                                        let query = `end_age=${(search?.end_age)}&start_age=${(search?.start_age)}&phone=${search.phone}&full_name=${search?.full_name?.trim().toLowerCase()}&is_today=${search?.is_today ? '1' : '0'}&index=${search.index.value ?? ''}&treatment_id=${search?.treatment_id?.value ?? ''}&status=${search?.status?.value ?? ''}`
                                        getData(query)
                                    } else {

                                        setSearch((res: any) => {
                                            return {
                                                ...res,
                                                client_status: 'no_show'
                                            }
                                        })
                                        let query = `client_status=no_show&end_age=${(search?.end_age)}&start_age=${(search?.start_age)}&phone=${search.phone}&full_name=${search?.full_name?.trim().toLowerCase()}&is_today=${search?.is_today ? '1' : '0'}&index=${search.index.value ?? ''}&treatment_id=${search?.treatment_id?.value ?? ''}&status=${search?.status?.value ?? ''}`
                                        getData(query)
                                    }
                                }}
                            >
                                {
                                    search?.client_status == 'no_show' ? <FaCheckCircle size={24} /> : ''
                                }
                                Kelmadi</button>
                        </div> */}
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
                                <th>Telefon</th>
                                <th>Yoshi</th>

                                {
                                    graph_achive?.data?.length > 0 ? findMaxGraphItem(graph_achive?.data)?.graph_archive_item?.map((res: any, index: number) => {
                                        return (
                                            <th className='p-1'>{
                                                // +search?.index.value >= 0 ? +search?.index.value + 1 : 
                                                (index + 1)
                                            } - Kun</th>
                                        )
                                    }) : <th>
                                        1-kun
                                    </th>
                                }

                                <th>Izoh</th>
                                <th className='d-flex justify-content-between align-items-center'>
                                    <span>Holati</span>

                                    <button type="button" className="btn btn-sm  btn-primary" onClick={() => {
                                        getData()
                                        setSearch((res: any) => {
                                            return {
                                                is_today: false,
                                                client_status: '',
                                                all: true,
                                                start_age: '',
                                                end_age: '',
                                                full_name: '',
                                                age: '',
                                                phone: '',
                                                status: {
                                                    label: 'Muolajadagilar',
                                                    value: ''
                                                },
                                                treatment_id: {
                                                    label: 'Muolaja turi',
                                                    value: ''
                                                },
                                                index: {
                                                    label: 'Kun tanlang',
                                                    value: '-'
                                                }
                                            }
                                        })
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
                                    graph_achive?.data?.length > 0 ? graph_achive?.data?.map((item: any, index: number) => {
                                        return (
                                            <tr>
                                                <td>{index + 1}</td>
                                                <td className='p-1 cursor-pointer' onClick={() => {
                                                    allShow(item?.person_id)
                                                }}
                                                >{fullName(item?.person)}</td>
                                                <td className='p-1'>{item?.person?.phone}</td>
                                                <td className='p-1'>{calculateAge(item?.person?.data_birth, user?.graph_format_date)}</td>
                                                {
                                                    findMaxGraphItem(graph_achive?.data)?.graph_archive_item?.map((res: any, index: number) => {
                                                        {
                                                            let response = item?.graph_archive_item?.[index]
                                                            return response ? (
                                                                <td className={`p-0 m-0 cursor-pointer`}
                                                                    onClick={() => {
                                                                        // if (response?.client_id == 0 || response?.client_id == null) {

                                                                        //     const {
                                                                        //         phone,
                                                                        //         first_name,
                                                                        //         last_name,
                                                                        //         sex,
                                                                        //         data_birth,
                                                                        //         person_id,
                                                                        //         citizenship
                                                                        //     } = item.person
                                                                        //     let result = {
                                                                        //         phone,
                                                                        //         first_name,
                                                                        //         last_name,
                                                                        //         sex,
                                                                        //         data_birth,
                                                                        //         person_id,
                                                                        //         citizenship,
                                                                        //         id: 0,
                                                                        //         department: response?.graph_item?.at(0)?.department,
                                                                        //         agreement_time: response.agreement_time,
                                                                        //         agreement_date: response.agreement_date,
                                                                        //         graph_item_id: response.graph_item_id,
                                                                        //         graph_achive_id: `${item?.id}`,
                                                                        //         // client_value: graphItem.at(0)?.graph_item_value?.map((res: any) => {
                                                                        //         //     console.log(res.service);
                                                                        //         //     return {
                                                                        //         //         ...res,
                                                                        //         //         service_id: res.service?.id,
                                                                        //         //         ...res?.service,
                                                                        //         //         id: 0

                                                                        //         //     }
                                                                        //         // })
                                                                        //     }

                                                                        //     setItem(() => result)
                                                                        //     setModal4(() => true)
                                                                        // }
                                                                        console.log('response', response);
                                                                    }}

                                                                >
                                                                    <p
                                                                        className={`p-1 mb-0 fw-bold d-flex align-items-center gap-2    
                                                                          
                                                                             ${+response?.is_at_home ? 'bg-info text-white' : ` ${Date.parse(user?.graph_format_date) == Date.parse(response?.agreement_date) ? 'border-animate' : 'border-notanimate'} text-white bg-${+response?.is_assigned ? Date.parse(user?.graph_format_date) >= Date.parse(response?.agreement_date) ? 'success' : 'warning' : 'danger'

                                                                                }  `} 
                                                                            `


                                                                        }

                                                                    >

                                                                        {
                                                                            +response?.is_at_home ?
                                                                                <span>
                                                                                    <FaHospitalSymbol size={24} />
                                                                                </span> : <span>
                                                                                    <FaHome size={24} />
                                                                                </span>
                                                                        }
                                                                        {formatDateMonthName(response?.agreement_date)}
                                                                    </p>
                                                                    {/* {response?.agreement_date} */}
                                                                </td>
                                                            ) : <td>-</td>
                                                        }
                                                    })
                                                }
                                                <td className='p-1 text_wrap'>{item?.comment ?? '-'}</td>
                                                <td className='d-flex gap-1 align-items-center'>
                                                    {
                                                        item?.status == 'live' ? <>
                                                            <button className='btn btn-sm btn-primary mb-0'

                                                                onClick={() => {
                                                                    // const {
                                                                    //     first_name, last_name, phone, person_id, data_birth, citizenship, sex
                                                                    // } = item?.person
                                                                    // setItem(() => {
                                                                    //     return {
                                                                    //         first_name: first_name,
                                                                    //         last_name: last_name,
                                                                    //         phone: phone,
                                                                    //         person_id: person_id,
                                                                    //         data_birth: data_birth,
                                                                    //         citizenship: citizenship
                                                                    //         , sex: sex,
                                                                    //         graph_archive_id: item.id,
                                                                    //         use_status: 'treatment',
                                                                    //     }
                                                                    // })
                                                                    // setModal3(true)
                                                                    treatmentShow(item.id, item)
                                                                }}

                                                            > <AiFillEdit /></button>
                                                            <button className='btn btn-sm btn-primary mb-0'
                                                                onClick={() =>
                                                                //  statusChange(item.id, 'finish')
                                                                {
                                                                    Swal.fire({
                                                                        title: "Yakunlash uchun izoh kiriting!",
                                                                        input: "text",
                                                                        inputAttributes: {
                                                                            autocapitalize: "off",
                                                                            required: "required" // Use a string instead of a boolean
                                                                        },
                                                                        showCancelButton: true,
                                                                        confirmButtonText: "Submit",
                                                                        showLoaderOnConfirm: true,
                                                                        preConfirm: (inputValue) => {
                                                                            return new Promise((resolve: any) => {
                                                                                // Your preConfirm logic here, for example:
                                                                                if (!inputValue) {
                                                                                    Swal.showValidationMessage("Izoh kiritish majburiy!");
                                                                                }
                                                                                resolve();
                                                                            });
                                                                        }
                                                                    })
                                                                        .then((result: any) => {
                                                                            if (result.isConfirmed) {
                                                                                //   console.log("Foydalanuvchi kiritgan qiymat:", result.value); // Final value after confirmation
                                                                                //   alert(result.value)
                                                                                statusChange(item.id, 'finish', result.value)
                                                                            }
                                                                        });
                                                                }
                                                                }

                                                            >Yakunlandi</button>
                                                            <button className='btn btn-sm btn-primary mb-0'
                                                                onClick={() => {
                                                                    Swal.fire({
                                                                        title: "Arxivlash uchun izoh kiriting!",
                                                                        input: "text",
                                                                        inputAttributes: {
                                                                            autocapitalize: "off",
                                                                            required: "required" // Use a string instead of a boolean
                                                                        },
                                                                        showCancelButton: true,
                                                                        confirmButtonText: "Submit",
                                                                        showLoaderOnConfirm: true,
                                                                        preConfirm: (inputValue) => {
                                                                            return new Promise((resolve: any) => {
                                                                                // Your preConfirm logic here, for example:
                                                                                if (!inputValue) {
                                                                                    Swal.showValidationMessage("Izoh kiritish majburiy!");
                                                                                }
                                                                                resolve();
                                                                            });
                                                                        }
                                                                    })
                                                                        .then((result: any) => {
                                                                            if (result.isConfirmed) {
                                                                                //   console.log("Foydalanuvchi kiritgan qiymat:", result.value); // Final value after confirmation
                                                                                //   alert(result.value)
                                                                                statusChange(item.id, 'archive', result.value)
                                                                            }
                                                                        });


                                                                }
                                                                }
                                                            >Arxivlandi</button>
                                                        </> : <>-</>
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
            </div>
            {
                modal3 ? <RegGraphAdd
                    modal={modal3} setModal={setModal3}
                    setData={setItem} data={item} /> : <></>
            }

            {modal4 ?
                <ClientAdd
                    modal={modal4} setModal={setModal4}
                    // setExtraModalClose={toggle}
                    setData={setItem} data={item} /> : <></>
            }
            {clientShow ?
                <ClientAllSetting
                    modal={clientShow} setModal={setClientShow}
                    data={clientAllData} /> : <></>
            }
            <ChekPrintPage />
        </Content>
    )
}

export default AtHomeGraphAchive