import React, { useEffect, useState } from 'react'
import { FaBoxOpen, FaCheckSquare, FaCircle } from 'react-icons/fa'
import { fullName } from '../../../helper/fullName'
import { useSelector } from 'react-redux'
import { ReducerType } from '../../../interface/interface'
import axios from 'axios'
import Loader from '../../../componets/api/Loader'
import { Modal } from 'reactstrap'
import TableLoader from '../../../componets/table/TableLoader'
import { phoneFormatNumber } from '../../../helper/graphHelper'
import { calculateAge } from '../../../helper/calculateAge'

const CounterpartyDoctorRepotClient = (
    {
        item,
        modal,
        setModal
    }: {
        item: any,
        modal: boolean,
        setModal: any
    }
) => {
    const toggle = () => {
        setModal(false)
        setTab(0)
        setData({
            data:[]
        })
    }
    const { user } = useSelector((state: ReducerType) => state.ProfileReducer)
    const showClient = async (status?: any, full_name?: any) => {
        try {
            setLoad(() => true)
            let res = await axios.get(`/referring-doctor/treatment?show_id=${item?.show_id}&kontragent_id=${item?.kontragent_id}&status=${status ?? ''}&full_name=${full_name ?? ''}`)
            const { result } = res.data
            setData(() => result)
            // path(`/counterparty-client/${id}`)
        } catch (error) {
            // path('/')
        } finally {
            setLoad(() => false)
        }
    }
    useEffect(() => {
        if (modal) {
            showClient('ambulator')
        }
    }, [modal])


    const referringDoctorDataSelect = (data: any) => {
        if (data?.length > 0) {

            return data?.map((item: any) => {
                return {
                    value: item?.id, label: fullName(item),
                    data: item
                }
            })
        }
        return []
    }
    const [tab, setTab] = useState(0 as any)
    const [load, setLoad] = useState(0 as any)
    const [data, setData] = useState({
        data: []
    } as any)


    const statusIcon = (target: any, ishvaqti: any) => {
        if (target?.client_id > 0) {
            return <FaCheckSquare size={24} className='text-success' />
        }
        if (Date.parse(target?.agreement_date) >= Date.parse(user?.graph_format_date)
            // && isTimeGreater(ishvaqti, user?.time)
        ) {
            return <FaCircle size={24} className='text-warning' />
        }
        return <FaCircle size={24} className='text-danger' />
    }

    const statusGenerate = (data: any) => {
        switch (data) {
            case 1: return 'live';
            case 2: return 'fnish';
            case 3: return 'archive';
            default: return 'ambulator';
        }
    }
    return (
        <>
            <Modal centered={true} isOpen={modal} toggle={toggle} role='dialog' size='xl' backdrop="static" keyboard={false} >
                <div className="modal-body">

                    <div className="text-center my-2 btn-group w-100">
                        <button className={`btn ${tab == 0 ? 'btn-primary' : 'btn-secondary'}  `}
                            onClick={() => {
                                setTab(0)
                                showClient('ambulator')
                            }}
                        >Ambulator</button>
                        <button className={`btn ${tab == 1 ? 'btn-primary' : 'btn-secondary'}  `} onClick={() => {
                            setTab(1)
                            showClient('live')

                        }} >Muolaja</button>
                        <button className={`btn ${tab == 2 ? 'btn-primary' : 'btn-secondary'}  `} onClick={() => {
                            setTab(2)
                            showClient('finish')



                        }}>Yakunlangan</button>
                        <button className={`btn ${tab == 3 ? 'btn-primary' : 'btn-secondary'}  `} onClick={() => {
                            setTab(3)
                            showClient('archive')

                        }}>Arxivlangan</button>
                    </div>

                    {load ? <div className='bg-white rounded p-1 text-center d-flex  align-items-center gap-3 justify-content-center'>
                        <TableLoader />
                        <h4 className='mb-0'>Yuklanmoqda</h4>
                    </div> : ''}
                    {
                        !load && data?.data?.length == 0 ? <div className='bg-white rounded p-1 text-center d-flex  align-items-center gap-3 justify-content-center'>
                            <FaBoxOpen size={44} />
                            <h4 className='mb-0'>Malumot topilmadi</h4>
                        </div> : ''
                    }
                    {
                        data?.data?.client?.map((item: any) => (
                            <div className="d-flex gap-2 align-items-center border justify-content-between  my-2 p-1 rounded ">
                              <div className="d-flex gap-2">
                              <p className='fw-bold mb-0'>{fullName(item)}</p>
                                <p className='fw-bold mb-0'>+998 {phoneFormatNumber(item?.phone)}</p>
                                <p className='fw-bold mb-0'>Yoshi {calculateAge(item?.data_birth, user?.graph_format_date)}</p>
                              </div>
                                <div className="d-flex gap-2 justify-content-end w-auto align-items-center ">
                                    {
                                        item?.graph_achive?.map((graphItem:any)=>
                                            graphItem?.graph_archive_item?.map((dayItem:any,index:any)=>(
                                                <p className='mb-0'>
                                                    {index +1} - kun  {' '}
                                                {statusIcon(dayItem, graphItem.work_end_time)}
                                                </p>
                                            ))
                                        )
                                    }
                                </div>
                            </div>
                        ))
                    }



                </div>
                <div className="modal-footer">
                    <button className="btn btn-danger"
                        onClick={toggle}
                    >Ortga</button>
                </div>
            </Modal>
        </>

    )
}

export default CounterpartyDoctorRepotClient
