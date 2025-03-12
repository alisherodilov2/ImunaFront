import React, { useEffect, useState } from 'react'
import Layout from '../../../../layout/Layout'
import Navbar from '../../../../layout/Navbar'
import Table from '../../../../componets/table/Table'
import Input from '../../../../componets/inputs/Input'
import Pagination from '../../../../componets/pagination/Pagination'
import MaterialExpenseAdd from './MaterialExpenseAdd'
import { useDispatch, useSelector } from 'react-redux'
import { ReducerType } from '../../../../interface/interface'
import { isMaterialExpenseDelete, isMaterialExpenseGet, isMaterialExpenseCurrentPage, isMaterialExpensePageLimit, isMaterialExpenseEdit } from '../../../../service/reducer/MaterialExpenseReducer'
import { AppDispatch } from '../../../../service/store/store'
import Swal from 'sweetalert2'
import Content from '../../../../layout/Content'
import { isFindFunction } from '../../../../service/reducer/MenuReducer'
import { NumericFormat } from 'react-number-format'
import { query } from '../../../../componets/api/Query'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { IoMdSettings } from 'react-icons/io'
import MaterialExpenseHeader from '../MaterialExpenseHeader'
import { isProductGet } from '../../../../service/reducer/ProductReducer'

const MaterialExpense = () => {
    const [modal, setModal] = useState(false)
    const [modal2, setModal2] = useState(false)
    const [item, setItem] = useState({} as any)
    const [item2, setItem2] = useState({} as any)
    const path = useNavigate()
    const { page, materialExpenseData, massage, isLoading, isSuccess, pageLimit } = useSelector((state: ReducerType) => state.MaterialExpenseReducer)
    // const [pageLmit, setPageLimit] = useState(() => 5)
    const [numberOfPages, setNumberOfPages] = useState(Math.ceil(materialExpenseData?.length / pageLimit))
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
                dispatch(isMaterialExpenseDelete({ all: [...new Set(checkData?.map((idAll: any) => idAll?.id))] }))
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
            let res = await axios.get('/order-show?materialExpense_id=' + id)
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
        dispatch(isMaterialExpenseGet(''))
        dispatch(isProductGet('?is_material=1'))
    }, [])
    return (
        <Content loading={load}>
            <Navbar />
            <div className="container-fluid flex-grow-1 container-p-y size_16 ">
                <MaterialExpenseHeader />

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

                        deletedispatchFunction={isMaterialExpenseDelete}
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
                            dispatch(isMaterialExpenseGet(''))
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
                                            setCheckData(() => materialExpenseData)
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
                                title: 'Maxsulot',
                                key: 'product',
                                render: (value: any, data: any) => {
                                    return <>
                                        {value.name}
                                    </>
                                }
                            },
                            {
                                title: 'Maxsulot soni',
                                key: 'qty',
                                render: (value: any, data: any) => {
                                    return <>
                                        {value}
                                    </>
                                }
                            },
                            {
                                title: 'Izoh',
                                key: 'comment',
                                render: (value: any, data: any) => {
                                    return <>
                                        {value}
                                    </>
                                }
                            },

                        ]}
                        dataSource={
                            filter(materialExpenseData, serachText)
                        }
                    />
                </div>
                <br />
                <Pagination
                    setPageLimit={(e: any) => {
                        // setNumberOfPages(Math.ceil(materialExpenseData?.length / e))
                        // setPageLimit(e)
                        dispatch(isMaterialExpenseCurrentPage(1))
                        dispatch(isMaterialExpensePageLimit(e))
                    }}

                    pageLmit={pageLimit}
                    current={page} total={Math.ceil(materialExpenseData?.length / pageLimit)} count={isMaterialExpenseCurrentPage} />
            </div>

            <MaterialExpenseAdd
                modal={modal} setModal={setModal}
                setData={setItem} data={item} />

        </Content>
    )
}

export default MaterialExpense