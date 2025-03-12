import React, { useEffect, useState } from 'react'
import Layout from '../../layout/Layout'
import Navbar from '../../layout/Navbar'
import Table from '../../componets/table/Table'
import Input from '../../componets/inputs/Input'
import Pagination from '../../componets/pagination/Pagination'
import BranchAdd from './BranchAdd'
import { useDispatch, useSelector } from 'react-redux'
import { ReducerType } from '../../interface/interface'
import { isBranchDelete, isBranchGet, isBranchCurrentPage, isBranchPageLimit, isBranchEdit } from '../../service/reducer/BranchReducer'
import { AppDispatch } from '../../service/store/store'
import Swal from 'sweetalert2'
import Content from '../../layout/Content'
import { isFindFunction } from '../../service/reducer/MenuReducer'
import { NumericFormat } from 'react-number-format'
import { query } from '../../componets/api/Query'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { IoMdSettings } from 'react-icons/io'
import { isServiceGet } from '../../service/reducer/ServiceReducer'
import { isKlinkaGet } from '../../service/reducer/KlinkaReducer'

const Branch = () => {
    const [modal, setModal] = useState(false)
    const [modal2, setModal2] = useState(false)
    const [item, setItem] = useState({} as any)
    const [item2, setItem2] = useState({} as any)
    const path = useNavigate()
    const { page, branchData, massage, isLoading, isSuccess, pageLimit } = useSelector((state: ReducerType) => state.BranchReducer)
    // const [pageLmit, setPageLimit] = useState(() => 5)
    const [numberOfPages, setNumberOfPages] = useState(Math.ceil(branchData?.length / pageLimit))
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
                dispatch(isBranchDelete({ all: [...new Set(checkData?.map((idAll: any) => idAll?.id))] }))
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
            let res = await axios.get('/order-show?branch_id=' + id)
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
            return (data.filter((item: any) => (item?.main_branch
                ?.name?.toString().toLowerCase().includes(serachData) || item?.branch_items?.find((kk: any) => kk?.target_branch?.name?.toString().toLowerCase().includes(serachData)))))
        } else
            return (data)
    }
    const [checkAll, setCheckAll] = useState(false)
    useEffect(() => {
        dispatch(isBranchGet(''))
        dispatch(isKlinkaGet(''))
    }, [])
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
                            setItem(() => {
                                return {
                                    branch_id: [],
                                    main_branch_id: false
                                }
                            })
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
                        deletedispatchFunction={isBranchDelete}
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
                            dispatch(isBranchGet(''))
                        }}
                        top={100}
                        scrollRole={true}
                        editRole={true}

                        // allCheckId='id'
                        // allCheckRoleFun={
                        //     (e: any) => {
                        //         return <>
                        //             {" "}
                        //             <input className="form-check-input" type="checkbox" onChange={(e: any) => {
                        //                 const target = !checkAll
                        //                 setCheckAll(() => target)
                        //                 if (target) {
                        //                     setCheckData(() => branchData)
                        //                 } else {
                        //                     setCheckData(() => [])
                        //                 }
                        //             }} checked={checkAll} />
                        //             {" "}

                        //         </>
                        //     }
                        // }
                        extraKeys={[
                            'm_branch_id_',
                            'm_klinka_id_c',
                            'm_klinka_id_',
                        ]}
                        deleteRole={true}
                        limit={pageLimit}
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
                                title: 'Bosh shifoxona',
                                key: 'm_branch_id_',
                                render: (value: any, data: any) => {
                                    return <>
                                        {value?.main_branch?.name
                                        }
                                    </>
                                }
                            },
                            {
                                title: 'Filiallar soni',
                                key: 'm_klinka_id_c',
                                render: (value: any, data: any) => {
                                    return <>
                                        {value?.branch_items?.length}
                                    </>
                                }
                            },
                            {
                                title: 'Filiallar',
                                key: 'm_klinka_id_',
                                renderItem: (value: any, data: any) => {
                                    return <td className='d-flex align-items-center gap-1 flex-wrap'>
                                        {
                                            value?.branch_items?.map((item: any) => (
                                                <span className='badge bg-primary'>{item?.target_branch?.name}</span>
                                            ))
                                        }
                                    </td>
                                }
                            },

                        ]}
                        dataSource={
                            filter(branchData, serachText)
                        }
                    />
                </div>
                <br />
                <Pagination
                    setPageLimit={(e: any) => {
                        // setNumberOfPages(Math.ceil(branchData?.length / e))
                        // setPageLimit(e)
                        dispatch(isBranchCurrentPage(1))
                        dispatch(isBranchPageLimit(e))
                    }}

                    pageLmit={pageLimit}
                    current={page} total={Math.ceil(branchData?.length / pageLimit)} count={isBranchCurrentPage} />
            </div>

            <BranchAdd
                modal={modal} setModal={setModal}
                setData={setItem} data={item} />


        </Content>
    )
}

export default Branch