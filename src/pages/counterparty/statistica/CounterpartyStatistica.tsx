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
import { FaCheckCircle, FaHospitalUser, FaProcedures, FaTasks, FaUser, FaUserCircle } from 'react-icons/fa'
import StatistikaChart from './StatistikaChart'
import { NumericFormat } from 'react-number-format'
import { BiMoneyWithdraw } from 'react-icons/bi'
import { MdAccessTimeFilled, MdTask } from 'react-icons/md';
import { BsShieldFillCheck } from 'react-icons/bs'
export const chartCalc = (data: any, total: any, target: any) => {
    if (data?.[target] > 0) {
        return data?.[target] / data?.[total] * 100
    }
    return 0
}
const CounterpartyStatistica = () => {
    const [item, setItem] = useState([] as any)
    const [modal, setModal] = useState(false)
    const [modal2, setModal2] = useState(false)
    const [loading, setLoading] = useState(false)
    const showData = async (data: any) => {
        try {
            setLoading(() => true)
            let res = await axios.get(`/statistica/counterparty?status=${data}&is_today=${search.is_today ? '1' : '0'}&month=${statisticaData?.month?.value ?? ''}&is_all=${search.all ? '1' : '0'}`)
            const { result } = res.data
            console.log(result);
            setItem(() => result.data)
            if (data == 'ambulator' || data == 'bemorlar' || (data == 'ayollar' || data == 'ayollar')) {
                // setModal(() => true)
            } else {
                // setModal2(() => true)
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
    const [search, setSearch] = useState({
        is_today: false,
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
    return (
        <Content loading={loading}>
            <Navbar />
            <div className="container-fluid flex-grow-1 container-p-y size_16 ">
                <div className="my-1  row ">
                    <div className="col-6 col-lg-2 offset-0 offset-lg-7   d-flex align-items-center gap-2">
                        <button className='btn btn-primary d-flex align-items-center gap-1'
                            onClick={() => {
                                let value = !search?.all
                                setSearch((res: any) => {
                                    return {
                                        ...res,
                                        all: value,
                                        client_status: '',
                                        is_today: value ? false : res?.is_today,

                                    }
                                })
                                dispatch(isStatisticaGet(`?is_all=${value ? '1' : '0'}&is_today=${search.is_today ? '1' : '0'}&month=${statisticaData?.month?.value ?? ''}`))


                            }}
                        >
                            {search.all ? <FaCheckCircle size={24} /> : ''}
                            Hammasi</button>
                        <button className='btn btn-success d-flex align-items-center gap-1 '
                            onClick={() => {

                                let value = !search?.is_today
                                setSearch((res: any) => {
                                    return {
                                    ...res,
                                        all: value ? false : res?.all,
                                        is_today: value,
                                        client_status: '',

                                    }
                                })
                                let query = `is_all=${value ? '0' : '1'}end_age=${(search?.end_age)}&start_age=${(search?.start_age)}&phone=${search.phone}&full_name=${search?.full_name?.trim().toLowerCase()}&is_today=${value ? '1' : '0'}&index=-&treatment_id=${search?.treatment_id?.value ?? ''}&status=${search?.status?.value ?? ''}`
                                dispatch(isStatisticaGet(`?is_today=${value ? '1' : '0'}&month=${statisticaData?.month?.value ?? ''}`))
                            }}
                        >
                               {search.is_today ? <FaCheckCircle size={24} /> : ''}
                            Bugun</button>
                        {/* <div className='d-flex gap-2 align-items-center'>
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

                                        dispatch(isStatisticaGet(`?is_all=${value ? '1' : '0'}&is_today=${search.is_today ? '1' : '0'}&month=${statisticaData?.month?.value ?? ''}`))
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
                                        dispatch(isStatisticaGet(`?is_today=${value ? '1' : '0'}&month=${statisticaData?.month?.value ?? ''}`))
                                        // getData(query)
                                    }}

                                />
                            </div>


                        </div> */}
                    </div>
                    <div className="col-6 col-lg-3 ">
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
                                dispatch(isStatisticaGet(`?is_all=0&is_today=0&month=${e?.value ?? ''}`))

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
                </div>
                {
                    isLoading ?
                        <div className='bg-white rounded p-1 text-center d-flex  align-items-center gap-3 justify-content-center'>
                            <TableLoader />
                            <h4 className='mb-0'>Yuklanmoqda</h4>
                        </div> :
                        <div className="row my-3">
                            <div className="col-12 col-lg-6 col-xl-4 my-1">
                                <div className="card h-100 cursor-pointer border-0 border-bottom border-warning border-5"
                                    id='corusel__btn'
                                    onClick={() => {
                                        showData('ambulator')
                                    }}
                                >
                                    <div className="card-body card-body_change " >
                                        <div className="d-flex mt-4  justify-content-between align-items-center">
                                            <h3 className='mb-0'>Balans</h3>
                                            <h3 className='mb-0 text-success fw-bold'><NumericFormat displayType="text"
                                                thousandSeparator
                                                decimalScale={2}
                                                value={statisticaData?.balance} /></h3>
                                        </div>
                                        <h2 className='mt-5'>Mijozlar : <NumericFormat displayType="text"
                                            thousandSeparator
                                            decimalScale={2}
                                            value={statisticaData?.clients} />
                                        </h2>
                                        <h2>Xizmatlar : <NumericFormat displayType="text"
                                            thousandSeparator
                                            decimalScale={2}
                                            value={statisticaData?.service_count} /></h2>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-lg-6 col-xl-4 my-1">
                                <div className="card cursor-pointer border-0 border-bottom border-primary border-5"
                                    id='corusel__btn'
                                    onClick={() => {
                                        showData('kelmaganlar')
                                    }}
                                >
                                    <div className="card-body card-body_change" >
                                        <h3 className='mb-0 pt-4 text-end'>Ambulotor reja <span className='text-success'><FaUserCircle size={24} /></span> </h3>
                                        <div className="row align-items-center" >
                                            <div className="col-6 d-flex  gap-4 ">
                                                <div>
                                                    <h2 className='mb-3 d-flex gap-1'>
                                                        <MdAccessTimeFilled className='text-primary' />:
                                                        <NumericFormat displayType="text"
                                                            thousandSeparator
                                                            decimalScale={2}
                                                            value={statisticaData?.ambulatory_service?.ambulatory_plan_qty} />

                                                    </h2>
                                                    <h2 className='mb-1 d-flex gap-1'>
                                                        <BsShieldFillCheck className='text-success' />  : <span className='text-warning'>
                                                            <NumericFormat displayType="text"
                                                                thousandSeparator
                                                                decimalScale={2}
                                                                value={statisticaData?.ambulatory_service?.do} />

                                                        </span></h2>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <StatistikaChart foiz={chartCalc(statisticaData?.ambulatory_service,'ambulatory_plan_qty','do')} range='#ff3e1d' gradient={true} />
                                                {/* <StatistikaChart foiz={statisticaData?.ambulatory_service?.do > 0 ? statisticaData?.ambulatory_service?.do / (statisticaData?.ambulatory_service?.ambulatory_plan_qty * 100) : 0} range='#ff3e1d' gradient={true} /> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 col-lg-6 col-xl-4 my-1">
                                <div className="card cursor-pointer border-0 border-bottom border-primary border-5"
                                    id='corusel__btn'
                                    onClick={() => {
                                        showData('kelmaganlar')
                                    }}
                                >
                                    <div className="card-body card-body_change" >
                                        <h3 className='mb-0 pt-4 text-end'>Ambulotor reja <span className='text-success'><BiMoneyWithdraw size={24} /></span> </h3>
                                        <div className="row align-items-center" >
                                            <div className="col-6 d-flex  gap-4 ">
                                                <div>
                                                    <h2 className='mb-3 d-flex gap-1'>   <MdAccessTimeFilled className='text-primary' /> :   <NumericFormat displayType="text"
                                                        thousandSeparator
                                                        decimalScale={2}
                                                        value={statisticaData?.ambulatory_service?.ambulatory_price} /></h2>
                                                    <h2 className='mb-3 d-flex gap-1'><BsShieldFillCheck className='text-success' /> : <span className='text-warning'><NumericFormat displayType="text"
                                                        thousandSeparator
                                                        decimalScale={2}
                                                        value={statisticaData?.ambulatory_service?.do_ambulatory_price} /></span></h2>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <StatistikaChart 
                                                foiz={statisticaData?.ambulatory_service?.do_ambulatory_price > 0 ? ((statisticaData?.ambulatory_service?.do_ambulatory_price / statisticaData?.ambulatory_service?.ambulatory_price) * 100) : 0} 
                                                range='#ff3e1d' gradient={true} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-lg-6 col-xl-4 my-1">
                                <div className="card cursor-pointer border-0 border-bottom border-primary border-5"
                                    id='corusel__btn'
                                    onClick={() => {
                                        showData('kelmaganlar')
                                    }}
                                >
                                    <div className="card-body card-body_change" >
                                        {/* <p className='mb-0'>Muolaja reja </p> */}
                                        <h3 className='mb-0 pt-4 text-end'>Muolaja reja <span className='text-success'><FaProcedures size={24} /></span> </h3>
                                        <div className="row align-items-center" >
                                            <div className="col-6 d-flex  gap-4 ">
                                                <div>
                                                    <h2 className='mb-3 d-flex gap-1'>   <MdAccessTimeFilled className='text-primary' /> : <NumericFormat displayType="text"
                                                        thousandSeparator
                                                        decimalScale={2}
                                                        value={statisticaData?.treatment_service?.treatment_plan_qty} /></h2>
                                                    <h2 className='mb-3 d-flex gap-1'><BsShieldFillCheck className='text-success' /> : <span className='text-warning'><NumericFormat displayType="text"
                                                        thousandSeparator
                                                        decimalScale={2}
                                                        value={statisticaData?.treatment_service?.do} /></span></h2>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <StatistikaChart
                                                
                                                 foiz={chartCalc(statisticaData?.treatment_service,'treatment_plan_qty','do')} 
                                                
                                                //  foiz={statisticaData?.treatment_service?.do > 0 ? ((statisticaData?.treatment_service?.do / statisticaData?.treatment_service?.treatment_plan_qty) * 100) : 0} 
                                                 range='#ff3e1d' gradient={true} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-lg-6 col-xl-4 my-1">
                                <div className="card cursor-pointer border-0 border-bottom border-primary border-5"
                                    id='corusel__btn'
                                    onClick={() => {
                                        showData('kelmaganlar')
                                    }}
                                >
                                    <div className="card-body card-body_change" >
                                        <h3 className='mb-0 pt-4 text-end'>Muolaja reja <span className='text-success'><BiMoneyWithdraw size={24} /></span> </h3>
                                        <div className="row align-items-center" >
                                            <div className="col-6 d-flex  gap-4 ">
                                                <div>
                                                    <h2 className='mb-3 d-flex gap-1'>  <MdAccessTimeFilled className='text-primary' /> : <NumericFormat displayType="text"
                                                        thousandSeparator
                                                        decimalScale={2}
                                                        value={statisticaData?.treatment_service?.treatment_price} /></h2>
                                                    <h2 className='mb-3 d-flex gap-1'><BsShieldFillCheck className='text-success' /> : <span className='text-warning'><NumericFormat displayType="text"
                                                        thousandSeparator
                                                        decimalScale={2}
                                                        value={statisticaData?.treatment_service?.do_treatment_price} /></span></h2>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <StatistikaChart foiz={statisticaData?.treatment_service?.do_treatment_price > 0 ? ((statisticaData?.treatment_service?.do_treatment_price / statisticaData?.treatment_service?.treatment_price) * 100) : 0} range='#ff3e1d'
                                                    gradient={true}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-lg-6 col-xl-4 my-1">
                                <div className="card cursor-pointer border-0 border-bottom border-primary border-5"
                                    id='corusel__btn'
                                    onClick={() => {
                                        showData('kelmaganlar')
                                    }}
                                >
                                    <div className="card-body card-body_change" >
                                        <h3 className='mb-0 pt-4 text-end'>Muolajaga o'tish  </h3>
                                        <div className="row align-items-center" >
                                            <div className="col-6 d-flex  gap-4 ">
                                                <div>
                                                    <h2>Umumiy : <NumericFormat displayType="text"
                                                        thousandSeparator
                                                        decimalScale={2}
                                                        value={statisticaData?.service_count} /></h2>
                                                    <h2>Ambulator : <NumericFormat displayType="text"
                                                        thousandSeparator
                                                        decimalScale={2}
                                                        value={statisticaData?.total_service?.ambulatory} /></h2>
                                                    <h2>Muolaja : <NumericFormat displayType="text"
                                                        thousandSeparator
                                                        decimalScale={2}
                                                        value={statisticaData?.total_service?.treatment} /></h2>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <StatistikaChart
                                                 foiz={chartCalc({
                                                   
                                                        service_count:statisticaData?.service_count,
                                                        do:statisticaData?.total_service?.ambulatory
                                                    
                                                 },'service_count','do')}
                                                //  foiz={statisticaData?.service_count > 0 ? ((statisticaData?.ambulatory_service?.do / statisticaData?.service_count) * 100) : 0}
                                                  range='#ff3e1d'
                                                    gradient={true}

                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                }

            </div>
            <AmbuatorTable data={item} modal={modal} setModal={setModal} />
            <MuolajaTable data={item} modal={modal2} setModal={setModal2} />
        </Content >
    )
}

export default CounterpartyStatistica
