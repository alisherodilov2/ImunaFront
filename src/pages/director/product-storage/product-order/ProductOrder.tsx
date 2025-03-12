import React, { useEffect, useState } from 'react'
import Layout from '../../../../layout/Layout'
import Navbar from '../../../../layout/Navbar'
import Table from '../../../../componets/table/Table'
import Input from '../../../../componets/inputs/Input'
import Pagination from '../../../../componets/pagination/Pagination'
import ProductOrderAdd from './ProductOrderAdd'
import { useDispatch, useSelector } from 'react-redux'
import { ReducerType } from '../../../../interface/interface'
import { isProductOrderDelete, isProductOrderGet, isProductOrderCurrentPage, isProductOrderPageLimit, isProductOrderEdit } from '../../../../service/reducer/ProductOrderReducer'
import { AppDispatch } from '../../../../service/store/store'
import Swal from 'sweetalert2'
import Content from '../../../../layout/Content'
import { isFindFunction } from '../../../../service/reducer/MenuReducer'
import { NumericFormat } from 'react-number-format'
import { query } from '../../../../componets/api/Query'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { IoMdSettings } from 'react-icons/io'
import Select from 'react-select';
import ProductStorageHeader from '../ProductStorageHeader'
import { isProductGet } from '../../../../service/reducer/ProductReducer'
import { dateFormat } from '../../../../service/helper/day'
import { MdDeleteForever } from 'react-icons/md'
import { AiFillEdit } from 'react-icons/ai'
import ProductOrderShow from './ProductOrderShow'

const ProductOrder = () => {
    const [modal, setModal] = useState(false)
    const [modal2, setModal2] = useState(false)
    const [item, setItem] = useState({} as any)
    const [item2, setItem2] = useState({} as any)
    const path = useNavigate()
    const dataSelect = (data: any) => {
        if (data?.length > 0) {
            return data?.map((item: any) => {
                return {
                    value: item?.id, label: item?.name,
                    data: item
                }
            })
        }
        return []
    }
    const { page, productOrderData, massage, isLoading, isSuccess, pageLimit } = useSelector((state: ReducerType) => state.ProductOrderReducer)
    // const [pageLmit, setPageLimit] = useState(() => 5)
    const [numberOfPages, setNumberOfPages] = useState(Math.ceil(productOrderData?.length / pageLimit))
    useEffect(() => {
    }, [numberOfPages])
    const show = async (id: any, status?: any) => {
        try {
            setLoad(() => true)
            let res = await axios.get(`/productOrder/${id}?status=${status ?? ''}`)
            const { result } = res.data
            setModal2(() => true)
            setItem2(() => result)
        }
        finally {
            setLoad(() => false)

        }
    }
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
                dispatch(isProductOrderDelete({ all: [...new Set(checkData?.map((idAll: any) => idAll?.id))] }))
                setCheckData([])
                setCheckAll(() => false)
            }
        })
        // dispatch(deletedispatchFunction(id))

    }
    const [serachText, setSerachText] = useState('')
    const [load, setLoad] = useState(false)
    const orderShow = async (id: any) => {
        try {
            setLoad(() => true)
            let res = await axios.get('/order-show?productOrder_id=' + id)
            const { result } = res.data
            setItem2(() => result)
            console.log(result);

            // setModal2(() => true)
        } catch (error) {

        } finally {
            setLoad(() => false)
        }
    }
    const filter = (data: any, serachData: any) => {
        let response = data as any;
        if (serachData?.name?.trim()?.length > 0) {
            response = response.filter((item: any) => item?.name?.toLowerCase().includes(serachData?.name?.toLowerCase()))
        }
        if (+serachData?.productOrder_category_id?.value > 0) {
            response = response?.filter((item: any) => item?.prodcut_category
                ?.id === serachData?.productOrder_category_id?.value)
        }
        return response

        // if (serachData?.length > 0) {
        //     return (data.filter((item: any) => (item?.name?.toString().toLowerCase().includes(serachData) || item?.phone?.toString().toLowerCase().includes(serachData)) || item?.target_adress?.toString().toLowerCase().includes(serachData) || item?.address?.toString().toLowerCase().includes(serachData)))
        // } else
        //     return (data)
    }
    const [checkAll, setCheckAll] = useState(false)
    useEffect(() => {
        dispatch(isProductOrderGet(''))
        dispatch(isProductGet(''))

    }, [])
    const [search, setSearch] = useState({
        name: '',
        productOrder_category_id: {
            label: 'Barchasi',
            value: 0
        },
    } as any)
    const { user } = useSelector((state: ReducerType) => state.ProfileReducer)
    const [showModal, setShowModal] = useState(false)
    const [showItem, setShowItem] = useState({} as any)
    const orderStatus = (data: any) => {
        if (data?.status === 'order_placed') {
            return <button className='btn btn-sm btn-secondary'

                onClick={() => {
                    // dispatch(isProductOrderEdit({ query: query({ status: 'processing' }), id: data?.id }))
                }}
            >Buyurtma berildi</button>
        }
        if (data?.status === 'processing') {
            return <button className='btn btn-sm btn-warning'>Yigilyabdi</button>
        }
        if (data?.status === 'shipped') {
            return <button className='btn btn-sm btn-info'
                onClick={() => {
                    dispatch(isProductOrderEdit({ query: query({ status: 'order_accepted' }), id: data?.id }))
                }}
            >Qabul qilish</button>
        }
        return <button className='btn btn-sm btn-success'>Yakunlandi</button>
    }
    return (
        <Content >
            <Navbar />
            <div className="container-fluid flex-grow-1 container-p-y size_16 ">
                <ProductStorageHeader />
                <div className="d-flex my-2 gap-3">
                    <div className="row w-100">
                        <div className="col-4">
                            <Input placeholder='Izlash...' onChange={(e: any) => {
                                setSearch({
                                    ...search,
                                    name: e.target.value
                                })

                            }}
                                value={search.name}
                            />
                        </div>
                        {/* <div className="col-4">
                            <Select
                                name='name3'
                                value={search?.productOrder_category_id}
                                onChange={(e: any) => {

                                    setSearch(() => {
                                        return {
                                            ...search,
                                            productOrder_category_id: e
                                        }
                                    })


                                }}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                // value={userBranch}
                                options={
                                    [
                                        {
                                            label: 'Barchasi',
                                            value: 0
                                        },
                                        ...dataSelect(productOrderCategoryData)
                                    ]
                                } />
                        </div> */}
                    </div>
                    <div className='d-flex justify-content-center align-items-center gap-1'>
                        {
                            checkData?.length > 0 ?
                                <button className="btn btn-danger " type="button" onClick={() => {
                                    deleteAll()
                                }}>O'chirish</button> : ''
                        }
                        <button className={`btn btn-primary `} type="button" onClick={() => {
                            setModal(true)
                            setItem(() => { })
                        }}>Buyurtma</button>
                    </div>
                </div>
                <div className="card" style={{
                    height: `${window.innerHeight / 1.7}px`,
                    overflow: 'auto'
                }}>
                    <Table
                        page={page}
                        //  exportFile={true}
                        //  importFile={true}

                        deletedispatchFunction={isProductOrderDelete}
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
                            dispatch(isProductOrderGet(''))
                        }}
                        top={100}
                        scrollRole={true}
                        showFunction={(e: any) => {
                            path('/service-type/' + e?.id)
                        }}
                        allCheckId={user?.role == 'reception' ? '' : 'id'}
                        allCheckRoleFun={
                            (e: any) => {
                                return <>
                                    {" "}
                                    <input className="form-check-input" type="checkbox" onChange={(e: any) => {
                                        const target = !checkAll
                                        setCheckAll(() => target)
                                        if (target) {
                                            setCheckData(() => productOrderData)
                                        } else {
                                            setCheckData(() => [])
                                        }
                                    }} checked={checkAll} />
                                    {" "}

                                </>
                            }
                        }
                        limit={pageLimit}
                        extraKeys={['sana', 'statuss', 'amallar']}
                        columns={[
                            {
                                title: '№',
                                key: 'id',
                                render: (value: any, data: any) => {
                                    return <div key={data.index} className='d-flex  align-items-center gap-1'>

                                        {
                                            user?.role == 'reception' ? '' :
                                                <input className="form-check-input" type="checkbox" id="defaultCheck3" value={value} onChange={() => {
                                                    setCheckData(checkFun(data))
                                                }} checked={checkData?.find((item: any) => item?.id == value)} />
                                        }
                                        <span>
                                            {((data?.index + 1) + (page * pageLimit) - pageLimit)}
                                        </span>
                                    </div>
                                }
                            },
                            {
                                title: 'Sana',
                                key: 'sana',
                                renderItem: (value: any, data: any) => {
                                    return <td
                                        onClick={() => {
                                            setShowModal(true)
                                            setShowItem(() => value)
                                            // show(data.id)
                                        }}
                                    >
                                        {dateFormat(value?.created_at)}
                                    </td>
                                }
                            },
                            {
                                title: 'Holati',
                                key: 'statuss',
                                renderItem: (value: any, data: any) => {
                                    return <td
                                        onClick={() => {
                                            // show(data.id)
                                        }}
                                    >
                                        {orderStatus(value)}
                                    </td>
                                }
                            },

                            {
                                title: 'Amallar',
                                key: 'amallar',
                                renderItem: (value: any, data: any) => {
                                    return <td
                                        onClick={() => {
                                            show(data.id)
                                        }}
                                    >
                                        <button onClick={() => {
                                            // dispatch(isFindFunction(item))
                                            // localEditFunction(item)
                                            setModal(true)
                                            setItem(() => data)

                                        }} className='btn btn-primary btn-sm'
                                            disabled={value?.status == 'order_placed' ? false : true}
                                        >
                                            <AiFillEdit />
                                        </button>
                                        <button type='button' className='btn btn-sm btn-danger'
                                            disabled={value?.status == 'order_placed' ? false : true}
                                            onClick={() => {
                                                Swal.fire({
                                                    title: "Ma'lumotni o'chirasizmi?",
                                                    showDenyButton: true,
                                                    showCancelButton: true,
                                                    confirmButtonText: 'Ha',
                                                    denyButtonText: `Yo'q`,
                                                }).then((result) => {
                                                    if (result.isConfirmed) {
                                                        dispatch(isProductOrderDelete({ id: data?.id }))
                                                    }
                                                })
                                            }}>
                                            <MdDeleteForever />
                                        </button>
                                    </td>
                                }
                            },



                        ]}
                        dataSource={
                            filter(productOrderData, search)
                        }
                    />
                </div>
                <br />
                <Pagination
                    setPageLimit={(e: any) => {
                        // setNumberOfPages(Math.ceil(productOrderData?.length / e))
                        // setPageLimit(e)
                        dispatch(isProductOrderCurrentPage(1))
                        dispatch(isProductOrderPageLimit(e))
                    }}

                    pageLmit={pageLimit}
                    current={page} total={Math.ceil(productOrderData?.length / pageLimit)} count={isProductOrderCurrentPage} />
            </div>

            <ProductOrderAdd
                modal={modal} setModal={setModal}
                setData={setItem} data={item} />
            <ProductOrderShow
                modal={showModal} setModal={setShowModal}
                data={showItem} />

        </Content>
    )
}

export default ProductOrder