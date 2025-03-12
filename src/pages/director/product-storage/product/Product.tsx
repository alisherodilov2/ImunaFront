import React, { useEffect, useState } from 'react'
import Layout from '../../../../layout/Layout'
import Navbar from '../../../../layout/Navbar'
import Table from '../../../../componets/table/Table'
import Input from '../../../../componets/inputs/Input'
import Pagination from '../../../../componets/pagination/Pagination'
import ProductAdd from './ProductAdd'
import { useDispatch, useSelector } from 'react-redux'
import { ReducerType } from '../../../../interface/interface'
import { isProductDelete, isProductGet, isProductCurrentPage, isProductPageLimit, isProductEdit } from '../../../../service/reducer/ProductReducer'
import { AppDispatch } from '../../../../service/store/store'
import Swal from 'sweetalert2'
import Content from '../../../../layout/Content'
import { isFindFunction } from '../../../../service/reducer/MenuReducer'
import { NumericFormat } from 'react-number-format'
import { query } from '../../../../componets/api/Query'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { IoMdSettings } from 'react-icons/io'
import ProductStorageHeader from '../ProductStorageHeader'
import { isProductCategoryGet } from '../../../../service/reducer/ProductCategoryReducer'
import ProductShow from './ProductShow'
import Select from 'react-select';

const Product = () => {
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
    const { page, productData, massage, isLoading, isSuccess, pageLimit } = useSelector((state: ReducerType) => state.ProductReducer)
    // const [pageLmit, setPageLimit] = useState(() => 5)
    const [numberOfPages, setNumberOfPages] = useState(Math.ceil(productData?.length / pageLimit))
    useEffect(() => {
    }, [numberOfPages])
    const show = async (id: any, status?: any) => {
        try {
            setLoad(() => true)
            let res = await axios.get(`/product/${id}?status=${status ?? ''}`)
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
                dispatch(isProductDelete({ all: [...new Set(checkData?.map((idAll: any) => idAll?.id))] }))
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
            let res = await axios.get('/order-show?product_id=' + id)
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
        if (+serachData?.product_category_id?.value > 0) {
            response = response?.filter((item: any) => item?.prodcut_category
                ?.id === serachData?.product_category_id?.value)
        }
        return response

        // if (serachData?.length > 0) {
        //     return (data.filter((item: any) => (item?.name?.toString().toLowerCase().includes(serachData) || item?.phone?.toString().toLowerCase().includes(serachData)) || item?.target_adress?.toString().toLowerCase().includes(serachData) || item?.address?.toString().toLowerCase().includes(serachData)))
        // } else
        //     return (data)
    }
    const [checkAll, setCheckAll] = useState(false)
    useEffect(() => {
        dispatch(isProductGet(''))
        dispatch(isProductCategoryGet(''))
    }, [])
    const [search, setSearch] = useState({
        name: '',
        product_category_id: {
            label: 'Barchasi',
            value: 0
        },
    } as any)
    const { productCategoryData } = useSelector((state: ReducerType) => state.ProductCategoryReducer)
    const { user } = useSelector((state: ReducerType) => state.ProfileReducer)

    return (
        <Content loading={load}>
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
                        <div className="col-4">
                            <Select
                                name='name3'
                                value={search?.product_category_id}
                                onChange={(e: any) => {

                                    setSearch(() => {
                                        return {
                                            ...search,
                                            product_category_id: e
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
                                        ...dataSelect(productCategoryData)
                                    ]
                                } />
                        </div>
                    </div>
                    <div className='d-flex justify-content-center align-items-center gap-1'>
                        {
                            checkData?.length > 0 ?
                                <button className="btn btn-danger " type="button" onClick={() => {
                                    deleteAll()
                                }}>O'chirish</button> : ''
                        }
                        <button className={`btn btn-primary ${user?.role == 'reception' ? 'd-none' : ''}`} type="button" onClick={() => {
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
                        //  exportFile={true}
                        //  importFile={true}

                        deletedispatchFunction={isProductDelete}
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
                            dispatch(isProductGet(''))
                        }}
                        top={100}
                        scrollRole={true}
                        editRole={true}
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
                                            setCheckData(() => productData)
                                        } else {
                                            setCheckData(() => [])
                                        }
                                    }} checked={checkAll} />
                                    {" "}

                                </>
                            }
                        }
                        deleteRole={true}
                        limit={pageLimit}
                        extraKeys={['muddat_status', 'alert_min_qty_']}
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
                                title: 'Nomi',
                                key: 'name',
                                renderItem: (value: any, data: any) => {
                                    return <td
                                        onClick={() => {
                                            show(data.id)
                                        }}
                                    >
                                        {value}
                                    </td>
                                }
                            },
                            {
                                title: 'Narxi',
                                key: 'price',
                                render: (value: any, data: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={value} />
                                }
                            },
                            {
                                title: 'Kategoriya',
                                key: 'prodcut_category',
                                render: (value: any, data: any) => {
                                    return <>
                                        {value?.name}
                                    </>
                                }
                            },

                            // {
                            //     title: 'Sonı ',
                            //     key: 'qty',
                            //     render: (value: any, data: any) => {
                            //         return <NumericFormat displayType="text"
                            //             thousandSeparator
                            //             decimalScale={2}
                            //             value={value} />
                            //     }
                            // },
                            {
                                title: 'Qoldi ',
                                key: 'use_qty',
                                render: (value: any, data: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={data.qty - value} />
                                }
                            },

                            {
                                title: 'Saqlash muudati ',
                                key: 'expiration_day',
                                render: (value: any, data: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={value} />
                                }
                            },
                            {
                                title: 'Ogohlatirish muudati ',
                                key: 'alert_dedline_day',
                                render: (value: any, data: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={value} />
                                }
                            },
                            {
                                title: 'muddat status ',
                                key: 'muddat_status',
                                render: (value: any, data: any) => {
                                    return <button className="btn btn-danger"
                                        onClick={() => {
                                            show(value.id, 'danger')
                                        }}
                                    >
                                        <NumericFormat displayType="text"
                                            thousandSeparator
                                            decimalScale={2}
                                            value={value?.danger_qty} />
                                    </button>
                                }
                            },
                            {
                                title: 'Minumum ',
                                key: 'alert_min_qty_',
                                render: (value: any, data: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={value?.alert_min_qty} />
                                }
                            },


                        ]}
                        dataSource={
                            filter(productData, search)
                        }
                    />
                </div>
                <br />
                <Pagination
                    setPageLimit={(e: any) => {
                        // setNumberOfPages(Math.ceil(productData?.length / e))
                        // setPageLimit(e)
                        dispatch(isProductCurrentPage(1))
                        dispatch(isProductPageLimit(e))
                    }}

                    pageLmit={pageLimit}
                    current={page} total={Math.ceil(productData?.length / pageLimit)} count={isProductCurrentPage} />
            </div>

            <ProductAdd
                modal={modal} setModal={setModal}
                setData={setItem} data={item} />
            <ProductShow
                modal={modal2} setModal={setModal2}
                data={item2}
                setData={setItem2}
                />

        </Content>
    )
}

export default Product