import React, { useEffect, useState } from 'react'

import Table from '../../../../componets/table/Table'


import { read, utils, writeFileXLSX } from 'xlsx'
import { useDispatch, useSelector } from 'react-redux'
import { ReducerType } from '../../../../interface/interface'
import Swal from 'sweetalert2'



import { fullName } from '../../../../helper/fullName'

import { FaBoxOpen, FaCheckCircle, FaCircle, FaRegPlusSquare } from 'react-icons/fa'

import { Modal } from 'reactstrap'
import { formatId } from '../../../../helper/idGenerate'
import { NumericFormat } from 'react-number-format'
import { getCurrentDateTime } from '../../../../helper/dateFormat'
import { pay_type } from '../../../reception/expense/ExpenseAdd'
const RepotExpenseShow = ({
    data,
    modal,
    setModal,
    title = 'Muolajalar'
}: {
    data: any,
    modal: boolean,
    setModal: any,
    title?: string

}) => {
    const toggle = () => {
        setModal(!modal)
    }
    const [load, setLoad] = useState(false)


    const dataSelect = (data: any) => {
        return data?.map((item: any) => {
            return {
                value: item?.id, label: item?.name || item?.type,
                data: item
            }
        })
    }

    const { graph_achive, } = useSelector((state: ReducerType) => state.GraphReducer)
    const { treatmentData, } = useSelector((state: ReducerType) => state.TreatmentReducer)
    const { user, } = useSelector((state: ReducerType) => state.ProfileReducer)
    const [modaledit, setModaledit] = useState(false)
    const [modal2, setModal2] = useState(false)
    const [modal3, setModal3] = useState(false)
    const [item, setItem] = useState({} as any)
    const [item2, setItem2] = useState({} as any)
    const { page, clientData, massage, isLoading, isSuccess, pageLimit } = useSelector((state: ReducerType) => state.ClientReducer)
    // const [pageLmit, setPageLimit] = useState(() => 5)
    const [numberOfPages, setNumberOfPages] = useState(Math.ceil(clientData?.data?.length / pageLimit))
    const [checkData, setCheckData] = useState([] as any)
    const checkFun = (item: any) => {
        let resultCheck = checkData?.find((checkItem: any) => checkItem?.id === item?.id);
        if (resultCheck) {
            return checkData.filter((checkItem: any) => checkItem?.id !== item?.id)
        }
        return [...checkData, item]
    }




    const [serachText, setSerachText] = useState('')


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
                        
                        extraKeys={['date_', 'expense_type_', 'pay_type_', 'price_','comment_']}
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
                                key: 'date_',
                                render: (value: any, data: any) => {
                                    return <>
                                        {getCurrentDateTime(value?.created_at)}
                                    </>
                                }
                            },
                            {
                                title: 'Xizmat turi',
                                key: 'expense_type_',
                                render: (value: any, data: any) => {
                                    return <>
                                        {value?.expense_type?.name}
                                    </>
                                }
                            },
                            {
                                title: 'Tolov turi',
                                key: 'pay_type_',
                                render: (value: any, data: any) => {
                                    return pay_type?.find((item: any) => item?.value == value?.pay_type)?.label
                                }
                            },
                            {
                                title: 'Narxi',
                                key: 'price_',
                                render: (value: any, data: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={value?.price} />
                                }
                            },
                            {
                                title: 'Izoh',
                                key: 'comment_',
                                render: (value: any, data: any) => {
                                    return value?.comment
                                }
                            },

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

export default RepotExpenseShow