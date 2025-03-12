import React, { useEffect, useState } from 'react'
import Layout from '../../../layout/Layout'
import Navbar from '../../../layout/Navbar'
import Table from '../../../componets/table/Table'
import Input from '../../../componets/inputs/Input'
import Pagination from '../../../componets/pagination/Pagination'
import ExpenseAdd, { pay_type } from './ExpenseAdd'
import { useDispatch, useSelector } from 'react-redux'
import { ReducerType } from '../../../interface/interface'
import { isExpenseDelete, isExpenseGet, isExpenseCurrentPage, isExpensePageLimit, isExpenseEdit } from '../../../service/reducer/ExpenseReducer'
import { AppDispatch } from '../../../service/store/store'
import Swal from 'sweetalert2'
import Content from '../../../layout/Content'
import { isFindFunction } from '../../../service/reducer/MenuReducer'
import { NumericFormat } from 'react-number-format'
import { query } from '../../../componets/api/Query'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { IoMdSettings } from 'react-icons/io'
import { isExpenseTypeGet } from '../../../service/reducer/ExpenseTypeReducer'
import { getCurrentDateTime } from '../../../helper/dateFormat'
import MaterialExpenseHeader from './MaterialExpenseHeader'

const Expense = () => {
    const [modal, setModal] = useState(false)
    const [modal2, setModal2] = useState(false)
    const [item, setItem] = useState({} as any)
    const [item2, setItem2] = useState({} as any)
    const path = useNavigate()
    const { page, expenseData, massage, isLoading, isSuccess, pageLimit } = useSelector((state: ReducerType) => state.ExpenseReducer)
    // const [pageLmit, setPageLimit] = useState(() => 5)
    const [numberOfPages, setNumberOfPages] = useState(Math.ceil(expenseData.data?.length / pageLimit))
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
                dispatch(isExpenseDelete({ all: [...new Set(checkData?.map((idAll: any) => idAll?.id))] }))
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
            let res = await axios.get('/order-show?expense_id=' + id)
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
            return (data.filter((item: any) => (item?.expense_type?.name?.toString().toLowerCase().includes(serachData) || item?.price?.toString().toLowerCase().includes(serachData)) || item?.target_adress?.toString().toLowerCase().includes(serachData) || item?.address?.toString().toLowerCase().includes(serachData)))
        } else
            return (data)
    }
    const [checkAll, setCheckAll] = useState(false)
    useEffect(() => {
        dispatch(isExpenseGet(''))
        dispatch(isExpenseTypeGet(''))

    }, [])
    return (
        <Content loading={load}>
            <Navbar />
            <div className="container-fluid flex-grow-1 container-p-y size_16 ">
                <MaterialExpenseHeader />
                <div className="d-flex my-2 gap-3">
                    <form className=' row w-100'>
                        <div className="col-2">
                            <Input type='date' onChange={(e: any) => {
                                let value = e.target.value
                                if (value && value.length > 0) {
                                    dispatch(isExpenseGet(`?start_date=${value}&end_date=${expenseData?.end_date}`))
                                }
                            }}
                                value={expenseData?.start_date}
                            />
                        </div>
                        <div className="col-2">
                            <Input type='date' min={expenseData?.start_date} onChange={(e: any) => {
                                let value = e.target.value
                                if (value && value.length > 0) {
                                    dispatch(isExpenseGet(`?start_date=${expenseData?.start_date}&end_date=${value}`))
                                }
                            }}
                                value={expenseData?.end_date}
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

                        deletedispatchFunction={isExpenseDelete}
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
                            dispatch(isExpenseGet(''))
                        }}
                        top={100}
                        scrollRole={true}
                        editRole={true}
                        showFunction={(e: any) => {
                            path('/service-type/' + e?.id)
                        }}
                        allCheckId='id'
                        allCheckRoleFun={
                            (e: any) => {
                                return <>
                                    {" "}
                                    <input className="form-check-input" type="checkbox" onChange={(e: any) => {
                                        const target = !checkAll
                                        setCheckAll(() => target)
                                        if (target) {
                                            setCheckData(() => expenseData)
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
                        extraKeys={['date_', 'expense_type_', 'pay_type_', 'price_','comment_']}
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
                                key: 'date_',
                                render: (value: any, data: any) => {
                                    return <>
                                        {getCurrentDateTime(value?.created_at)}
                                    </>
                                }
                            },
                            {
                                title: 'Xizmat turi',
                                key: 'expense_type_',
                                render: (value: any, data: any) => {
                                    return <>
                                        {value?.expense_type?.name}
                                    </>
                                }
                            },
                            {
                                title: 'Tolov turi',
                                key: 'pay_type_',
                                render: (value: any, data: any) => {
                                    return pay_type?.find((item: any) => item?.value == value?.pay_type)?.label
                                }
                            },
                            {
                                title: 'Narxi',
                                key: 'price_',
                                render: (value: any, data: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={value?.price} />
                                }
                            },
                            {
                                title: 'Izoh',
                                key: 'comment_',
                                render: (value: any, data: any) => {
                                    return value?.comment
                                }
                            },

                        ]}
                        dataSource={
                            filter(expenseData.data, serachText)
                        }
                    />
                </div>
                <br />
                <Pagination
                    setPageLimit={(e: any) => {
                        // setNumberOfPages(Math.ceil(expenseData?.length / e))
                        // setPageLimit(e)
                        dispatch(isExpenseCurrentPage(1))
                        dispatch(isExpensePageLimit(e))
                    }}

                    pageLmit={pageLimit}
                    current={page} total={Math.ceil(expenseData?.data?.length / pageLimit)} count={isExpenseCurrentPage} />
            </div>

            <ExpenseAdd
                modal={modal} setModal={setModal}
                setData={setItem} data={item} />

        </Content>
    )
}

export default Expense