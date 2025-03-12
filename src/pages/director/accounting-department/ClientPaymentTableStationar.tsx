import React, { useEffect, useRef, useState } from 'react'
import Layout from '../../../layout/Layout'
import Navbar from '../../../layout/Navbar'
import Table from '../../../componets/table/Table'
import Input from '../../../componets/inputs/Input'
import Pagination from '../../../componets/pagination/Pagination'
import { read, utils, writeFileXLSX } from 'xlsx'
import { useDispatch, useSelector } from 'react-redux'
import { ReducerType } from '../../../interface/interface'
import Swal from 'sweetalert2'
import Content from '../../../layout/Content'
import { NumericFormat } from 'react-number-format'
import { query } from '../../../componets/api/Query'
import axios from 'axios'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Select from 'react-select';
import { AppDispatch } from '../../../service/store/store'
import { isClientAddExcelFile, isClientCurrentPage, isClientDelete, isClientGet, isClientPageLimit, isTornametClient } from '../../../service/reducer/ClientReducer'
import { isDepartmentGet } from '../../../service/reducer/DepartmentReducer'
import { exportToExcel } from '../../../helper/exportToExcel'
import { isServiceTypeGet } from '../../../service/reducer/ServiceTypeReducer'
import { isServiceGet } from '../../../service/reducer/ServiceReducer'
import { fullName, masulRegUchunFullName } from '../../../helper/fullName'
import { MdContentCopy } from 'react-icons/md'
import { IoMdRepeat } from 'react-icons/io'
import CashRegister from '../../cash_register/CashRegister'
import { formatId } from '../../../helper/idGenerate'
import { getCurrentDateTime } from '../../../helper/dateFormat'
import { cashRegDiscount } from '../../../helper/cashRegCalc'
import { isGraphGet } from '../../../service/reducer/GraphReducer'
import { BiCalendarCheck } from 'react-icons/bi'
import { AiFillEdit } from 'react-icons/ai'
import { FaPrint, FaRegPlusSquare } from 'react-icons/fa'
import { formatter, generateCheck } from '../../../helper/generateCheck'
import { chegirmaHisobla } from '../../../helper/cashRegHelper'
import { isTreatmentGet } from '../../../service/reducer/TreatmentReducer'
import { isReferringDoctorGet } from '../../../service/reducer/ReferringDoctorReducer'
import { render } from 'react-dom'
import { Modal } from 'reactstrap'
import { addDaysToDate, statitionarDate } from '../../../helper/clientHelper'
import { space } from 'postcss/lib/list'
const ClientPaymentTableStationar = () => {
    const dataSelect = (data: any) => {
        let res = [...data].sort((a: any, b: any) => b.id - a.id);
        return res?.map((item: any) => {
            return {
                value: item?.id, label: item?.name || item?.type,
                data: item
            }
        })
    }
    const iframeRef = useRef<HTMLIFrameElement | null>(null);


    const treatmentShow = async (person_id: any) => {
        try {
            setLoad(() => true)
            let res = await axios.get(`/graph/treatment-show?person_id=${person_id}`)
            const { result } = res.data

            setItem2({ ...(result?.graph ?? {}), ...result?.graph_archive?.person, use_status: 'treatment', graph_archive_id: result?.graph_archive?.id, treatment: result?.graph_archive?.treatment })
            setModal3(true)
            // setItem2({ ...result })
            // setItem({})
            // setItem(() => result)
            // setCash(() => true)
        } catch (error) {

        } finally {
            setLoad(() => false)
        }
    }

    const { graph_achive_target } = useSelector((state: ReducerType) => state.GraphReducer)
    const { departmentData, } = useSelector((state: ReducerType) => state.DepartmentReducer)
    const [modal, setModal] = useState(false)
    const [modaledit, setModaledit] = useState(false)
    const [modal2, setModal2] = useState(false)
    const [modal3, setModal3] = useState(false)
    const [item, setItem] = useState({} as any)
    const [item2, setItem2] = useState({} as any)
    const toggle = () => {
        setModal(!modal)
    };
    const { user, target_branch } = useSelector((state: ReducerType) => state.ProfileReducer)
    const { page, clientData, massage, isLoading, isSuccess, pageLimit } = useSelector((state: ReducerType) => state.ClientReducer)
    // const [pageLmit, setPageLimit] = useState(() => 5)
    const [numberOfPages, setNumberOfPages] = useState(Math.ceil(clientData?.data?.length / pageLimit))
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
                dispatch(isClientDelete({ all: [...new Set(checkData?.map((idAll: any) => idAll?.id))] }))
                setCheckData([])
            }
        })
        // dispatch(deletedispatchFunction(id))

    }
    const [data, setData] = useState({
        data: [],
        start_date: '',
        end_date: '',
    } as any)
    const allShow = async (data?: any) => {
        try {
            setLoad(() => true)
            let res = await axios.get(`/repot?status=pay_all_client&start_date=${data?.start_date ?? ''}&end_date=${data?.end_date ?? ''}&branch_id=${data?.branch?.value ?? ''}&person_id=${data?.person?.value ?? ''}&full_name=${data?.full_name ?? ''}&phone=${data?.phone ?? ''}&data_birth=${data?.data_birth ?? ''}&is_statsionar=1`)
            const { result } = res.data
            setData(() => result)
            // setItem({})
            // setModaledit(true)
            // setItem(() => {
            //     return {

            //         ...result
            //     }
            // })
            // setItem(() => result)
            // setCash(() => true)
        } catch (error) {

        } finally {
            setLoad(() => false)
        }
    }

    const [serachText, setSerachText] = useState('')
    const [load, setLoad] = useState(false)
    const orderShow = async (id: any) => {
        try {
            setLoad(() => true)
            let res = await axios.get('/?client_id=' + id)
            const { result } = res.data
            setItem2(() => result)

            setModal2(() => true)
        } catch (error) {

        } finally {
            setLoad(() => false)
        }
    }
    const [search, setSearch] = useState({
        branch: target_branch == 'all' ? { label: 'Barcha filallar', value: 'all' } : (target_branch > 0 ? user?.branch?.find((item: any) => item?.value == target_branch) : user?.branch?.at(0)),
        full_name: '',
        phone: '',
        person_id: '',
        probirka: '',
        data_birth: '',
    } as any)
    const filter = (data: any, serachData: any) => {
        // if (serachData?.full_name?.length > 0 && serachData?.phone?.length == 0 && serachData?.person_id?.length == 0 && serachData?.probirka?.length == 0 && serachData?.data_birth?.length == 0) {
        //     return data.filter((item: any) => fullName(item)?.toString().toLowerCase().includes(serachData?.full_name?.toString().toLowerCase()))
        // }
        // if (serachData?.full_name?.length > 0 && serachData?.phone?.length > 0 && serachData?.person_id?.length == 0 && serachData?.probirka?.length == 0 && serachData?.data_birth?.length == 0) {
        //     return data.filter((item: any) =>
        //         fullName(item)?.toString().toLowerCase().includes(serachData?.full_name?.toString().toLowerCase())
        //         && item?.phone?.toString().toLowerCase().includes(serachData?.phone?.toString().toLowerCase())
        //     )

        // }
        // if (serachData?.full_name?.length > 0 && serachData?.phone?.length > 0 && serachData?.person_id?.length > 0 && serachData?.probirka?.length == 0 && serachData?.data_birth?.length == 0) {
        //     return data.filter((item: any) =>
        //         fullName(item)?.toString().toLowerCase().includes(serachData?.full_name?.toString().toLowerCase())
        //         && item?.phone?.toString().toLowerCase().includes(serachData?.phone?.toString().toLowerCase())
        //         && item?.person_id?.toString().toLowerCase().includes(serachData?.person_id?.toString().toLowerCase())
        //     )

        // }
        // if (serachData?.full_name?.length > 0 && serachData?.phone?.length > 0 && serachData?.person_id?.length > 0 && serachData?.probirka?.length > 0 && serachData?.data_birth?.length == 0) {
        //     return data.filter((item: any) =>
        //         fullName(item)?.toString().toLowerCase().includes(serachData?.full_name?.toString().toLowerCase())
        //         && item?.phone?.toString().toLowerCase().includes(serachData?.phone?.toString().toLowerCase())
        //         && item?.person_id?.toString().toLowerCase().includes(serachData?.person_id?.toString().toLowerCase())
        //         && item?.probirka_count?.toString().toLowerCase().includes(serachData?.probirka?.toString().toLowerCase())
        //     )

        // }
        // if (serachData?.full_name?.length > 0 && serachData?.phone?.length > 0 && serachData?.person_id?.length > 0 && serachData?.probirka?.length > 0 && serachData?.data_birth?.length > 0) {
        //     return data.filter((item: any) =>
        //         fullName(item)?.toString().toLowerCase().includes(serachData?.full_name?.toString().toLowerCase())
        //         && item?.phone?.toString().toLowerCase().includes(serachData?.phone?.toString().toLowerCase())
        //         && item?.person_id?.toString().toLowerCase().includes(serachData?.person_id?.toString().toLowerCase())
        //         && item?.probirka_count?.toString().toLowerCase().includes(serachData?.probirka?.toString().toLowerCase())
        //         && Date.parse(item?.data_birth) === Date.parse(serachData?.data_birth)
        //     )
        // }

        // if (serachData?.full_name?.length == 0 && serachData?.phone?.length > 0 && serachData?.person_id?.length == 0 && serachData?.probirka?.length == 0 && serachData?.data_birth?.length == 0) {
        //     return data.filter((item: any) =>
        //         item?.phone?.toString().toLowerCase().includes(serachData?.phone?.toString().toLowerCase())
        //     )
        // }
        // if (serachData?.full_name?.length == 0 && serachData?.phone?.length == 0 && serachData?.person_id?.length > 0 && serachData?.probirka?.length == 0 && serachData?.data_birth?.length == 0) {
        //     return data.filter((item: any) =>
        //         item?.person_id?.toString().toLowerCase().includes(serachData?.person_id?.toString().toLowerCase())
        //     )
        // }
        // if (serachData?.full_name?.length == 0 && serachData?.phone?.length == 0 && serachData?.person_id?.length == 0 && serachData?.probirka?.length > 0 && serachData?.data_birth?.length == 0) {
        //     return data.filter((item: any) =>
        //         item?.probirka_count?.toString().toLowerCase().includes(serachData?.probirka?.toString().toLowerCase())
        //     )
        // }
        // if (serachData?.full_name?.length == 0 && serachData?.phone?.length == 0 && serachData?.person_id?.length == 0 && serachData?.probirka?.length == 0 && serachData?.data_birth?.length > 0) {
        //     return data.filter((item: any) =>
        //         Date.parse(item?.data_birth) === Date.parse(serachData?.data_birth)
        //     )
        // }

        // if (serachData?.full_name?.length == 0 && serachData?.phone?.length > 0 && serachData?.person_id?.length > 0 && serachData?.probirka?.length == 0 && serachData?.data_birth?.length == 0) {
        //     return data.filter((item: any) =>
        //         item?.phone?.toString().toLowerCase().includes(serachData?.phone?.toString().toLowerCase())
        //         && item?.person_id?.toString().toLowerCase().includes(serachData?.person_id?.toString().toLowerCase())
        //     )
        // }
        // if (serachData?.full_name?.length == 0 && serachData?.phone?.length > 0 && serachData?.person_id?.length == 0 && serachData?.probirka?.length > 0 && serachData?.data_birth?.length == 0) {
        //     return data.filter((item: any) =>
        //         item?.phone?.toString().toLowerCase().includes(serachData?.phone?.toString().toLowerCase())
        //         && item?.probirka_count?.toString().toLowerCase().includes(serachData?.probirka?.toString().toLowerCase())
        //     )
        // }
        // if (serachData?.full_name?.length == 0 && serachData?.phone?.length > 0 && serachData?.person_id?.length == 0 && serachData?.probirka?.length == 0 && serachData?.data_birth?.length > 0) {
        //     return data.filter((item: any) =>
        //         item?.phone?.toString().toLowerCase().includes(serachData?.phone?.toString().toLowerCase())
        //         && Date.parse(item?.data_birth) === Date.parse(serachData?.data_birth)
        //     )
        // }
        return data;
        // return Array.isArray(data) ? [...data].sort((a: any, b: any) => {
        //     const dateA = a?.client_item?.at(-1) ? Date.parse(a.client_item?.at(-1)) : 0;
        //     const dateB = b?.client_item?.at(-1) ? Date.parse(b.client_item?.at(-1)) : 0;
        //     return dateA - dateB;
        // }) : [];


        // if (serachData?.clienttype?.value === 'all' && serachData?.department?.value === 'all' && serachData.text === '') {
        //     return data
        // }
        // if (serachData?.clienttype?.value !== 'all' && serachData?.department?.value === 'all' && serachData.text === '') {
        //     return data.filter((item: any) => item.clienttype.id === serachData?.clienttype?.value)
        // }
        // if (serachData?.clienttype?.value === 'all' && serachData?.department?.value !== 'all' && serachData.text === '') {
        //     return data.filter((item: any) => item.department.id === serachData?.department?.value)
        // }
        // if (serachData?.clienttype?.value !== 'all' && serachData?.department?.value !== 'all' && serachData.text === '') {
        //     return data.filter((item: any) => item.clienttype.id === serachData?.clienttype?.value && item.department.id === serachData?.department?.value)
        // }
        // if (serachData?.clienttype?.value === 'all' && serachData?.department?.value === 'all' && serachData.text !== '') {
        //     return data.filter((item: any) => (item?.name?.toString().toLowerCase().includes(serachData.text)))
        // }
        // if (serachData?.clienttype?.value === 'all' && serachData?.department?.value !== 'all' && serachData.text !== '') {
        //     return data.filter((item: any) => item.department.id === serachData?.department?.value && (item?.name?.toString().toLowerCase().includes(serachData.text)))
        // }
        // if (serachData?.clienttype?.value !== 'all' && serachData?.department?.value === 'all' && serachData.text !== '') {
        //     return data.filter((item: any) => item.clienttype.id === serachData?.clienttype?.value && (item?.name?.toString().toLowerCase().includes(serachData.text)))
        // }

        // if (serachData?.clienttype?.value !== 'all' && serachData?.department?.value !== 'all' && serachData.text !== '') {
        //     return data.filter((item: any) => item.department.id === serachData?.department?.value && item.clienttype.id === serachData?.clienttype?.value && (item?.name?.toString().toLowerCase().includes(serachData.text)))
        // }


    }
    const [show, setShow] = useState(false)

    const { id, clienttype_id, department_id } = useParams() as any
    useEffect(() => {
        allShow({
            ...data,
            branch: target_branch == 'all' ? { label: 'Barcha filallar', value: 'all' } : (target_branch > 0 ? user?.branch?.find((item: any) => item?.value == target_branch) : user?.branch?.at(0))
        })


    }, [])
    useEffect(() => {

    }, [])
    const [cash, setCash] = useState(false)
    return (
        <>
            <Content loading={load} >
                <br />
                <Navbar />
                <div className="container-fluid flex-grow-1 py-1 size_16 ">
                    <div className="d-block d-lg-flex my-1 gap-0 gap-lg-3">
                        <form className='row w-auto w-lg-100 '>
                            {
                                user?.is_main_branch ? '' :
                                    <div className="col-lg-2 col-12 my-1">
                                        <Select
                                            name='name'
                                            isDisabled={user?.is_main_branch || load}
                                            value={search?.branch}
                                            onChange={(e: any) => {
                                                setSearch(({ ...search, branch: e }))
                                                allShow({
                                                    ...data,
                                                    branch: e,
                                                    start_date: '',
                                                    end_date: '',
                                                })
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

                            <div className={`col-lg-${user?.is_main_branch ? 4 : 3} d-flex align-items-center gap-1`}>
                                <Input type='date'
                                    disabled={load}

                                    onChange={(e: any) => {
                                        let value = e.target.value

                                        allShow({
                                            ...data,
                                            branch: search?.branch,
                                            start_date: value
                                        })
                                    }}
                                    value={data?.start_date}
                                />
                                <Input type='date' min={clientData?.start_date} onChange={(e: any) => {
                                    let value = e.target.value
                                    allShow({
                                        ...data,
                                        branch: search?.branch,
                                        end_date: value
                                    })
                                }}
                                    value={data?.end_date}
                                    disabled={load}

                                />
                            </div>

                            <div className="col-2 d-none d-lg-block">
                                <Input placeholder='F.I.O Izlash...' onChange={(e: any) => {
                                    setSearch((res: any) => {
                                        return {
                                            ...res,
                                            full_name: e.target.value?.trim().toLowerCase()
                                        }
                                    })

                                }}
                                    disabled={load}

                                    onKeyDown={
                                        (e: any) => {
                                            if (e.key === 'Enter') {
                                                // dispatch(isClientGet(`?start_date=${clientData?.start_date}&end_date=${clientData?.end_date}&full_name=${e.target.value?.trim().toLowerCase()}`))
                                                allShow({
                                                    ...data,
                                                    branch: search?.branch,
                                                    full_name: e.target.value?.trim().toLowerCase()
                                                })
                                            }
                                        }
                                    }
                                    value={search?.full_name}
                                />
                            </div>
                            <div className="col-2 d-none d-lg-block">
                                <Input placeholder='Telefon Izlash...'
                                    disabled={load}
                                    onChange={(e: any) => {
                                        setSearch((res: any) => {
                                            return {
                                                ...res,
                                                phone: e.target.value?.trim().toLowerCase()
                                            }
                                        })

                                    }}
                                    onKeyDown={
                                        (e: any) => {
                                            if (e.key === 'Enter') {
                                                // dispatch(isClientGet(`?start_date=${clientData?.start_date}&end_date=${clientData?.end_date}&phone=${e.target.value?.trim().toLowerCase()}`))
                                                allShow({
                                                    ...data,
                                                    branch: search?.branch,
                                                    phone: e.target.value?.trim().toLowerCase()
                                                })
                                            }
                                        }
                                    }
                                    value={search?.phone}
                                />
                            </div>
                            <div className="col-1 d-none d-lg-block">
                                <Input placeholder='ID Izlash...' disabled={load} onChange={(e: any) => {
                                    setSearch((res: any) => {
                                        return {
                                            ...res,
                                            person_id: e.target.value?.trim().toLowerCase()
                                        }
                                    })
                                }}
                                    onKeyDown={
                                        (e: any) => {
                                            if (e.key === 'Enter') {
                                                // dispatch(isClientGet(`?start_date=${clientData?.start_date}&end_date=${clientData?.end_date}&person_id=${e.target.value?.trim().toLowerCase()}`))
                                                allShow({
                                                    ...data,
                                                    branch: search?.branch,
                                                    person_id: e.target.value?.trim().toLowerCase()
                                                })
                                            }
                                        }
                                    }
                                    value={search?.person_id}
                                />
                            </div>
                            {/* <div className="col-2">
                            <Input placeholder='probirka Izlash...' onChange={(e: any) => {
                                setSearch((res: any) => {
                                    return {
                                        ...res,
                                        probirka: e.target.value?.trim().toLowerCase()
                                    }
                                })
                            }}
                                value={search?.probirka}
                            />
                        </div> */}
                            <div className="col-2 d-none d-lg-block">
                                <Input type='date' disabled={load} onChange={(e: any) => {
                                    setSearch((res: any) => {
                                        return {
                                            ...res,
                                            data_birth: e.target.value
                                        }
                                    })
                                }}
                                    onKeyDown={
                                        (e: any) => {
                                            if (e.key === 'Enter' && e.target.value?.trim().length > 0) {
                                                // dispatch(isClientGet(`?start_date=${clientData?.start_date}&end_date=${clientData?.end_date}&data_birth=${e.target.value?.trim().toLowerCase()}`))
                                                allShow({
                                                    ...data,
                                                    branch: search?.branch,
                                                    data_birth: e.target.value?.trim().toLowerCase()
                                                })
                                            }
                                        }
                                    }
                                    value={search?.data_birth}
                                />
                            </div>
                        </form>
                        <div className="d-flex gap-2 gap-lg-0">
                            <div className="w-100 my-2  d-block d-lg-none">
                                <Input placeholder='F.I.O Izlash...' onChange={(e: any) => {
                                    setSearch((res: any) => {
                                        return {
                                            ...res,
                                            full_name: e.target.value?.trim().toLowerCase()
                                        }
                                    })

                                }}
                                    onKeyDown={
                                        (e: any) => {
                                            if (e.key === 'Enter' && e.target.value?.trim().length > 0) {
                                                dispatch(isClientGet(`?start_date=${clientData?.start_date}&end_date=${clientData?.end_date}&full_name=${e.target.value?.trim().toLowerCase()}`))
                                            }
                                        }
                                    }
                                    value={search?.full_name}
                                />
                            </div>
                            <button className="btn btn-success my-2 my-lg-0 " type="button" onClick={() => {
                                let resultData = [...data.data.map((item: any, index: number) => {
                                    return {
                                        ["№"]: index + 1,
                                        ["F.I.O"]: fullName(item),
                                        ["Tel"]: `+998${item?.phone}`,
                                        ["ID"]: formatId(item?.person_id),
                                        ["To'langan"]: formatter.format(item?.pay_total_price),
                                        ["Naqd"]: formatter.format(item?.client_payment
                                            ?.reduce((a: any, b: any) => a + +b.cash_price
                                                , 0)),
                                        ["Plastik"]: formatter.format(item?.client_payment
                                            ?.reduce((a: any, b: any) => a + +b.cash_price
                                                , 0)),
                                        ["O'tkazma"]: formatter.format(item?.client_payment
                                            ?.reduce((a: any, b: any) => a + +b.transfer_price
                                                , 0)),
                                        ["Chegirma"]: formatter.format(item?.client_value
                                            ?.reduce((a: any, b: any) => a + b.is_active ? +(b.discount <= 100 ? b.total_price / 100 * b.discount : b.discount)
                                                : 0, 0)),
                                        ["Qarz"]: formatter.format(item?.client_value?.filter((item: any) => +item?.is_active)?.
                                            reduce((a: any, b: any) => a + b.total_price - chegirmaHisobla(b) - b.pay_price, 0)),
                                        ["Qaytarilgan"]: formatter.format(item?.client_value
                                            ?.reduce((a: any, b: any) => a + +b?.is_active ? 0 : +b.price
                                                , 0)),
                                    }
                                })]
                                exportToExcel(resultData)
                            }}>Eksport</button>
                        </div>
                    </div>
                    <div className="card" style={{
                        height: `${window.innerHeight / 1.4}px`,
                        overflow: 'auto'
                    }}>
                        <Table



                            deletedispatchFunction={isClientDelete}
                            setNumberOfPages={setNumberOfPages}
                            paginationRole={false}
                            localEditFunction={(e: any) => {
                                setItem(() => e?.client_item?.at(-1))

                                setModal(true)
                            }}
                            errorMassage={massage}
                            isLoading={isLoading}
                            isSuccess={isSuccess}
                            reloadData={true}
                            reloadDataFunction={() => {
                                setSearch((res: any) => {
                                    return {
                                        full_name: '',
                                        data_birth: '',
                                        phone: '',
                                        person_id: '',
                                        branch: user?.branch?.at(0)
                                    }
                                })
                                allShow(
                                    {
                                        start_date: '',
                                        end_date: ''
                                    }
                                )
                            }}
                            top={100}
                            scrollRole={true}
                            editRole={false}
                            deleteRole={false}
                            limit={pageLimit}
                            showRole={false}
                            showFunction={(item: any) => {
                                setShow(true)
                                setItem(() => item.client_item)
                            }}
                            // extraButtonRole={true}
                            // extraButton={(item: any) => {
                            //     return <>
                            //         <button className='btn btn-info btn-sm'
                            //             onClick={() => {
                            //                 generateCheck({
                            //                     target: item,
                            //                     iframeRef: iframeRef
                            //                 })
                            //             }}
                            //         >
                            //             <FaPrint />
                            //         </button>
                            //     </>
                            // }}
                            extraKeys={[
                                'full_name_',
                                'phone_',
                                'person_id_',
                                'day_qty_',
                                'pay_total_price_',
                                'cash_pay_total_price',
                                'card_pay_total_price',
                                'transfer_pay_total_price',
                                'discount_price',
                                'debt_',
                                'current_balance_',
                                'repet_',
                                'pay_count',
                            ]}

                            extraTrFunction={
                                () => {
                                    return <tr className='itok'>
                                        <td colSpan={4}>
                                            <div className='d-flex gap-2 justify-content-between px-5 align-items-center'>
                                                <p>
                                                    <b>Umumiy:    <NumericFormat displayType="text"
                                                        thousandSeparator
                                                        decimalScale={2}
                                                        value={
                                                            data?.data?.reduce((a: any, b: any) => a + +b?.pay_total_price, 0)
                                                        } /></b> <br />
                                                    <b>Naqt:<NumericFormat displayType="text"
                                                        thousandSeparator
                                                        decimalScale={2}
                                                        value={data?.data?.reduce((a: any, b: any) => a + +b?.client_payment
                                                            ?.reduce((a: any, b: any) => a + +b.cash_price
                                                                , 0), 0)} /></b> <br />
                                                    <b>plastik:<NumericFormat displayType="text"
                                                        thousandSeparator
                                                        decimalScale={2}
                                                        value={data?.data?.reduce((a: any, b: any) => a + +b?.client_payment
                                                            ?.reduce((a: any, b: any) => a + +b.card_price
                                                                , 0), 0)} /></b> <br />
                                                    <b>O'tkazma:<NumericFormat displayType="text"
                                                        thousandSeparator
                                                        decimalScale={2}
                                                        value={data?.data?.reduce((a: any, b: any) => a + +b?.client_payment
                                                            ?.reduce((a: any, b: any) => a + +b.transfer_price
                                                                , 0), 0)} /></b> <br />
                                                </p>

                                                <p>
                                                    <b>Xarajat:    <NumericFormat displayType="text"
                                                        thousandSeparator
                                                        decimalScale={2}
                                                        value={data?.expence?.total} /></b> <br />
                                                    <b>Naqt:<NumericFormat displayType="text"
                                                        thousandSeparator
                                                        decimalScale={2}
                                                        value={data?.expence?.cash} /></b> <br />
                                                    <b>plastik:<NumericFormat displayType="text"
                                                        thousandSeparator
                                                        decimalScale={2}
                                                        value={data?.expence?.card} /></b> <br />
                                                    <b>O'tkazma:<NumericFormat displayType="text"
                                                        thousandSeparator
                                                        decimalScale={2}
                                                        value={data?.expence?.transfer} /></b> <br />
                                                </p>
                                                <p>
                                                    <b>Qoldiq:    <NumericFormat displayType="text"
                                                        thousandSeparator
                                                        decimalScale={2}
                                                        value={
                                                            data?.data?.reduce((a: any, b: any) => a + +b?.pay_total_price, 0)

                                                            - data?.expence?.total
                                                        } /></b> <br />
                                                    <b>Naqt:<NumericFormat displayType="text"
                                                        thousandSeparator
                                                        decimalScale={2}
                                                        value={data?.data?.reduce((a: any, b: any) => a + +b?.client_payment
                                                            ?.reduce((a: any, b: any) => a + +b.cash_price
                                                                , 0), 0)
                                                            - data?.expence?.cash
                                                        } /></b> <br />
                                                    <b>plastik:<NumericFormat displayType="text"
                                                        thousandSeparator
                                                        decimalScale={2}
                                                        value={data?.data?.reduce((a: any, b: any) => a + +b?.client_payment
                                                            ?.reduce((a: any, b: any) => a + +b.card_price
                                                                , 0), 0)
                                                            - data?.expence?.card
                                                        } /></b> <br />
                                                    <b>O'tkazma:<NumericFormat displayType="text"
                                                        thousandSeparator
                                                        decimalScale={2}
                                                        value={data?.data?.reduce((a: any, b: any) => a + +b?.client_payment
                                                            ?.reduce((a: any, b: any) => a + +b.transfer_price
                                                                , 0), 0)
                                                            - data?.expence?.transfer
                                                        } /></b> <br />
                                                </p>
                                            </div>
                                        </td>
                                        <td>
                                            <b>
                                                <NumericFormat displayType="text"
                                                    thousandSeparator
                                                    decimalScale={2}
                                                    value={data?.data?.reduce((a: any, b: any) => a + +b?.pay_total_price, 0)} />
                                            </b>
                                        </td>
                                        <td>
                                            <b>
                                                <NumericFormat displayType="text"
                                                    thousandSeparator
                                                    decimalScale={2}
                                                    value={data?.data?.reduce((a: any, b: any) => a + +b?.client_payment
                                                        ?.reduce((a: any, b: any) => a + +b.cash_price
                                                            , 0), 0)} />
                                            </b>
                                        </td>
                                        <td>
                                            <b>
                                                <NumericFormat displayType="text"
                                                    thousandSeparator
                                                    decimalScale={2}
                                                    value={data?.data?.reduce((a: any, b: any) => a + +b?.client_payment
                                                        ?.reduce((a: any, b: any) => a + +b.card_price
                                                            , 0), 0)} />
                                            </b>
                                        </td>
                                        <td>
                                            <b>
                                                <NumericFormat displayType="text"
                                                    thousandSeparator
                                                    decimalScale={2}
                                                    value={data?.data?.reduce((a: any, b: any) => a + +b?.client_payment
                                                        ?.reduce((a: any, b: any) => a + +b.transfer_price
                                                            , 0), 0)} />
                                            </b>
                                        </td>
                                        <td>
                                            <b>
                                                <NumericFormat displayType="text"
                                                    thousandSeparator
                                                    decimalScale={2}
                                                    value={
                                                        data?.data?.flatMap((res: any) => res.client_value)
                                                            ?.filter((item: any) => +item?.is_active)?.
                                                            reduce((a: any, b: any) => a + chegirmaHisobla(b), 0)
                                                        // data?.data?.reduce((a: any, b: any) => a +
                                                        //     +b.client_value
                                                        //         ?.reduce((a2: any, b2: any) => a2 + +b2?.is_active ? chegirmaHisobla(b2) : 0
                                                        //             , 0), 0)

                                                    } />
                                            </b>
                                        </td>

                                        <td>
                                            <b>
                                                <NumericFormat displayType="text"
                                                    thousandSeparator
                                                    decimalScale={2}
                                                    value={Math.abs(data?.data?.reduce((a: any, b: any) => a + (b?.client_value?.filter((item: any) => +item?.is_active)?.
                                                        reduce((a1: any, b1: any) => a1 + b1.total_price - chegirmaHisobla(b1) - b1.pay_price, 0)), 0))} />
                                            </b>
                                        </td>
                                        <td>
                                            <b>
                                                <NumericFormat displayType="text"
                                                    thousandSeparator
                                                    decimalScale={2}
                                                    value={Math.abs(data?.data?.reduce((a: any, b: any) => a + +(b?.current_balance?.balance), 0))} />
                                            </b>
                                        </td>
                                        <td>
                                            <b>
                                                <NumericFormat displayType="text"
                                                    thousandSeparator
                                                    decimalScale={2}
                                                    value={data?.data?.reduce((a: any, b: any) => a + +b?.client_value
                                                        ?.reduce((a: any, b: any) => a + +b?.is_active ? 0 : +b.price
                                                            , 0), 0)} />
                                            </b>
                                        </td>
                                    </tr>
                                }
                            }
                            columns={[
                                {
                                    title: '№',
                                    key: 'id',
                                    render: (value: any, data: any) => {

                                        return ((data?.index + 1) + (page * pageLimit) - pageLimit)

                                    }
                                },
                                {
                                    title: "F.I.O",
                                    key: 'full_name_',
                                    renderItem: (value: any, data: any) => {
                                        return <td onClick={() => {
                                            setItem(value)
                                            setModal(true)

                                        }}>

                                            <b>{fullName(value)}</b>
                                            <br />
                                            <span className='text-info register_date'  >
                                                {getCurrentDateTime(value?.created_at)}
                                            </span> <br />
                                            <span className='fw-bold register_date'  >
                                                {value?.user?.owner?.name}
                                            </span> <br />
                                            {/* <span className='text-success register_date'  >
                                                {masulRegUchunFullName(value?.user)}
                                            </span> */}
                                        </td>
                                    }
                                },
                                {
                                    title: 'Tel',
                                    key: 'phone_',
                                    render: (value: any, data: any) => {
                                        return `+998${value?.phone}`
                                    }
                                },

                                {
                                    title: 'ID',
                                    key: 'person_id_',
                                    render: (value: any, data: any) => {
                                        return `${value?.is_statsionar ? "S" : ""}${formatId(value?.person_id)}`
                                    }
                                },
                                {
                                    title: "Kun",
                                    key: 'day_qty_',
                                    render: (value: any, data: any) => {
                                        const { client_value } = value
                                        let total = client_value?.reduce((a: any, b: any) => a + +b?.is_active ? +b.total_price : 0, 0);
                                        let qty = 0;
                                        let res_qty = 0;
                                        if (+value?.is_finish_statsionar) {
                                            qty = value.day_qty > 0 ? value.day_qty : statitionarDate(value?.admission_date, value?.finish_statsionar_date)?.length
                                            res_qty = qty
                                        } else {
                                            qty =  value.day_qty > 0 ? value.day_qty : statitionarDate(value?.admission_date, user?.graph_format_date)?.length;
                                            res_qty = value?.admission_date === user?.graph_format_date ? 0 : value.day_qty > 0 ? statitionarDate(value?.admission_date, addDaysToDate(value?.admission_date, value.day_qty))?.length : statitionarDate(value?.admission_date, user?.graph_format_date)?.length

                                        }


                                        return <>

                                            {qty}/{res_qty}

                                        </>
                                    }
                                },
                                {
                                    title: "To'lovga",
                                    key: 'pay_total_price_',
                                    render: (value: any, data: any) => {
                                        const { client_value } = value
                                        let total = client_value?.reduce((a: any, b: any) => a + +b?.is_active ? +b.total_price : 0, 0);
                                        let qty = 0;
                                        if (value.day_qty > 0) {
                                            qty = value.day_qty
                                        } else {
                                            if (+value?.is_finish_statsionar) {
                                                qty = statitionarDate(value?.admission_date, value?.finish_statsionar_date)?.length
                                            } else {
                                                qty = statitionarDate(value?.admission_date, user?.graph_format_date)?.length
                                            }
                                        }

                                        return <NumericFormat displayType="text"
                                            thousandSeparator
                                            decimalScale={2}
                                            value={total + qty * value?.statsionar_room_price} />
                                    }
                                },
                                {
                                    title: "Naqd",
                                    key: 'cash_pay_total_price',
                                    render: (value: any, data: any) => {
                                        return <NumericFormat displayType="text"
                                            thousandSeparator
                                            decimalScale={2}
                                            value={value?.client_payment
                                                ?.reduce((a: any, b: any) => a + +b.cash_price
                                                    , 0)} />
                                    }
                                },
                                {
                                    title: "Plastik",
                                    key: 'card_pay_total_price',
                                    render: (value: any, data: any) => {
                                        return <NumericFormat displayType="text"
                                            thousandSeparator
                                            decimalScale={2}
                                            value={value?.client_payment
                                                ?.reduce((a: any, b: any) => a + +b.card_price
                                                    , 0)} />
                                    }
                                },
                                {
                                    title: "O'tkazma",
                                    key: 'transfer_pay_total_price',
                                    render: (value: any, data: any) => {
                                        return <NumericFormat displayType="text"
                                            thousandSeparator
                                            decimalScale={2}
                                            value={value?.client_payment
                                                ?.reduce((a: any, b: any) => a + +b.transfer_price
                                                    , 0)} />
                                    }
                                },
                                {
                                    title: 'Chegirma',
                                    key: 'discount_price',
                                    render: (value: any, data: any) => {
                                        const { total_price, pay_total_price, discount_price, client_payment, client_value, discount } = value
                                        let calcdiscount = discount;
                                        // let discount = cashRegDiscount(client_payment?.at(0)?.total_price, client_payment?.at(0)?.discount)
                                        return <NumericFormat displayType="text"
                                            thousandSeparator
                                            decimalScale={2}
                                            value={value?.client_value?.filter((item: any) => +item?.is_active)?.
                                                reduce((a: any, b: any) => a + chegirmaHisobla(b), 0)} />
                                    }
                                },
                                {
                                    title: 'Qarz',
                                    key: 'debt_',
                                    render: (value: any, data: any) => {
                                        const { total_price, pay_total_price, statsionar_room_price_pay, discount_price, client_payment, client_value, discount } = value
                                        // let discount = cashRegDiscount(client_payment?.at(0)?.total_price, client_payment?.at(0)?.discount)
                                        return <NumericFormat displayType="text"
                                            thousandSeparator
                                            decimalScale={2}
                                            value={client_value?.filter((item: any) => +item?.is_active)?.
                                                reduce((a: any, b: any) => a + b.total_price - chegirmaHisobla(b) - b.pay_price, 0)} />
                                    }
                                },
                                {
                                    title: 'Balans',
                                    key: 'current_balance_',

                                    render: (value: any, data: any) => {
                                        const { current_balance } = value ?? { current_balance: { balance: 0 } }
                                        // let discount = cashRegDiscount(client_payment?.at(0)?.total_price, client_payment?.at(0)?.discount)
                                        return <NumericFormat displayType="text"
                                            thousandSeparator
                                            decimalScale={2}
                                            value={current_balance?.balance ?? 0} />
                                    }
                                },
                                {
                                    title: 'Qaytarilgan',
                                    key: 'repet_',
                                    render: (value: any, data: any) => {
                                        const { total_price, pay_total_price, discount_price, client_payment, client_value, discount } = value
                                        // let discount = cashRegDiscount(client_payment?.at(0)?.total_price, client_payment?.at(0)?.discount)
                                        return <NumericFormat displayType="text"
                                            thousandSeparator
                                            decimalScale={2}
                                            value={value?.client_value
                                                ?.reduce((a: any, b: any) => a + +b?.is_active ? 0 : +b.price
                                                    , 0)} />
                                    }
                                },
                                {
                                    title: 'Tolov soni',
                                    key: 'pay_count',
                                    render: (value: any, data: any) => {
                                        const { total_price, pay_total_price, discount_price, client_payment, client_value, discount } = value
                                        // let discount = cashRegDiscount(client_payment?.at(0)?.total_price, client_payment?.at(0)?.discount)
                                        return <NumericFormat displayType="text"
                                            thousandSeparator
                                            decimalScale={2}
                                            value={client_payment?.length} />
                                    }
                                },
                                // {
                                //     title: 'Masul',
                                //     key: 'pay_count',
                                //     render: (value: any, data: any) => {
                                //         const {total_price, pay_total_price, discount_price, client_payment, client_value, discount} = value
                                //         // let discount = cashRegDiscount(client_payment?.at(0)?.total_price, client_payment?.at(0)?.discount)
                                //         return <NumericFormat displayType="text"
                                //             thousandSeparator
                                //             decimalScale={2}
                                //             value={client_payment?.length} />
                                //     }
                                // },


                            ]}
                            dataSource={
                                data?.data
                            }
                        />
                    </div>
                    {/* <br />
                    <Pagination
                        setPageLimit={(e: any) => {
                            // setNumberOfPages(Math.ceil(clientData?.length / e))
                            // setPageLimit(e)
                            dispatch(isClientCurrentPage(1))
                            dispatch(isClientPageLimit(e))
                        }}

                        pageLmit={pageLimit}
                        current={page} total={Math.ceil(clientData?.data?.length / pageLimit)} count={isClientCurrentPage} /> */}
                </div>
                <iframe ref={iframeRef} style={{ display: 'none' }} title="print-frame" />

            </Content>
            <Modal centered={true} isOpen={modal} toggle={toggle} role='dialog' size='xl' backdrop="static" keyboard={false} fullscreen>
                <div className="modal-header">
                    <h1 className="modal-title">
                        To'lovlar
                    </h1>
                </div>
                <div className="modal-body">
                    <div className="card" style={{
                        height: `${window.innerHeight / 1.7}px`,
                        overflow: 'auto'
                    }}>
                        <Table
                            paginationRole={false}
                            top={100}
                            scrollRole={true}
                            extraKeys={[
                                'full_name_',
                                // 'phone_',
                                // 'person_id_',
                                // 'probirka_',
                                'total_price_',
                                'pay_total_price_',
                                'cash_price_',
                                'card_price_',
                                'transfer_price_',
                                'discount_',
                                'debt_',
                                'balance_',
                                'qaytatildi_',
                                'payment_deadline_',
                                // 'client_item_count',
                                'qabul_qildi',
                                'created_at_',
                                'print_',
                            ]}
                            columns={[
                                {
                                    title: '№',
                                    key: 'id',
                                    render: (value: any, data: any) => {
                                        return <div key={data.index} className='d-flex  align-items-center gap-1'>

                                            <span>
                                                {((data?.index + 1))}
                                            </span>
                                        </div>
                                    }
                                },
                                {
                                    title: "F.I.O",
                                    key: 'full_name_',
                                    render: (value: any) => {
                                        return <

                                            >
                                            {fullName(item)}
                                        </>
                                    }
                                },
                                // {
                                //     title: 'Tel',
                                //     key: 'phone_',
                                //     render: (value: any, data: any) => {
                                //         return `+998${value?.phone}`
                                //     }
                                // },
                                // {
                                //     title: 'ID',
                                //     key: 'person_id_',
                                //     render: (value: any, data: any) => {
                                //         return formatId(value?.person_id)
                                //     }
                                // },
                                {
                                    title: 'umumiy tolov',
                                    key: 'total_price_',
                                    render: (value: any, data: any) => {
                                        return <NumericFormat displayType="text"
                                            thousandSeparator
                                            decimalScale={2}
                                            value={(value?.total_price ?? 0)} />
                                    }
                                },
                                {
                                    title: "To'landi",
                                    key: 'pay_total_price_',
                                    render: (value: any, data: any) => {
                                        return <NumericFormat displayType="text"
                                            thousandSeparator
                                            decimalScale={2}
                                            value={(value?.pay_total_price ?? 0)} />
                                    }
                                },

                                {
                                    title: 'Naqd',
                                    key: 'cash_price_',
                                    render: (value: any, data: any) => {
                                        return <NumericFormat displayType="text"
                                            thousandSeparator
                                            decimalScale={2}
                                            value={(value?.cash_price ?? 0)} />
                                    }
                                },
                                {
                                    title: 'Plastik',
                                    key: 'card_price_',
                                    render: (value: any, data: any) => {
                                        return <NumericFormat displayType="text"
                                            thousandSeparator
                                            decimalScale={2}
                                            value={(value?.card_price ?? 0)} />
                                    }
                                },
                                {
                                    title: "O'tkazma",
                                    key: 'transfer_price_',
                                    render: (value: any, data: any) => {
                                        return <NumericFormat displayType="text"
                                            thousandSeparator
                                            decimalScale={2}
                                            value={(value?.transfer_price ?? 0)} />
                                    }
                                },
                                {
                                    title: 'chegirma',
                                    key: 'discount_',
                                    render: (value: any, data: any) => {
                                        return <NumericFormat displayType="text"
                                            thousandSeparator
                                            decimalScale={2}
                                            value={(value?.discount ?? 0)} />
                                    }
                                },
                                {
                                    title: 'qarz',
                                    key: 'debt_',
                                    render: (value: any, data: any) => {
                                        return <b className='text-danger'>
                                            <NumericFormat displayType="text"
                                                thousandSeparator
                                                decimalScale={2}
                                                value={(value?.debt_price ?? 0)} />
                                        </b>
                                    }
                                },
                                {
                                    title: 'Balans',
                                    key: 'balance_',
                                    render: (value: any, data: any) => {
                                        return <b className='text-success'>
                                            <NumericFormat displayType="text"
                                                thousandSeparator
                                                decimalScale={2}
                                                value={(value?.balance ?? 0)} />
                                        </b>
                                    }
                                },
                                {
                                    title: 'Qaytarildi',
                                    key: 'qaytatildi_',
                                    render: (value: any, data: any) => {
                                        return <NumericFormat displayType="text"
                                            thousandSeparator
                                            decimalScale={2}
                                            value={(value?.back_total_price ?? 0)} />
                                    }
                                },
                                {
                                    title: 'qaytarish muddati',
                                    key: 'payment_deadline_',
                                    render: (value: any, data: any) => {
                                        return (value?.payment_deadline ?? '-')
                                    }
                                },
                                {
                                    title: 'Qabul qildi',
                                    key: 'qabul_qildi',
                                    render: (value: any, data: any) => {
                                        return value?.user ? masulRegUchunFullName(value?.user) : '-'
                                    }
                                },
                                // {
                                //     title: 'Xizmatlar',
                                //     key: 'client_item_count',
                                //     render: (value: any, data: any) => {
                                //         return <><NumericFormat displayType="text"
                                //             thousandSeparator
                                //             decimalScale={2}
                                //             value={value?.service_count} /> /0 </>
                                //     }
                                // },
                                {
                                    title: "To'langan vaqti",
                                    key: 'created_at_',
                                    render: (value: any, data: any) => {
                                        return `${getCurrentDateTime(value?.created_at)}`
                                    }
                                },
                                {
                                    title: "Check",
                                    key: 'print_',
                                    render: (value: any) => {
                                        return <button type='button' className='btn btn-sm btn-info'

                                            onClick={() => {
                                                let json = JSON.parse(value?.client_value_id_data ?? "[]")
                                                if (json?.length > 0) {
                                                    generateCheck({
                                                        target: {
                                                            ...item,
                                                            client_value: item?.client_value?.filter((res: any) => new Set(json).has(res?.id)),
                                                        },
                                                        iframeRef: iframeRef,
                                                        name: user?.owner?.name
                                                    })
                                                }

                                            }}>
                                            <FaPrint />
                                        </button>
                                    }

                                },

                            ]}
                            dataSource={
                                item?.client_payment
                            }
                        />
                    </div>
                </div>
                <div className="modal-footer">
                    <button className='btn btn-danger' onClick={toggle}>Ortga</button>
                </div>
            </Modal>
        </>
    )
}

export default ClientPaymentTableStationar