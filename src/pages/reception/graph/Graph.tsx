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
import { isGraphAddExcelFile, isGraphCurrentPage, isGraphDelete, isGraphGet, isGraphPageLimit } from '../../../service/reducer/GraphReducer'
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
import GraphAdd from './GraphAdd'
import { generateCalendar, getWeekData, graphItemSortTimes, phoneFormatNumber } from '../../../helper/graphHelper'
import { dateFormat } from '../../../service/helper/day'
import { BsDatabaseFillX } from 'react-icons/bs'
import Masonry from 'react-masonry-css'
import { isDepartmentGet } from '../../../service/reducer/DepartmentReducer'
import { AiFillEdit } from 'react-icons/ai'
import TableLoader from '../../../componets/table/TableLoader'
const Graph = () => {
    const dataSelect = (data: any) => {
        let res = [...data]
        return res?.map((item: any) => {
            return {
                value: item?.id, label: item?.name || item?.type,
                data: item
            }
        })
    }
    const [modal, setModal] = useState(false)
    const [modal2, setModal2] = useState(false)
    const [item, setItem] = useState({} as any)
    const [item2, setItem2] = useState({} as any)
    const { user } = useSelector((state: ReducerType) => state.ProfileReducer)
    const { page, graphData, massage, isLoading, isSuccess, pageLimit } = useSelector((state: ReducerType) => state.GraphReducer)
    const isLoadingDeart = useSelector((state: ReducerType) => state.DepartmentReducer.isLoading)
    const isLoadingser = useSelector((state: ReducerType) => state.ServiceReducer.isLoading)
    const { departmentData, } = useSelector((state: ReducerType) => state.DepartmentReducer)
    const departmentDataApi = useSelector((state: ReducerType) => state.DepartmentReducer.isLoading)

    // const [pageLmit, setPageLimit] = useState(() => 5)
    const [numberOfPages, setNumberOfPages] = useState(Math.ceil(graphData?.length / pageLimit))
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
                dispatch(isGraphDelete({ all: [...new Set(checkData?.map((idAll: any) => idAll?.id))] }))
                setCheckData([])
            }
        })
        // dispatch(deletedispatchFunction(id))

    }
    const oylar = [
        { label: "yanvar", value: 1 },
        { label: "fevral", value: 2 },
        { label: "mart", value: 3 },
        { label: "aprel", value: 4 },
        { label: "may", value: 5 },
        { label: "iyun", value: 6 },
        { label: "iyul", value: 7 },
        { label: "avgust", value: 8 },
        { label: "sentyabr", value: 9 },
        { label: "oktyabr", value: 10 },
        { label: "noyabr", value: 11 },
        { label: "dekabr", value: 12 }
    ];
    const payShow = async (id: any) => {
        try {
            setLoad(() => true)
            let res = await axios.get('/graph?graph_id=' + id)
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
            let res = await axios.get('/?graph_id=' + id)
            const { result } = res.data
            setItem2(() => result)

            setModal2(() => true)
        } catch (error) {

        } finally {
            setLoad(() => false)
        }
    }
    const [search, setSearch] = useState({
        department: {
            label: graphData?.department?.name,
            value: graphData?.department?.id,
        },
        month: {
            ...oylar?.find((res: any) => res?.value == graphData?.month)
        }
    } as any)
    const filter = (data: any, serachData: any) => {
        if (serachData?.full_name?.length > 0 && serachData?.phone?.length == 0 && serachData?.person_id?.length == 0 && serachData?.probirka?.length == 0 && serachData?.data_birth?.length == 0) {
            return data.filter((item: any) => fullName(item)?.toString().toLowerCase().includes(serachData?.full_name?.toString().toLowerCase()))
        }
        if (serachData?.full_name?.length > 0 && serachData?.phone?.length > 0 && serachData?.person_id?.length == 0 && serachData?.probirka?.length == 0 && serachData?.data_birth?.length == 0) {
            return data.filter((item: any) =>
                fullName(item)?.toString().toLowerCase().includes(serachData?.full_name?.toString().toLowerCase())
                && item?.phone?.toString().toLowerCase().includes(serachData?.phone?.toString().toLowerCase())
            )

        }
        if (serachData?.full_name?.length > 0 && serachData?.phone?.length > 0 && serachData?.person_id?.length > 0 && serachData?.probirka?.length == 0 && serachData?.data_birth?.length == 0) {
            return data.filter((item: any) =>
                fullName(item)?.toString().toLowerCase().includes(serachData?.full_name?.toString().toLowerCase())
                && item?.phone?.toString().toLowerCase().includes(serachData?.phone?.toString().toLowerCase())
                && item?.person_id?.toString().toLowerCase().includes(serachData?.person_id?.toString().toLowerCase())
            )

        }
        if (serachData?.full_name?.length > 0 && serachData?.phone?.length > 0 && serachData?.person_id?.length > 0 && serachData?.probirka?.length > 0 && serachData?.data_birth?.length == 0) {
            return data.filter((item: any) =>
                fullName(item)?.toString().toLowerCase().includes(serachData?.full_name?.toString().toLowerCase())
                && item?.phone?.toString().toLowerCase().includes(serachData?.phone?.toString().toLowerCase())
                && item?.person_id?.toString().toLowerCase().includes(serachData?.person_id?.toString().toLowerCase())
                && item?.probirka_count?.toString().toLowerCase().includes(serachData?.probirka?.toString().toLowerCase())
            )

        }
        if (serachData?.full_name?.length > 0 && serachData?.phone?.length > 0 && serachData?.person_id?.length > 0 && serachData?.probirka?.length > 0 && serachData?.data_birth?.length > 0) {
            return data.filter((item: any) =>
                fullName(item)?.toString().toLowerCase().includes(serachData?.full_name?.toString().toLowerCase())
                && item?.phone?.toString().toLowerCase().includes(serachData?.phone?.toString().toLowerCase())
                && item?.person_id?.toString().toLowerCase().includes(serachData?.person_id?.toString().toLowerCase())
                && item?.probirka_count?.toString().toLowerCase().includes(serachData?.probirka?.toString().toLowerCase())
                && Date.parse(item?.data_birth) === Date.parse(serachData?.data_birth)
            )
        }

        if (serachData?.full_name?.length == 0 && serachData?.phone?.length > 0 && serachData?.person_id?.length == 0 && serachData?.probirka?.length == 0 && serachData?.data_birth?.length == 0) {
            return data.filter((item: any) =>
                item?.phone?.toString().toLowerCase().includes(serachData?.phone?.toString().toLowerCase())
            )
        }
        if (serachData?.full_name?.length == 0 && serachData?.phone?.length == 0 && serachData?.person_id?.length > 0 && serachData?.probirka?.length == 0 && serachData?.data_birth?.length == 0) {
            return data.filter((item: any) =>
                item?.person_id?.toString().toLowerCase().includes(serachData?.person_id?.toString().toLowerCase())
            )
        }
        if (serachData?.full_name?.length == 0 && serachData?.phone?.length == 0 && serachData?.person_id?.length == 0 && serachData?.probirka?.length > 0 && serachData?.data_birth?.length == 0) {
            return data.filter((item: any) =>
                item?.probirka_count?.toString().toLowerCase().includes(serachData?.probirka?.toString().toLowerCase())
            )
        }
        if (serachData?.full_name?.length == 0 && serachData?.phone?.length == 0 && serachData?.person_id?.length == 0 && serachData?.probirka?.length == 0 && serachData?.data_birth?.length > 0) {
            return data.filter((item: any) =>
                Date.parse(item?.data_birth) === Date.parse(serachData?.data_birth)
            )
        }

        if (serachData?.full_name?.length == 0 && serachData?.phone?.length > 0 && serachData?.person_id?.length > 0 && serachData?.probirka?.length == 0 && serachData?.data_birth?.length == 0) {
            return data.filter((item: any) =>
                item?.phone?.toString().toLowerCase().includes(serachData?.phone?.toString().toLowerCase())
                && item?.person_id?.toString().toLowerCase().includes(serachData?.person_id?.toString().toLowerCase())
            )
        }
        if (serachData?.full_name?.length == 0 && serachData?.phone?.length > 0 && serachData?.person_id?.length == 0 && serachData?.probirka?.length > 0 && serachData?.data_birth?.length == 0) {
            return data.filter((item: any) =>
                item?.phone?.toString().toLowerCase().includes(serachData?.phone?.toString().toLowerCase())
                && item?.probirka_count?.toString().toLowerCase().includes(serachData?.probirka?.toString().toLowerCase())
            )
        }
        if (serachData?.full_name?.length == 0 && serachData?.phone?.length > 0 && serachData?.person_id?.length == 0 && serachData?.probirka?.length == 0 && serachData?.data_birth?.length > 0) {
            return data.filter((item: any) =>
                item?.phone?.toString().toLowerCase().includes(serachData?.phone?.toString().toLowerCase())
                && Date.parse(item?.data_birth) === Date.parse(serachData?.data_birth)
            )
        }



        return data


        // if (serachData?.graphtype?.value === 'all' && serachData?.graph?.value === 'all' && serachData.text === '') {
        //     return data
        // }
        // if (serachData?.graphtype?.value !== 'all' && serachData?.graph?.value === 'all' && serachData.text === '') {
        //     return data.filter((item: any) => item.graphtype.id === serachData?.graphtype?.value)
        // }
        // if (serachData?.graphtype?.value === 'all' && serachData?.graph?.value !== 'all' && serachData.text === '') {
        //     return data.filter((item: any) => item.graph.id === serachData?.graph?.value)
        // }
        // if (serachData?.graphtype?.value !== 'all' && serachData?.graph?.value !== 'all' && serachData.text === '') {
        //     return data.filter((item: any) => item.graphtype.id === serachData?.graphtype?.value && item.graph.id === serachData?.graph?.value)
        // }
        // if (serachData?.graphtype?.value === 'all' && serachData?.graph?.value === 'all' && serachData.text !== '') {
        //     return data.filter((item: any) => (item?.name?.toString().toLowerCase().includes(serachData.text)))
        // }
        // if (serachData?.graphtype?.value === 'all' && serachData?.graph?.value !== 'all' && serachData.text !== '') {
        //     return data.filter((item: any) => item.graph.id === serachData?.graph?.value && (item?.name?.toString().toLowerCase().includes(serachData.text)))
        // }
        // if (serachData?.graphtype?.value !== 'all' && serachData?.graph?.value === 'all' && serachData.text !== '') {
        //     return data.filter((item: any) => item.graphtype.id === serachData?.graphtype?.value && (item?.name?.toString().toLowerCase().includes(serachData.text)))
        // }

        // if (serachData?.graphtype?.value !== 'all' && serachData?.graph?.value !== 'all' && serachData.text !== '') {
        //     return data.filter((item: any) => item.graph.id === serachData?.graph?.value && item.graphtype.id === serachData?.graphtype?.value && (item?.name?.toString().toLowerCase().includes(serachData.text)))
        // }


    }
    const [show, setShow] = useState(false)

    const { id, graphtype_id, graph_id } = useParams() as any

    useEffect(() => {
        if ((graph_id && +graph_id > 0) && (graphtype_id && +graphtype_id > 0)) {
            dispatch(isGraphGet(`?graph_id=${graph_id}&graphtype_id=${graphtype_id}`))
        } else {
            dispatch(isGraphGet(''))
        }
        dispatch(isServiceGet(''))
        dispatch(isGraphGet(''))
        dispatch(isDepartmentGet(''))
        if (graphData?.department) {
            setSearch(() => {
                return {
                    ...search,
                    department: {
                        label: graphData?.department?.name,
                        value: graphData?.department?.id,
                    }
                }
            })
        }
        if (graphData?.department) {
            const { name, id } = graphData?.department
            setSearch(() => {
                return {
                    ...search,
                    department: {
                        label: name,
                        value: id,
                    },

                }
            })
        }
        if (graphData?.month) {
            setSearch(() => {
                return {
                    ...search,

                    month: oylar?.find((res: any) => res?.value == graphData?.month)
                }
            })
        }
    }, [])
    const [cash, setCash] = useState(false)
    return (
        <Content loading={load}>
            <Navbar />
            <div className="container-fluid flex-grow-1 container-p-y size_16 size_16 ">
                <div className="d-flex my-2 gap-3">
                    <form className='row w-100'>
                        <div className="col-4">
                            <Select
                                name='name'
                                value={graphData?.month}
                                onChange={(e: any) => {
                                    // setSearch((res: any) => {
                                    //     return {
                                    //         ...res,
                                    //         month: e
                                    //     }
                                    // })
                                    dispatch(isGraphGet(`?year=${graphData?.current_year?.value ?? ''}&month=${e?.value ?? ''}&department_id=${graphData?.department?.value ?? ''}`))
                                }}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                options={
                                    [

                                        ...oylar
                                    ]
                                } />
                        </div>
                        <div className="col-4">
                            <Select
                                name='name'
                                value={graphData?.department}
                                onChange={(e: any) => {
                                    // setSearch((res: any) => {
                                    //     return {
                                    //         ...res,
                                    //         department: e
                                    //     }
                                    // })
                                    dispatch(isGraphGet(`?year=${graphData?.current_year?.value ?? ''}&department_id=${e?.value ?? ''}&month=${graphData?.month?.value ?? ''}`))
                                }}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                options={
                                    [

                                        ...dataSelect(departmentData)
                                    ]
                                } />
                        </div>
                        <div className="col-2">
                            <Select
                                name='name'
                                value={graphData?.current_year}
                                onChange={(e: any) => {
                                    // setSearch((res: any) => {
                                    //     return {
                                    //         ...res,
                                    //         department: e
                                    //     }
                                    // })
                                    dispatch(isGraphGet(`?year=${e?.value ?? ''}&department_id=${graphData?.department?.value ?? ''}&month=${graphData?.month?.value ?? ''}`))
                                }}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                options={
                                    graphData?.year
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
                            dispatch(isGraphGet(`?year=${graphData?.current_year?.value ?? ''}&week=${graphData?.weekcount - 1}&department_id=${graphData?.department?.value}`))
                        }}>oldingi</button>
                        <button className="btn btn-primary " type="button" onClick={() => {
                            dispatch(isGraphGet(`?year=${graphData?.current_year?.value ?? ''}&week=${graphData?.weekcount + 1}&department_id=${graphData?.department?.value}`))
                        }}>Keyingi</button>
                        <button className="btn btn-primary " type="button" onClick={() => {
                            setModal(true)
                            setItem(() => {
                                return {
                                    reset: true,
                                    department_id: graphData?.department?.value,
                                }
                            })
                        }}>Qoshish</button>
                    </div>
                </div>
                <div className="card" style={{
                    height: `${window.innerHeight / 1.7}px`,
                    overflow: 'auto'
                }}>
                    <div className="" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)'
                    }}>
                        {/* <Masonry
                            breakpointCols={{
                                default: 7,
                            }}
                            className="my-masonry-grid"
                            columnClassName="my-masonry-grid_column"
                        > */}
                        {
                            isSuccess && graphData?.week_data?.length > 0 ?
                                graphData?.week_data?.map((item: any, index: number) => {
                                    // getWeekData(graphData?.date)?.map((item: any, index: number) => {
                                    let data = graphData?.data?.filter((childItem: any) => {
                                        return childItem?.graph_item?.find((kk: any) => (kk?.agreement_date) === (item?.filter_date))
                                    })
                                    const workingday = JSON.parse(graphData?.department?.data?.working_days ?? "[]")
                                    let damkuni = workingday?.find((el: any) => +el?.value === +item?.day_index)
                                    console.log('damkuni', damkuni);
                                    console.log('workingday', workingday);


                                    return (
                                        <div className=' p-1'>
                                            {
                                                data?.length == 0 ?
                                                    <div className="card border">
                                                        <div className={`card-header ${damkuni?.is_working
                                                            ? 'bg-warning' : 'bg-danger'}  py-1 text-white d-flex justify-content-between`}>
                                                            <p className='p-0 m-0'>
                                                                <span className={`badge bg-white ${damkuni?.is_working
                                                                    ? 'text-warning' : 'text-danger'}`}>
                                                                    {item?.week_day} {item?.date}
                                                                </span>
                                                            </p>
                                                            <p className='p-0 m-0'>
                                                                <span className={`badge bg-white ${damkuni?.is_working
                                                                    ? 'text-warning' : 'text-danger'}`}>
                                                                    0
                                                                </span>
                                                            </p>

                                                        </div>
                                                        <div className="card-body py-1 text-center">
                                                            <p>
                                                                <BsDatabaseFillX className='block m-auto ' />
                                                            </p>
                                                            <p>Malumot yo'q</p>
                                                        </div>

                                                    </div> :
                                                    graphItemSortTimes(data?.flatMap((tt: any) => tt.graph_item)
                                                        ?.filter((kk: any) => (kk?.agreement_date) === (item?.filter_date)))
                                                        ?.map((childItem: any, childIndex: number) => {

                                                            let user = data?.find((userItem: any) => userItem?.id == childItem?.graph_id)
                                                            if (childIndex == 0) {
                                                                return (
                                                                    <div className="card border graph_card">
                                                                        {/* <button onClick={() => {

                                                                }} className='btn bg-success text-white btn-sm '
                                                                >
                                                                    <AiFillEdit />
                                                                </button> */}
                                                                        <div className={`card-header ${damkuni?.is_working
                                                                            ? 'bg-success' : 'bg-danger'} py-1 text-white d-flex justify-content-between`}>
                                                                            <p className='p-0 m-0'>
                                                                                <span className={`badge bg-white ${damkuni?.is_working
                                                                                    ? 'text-success' : 'text-danger'}`}>
                                                                                    {item?.week_day} {item?.date}
                                                                                </span>
                                                                            </p>
                                                                            <p className='p-0 m-0'>
                                                                                <span className={`badge bg-white ${damkuni?.is_working
                                                                                    ? 'text-success' : 'text-danger'}`}>
                                                                                    {data?.length}
                                                                                </span>
                                                                            </p>
                                                                        </div>
                                                                        <div className="card-body py-1 ">
                                                                            <h5 className="card-title pointer"
                                                                                onClick={() => {
                                                                                    setModal(() => true)
                                                                                    setItem(() => {
                                                                                        return {
                                                                                            ...user,
                                                                                            department_id: graphData?.department?.value,
                                                                                            graph_item: [
                                                                                                {
                                                                                                    ...childItem,

                                                                                                }
                                                                                            ]
                                                                                        }
                                                                                    })
                                                                                }}

                                                                            >
                                                                                {fullName(user)}
                                                                            </h5>
                                                                            <div className='d-flex justify-content-between'>
                                                                                <p className="card-text">
                                                                                    {phoneFormatNumber(user?.phone)}
                                                                                </p>
                                                                                <p className="badge bg-warning">{childItem?.agreement_time}</p>
                                                                            </div>

                                                                        </div>
                                                                        {/* <div className="card-footer d-flex gap-1">
                                                                    <button className='btn btn-warning btn-sm'>Qabul qilish</button>
                                                                    <button className='btn btn-info btn-sm'>Tahrirlash</button>

                                                                </div> */}

                                                                    </div>
                                                                )
                                                            }
                                                            return (
                                                                <div className="card border my-1">
                                                                    <div className="card-body py-1">
                                                                        <h5 className="card-title pointer"
                                                                            onClick={() => {
                                                                                setModal(() => true)
                                                                                setItem(() => {
                                                                                    return {
                                                                                        ...user,
                                                                                        department_id: graphData?.department?.value,
                                                                                        graph_item: [
                                                                                            {
                                                                                                ...childItem,

                                                                                            }
                                                                                        ]
                                                                                    }
                                                                                })
                                                                            }}

                                                                        >
                                                                            {fullName(user)}
                                                                        </h5>
                                                                        <div className='d-flex justify-content-between'>
                                                                            <p className="card-text">
                                                                                {phoneFormatNumber(user?.phone)}
                                                                            </p>
                                                                            <p className="badge bg-warning">{childItem?.agreement_time}</p>
                                                                        </div>

                                                                    </div>
                                                                    {/* <div className="card-footer d-flex gap-1">
                                                                <button className='btn btn-warning btn-sm'>Qabul qilish</button>
                                                                <button className='btn btn-info btn-sm'>Tahrirlash</button>
                                                            </div> */}
                                                                </div>
                                                            )
                                                        })
                                            }

                                        </div>
                                    )
                                }) : <div className='d-flex justify-content-center align-items-center w-100 text-cenetr p-5 ' style={{
                                    gridColumn: 'span 7',
                                }}>
                                    <div className='text-center'>
                                        <h4>Yuklanmoqda</h4>
                                        <TableLoader />
                                    </div>
                                </div>
                        }
                        {/* </Masonry> */}
                    </div>
                </div>
                <br />
                <Pagination
                    setPageLimit={(e: any) => {
                        // setNumberOfPages(Math.ceil(graphData?.length / e))
                        // setPageLimit(e)
                        dispatch(isGraphCurrentPage(1))
                        dispatch(isGraphPageLimit(e))
                    }}

                    pageLmit={pageLimit}
                    current={page} total={Math.ceil(graphData?.length / pageLimit)} count={isGraphCurrentPage} />
            </div>

            <GraphAdd
                modal={modal} setModal={setModal}
                setData={setItem} data={item} />

        </Content>
    )
}

export default Graph