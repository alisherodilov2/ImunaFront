import React, { useEffect, useState } from 'react'
import Layout from '../../../../layout/Layout'
import Navbar from '../../../../layout/Navbar'
import Table from '../../../../componets/table/Table'
import Input from '../../../../componets/inputs/Input'
import Pagination from '../../../../componets/pagination/Pagination'
import { useDispatch, useSelector } from 'react-redux'
import { ReducerType } from '../../../../interface/interface'
import { isProductReceptionDelete, isProductReceptionGet, isProductReceptionCurrentPage, isProductReceptionPageLimit, isProductReceptionEdit } from '../../../../service/reducer/ProductReceptionReducer'
import { AppDispatch } from '../../../../service/store/store'
import Swal from 'sweetalert2'
import Select from 'react-select';

import Content from '../../../../layout/Content'
import { isFindFunction } from '../../../../service/reducer/MenuReducer'
import { NumericFormat } from 'react-number-format'
import { query } from '../../../../componets/api/Query'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { IoMdSettings } from 'react-icons/io'
import { isProductGet } from '../../../../service/reducer/ProductReducer'
import { isProductCategoryGet } from '../../../../service/reducer/ProductCategoryReducer'
import { FaRegPlusSquare } from 'react-icons/fa'
import RepotMaterialExpenseShow from './RepotMaterialExpenseShow'

const RepotMaterialExpense = () => {
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
    const [data, setData] = useState({
        data: [],
        start_date: '',
        end_date: '',
    } as any)
        const { user, target_branch } = useSelector((state: ReducerType) => state.ProfileReducer)
    
    const getData = async (data: any) => {
        try {
            setLoad(() => true)
            let res = await axios.get(`/material-expense/repot?start_date=${data?.start_date}&end_date=${data?.end_date}&branch_id=${data?.branch?.value ?? ''}`)
            const { result } = res.data
            setData(() => result)
            console.log(result);

            // setModal2(() => true)
        } catch (error) {

        } finally {
            setLoad(() => false)
        }
    }
    const [loading,setLoading] = useState(false)
    const getDataShow = async (date: any) => {
        try {
            setLoading(() => true)
            let res = await axios.get(`/material-expense/repot/show?date=${date}`)
            const { result } = res.data
            // setData(() => result)
            // console.log(result);
            setItem(() => result)
            setModal2(() => true)
        } catch (error) {

        } finally {
            setLoading(() => false)
        }
    }
    const filter = (data: any, serachData: string) => {
        if (serachData?.length > 0) {
            return (data.filter((item: any) => (item?.name?.toString().toLowerCase().includes(serachData) || item?.phone?.toString().toLowerCase().includes(serachData)) || item?.target_adress?.toString().toLowerCase().includes(serachData) || item?.address?.toString().toLowerCase().includes(serachData)))
        } else
            return (data)
    }
       const [search, setSearch] = useState({
            branch: target_branch == 'all' ? { label: 'Barcha filallar', value: 'all' } : (target_branch > 0 ? user?.branch?.find((item: any) => item?.value == target_branch) : user?.branch?.at(0)),
    
        } as any)
    const [checkAll, setCheckAll] = useState(false)
    useEffect(() => {
        getData({
            ...data,
            branch: target_branch == 'all' ? { label: 'Barcha filallar', value: 'all' } : (target_branch > 0 ? user?.branch?.find((item: any) => item?.value == target_branch) : user?.branch?.at(0)),
        })
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
        <Content loading={load || loading}>
            <Navbar />
            <div className="container-fluid flex-grow-1 container-p-y size_16 ">
                <div className="my-2 ">
                    <form className='row w-auto w-lg-100'>
                    {
                                user?.is_main_branch ? '' :
                                    <div className="col-lg-2 col-12 my-1">
                                        <Select
                                            name='name'
                                            isDisabled={user?.is_main_branch || load}
                                            value={search?.branch}
                                            onChange={(e: any) => {
                                                setSearch(({ ...search, branch: e }))
                                                getData({
                                                    ...data
                                                    , branch: e,
                                                    start_date:'',
                                                    end_date:'',
                                                })
                                                // getData({
                                                //     ...data, branch: e
                                                // })
                                                // clientAllData(`branch_id=${e?.value}`)

                                            }}
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                            options={
                                                [
                                                    {
                                                        value: 'all',
                                                        label: 'Barcha filallar'
                                                    },
                                                       ...(user?.branch ?? [])
                                                ]
                                            } />
                                    </div>
                            }
                        <div className="col-lg-2 col-6">
                            <Input type='date' onChange={(e: any) => {
                                let value = e.target.value
                                if (value && value.length > 0) {
                                    // dispatch(isClientGet(`?start_date=${value}&end_date=${clientData?.end_date}`))
                                    getData({
                                        ...data
                                        , start_date: value,
                                        branch: search?.branch
                                    })
                                }
                            }}
                                value={data?.start_date}
                            />
                        </div>
                        <div className="col-lg-2 col-6">
                            <Input type='date'
                                 min={data?.start_date}
                                onChange={(e: any) => {
                                    let value = e.target.value
                                    if (value && value.length > 0) {
                                        // dispatch(isClientGet(`?start_date=${clientData?.start_date}&end_date=${value}`))

                                        getData({
                                            ...data
                                            , end_date: value,
                                            branch: search?.branch
                                        })
                                    }
                                }}
                                value={data?.end_date}
                            />
                        </div>
                    </form>

                </div>
                <div className="card" style={{
                    height: `${window.innerHeight / 1.7}px`,
                    overflow: 'auto'
                }}>
                    <Table
                        page={page}
                        //  exportFile={true}
                        //  importFile={true}


                        paginationRole={false}
                        showIcon={<FaRegPlusSquare />}
                        isLoading={load}
                        isSuccess={true}
                        reloadData={true}
                        reloadDataFunction={() => {
                            setSearch({ ...search, branch: user?.branch?.at(0) })
                            getData({ ...data, start_date: '', end_date: '',branch: user?.branch?.at(0) })
                        }}
                        top={100}
                        scrollRole={true}


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
                                title: 'Sana',
                                key: 'date',
                                renderItem: (value: any, data: any) => {
                                    return <td
                                        onClick={() => {
                                            getDataShow(value)
                                        }}
                                    >
                                        {value}
                                    </td>
                                }
                            },
                       
                            {
                                title: 'Maxsulot miqdori',
                                key: 'qty',
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
                            data?.data
                        }
                    />
                </div>
                <br />
            </div>

            <RepotMaterialExpenseShow
                data={item}
                modal={modal2}
                setModal={setModal2}
            />

        </Content>
    )
}

export default RepotMaterialExpense