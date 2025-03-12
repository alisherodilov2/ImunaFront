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
// import ClientView from './ClientView'
// import { ReferringDoctorOrderShow } from './ReferringDoctorOrderShow'

const CounterpartyClientDesktop = () => {
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
        dispatch(isReferringDoctorGet('?is_repot=1'))
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
    return (
        <Content loading={load}>
            <Navbar />
            <div className="container-fluid flex-grow-1 container-p-y size_16 ">
                <div className="d-flex my-1 gap-3">
                    <form className='row w-100'>
                        <div className="col-2">
                            <Input type='date' onChange={(e: any) => {
                                let value = e.target.value
                                if (value && value.length > 0) {
                                    dispatch(isReferringDoctorGet(`?is_repot=1&start_date=${value}&end_date=${referringDoctorData?.end_date}`))
                                }
                            }}
                                value={referringDoctorData?.start_date}
                            />
                        </div>
                        <div className="col-2">
                            <Input type='date' min={referringDoctorData?.start_date} onChange={(e: any) => {
                                let value = e.target.value
                                if (value && value.length > 0) {
                                    dispatch(isReferringDoctorGet(`?is_repot=1&start_date=${referringDoctorData?.start_date}&end_date=${value}`))
                                }
                            }}
                                value={referringDoctorData?.end_date}
                            />
                        </div>

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
                            dispatch(isReferringDoctorGet('?is_repot=1'))
                        }}
                        top={100}
                        scrollRole={true}
                        // editRole={true}
                        // deleteRole={true}
                        limit={pageLimit}
                        extraKeys={['full_name', 'cliet_count_', 'total_price_', 'doctor_contribution_price_', 'kounteragent_contribution_price_']}
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
                                        show(value?.id)
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
                                        value={value?.client_count} />
                                }
                            },
                            {
                                title: 'Umumiy summa',
                                key: 'total_price_',
                                render: (value: any, data: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={value?.total_price} />
                                }
                            },
                            {
                                title: 'Doktor ulushi',
                                key: 'doctor_contribution_price_',
                                render: (value: any, data: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={value?.doctor_contribution_price} />
                                }
                            },

                            {
                                title: 'agent ulushi',
                                key: 'kounteragent_contribution_price_',
                                render: (value: any, data: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={value?.kounteragent_contribution_price} />
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
            {/* <ReferringDoctorOrderShow
                modal={modal2}
                setModal={setModal2}
                data={item2}
                setData={setItem2}
            /> */}
            {/* <ClientView data={item} modal={modal} setModal={setModal} /> */}
        </Content>
    )
}

export default CounterpartyClientDesktop