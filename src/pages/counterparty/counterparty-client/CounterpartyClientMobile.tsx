import React, { useEffect, useState } from 'react'
import Layout from '../../../layout/Layout'
import Navbar from '../../../layout/Navbar'
import Table from '../../../componets/table/Table'
import Input from '../../../componets/inputs/Input'
import Pagination from '../../../componets/pagination/Pagination'
import { useDispatch, useSelector } from 'react-redux'
import { ReducerType } from '../../../interface/interface'
import { isReferringDoctorDelete, isReferringDoctorGet, isReferringDoctorCurrentPage, isReferringDoctorPageLimit, isReferringDoctorEdit } from '../../../service/reducer/ReferringDoctorReducer'
import { AppDispatch } from '../../../service/store/store'
import Select from 'react-select';
import Swal from 'sweetalert2'
import Content from '../../../layout/Content'
import { isFindFunction } from '../../../service/reducer/MenuReducer'
import { NumericFormat } from 'react-number-format'
import { query } from '../../../componets/api/Query'
import axios from 'axios'
import { domain } from '../../../main'
import { fullName } from '../../../helper/fullName'
import { FaBoxOpen, FaCheckSquare, FaCircle } from 'react-icons/fa'
import TableLoader from '../../../componets/table/TableLoader'
import { isTimeGreater, phoneFormatNumber } from '../../../helper/graphHelper'
import { useNavigate } from 'react-router-dom'
// import ClientView from './ClientView'
// import { ReferringDoctorOrderShow } from './ReferringDoctorOrderShow'

const CounterpartyClientMobile = () => {
    const [modal, setModal] = useState(false)
    const [modal2, setModal2] = useState(false)
    const [item, setItem] = useState({} as any)
    const [item2, setItem2] = useState({} as any)
    const { user } = useSelector((state: ReducerType) => state.ProfileReducer)
    const { page, referringDoctorData, massage, isLoading, isSuccess, pageLimit } = useSelector((state: ReducerType) => state.ReferringDoctorReducer)
    // const [pageLmit, setPageLimit] = useState(() => 5)
    const [numberOfPages, setNumberOfPages] = useState(Math.ceil(referringDoctorData.data?.length / pageLimit))
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
                dispatch(isReferringDoctorDelete({ all: [...new Set(checkData?.map((idAll: any) => idAll?.id))] }))
                setCheckData([])
            }
        })
        // dispatch(deletedispatchFunction(id))

    }
    const [serachText, setSerachText] = useState('')
    const [load, setLoad] = useState(false)
    const orderShow = async (id: any) => {
        try {
            setLoad(() => true)
            let res = await axios.get('/order-show?referringDoctor_id=' + id)
            const { result } = res.data
            // setItem2(() => result)
            console.log(result);

            setModal2(() => true)
        } catch (error) {

        } finally {
            setLoad(() => false)
        }
    }
    const filter = (data: any, serachData: string) => {
        if (serachData?.length > 0) {
            return (data.filter((item: any) => (item?.full_name?.toString().toLowerCase().includes(serachData) || item?.phone?.toString().toLowerCase().includes(serachData)) || item?.target_adress?.toString().toLowerCase().includes(serachData) || item?.address?.toString().toLowerCase().includes(serachData)))
        } else
            return (data)
    }
    const [search, setSearch] = useState({ full_name: '', phone: '', person_id: '', probirka: '', data_birth: '' } as any)
    useEffect(() => {
        dispatch(isReferringDoctorGet(''))
    }, [])

    const show = async (id: any) => {
        try {
            setLoad(() => true)
            let res = await axios.get(`/referring-doctor/show/${id}?start_date=${referringDoctorData?.start_date}&end_date=${referringDoctorData?.end_date}`)
            const { result } = res.data
            if (result?.referring_doctor_balance?.length > 0) {
                setItem(() => result)
                setModal(() => true)
            }
        } catch (error) {

        } finally {
            setLoad(() => false)
        }
    }
    const referringDoctorDataSelect = (data: any) => {
        if (data?.length > 0) {

            return data?.map((item: any) => {
                return {
                    value: item?.id, label: fullName(item),
                    data: item
                }
            })
        }
        return []
    }
    const [tab, setTab] = useState(0 as any)
    const [data, setData] = useState({
        data: []
    } as any)
    const getData = async (status?: any) => {
        try {
            setLoad(() => true)
            let res = await axios.get(`/referring-doctor/treatment?status=${status}`)
            const { result } = res.data
            console.log(result);
            setData(() => result)
            // dispatch(isAddGraphAchiveAll(result))
            // setData(() => result)
            // setCash(() => true)
        } catch (error) {

        } finally {
            setLoad(() => false)
        }
    }

    const statusIcon = (target: any, ishvaqti: any) => {
        if (target?.client_id > 0) {
            return <FaCheckSquare size={24} className='text-success' />
        }
        if (Date.parse(target?.agreement_date) >= Date.parse(user?.graph_format_date)
            // && isTimeGreater(ishvaqti, user?.time)
        ) {
            return <FaCircle size={24} className='text-warning' />
        }
        return <FaCircle size={24} className='text-danger' />
    }
    useEffect(() => {
        getData('ambulator')
    }, [])
    const path = useNavigate()
    const sortKontragentDoctorData = (data: any) => {
        if (data?.length > 0) {
            let res = [...data].sort((a: any, b: any) => b.graph_archive?.length - a.graph_archive?.length);
            return res
        }
        return data
    }
    return (
        <Content >
            <Navbar />
            <div className="container-fluid flex-grow-1 container-p-y size_16 ">
                {isLoading ? <div className='bg-white rounded p-1 text-center d-flex  align-items-center gap-3 justify-content-center'>
                    <TableLoader />
                    <h4 className='mb-0'>Yuklanmoqda</h4>
                </div> : ''}
                {
                    !load && referringDoctorData?.data?.length == 0 ? <div className='bg-white rounded p-1 text-center d-flex  align-items-center gap-3 justify-content-center'>
                        <FaBoxOpen size={44} />
                        <h4 className='mb-0'>Malumot topilmadi</h4>
                    </div> : ''
                }

                {sortKontragentDoctorData(referringDoctorData.data)?.map((item: any) => {
                    return (
                        <div className="card border border-primary  my-2 cursor-pointer"
                            onClick={() => {
                                path('/counterparty-client/' + item?.id)
                            }}
                        >
                            <div className="card-body p-2">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div>
                                        <h4 className='mb-1'>
                                            {fullName(item)}
                                        </h4>
                                        <p className='mb-0'>{item?.workplace}</p>
                                        <p className='mb-0'>+998 {phoneFormatNumber(item?.phone)}</p>
                                    </div>
                                    <p className='bg-primary fw-bold text-white p-1 rounded-pill text-center mobile_circle mb-0'>
                                        {item?.graph_archive?.length}
                                    </p>
                                </div>

                            </div>

                        </div>
                    )
                })}
                {/* <div className='my-2  d-flex justify-content-between gap-2 '>
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
                                if (e.key === 'Enter' && e.target.value?.trim().length > 0) {
                                    // dispatch(isClientGet(`?start_date=${clientData?.start_date}&end_date=${clientData?.end_date}&full_name=${e.target.value?.trim().toLowerCase()}`))
                                }
                            }
                        }
                        value={search?.full_name}
                    />
                </div>
                <div>
                    <Select
                        // isDisabled={data?.department?.id>0 ? true : false}
                        name='name3'
                        value={search?.referring_doctor_id}
                        onChange={(e: any) => {
                            setSearch({
                                ...search,
                                referring_doctor_id: e
                            })



                        }}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        // value={userBranch}
                        options={
                            [
                                {
                                    value: 0,
                                    label: 'Barchasi'
                                },
                                ...referringDoctorDataSelect(referringDoctorData?.data)
                            ]
                        } />
                </div>
                <div className="text-center my-2 btn-group w-100">
                    <button className={`btn ${tab == 0 ? 'btn-primary' : 'btn-secondary'}  btn-sm`}
                        onClick={() => {
                            setTab(0)
                            getData('ambulator')

                        }}
                    >Ambulator</button>
                    <button className={`btn ${tab == 1 ? 'btn-primary' : 'btn-secondary'}  btn-sm`} onClick={() => {
                        setTab(1)
                        getData('live')
                    }} >Muolaja</button>
                    <button className={`btn ${tab == 2 ? 'btn-primary' : 'btn-secondary'}  btn-sm`} onClick={() => {
                        setTab(2)
                        getData('finish')

                    }}>Yakunlangan</button>
                    <button className={`btn ${tab == 3 ? 'btn-primary' : 'btn-secondary'}  btn-sm`} onClick={() => {
                        setTab(3)
                        getData('archive')

                    }}>Arxivlangan</button>
                </div>
                {load ? <div className='bg-white rounded p-1 text-center d-flex  align-items-center gap-3 justify-content-center'>
                    <TableLoader />
                    <h4 className='mb-0'>Yuklanmoqda</h4>
                </div> : ''}
                {
                    !load && data?.data?.length == 0 ? <div className='bg-white rounded p-1 text-center d-flex  align-items-center gap-3 justify-content-center'>
                        <FaBoxOpen size={44} />
                        <h4 className='mb-0'>Malumot topilmadi</h4>
                    </div> : ''
                }
                {
                    load ? '' :
                        tab > 0 ? 
                        data?.data?.map((item: any) => (<div className="card my-2">
                            <div className="d-flex justify-content-between align-items-center my-1">
                                <p>
                                    <strong>{fullName(item)} </strong>
                                    <br />
                                    <span>{item?.workplace}</span>
                                </p>
                                <p>
                                    {item?.client?.length}
                                </p>
                            </div>
                            {
                                item?.client?.map((clientItem: any) => (
                                    <div className="border border-primary rounded p-2 my-1">
                                        <div className="d-flex align-items-center justify-content-between">
                                        
                                            <FaCheckSquare size={24} className='text-success' />
                                        </div>
                                        <h3>
                                            {fullName(clientItem)}
                                        </h3>
                                        <p>+998 {phoneFormatNumber(item?.phone)}</p>
                                        {
                                            clientItem?.graph_achive?.map((graphItem: any) => (
                                                <div className="d-flex my-2 gap-3">
                                                    {
                                                        graphItem?.graph_archive_item.map((dayItem: any, index: number) => (
                                                            <p className='d-flex gap-1'>
                                                                <span> {index + 1}</span>
                                                                {statusIcon(dayItem, graphItem.work_end_time)}
                                                             
                                                            </p>
                                                        ))
                                                    }
                                                </div>
                                            ))
                                        }

                                      
                                    </div>
                                ))
                            }

                        </div>)
                        ) :  data?.data?.map((item: any) => (<div className="card my-2">
                            <div className="d-flex justify-content-between align-items-center my-1">
                                <p>
                                    <strong>{fullName(item)} </strong>
                                    <br />
                                    <span>{item?.workplace}</span>
                                </p>
                                <p>
                                {item?.client?.length}
                                </p>
                            </div>
                            {
                                item?.client?.map((clientItem: any) => (
                                    <div className="border border-primary rounded p-2 my-1">
                                        <div className="d-flex align-items-center justify-content-between">
                       
                                            <FaCheckSquare size={24} className='text-success' />
                                        </div>
                                        <h3>
                                            {fullName(clientItem)}
                                        </h3>
                                        <p>+998 {phoneFormatNumber(item?.phone)}</p>
                                        {
                                            clientItem?.graph_achive?.map((graphItem: any) => (
                                                <div className="d-flex my-2 gap-3">
                                                    {
                                                        graphItem?.graph_archive_item.map((dayItem: any, index: number) => (
                                                            <p className='d-flex gap-1'>
                                                                <span> {index + 1}</span>
                                                                {statusIcon(dayItem, graphItem.work_end_time)}
                                                             
                                                            </p>
                                                        ))
                                                    }
                                                </div>
                                            ))
                                        }

                         
                                    </div>
                                ))
                            }

                        </div>)
                        ) 
                } */}



            </div>
        </Content >
    )
}

export default CounterpartyClientMobile