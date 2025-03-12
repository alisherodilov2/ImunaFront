import React, { useState } from 'react'
import { formatId } from '../../../helper/idGenerate'
import { getCurrentDateTime } from '../../../helper/dateFormat'
import { fullName } from '../../../helper/fullName'
import Table from '../../../componets/table/Table'
import { Modal } from 'reactstrap'
import { NumericFormat } from 'react-number-format'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const ClientViewDesktop = (
    {
        data,
        modal,
        setModal
    }: {
        data: any,
        modal: boolean,
        setModal: any
    }
) => {
    const toggle = () => {
        setModal(!modal)
    }
    const {id}  = useParams()
    const [load,setLoad] = useState(false)
    const [datas,setData] = useState<any>({})
    const show = async (id: any,data:any) => {
        try {
            setLoad(() => true)
            let res = await axios.get(`/repot/counterparty/${id}?start_date=${data?.start_date}&end_date=${data?.end_date}`)
            const { result } = res.data
            setData(() => result)
        } catch (error) {

        } finally {
            setLoad(() => false)
        }
    }
    return (
        <Modal centered={true} isOpen={modal} toggle={toggle} role='dialog' size='xl' backdrop="static" keyboard={false}>
            <div className="modal-header">
                <h5 className="modal-title">Ambulator</h5>
                <button
                    type="button"
                    className="close btn-close"
                    data-dismiss="modal"
                    aria-label="Close"
                    onClick={toggle}
                >
                    {/* <span aria-hidden="true">&times;</span> */}
                </button>
            </div>
            <div className="modal-body">

                <div className="card" style={{
                    height: `${window.innerHeight / 1.5}px`,
                    overflow: 'auto'
                }}>
                    <Table
                        paginationRole={false}
                        isLoading={false}
                        isSuccess={true}
                        extraKeys={[
                            'full_name',
                            'phone_',
                            'total_price_',
                        ]}
                        columns={[
                            {
                                title: '№',
                                key: 'id',
                                renderItem: (value: any, data: any) => {
                                    return <td>
                                        <span>
                                            {(data?.index + 1)}
                                        </span>
                                    </td>
                                }
                            },
                            {
                                title: "F.I.O",
                                key: 'full_name',
                                renderItem: (value: any, data: any) => {
                                    return <td onClick={() => {
                                    }}>

                                        <b>{fullName(value?.client)}</b>
                                        <br />
                                        <span className='text-info register_date'  >
                                            {getCurrentDateTime(value?.client.created_at)}
                                        </span>
                                    </td>
                                }
                            },
                            {
                                title: 'Tel',
                                key: 'phone_',
                                render: (value: any, data: any) => {
                                    return `+998${value?.client?.phone}`
                                }
                            },

                            {
                                title: "Summa",
                                key: 'total_price_',
                                render: (value: any, data: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={value?.client?.total_price} />
                                }
                            },
                            // {
                            //     title: 'Tashriflar',
                            //     key: 'welcome_count_',
                            //     render: (value: any, data: any) => {
                            //         return <>
                            //             <NumericFormat displayType="text"
                            //                 thousandSeparator
                            //                 decimalScale={2}
                            //                 value={value?.welcome_count} /></>
                            //     }
                            // },




                        ]}
                        dataSource={
                            // []
                            data?.referring_doctor_balance
                        }
                    />
                </div>
                <h3 className='text-right'>Jami: <NumericFormat displayType="text" thousandSeparator decimalScale={2} value={data?.referring_doctor_balance?.reduce((a: any, b: any) => a + +b.total_price, 0)} /> </h3>
            </div>
            <div className="modal-footer">
                <button
                    type="button"
                    className="btn btn-secondary"
                    data-dismiss="modal"
                    onClick={toggle}
                >
                    Chiqish
                </button>
            </div>
        </Modal>

    )
}

export default ClientViewDesktop
