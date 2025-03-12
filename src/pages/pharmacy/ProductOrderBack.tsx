import React, { useEffect, useState } from 'react'
import Layout from '../../layout/Layout'
import Navbar from '../../layout/Navbar'
import Table from '../../componets/table/Table'
import Input from '../../componets/inputs/Input'
import Pagination from '../../componets/pagination/Pagination'
import { useDispatch, useSelector } from 'react-redux'
import { ReducerType } from '../../interface/interface'
import { isProductOrderDelete, isProductOrderGet, isProductOrderCurrentPage, isProductOrderPageLimit, isProductOrderEdit, isEditProductOrder } from '../../service/reducer/ProductOrderReducer'
import { AppDispatch } from '../../service/store/store'
import Swal from 'sweetalert2'
import Content from '../../layout/Content'
import { isFindFunction } from '../../service/reducer/MenuReducer'
import { NumericFormat } from 'react-number-format'
import { query } from '../../componets/api/Query'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { IoMdSettings } from 'react-icons/io'
import Select from 'react-select';
import { isProductGet } from '../../service/reducer/ProductReducer'
import { dateFormat } from '../../service/helper/day'
import PharmacyOrderShow from './PharmacyOrderShow'
import { getCurrentDateTime } from '../../helper/dateFormat'

const ProductOrderBack = () => {
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
    const [data, setData] = useState({
        data: []
    } as any)
    const getData = async (data: any) => {
        try {
            setLoad(() => true)
            let res = await axios.get(`/product-order-back?status=${data?.status?.value ?? ''}&start_date=${data?.start_date ?? ''}&end_date=${data?.end_date ?? ''}&product_id=${data?.prodcut?.value ?? ''}`)
            const { result } = res.data
            setItem2(() => result)
            console.log(result);
            setData(() => result)
            // setModal2(() => true)
        } catch (error) {

        } finally {
            setLoad(() => false)
        }
    }
    const edit = async (id: any) => {
        try {
            setLoad(() => true)
            let res = await axios.post(`/product-order-back/${id}?status=finish`)
            const { result } = res.data
            setItem2(() => result)
            console.log(result);
            setData(() => {
                return {
                    data: data?.data?.map((item: any) => item?.id === result?.id ? result : item)
                }
            })
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
        // dispatch(isProductOrderGet(''))
        // dispatch(isProductGet(''))
        getData({
            status: {
                value: 'start'
            }
        })
        dispatch(isProductGet(''))
    }, [])
    const [search, setSearch] = useState({
        name: '',
        status: {
            label: 'Yakunlanmagan',
            value: 'start'
        },
    } as any)
    const { user } = useSelector((state: ReducerType) => state.ProfileReducer)
    const orderStatus = (data: any) => {
        if (data?.status === 'start') {
            return <button className='btn btn-sm btn-secondary'

                onClick={() => {
                    // setItem(() => data)
                    // setModal(true)
                    edit(data.id)
                    // dispatch(isProductOrderEdit({ query: query({ status: 'processing' }), id: data?.id }))
                }}
            >Tasdiqlash</button>
        }
        return <button className='btn btn-sm btn-success' >Yakunlandi</button>
    }
    const typeStatus = (data: any) => {
        if (data?.type === 'expired') {
            return <button className='btn btn-sm btn-secondary'
            >Mudati o'tgan</button>
        }
        if (data?.type === 'unusable') {
            return <button className='btn btn-sm btn-warning'
            >Ishlatishga yaroqsiz</button>
        }
        return <button className='btn btn-sm btn-danger'
        >Qaytarish</button>
    }
    const autofill = async (id: any) => {
        try {
            setLoad(() => true)
            let res = await axios.get('/product-order/auto-fill/' + id)
            const { result } = res.data
            setItem(() => result)
            setModal(true)
        }
        catch (error) {

        }
        finally {
            setLoad(() => false)

        }
    }
    const statuschange = async (data: any) => {
        try {
            setLoad(() => true)
            let formdata = new FormData()
            formdata.append('status', 'processing')
            let res = await axios.post(`/product-order/${data?.id}`, formdata)
            const { result } = res.data
            setItem(() => result)
            dispatch(isEditProductOrder({
                ...data,
                status: 'processing'
            }))
            setModal(true)
        }
        catch (error) {

        }
        finally {
            setLoad(() => false)

        }
    }
     const { productData,
        } = useSelector((state: ReducerType) => state.ProductReducer)
    return (
        <Content loading={load}>
            <Navbar />
            <div className="container-fluid flex-grow-1 container-p-y size_16 ">
                <div className="d-flex my-2 gap-3">
                    <div className="row w-100">
                        {/* <div className="col-4">
                            <Input placeholder='Izlash...' onChange={(e: any) => {
                                setSearch({
                                    ...search,
                                    name: e.target.value
                                })

                            }}
                                value={search.name}
                            />
                        </div> */}
                        <div className="col-4">
                            <Select
                                name='name3'
                                isDisabled={load}
                                value={search?.status}
                                onChange={(e: any) => {

                                    setSearch(() => {
                                        return {
                                            ...search,
                                            status: e
                                        }
                                    })
                                    getData({
                                        status: e
                                    })


                                }}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                options={
                                    [
                                        {
                                            label: 'Barchasi',
                                            value: 'all'
                                        },
                                        {
                                            label: 'Yakunlangan',
                                            value: 'start'
                                        },
                                        {
                                            label: 'Tasdqilash',
                                            value: 'finish'
                                        },

                                    ]
                                } />
                        </div>
                        <div className="col-3">
                            <div className="d-flex gap-2">
                                <Input type='date'
                                    disabled={load}
                                    onChange={(e: any) => {
                                        let value = e.target.value
                                        if (value && value.length > 0) {
                                            getData({
                                                ...search,
                                                start_date: e.target.value
                                            })
                                            // dispatch(isClientGet(`?start_date=${value}&end_date=${clientData?.end_date}&per_page=500&page=1`))
                                        }
                                    }}
                                    value={data?.start_date}
                                />
                                <Input type='date'
                                    disabled={load}
                                    min={data?.start_date} onChange={(e: any) => {
                                        let value = e.target.value
                                        if (value && value.length > 0) {
                                            getData({
                                                ...search,
                                                end_date: e.target.value
                                            })
                                            // dispatch(isClientGet(`?start_date=${data?.start_date}&end_date=${value}&per_page=500&page=1`))
                                        }
                                    }}
                                    value={data?.end_date}
                                />
                            </div>
                        </div>
                        <div className="col-4">
                            <Select
                                required
                                name='name3'
                                value={search?.prodcut}
                                onChange={(e: any) => {
                                    setSearch(() => {
                                        return {
                                            ...search,
                                            prodcut: e
                                        }
                                    })
                                    getData({
                                        ...search,
                                        prodcut: e
                                    })
                                    // setSelectData({
                                    //     ...selectData,
                                    //     product_id: e,

                                    // })
                                    // setValue('expiration_date', addDays(user?.graph_format_date, e?.data?.expiration_day), {
                                    //     shouldValidate: true
                                    // })

                                    // setValue('product_id', e.value, {
                                    //     shouldValidate: true,
                                    // });
                                }}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                // value={userBranch}
                                options={
                                    dataSelect(productData)
                                } />
                        </div>

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
                        paginationRole={false}
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
                            getData(search)
                        }}
                        top={100}
                        scrollRole={true}
                        // editRole={true}
                        showFunction={(e: any) => {
                            path('/service-type/' + e?.id)
                        }}

                        limit={pageLimit}
                        extraKeys={['sana', 'product_', 'qty_', 'typess', 'statuss']}
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
                                title: 'Klinika',
                                key: 'sana',
                                renderItem: (value: any, data: any) => {
                                    return <td

                                    >
                                        {value?.user?.owner?.name} <br />
                                        <span className='text-info register_date'  >
                                            {getCurrentDateTime(value?.created_at)}
                                        </span>
                                    </td>
                                }
                            },
                            {
                                title: 'Maxsulot',
                                key: 'product_',
                                renderItem: (value: any, data: any) => {
                                    return <td

                                    >
                                        {value?.product?.name} <br />
                                    </td>
                                }
                            },
                            {
                                title: 'Soni',
                                key: 'qty_',
                                renderItem: (value: any, data: any) => {
                                    return <td

                                    >
                                        {value?.qty} <br />
                                    </td>
                                }
                            },
                            {
                                title: 'Qaytarish turi',
                                key: 'typess',
                                renderItem: (value: any, data: any) => {
                                    return <td
                                        onClick={() => {
                                            // show(data.id)
                                        }}
                                    >
                                        {typeStatus(value)}
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



                        ]}
                        dataSource={
                            filter(data.data, search)
                        }
                    />
                </div>
                {/* <br />
                <Pagination
                    setPageLimit={(e: any) => {
                        // setNumberOfPages(Math.ceil(productOrderData?.length / e))
                        // setPageLimit(e)
                        dispatch(isProductOrderCurrentPage(1))
                        dispatch(isProductOrderPageLimit(e))
                    }}

                    pageLmit={pageLimit}
                    current={page} total={Math.ceil(productOrderData?.length / pageLimit)} count={isProductOrderCurrentPage} /> */}
            </div>

            <PharmacyOrderShow
                data={item}
                setModal={setModal}
                modal={modal}
            />

        </Content>
    )
}

export default ProductOrderBack