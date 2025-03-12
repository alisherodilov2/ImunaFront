import React, { useEffect, useState } from 'react'
import Content from '../../../layout/Content'
import Navbar from '../../../layout/Navbar'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../../../service/store/store'
import { ReducerType } from '../../../interface/interface'
import { isStatisticaGet } from '../../../service/reducer/StatisticaReducer'
import Select from 'react-select';
import MuolajaChart from './MuolajaChart'
import TableLoader from '../../../componets/table/TableLoader'
import AmbuatorTable from './AmbuatorTable'
import axios from 'axios'
import MuolajaTable from './MuolajaTable'
import { FaHospitalUser, FaUser } from 'react-icons/fa'
import StatistikaChart from './StatistikaChart'
import { isSetHomeTab } from '../../../service/reducer/ProfileReducer'

const Statistica = () => {
    const [item, setItem] = useState([] as any)
    const [modal, setModal] = useState(false)
    const [modal2, setModal2] = useState(false)
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState('')
    const viewTitle = (data: any) => {
        if (data == 'ambulator') {
            return 'Ambulator'
        }
        if (data == 'kelmaganlar') {
            return 'Kelmaganlar'
        }

        if (data == 'finish') {
            return 'Yakunlangan'
        }
        if (data == 'archive') {
            return 'Arxiv'
        }
        if (data == 'ayollar') {
            return 'Ayollar'
        }
        if (data == 'erkaklar') {
            return 'Erkaklar'
        }
        if (data == 'bemorlar') {
            return 'Umumiy bemorlar'
        }
        if (data == 'yangibemorlar') {
            return 'Yangi bemorlar'
        }
        if (data == 'tugayotkanlar') {
            return 'Tugatyotganlar'
        }
        if (data == 'erkaklar') {
            return 'Muolajadagilar'
        }
    }
    const showData = async (data: any) => {
        try {
            setLoading(() => true)
            setStatus(() => data)
            let res = await axios.get(`/statistica?status=${data}&is_today=${search.is_today ? '1' : '0'}&month=${statisticaData?.month?.value ?? ''}&is_all=${search.all ? '1' : '0'}`)
            const { result } = res.data
            console.log(result);
            setItem(() => result.data)
            if (data == 'ambulator' || data == 'bemorlar' || (data == 'ayollar' || data == 'erkaklar')) {
                setModal(() => true)
            } else {
                setModal2(() => true)
            }
            // setCash(() => true)
        } catch (error) {

        } finally {
            setLoading(() => false)
        }
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
    const dispatch = useDispatch<AppDispatch>()
    const { statisticaData, isLoading } = useSelector((state: ReducerType) => state.StatisticaReducer)
    useEffect(() => {
        dispatch(isStatisticaGet(''))
        setSearch((res: any) => {
            return {
                ...res,
                month: statisticaData.month
            }
        })
    }, [])
    const { user } = useSelector((state: ReducerType) => state.ProfileReducer)

    const [search, setSearch] = useState({
        is_today: false,
        branch: user?.branch?.at(0),
        client_status: '',
        month: {
            label: 'Oylar',
            value: ''
        },
        all: false,
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
    useEffect(() => {
        if (user?.branch?.length > 1) {
            setSearch((res: any) => {
                return {
                    ...res,
                    branch: user?.branch?.at(0)
                }
            })
        }
    }, [])
    const {  home_tab } = useSelector((state: ReducerType) => state.ProfileReducer)
    return (
        <Content loading={loading}>
            <Navbar />
            <div className="container-fluid flex-grow-1 container-p-y size_16 ">
            {
                    +user?.is_gijja ? <div className="btn-group">
                        <button className={`btn btn-${home_tab == 0 ? 'primary' : 'secondary'}`}
                            onClick={() => {
                                dispatch(isSetHomeTab(0))
                            }}
                        >Statika 1</button>
                        <button className={`btn btn-${home_tab == 1 ? 'primary' : 'secondary'}`}
                            onClick={() => {
                                dispatch(isSetHomeTab(1))
                            }}
                        >Statika 2</button>
                    </div> : ''
                }
                <div className="my-1  row ">
                    <div className="col-lg-3 my-1  col-6">
                        <Select
                            name='name'
                            isDisabled={user?.is_main_branch}
                            value={search?.branch}
                            onChange={(e: any) => {
                                // setSearch((res: any) => {
                                //     return {
                                //         ...res,
                                //         branch: e,
                                //         all: false,
                                //         client_status: '',
                                //         is_today: false
                                //     }
                                // })
                                dispatch(isStatisticaGet(`?is_all=${search?.all ? '1' : '0'}&is_today=${search.is_today ? '1' : '0'}&month=${statisticaData.month?.value ?? ''}&year=${statisticaData?.year?.value ?? ''}&year=${e?.value ?? ''}&branch_id=${e?.value ?? ''}`))

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
                    <div className="col-lg-2 my-1  col-6 offset-lg-2  d-flex align-items-center gap-2">
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
                                                client_status: '',
                                                is_today: value ? false : res?.is_today,

                                            }
                                        })

                                        dispatch(isStatisticaGet(`?is_all=${value ? '1' : '0'}&is_today=${search.is_today ? '1' : '0'}&month=${statisticaData?.month?.value ?? ''}&year=${statisticaData?.current_year?.value ?? ''}&branch_id=${search?.branch?.value ?? ''}`))
                                        // getData(query)

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
                                                all: value ? false : res?.all,
                                                is_today: e.target.checked,
                                                client_status: '',

                                            }
                                        })
                                        let query = `is_all=${value ? '0' : '1'}end_age=${(search?.end_age)}&start_age=${(search?.start_age)}&phone=${search.phone}&full_name=${search?.full_name?.trim().toLowerCase()}&is_today=${value ? '1' : '0'}&index=-&treatment_id=${search?.treatment_id?.value ?? ''}&status=${search?.status?.value ?? ''}`
                                        dispatch(isStatisticaGet(`?is_today=${value ? '1' : '0'}&month=${statisticaData?.month?.value ?? ''}&year=${statisticaData?.current_year?.value ?? ''}&branch_id=${search?.branch?.value ?? ''}`))
                                        // getData(query)
                                    }}

                                />
                            </div>


                        </div>
                    </div>

                    <div className="col-lg-3  my-1 col-6">
                        <Select
                            name='name'
                            value={statisticaData?.month}
                            onChange={(e: any) => {
                                setSearch((res: any) => {
                                    return {
                                        ...res,
                                        is_today: false,
                                        all: false,

                                    }
                                })
                                dispatch(isStatisticaGet(`?is_all=0&is_today=0&month=${e?.value ?? ''}&year=${statisticaData?.current_year?.value ?? ''}&branch_id=${search?.branch?.value ?? ''}`))

                                // dispatch(isGraphGet(`?year=${graphData?.current_year?.value ?? ''}&month=${e?.value ?? ''}&department_id=${graphData?.department?.value ?? ''}`))
                            }}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            options={
                                [
                                    ...oylar
                                ]
                            } />
                    </div>

                    <div className="col-lg-2 my-1  col-6">
                        <Select
                            name='name'
                            value={statisticaData?.year}
                            onChange={(e: any) => {

                                dispatch(isStatisticaGet(`?is_all=${search?.all ? '1' : '0'}&is_today=${search.is_today ? '1' : '0'}&month=${statisticaData.month?.value ?? ''}&branch_id=${search?.branch?.value ?? ''}&year=${e?.value ?? ''}`))

                                // dispatch(isGraphGet(`?year=${graphData?.current_year?.value ?? ''}&month=${e?.value ?? ''}&department_id=${graphData?.department?.value ?? ''}`))
                            }}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            options={
                                user?.years?.map((item: any) => {
                                    return {
                                        value: item,
                                        label: item
                                    }
                                })
                            } />
                    </div>
                </div>
                {
                    isLoading ?
                        <div className='bg-white rounded p-1 text-center d-flex  align-items-center gap-3 justify-content-center'>
                            <TableLoader />
                            <h4 className='mb-0'>Yuklanmoqda</h4>
                        </div> : <div className="row my-3">
                            <div className="col-3">
                                <div className="card cursor-pointer border-0 border-bottom border-warning border-5"
                                    id='corusel__btn'
                                    onClick={() => {
                                        showData('ambulator')
                                    }}
                                >
                                    <div className="card-body card-body_change" >

                                        <div className="row align-items-center" >
                                            <div className="col-6 d-flex  gap-4 ">
                                                <div>

                                                    <h2 className="card-title fw-bold  text-info text-center" >{statisticaData?.ambulator}</h2>
                                                    <h4 className="fw-bold d-block ">Ambulator</h4>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <StatistikaChart foiz={statisticaData?.ambulator > 0 ? (statisticaData?.ambulator / statisticaData?.bemorlar) * 100 : 0} range='#ffab00' />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-3">
                                <div className="card cursor-pointer border-0 border-bottom border-primary border-5"
                                    id='corusel__btn'
                                    onClick={() => {
                                        showData('kelmaganlar')
                                    }}
                                >
                                    <div className="card-body card-body_change" >

                                        <div className="row align-items-center" >
                                            <div className="col-6 d-flex  gap-4 ">
                                                <div>

                                                    <h2 className="card-title fw-bold  text-danger text-center" >{statisticaData?.kelmaganlar}</h2>
                                                    <h4 className="fw-bold d-block ">Kelmaganlar</h4>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <StatistikaChart foiz={statisticaData?.kelmaganlar > 0 ? (statisticaData?.kelmaganlar / statisticaData?.bemorlar) * 100 : 0} range='#ff3e1d' />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-3">
                                <div className="card cursor-pointer border-0 border-bottom border-secondary border-5"
                                    id='corusel__btn'
                                    onClick={() => {
                                        showData('archive')
                                    }}
                                >
                                    <div className="card-body card-body_change" >

                                        <div className="row align-items-center" >
                                            <div className="col-6 d-flex  gap-4 ">
                                                <div>

                                                    <h2 className="card-title  fw-bold  text-info text-center" >{statisticaData?.arxivlanganlar}</h2>
                                                    <h4 className="fw-bold d-block ">Arxivlanganlar</h4>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <StatistikaChart foiz={statisticaData?.arxivlanganlar > 0 ? (statisticaData?.arxivlanganlar / statisticaData?.bemorlar) * 100 : 0} range='#8592a3' />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-3">
                                <div className="card cursor-pointer border-0 border-bottom border-success border-5"
                                    id='corusel__btn'
                                    onClick={() => {
                                        showData('finish')
                                    }}
                                >
                                    <div className="card-body card-body_change" >

                                        <div className="row align-items-center" >
                                            <div className="col-6 d-flex  gap-4 ">
                                                <div>

                                                    <h2 className="card-title fw-bold  text-info text-center" >{statisticaData?.yakunlanganlar}</h2>
                                                    <h4 className="fw-bold d-block ">Yakunlanganlar</h4>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <StatistikaChart foiz={statisticaData?.yakunlanganlar > 0 ? (statisticaData?.yakunlanganlar / statisticaData?.bemorlar) * 100 : 0} range='#696cff' />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* analiz */}
                            <div className="col-3 my-1">
                                <div className="card cursor-pointer border-0 border-bottom border-success border-5"
                                    id='corusel__btn'
                                    onClick={() => {
                                        // showData('yangibemorlar')
                                    }}
                                >
                                    <div className="card-body">
                                        <div className='d-flex align-items-center justify-content-between'>
                                            <p className='mb-0'>
                                                <FaUser size={34} />
                                            </p>
                                            <h1 className=" text-end  mb-1 pr-2">{statisticaData?.analiz}</h1>
                                        </div>
                                        <p className="fw-bold   d-block mb-0">Analizlar soni</p>
                                    </div>
                                </div>
                            </div>
                            {/* yani bemorlar */}
                            <div className="col-3 my-1">
                                <div className="card cursor-pointer border-0 border-bottom border-success border-5"
                                    id='corusel__btn'
                                    onClick={() => {
                                        // showData('yangibemorlar')
                                    }}
                                >
                                    <div className="card-body">
                                        <div className='d-flex align-items-center justify-content-between'>
                                            <p className='mb-0'>
                                                <FaUser size={34} />
                                            </p>
                                            <h1 className=" text-end  mb-1 pr-2">{statisticaData?.new_clinet}</h1>
                                        </div>
                                        <p className="fw-bold   d-block mb-0">Yani bemorlar </p>
                                    </div>
                                </div>
                            </div>

                            {/* muoljalr  soni */}
                            <div className="col-3 my-1">
                                <div className="card cursor-pointer border-0 border-bottom border-success border-5"
                                    id='corusel__btn'
                                    onClick={() => {
                                        // showData('yangibemorlar')
                                    }}
                                >
                                    <div className="card-body">
                                        <div className='d-flex align-items-center justify-content-between'>
                                            <p className='mb-0'>
                                                <FaUser size={34} />
                                            </p>
                                            <h1 className=" text-end  mb-1 pr-2">{statisticaData?.muoljadagilar}</h1>
                                        </div>
                                        <p className="fw-bold   d-block mb-0">Muoljaladiglar </p>
                                    </div>
                                </div>
                            </div>
                            {/* MED PREDSTAVITELDAN YANGI BEMORLAR  */}
                            <div className="col-3 my-1">
                                <div className="card cursor-pointer border-0 border-bottom border-success border-5"
                                    id='corusel__btn'
                                    onClick={() => {
                                        // showData('yangibemorlar')
                                    }}
                                >
                                    <div className="card-body">
                                        <div className='d-flex align-items-center justify-content-between'>
                                            <p className='mb-0'>
                                                <FaUser size={34} />
                                            </p>
                                            <h1 className=" text-end  mb-1 pr-2">{statisticaData?.yollanma_client}</h1>
                                        </div>
                                        <p className="fw-bold   d-block mb-0">MED PREDSTAVITELDAN YANGI BEMORLAR </p>
                                    </div>
                                </div>
                            </div>
                            {/* Yo'llanma anliz  */}
                            <div className="col-3 my-1">
                                <div className="card cursor-pointer border-0 border-bottom border-success border-5"
                                    id='corusel__btn'
                                    onClick={() => {
                                        // showData('yangibemorlar')
                                    }}
                                >
                                    <div className="card-body">
                                        <div className='d-flex align-items-center justify-content-between'>
                                            <p className='mb-0'>
                                                <FaUser size={34} />
                                            </p>
                                            <h1 className=" text-end  mb-1 pr-2">{statisticaData?.yollanma_analiz}</h1>
                                        </div>
                                        <p className="fw-bold   d-block mb-0">Yo'llanma anliz </p>
                                    </div>
                                </div>
                            </div>
                            {/*yangi Yo'llanma  analiz  */}
                            <div className="col-3 my-1">
                                <div className="card cursor-pointer border-0 border-bottom border-success border-5"
                                    id='corusel__btn'
                                    onClick={() => {
                                        // showData('yangibemorlar')
                                    }}
                                >
                                    <div className="card-body">
                                        <div className='d-flex align-items-center justify-content-between'>
                                            <p className='mb-0'>
                                                <FaUser size={34} />
                                            </p>
                                            <h1 className=" text-end  mb-1 pr-2">{statisticaData?.new_yollanma_client}</h1>
                                        </div>
                                        <p className="fw-bold   d-block mb-0">Yangi Yo'llanma bemor</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 my-1">
                                <h1>Reklama analizlar</h1>
                                <div className="row">
                                    {
                                        statisticaData?.advertisements_analiz?.map((res: any) => (
                                            <div className="col-3">
                                                <div className="card cursor-pointer border-0 border-bottom border-success border-5"
                                                    id='corusel__btn'
                                                    onClick={() => {
                                                        // showData('yangibemorlar')
                                                    }}
                                                >
                                                    <div className="card-body">
                                                        <div className='d-flex align-items-center justify-content-between'>
                                                            <p className='mb-0'>
                                                                <FaUser size={34} />
                                                            </p>
                                                            <h1 className=" text-end  mb-1 pr-2">{res?.qty}</h1>
                                                        </div>
                                                        <p className="fw-bold   d-block mb-0">{res?.name}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>



                            <div className="col-12">
                                <h1>Reklama yani bemor</h1>
                                <div className="row">
                                    {
                                        statisticaData?.advertisements_new_client?.map((res: any) => (
                                            <div className="col-3">
                                                <div className="card cursor-pointer border-0 border-bottom border-success border-5"
                                                    id='corusel__btn'
                                                    onClick={() => {
                                                        // showData('yangibemorlar')
                                                    }}
                                                >
                                                    <div className="card-body">
                                                        <div className='d-flex align-items-center justify-content-between'>
                                                            <p className='mb-0'>
                                                                <FaUser size={34} />
                                                            </p>
                                                            <h1 className=" text-end  mb-1 pr-2">{res?.qty}</h1>
                                                        </div>
                                                        <p className="fw-bold   d-block mb-0">{res?.name}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>



                            <div className="col-12">
                                <div className="row">
                                    <div className="col-6 mt-2">
                                        <div className="row " >
                                            <div className="col-4">
                                                <div className="row">
                                                    <div className="col-6">
                                                        <div className="card  border-0 border-bottom border-success border-5 cursor-pointer border p-1 " id='rounded' onClick={() => { showData('bemorlar') }}>
                                                            {/* <FaHospitalUser size={34} /> */}
                                                            <h4 className="card-title text-nowrap mb-1">{statisticaData?.bemorlar}</h4>
                                                            <p> Bemorlar</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-6">
                                                        <div className="card  border-0 border-bottom border-success border-5 cursor-pointer border p-1 " id='rounded' onClick={() => { showData('bemorlar') }}>
                                                            {/* <FaHospitalUser size={34} /> */}
                                                            <h4 className="card-title text-nowrap mb-1">{statisticaData?.age?.age_1_5}</h4>
                                                            <p>1-5 yosh</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-6">
                                                        <div className="card  border-0 border-bottom border-success border-5 cursor-pointer border p-1 " id='rounded' onClick={() => { showData('bemorlar') }}>
                                                            {/* <FaHospitalUser size={34} /> */}
                                                            <h4 className="card-title text-nowrap mb-1">{statisticaData?.age?.age_6_14}</h4>
                                                            <p>6-14 yosh</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-6">
                                                        <div className="card  border-0 border-bottom border-success border-5 cursor-pointer border p-1 " id='rounded' onClick={() => { showData('bemorlar') }}>
                                                            {/* <FaHospitalUser size={34} /> */}
                                                            <h4 className="card-title text-nowrap mb-1">{statisticaData?.age?.age_15}</h4>
                                                            <p>15+ yosh</p>
                                                        </div>
                                                    </div>


                                                </div>

                                                {/* <div className="card  cursor-pointer border-0 border-bottom border-success border-5 my-3 p-1 " id='rounded' onClick={() => {
                                            showData('erkaklar')

                                        }}>
                                 
                                            <h3 className="card-title text-nowrap mb-1">{statisticaData?.erkaklar}</h3>
                                            <p>Erkaklar</p>
                                        </div>
                                        <div className="card border-0 border-bottom border-success border-5 cursor-pointer border p-1 my-3 " id='rounded' onClick={() => {
                                            showData('ayollar')
                                        }}>
                                      
                                            <h3 className="card-title text-nowrap mb-1">{statisticaData?.ayollar}</h3>
                                            <p>Ayollar</p>
                                        </div> */}

                                            </div>
                                            <div className="col-8 mb-0">
                                                <MuolajaChart />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-6 mt-2">
                                        <h4 className='text-end'>Bugungi statistika</h4>
                                        <div className="row">




                                            <div className="col-4">
                                                <div className="card cursor-pointer border-0 border-bottom border-success border-5"
                                                    id='corusel__btn'
                                                    onClick={() => {
                                                        showData('yangibemorlar')
                                                    }}
                                                >
                                                    <div className="card-body">
                                                        <div className='d-flex align-items-center justify-content-between'>
                                                            <p className='mb-0'>
                                                                <FaUser size={34} />
                                                            </p>
                                                            <h1 className=" text-end  mb-1 pr-2">{statisticaData?.yangibemorlar}</h1>
                                                        </div>
                                                        <p className="fw-bold   d-block mb-0">Yangi bemorlar</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="card cursor-pointer border-0 border-bottom border-success border-5"
                                                    id='corusel__btn'
                                                    onClick={() => {
                                                        showData('tugayotkanlar')
                                                    }}
                                                >
                                                    <div className="card-body ">
                                                        <div className='d-flex align-items-center justify-content-between'>
                                                            <p className='mb-0'>
                                                                <FaUser size={34} />
                                                            </p>
                                                            <h1 className=" text-end  mb-1 pr-2">{statisticaData?.tugayotkanlar}</h1>
                                                        </div>
                                                        <p className="fw-bold   d-block mb-0">Tugatyotkanlar</p>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="col-4">
                                                <div className="card cursor-pointer border-0 border-bottom border-success border-5"
                                                    id='corusel__btn'
                                                    onClick={() => {
                                                        showData('muoljadagilar')
                                                    }}
                                                >
                                                    <div className="card-body">
                                                        <div className='d-flex align-items-center justify-content-between'>
                                                            <p className='mb-0'>
                                                                <FaUser size={34} />
                                                            </p>
                                                            <h1 className=" text-end  mb-1 pr-2">{statisticaData?.muoljadagilar}</h1>
                                                        </div>
                                                        <p className="fw-bold   d-block mb-0">Muolajadagilar</p>

                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                        <br />
                                        <h4 className='d-flex justify-content-between align-items-center'>
                                            <span>

                                                Kutiloykanlar
                                            </span>
                                            <span>12</span>
                                        </h4>
                                        <div className="progress mb-3">
                                            <div className="progress-bar bg-warning shadow-none" role="progressbar" style={{ width: '15%' }} aria-valuenow={15} aria-valuemin={0} aria-valuemax={100} />
                                        </div>
                                        <h4 className='d-flex justify-content-between align-items-center'>
                                            <span>
                                                Klinkada
                                            </span>
                                            <span>12</span>
                                        </h4>

                                        <div className="progress mb-3">
                                            <div className="progress-bar bg-primary shadow-none" role="progressbar" style={{ width: '15%' }} aria-valuenow={15} aria-valuemin={0} aria-valuemax={100} />
                                        </div>
                                        <h4 className='d-flex justify-content-between align-items-center'>
                                            <span>
                                                Tasdiqlangan
                                            </span>
                                            <span>12</span>
                                        </h4>

                                        <div className="progress mb-3">
                                            <div className="progress-bar bg-success shadow-none" role="progressbar" style={{ width: '15%' }} aria-valuenow={15} aria-valuemin={0} aria-valuemax={100} />
                                        </div>
                                        <h4 className='d-flex justify-content-between align-items-center'>
                                            <span>
                                                Kelmadi
                                            </span>
                                            <span>12</span>
                                        </h4>

                                        <div className="progress mb-3">
                                            <div className="progress-bar bg-danger shadow-none" role="progressbar" style={{ width: '15%' }} aria-valuenow={15} aria-valuemin={0} aria-valuemax={100} />
                                        </div>

                                    </div>

                                </div>
                            </div>

                        </div>
                }

            </div>
            <AmbuatorTable data={item} modal={modal} setModal={setModal} title={viewTitle(status)} />
            <MuolajaTable data={item} modal={modal2} setModal={setModal2} title={viewTitle(status)} />
        </Content >
    )
}

export default Statistica
