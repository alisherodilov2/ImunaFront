import React, { useEffect, useState } from 'react'
import Layout from '../../../../layout/Layout'
import Navbar from '../../../../layout/Navbar'
import Table from '../../../../componets/table/Table'
import Input from '../../../../componets/inputs/Input'
import Pagination from '../../../../componets/pagination/Pagination'
import ProductReceptionAdd from './ProductReceptionAdd'
import { useDispatch, useSelector } from 'react-redux'
import { ReducerType } from '../../../../interface/interface'
import { isProductReceptionDelete, isProductReceptionGet, isProductReceptionCurrentPage, isProductReceptionPageLimit, isProductReceptionEdit } from '../../../../service/reducer/ProductReceptionReducer'
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
import { isProductGet } from '../../../../service/reducer/ProductReducer'
import { isProductCategoryGet } from '../../../../service/reducer/ProductCategoryReducer'
import ProductReceptionShow from './ProductReceptionShow'
import { FaRegPlusSquare } from 'react-icons/fa'

const ProductReception = () => {
    const [modal, setModal] = useState(false)
    const [modal2, setModal2] = useState(false)
    const [item, setItem] = useState({} as any)
    const [item2, setItem2] = useState({} as any)
    const path = useNavigate()
    const { page, productReceptionData, massage, isLoading, isSuccess, pageLimit } = useSelector((state: ReducerType) => state.ProductReceptionReducer)
    // const [pageLmit, setPageLimit] = useState(() => 5)
    const [numberOfPages, setNumberOfPages] = useState(Math.ceil(productReceptionData?.length / pageLimit))
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
                dispatch(isProductReceptionDelete({ all: [...new Set(checkData?.map((idAll: any) => idAll?.id))] }))
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
            let res = await axios.get('/order-show?productReception_id=' + id)
            const { result } = res.data
            setItem2(() => result)
            console.log(result);

            // setModal2(() => true)
        } catch (error) {

        } finally {
            setLoad(() => false)
        }
    }
    const filter = (data: any, serachData: string) => {
        if (serachData?.length > 0) {
            return (data.filter((item: any) => (item?.name?.toString().toLowerCase().includes(serachData) || item?.phone?.toString().toLowerCase().includes(serachData)) || item?.target_adress?.toString().toLowerCase().includes(serachData) || item?.address?.toString().toLowerCase().includes(serachData)))
        } else
            return (data)
    }
    const [checkAll, setCheckAll] = useState(false)
    useEffect(() => {
        dispatch(isProductReceptionGet(''))
        dispatch(isProductGet(''))
        dispatch(isProductCategoryGet(''))
    }, [])
    const show = async (id: any) => {
        try {
            setLoad(() => true)
            let res = await axios.get('/product-reception/' + id)
            const { result } = res.data
            setItem(() => result)
            setModal2(() => true)
        } catch (error) {

        }
        finally {
            setLoad(() => false)

        }
    }
    return (
        <Content loading={load}>
            <Navbar />
            <div className="container-fluid flex-grow-1 container-p-y size_16 ">
                <ProductStorageHeader />
                <div className="d-flex my-2 gap-3">
                    <form className='row w-100'>
                        <div className="col-2">
                            <Input type='date' onChange={(e: any) => {
                                let value = e.target.value
                                if (value && value.length > 0) {
                                    // dispatch(isClientGet(`?start_date=${value}&end_date=${clientData?.end_date}`))
                                }
                            }}
                                // value={clientData?.start_date}
                            />
                        </div>
                        <div className="col-2">
                            <Input type='date'
                            //  min={clientData?.start_date}
                              onChange={(e: any) => {
                                let value = e.target.value
                                if (value && value.length > 0) {
                                    // dispatch(isClientGet(`?start_date=${clientData?.start_date}&end_date=${value}`))
                                }
                            }}
                                // value={clientData?.end_date}
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
                        //  exportFile={true}
                        //  importFile={true}

                        deletedispatchFunction={isProductReceptionDelete}
                        setNumberOfPages={setNumberOfPages}
                        paginationRole={true}
                        showIcon={<FaRegPlusSquare />}
                        showRole={true}
                        showFunction={(e: any) => {
                            // setItem(() => e)
                            show(e.id)
                            // setModal2(true)
                        }}
                        errorMassage={massage}
                        isLoading={isLoading}
                        isSuccess={isSuccess}
                        reloadData={true}
                        reloadDataFunction={() => {
                            dispatch(isProductReceptionGet(''))
                        }}
                        top={100}
                        scrollRole={true}
                        allCheckId='id'
                        allCheckRoleFun={
                            (e: any) => {
                                return <>
                                    {" "}
                                    <input className="form-check-input" type="checkbox" onChange={(e: any) => {
                                        const target = !checkAll
                                        setCheckAll(() => target)
                                        if (target) {
                                            setCheckData(() => productReceptionData)
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
                        columns={[
                            {
                                title: '№',
                                key: 'id',
                                render: (value: any, data: any) => {
                                    return <div key={data.index} className='d-flex  align-items-center gap-1'>
                                        <input className="form-check-input" type="checkbox" id="defaultCheck3" value={value} onChange={() => {
                                            setCheckData(checkFun(data))
                                        }} checked={checkData?.find((item: any) => item?.id == value)} />
                                        <span>
                                            {((data?.index + 1) + (page * pageLimit) - pageLimit)}
                                        </span>
                                    </div>
                                }
                            },
                            {
                                title: 'Sana',
                                key: 'date',
                                render: (value: any, data: any) => {
                                    return <>
                                        {value}
                                    </>
                                }
                            },
                            {
                                title: 'Maxsulot turi',
                                key: 'product_category_count',
                                render: (value: any, data: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={value} />
                                }
                            },
                            {
                                title: 'Maxsulot miqdori',
                                key: 'product_qty',
                                render: (value: any, data: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={value} />
                                }
                            },
                            {
                                title: 'Umumiy narxi',
                                key: 'total_price',
                                render: (value: any, data: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={value} />
                                }
                            },

                        ]}
                        dataSource={
                            filter(productReceptionData, serachText)
                        }
                    />
                </div>
                <br />
                <Pagination
                    setPageLimit={(e: any) => {
                        // setNumberOfPages(Math.ceil(productReceptionData?.length / e))
                        // setPageLimit(e)
                        dispatch(isProductReceptionCurrentPage(1))
                        dispatch(isProductReceptionPageLimit(e))
                    }}

                    pageLmit={pageLimit}
                    current={page} total={Math.ceil(productReceptionData?.length / pageLimit)} count={isProductReceptionCurrentPage} />
            </div>

            <ProductReceptionAdd
                modal={modal} setModal={setModal}
                setData={setItem} data={item} />
            <ProductReceptionShow
                modal={modal2} setModal={setModal2}
                setData={setItem} data={item} />

        </Content>
    )
}

export default ProductReception