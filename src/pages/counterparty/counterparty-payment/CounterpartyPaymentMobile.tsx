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
import Swal from 'sweetalert2'
import Content from '../../../layout/Content'
import { isFindFunction } from '../../../service/reducer/MenuReducer'
import { NumericFormat } from 'react-number-format'
import { query } from '../../../componets/api/Query'
import axios from 'axios'
import { domain } from '../../../main'
import { fullName } from '../../../helper/fullName'
import CounterpartyPaymentAdd from './CounterpartyPaymentAdd'
import Select from 'react-select';
import { ref } from 'yup'
import TableLoader from '../../../componets/table/TableLoader'
import { FaBoxOpen } from 'react-icons/fa'
import { phoneFormatNumber } from '../../../helper/graphHelper'
// import { ReferringDoctorOrderShow } from './ReferringDoctorOrderShow'

const CounterpartyPaymentMobile = () => {
    const [modal, setModal] = useState(false)
    const [modal2, setModal2] = useState(false)
    const [item, setItem] = useState({} as any)
    const [item2, setItem2] = useState({} as any)
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
            setItem2(() => result)
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
    const [search, setSearch] = useState({ full_name: '', phone: '', person_id: '', probirka: '', data_birth: '' })
    useEffect(() => {
        dispatch(isReferringDoctorGet('?is_payment=1'))
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
    const doctorPayShow = async (id: any) => {
        try {
            setLoad(() => true)
            let res = await axios.get(`/referring-doctor/item-pay-show?id=${id}&month=${referringDoctorData?.month.value}&year=${referringDoctorData?.current_year.value}`)
            const { result } = res.data
            setModal2(true)
            setItem2(() => {
                return {
                    ...result,
                    year: referringDoctorData?.current_year
                    .value,
                    month: referringDoctorData?.month.value
                }
            })
            // if (result?.referring_doctor_balance?.length > 0) {
            //     setItem(() => result)
            //     setModal(() => true)
            // }
        } catch (error) {

        } finally {
            setLoad(() => false)
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
    return (
        <Content loading={load}>
            <Navbar />
            <div className="container-fluid flex-grow-1 container-p-y size_16 ">
                <div className="row my-1">
                    <div className="col-12 mb-1">
                        <Input placeholder='F.I.O Izlash...' onChange={(e: any) => {
                            setSearch((res: any) => {
                                return {
                                    ...res,
                                    full_name: e.target.value?.trim().toLowerCase()
                                }
                            })
                            dispatch(isReferringDoctorGet(`?is_payment=1&month=${referringDoctorData?.month?.value}&year=${referringDoctorData?.current_year?.value}&full_name=${e.target.value?.trim().toLowerCase()}`))

                        }}
                            value={search?.full_name}
                        />
                    </div>
                    <div className="col-6">
                        <Select
                            name='name'
                            value={referringDoctorData?.current_year}
                            onChange={(e: any) => {
                                dispatch(isReferringDoctorGet(`?is_payment=1&month=${referringDoctorData?.month?.value}&year=${e?.value}&full_name=${search?.full_name}`))
                                // setSearch((res: any) => {
                                //     return {
                                //         ...res,
                                //         department: e
                                //     }
                                // })
                                // dispatch(isGraphGet(`?year=${e?.value ?? ''}&department_id=${graphData?.department?.value ?? ''}&month=${graphData?.month?.value ?? ''}`))
                            }}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            options={
                                referringDoctorData?.year
                            } />
                    </div>
                    <div className="col-6">
                        <Select
                            name='name'
                            value={referringDoctorData?.month}
                            onChange={(e: any) => {
                                setSearch((res: any) => {
                                    return {
                                        ...res,
                                        is_today: false,
                                        all: false,

                                    }
                                })
                                dispatch(isReferringDoctorGet(`?is_payment=1&month=${e?.value}&year=${referringDoctorData?.current_year?.value}&full_name=${search?.full_name}`))
                                // dispatch(isStatisticaGet(`?is_all=0&is_today=0&month=${e?.value ?? ''}`))

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

                {referringDoctorData.data?.map((item: any) => {
                    return (
                        <div className="card border border-primary  my-2 cursor-pointer"
                            onClick={() => {
                                // path('/repot/' + item?.id)
                                doctorPayShow(item?.id)
                            }}

                        >
                            <div className="card-body p-2">
                                <div className="d-flex align-items-center justify-content-between">
                                    <h4 className='mb-0'>
                                        {fullName(item)}
                                    </h4>
                                    <p className='fw-bold mb-0'>{item?.client_count}</p>
                                </div>
                                <p className='mb-0'>{item?.workplace}</p>
                                <p className='mb-0'>+998 {phoneFormatNumber(item?.phone)}</p>
                            </div>
                            <div className="card-footer d-flex justify-content-between align-items-center  p-2">
                                {/* <p className='fw-bold mb-0'>
                                    <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={item?.total_price} />
                                </p> */}
                                <p className='fw-bold text-primary mb-0'>
                                    <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={item?.referring_doctor_balance?.reduce((acc: any, item: any) => acc + +item?.total_kounteragent_doctor_contribution_price, 0)} />
                                </p>
                                <p className="fw-bold text-danger mb-0">
                                    -<NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={item?.referring_doctor_balance?.reduce((acc: any, item: any) => acc + +item?.total_kounteragent_doctor_contribution_price, 0) - item?.referring_doctor_balance?.reduce((acc: any, item: any) => acc + +item?.counterparty_kounteragent_contribution_price_pay, 0)} />
                                </p>
                            </div>
                        </div>
                    )
                })}
            </div>

            <CounterpartyPaymentAdd
                modal={modal2}
                setModal={setModal2}
                data={item2}
                setData={setItem2}
            />
        </Content>
    )
}

export default CounterpartyPaymentMobile