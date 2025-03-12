import React, { useEffect, useState } from 'react'
import { formatId } from '../../../helper/idGenerate'
import { getCurrentDateTime } from '../../../helper/dateFormat'
import { fullName, masulRegUchunFullName } from '../../../helper/fullName'
import Table from '../../../componets/table/Table'
import { NumericFormat } from 'react-number-format'
import Content from '../../../layout/Content'
import Navbar from '../../../layout/Navbar'
import axios from 'axios'
import Select from 'react-select';
import { useParams } from 'react-router-dom'
import ClientView from '../../counterparty/report/ClientView'
import Input from '../../../componets/inputs/Input'
import { ReducerType } from '../../../interface/interface'
import { useDispatch, useSelector } from 'react-redux'
import { isStatisticaGet } from '../../../service/reducer/StatisticaReducer'
import { AppDispatch } from '../../../service/store/store'
import { chartCalc } from '../../counterparty/statistica/CounterpartyStatistica'
import { MdAccessTimeFilled, MdOutlinePayments } from 'react-icons/md'
import { BsShieldFillCheck } from 'react-icons/bs'
import { FaCheckCircle, FaProcedures, FaUserCircle } from 'react-icons/fa'
import { BiMoneyWithdraw } from 'react-icons/bi'
import StatistikaChart from '../../counterparty/statistica/StatistikaChart'
import { isReferringDoctorGet } from '../../../service/reducer/ReferringDoctorReducer'
import CounterpartyDoctorRepotClient from './CounterpartyDoctorRepotClient'
import { render } from 'react-dom'
import { Modal } from 'reactstrap'
import { referringDoctoGroupByDate } from '../../../helper/doctorRegHelper'

const CounterpartyDoctorRepot = (
) => {
    const [load, setLoad] = React.useState(false)

    const [data, setData] = React.useState<any>({
        start_date: '',
        end_date: '',
    })
    const { id } = useParams()
    const show = async (id: any, data: any) => {
        try {
            setLoad(() => true)
            let res = await axios.get(`/repot/counterparty/${id}?start_date=${data?.start_date}&end_date=${data?.end_date}`)
            const { result } = res.data
            setData(() => result)
        } catch (error) {

        } finally {
            setLoad(() => false)
        }
    }
    const referringDoctorPay = async (data: any) => {
        try {
            setLoad(() => true)
            let res = await axios.post(`/referring-doctor/pay`, {
                counterparty_id: id,
                date: data.date,
                start_date: balance?.start_date,
                end_date: balance?.end_date,
                kounteragent_contribution_price: data?.kounteragent_contribution_price_pay_send,
                kounteragent_doctor_contribution_price: data?.kounteragent_doctor_contribution_price_pay_send
            })
            const { result } = res.data
            setBalance(() => {
                return {
                    ...balance,
                    data: result
                }
            })
            toggle()
        } catch (error) {

        } finally {
            setLoad(() => false)
        }
    }
    const [mijozlar, setMijozlar] = useState({ data: [] } as any);
    const [balance, setBalance] = useState({ data: [], start_date: '', end_date: '' } as any);
    const mijozlarGet = async (id: any) => {
        try {
            setLoad(() => true)
            let res = await axios.get(`/referring-doctor/treatment?status=all&show_id=${id}`)
            const { result } = res.data
            setMijozlar(result);
            // setData(() => result)
            // dispatch(isAddGraphAchiveAll(result))
            // setData(() => result)
            // setCash(() => true)
        } catch (error) {

        } finally {
            setLoad(() => false)
        }
    }
    const tolovlarGet = async (data: any) => {
        try {
            setLoad(() => true)
            let res = await axios.get(`/referring-doctor/balance?show_id=${id}&start_date=${data?.start_date}&end_date=${data?.end_date}`)
            const { result } = res.data
            setBalance(result);
            console.log('groupReferringDoctorBalanceByDate', referringDoctoGroupByDate(result.data));

            // setData(() => result)
            // dispatch(isAddGraphAchiveAll(result))
            // setData(() => result)
            // setCash(() => true)
        } catch (error) {

        } finally {
            setLoad(() => false)
        }
    }
    const { statisticaData, isLoading } = useSelector((state: ReducerType) => state.StatisticaReducer)
    const [item, setItem] = useState({} as any)
    const dispatch = useDispatch<AppDispatch>()
    const [modal, setModal] = useState(false as any)
    const [payModal, setPayModal] = useState(false as any)
    const toggle = () => {
        setPayModal(!payModal)
    }
    const [modal2, setModal2] = useState(false as any)
    const [getId, setGetId] = useState(0 as any)
    const clietshow = async (id: any) => {
        try {
            setLoad(() => true)
            let res = await axios.get(`/repot/counterparty-client/${id}?start_date=${data?.start_date}&end_date=${data?.end_date}`)
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

    const showData = async (data: any) => {
        try {
            setLoad(() => true)
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
            setLoad(() => false)
        }
    }
    const [tab, setTab] = useState(0)
    const { user, target_branch } = useSelector((state: ReducerType) => state.ProfileReducer)

    const [search, setSearch] = useState({
        branch: target_branch == 'all' ? { label: 'Barcha filallar', value: 'all' } : (target_branch > 0 ? user?.branch?.find((item: any) => item?.value == target_branch) : user?.branch?.at(0)),
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
    const { referringDoctorData } = useSelector((state: ReducerType) => state.ReferringDoctorReducer)
    useEffect(() => {
        if (user?.role == 'reception') {
            setTab(3)
            show(id, data)
        } else {
            dispatch(isStatisticaGet(`?show_id=${id}&branch_id=${target_branch > 0 || target_branch == 'all' ? target_branch : user?.branch?.at(0)?.value}`))
        }
    }, [])
    return (
        <Content loading={load || isLoading}>
            <Navbar />
            <div className="container-fluid flex-grow-1 container-p-y size_16">

                <div className={`row ${user?.role == 'reception' ? 'd-none' : ''}`}>
                    <div className='col-4'>
                        <div className="btn-group">
                            <button className={`btn btn-${tab == 0 ? 'primary' : 'secondary'}`}
                                onClick={() => {
                                    setTab(0)
                                }}
                            >Statistika</button>
                            <button className={`btn btn-${tab == 1 ? 'primary' : 'secondary'}`} onClick={() => {
                                setTab(1)
                                dispatch(isReferringDoctorGet('?show_id=' + id))
                            }}>Shifokorlar</button>
                            <button className={`btn btn-${tab == 2 ? 'primary' : 'secondary'}`} onClick={() => {
                                setTab(2)
                                mijozlarGet(id)
                            }}> Mijozlar</button>
                            <button className={`btn btn-${tab == 3 ? 'primary' : 'secondary'}`} onClick={() => {
                                setTab(3)
                                show(id, data)
                            }}>Hisobot</button>
                            <button className={`btn btn-${tab == 4 ? 'primary' : 'secondary'}`} onClick={() => {
                                setTab(4)
                                // show(id, data)
                                tolovlarGet(balance)
                                // dispatch(isReferringDoctorGet(`?show_id=${id}&is_repot=1`))
                            }}>Tolovlar</button>
                        </div>
                    </div>
                    {/* {
                        user?.is_main_branch ? '' :
                            <div className="col-lg-2 col-12 my-1">
                                <Select
                                    name='name'
                                    isDisabled={user?.is_main_branch || load}
                                    value={search?.branch}
                                    onChange={(e: any) => {
                                        setSearch(({ ...search, branch: e }))
                                        // clientAllData(`branch_id=${e?.value}`)
                                        dispatch(isStatisticaGet(`?branch_id=${search?.branch?.value ?? ''}&show_id=${id}`))
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
                    } */}
                    <div className={`my-1 col-4 offset-${user?.is_main_branch ? 5 : 2} justify-content-end  row ${tab == 0 ? '' : 'd-none'} `}>
                        <div className=" d-flex align-items-center gap-2">
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
                                    dispatch(isStatisticaGet(`?is_all=${value ? '1' : '0'}&is_today=${search.is_today ? '1' : '0'}&month=${statisticaData?.month?.value ?? ''}&show_id=${id}&branch_id=${search?.branch?.value ?? ''}`))


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
                                    dispatch(isStatisticaGet(`?is_today=${value ? '1' : '0'}&month=${statisticaData?.month?.value ?? ''}&show_id=${id}&branch_id=${search?.branch?.value ?? ''}`))
                                }}
                            >
                                {search.is_today ? <FaCheckCircle size={24} /> : ''}
                                Bugun</button>
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
                                    dispatch(isStatisticaGet(`?is_all=0&is_today=0&month=${e?.value ?? ''}&show_id=${id}&branch_id=${search?.branch?.value ?? ''}`))

                                    // dispatch(isGraphGet(`?year=${graphData?.current_year?.value ?? ''}&month=${e?.value ?? ''}&department_id=${graphData?.department?.value ?? ''}`))
                                }}
                                className="basic-multi-select w-100"
                                classNamePrefix="select"
                                options={
                                    [
                                        ...oylar
                                    ]
                                } />
                        </div>

                    </div>
                </div>
                <div className={`row my-3 ${tab == 0 ? '' : 'd-none'}`}>
                    <div className="col-12 col-lg-6 col-xl-4 my-1">
                        <div className="card h-100 cursor-pointer border-0 border-bottom border-warning border-5"
                            id='corusel__btn'
                            onClick={() => {
                                // showData('ambulator')
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
                                        <StatistikaChart gradient={true} foiz={chartCalc(statisticaData?.ambulatory_service, 'ambulatory_plan_qty', 'do')} range='#ff3e1d' />
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

                                            foiz={chartCalc(statisticaData?.treatment_service, 'treatment_plan_qty', 'do')}

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

                                                service_count: statisticaData?.service_count,
                                                do: statisticaData?.total_service?.ambulatory

                                            }, 'service_count', 'do')}
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
                <div className={`row my-3 ${tab == 1 ? '' : 'd-none'}`}>
                    <div className="card" style={{
                        height: `${window.innerHeight / 1.7}px`,
                        overflow: 'auto'
                    }}>
                        <Table
                            //  exportFile={true}
                            //  importFile={true}
                            paginationRole={false}

                            isLoading={false}
                            isSuccess={true}
                            reloadData={true}
                            reloadDataFunction={() => {
                                dispatch(isReferringDoctorGet('?show_id=' + id))
                            }}
                            top={100}
                            scrollRole={true}
                            editRole={true}
                            deleteRole={true}

                            extraKeys={['full_name', 'phone_', 'workplace_']}
                            columns={[
                                {
                                    title: '№',
                                    key: 'id',
                                    render: (value: any, data: any) => {
                                        return <div key={data.index} className='d-flex  align-items-center gap-1'>

                                            <span>
                                                {data?.index + 1}
                                            </span>
                                        </div>
                                    }
                                },
                                {
                                    title: "F.I.O",
                                    key: 'full_name',
                                    renderItem: (value: any, data: any) => {
                                        return <td onClick={() => {

                                        }}>

                                            <b>{fullName(value)}</b>

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
                                    title: 'Ish joyi',
                                    key: 'workplace_',
                                    render: (value: any, data: any) => {
                                        return value?.workplace
                                    }
                                },


                            ]}
                            dataSource={
                                referringDoctorData.data
                            }
                        />
                    </div>
                </div>
                <div className={`row my-3 ${tab == 2 ? '' : 'd-none'}`}>
                    <Table
                        //  exportFile={true}
                        //  importFile={true}
                        paginationRole={false}

                        isLoading={false}
                        isSuccess={true}
                        reloadData={true}
                        reloadDataFunction={() => {
                            dispatch(isReferringDoctorGet('?show_id=' + id))
                        }}
                        top={100}
                        scrollRole={true}

                        extraKeys={['full_name', 'ambulator', 'muolaja', 'yakunlangan', 'arxivlangan']}
                        columns={[
                            {
                                title: '№',
                                key: 'id',
                                render: (value: any, data: any) => {
                                    return <div key={data.index} className='d-flex  align-items-center gap-1'>

                                        <span>
                                            {data?.index + 1}
                                        </span>
                                    </div>
                                }
                            },
                            {
                                title: "F.I.O",
                                key: 'full_name',
                                renderItem: (value: any, data: any) => {
                                    return <td onClick={() => {
                                        setItem({
                                            kontragent_id: id,
                                            show_id: value?.id
                                        })
                                        setModal2(true)
                                    }}>

                                        <b>{fullName(value)}</b>

                                    </td>
                                }
                            },
                            {
                                title: 'ambulator',
                                key: 'ambulator',
                                render: (value: any, data: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={value?.ambulatory} />
                                }
                            },
                            {
                                title: 'Muolajada soni',
                                key: 'muolaja',
                                render: (value: any, data: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={value?.treatment} />
                                }
                            },
                            {
                                title: 'Yakunlangan',
                                key: 'yakunlangan',
                                render: (value: any, data: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={value?.finish} />
                                }
                            },
                            {
                                title: 'Arxivlangan',
                                key: 'arxivlangan',
                                render: (value: any, data: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={value?.archive} />
                                }
                            },
                        ]}
                        dataSource={
                            mijozlar.data
                        }
                    />
                </div>
                <div className={`row my-3 ${tab == 3 ? '' : 'd-none'}`}>
                    <div className={` my-1 `}>
                        <form className='row w-auto w-lg-100'>
                            <div className="col-lg-3 col-6">
                                <Input type='date' onChange={(e: any) => {
                                    let value = e.target.value
                                    if (value && value.length > 0) {
                                        // dispatch(isReferringDoctorGet(`?is_repot=1&start_date=${value}&end_date=${referringDoctorData?.end_date}`))
                                        show(id, {
                                            ...data, start_date: value
                                        })
                                    }
                                }}
                                    value={data?.start_date}
                                />
                            </div>
                            <div className="col-lg-3 col-6">
                                <Input type='date' min={data?.start_date} onChange={(e: any) => {
                                    let value = e.target.value
                                    if (value && value.length > 0) {
                                        show(id, {
                                            ...data, end_date: value
                                        })
                                        // dispatch(isReferringDoctorGet(`?is_repot=1&start_date=${referringDoctorData?.start_date}&end_date=${value}`))
                                    }
                                }}
                                    value={data?.end_date}
                                />
                            </div>

                        </form>
                    </div>
                    <div className="card" style={{
                        height: `${window.innerHeight / 1.5}px`,
                        overflow: 'auto'
                    }}>
                        <Table
                            paginationRole={false}
                            isLoading={false}
                            isSuccess={true}
                            reloadData={true}
                            reloadDataFunction={() => {
                                show(id, data)
                            }}
                            extraKeys={['full_name', 'tel', 'client_count_', 'umumiy', 'kounteragent_contribution_price_', 'kounteragent_doctor_contribution_price_']}
                            columns={[
                                {
                                    title: '№',
                                    key: 'id',
                                    render: (value: any, data: any) => {
                                        return <div key={data.index} className='d-flex  align-items-center gap-1'>

                                            <span>
                                                {data?.index + 1}
                                            </span>
                                        </div>
                                    }
                                },
                                {
                                    title: "F.I.O",
                                    key: 'full_name',
                                    renderItem: (value: any, data: any) => {
                                        return <td onClick={() => {
                                            clietshow(value?.id)
                                        }}>
                                            {fullName(value)}
                                        </td>
                                    }
                                },
                                {
                                    title: "Tel",
                                    key: 'tel',
                                    render: (value: any, data: any) => {
                                        return value?.phone
                                    }
                                },

                                {
                                    title: "Mijozlar",
                                    key: 'client_count_',
                                    render: (value: any, data: any) => {
                                        return <NumericFormat displayType="text"
                                            thousandSeparator
                                            decimalScale={2}
                                            value={value?.client_count} />
                                    }
                                },

                                {
                                    title: "Umumiy summa",
                                    key: 'umumiy',
                                    render: (value: any, data: any) => {
                                        return value?.total_price
                                    }
                                },

                                {
                                    title: "Agent ulushi",
                                    key: 'kounteragent_contribution_price_',
                                    render: (value: any, data: any) => {
                                        return <NumericFormat displayType="text"
                                            thousandSeparator
                                            decimalScale={2}
                                            value={value?.kounteragent_contribution_price} />
                                    }
                                },
                                {
                                    title: "SHifokor ulushi",
                                    key: 'kounteragent_doctor_contribution_price_',
                                    render: (value: any, data: any) => {
                                        return <NumericFormat displayType="text"
                                            thousandSeparator
                                            decimalScale={2}
                                            value={value?.kounteragent_doctor_contribution_price} />
                                    }
                                },



                            ]}
                            dataSource={
                                // []
                                data?.data
                            }
                        />
                    </div>
                </div>
                <div className={`row my-3 ${tab == 4 ? '' : 'd-none'}`}>
                    <div className={` my-1 `}>
                        <form className='row w-auto w-lg-100'>
                            <div className="col-lg-3 col-6">
                                <Input type='date' onChange={(e: any) => {
                                    let value = e.target.value
                                    // dispatch(isReferringDoctorGet(`?is_repot=1&start_date=${value}&end_date=${referringDoctorData?.end_date}&show_id=${id}`))
                                    tolovlarGet({
                                        ...balance,
                                        start_date: value
                                    })
                                }}
                                    value={balance?.start_date}
                                />
                            </div>
                            <div className="col-lg-3 col-6">
                                <Input type='date' min={data?.start_date} onChange={(e: any) => {
                                    let value = e.target.value
                                    // dispatch(isReferringDoctorGet(`?is_repot=1&start_date=${referringDoctorData?.start_date}&end_date=${value}&show_id=${id}`))
                                    tolovlarGet({
                                        ...balance,
                                        end_date: value
                                    })
                                }}
                                    value={balance?.end_date}
                                />
                            </div>

                        </form>
                    </div>
                    <div className="card" style={{
                        height: `${window.innerHeight / 1.7}px`,
                        overflow: 'auto'
                    }}>
                        <Table
                            //  exportFile={true}
                            //  importFile={true}
                            paginationRole={false}

                            isLoading={false}
                            isSuccess={true}
                            reloadData={true}
                            reloadDataFunction={() => {
                                dispatch(isReferringDoctorGet('?show_id=' + id))
                            }}
                            top={100}
                            scrollRole={true}
                            extraButtonRole={true}
                            extraButton={(item: any) => {
                                return <button className='btn btn-info btn-sm'
                                    onClick={() => {
                                        setItem({
                                            id: item?.id,
                                            date: item?.date,
                                            total_kounteragent_contribution_price: item?.data?.reduce((a: any, b: any) => a + +b.total_kounteragent_contribution_price, 0),
                                            total_kounteragent_doctor_contribution_price: item?.data?.reduce((a: any, b: any) => a + +b.total_kounteragent_doctor_contribution_price, 0),
                                            kounteragent_contribution_price_pay_send: item?.data?.reduce((a: any, b: any) => a + +b.total_kounteragent_contribution_price, 0)
                                                -
                                                item?.data?.reduce((a: any, b: any) => a + +b.kounteragent_contribution_price_pay, 0),
                                            kounteragent_doctor_contribution_price_pay_send: item?.data?.reduce((a: any, b: any) => a + +b.total_kounteragent_doctor_contribution_price, 0)

                                                -
                                                item?.data?.reduce((a: any, b: any) => a + +b.kounteragent_doctor_contribution_price_pay, 0)
                                        })
                                        toggle()
                                    }}
                                >
                                    <MdOutlinePayments size={24} />
                                </button>
                            }}
                            extraKeys={[
                                'id_',
                                'full_name',
                                'kounteragent_contribution_price_',
                                'kounteragent_contribution_price_pay_proses',
                                'kounteragent_contribution_price_pay_',

                                'kounteragent_doctor_contribution_price_',
                                'kounteragent_doctor_contribution_price_pay_proses',
                                'kounteragent_doctor_contribution_price_pay_',

                            ]}
                            columns={[
                                {
                                    title: '№',
                                    key: 'id_',
                                    render: (value: any, index: any) => {
                                        return <div key={data.index} className='d-flex  align-items-center gap-1'>
                                            <span>
                                                {value.index + 1}
                                            </span>
                                        </div>
                                    }
                                },
                                {
                                    title: "Sana",
                                    key: 'full_name',
                                    renderItem: (value: any, data: any) => {
                                        return <td onClick={() => {

                                        }}>

                                            <b>{value.date}</b>

                                        </td>
                                    }
                                },
                                {
                                    title: "Agent ulushi",
                                    key: 'kounteragent_contribution_price_',
                                    render: (value: any, data: any) => {
                                        console.log(value);

                                        return <NumericFormat displayType="text"
                                            thousandSeparator
                                            decimalScale={2}
                                            // value={0}
                                            value={value?.data?.reduce((a: any, b: any) => a + +b.total_kounteragent_contribution_price, 0)}
                                        />
                                    }
                                },
                                {
                                    title: "Tolovga",
                                    key: 'kounteragent_contribution_price_pay_proses',
                                    render: (value: any, data: any) => {
                                        return <span className='text-danger'>
                                            <NumericFormat displayType="text"
                                                thousandSeparator
                                                decimalScale={2}
                                                value={
                                                    value?.data?.reduce((a: any, b: any) => a + +b.total_kounteragent_contribution_price, 0)
                                                    -
                                                    value?.data?.reduce((a: any, b: any) => a + +b.kounteragent_contribution_price_pay, 0)
                                                }

                                            // value={value?.total_kounteragent_contribution_price - (value?.kounteragent_contribution_price_pay ?? 0)}
                                            />
                                        </span>
                                    }
                                },
                                {
                                    title: "To'langan",
                                    key: 'kounteragent_contribution_price_pay_',
                                    render: (value: any, data: any) => {
                                        return <span className='text-success'>
                                            +<NumericFormat displayType="text"
                                                thousandSeparator
                                                decimalScale={2}
                                                value={value?.data?.reduce((a: any, b: any) => a + +b.kounteragent_contribution_price_pay, 0)} />
                                        </span>
                                    }
                                },
                                {
                                    title: "Shifokor ulushi",
                                    key: 'kounteragent_doctor_contribution_price_',
                                    render: (value: any, data: any) => {
                                        return <NumericFormat displayType="text"
                                            thousandSeparator
                                            decimalScale={2}
                                            value={
                                                value?.data?.reduce((a: any, b: any) => a + +b.total_kounteragent_doctor_contribution_price, 0)
                                            } />
                                    }
                                },
                                {
                                    title: "Tolovga",
                                    key: 'kounteragent_doctor_contribution_price_pay_proses',
                                    render: (value: any, data: any) => {
                                        return <span className='text-danger'>
                                            <NumericFormat displayType="text"
                                                thousandSeparator
                                                decimalScale={2}
                                                value={
                                                    value?.data?.reduce((a: any, b: any) => a + +b.total_kounteragent_doctor_contribution_price, 0)

                                                    -
                                                    value?.data?.reduce((a: any, b: any) => a + +b.kounteragent_doctor_contribution_price_pay, 0)

                                                } />
                                        </span>
                                    }
                                },
                                {
                                    title: "To'langan",
                                    key: 'kounteragent_doctor_contribution_price_pay_',
                                    render: (value: any, data: any) => {
                                        return <span className='text-success'>+<NumericFormat displayType="text"
                                            thousandSeparator
                                            decimalScale={2}
                                            value={value?.data?.reduce((a: any, b: any) => a + +b.kounteragent_doctor_contribution_price_pay, 0)} /></span>
                                    }
                                },

                            ]}
                            dataSource={
                                // groupReferringDoctorBalanceByDate(balance.data)
                                referringDoctoGroupByDate(balance.data)
                            }
                        />
                        {/* {JSON.stringify( groupReferringDoctorBalanceByDate(balance.data))} */}
                    </div>
                </div>
            </div>
            <ClientView data={item} modal={modal} setModal={setModal} />
            <CounterpartyDoctorRepotClient item={item} modal={modal2} setModal={setModal2} />
            <Modal centered={true} isOpen={payModal} toggle={toggle} role='dialog' backdrop="static" keyboard={false} >
                <form onSubmit={(e: any) => {
                    e.preventDefault()
                    referringDoctorPay(item)
                }}>

                    <div className="modal-header">
                        <h1 className="modal-title">
                            To'lov
                        </h1>
                    </div>
                    <div className="modal-body">
                        <div className="mb-1">
                            <label className="form-label">Agent ulushi</label>
                            <NumericFormat
                                thousandSeparator
                                isAllowed={(e: any) => {
                                    const { value } = e

                                    return +item?.total_kounteragent_contribution_price - +(item?.kounteragent_contribution_price_pay ?? 0) - +value >= 0
                                }}
                                value={item?.kounteragent_contribution_price_pay_send}
                                onChange={(e: any) => {
                                    let value = +e.target.value.replace(/,/g, '') as any; // Virgullarni olib 


                                    setItem(() => {
                                        return {
                                            ...item,
                                            kounteragent_contribution_price_pay_send: value
                                        }
                                    })
                                }}
                                className='form-control'

                            />
                        </div>
                        <div className="mb-1">
                            <label className="form-label">Kounterdoktor ulushi</label>
                            <NumericFormat
                                isAllowed={(e: any) => {
                                    const { value } = e

                                    return +item?.total_kounteragent_doctor_contribution_price - +(item?.kounteragent_doctor_contribution_price_pay ?? 0) - +value >= 0
                                }}
                                value={item?.kounteragent_doctor_contribution_price_pay_send}
                                thousandSeparator
                                onChange={(e: any) => {
                                    let value = +e.target.value.replace(/,/g, '') as any; // Virgullarni olib 
                                    setItem(() => {
                                        return {
                                            ...item,
                                            kounteragent_doctor_contribution_price_pay_send: value
                                        }
                                    })
                                }}
                                className='form-control'

                            />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button className='btn btn-primary'>Saqlash</button>
                        <button className='btn btn-danger' onClick={toggle} type='button'>Ortga</button>
                    </div>
                </form>


            </Modal>
        </Content>


    )
}

export default CounterpartyDoctorRepot
