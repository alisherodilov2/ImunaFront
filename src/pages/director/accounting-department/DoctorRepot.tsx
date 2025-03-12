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
import { useNavigate, useParams } from 'react-router-dom'
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
// import DoctorRepotClient from './DoctorRepotClient'
import { render } from 'react-dom'
import { Modal } from 'reactstrap'
import { referringDoctoGroupByDate } from '../../../helper/doctorRegHelper'
import ClientAllDoctorRepotShow from './ServiceAllDoctorRepotShow'

const DoctorRepot = (
) => {
    const [load, setLoad] = React.useState(false)
    const [data, setData] = React.useState<any>({
        start_date: '',
        end_date: '',
    })
    const { user, target_branch } = useSelector((state: ReducerType) => state.ProfileReducer)

    const { id } = useParams()
    const show = async (data: any) => {
        try {
            setLoad(() => true)
            let res = await axios.get(`/repot/doctor?start_date=${data?.start_date}&end_date=${data?.end_date}&branch_id=${data?.branch?.value ?? ''}`)
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
    const dispatch = useDispatch<AppDispatch>()
    const [modal, setModal] = useState(false as any)
    const [payModal, setPayModal] = useState(false as any)
    const toggle = () => {
        setPayModal(!payModal)
    }
    const [getId, setGetId] = useState(0 as any)
    const [modal2, setModal2] = useState(false as any)
    const [item, setItem] = useState({} as any)
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
    useEffect(() => {
        show(data)
    }, [])
    const showData = async (data: any, id: any) => {
        try {
            setLoad(() => true)
            let res = await axios.get(`/repot/doctor/${id}?start_date=${data?.start_date}&end_date=${data?.end_date}`)
            const { result } = res.data
            console.log(result);
            setItem(() => result.data)
            setModal2(() => true)
        } catch (error) {

        } finally {
            setLoad(() => false)
        }
    }
    const [tab, setTab] = useState(0)
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
    const path = useNavigate()
    return (
        <Content loading={load || isLoading}>
            <Navbar />
            <div className="container-fluid flex-grow-1 container-p-y size_16">
                <div className=" my-1">
                    <form className='row w-auto w-lg-100'>
                        {
                            user?.is_main_branch ? '' :
                                <div className="col-lg-2 col-12 my-1">
                                    <Select
                                        name='name'
                                        isDisabled={user?.is_main_branch || load}
                                        value={search?.branch}
                                        onChange={(e: any) => {
                                            setSearch(({ ...search, branch: e }))
                                            show({
                                                ...data, branch: e,
                                                start_date: '',
                                                end_date: ''

                                            })
                                            // getData({
                                            //     ...data, branch: e
                                            // })
                                            // clientAllData(`branch_id=${e?.value}`)

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
                        }
                        <div className="col-lg-2 col-6">
                            <Input type='date' onChange={(e: any) => {
                                let value = e.target.value
                                if (value && value.length > 0) {
                                    // dispatch(isReferringDoctorGet(`?is_repot=1&start_date=${value}&end_date=${referringDoctorData?.end_date}`))
                                    show({
                                        ...data, start_date: value,
                                        branch: search?.branch
                                    })
                                }
                            }}
                                value={data?.start_date}
                            />
                        </div>
                        <div className="col-lg-2 col-6">
                            <Input type='date' min={data?.start_date} onChange={(e: any) => {
                                let value = e.target.value
                                if (value && value.length > 0) {
                                    show({
                                        ...data, end_date: value,
                                        branch: search?.branch
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
                            show({
                                start_date: '',
                                end_date: ''
                            })
                            setSearch({ ...search, branch: user?.branch?.at(0) })
                        }}
                        top={100}
                        scrollRole={true}
                        extraButtonRole={true}
                        extraButton={function (item: any) {
                            return <>
                                <button className='btn btn-info'
                                    onClick={() => {
                                        // showData(data, item.id)
                                        path(`/accounting-department/doctor/${item.id}`)
                                    }}

                                >Batafsil</button>
                            </>
                        }}
                        extraTrFunction={() => {
                            return <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>
                                    <b>
                                        <NumericFormat displayType="text"
                                            thousandSeparator
                                            decimalScale={2}
                                            value={
                                                data?.data?.reduce((a: any, b: any) => a + +b.client_count, 0)
                                            } />
                                    </b>
                                </td>
                                <td>
                                    <b>
                                        <NumericFormat displayType="text"
                                            thousandSeparator
                                            decimalScale={2}
                                            value={
                                                data?.data?.reduce((a: any, b: any) => a + +b.service_count, 0)
                                            } />
                                    </b>
                                </td>
                                <td>
                                    <b>

                                        <NumericFormat displayType="text"
                                            thousandSeparator
                                            decimalScale={2}
                                            value={
                                                data?.data?.reduce((a: any, b: any) => a + +b.total_price, 0)
                                            } />
                                    </b>
                                </td>
                                <td>
                                    <b>

                                        <NumericFormat displayType="text"
                                            thousandSeparator
                                            decimalScale={2}
                                            value={
                                                data?.data?.reduce((a: any, b: any) => a + +b.contribution_price, 0)
                                            } />

                                    </b>
                                </td>
                            </tr>
                        }}
                        extraKeys={['full_name_', 'phone_', 'clinet', 'xizmatlar', 'jami', 'ulush','klinka']}
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
                                key: 'full_name_',
                                renderItem: (value: any, data: any) => {
                                    return <td onClick={() => {

                                    }}>

                                        <b>{masulRegUchunFullName(value)}</b>

                                    </td>
                                }
                            },
                            {
                                title: "Bo'lim",
                                key: 'phone_',
                                render: (value: any, data: any) => {
                                    return value?.department?.name
                                }
                            },
                            {
                                title: 'Mijozlar soni',
                                key: 'clinet',
                                render: (value: any, data: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={value?.client_count} />
                                }
                            },
                            {
                                title: 'xizmatlar',
                                key: 'xizmatlar',
                                render: (value: any, data: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={value?.service_count} />
                                }
                            },
                            {
                                title: 'Umumiy narxi',
                                key: 'jami',
                                render: (value: any, data: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={value?.total_price} />
                                }
                            },
                            {
                                title: 'ulush',
                                key: 'ulush',
                                render: (value: any, data: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={value?.contribution_price} />
                                }
                            },
                            {
                                title: 'klinka',
                                key: 'klinka',
                                render: (value: any, data: any) => {
                                    return value?.owner?.name
                                }
                            },


                        ]}
                        dataSource={
                            data.data
                        }
                    />
                </div>
            </div>
            <ClientAllDoctorRepotShow
                modal={modal2}
                setModal={setModal2}
                data={item}
            />
        </Content>


    )
}

export default DoctorRepot
