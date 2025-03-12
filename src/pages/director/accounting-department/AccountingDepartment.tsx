import React, { useEffect, useState } from 'react'
import Content from '../../../layout/Content'
import Navbar from '../../../layout/Navbar'
import axios from 'axios'
import StatistikaChart from '../statistica/StatistikaChart'
import { useNavigate } from 'react-router-dom'
import { NumericFormat } from 'react-number-format'
import { useDispatch, useSelector } from 'react-redux'
import { ReducerType } from '../../../interface/interface'
import Select from 'react-select';
import { AppDispatch } from '../../../service/store/store'
import { isChanageTargetBranch } from '../../../service/reducer/ProfileReducer'

const AccountingDepartment = () => {
    const [load, setLoad] = useState(false)
    const { user } = useSelector((state: ReducerType) => state.ProfileReducer)
    const [repot, setRepot] = useState({

    } as any)
    const [search, setSearch] = useState({
        branch: user?.branch?.at(0),
    } as any)
    const dispatch = useDispatch<AppDispatch>()
    const show = async (branch_id?: any) => {
        try {
            setLoad(() => true)
            let res = await axios.get(`/repot?branch_id=${branch_id}`)
            const { result } = res.data
            dispatch(isChanageTargetBranch(branch_id))
            setRepot(() => result)
        } catch (error) {

        } finally {
            setLoad(() => false)
        }
    }
    const path = useNavigate()
    useEffect(() => {
        show(search?.branch?.value ?? 0)
    }, [])
    return (
        <Content >
            <Navbar />
            <div className="container-fluid">
                <br />
                <div className="col-lg-3 my-1  col-6">
                    {
                        user?.is_main_branch ? '' : <Select
                            name='name'
                            isDisabled={user?.is_main_branch}
                            value={search?.branch}
                            onChange={(e: any) => {
                                setSearch((res: any) => {
                                    return {
                                        branch: e,
                                    }
                                })
                                show(e?.value ?? 0)
                                // dispatch(isStatisticaGet(`?branch_id=${e?.value ?? ''}`))

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
                    }

                </div>
                <br />
                {
                    load ? <h1 className='text-center'>Yuklanmoqda..</h1> : <div className="row">
                        <div className="col-md-6 col-xl-4 col-xxl-3 mb-4">
                            <div className="card cursor-pointer border-0 border-bottom border-warning border-5"
                                id='corusel__btn'
                                onClick={() => {
                                    path('/accounting-department/pay-all/client')
                                    // showData('ambulator')
                                }}
                            >
                                <div className="card-body card-body_change" >

                                    <div className="row align-items-center" >
                                        <div className="col-6 d-flex  gap-4 ">
                                            <div>
                                                <h2 className="card-title fw-bold  text-info " >
                                                    <NumericFormat displayType="text"
                                                        thousandSeparator
                                                        decimalScale={2}
                                                        value={repot?.total_price + repot?.balance} />
                                                </h2>
                                                <h4 className="fw-bold d-block "> Umumiy to'lovlar</h4>
                                            </div>
                                        </div>
                                        {/* <div className="col-6">
                                        <StatistikaChart foiz={repot?.ambulator > 0 ? (repot?.ambulator / repot?.bemorlar) * 100 : 0} range='#ffab00' />
                                    </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-xl-4 col-xxl-3 mb-4">
                            <div className="card cursor-pointer border-0 border-bottom border-warning border-5"
                                id='corusel__btn'
                                onClick={() => {
                                    path('/accounting-department/pay-all/stationar-client')
                                }}
                            >
                                <div className="card-body card-body_change" >

                                    <div className="row align-items-center" >
                                        <div className="col-6 d-flex  gap-4 ">
                                            <div>

                                                <h2 className="card-title fw-bold  text-info " >
                                                    <NumericFormat displayType="text"
                                                        thousandSeparator
                                                        decimalScale={2}
                                                        value={repot?.stationar_total_price + repot?.balance} />
                                                </h2>
                                                <h4 className="fw-bold d-block ">Stationar Umumiy to'lovlar</h4>
                                            </div>
                                        </div>
                                       
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`col-md-6 col-xl-4 col-xxl-3 mb-4`}>
                            <div className="card cursor-pointer border-0 border-bottom border-warning border-5"
                                id='corusel__btn'
                                onClick={() => {
                                    path('/accounting-department/discount')
                                    // showData('ambulator')
                                }}
                            >
                                <div className="card-body card-body_change" >
                                    <div className="row align-items-center" >
                                        <div className="col-6 d-flex  gap-4 ">
                                            <div>
                                                <h2 className="card-title fw-bold  text-info " >
                                                    <NumericFormat displayType="text"
                                                        thousandSeparator
                                                        decimalScale={2}
                                                        value={repot?.discount} />
                                                </h2>
                                                <h4 className="fw-bold d-block ">Chegirma</h4>
                                            </div>
                                        </div>
                                        {/* <div className="col-6">
                                        <StatistikaChart foiz={repot?.ambulator > 0 ? (repot?.ambulator / repot?.bemorlar) * 100 : 0} range='#ffab00' />
                                    </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`col-md-6 col-xl-4 col-xxl-3 mb-4`}>
                            <div className="card cursor-pointer border-0 border-bottom border-warning border-5"
                                id='corusel__btn'
                                onClick={() => {
                                    path('/accounting-department/debt')
                                    // showData('ambulator')
                                }}
                            >
                                <div className="card-body card-body_change" >

                                    <div className="row align-items-center" >
                                        <div className="col-6 d-flex  gap-4 ">
                                            <div>

                                                <h2 className="card-title fw-bold  text-info " >
                                                    <NumericFormat displayType="text"
                                                        thousandSeparator
                                                        decimalScale={2}
                                                        value={repot?.debt} />
                                                </h2>
                                                <h4 className="fw-bold d-block ">Qarzlar</h4>
                                            </div>
                                        </div>
                                        {/* <div className="col-6">
                                        <StatistikaChart foiz={repot?.ambulator > 0 ? (repot?.ambulator / repot?.bemorlar) * 100 : 0} range='#ffab00' />
                                    </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`col-md-6 col-xl-4 col-xxl-3 mb-4`}>
                            <div className="card cursor-pointer border-0 border-bottom border-warning border-5"
                                id='corusel__btn'
                                onClick={() => {

                                    // showData('ambulator')
                                    path('/counterparty')
                                }}
                            >
                                <div className="card-body card-body_change" >

                                    <div className="row align-items-center" >
                                        <div className="col-6 d-flex  gap-4 ">
                                            <div>

                                                <h2 className="card-title fw-bold  text-info " >
                                                    <NumericFormat displayType="text"
                                                        thousandSeparator
                                                        decimalScale={2}
                                                        value={repot?.kontragent} />
                                                </h2>
                                                <h4 className="fw-bold d-block ">Kontragent</h4>
                                            </div>
                                        </div>
                                        {/* <div className="col-6">
                                        <StatistikaChart foiz={repot?.ambulator > 0 ? (repot?.ambulator / repot?.bemorlar) * 100 : 0} range='#ffab00' />
                                    </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-xl-4 col-xxl-3 mb-4">
                            <div className="card cursor-pointer border-0 border-bottom border-warning border-5"
                                id='corusel__btn'
                                onClick={() => {

                                    // showData('ambulator')
                                    path('/accounting-department/expense')

                                }}
                            >
                                <div className="card-body card-body_change" >

                                    <div className="row align-items-center" >
                                        <div className="col-6 d-flex  gap-4 ">
                                            <div>

                                                <h2 className="card-title fw-bold  text-info " >
                                                    <NumericFormat displayType="text"
                                                        thousandSeparator
                                                        decimalScale={2}
                                                        value={repot?.expense} />
                                                </h2>
                                                <h4 className="fw-bold d-block ">Xarajatlar</h4>
                                            </div>
                                        </div>
                                        {/* <div className="col-6">
                                        <StatistikaChart foiz={repot?.ambulator > 0 ? (repot?.ambulator / repot?.bemorlar) * 100 : 0} range='#ffab00' />
                                    </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-xl-4 col-xxl-3 mb-4">
                            <div className="card cursor-pointer border-0 border-bottom border-warning border-5"
                                id='corusel__btn'
                                onClick={() => {

                                    // showData('ambulator')
                                    path('/accounting-department/material-expense')
                                }}
                            >
                                <div className="card-body card-body_change" >

                                    <div className="row align-items-center" >
                                        <div className="col-6 d-flex  gap-4 ">
                                            <div>

                                                <h2 className="card-title fw-bold  text-info " >
                                                    <NumericFormat displayType="text"
                                                        thousandSeparator
                                                        decimalScale={2}
                                                        value={repot?.material_expense} />
                                                </h2>
                                                <h4 className="fw-bold d-block ">Material xarajatlar</h4>
                                            </div>
                                        </div>
                                        {/* <div className="col-6">
                                        <StatistikaChart foiz={repot?.ambulator > 0 ? (repot?.ambulator / repot?.bemorlar) * 100 : 0} range='#ffab00' />
                                    </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-xl-4 col-xxl-3 mb-4">
                            <div className="card cursor-pointer border-0 border-bottom border-warning border-5"
                                id='corusel__btn'
                                onClick={() => {

                                    // showData('ambulator')
                                    path('/accounting-department/daily')
                                }}
                            >
                                <div className="card-body card-body_change" >

                                    <div className="row align-items-center" >
                                        <div className="col-6 d-flex  gap-4 ">
                                            <div>

                                                <h2 className="card-title fw-bold  text-info " >
                                                    <NumericFormat displayType="text"
                                                        thousandSeparator
                                                        decimalScale={2}
                                                        value={repot?.kassa} />
                                                </h2>
                                                <h4 className="fw-bold d-block ">Kassa</h4>
                                            </div>
                                        </div>
                                        {/* <div className="col-6">
                                        <StatistikaChart foiz={repot?.ambulator > 0 ? (repot?.ambulator / repot?.bemorlar) * 100 : 0} range='#ffab00' />
                                    </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-xl-4 col-xxl-3 mb-4">
                            <div className="card cursor-pointer border-0 border-bottom border-warning border-5"
                                id='corusel__btn'
                                onClick={() => {
                                    // showData('ambulator')
                                    path('/accounting-department/doctor')
                                }}
                            >
                                <div className="card-body card-body_change" >

                                    <div className="row align-items-center" >
                                        <div className="col-6 d-flex  gap-4 ">
                                            <div>

                                                <h2 className="card-title fw-bold  text-info " >
                                                    <NumericFormat displayType="text"
                                                        thousandSeparator
                                                        decimalScale={2}
                                                        value={repot?.doctor} />
                                                </h2>
                                                <h4 className="fw-bold d-block ">Shifokor ulushi</h4>
                                            </div>
                                        </div>
                                        {/* <div className="col-6">
                                        <StatistikaChart foiz={repot?.ambulator > 0 ? (repot?.ambulator / repot?.bemorlar) * 100 : 0} range='#ffab00' />
                                    </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                }

            </div>
        </Content>
    )
}

export default AccountingDepartment
