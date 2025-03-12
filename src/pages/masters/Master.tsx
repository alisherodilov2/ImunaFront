import React, { useEffect, useState } from 'react'
import Layout from '../../layout/Layout'
import Navbar from '../../layout/Navbar'
import Table from '../../componets/table/Table'
import Input from '../../componets/inputs/Input'
import Pagination from '../../componets/pagination/Pagination'
import { useDispatch, useSelector } from 'react-redux'
import { ReducerType } from '../../interface/interface'
import { isMasterDelete, isMasterGet, isMasterCurrentPage, isMasterPageLimit, isMasterEdit, isSoketAddMaster } from '../../service/reducer/MasterReducer'
import { AppDispatch } from '../../service/store/store'
import Swal from 'sweetalert2'
import Content from '../../layout/Content'
import { isFindFunction } from '../../service/reducer/MenuReducer'
import { query } from '../../componets/api/Query'
import { NumericFormat } from 'react-number-format'
import { OrderShow } from './OrderShow'
import axios from 'axios'
// import { socket } from '../../service/config/Config'
import { playSound } from '../tg-group/TgGroup'

const Master = () => {
    const [modal, setModal] = useState(false)
    const [item, setItem] = useState({} as any)
    // useEffect(() => {
    //     socket.on('master', (msg: any) => {
    //         console.log('msg', msg);
    //         if (msg?.id) {
    //             dispatch(isSoketAddMaster(msg))
    //             playSound()
    //         }
    //     });

    //     // Cleanup the connection when the component unmounts
    //     return () => {
    //         socket.off('order');
    //     };
    // }, []);
    const { page, masterData, massage, isLoading, isSuccess, pageLimit, sendLoading } = useSelector((state: ReducerType) => state.MasterReducer)
    // const [pageLmit, setPageLimit] = useState(() => 5)
    const [numberOfPages, setNumberOfPages] = useState(Math.ceil(masterData?.length / pageLimit))
    useEffect(() => {

    }, [numberOfPages])
    const [load, setLoad] = useState(false)
    const orderShow = async (id: any) => {
        try {
            setLoad(() => true)
            let res = await axios.get('/order-show?master_id=' + id)
            const { result } = res.data
            setItem(() => result)
            console.log(result);

            setModal(() => true)
        } catch (error) {

        } finally {
            setLoad(() => false)
        }
    }
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
                dispatch(isMasterDelete({ all: [...new Set(checkData?.map((idAll: any) => idAll?.id))] }))
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
        dispatch(isMasterGet())
    }, [])
    return (
        <Content loading={sendLoading || load}>
            <Navbar />
            <div className="container-fluid flex-grow-1 container-p-y size_16 ">
                {/* <div className="d-flex my-2 gap-3">
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
                </div> */}
                <div className="card" style={{
                    height: `${window.innerHeight / 1.7}px`,
                    overflow: 'auto'
                }}>
                    <Table
                        page={page}
                        //  exportFile={true}
                        //  importFile={true}
                        deletedispatchFunction={isMasterDelete}
                        setNumberOfPages={setNumberOfPages}
                        paginationRole={true}
                        localEditFunction={(e: any) => {
                            setItem(() => {
                                return {
                                    ...e,
                                    phone: `998${e.phone}`
                                }
                            })
                            setModal(true)
                        }}
                        errorMassage={massage}
                        isLoading={isLoading}
                        isSuccess={isSuccess}
                        reloadData={true}
                        reloadDataFunction={() => {
                            dispatch(isMasterGet())
                        }}
                        top={100}
                        scrollRole={true}
                        // editRole={true}
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
                                title: 'username',
                                key: 'username',
                                render: (value: any, data: any) => {
                                    return <button className='btn btn-sm'
                                        onClick={() => {
                                            orderShow(data.id)
                                        }}
                                    >
                                        {value}
                                    </button>
                                }
                            },
                            {
                                title: 'Usta',
                                key: 'full_name',
                            },
                            {
                                title: 'Telefon',
                                key: 'phone',
                            },
                            {
                                title: "Balans/To'landi/Jarima",
                                key: 'balance',
                                render: (e: any, data: any) => {
                                    return <>
                                        <div className="btn-group btn-primary ">
                                            <div
                                                className="btn text-white fw-bold  gap-1  d-flex align-items-center">
                                                <span className='badge bg-white text-primary'>
                                                    <NumericFormat displayType="text"
                                                        thousandSeparator
                                                        decimalScale={2}

                                                        value={e} /> $
                                                </span>
                                            </div>
                                            <div
                                                className="btn text-white fw-bold  gap-1  d-flex align-items-center">
                                                <span className='badge bg-white text-primary'>
                                                    <NumericFormat displayType="text"
                                                        thousandSeparator
                                                        decimalScale={2}

                                                        value={data?.balance_pay} /> $
                                                </span>
                                            </div>
                                            <div
                                                className="btn text-white fw-bold  gap-1  d-flex align-items-center">
                                                <span className='badge bg-white  text-danger'>
                                                    <NumericFormat displayType="text"
                                                        thousandSeparator
                                                        className=''
                                                        decimalScale={2}

                                                        value={data?.penalty_amount} /> $
                                                </span>
                                            </div>


                                        </div>


                                    </>
                                }
                            },
                            {
                                title: 'Xizmat haqqi',
                                key: 'balance_work',
                                render: (e: any, data: any) => {
                                    return <>
                                          <div className="btn-group btn-primary ">
                                            <div
                                                className="btn text-white fw-bold  gap-1  d-flex align-items-center">
                                                <span className='badge bg-white text-primary'>
                                                    <NumericFormat displayType="text"
                                                        thousandSeparator
                                                        decimalScale={2}

                                                        value={e} /> $
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                }
                            },
                            {
                                title: 'Buuyrtma soni',
                                key: 'order_count',
                                render: (e: any, data: any) => {
                                    return <>
                                        <div className="btn-group btn-primary ">
                                            <div
                                                className="btn text-white fw-bold  gap-1  d-flex align-items-center">
                                                <span className='badge bg-white text-primary'>
                                                    <NumericFormat displayType="text"
                                                        thousandSeparator
                                                        decimalScale={2}

                                                        value={e} /> dona
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                }
                            },
                            {
                                title: 'Shartnoma/Activatsiya',
                                key: 'is_contract',
                                render: (item: any, id: any) => {
                                    return <div className='d-flex '>
                                        <div className="form-check form-switch">
                                            <input className="form-check-input float-end" type="checkbox" role="switch" checked={+item ? true : false}
                                            />
                                        </div>
                                        /
                                        <div className="form-check form-switch">
                                            <input className="form-check-input float-end" type="checkbox" role="switch" checked={+id.is_active ? true : false}
                                                onChange={(e: any) => {
                                                    console.log(item);
                                                    console.log(e);

                                                    dispatch(isMasterEdit(
                                                        {
                                                            id: id?.id,
                                                            query: query({
                                                                is_active: `${e.target.checked ? 1 : 0}`
                                                            })
                                                        }
                                                    ))
                                                }}
                                            />
                                        </div>
                                    </div>

                                }
                            },
                            {
                                title: 'Ish holati',
                                key: 'is_occupied',
                                render: (item: any, id: any) => {
                                    return item ? "Zakas bor" : "bo'sh"

                                }
                            },
                        ]}
                        dataSource={
                            masterData
                        }
                    />
                </div>
                <br />
                <Pagination
                    setPageLimit={(e: any) => {
                        // setNumberOfPages(Math.ceil(masterData?.length / e))
                        // setPageLimit(e)
                        dispatch(isMasterCurrentPage(1))
                        dispatch(isMasterPageLimit(e))
                    }}

                    pageLmit={pageLimit}
                    current={page} total={Math.ceil(masterData?.length / pageLimit)} count={isMasterCurrentPage} />
            </div>
            <OrderShow
                modal={modal}
                setModal={setModal}
                data={item}
                setData={setItem}
            />
        </Content>
    )
}

export default Master