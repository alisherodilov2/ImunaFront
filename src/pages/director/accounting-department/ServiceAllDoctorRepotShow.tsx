import React from 'react'
import { formatId } from '../../../helper/idGenerate'
import { getCurrentDateTime } from '../../../helper/dateFormat'
import { fullName } from '../../../helper/fullName'
import Table from '../../../componets/table/Table'
import { Modal } from 'reactstrap'
import { NumericFormat } from 'react-number-format'

const ClientAllDoctorRepotShow = (
    {
        data,
        modal,
        setModal,
        title = 'Xizmatlar'
    }: {
        data: any,
        modal: boolean,
        setModal: any,
        title?: string
    }
) => {
    const toggle = () => {
        setModal(!modal)
    }
    return (
        <Modal centered={true} isOpen={modal} toggle={toggle} role='dialog' size='xl' backdrop="static" keyboard={false}>
            <div className="modal-header">
                <h5 className="modal-title">{title}</h5>
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
                    height: `${window.innerHeight / 1.4}px`,
                    overflow: 'auto'
                }}>
                    <Table
                        paginationRole={false}
                        isLoading={false}
                        isSuccess={true}
                        extraKeys={[
                            'service_name_',
                            'client_count_',
                            'total_price_',
                            'ulushi',
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
                                title: "Xizmat nomi",
                                key: 'service_name_',
                                renderItem: (value: any, data: any) => {
                                    return <td onClick={() => {
                                    }}>
                                        <b>{value?.service_name}</b>
                                        <br />
                                        {/* <span className='text-info register_date'  >
                                        {getCurrentDateTime(value?.client_item.at(-1).created_at)}
                                    </span> */}
                                    </td>
                                }
                            },
                            {
                                title: 'Xozmat soni',
                                key: 'client_count_',
                                render: (value: any, data: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={value?.service_count ?? 0} />
                                }
                            },
                            {
                                title: "Umumiy narxi",
                                key: 'total_price_',
                                render: (value: any, data: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={value?.total_price} />
                                }
                            },
                            {
                                title: "Ulushi",
                                key: 'ulushi',
                                render: (value: any, data: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={value?.total_doctor_contribution_price} />
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
                            data
                        }
                    />
                </div>
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

export default ClientAllDoctorRepotShow
