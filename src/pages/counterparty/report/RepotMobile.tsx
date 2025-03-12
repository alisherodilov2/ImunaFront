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
import ClientView from './ClientView'
import { phoneFormatNumber } from '../../../helper/graphHelper'
import TableLoader from '../../../componets/table/TableLoader'
import { FaBoxOpen } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
// import { ReferringDoctorOrderShow } from './ReferringDoctorOrderShow'

const RepotMobile = () => {
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
    const [search, setSearch] = useState({
        full_name: '', phone: '', person_id: '', probirka: '', data_birth: ''
        ,
        referring_doctor_id: {
            label: 'Barachsi',
            value: ''
        }

    } as any)
    useEffect(() => {
        dispatch(isReferringDoctorGet('?is_repot=1'))
    }, [])

    const show = async (id: any) => {
        try {
            setLoad(() => true)
            let res = await axios.get(`/referring-doctor/show/${id}`)
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
    // const [search,setSearch] = useState({} as any)
    const path = useNavigate()
    return (
        <Content >
            <Navbar />
            <div className="container-fluid flex-grow-1 container-p-y size_16 ">
                <div className="d-flex my-1 gap-3">
                    <form className='row '>
                        <div className="col-6">
                            <Input type='date' onChange={(e: any) => {
                                let value = e.target.value
                                if (value && value.length > 0) {
                                    dispatch(isReferringDoctorGet(`?is_repot=1&start_date=${value}&end_date=${referringDoctorData?.end_date}&referring_doctor_id=${search?.referring_doctor_id.value}`))
                                }
                            }}
                                value={referringDoctorData?.start_date}
                            />
                        </div>
                        <div className="col-6">
                            <Input type='date' min={referringDoctorData?.start_date} onChange={(e: any) => {
                                let value = e.target.value
                                if (value && value.length > 0) {
                                    dispatch(isReferringDoctorGet(`?is_repot=1&start_date=${referringDoctorData?.start_date}&end_date=${value}&referring_doctor_id=${search?.referring_doctor_id.value}`))
                                }
                            }}
                                value={referringDoctorData?.end_date}
                            />
                        </div>
                        <div className="col-12 my-2">
                            <Select
                                // isDisabled={data?.department?.id>0 ? true : false}
                                name='name3'
                                value={search?.referring_doctor_id}
                                onChange={(e: any) => {
                                    setSearch({
                                        ...search,
                                        referring_doctor_id: e
                                    })

                                    dispatch(isReferringDoctorGet(`?is_repot=1&start_date=${referringDoctorData?.start_date}&end_date=${referringDoctorData?.start_date}&referring_doctor_id=${e.value}`))

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




                    </form>
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
                                path('/repot/' + item?.id)
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
                                    +<NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={item?.kounteragent_contribution_price} />
                                </p>
                                <p className="fw-bold text-success mb-0">
                                    +<NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={item?.kounteragent_doctor_contribution_price} />
                                </p>
                            </div>
                        </div>
                    )
                })}

            </div>

            <ClientView data={item} modal={modal} setModal={setModal} />
        </Content>
    )
}

export default RepotMobile