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
// import { ReferringDoctorOrderShow } from './ReferringDoctorOrderShow'

const CounterpartyPaymentDesktop = () => {
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
                <div className="d-flex my-1 gap-3">
                    <form className='row w-100'>
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
                                dispatch(isReferringDoctorGet('?is_payment=1&month=' + e?.value))
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

                    </form>
                </div>
                <div className="card" style={{
                    height: `${window.innerHeight / 1.7}px`,
                    overflow: 'auto'
                }}>
                    <Table
                        page={page}
                        //  exportFile={true}
                        //  importFile={true}
                        deletedispatchFunction={isReferringDoctorDelete}
                        setNumberOfPages={setNumberOfPages}
                        paginationRole={true}
                        localEditFunction={(e: any) => {
                            setItem(() => e)
                            console.log();

                            setModal(true)
                        }}
                        errorMassage={massage}
                        isLoading={isLoading}
                        isSuccess={isSuccess}
                        reloadData={true}
                        reloadDataFunction={() => {
                            dispatch(isReferringDoctorGet('?is_payment=1'))
                        }}
                        top={100}
                        scrollRole={true}
                        // editRole={true}
                        // deleteRole={true}
                        limit={pageLimit}
                        extraKeys={['full_name', 'cliet_count_', 'total_price_', 'doctor_contribution_price_', 'doctor_contribution_price_prosess', 'doctor_contribution_price_payy']}
                        columns={[
                            {
                                title: '№',
                                key: 'id',
                                render: (value: any, data: any) => {
                                    return <div key={data.index} className='d-flex  align-items-center gap-1'>

                                        <span>
                                            {((data?.index + 1) + (page * pageLimit) - pageLimit)}
                                        </span>
                                    </div>
                                }
                            },
                            {
                                title: "F.I.O",
                                key: 'full_name',
                                renderItem: (value: any, data: any) => {
                                    return <td onClick={() => {
                                        doctorPayShow(value?.id)


                                    }}>

                                        <b>{fullName(value)}</b>

                                    </td>
                                }
                            },
                            {
                                title: 'Mijozlar soni',
                                key: 'cliet_count_',
                                render: (value: any, data: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={value?.referring_doctor_balance?.length} />
                                }
                            },
                            {
                                title: 'Umumiy summa',
                                key: 'total_price_',
                                render: (value: any, data: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={value?.referring_doctor_balance?.reduce((acc: any, item: any) => acc + +item?.total_price, 0)} />
                                }
                            },
                            {
                                title: 'Doktor ulushi',
                                key: 'doctor_contribution_price_',
                                render: (value: any, data: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={value?.referring_doctor_balance?.reduce((acc: any, item: any) => acc + +item?.total_kounteragent_doctor_contribution_price, 0)} />
                                }
                            },
                            {
                                title: 'Tolovga',
                                key: 'doctor_contribution_price_prosess',
                                render: (value: any, data: any) => {
                                    return <span className='text-danger'>
                                        <NumericFormat displayType="text"
                                            thousandSeparator
                                            decimalScale={2}
                                            value={value?.referring_doctor_balance?.reduce((acc: any, item: any) => acc + +item?.total_kounteragent_doctor_contribution_price, 0) - value?.referring_doctor_balance?.reduce((acc: any, item: any) => acc + +item?.counterparty_kounteragent_contribution_price_pay, 0)} />
                                    </span>
                                }
                            },
                            {
                                title: 'Tolandi',
                                key: 'doctor_contribution_price_payy',
                                render: (value: any, data: any) => {
                                    return <span className='text-success'>
                                        +
                                        <NumericFormat displayType="text"
                                            thousandSeparator
                                            decimalScale={2}
                                            value={value?.referring_doctor_balance?.reduce((acc: any, item: any) => acc + +item?.counterparty_kounteragent_contribution_price_pay, 0)} />
                                    </span>
                                }
                            },





                        ]}
                        dataSource={
                            filter(referringDoctorData.data, serachText)
                        }
                    />
                </div>
                <br />
                <Pagination
                    setPageLimit={(e: any) => {
                        // setNumberOfPages(Math.ceil(referringDoctorData?.length / e))
                        // setPageLimit(e)
                        dispatch(isReferringDoctorCurrentPage(1))
                        dispatch(isReferringDoctorPageLimit(e))
                    }}

                    pageLmit={pageLimit}
                    current={page} total={Math.ceil(referringDoctorData.data?.length / pageLimit)} count={isReferringDoctorCurrentPage} />
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

export default CounterpartyPaymentDesktop