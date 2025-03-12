import React, { useEffect, useRef, useState } from 'react'
import Layout from '../../layout/Layout'
import Navbar from '../../layout/Navbar'
import Table from '../../componets/table/Table'
import Input from '../../componets/inputs/Input'
import Pagination from '../../componets/pagination/Pagination'
import PharmacyProductAdd from './PharmacyProductAdd'
import { useDispatch, useSelector } from 'react-redux'
import { ReducerType } from '../../interface/interface'
import { isPharmacyProductDelete, isPharmacyProductGet, isPharmacyProductCurrentPage, isPharmacyProductPageLimit, isPharmacyProductEdit } from '../../service/reducer/PharmacyProductReducer'
import { AppDispatch } from '../../service/store/store'
import Swal from 'sweetalert2'
import Content from '../../layout/Content'
import { isFindFunction } from '../../service/reducer/MenuReducer'
import { NumericFormat } from 'react-number-format'
import { query } from '../../componets/api/Query'
import axios from 'axios'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { IoMdSettings } from 'react-icons/io'
import { isProductGet } from '../../service/reducer/ProductReducer'
import { isProductCategoryGet } from '../../service/reducer/ProductCategoryReducer'

import { FaPrint, FaRegPlusSquare } from 'react-icons/fa'
import { dateFormat } from '../../service/helper/day'
import { productQrCode } from '../../helper/productQrCode'

const PharmacyProductShow = () => {
    const { id } = useParams()
    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const [modal, setModal] = useState(false)
    const [modal2, setModal2] = useState(false)
    const [item, setItem] = useState({} as any)
    const [item2, setItem2] = useState({} as any)
    const path = useNavigate()
    const { page, pharmacyProductData, massage, isLoading, isSuccess, pageLimit } = useSelector((state: ReducerType) => state.PharmacyProductReducer)
    // const [pageLmit, setPageLimit] = useState(() => 5)
    const [numberOfPages, setNumberOfPages] = useState(Math.ceil(pharmacyProductData?.length / pageLimit))
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
                dispatch(isPharmacyProductDelete({ all: [...new Set(checkData?.map((idAll: any) => idAll?.id))] }))
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
            let res = await axios.get('/order-show?pharmacyProduct_id=' + id)
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
        dispatch(isPharmacyProductGet('?show_id=' + id))
        dispatch(isProductGet(''))
        // dispatch(isProductCategoryGet(''))
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
    const qrCodeRef = useRef<HTMLDivElement>(null);
    const handleDownload = (): void => {
        if (qrCodeRef.current) {
            const canvas = qrCodeRef.current.querySelector("canvas");
            if (canvas) {
                const pngUrl = canvas.toDataURL("image/png");
                const downloadLink = document.createElement("a");
                downloadLink.href = pngUrl;
                downloadLink.download = "qr-code.png";
                downloadLink.click();
            }
        }
    };
    return (
        <Content loading={load}>
            <Navbar />
            <div className="container-fluid flex-grow-1 container-p-y size_16 ">

                <div className="d-flex my-2 gap-3">
                    <form className='row w-100'>
                        {/* <div className="col-2">
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
                        </div> */}
                    </form>
                    <div className='d-flex justify-content-center align-items-center gap-1'>
                        {
                            checkData?.length > 0 ?
                                <button className="btn btn-danger " type="button" onClick={() => {
                                    deleteAll()
                                }}>O'chirish</button> : ''
                        }
                        <NavLink to='/' className="btn btn-info " type="button" >Ortga</NavLink>
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

                        deletedispatchFunction={isPharmacyProductDelete}
                        setNumberOfPages={setNumberOfPages}
                        paginationRole={true}
                        errorMassage={massage}
                        isLoading={isLoading}
                        isSuccess={isSuccess}
                        localEditFunction={(e: any) => {
                            setItem(() => e)
                            setModal(true)
                        }}
                        reloadData={true}
                        reloadDataFunction={() => {
                            dispatch(isPharmacyProductGet('?show_id=' + id))

                        }}
                        editRole={true}
                        top={100}
                        scrollRole={true}
                        allCheckId='id'
                        extraButton={(item: any) => {
                            return <button type='button' className='btn btn-sm btn-info'
                                onClick={() => {
                                    console.log(item?.prodcut?.name);

                                    productQrCode({
                                        target: {
                                            created_at: item?.created_at,
                                            first_name: item?.prodcut?.name,
                                            shelf_number: 1,
                                            qr_code_link: `https://api.qrserver.com/v1/create-qr-code/?data=${item?.id}_${item?.product_id}&size=50x50`
                                        },
                                        iframeRef: iframeRef,
                                    })
                                }}>
                                <FaPrint />
                            </button>
                        }}
                        allCheckRoleFun={
                            (e: any) => {
                                return <>
                                    {" "}
                                    <input className="form-check-input" type="checkbox" onChange={(e: any) => {
                                        const target = !checkAll
                                        setCheckAll(() => target)
                                        if (target) {
                                            setCheckData(() => pharmacyProductData)
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
                        extraKeys={['qr', 'sana', 'p_name', 'product_qty', 'prices', 'muddati']}
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
                                title: 'Qr code',
                                key: 'qr',
                                render: (value: any, data: any) => {
                                    return <div ref={qrCodeRef} onClick={handleDownload}>
                                        <img src={`https://api.qrserver.com/v1/create-qr-code/?data=${value?.id}_${value?.product_id}&size=100x100
`} alt="" />
                                    </div>
                                }
                            },
                            {
                                title: 'Sana',
                                key: 'sana',
                                render: (value: any, data: any) => {
                                    return <>
                                        {dateFormat(value?.created_at, '.')}
                                    </>
                                }
                            },

                            {
                                title: 'Maxsulot',
                                key: 'p_name',
                                render: (value: any, data: any) => {
                                    return value?.prodcut?.name
                                }
                            },
                            {
                                title: 'Maxsulot miqdori',
                                key: 'product_qty',
                                render: (value: any, data: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={value?.qty} />
                                }
                            },
                            {
                                title: 'narxi',
                                key: 'prices',
                                render: (value: any, data: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={value?.price} />
                                }
                            },
                            {
                                title: 'Muddati',
                                key: 'muddati',
                                render: (value: any, data: any) => {
                                    return value?.expiration_date
                                }
                            },

                        ]}
                        dataSource={
                            filter(pharmacyProductData, serachText)
                        }
                    />
                </div>
                <br />
                <Pagination
                    setPageLimit={(e: any) => {
                        // setNumberOfPages(Math.ceil(pharmacyProductData?.length / e))
                        // setPageLimit(e)
                        dispatch(isPharmacyProductCurrentPage(1))
                        dispatch(isPharmacyProductPageLimit(e))
                    }}

                    pageLmit={pageLimit}
                    current={page} total={Math.ceil(pharmacyProductData?.length / pageLimit)} count={isPharmacyProductCurrentPage} />
            </div>

            <PharmacyProductAdd
                modal={modal} setModal={setModal}
                setData={setItem} data={item}
                product_id={id}
            />

            <iframe ref={iframeRef} style={{ display: 'none' }} title="print-frame" />
        </Content>
    )
}

export default PharmacyProductShow