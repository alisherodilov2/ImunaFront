import React, { useEffect, useState } from 'react'
import Layout from '../../layout/Layout'
import Navbar from '../../layout/Navbar'
import Table from '../../componets/table/Table'
import Input from '../../componets/inputs/Input'
import Pagination from '../../componets/pagination/Pagination'
import uploadFileIcon from '../../assets/upload-file.svg'
import KlinkaAdd from './KlinkaAdd'
import { useDispatch, useSelector } from 'react-redux'
import { ReducerType } from '../../interface/interface'
import { isKlinkaDelete, isKlinkaGet, isKlinkaCurrentPage, isKlinkaPageLimit, isKlinkaEdit } from '../../service/reducer/KlinkaReducer'
import { AppDispatch } from '../../service/store/store'
import Swal from 'sweetalert2'
import Content from '../../layout/Content'
import { isFindFunction } from '../../service/reducer/MenuReducer'
import { NumericFormat } from 'react-number-format'
import { query } from '../../componets/api/Query'
import axios from 'axios'
import { domain } from '../../main'
import { IoMdSettings } from 'react-icons/io'
import KlinkaSetting from './KlinkaSetting'
// import { KlinkaOrderShow } from './KlinkaOrderShow'

const Klinka = () => {
    const [modal, setModal] = useState(false)
    const [modal2, setModal2] = useState(false)
    const [item, setItem] = useState({} as any)
    const [item2, setItem2] = useState({} as any)
    const { page, klinkaData, massage, isLoading, isSuccess, pageLimit } = useSelector((state: ReducerType) => state.KlinkaReducer)
    // const [pageLmit, setPageLimit] = useState(() => 5)
    const [numberOfPages, setNumberOfPages] = useState(Math.ceil(klinkaData?.length / pageLimit))
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
                dispatch(isKlinkaDelete({ all: [...new Set(checkData?.map((idAll: any) => idAll?.id))] }))
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
            let res = await axios.get('/order-show?klinka_id=' + id)
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
    useEffect(() => {
        dispatch(isKlinkaGet(''))
    }, [])
    const [modal4, setModal4] = useState(false)
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
                        //  exportFile={true}
                        //  importFile={true}
                        deletedispatchFunction={isKlinkaDelete}
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
                            dispatch(isKlinkaGet(''))
                        }}
                        top={100}
                        scrollRole={true}
                        editRole={true}
                        deleteRole={true}
                        limit={pageLimit}
                        extraButton={
                            (item: any) => {
                                return (
                                    <button className='btn btn-warning btn-sm'
                                        onClick={() => {
                                            setModal4((prev: any) => true)
                                            setItem(() => item)
                                        }}>
                                        <IoMdSettings />
                                    </button>
                                )
                            }
                        }
                        // extraKeys={['jarayon']}
                        columns={
                            [
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
                                    title: 'Logo',
                                    key: 'logo_photo',
                                    render: (value: any, data: any) => {
                                        return <div className="d-flex align-items-start align-items-sm-center gap-4">
                                            <img src={value?.includes('/storage/') ? `${domain}${value}`
                                                : uploadFileIcon} alt="user-avatar" className="d-block rounded" height={60} width={60}
                                                // onError={(e) => {
                                                //     e.currentTarget.src = uploadFileIcon; // Set the default image on error
                                                // }}

                                                id="uploadedAvatar" />
                                        </div>
                                    }
                                },
                                {
                                    title: 'Blanka',
                                    key: 'blank_file',
                                    render: (value: any, data: any) => {
                                        return <div className="d-flex align-items-start align-items-sm-center gap-4">
                                            <img src={value?.includes('/storage/') ? `${domain}${value}`
                                                : uploadFileIcon} alt="user-avatar" className="d-block rounded" height={60} width={60}
                                                // onError={(e) => {
                                                //     e.currentTarget.src = uploadFileIcon; // Set the default image on error
                                                // }}

                                                id="uploadedAvatar" />
                                        </div>
                                    }
                                },
                                {
                                    title: 'Nomi',
                                    key: 'name',
                                    render: (value: any, data: any) => {
                                        return <button className='btn btn-sm'
                                            onClick={() => {
                                                // orderShow(data.id)
                                            }}
                                        >
                                            {value}
                                        </button>
                                    }
                                },

                                {
                                    title: 'Manzil',
                                    key: 'address',
                                    render: (value: any, data: any) => {
                                        return <button className='btn btn-sm'
                                            onClick={() => {
                                                // orderShow(data.id)
                                            }}
                                        >
                                            {value ?? '-'}
                                        </button>
                                    }
                                },



                            ]}
                        dataSource={
                            filter(klinkaData, serachText)
                        }
                    />
                </div>
                <br />
                <Pagination
                    setPageLimit={(e: any) => {
                        // setNumberOfPages(Math.ceil(klinkaData?.length / e))
                        // setPageLimit(e)
                        dispatch(isKlinkaCurrentPage(1))
                        dispatch(isKlinkaPageLimit(e))
                    }}

                    pageLmit={pageLimit}
                    current={page} total={Math.ceil(klinkaData?.length / pageLimit)} count={isKlinkaCurrentPage} />
            </div>
            {/* <KlinkaOrderShow
                modal={modal2}
                setModal={setModal2}
                data={item2}
                setData={setItem2}
            /> */}
            <KlinkaAdd
                modal={modal} setModal={setModal}
                setData={setItem} data={item} />
            <KlinkaSetting
                modal={modal4} setModal={setModal4}
                setData={setItem} data={item} />
        </Content>
    )
}

export default Klinka