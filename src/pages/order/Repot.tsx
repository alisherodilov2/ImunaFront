import React, { useEffect, useState } from 'react'
import Layout from '../../layout/Layout'
import Navbar from '../../layout/Navbar'
import Table from '../../componets/table/Table'
import Input from '../../componets/inputs/Input'
import Pagination from '../../componets/pagination/Pagination'
import OrderAdd from './OrderAdd'
import { useDispatch, useSelector } from 'react-redux'
import { ReducerType } from '../../interface/interface'
import { isOrderDelete, isOrderGet, isOrderCurrentPage, isOrderPageLimit, isOrderEdit } from '../../service/reducer/OrderReducer'
import { AppDispatch } from '../../service/store/store'
import Swal from 'sweetalert2'
import Content from '../../layout/Content'
import { isFindFunction } from '../../service/reducer/MenuReducer'
import { NumericFormat } from 'react-number-format'
import { query } from '../../componets/api/Query'

const RepotData = () => {

    const [modal, setModal] = useState(false)
    const [item, setItem] = useState({} as any)
    const { page, orderData, massage, isLoading, isSuccess, pageLimit } = useSelector((state: ReducerType) => state.OrderReducer)
    // const [pageLmit, setPageLimit] = useState(() => 5)
    const [numberOfPages, setNumberOfPages] = useState(Math.ceil(orderData?.length / pageLimit))
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
                dispatch(isOrderDelete({ all: [...new Set(checkData?.map((idAll: any) => idAll?.id))] }))
                setCheckData([])
            }
        })
        // dispatch(deletedispatchFunction(id))

    }
    const [serachText, setSerachText] = useState('')

    const filter = (data: any, serachData: string) => {
        if (serachData?.length > 0) {
            return (data.filter((item: any) => item?.name.toString().toLowerCase().includes(serachData)))
        } else
            return (data)
    }

    useEffect(() => {
        dispatch(isOrderGet('repot=1'))
    }, [])
    return (
        <Content>
            <Navbar />
            <div className="container-fluid flex-grow-1 container-p-y size_16 ">
                <div className="d-flex my-2 gap-3">
                    <form className='w-100'>
                        <Input placeholder='Izlash...' onChange={(e: any) => {
                            setSerachText(e.target.value)
                        }}
                            value={serachText}
                        />
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
                        deletedispatchFunction={isOrderDelete}
                        setNumberOfPages={setNumberOfPages}
                        paginationRole={true}
                        localEditFunction={(e: any) => {
                            setItem(() => e)
                            setModal(true)
                        }}
                        errorMassage={massage}
                        isLoading={isLoading}
                        isSuccess={isSuccess}
                        reloadData={true}
                        reloadDataFunction={() => {
                            dispatch(isOrderGet('repot=1'))
                        }}
                        top={100}
                        scrollRole={true}
                        editRole={true}
                        deleteRole={true}
                        limit={pageLimit}
                        extraKeys={['jarayon']}
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
                                title: 'Mijoz',
                                key: 'full_name',
                            },
                            {
                                title: 'Telefon',
                                key: 'phone',
                            },
                            {
                                title: 'soni',
                                key: 'qty',
                                render: (e: any, item: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}

                                        value={e} />

                                    // `${e}/${item?.price}/${item.master_salary}`
                                }
                            },
                            {
                                title: 'summasi',
                                key: 'price',
                                render: (e: any, item: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}

                                        value={e} />

                                    // `${e}/${item?.price}/${item.master_salary}`
                                }
                            },
                            {
                                title: 'Maosh/tolandi',
                                key: 'master_salary',
                                render: (e: any, item: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}

                                        value={e} />

                                    // `${e}/${item?.price}/${item.master_salary}`
                                }
                            },
                            {
                                title: 'Operator',
                                key: 'operator',
                                render: (e: any, item: any) => {
                                    return e?.full_name
                                }
                            },
                            {
                                title: 'usta',
                                key: 'master',
                                render: (e: any, item: any) => {
                                    return e?.full_name
                                }
                            },
                            {
                                title: 'jarayon',
                                key: 'jarayon',
                                render: (e: any, item: any) => {
                                    if(e?.master_salary-e.master_salary_pay==0){
                                        return <span className="badge bg-success">Yakunlandi</span>
                                    }
                                    return <button 
                                        onClick={()=>{
                                            dispatch(isOrderEdit(
                                                {
                                                    id: e?.id,
                                                    query:  query({ 
                                                        is_check: '1',
                                                        status:'is_pay',
                                                        master_salary_pay:e.master_salary
                                                    })
                                                }
                                            ))
                                        }}
                                        className='btn btn-danger '>
                                           To'lash
                                        </button>

                                }
                            },
                            
                        ]}
                        dataSource={
                            filter(orderData, serachText)
                        }
                    />
                </div>
                <br />
                <Pagination
                    setPageLimit={(e: any) => {
                        // setNumberOfPages(Math.ceil(orderData?.length / e))
                        // setPageLimit(e)
                        dispatch(isOrderCurrentPage(1))
                        dispatch(isOrderPageLimit(e))
                    }}

                    pageLmit={pageLimit}
                    current={page} total={Math.ceil(orderData?.length / pageLimit)} count={isOrderCurrentPage} />
            </div>
            <OrderAdd
                modal={modal} setModal={setModal}
                setData={setItem} data={item} />
        </Content>
    )
}

export default RepotData