import React, { useEffect, useState } from 'react'
import Layout from '../../../layout/Layout'
import Navbar from '../../../layout/Navbar'
import Table from '../../../componets/table/Table'
import Input from '../../../componets/inputs/Input'
import Pagination from '../../../componets/pagination/Pagination'
import uploadFileIcon from '../../../assets/upload-file.svg'
import UsersAdd from './UsersAdd'
import { useDispatch, useSelector } from 'react-redux'
import { ReducerType } from '../../../interface/interface'
import { isUsersDelete, isUsersGet, isUsersCurrentPage, isUsersPageLimit, isUsersEdit } from '../../../service/reducer/UserReducer';
import { AppDispatch } from '../../../service/store/store'
import Swal from 'sweetalert2'
import Content from '../../../layout/Content'
import { isFindFunction } from '../../../service/reducer/MenuReducer'
import { NumericFormat } from 'react-number-format'
import { query } from '../../../componets/api/Query'
import axios from 'axios'
import { domain } from '../../../main'
import Select from 'react-select';
import { isDepartmentGet } from '../../../service/reducer/DepartmentReducer'
import { IoMdSettings } from 'react-icons/io'
import UserSetting from './UserSetting'
import { isTemplateGet } from '../../../service/reducer/TemplateReducer'
import UserSettingCounterparty from './UserSettingCounterparty'
import { isServiceGet } from '../../../service/reducer/ServiceReducer'
// import { UsersOrderShow } from './UsersOrderShow'
export const user_role = [
    {
        value: 'reception',
        label: 'Qabulxona'
    },
    {
        value: 'cash_register',
        label: 'Kassa'
    },
    {
        value: 'doctor',
        label: 'Shifokor'
    },
    {
        value: 'laboratory',
        label: 'Laborotoriya'
    },
    {
        value: 'queue',
        label: 'Navbat'
    },
    {
        value: 'counterparty',
        label: 'Kontragent'
    },
    {
        value: 'pharmacy',
        label: 'Dorixona'
    },
]
export const UsersData = () => {
    const [selectData, setSelectData] = useState({
        customer: {
            value: '',
            label: ''
        },
        customer_target: {
            value: '',
            label: ''
        },
        branch: {
            value: '',
            label: ''
        },
        status: {
            value: 'all', label: "Barchasi"
        },
        payment_type: {
            label: "To'lov turlari ",
            value: 'all'
        },
    } as any)
    const [modal, setModal] = useState(false)
    const [modal2, setModal2] = useState(false)
    const [modal3, setModal3] = useState(false)
    const [item, setItem] = useState({} as any)
    const [item2, setItem2] = useState({} as any)
    const { page, usersData, massage, isLoading, isSuccess, pageLimit } = useSelector((state: ReducerType) => state.UserReducer)
    // const [pageLmit, setPageLimit] = useState(() => 5)
    const [numberOfPages, setNumberOfPages] = useState(Math.ceil(usersData?.length / pageLimit))
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
                dispatch(isUsersDelete({ all: [...new Set(checkData?.map((idAll: any) => idAll?.id))] }))
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
            let res = await axios.get('/order-show?users_id=' + id)
            const { result } = res.data
            setItem2(() => result)
            console.log(result);

            setModal2(() => true)
        } catch (error) {

        } finally {
            setLoad(() => false)
        }
    }
    const [search, setSearch] = useState({
        text: '',
        role: {
            value: 'all',
            label: 'Barchasi'
        }
    } as any)
    const filter = (data: any, serachData: any) => {
        if (serachData?.role?.value === 'all' && serachData.text === '') {
            return data
        }
        if (serachData?.role?.value !== 'all' && serachData.text === '') {
            return data.filter((item: any) => item.role === serachData.role?.value)
        }
        if (serachData.role?.value === 'all' && serachData.text.length > 0) {
            return data.filter((item: any) => ((item?.full_name)?.toString().toLowerCase().includes(serachData.text) || item?.name?.toString().toLowerCase().includes(serachData.text)))
        }
        if (serachData.role?.value !== 'all' && serachData.text.length > 0) {
            return data.filter((item: any) => item.role === serachData.role?.value && ((item?.full_name)?.toString().toLowerCase().includes(serachData.text) || item?.name?.toString().toLowerCase().includes(serachData.text)))
        }

    }

    useEffect(() => {
        dispatch(isUsersGet(''))
        dispatch(isDepartmentGet(''))
        dispatch(isServiceGet(''))
    }, [])

    return (
        <Content loading={load}>
            <Navbar />
            <div className="container-fluid flex-grow-1 container-p-y size_16 ">
                <div className="d-flex my-2 gap-3">
                    <form className='w-100 d-flex gap-3'>
                        <div className="w-50">
                            <Select
                                name='name'
                                value={search?.role}
                                onChange={(e: any) => {
                                    setSearch((res: any) => {
                                        return {
                                            ...res,
                                            role: e
                                        }
                                    })
                                }}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                options={
                                    [
                                        {
                                            label: 'Hammasi',
                                            value: 'all'
                                        },
                                        ...user_role
                                    ]
                                } />
                        </div>
                        <div className="w-50">

                            <Input placeholder='Izlash...' onChange={(e: any) => {
                                setSearch((res: any) => {
                                    return {
                                        ...res,
                                        text: e.target.value?.trim().toLowerCase()
                                    }
                                })
                            }}
                                value={search?.text}
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
                            setItem(() => { })
                        }}>Qoshish</button>
                    </div>
                </div>
                <div className="card" style={{
                    height: `${window.innerHeight / 1.7}px`,
                    overflow: 'auto'
                }}>
                    <Table
                        page={page}
                        extraButton={((item: any) => {
                            return item.role == 'doctor' || item.role == 'counterparty' ? <button className='btn btn-warning btn-sm'
                                onClick={() => {
                                    if (item.role == 'doctor') {
                                        setModal2((prev: any) => true)
                                    } else {
                                        setModal3((prev: any) => true)
                                    }
                                    setItem(() => item)
                                }}>
                                <IoMdSettings />
                            </button> : ''
                        })}
                        //  exportFile={true}
                        //  importFile={true}
                        deletedispatchFunction={isUsersDelete}
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
                            dispatch(isUsersGet(''))
                        }}
                        top={100}
                        scrollRole={true}
                        editRole={true}
                        deleteRole={true}
                        limit={pageLimit}
                        // extraKeys={['jarayon']}
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
                                title: 'Xizmat turi',
                                key: 'role',
                                render: (value: any, data: any) => {
                                    return user_role?.find((item: any) => item?.value == value)?.label
                                }
                            },

                            {
                                title: 'Ixtisosligi	',
                                key: 'department',
                                render: (value: any, data: any) => {
                                    return <button className='btn btn-sm'
                                        onClick={() => {
                                            // orderShow(data.id)
                                        }}
                                    >
                                        {value?.name ?? '-'}
                                    </button>
                                }
                            },
                            {
                                title: 'F.I.Sh	',
                                key: 'name',
                                render: (value: any, data: any) => {
                                    return <button className='btn btn-sm'
                                        onClick={() => {
                                            // orderShow(data.id)
                                        }}
                                    >
                                        {`${data?.full_name ?? ''} ${data?.name ?? ''}`}
                                    </button>
                                }
                            },

                            {
                                title: 'tel	',
                                key: 'user_phone',
                                render: (value: any, data: any) => {
                                    return '+998' + value || ''
                                }
                            },
                        ]}
                        dataSource={
                            filter(usersData, search)
                        }
                    />
                </div>
                <br />
                <Pagination
                    setPageLimit={(e: any) => {
                        // setNumberOfPages(Math.ceil(usersData?.length / e))
                        // setPageLimit(e)
                        dispatch(isUsersCurrentPage(1))
                        dispatch(isUsersPageLimit(e))
                    }}

                    pageLmit={pageLimit}
                    current={page} total={Math.ceil(usersData?.length / pageLimit)} count={isUsersCurrentPage} />
            </div>

            <UsersAdd
                modal={modal} setModal={setModal}
                setData={setItem} data={item} />
            <UserSetting
                modal={modal2} setModal={setModal2}
                setData={setItem} data={item} />
            <UserSettingCounterparty
                modal={modal3} setModal={setModal3}
                setData={setItem} data={item} />
        </Content>
    )
}

// export default UsersData