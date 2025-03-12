import React, { useEffect, useState } from 'react'
import Layout from '../../layout/Layout'
import Navbar from '../../layout/Navbar'
import Table from '../../componets/table/Table'
import Input from '../../componets/inputs/Input'
import Pagination from '../../componets/pagination/Pagination'
import CustomerAdd from './CustomerAdd'
import { useDispatch, useSelector } from 'react-redux'
import { ReducerType } from '../../interface/interface'
import { isCustomerDelete, isCustomerGet, isCustomerCurrentPage, isCustomerPageLimit, isCustomerEdit } from '../../service/reducer/CustomerReducer'
import { AppDispatch } from '../../service/store/store'
import Swal from 'sweetalert2'
import Content from '../../layout/Content'
import { isFindFunction } from '../../service/reducer/MenuReducer'
import { NumericFormat } from 'react-number-format'
import { query } from '../../componets/api/Query'
import axios from 'axios'
import { CustomerOrderShow } from './CustomerOrderShow'

const Customer = () => {
    const [modal, setModal] = useState(false)
    const [modal2, setModal2] = useState(false)
    const [item, setItem] = useState({} as any)
    const [item2, setItem2] = useState({} as any)
    const { page, customerData, massage, isLoading, isSuccess, pageLimit } = useSelector((state: ReducerType) => state.CustomerReducer)
    // const [pageLmit, setPageLimit] = useState(() => 5)
    const [numberOfPages, setNumberOfPages] = useState(Math.ceil(customerData?.length / pageLimit))
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
                dispatch(isCustomerDelete({ all: [...new Set(checkData?.map((idAll: any) => idAll?.id))] }))
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
            let res = await axios.get('/order-show?customer_id=' + id)
            const { result } = res.data
            setItem2(() => result)
            console.log(result);
            
            setModal2(()=>true)
        } catch (error) {

        } finally {
            setLoad(() => false)
        }
    }
    const filter = (data: any, serachData: string) => {
        if (serachData?.length > 0) {
            return (data.filter((item: any) => (item?.full_name?.toString().toLowerCase().includes(serachData) || item?.phone?.toString().toLowerCase().includes(serachData)) || item?.target_adress?.toString().toLowerCase().includes(serachData) ||  item?.address?.toString().toLowerCase().includes(serachData) ))
        } else
            return (data)
    }
    useEffect(()=>{
        dispatch(isCustomerGet(''))
    },[])
    return (
        <Content loading={load}>
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
                            setItem(() => {})
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
                        deletedispatchFunction={isCustomerDelete}
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
                            dispatch(isCustomerGet(''))
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
                                   
                                        <span>
                                            {((data?.index + 1) + (page * pageLimit) - pageLimit)}
                                        </span>
                                    </div>
                                }
                            },
                            {
                                title: 'MIJOZ',
                                key: 'full_name',
                                render: (value: any, data: any) => {
                                    return <button className='btn btn-sm'
                                    onClick={()=>{
                                        orderShow(data.id)
                                    }}
                                    >
                                        {value}
                                    </button>
                                }
                            },
                            {
                                title: 'Telefon',
                                key: 'phone',
                            },
                            {
                                title: 'Manzil',
                                key: 'address',
                            },
                            {
                                title: "Mo'ljal",
                                key: 'target_adress',
                            },
                            {
                                title: "Buyurtma soni",
                                key: 'order',
                                render:(e:any)=>{
                                    return  <div className="btn-group btn-primary ">
                                    <div
                                        className="btn text-white fw-bold  gap-1  d-flex align-items-center">
                                        <span className='badge bg-white text-primary'>
                                            <NumericFormat displayType="text"
                                                thousandSeparator
                                                decimalScale={2}

                                                value={e.length|| 0} /> dona
                                        </span>
                                    </div>
                                </div>
                                }
                            },
                            
                        ]}
                        dataSource={
                            filter(customerData, serachText)
                        }
                    />
                </div>
                <br />
                <Pagination
                    setPageLimit={(e: any) => {
                        // setNumberOfPages(Math.ceil(customerData?.length / e))
                        // setPageLimit(e)
                        dispatch(isCustomerCurrentPage(1))
                        dispatch(isCustomerPageLimit(e))
                    }}

                    pageLmit={pageLimit}
                    current={page} total={Math.ceil(customerData?.length / pageLimit)} count={isCustomerCurrentPage} />
            </div>
            <CustomerOrderShow
                modal={modal2}
                setModal={setModal2}
                data={item2}
                setData={setItem2}
            />
            <CustomerAdd
                modal={modal} setModal={setModal} 
                setData={setItem} data={item} />
        </Content>
    )
}

export default Customer