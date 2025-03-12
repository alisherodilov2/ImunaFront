import React, { useEffect, useState } from 'react'
import Layout from '../../layout/Layout'
import Navbar from '../../layout/Navbar'
import Table from '../../componets/table/Table'
import Input from '../../componets/inputs/Input'
import Pagination from '../../componets/pagination/Pagination'
import OrderAdd from './OrderAdd'
import { useDispatch, useSelector } from 'react-redux'
import { ReducerType } from '../../interface/interface'
import { isOrderDelete, isOrderGet, isOrderCurrentPage, isOrderPageLimit, isOrderEdit, isEditOrder, isSoketAddOrder } from '../../service/reducer/OrderReducer'
import { AppDispatch } from '../../service/store/store'
import Swal from 'sweetalert2'
import Content from '../../layout/Content'
import { isFindFunction } from '../../service/reducer/MenuReducer'
import { NumericFormat } from 'react-number-format'
import { query } from '../../componets/api/Query'
import { isCustomerGet } from '../../service/reducer/CustomerReducer'
// import { socket } from '../../service/config/Config'
import { playSound } from '../tg-group/TgGroup'
import { MdDeleteForever } from 'react-icons/md'
import { AiFillEdit } from 'react-icons/ai'

const Order = () => {

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
    // useEffect(() => {
    //     socket.on('order', (msg: any) => {
    //         console.log('msg', msg);
    //         if (msg?.id) {
    //             dispatch(isSoketAddOrder(msg))
    //             playSound()
    //         }
    //     });

    //     // Cleanup the connection when the component unmounts
    //     return () => {
    //         socket.off('order');
    //     };
    // }, []);
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
            return (data.filter((item: any) => (item?.full_name?.toString().toLowerCase().includes(serachData) || item?.phone?.toString().toLowerCase().includes(serachData)) || item?.target_adress?.toString().toLowerCase().includes(serachData) || item?.address?.toString().toLowerCase().includes(serachData)))
        } else
            return (data)
    }
    useEffect(() => {
        dispatch(isCustomerGet(''))
        dispatch(isOrderGet(''))
    }, [])


    useEffect(() => {


    }, [])

    async function getTime(id: any) {
        const { value: time } = await Swal.fire({
            title: "O'rnatish vaqti",
            input: "text",
            inputLabel: "O'rnatish vaqti",
            inputPlaceholder: "O'rnatish vaqti",
            showCancelButton: true // Optional: adds a cancel button
        });

        // Check if the user entered a value
        if (time) {
            dispatch(isOrderEdit(
                {
                    id: id,
                    query: query({
                        is_installation_time: "1",
                        installation_time: time,
                        type: 'is_installation_time',

                    })
                }
            ))
        } else {
            Swal.fire('No time entered.');
        }
    }
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
                            dispatch(isOrderGet(''))
                        }}
                        top={100}
                        scrollRole={true}
                        // editRole={true}
                        // deleteRole={true}
                        limit={pageLimit}
                        extraKeys={['fress', 'jarayon', 'Amallar']}
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
                                title: 'Mijoz',
                                key: 'full_name',
                                renderItem: (e: any, data: any) => {
                                    return <td className={data.status=='take_order' || data.status=='finish' ? `bg-warning-animate` : ''}>
                                        {e}
                                    </td>
                                }
                            },
                            {
                                title: 'Telefon',
                                key: 'phone',
                                renderItem: (e: any, data: any) => {
                                    return <td className={data.status=='take_order' || data.status=='finish'? `bg-warning-animate` : ''}>
                                        {e}
                                    </td>
                                }
                            },
                            {
                                title: 'soni',
                                key: 'qty',
                                render: (e: any, item: any) => {
                                    return <>
                                        <NumericFormat displayType="text"
                                            thousandSeparator
                                            decimalScale={2}

                                            value={e} /> dona
                                    </>

                                    // `${e}/${item?.price}/${item.master_salary}`
                                }
                            },
                            {
                                title: 'Jami',
                                key: 'price',
                                render: (e: any, item: any) => {
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

                                    // `${e}/${item?.price}/${item.master_salary}`
                                }
                            },
                            {
                                title: 'Xizmat haqqi/Jami',
                                key: 'master_salary',
                                render: (e: any, item: any) => {
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

                                                        value={e * item.qty} /> $
                                                </span>
                                            </div>


                                        </div>
                                    </>

                                    // `${e}/${item?.price}/${item.master_salary}`
                                }
                            },
                            // {
                            //     title: 'Operator',
                            //     key: 'operator',
                            //     render:(e:any,item:any)=>{
                            //         return e?.full_name
                            //     }
                            // },
                            {
                                title: 'usta/username',
                                key: 'master',
                                render: (e: any, item: any) => {
                                    return e?.id ? <>
                                    {e?.full_name} <br />
                                    @{e?.username}
                                    </> : '-'
                                }
                            },
                            {
                                title: 'Izoh',
                                key: 'comment',
                                render: (e: any, item: any) => {
                                    return <>
                                    <p className='comment_ pointer'
                                    onClick={()=>{
                                        Swal.fire({
                                            title: "Batafsil",
                                            text:e,
                                            // icon: "address",
                                            confirmButtonText:'Ortga',
                                            showCancelButton: false,
                                            showCloseButton: false,

                                          });
                                    }}
                                    
                                    >
                                      {e?.slice(0,20)}...  
                                    </p>
                                    </>
                                }
                            },
                            {
                                title: 'Kafolat muddati',
                                key: 'warranty_period_quantity',
                                render: (e: any, item: any) => {
                                    return `${e} ${item?.warranty_period_type == 'year' ? 'yil' : 'oy'}`
                                }
                            },
                            {
                                title: "O'rnatish vaqti",
                                key: 'installation_time',
                                render: (e: any, item: any) => {
                                    if (item?.master?.full_name && !item?.is_freeze) {

                                        return +item?.is_installation_time ? item.installation_time : '-'
                                    }
                                    return '-'
                                }
                            },
                            {
                                title: 'Muzlatish/reset',
                                key: 'fress',
                                render: (e: any,) => {
                                    console.log(orderData?.find((res: any) => res.master_id == e.master_id));

                                  
                                    return <div className='d-flex'>
                                        {
                                              e.status!='finish'  ?
                                              
                                                <div className="form-check form-switch">
                                                    <input className="form-check-input float-end" type="checkbox" role="switch" checked={+e.is_freeze ? true : false}
                                                        onChange={(target: any) => {
                                                            console.log(e);
                                                            dispatch(isOrderEdit(
                                                                {
                                                                    id: e?.id,
                                                                    query: query({
                                                                        is_freeze: `${target.target.checked ? 1 : 0}`,
                                                                        type: 'is_freeze',

                                                                    })
                                                                }
                                                            ))
                                                        }}
                                                    />
                                                </div>  :'-'
                                        }
                                        {
                                          e.status!='finish'   ? <>
                                                / <button className='btn btn-primary btn-sm'
                                                    onClick={(target: any) => {
                                                        console.log(e);
                                                        dispatch(isOrderEdit(
                                                            {
                                                                id: e?.id,
                                                                query: query({
                                                                    is_freeze: `${target.target.checked ? 1 : 0}`,
                                                                    type: 'is_reset',
                                                                })
                                                            }
                                                        ))
                                                    }}

                                                >
                                                    reset
                                                </button>
                                            </> : '/-'
                                        }

                                    </div>
                                }
                            },

                            {
                                title: 'jarayon',
                                key: 'jarayon',
                                renderItem: (e: any, item: any) => {
                                    switch (e.status) {
                                        case 'ether':
                                            return <td className='  text-center bg-info text-white'
                                                onClick={() => {
                                                    getTime(item.id)
                                                }}
                                            >
                                                efir
                                            </td>
                                        case 'master_freeze':
                                            return <td className='  text-center bg-warning text-white'
                                                onClick={() => {
                                                    getTime(item.id)
                                                }}
                                            >
                                               vaqtincha to'xtatildi
                                            </td>
                                        case 'do_work':
                                            return <td className='  text-center bg-warning text-white'
                                                onClick={() => {
                                                    getTime(item.id)
                                                }}
                                            >
                                               Bajarilmoqda
                                            </td>
                                        case 'take_order':
                                            return <td className=' bg-warning-animate pointer text-center'
                                                onClick={() => {
                                                    getTime(item.id)
                                                }}
                                            >
                                                vaqt kiritish
                                            </td>
                                        case 'finish':
                                            return <td className=' bg-warning-animate pointer text-center'
                                                onClick={() => {
                                                    dispatch(isOrderEdit(
                                                        {
                                                            id: e?.id,
                                                            query: query({
                                                                is_check: '1',
                                                                type: 'is_check'
                                                            })
                                                        }
                                                    ))


                                                }}
                                            >
                                                qabul qildim
                                            </td>

                                        default:
                                            return <td className=' bg-warning-animate pointer text-center'
                                                onClick={() => {
                                                    getTime(item.id)
                                                }}
                                            >
                                                --
                                            </td>
                                    }
                                    if (e?.is_freeze) {
                                        return <span className="badge bg-danger">Muzlatildi</span>
                                    }
                                    if (e?.is_check == 0 && e?.is_finish == 1) {
                                        return <button
                                            onClick={() => {
                                                dispatch(isOrderEdit(
                                                    {
                                                        id: e?.id,
                                                        query: query({
                                                            is_check: '1',
                                                            status: 'is_check'
                                                        })
                                                    }
                                                ))


                                            }}

                                            className='btn btn-primary btn-sm'>
                                            qabul qildim
                                        </button>

                                    }
                                    if (e?.is_check == 1 && e?.is_finish == 1) {
                                        return <span className="badge bg-success">Yakunlandi</span>

                                    }
                                    if (!e.master?.id) {
                                        return <span className="badge bg-warning">Efirda</span>

                                    }
                                    if (e.master?.id) {
                                        return <span className="badge bg-info">Bajarilmoqda</span>

                                    }

                                }
                            },
                            {
                                title: 'Amallar',
                                key: 'Amallar',
                                render: (e: any, item: any) => {
                                    return <>
                                        <div className="d-flex gap">

                                            <button className='btn btn-info btn-sm'
                                                disabled={e.status=='finish' ? true : false}
                                                onClick={() => {
                                                    // dispatch(isFindFunction(item))
                                                    // path(`${pathname}/edit/${item?.id}`)
                                                    setItem(() => {
                                                        return e
                                                    })

                                                    setModal(() => true)
                                                }}>
                                                <AiFillEdit />
                                            </button>
                                            <button type='button' disabled={e.status=='finish'  ? true : false} className='btn btn-sm btn-danger'
                                                onClick={() => {
                                                    Swal.fire({
                                                        title: "Ma'lumotni o'chirasizmi?",
                                                        showDenyButton: true,
                                                        showCancelButton: true,
                                                        confirmButtonText: 'Ha',
                                                        denyButtonText: `Yo'q`,
                                                    }).then((result: any) => {
                                                        if (result.isConfirmed) {
                                                            // penaltydelete(e.id)

                                                            dispatch(isOrderDelete({ id: e.id }))

                                                        }
                                                    })
                                                }}>
                                                <MdDeleteForever />
                                            </button>
                                        </div>
                                    </>

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

export default Order