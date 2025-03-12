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
const ProductRepotShow = ({
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
                        extraKeys={[
                            'full_name',
                            'phone_',
                            'product_',
                            'product_category_',
                            'product_qty_',
                            'total_price_',

                            // 'data_birth_',
                            // 'person_id_',
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

                                        <b>{fullName(value.client)}</b>
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
                                    return `+998${value?.client?.phone}`
                                }
                            },
                            {
                                title: "Maxsulot",
                                key: 'product_',
                                render: (value: any, data: any) => {
                                    return value?.product?.name
                                }
                            },
                            {
                                title: "Maxsulot turi",
                                key: 'product_category_',
                                render: (value: any, data: any) => {
                                    return value?.product?.prodcut_category?.name
                                }
                            },
                            {
                                title: "Maxsulot soni",
                                key: 'product_qty_',
                                render: (value: any, data: any) => {
                                    return <NumericFormat displayType="text"
                                    thousandSeparator
                                    decimalScale={2}
                                    value={value?.product_qty} />
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
                            // {
                            //     title: 'ID',
                            //     key: 'person_id_',
                            //     render: (value: any, data: any) => {
                            //         // return (value?.sex)
                            //         return formatId(value?.person_id)
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

export default ProductRepotShow