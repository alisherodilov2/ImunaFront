import React, { useEffect, useState } from 'react'
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
import { isClientAddExcelFile, isClientCurrentPage, isClientDelete, isClientGet, isClientPageLimit } from '../../../service/reducer/ClientReducer'
import { isDepartmentGet } from '../../../service/reducer/DepartmentReducer'
import { exportToExcel } from '../../../helper/exportToExcel'
import { isServiceTypeGet } from '../../../service/reducer/ServiceTypeReducer'
import { isServiceGet } from '../../../service/reducer/ServiceReducer'
import { fullName } from '../../../helper/fullName'
import { MdContentCopy } from 'react-icons/md'
import { IoMdRepeat } from 'react-icons/io'
import CashRegister from '../../cash_register/CashRegister'
import { formatId } from '../../../helper/idGenerate'
import { getCurrentDateTime } from '../../../helper/dateFormat'
import { cashRegDiscount } from '../../../helper/cashRegCalc'
import { isGraphGet } from '../../../service/reducer/GraphReducer'
import { BiCalendarCheck } from 'react-icons/bi'
import { AiFillEdit } from 'react-icons/ai'
import { FaRegPlusSquare } from 'react-icons/fa'
import { generateCheck } from '../../../helper/generateCheck'
import { chegirmaHisobla } from '../../../helper/cashRegHelper'
const Payment = () => {
    const dataSelect = (data: any) => {
        let res = [...data].sort((a: any, b: any) => b.id - a.id);
        return res?.map((item: any) => {
            return {
                value: item?.id, label: item?.name || item?.type,
                data: item
            }
        })
    }
    const { departmentData, } = useSelector((state: ReducerType) => state.DepartmentReducer)
    const [modal, setModal] = useState(false)
    const [modaledit, setModaledit] = useState(false)
    const [modal2, setModal2] = useState(false)
    const [modal3, setModal3] = useState(false)
    const [item, setItem] = useState({} as any)
    const { user } = useSelector((state: ReducerType) => state.ProfileReducer)
    const [item2, setItem2] = useState({} as any)
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

    const allShow = async (id: any) => {
        try {
            setLoad(() => true)
            let res = await axios.get('/client?show_person_id=' + id)
            const { result } = res.data
            setItem({})
            setModaledit(true)
            setItem(() => {
                return {

                    ...result
                }
            })
            setItem(() => result)
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
        // if ((department_id && +department_id > 0) && (clienttype_id && +clienttype_id > 0)) {
        //     dispatch(isClientGet(`?department_id=${department_id}&clienttype_id=${clienttype_id}`))
        // } else {
        //     dispatch(isClientGet(''))
        // }
        // dispatch(isServiceGet(''))
        // dispatch(isGraphGet(''))
        // dispatch(isDepartmentGet(''))
        dispatch(isClientGet('?is_payment=1'))

    }, [clienttype_id, department_id])
    const [cash, setCash] = useState(false)
    return (
        <Content loading={load} >
            <Navbar />
            <div className="container-fluid flex-grow-1 py-1 size_16 ">
                <div className="d-flex my-1 gap-3">
                    <form className='row w-100'>
                        <div className="col-2">
                            <Input type='date' onChange={(e: any) => {
                                let value = e.target.value
                                if (value && value.length > 0) {
                                    dispatch(isClientGet(`?start_date=${value}&end_date=${clientData?.end_date}`))
                                }
                            }}
                                value={clientData?.start_date}
                            />
                        </div>
                        <div className="col-2">
                            <Input type='date' min={clientData?.start_date} onChange={(e: any) => {
                                let value = e.target.value
                                if (value && value.length > 0) {
                                    dispatch(isClientGet(`?start_date=${clientData?.start_date}&end_date=${value}`))
                                }
                            }}
                                value={clientData?.end_date}
                            />
                        </div>
                        <div className="col-3">
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
                        <div className="col-2">
                            <Input placeholder='Telefon Izlash...' onChange={(e: any) => {
                                setSearch((res: any) => {
                                    return {
                                        ...res,
                                        phone: e.target.value?.trim().toLowerCase()
                                    }
                                })

                            }}
                                onKeyDown={
                                    (e: any) => {
                                        if (e.key === 'Enter' && e.target.value?.trim().length > 0) {
                                            dispatch(isClientGet(`?start_date=${clientData?.start_date}&end_date=${clientData?.end_date}&phone=${e.target.value?.trim().toLowerCase()}`))
                                        }
                                    }
                                }
                                value={search?.phone}
                            />
                        </div>
                        <div className="col-1">
                            <Input placeholder='ID Izlash...' onChange={(e: any) => {
                                setSearch((res: any) => {
                                    return {
                                        ...res,
                                        person_id: e.target.value?.trim().toLowerCase()
                                    }
                                })
                            }}
                                onKeyDown={
                                    (e: any) => {
                                        if (e.key === 'Enter' && e.target.value?.trim().length > 0) {
                                            dispatch(isClientGet(`?start_date=${clientData?.start_date}&end_date=${clientData?.end_date}&person_id=${e.target.value?.trim().toLowerCase()}`))
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
                        <div className="col-2">
                            <Input type='date' onChange={(e: any) => {
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
                                            dispatch(isClientGet(`?start_date=${clientData?.start_date}&end_date=${clientData?.end_date}&data_birth=${e.target.value?.trim().toLowerCase()}`))
                                        }
                                    }
                                }
                                value={search?.data_birth}
                            />
                        </div>
                    </form>
                    <div className='d-flex justify-content-center align-items-center gap-1'>
                        {
                            checkData?.length > 0 ?
                                <button className="btn btn-danger " type="button" onClick={() => {
                                    deleteAll()
                                }}>O'chirish</button> : ''
                        }
                        <button className="btn btn-primary " type="button" onClick={() => {
                            setModal(true)
                            setItem(() => {
                                return {
                                    reset: true
                                }
                            })
                        }}>izlash</button>
                        {/* <button className='btn btn-success btn-sm'
                            onClick={() => {
                                setModal3(true)
                                setItem(() => {
                                    return {
                                        reset: false,
                                    }
                                })
                            }}
                        >
                            <BiCalendarCheck size={24} />
                        </button> */}
                    </div>
                </div>
                <div className="card" style={{
                    height: `${window.innerHeight / 1.4}px`,
                    overflow: 'auto'
                }}>
                    <Table


                        page={page}

                        deletedispatchFunction={isClientDelete}
                        setNumberOfPages={setNumberOfPages}
                        paginationRole={true}
                        localEditFunction={(e: any) => {
                            setItem(() => e?.client_item?.at(-1))

                            setModal(true)
                        }}
                        errorMassage={massage}
                        isLoading={isLoading}
                        isSuccess={isSuccess}
                        reloadData={true}
                        reloadDataFunction={() => {
                            dispatch(isClientGet('?is_payment=1'))
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
                        extraButtonRole={true}
                        extraButton={(item: any) => {
                            return <>
                              
                                <button className='btn btn-warning btn-sm'
                                    onClick={() => {
                                        // payShow(item?.client_item?.at(-1)?.id)
                                        setCash(() => true)
                                        setItem(() => { })
                                        setItem(() => {
                                            return {
                                                ...item?.client_item?.at(-1),
                                                pay_type: '',
                                                reset_: true

                                            }
                                        })
                                    }}
                                >
                                    tolov
                                </button>
                             
                                {/* <button className='btn btn-success btn-sm'
                                    onClick={() => {
                                        const {
                                            first_name, last_name, phone, person_id, data_birth, citizenship, sex
                                        } = item?.client_item?.at(-1)
                                        setModal3(true)
                                        setItem(() => {
                                            return {
                                                first_name: first_name,
                                                last_name: last_name,
                                                phone: phone,
                                                person_id: person_id,
                                                data_birth: data_birth,
                                                citizenship: citizenship
                                                , sex: sex
                                            }
                                        })
                                    }}
                                >
                                    <BiCalendarCheck size={24} />
                                </button>
                                <button className='btn btn-warning btn-sm'
                                    onClick={() => {
                                        payShow(item?.client_item?.at(-1)?.id)
                                        // setCash(true)
                                        // setItem(() => {
                                        //     return {
                                        //         ...item?.client_item?.at(-1),
                                        //         id: 0
                                        //     }
                                        // })
                                    }}
                                >
                                    tolov
                                </button>
                                <button className='btn btn-warning btn-sm'
                                    onClick={() => {
                                        setModal(true)
                                        setItem(() => {
                                            return {
                                                ...item?.client_item?.at(-1),
                                                id: 0
                                            }
                                        })
                                    }}
                                >
                                    <IoMdRepeat size={24} />
                                </button> */}
                            </>
                        }}
                        extraKeys={[
                            'full_name',
                            'phone_',
                            'data_birth_',
                            'person_id_',
                            // 'probirka_',
                            'total_price',
                            // kassa
                            'pay_total_price',
                            'discount_price',
                            'debt_price',
                            'qaytarilgan',
                            // 'client_item_count',
                            // 'welcome_count_',
                            'created_at_'
                        ]}
                        columns={[
                            {
                                title: '№',
                                key: 'id',
                                renderItem: (value: any, data: any) => {
                                    const {  is_pay, service_count, client_payment,client_item,client_value } = data?.client_item?.at(-1) ?? {}
                                    let pay_total_price = client_value?.reduce((a: any, b: any) => a + +b.pay_price, 0) as any
                                   
                                    let result = pay_total_price;
                                 
                                    let discount_price = client_value?.reduce((a: any, b: any) => a + (+b?.is_active ? chegirmaHisobla(b) : 0), 0)
                                    
                                    let total_price = client_value?.reduce((a: any, b: any) => a + (+b.is_active ? +b.total_price: 0), 0)
                                    let qaytarilyapdi = client_value?.reduce((a: any, b: any) => a + (+b?.is_active  ? 0 : +(b.total_price - chegirmaHisobla(b))), 0)

                                    if (discount_price == pay_total_price && discount_price == total_price - pay_total_price) {
                                        result = 0
                                    } else {
                                        result = total_price - pay_total_price
                                    }
                                    if(qaytarilyapdi>0 && pay_total_price==0){
                                        result = 1
                                    }
                                    return <td key={data.index} className={` p-1  ${+is_pay ?  ((result == 0 ? 'bg-success text-white' : 'bg-danger text-white')) : 'bg-warning text-white'}  h-100`}>
                                        <span>
                                            {((data?.index + 1) + (page * pageLimit) - pageLimit)}
                                        </span>
                                    </td>
                                }
                            },
                            {
                                title: "F.I.O",
                                key: 'full_name',
                                render: (value: any, data: any) => {
                                    return <button className='btn ' onClick={() => {
                                        allShow(value?.person_id)
                                    }}>
                                        <b>{fullName(value)}</b>
                                    </button>
                                }
                            },
                            {
                                title: 'Tel',
                                key: 'phone_',
                                render: (value: any, data: any) => {
                                    return `+998${value?.client_item.at(-1).phone}`
                                }
                            },
                            {
                                title: 'Tugilgan sana',
                                key: 'data_birth_',
                                render: (value: any, data: any) => {
                                    return value?.client_item.at(-1).data_birth
                                }
                            },
                            {
                                title: 'ID',
                                key: 'person_id_',
                                render: (value: any, data: any) => {
                                    return formatId(value?.person_id)
                                }
                            },
                            // {
                            //     title: 'Probirka',
                            //     key: 'probirka_',
                            //     render: (value: any, data: any) => {
                            //         return <NumericFormat displayType="text"
                            //             thousandSeparator
                            //             decimalScale={2}
                            //             value={value?.client_item?.at(-1)?.probirka_count || 0} />
                            //     }
                            // },
                            {
                                title: " Summa",
                                key: 'total_price',
                                render: (value: any, data: any) => {
                                    let jami1 = value?.client_item?.at(0)?.client_value?.reduce((a: any, b: any) => a + (+b.is_active ? +b.total_price: 0), 0)
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={jami1?? 0} />
                                }
                            },
                            {
                                title: "To'langan",
                                key: 'pay_total_price',
                                render: (value: any, data: any) => {
                                  
                                    let toladi = value?.client_item?.at(0)?.client_value?.reduce((a: any, b: any) => a + +b.pay_price, 0) as any
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={toladi } />
                                }
                            },
                            {
                                title: 'Chegirma',
                                key: 'discount_price',
                                render: (value: any, data: any) => {
                                    const { total_price, pay_total_price, discount_price, client_payment,client_value,discount } = value?.client_item?.at(-1)
                                    // let discount = cashRegDiscount(client_payment?.at(0)?.total_price, client_payment?.at(0)?.discount)
                                    let jami1 = value?.client_item?.at(0)?.client_value?.reduce((a: any, b: any) => a + (+b?.is_active ? chegirmaHisobla(b) : 0), 0)
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={jami1} />
                                }
                            },
                            {
                                title: 'Qarz',
                                key: 'debt_price',
                                render: (value: any, data: any) => {
                                    const { total_price, pay_total_price, discount_price,client_value, client_payment } = value?.client_item?.at(-1)
                                    let toladi = client_value?.reduce((a: any, b: any) => a + +b.pay_price, 0) as any
                                    let jami = client_value?.reduce((a: any, b: any) => a + (+b.is_active ? +b.total_price - (chegirmaHisobla(b)) : 0), 0) as any
                                    console.log('client_payment', client_payment);
                                    let result = pay_total_price;
                                    let discount = cashRegDiscount(client_payment?.at(0)?.total_price, client_payment?.at(0)?.discount)
                                    // let discount = cashRegDiscount(total_price, discount_price)
                                    if (discount == pay_total_price && discount == total_price - pay_total_price) {
                                        result = 0
                                    } else {
                                        result = total_price - pay_total_price
                                    }
                                    let tolangan = client_value?.reduce((a: any, b: any) => a + (+b?.is_active  ?  +b.total_price - +b.pay_price : 0), 0)
                                  

                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={jami-toladi} />
                                }
                            },
                            {
                                title: 'Qaytarilgan',
                                key: 'qaytarilgan',

                                render: (value: any, data: any) => {

                                    const { total_price, pay_total_price, discount_price, client_payment, client_value,back_total_price } = value?.client_item?.at(-1)
                                    let qaytarilyapdi = client_value?.reduce((a: any, b: any) => a + (+b?.is_active  ? 0 : +(b.total_price - chegirmaHisobla(b))), 0)



                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={qaytarilyapdi} />
                                }
                            },
                            {
                                title: 'Kelgan vaqti',
                                key: 'created_at_',
                                render: (value: any, data: any) => {
                                    return `${getCurrentDateTime(value?.client_item.at(-1).created_at)}`
                                }

                            },

                        ]}
                        dataSource={
                            filter(clientData?.data, search)
                        }
                    />
                </div>
                <br />
                <Pagination
                    setPageLimit={(e: any) => {
                        // setNumberOfPages(Math.ceil(clientData?.length / e))
                        // setPageLimit(e)
                        dispatch(isClientCurrentPage(1))
                        dispatch(isClientPageLimit(e))
                    }}

                    pageLmit={pageLimit}
                    current={page} total={Math.ceil(clientData?.data?.length / pageLimit)} count={isClientCurrentPage} />
            </div>
            <CashRegister
                modal={cash} setModal={setCash}
                data={item} setData={setItem} />
            
        </Content>
    )
}

export default Payment