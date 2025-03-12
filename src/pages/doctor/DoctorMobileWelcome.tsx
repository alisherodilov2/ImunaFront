import React, { useEffect, useState } from 'react'
import { FaBoxOpen, FaPauseCircle, FaPlayCircle, FaPlusCircle, FaUserClock } from 'react-icons/fa'
import Content from '../../layout/Content'
import { Button, Offcanvas, OffcanvasBody, OffcanvasHeader } from 'reactstrap';
import Navbar from '../../layout/Navbar'
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../../service/store/store'
import { isAddAllClient, isClientGet, isDoctorTargetData } from '../../service/reducer/ClientReducer'
import { ReducerType } from '../../interface/interface'
import TableLoader from '../../componets/table/TableLoader'
import { BsFillDoorOpenFill, BsSearch } from 'react-icons/bs'
import Input from '../../componets/inputs/Input';
// import { LuSettings2 } from 'lucide-react';
import { Settings2 } from 'lucide-react';
import { fullName } from '../../helper/fullName';
import { phoneFormatNumber } from '../../helper/graphHelper';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loader from '../../componets/api/Loader';
import { getCurrentTime } from '../../helper/dateFormat';
import { dateFormat } from '../../service/helper/day';
import { dateFilterUniqe } from '../../helper/doctorRegHelper';
import { RoomMyTimer } from './doctor-reg/MyTimer';
import { statusColor } from './DoctorDesctoWelcome';
import { isDepartmentGet } from '../../service/reducer/DepartmentReducer';
import { sortNavbat } from '../../helper/clientHelper';
const DoctorMobileWelcome = () => {
    const toggleOffcanvas = () => setIsOpen(!isOpen);

    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch<AppDispatch>()

    const [search, setSearch] = useState({
        full_name: '',
        phone: '',
        person_id: '',
        probirka: '',
        data_birth: '',
    } as any)

    const { page, clientData, massage, isLoading, isSuccess, pageLimit } = useSelector((state: ReducerType) => state.ClientReducer)

    const { user } = useSelector((state: ReducerType) => state.ProfileReducer)
    const [tab, setTab] = useState('1' as any)
    const [load, setLoad] = useState(false)
    const [defaultLload, setDefaultLoad] = useState(false)
    const [load2, setLoad2] = useState(false)
    const path = useNavigate();
    const allShow = async (data: any) => {
        try {
            setLoad(() => true)
            let res = await axios.get(`/client?doctor_show_person_id=${data?.person_id}&is_finish=${tab == 4 ? 'in_room' : statusColor(data?.client_item?.at(-1)?.client_result?.at(-1)?.is_check_doctor, true)}`)
            const { result } = res.data
            console.log(result);
            dispatch(isDoctorTargetData({
                ...result?.data,
                time: result?.time,
                target: result?.data?.client_item?.at(-1)
            }))
            path(`/customer/${tab == 4 ? 'in_room' : statusColor(result?.data?.client_item?.at(-1)?.client_result?.at(-1)?.is_check_doctor, true)}/${result?.data?.person_id}`)
            // setCash(() => true)
        } catch (error) {

        } finally {
            setLoad(() => false)
        }
    }
    const [data, setData] = useState({ data: [], current_page: 1 } as any)
    const getDta = async (target: any, page = 1, reset?: any) => {
        try {
            if (reset) {
                setData({ data: [], current_page: 1 })
            }
            setDefaultLoad(reset)
            setLoad2(() => true)
            let res = await axios.get(`/client?${target ?? ''}&page=${page}&per_page=20`)
            const { result } = res.data
            if (reset) {
                setData(() => {
                    return {
                        ...result,
                    }
                })
            } else {
                setData(() => {
                    return {
                        ...result,
                        data: [
                            ...data?.data,
                            ...result?.data
                        ]
                    }
                })
            }
        }
        catch (e) {
        }
        finally {
            setLoad2(() => false)
            setDefaultLoad(() => false)
        }
    }
    useEffect(() => {
        if (window.innerWidth <= 992) {
            getDta('is_finish=waiting', 1, true)
            // dispatch(isClientGet('?is_finish=waiting'))
            dispatch(isDepartmentGet(''))
        }
    }, [])

    const fetchMoreData = () => {
        if (!load2 && data?.last_page - data?.current_page > 0) {
            getDta(`${tab == 1 ? 'is_finish=waiting' : 'is_finish=finish'}`, data?.current_page + 1)
        }
    };
    const [room, setRoom] = useState({
        data: []
    } as any)
    const [roomTarget, setRoomTarget] = useState({} as any)
    const [queueNumber, setQueueNumber] = useState(0 as any)
    const [roomLoad, setRoomLoad] = useState(false)

    const doctorRoom = async () => {
        try {
            setRoomLoad(() => true)
            let res = await axios.get(`/client/doctor-room`)
            const { result } = res.data
            console.log(result);
            setRoom(() => {
                return {
                    data: result
                }
            })

        } catch (error) {
        } finally {
            setRoomLoad(() => false)
        }
    }
    const graphClient = async (room?: any) => {
        try {
            setRoomLoad(() => true)
            let res = await axios.get(`/graph/graph-client?start_date=${room?.start_date ?? 0}&end_date=${room?.end_date ?? 0}`)
            const { result } = res.data
            setQueueNumber(() => result?.queue_number)
            console.log(result);
            setRoom(() => result)

        } catch (error) {
        } finally {
            setRoomLoad(() => false)
        }
    }
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

        //  if (+serachData?.department?.value > 0) {
        //             // alert('sss')
        //             return sortNavbat(response)

        //         }

        return sortNavbat(response, true, true)
        // return response



    }
    const [uniqueDate, setUniqueDate] = useState([] as any)
    return (
        // <Content loading={load} className='d-none d-lg-block' >

        //     <Navbar />
        <div className=' w-100  '>
            <Offcanvas isOpen={isOpen} toggle={toggleOffcanvas} direction="end">
                <OffcanvasHeader toggle={toggleOffcanvas}>
                    Qidiruv
                </OffcanvasHeader>
                <OffcanvasBody>
                    <div className="row">
                        <div className="col-6 mb-3">
                            <Input disabled={load2 ? true : false} type='date' onChange={(e: any) => {
                                let value = e.target.value
                                if (value && value.length > 0) {
                                    if (tab == 3) {
                                        graphClient({
                                            start_date: value,
                                            end_date: room?.end_date
                                        })
                                    } else {
                                        setSearch({
                                            full_name: '',
                                            phone: '',
                                            person_id: '',
                                            data_birth: ''
                                        })
                                        getDta(`${tab == 1 ? 'is_finish=waiting' : 'is_finish=finish'}&full_name=${search?.full_name}&start_date=${value}&end_date=${data?.end_date}`, 1, true)
                                    }
                                    toggleOffcanvas()


                                }
                            }}
                                value={data?.start_date}
                            />
                        </div>
                        <div className="col-6 mb-3">
                            <Input disabled={load2 ? true : false} type='date' min={data?.start_date} onChange={(e: any) => {
                                let value = e.target.value
                                if (value && value.length > 0) {
                                    if (tab == 3) {
                                        graphClient({
                                            start_date: room?.start_date,
                                            end_date: value
                                        })
                                    } else {
                                        setSearch({
                                            full_name: '',
                                            phone: '',
                                            person_id: '',
                                            data_birth: ''
                                        })
                                        getDta(`${tab == 1 ? 'is_finish=waiting' : 'is_finish=finish'}&full_name=${search?.full_name}&end_date=${value}&start_date=${data?.start_date}`, 1, true)
                                    }
                                    toggleOffcanvas()
                                }
                            }}
                                value={data?.end_date}
                            />
                        </div>

                        <div className="col-12 mb-3">
                            <Input disabled={load2 ? true : false} placeholder='Telefon Izlash...' onChange={(e: any) => {
                                setSearch((res: any) => {
                                    return {
                                        ...res,
                                        phone: e.target.value?.trim().toLowerCase()
                                    }
                                })

                            }}
                                onKeyDown={
                                    (e: any) => {
                                        if (e.key === 'Enter' && e.target.value?.trim().length > 0) {
                                            setSearch({
                                                full_name: '',
                                                person_id: '',
                                                data_birth: ''
                                            })
                                            getDta(`${tab == 1 ? 'is_finish=waiting' : 'is_finish=finish'}&phone=${e.target.value?.trim().toLowerCase()}&end_date=${data?.end_date}&start_date=${data?.start_date}`, 1, true)
                                            toggleOffcanvas()

                                        }
                                    }
                                }
                                value={search?.phone}
                            />
                        </div>
                        <div className="col-6 mb-3" >
                            <Input disabled={load2 ? true : false} placeholder='ID Izlash...' onChange={(e: any) => {
                                setSearch((res: any) => {
                                    return {
                                        ...res,
                                        person_id: e.target.value?.trim().toLowerCase()
                                    }
                                })
                            }}
                                onKeyDown={
                                    (e: any) => {
                                        if (e.key === 'Enter' && e.target.value?.trim().length > 0) {
                                            setSearch({
                                                full_name: '',
                                                phone: '',
                                                data_birth: ''
                                            })
                                            getDta(`${tab == 1 ? 'is_finish=waiting' : 'is_finish=finish'}&person_id=${e.target.value?.trim().toLowerCase()}&end_date=${data?.end_date}&start_date=${data?.start_date}`, 1, true)
                                            toggleOffcanvas()

                                        }
                                    }
                                }
                                value={search?.person_id}
                            />
                        </div>
                        <div className="col-6 mb-3">
                            <Input type='date'
                                disabled={load2 ? true : false}



                                onChange={(e: any) => {
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
                                            setSearch({
                                                full_name: '',
                                                phone: '',
                                                person_id: ''
                                            })
                                            getDta(`${tab == 1 ? 'is_finish=waiting' : 'is_finish=finish'}&data_birth=${e.target.value?.trim().toLowerCase()}&end_date=${data?.end_date}&start_date=${data?.start_date}`, 1, true)
                                            toggleOffcanvas()

                                        }
                                    }
                                }
                                value={search?.data_birth}
                            />
                        </div>
                    </div>
                </OffcanvasBody>
            </Offcanvas>
            <br />
            <div className='mobile_bnt_doc'>
                <div className='my-2  d-flex justify-content-between gap-2 '>
                    <Input placeholder='F.I.O Izlash...'
                        disabled={load2 ? true : false}
                        onChange={(e: any) => {
                            setSearch((res: any) => {
                                return {
                                    ...res,
                                    full_name: e.target.value?.trim().toLowerCase()
                                }
                            })

                        }}
                        onKeyDown={
                            (e: any) => {
                                if (e.key === 'Enter' && e.target.value?.trim().length > 0) {
                                    setSearch({
                                        data_birth: '',
                                        phone: '',
                                        person_id: ''
                                    })
                                    getDta(`${tab == 1 ? 'is_finish=waiting' : 'is_finish=in_room'}&full_name=${e.target.value?.trim().toLowerCase()}`, 1, true)
                                }
                            }
                        }
                        value={search?.full_name}
                    />
                    <button className='btn btn-primary' onClick={toggleOffcanvas} disabled={tab < 3 ? false : true}>
                        <Settings2 />
                    </button>
                </div>
                <div className="btn-group w-100 my-2 bg-white" role="group" aria-label="First group">
                    <button type="button" onClick={() => {

                        setTab('1')
                        setSearch({ full_name: '', data_birth: '', person_id: '', phone: '' })
                        getDta('is_finish=waiting', 1, true)
                        setRoom({ data: [] })

                    }} className={`btn ${tab == '1' ? 'btn-primary' : 'btn-outline-primary '}`}>
                        <FaUserClock size={24} />
                    </button>
                    <button type="button" onClick={() => {
                        setTab('2')
                        setSearch({ full_name: '', data_birth: '', person_id: '', phone: '' })

                        dispatch(isAddAllClient([]))
                        getDta('is_finish=finish', 1, true)

                        setRoom({ data: [] })
                    }} className={`btn ${tab == '2' ? 'btn-primary' : 'btn-outline-primary '}`}


                    >
                        <i className="tf-icons bx bx-check-shield" style={{
                            fontSize: '24px'
                        }} />
                    </button>
                    <button type="button" onClick={() => {

                        setTab('3')
                        setSearch({ full_name: '', data_birth: '', person_id: '', phone: '' })

                        dispatch(isAddAllClient([]))
                        setRoom({ data: [] })
                        setData({ data: [] })
                        graphClient()
                    }} className={`btn ${tab == '3' ? 'btn-primary' : 'btn-outline-primary '}`}>
                        <i className="tf-icons bx bx-task" style={{
                            fontSize: '24px'
                        }} />
                    </button>
                    <button type="button" onClick={() => {
                        setTab('4')
                        setData({ data: [] })
                        setSearch({ full_name: '', data_birth: '', person_id: '', phone: '' })
                        dispatch(isAddAllClient([]))
                        doctorRoom()
                    }} className={`btn ${tab == '4' ? 'btn-primary' : 'btn-outline-primary '}`}>
                        <BsFillDoorOpenFill size={24} />
                    </button>
                </div>
            </div>

            {/* <div className="d-flex gap-1  justify-content-center my-2 ">
                <button className='btn btn-success  ' onClick={() => setTab('1')}>Tasdiqlangan </button>
                <button className='btn btn-secondary  ' onClick={() => setTab('2')}>Kutilyotgan </button>
                <button className='btn btn-warning  ' onClick={() => setTab('3')}>Kutilyapti</button>
              
            </div> */}
            <div className="mobile-doc-body">


                {
                    defaultLload || roomLoad || isLoading ? <div className='bg-white rounded p-1 text-center d-flex  align-items-center gap-3 justify-content-center'>
                        <TableLoader />
                        <h4 className='mb-0'>Yuklanmoqda</h4>
                    </div> : <>
                        {
                            (!load2 && filter(data?.data, search)?.length == 0) || ((!load2 && data?.data?.length) + clientData?.data?.length + (room?.data?.length ?? 0)) == 0 ? <div className='bg-white rounded p-1 text-center d-flex  align-items-center gap-3 justify-content-center'>
                                <FaBoxOpen size={44} />
                                <h4 className='mb-0'>Malumot topilmadi</h4>
                            </div> : ''
                        }
                        {
                            tab == 3 ?

                                <>
                                    {
                                        room?.data?.length > 0 ? <p className='fw-bold'>{user?.graph_format_date}</p> : ''
                                    }
                                    {
                                        room?.data?.map((res: any, pindex: any) => {
                                            return res?.graph_item
                                                ?.map((item: any, index: number) => {
                                                    let queue_number = '' as any;
                                                    if (item?.agreement_time?.length > 1) {
                                                        queue_number = `${item?.agreement_time}`
                                                    } else {
                                                        const count = room.data
                                                            // ?.filter((t: any, tIndex: number) => 
                                                            //     //    t.graph_id==item?.graph_id
                                                            //     //     && 
                                                            //         // inde==tIndex &&
                                                            //         index>pindex
                                                            //         // t.id == item?.id
                                                            //     )
                                                            ?.slice(0, pindex + 1)

                                                            ?.flatMap((k: any) => k?.graph_item

                                                                // ?.slice(0, index + 1)
                                                                ?.filter((t: any, tIndex: number) =>
                                                                    //    t.graph_id==item?.graph_id
                                                                    //     && 
                                                                    // inde==tIndex &&
                                                                    t?.agreement_time?.length <= 1
                                                                ))

                                                            .length;

                                                        queue_number = `${room.department.letter} - ${count + queueNumber}`
                                                        // setQueueNumber(() => queueNumber + 1)
                                                    }
                                                    return (
                                                        <>

                                                            <div className="bg-white rounded p-1 my-2 d-flex justify-content-between align-items-star "
                                                                onClick={() => {
                                                                    // allShow(item.person_id)
                                                                }}

                                                            >
                                                                <div className="d-flex align-items-center gap-3">
                                                                    <p id='corusel__btn' className='bg-warning text-white p-1 rounded-pill text-center mobile_circle mb-0'>
                                                                        {
                                                                            queue_number
                                                                        }
                                                                    </p>

                                                                    <div className="user-info">
                                                                        <div className='text-right w-100'>

                                                                        </div>
                                                                        <h5 className='fw-bold mb-0'>
                                                                            {fullName(res)}
                                                                        </h5>
                                                                        <p className='fw-bold white-space mb-0'>
                                                                            {`${phoneFormatNumber(res?.phone)}`}
                                                                        </p>
                                                                    </div>

                                                                </div>

                                                            </div>
                                                        </>
                                                    )
                                                }
                                                )

                                        })
                                    }
                                </>
                                : ''
                        }
                        {
                            tab == 4 ?
                                room.data?.map((item: any, index: any) => (
                                    <div className="bg-white rounded p-1 my-2 d-flex justify-content-between align-items-center "
                                        onClick={() => {
                                            if (item?.client?.id) {
                                                allShow(item?.client)
                                            }
                                        }}
                                    >
                                        <div className="d-flex align-items-center gap-3">
                                            <p id='corusel__btn' className={`bg-${item?.client?.id ? 'danger' : 'success'}  text-white p-1 rounded-pill text-center mobile_circle mb-0`}>
                                                {
                                                    item?.client?.id > 0 ?
                                                        <RoomMyTimer expiryTimestamp={item?.client?.time} startCheck={item?.client?.client_result?.at(-1)?.is_check_doctor
                                                            == 'start'} /> :
                                                        item?.main_room?.length > 0 ? `${item?.main_room}` : `${item?.room_type} - ${item?.room_number}`
                                                }

                                            </p>
                                            <div className="user-info">
                                                {/* <p className='fw-bold'>27.05.2024</p> */}
                                                <h5 className='fw-bold mb-0'>
                                                    {item?.client ? fullName(item?.client) : '-'}
                                                </h5>
                                            </div>
                                        </div>
                                        <div className="user-phonr">
                                            {/* <p className='fw-bold white-space'>ID: <span className='text-info'>{item?.client_item?.at(-1).id}</span> </p> */}
                                            {item?.client?.id > 0 ? <p className='p-2 fw-bold text-danger'>
                                                {/* {getCurrentTime(item?.client?.created_at)} */}
                                                {`${user?.department?.letter} - ${item?.client?.client_value?.at(0)?.queue_number}`}
                                            </p> : ''}

                                        </div>
                                    </div>
                                )) : ''
                        }
                        {
                            tab == 2 || tab == 1 ? (
                                (load2 && data?.page == 1) ? <div className="row">
                                    <div className="col-12">
                                        {/* <Skeleton /> */}
                                    </div>
                                </div> : data?.data?.length > 0 ?
                                    <div>
                                        <InfiniteScroll
                                            dataLength={data?.data?.length}
                                            next={fetchMoreData}
                                            hasMore={true}
                                            loader={<>
                                                {
                                                    load2 ? data?.last_page == data?.current_page ? '' : <div className='bg-white rounded p-1 text-center d-flex  align-items-center gap-3 justify-content-center'>
                                                        <TableLoader />
                                                        <h4 className='mb-0'>Yuklanmoqda</h4>
                                                    </div> : ''
                                                }

                                            </>}
                                        >

                                            {
                                                dateFilterUniqe(filter(data?.data, search))?.map((item: any) => {
                                                    // let date = dateFormat(item?.client_item?.at(-1)?.created_at) as any;
                                                    // if (new Set(uniqueDate).has(date)) {
                                                    //     setUniqueDate(() => [...uniqueDate, date])
                                                    // } else {
                                                    //     date = ''
                                                    // }
                                                    return (
                                                        <>
                                                            {
                                                                item?.date?.length > 0 ?
                                                                    <p className='fw-bold'>{item?.date}</p> : ''
                                                            }
                                                            <div className="bg-white rounded p-1 my-2 d-flex justify-content-between align-items-star "
                                                                onClick={() => {
                                                                    console.log(item);

                                                                    allShow(item)
                                                                }}

                                                            >
                                                                <div className="d-flex align-items-center gap-3">
                                                                    <p id='corusel__btn' className={`bg-${tab == 2 ? 'success' : 'secondary'} text-white p-1 rounded-pill text-center mobile_circle mb-0`}>
                                                                        {/* {getCurrentTime(item?.client_item.at(-1)?.created_at)} */}
                                                                        {
                                                                            item?.client_item?.at(-1)?.is_check_doctor
                                                                                == 'start' || item?.client_item?.at(-1)?.is_check_doctor
                                                                                == 'pause' ? getCurrentTime(item?.client_item?.at(-1)?.created_at) :
                                                                                `${user?.department?.letter} -  ${item?.client_item?.at(-1)?.client_value?.at(0)?.queue_number}`}
                                                                    </p>
                                                                    <div className="user-info">

                                                                        <h5 className='fw-bold mb-0'>
                                                                            {fullName(item)}
                                                                        </h5>
                                                                        <p className='fw-bold white-space mb-0'>
                                                                            {`${phoneFormatNumber(item?.phone)}`}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className="user-phonr">
                                                                    <p className='fw-bold white-space'>ID: <span className='text-info'>{item?.client_item?.at(-1)?.id}</span> </p>

                                                                </div>
                                                            </div>
                                                        </>
                                                    )
                                                }
                                                )
                                            }
                                        </InfiniteScroll>
                                    </div>
                                    : '') : ''
                        }
                    </>
                }
            </div>
            <button

                className='btn btn-info rounded-pill btn-icon btn-xl position-fixed  
              py-3    '
                style={{
                    // marginRight: '3.5rem',
                    bottom: '2rem',
                    right: '1rem',
                }}
            >
                <FaPlusCircle />
            </button>
            <Loader loading={load} />
        </div>
        // </Content>

    )
}

export default DoctorMobileWelcome
