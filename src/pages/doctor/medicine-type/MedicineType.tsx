import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'


import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { IoMdSettings } from 'react-icons/io'
import { useDispatch, useSelector } from 'react-redux'
import { ReducerType } from '../../../interface/interface'
import { AppDispatch } from '../../../service/store/store'
import { isMedicineTypeCurrentPage, isMedicineTypeDelete, isMedicineTypeGet, isMedicineTypePageLimit } from '../../../service/reducer/MedicineTypeReducer'
import Content from '../../../layout/Content'
import Navbar from '../../../layout/Navbar'
import Input from '../../../componets/inputs/Input'
import Table from '../../../componets/table/Table'
import Pagination from '../../../componets/pagination/Pagination'
import MedicineTypeAdd from './MedicineTypeAdd'
import MedicineSetting from './MedicineSetting'


const MedicineType = () => {
    const [modal, setModal] = useState(false)
    const [modal2, setModal2] = useState(false)
    const [item, setItem] = useState({} as any)
    const [item2, setItem2] = useState({} as any)
    const path = useNavigate()
    const { page, medicineTypeData, massage, isLoading, isSuccess, pageLimit } = useSelector((state: ReducerType) => state.MedicineTypeReducer)
    // const [pageLmit, setPageLimit] = useState(() => 5)
    const [numberOfPages, setNumberOfPages] = useState(Math.ceil(medicineTypeData?.length / pageLimit))
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
                dispatch(isMedicineTypeDelete({ all: [...new Set(checkData?.map((idAll: any) => idAll?.id))] }))
                setCheckData([])
                setCheckAll(() => false)
            }
        })
        // dispatch(deletedispatchFunction(id))

    }
    const [serachText, setSerachText] = useState('')
    const [load, setLoad] = useState(false)
    const itemAll = async (id: any) => {
        try {
            setLoad(() => true)
            let res = await axios.get('/medicine-type/item-all?id=' + id)
            const { result } = res.data
            setItem2(() => result)
            console.log(result);
            setModal2(() => true)
        } catch (error) {

        } finally {
            setLoad(() => false)
        }
    }
    const filter = (data: any, serachData: string) => {
        if (serachData?.length > 0) {
            return (data.filter((item: any) => (item?.full_name?.toString().toLowerCase().includes(serachData) || item?.phone?.toString().toLowerCase().includes(serachData)) || item?.target_adress?.toString().toLowerCase().includes(serachData) || item?.address?.toString().toLowerCase().includes(serachData)))
        } else
            return (data)
    }
    const [checkAll, setCheckAll] = useState(false)
    useEffect(() => {
        dispatch(isMedicineTypeGet(''))
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

                        deletedispatchFunction={isMedicineTypeDelete}
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
                            dispatch(isMedicineTypeGet(''))
                        }}
                        extraButton={(item: any) => {
                            return <>

                                <button className='btn btn-warning btn-sm'
                                    onClick={() => {
                                        itemAll(item?.id)
                                    }}>
                                    <IoMdSettings />
                                </button>
                            </>
                        }}
                        top={100}
                        scrollRole={true}
                        editRole={true}

                        deleteRole={true}
                        extraKeys={['names']}
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
                                title: 'Nomi',
                                key: 'names',
                                render: (value: any, data: any) => {
                                    return <>
                                        {value?.name}
                                    </>
                                }
                            },
                        ]}
                        dataSource={
                            filter(medicineTypeData, serachText)
                        }
                    />
                </div>
                <br />
                <Pagination
                    setPageLimit={(e: any) => {
                        // setNumberOfPages(Math.ceil(medicineTypeData?.length / e))
                        // setPageLimit(e)
                        dispatch(isMedicineTypeCurrentPage(1))
                        dispatch(isMedicineTypePageLimit(e))
                    }}

                    pageLmit={pageLimit}
                    current={page} total={Math.ceil(medicineTypeData?.length / pageLimit)} count={isMedicineTypeCurrentPage} />
            </div>

            <MedicineTypeAdd
                modal={modal} setModal={setModal}
                setData={setItem} data={item} />
            {
                modal2 ? <MedicineSetting
                    modal={modal2} setModal={setModal2}
                    setData={setItem2} data={item2}
                /> : ''
            }


        </Content>
    )
}

export default MedicineType