import React, { useEffect, useState } from 'react'
import Layout from '../../layout/Layout'
import Navbar from '../../layout/Navbar'
import Table from '../../componets/table/Table'
import Input from '../../componets/inputs/Input'
import Pagination from '../../componets/pagination/Pagination'
import { useDispatch, useSelector } from 'react-redux'
import { ReducerType } from '../../interface/interface'
import { isTgGroupDelete, isTgGroupGet, isTgGroupCurrentPage, isTgGroupPageLimit, isTgGroupEdit, isSoketAddTgGroup } from '../../service/reducer/TgGroupReducer'
import { AppDispatch } from '../../service/store/store'
import Swal from 'sweetalert2'
import Content from '../../layout/Content'
import { isFindFunction } from '../../service/reducer/MenuReducer'
import { query } from '../../componets/api/Query'
import soundFile from '../../assets/mixkit-bell-notification-933.wav'
// import { socket } from '../../service/config/Config'

export const playSound = () => {
    const audio = new Audio(soundFile);
    audio.play();
};
const TgGroup = () => {
    // useEffect(() => {
    //     socket.on('tg_group', (msg: any) => {
    //         console.log('msg', msg);
    //         if (msg?.id) {
    //             dispatch(isSoketAddTgGroup(msg))
    //             playSound()
    //         }
    //     });

    //     // Cleanup the connection when the component unmounts
    //     return () => {
    //         socket.off('order');
    //     };
    // }, []);
    const [modal, setModal] = useState(false)
    const [item, setItem] = useState({} as any)
    const { page, tgGroupData, massage, isLoading, isSuccess, pageLimit, sendLoading } = useSelector((state: ReducerType) => state.TgGroupReducer)
    // const [pageLmit, setPageLimit] = useState(() => 5)
    const [numberOfPages, setNumberOfPages] = useState(Math.ceil(tgGroupData?.length / pageLimit))
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
                dispatch(isTgGroupDelete({ all: [...new Set(checkData?.map((idAll: any) => idAll?.id))] }))
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
        dispatch(isTgGroupGet())
    }, [])
    return (
        <Content loading={sendLoading}>
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
                        deletedispatchFunction={isTgGroupDelete}
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
                            dispatch(isTgGroupGet())
                        }}
                        top={100}
                        scrollRole={true}
                        // editRole={true}
                        deleteRole={true}
                        limit={pageLimit}
                        extraKeys={[
                            'title_',
                            "is_send_"
                        ]}
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
                                title: 'Guruh nomi',
                                key: 'title_',
                                render: (item: any) => {
                                    return item.title
                                }
                            },
                            {
                                title: "Buyurtmani jo'natish",
                                key: 'is_send_',
                                render: (id: any) => {
                                    return <div className="form-check form-switch">
                                        <input className="form-check-input float-end" type="checkbox" role="switch" checked={+id?.is_send ? true : false}
                                            onChange={(e: any) => {
                                                console.log(item);
                                                console.log(e);

                                                dispatch(isTgGroupEdit(
                                                    {
                                                        id: id?.id,
                                                        query: query({
                                                            is_send: `${e.target.checked ? 1 : 0}`
                                                        })
                                                    }
                                                ))
                                            }}
                                        />
                                    </div>

                                }
                            },
                        ]}
                        dataSource={
                            tgGroupData
                        }
                    />
                </div>
                <br />
                <Pagination
                    setPageLimit={(e: any) => {
                        // setNumberOfPages(Math.ceil(tgGroupData?.length / e))
                        // setPageLimit(e)
                        dispatch(isTgGroupCurrentPage(1))
                        dispatch(isTgGroupPageLimit(e))
                    }}

                    pageLmit={pageLimit}
                    current={page} total={Math.ceil(tgGroupData?.length / pageLimit)} count={isTgGroupCurrentPage} />
            </div>

        </Content>
    )
}

export default TgGroup