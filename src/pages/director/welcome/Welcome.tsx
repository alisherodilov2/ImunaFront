import React, { useEffect, useState } from 'react'
import Content from '../../../layout/Content'
import Navbar from '../../../layout/Navbar'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../../../service/store/store'
import { ReducerType } from '../../../interface/interface'
import Select from 'react-select';
import TableLoader from '../../../componets/table/TableLoader'
import axios from 'axios'
import { FaHospitalUser, FaUser } from 'react-icons/fa'
import StatistikaChart from '../statistica/StatistikaChart'
import MuolajaChart from '../statistica/MuolajaChart'
import AmbuatorTable from '../statistica/AmbuatorTable'
import MuolajaTable from '../statistica/MuolajaTable'
import { NumericFormat } from 'react-number-format'
import { isSetHomeTab } from '../../../service/reducer/ProfileReducer'

const Welcome = () => {
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
    const [statisticaData, setStatisticaData] = useState({} as any)
    const getData = async (data: any) => {
        try {
            setLoading(() => true)
            setStatus(() => data)
            let res = await axios.get(`/statistica/home${data}`)
            const { result } = res.data
            console.log(result);
            setStatisticaData(() => result)
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
    const { isLoading } = useSelector((state: ReducerType) => state.StatisticaReducer)
    useEffect(() => {
        getData('?is_today=1')
    }, [])
    const [search, setSearch] = useState({
        is_today: true,
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
    const { user, home_tab } = useSelector((state: ReducerType) => state.ProfileReducer)
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
                    <div className="col-xl-2 offset-xl-7 offset-lg-5   offset-0 col-lg-4 col-md-4  col-6 d-flex align-items-center gap-2">
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
                                                is_today: value ? false : true,
                                            }
                                        })
                                        if (value) {
                                            getData(`?is_all=1`)
                                        } else {
                                            getData(`?is_today=1`)
                                        }
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
                                                all: value ? false : true,
                                                is_today: e.target.checked,
                                                client_status: '',

                                            }
                                        })
                                        if (value) {
                                            getData(`?is_today=1`)

                                        } else {
                                            getData(`?is_all=1`)

                                        }
                                        // getData(query)
                                    }}

                                />
                            </div>


                        </div>
                    </div>
                    <div className="col-xl-3 col-lg-3 col-md-3 col-6">
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
                                getData(`?month=${e?.value ?? ''}`)
                            }}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            options={
                                [
                                    ...oylar
                                ]
                            } />
                    </div>
                </div>
                {
                    isLoading ?
                        <div className='bg-white rounded p-1 text-center d-flex  align-items-center gap-3 justify-content-center'>
                            <TableLoader />
                            <h4 className='mb-0'>Yuklanmoqda</h4>
                        </div> : <div className="row my-3">
                            <div className="col-xl-3 col-lg-6 col-md-12 mb-4">
                                <div className="card cursor-pointer border-0 border-bottom border-warning border-5"
                                    id='corusel__btn'
                                    onClick={() => {
                                        // showData('Mijozlar')
                                    }}
                                >
                                    <div className="card-body card-body_change" >

                                        <div className="row align-items-center" >
                                            <div className="col-6 d-flex  gap-4 ">
                                                <div>

                                                    <h2 className="card-title fw-bold  text-info text-center" >
                                                        <NumericFormat displayType="text"
                                                            thousandSeparator
                                                            decimalScale={2}
                                                            value={statisticaData?.soffoyda ?? 0} />
                                                    </h2>
                                                    <h4 className="fw-bold d-block ">Sof foyda</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-lg-6 col-md-12 mb-4">
                                <div className="card cursor-pointer border-0 border-bottom border-warning border-5"
                                    id='corusel__btn'
                                    onClick={() => {
                                        // showData('Mijozlar')
                                    }}
                                >
                                    <div className="card-body card-body_change" >

                                        <div className="row align-items-center" >
                                            <div className="col-6 d-flex  gap-4 ">
                                                <div>

                                                    <h2 className="card-title fw-bold  text-info text-center" >
                                                        <NumericFormat displayType="text"
                                                            thousandSeparator
                                                            decimalScale={2}
                                                            value={statisticaData?.bemorlar ?? 0} />
                                                    </h2>
                                                    <h4 className="fw-bold d-block ">Mijozlar</h4>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-lg-6 col-md-12 mb-4">
                                <div className="card cursor-pointer border-0 border-bottom border-secondary border-5"
                                    id='corusel__btn'
                                    onClick={() => {
                                        // showData('archive')
                                    }}
                                >
                                    <div className="card-body card-body_change" >

                                        <div className="row align-items-center" >
                                            <div className="col-6 d-flex  gap-4 ">
                                                <div>

                                                    <h2 className="card-title  fw-bold  text-info text-center" >
                                                        <NumericFormat displayType="text"
                                                            thousandSeparator
                                                            decimalScale={2}
                                                            value={statisticaData?.service ?? 0} />
                                                    </h2>
                                                    <h4 className="fw-bold d-block ">Xizmatlar</h4>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-lg-6 col-md-12 mb-4">
                                <div className="card cursor-pointer border-0 border-bottom border-success border-5"
                                    id='corusel__btn'
                                    onClick={() => {
                                        // showData('finish')
                                    }}
                                >
                                    <div className="card-body card-body_change" >

                                        <div className="row align-items-center" >
                                            <div className="col-6 d-flex  gap-4 ">
                                                <div>
                                                    <h2 className="card-title fw-bold  text-info text-center" >
                                                        <NumericFormat displayType="text"
                                                            thousandSeparator
                                                            decimalScale={2}
                                                            value={statisticaData?.xarjatlar ?? 0} />
                                                    </h2>
                                                    <h4 className="fw-bold d-block ">Xarajatlar</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* umumiy */}
                            <div className="col-xl-3 col-lg-6 col-md-12 mb-4">
                                <div className="card cursor-pointer border-0 border-bottom border-success border-5"
                                    id='corusel__btn'
                                    onClick={() => {
                                        // showData('finish')
                                    }}
                                >
                                    <div className="card-body card-body_change" >

                                        <div className="row align-items-center" >
                                            <div className="col-6 d-flex  gap-4 ">
                                                <div>
                                                    <h2 className="card-title fw-bold  text-info text-center" >
                                                        <NumericFormat displayType="text"
                                                            thousandSeparator
                                                            decimalScale={2}
                                                            value={statisticaData?.total_price ?? 0} />
                                                    </h2>
                                                    <h4 className="fw-bold d-block ">Umumiy</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* qarz */}
                            <div className="col-xl-3 col-lg-6 col-md-12 mb-4">
                                <div className="card cursor-pointer border-0 border-bottom border-success border-5"
                                    id='corusel__btn'
                                    onClick={() => {
                                        // showData('finish')
                                    }}
                                >
                                    <div className="card-body card-body_change" >

                                        <div className="row align-items-center" >
                                            <div className="col-6 d-flex  gap-4 ">
                                                <div>
                                                    <h2 className="card-title fw-bold  text-info text-center" >
                                                        <NumericFormat displayType="text"
                                                            thousandSeparator
                                                            decimalScale={2}
                                                            value={statisticaData?.debt ?? 0} />
                                                    </h2>
                                                    <h4 className="fw-bold d-block ">Qarz</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* DR SINO DORIXONASI */}
                            {/* <div className="col-xl-3 col-lg-6 col-md-12 mb-4">
                                <div className="card cursor-pointer border-0 border-bottom border-success border-5"
                                    id='corusel__btn'
                                    onClick={() => {
                                        // showData('finish')
                                    }}
                                >
                                    <div className="card-body card-body_change" >

                                        <div className="row align-items-center" >
                                            <div className="col-6 d-flex  gap-4 ">
                                                <div>
                                                    <h2 className="card-title fw-bold  text-info text-center" >
                                                        <NumericFormat displayType="text"
                                                            thousandSeparator
                                                            decimalScale={2}
                                                            value={statisticaData?.dorixona ?? 0} />
                                                    </h2>
                                                    <h4 className="fw-bold d-block ">DR SINO DORIXONASI</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                            {/* MP - Kontragent ishlagan puli  */}
                            <div className="col-xl-3 col-lg-6 col-md-12 mb-4">
                                <div className="card cursor-pointer border-0 border-bottom border-success border-5"
                                    id='corusel__btn'
                                    onClick={() => {
                                        // showData('finish')
                                    }}
                                >
                                    <div className="card-body card-body_change" >

                                        <div className="row align-items-center" >
                                            <div className="col-6 d-flex  gap-4 ">
                                                <div>
                                                    <h2 className="card-title fw-bold  text-info text-center" >
                                                        <NumericFormat displayType="text"
                                                            thousandSeparator
                                                            decimalScale={2}
                                                            value={statisticaData?.kontragent ?? 0} />
                                                    </h2>
                                                    <h4 className="fw-bold d-block ">Kontragent ulushi </h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* KASSADAN NAQT XARAJAT  */}
                            {/* <div className="col-xl-3 col-lg-6 col-md-12 mb-4">
                                <div className="card cursor-pointer border-0 border-bottom border-success border-5"
                                    id='corusel__btn'
                                    onClick={() => {
                                        // showData('finish')
                                    }}
                                >
                                    <div className="card-body card-body_change" >

                                        <div className="row align-items-center" >
                                            <div className="col-6 d-flex  gap-4 ">
                                                <div>
                                                    <h2 className="card-title fw-bold  text-info text-center" >
                                                        <NumericFormat displayType="text"
                                                            thousandSeparator
                                                            decimalScale={2}
                                                            value={statisticaData?.cash_expence ?? 0} />
                                                    </h2>
                                                    <h4 className="fw-bold d-block ">KASSADAN NAQT XARAJAT</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> */}

                            <div className="col-12">
                                <div className="row">
                                    <div className="col-xl-6 col-lg-12 pt-5">
                                        <div className="d-flex gap-2 justify-content-between align-items-center">
                                            <h4 className='fw-bold  mb-0'>Bugungi tushumlar</h4>
                                            <h3 className='fw-bold text-info mb-0'>
                                                <NumericFormat displayType="text"
                                                    thousandSeparator
                                                    decimalScale={2}
                                                    value={statisticaData?.daily?.income?.total_price ?? 0} />
                                            </h3>
                                        </div>
                                        <br />
                                        <h4 className='d-flex justify-content-between align-items-center'>
                                            <span>
                                                Naqd
                                            </span>
                                            <span>
                                                <NumericFormat displayType="text"
                                                    thousandSeparator
                                                    decimalScale={2}
                                                    value={statisticaData?.daily?.income?.cash_price ?? 0} />
                                            </span>
                                        </h4>
                                        <div className="progress mb-3">
                                            <div className="progress-bar bg-success shadow-none" role="progressbar" style={{ width: `${(statisticaData?.daily?.income?.cash_price / statisticaData?.daily?.income?.total_price) * 100}%` }} aria-valuenow={15} aria-valuemin={0} aria-valuemax={100} />
                                        </div>
                                        <h4 className='d-flex justify-content-between align-items-center'>
                                            <span>
                                                Plastik
                                            </span>
                                            <span>
                                                <NumericFormat displayType="text"
                                                    thousandSeparator
                                                    decimalScale={2}
                                                    value={statisticaData?.daily?.income?.card_price ?? 0} />
                                            </span>
                                        </h4>
                                        <div className="progress mb-3">
                                            <div className="progress-bar bg-info shadow-none" role="progressbar" style={{ width: `${(statisticaData?.daily?.income?.card_price / statisticaData?.daily?.income?.total_price) * 100}%` }} aria-valuenow={15} aria-valuemin={0} aria-valuemax={100} />
                                        </div>
                                        <h4 className='d-flex justify-content-between align-items-center'>
                                            <span>
                                                O'tkazma
                                            </span>
                                            <span>
                                                <NumericFormat displayType="text"
                                                    thousandSeparator
                                                    decimalScale={2}
                                                    value={statisticaData?.daily?.income?.transfer_price ?? 0} />
                                            </span>
                                        </h4>
                                        <div className="progress mb-3">
                                            <div className="progress-bar bg-primary shadow-none" role="progressbar" style={{ width: `${(statisticaData?.daily?.income?.transfer_price / statisticaData?.daily?.income?.total_price) * 100}%` }} aria-valuenow={15} aria-valuemin={0} aria-valuemax={100} />
                                        </div>
                                    </div>

                                    <div className="col-xl-6 col-lg-12 pt-5">
                                        <div className="d-flex justify-content-between align-items-center ">
                                            <h4 className='fw-bold mb-0'>Kassadgi qoldiq</h4>
                                            <h3 className='fw-bold  text-info mb-0'>
                                                <NumericFormat displayType="text"
                                                    thousandSeparator
                                                    decimalScale={2}
                                                    value={statisticaData?.daily?.residue?.total_price ?? 0} />
                                            </h3>
                                        </div>
                                        <br />
                                        <h4 className='d-flex justify-content-between align-items-center'>
                                            <span>
                                                Naqd
                                            </span>
                                            <span>
                                                <NumericFormat displayType="text"
                                                    thousandSeparator
                                                    decimalScale={2}
                                                    value={statisticaData?.daily?.residue?.cash_price ?? 0} />
                                            </span>
                                        </h4>
                                        <div className="progress mb-3">
                                            <div className="progress-bar bg-success shadow-none" role="progressbar" style={{ width: `${(statisticaData?.daily?.residue?.cash_price / statisticaData?.daily?.residue?.total_price) * 100}%` }} aria-valuenow={15} aria-valuemin={0} aria-valuemax={100} />
                                        </div>
                                        <h4 className='d-flex justify-content-between align-items-center'>
                                            <span>
                                                Plastik
                                            </span>
                                            <span>
                                                <NumericFormat displayType="text"
                                                    thousandSeparator
                                                    decimalScale={2}
                                                    value={statisticaData?.daily?.residue?.card_price ?? 0} />
                                            </span>
                                        </h4>
                                        <div className="progress mb-3">
                                            <div className="progress-bar bg-info shadow-none" role="progressbar" style={{ width: `${(statisticaData?.daily?.residue?.card_price / statisticaData?.daily?.residue?.total_price) * 100}%` }} aria-valuenow={15} aria-valuemin={0} aria-valuemax={100} />
                                        </div>
                                        <h4 className='d-flex justify-content-between align-items-center'>
                                            <span>
                                                O'tkazma
                                            </span>
                                            <span>
                                                <NumericFormat displayType="text"
                                                    thousandSeparator
                                                    decimalScale={2}
                                                    value={statisticaData?.daily?.residue?.transfer_price ?? 0} />
                                            </span>
                                        </h4>
                                        <div className="progress mb-3">
                                            <div className="progress-bar bg-primary shadow-none" role="progressbar" style={{ width: `${(statisticaData?.daily?.residue?.transfer_price / statisticaData?.daily?.residue?.total_price) * 100}%` }} aria-valuenow={15} aria-valuemin={0} aria-valuemax={100} />
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

export default Welcome
