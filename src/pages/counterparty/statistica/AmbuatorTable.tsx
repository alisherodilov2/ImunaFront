import React from 'react'
import { formatId } from '../../../helper/idGenerate'
import { getCurrentDateTime } from '../../../helper/dateFormat'
import { fullName } from '../../../helper/fullName'
import Table from '../../../componets/table/Table'
import { Modal } from 'reactstrap'

const AmbuatorTable = (
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
                    height: `${window.innerHeight / 1.4}px`,
                    overflow: 'auto'
                }}>
                    <Table
                        paginationRole={false}
                        isLoading={false}
                        isSuccess={true}
                        extraKeys={[
                            'full_name',
                            'phone_',
                            'data_birth_',
                            'person_id_',
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

                                        <b>{fullName(value)}</b>
                                        <br />
                                        {/* <span className='text-info register_date'  >
                                        {getCurrentDateTime(value?.client_item.at(-1).created_at)}
                                    </span> */}
                                    </td>
                                }
                            },
                            {
                                title: 'Tel',
                                key: 'phone_',
                                render: (value: any, data: any) => {
                                    return `+998${value?.phone}`
                                }
                            },
                            {
                                title: 'Tugilgan sana',
                                key: 'data_birth_',
                                render: (value: any, data: any) => {
                                    return value.data_birth
                                }
                            },
                            {
                                title: 'ID',
                                key: 'person_id_',
                                render: (value: any, data: any) => {
                                    return formatId(value?.person_id)
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

export default AmbuatorTable
