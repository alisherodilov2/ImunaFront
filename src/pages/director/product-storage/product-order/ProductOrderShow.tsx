import { useState } from "react"
import { Modal } from "reactstrap"
import Table from "../../../../componets/table/Table"
import { NumericFormat } from "react-number-format"
import { dateFormat } from "../../../../service/helper/day"

const ProductOrderShow = ({
    data,
    modal,
    setModal,
    title = 'Maxsulotlar'
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
    const [cash, setCash] = useState(false)

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
                {
                    data?.product_order_item?.map((item: any) => {
                        const { product_order_item_done } = item
                        return (
                            <div className="my-1">
                                <table className="table table-bordered  ">
                                    <tbody className="w-auto" >
                                        <tr className="w-auto">
                                            <td className="w-25"
                                            >
                                                <span>maxsulot nomi</span> <br />
                                                <h4 className="mb-0">  {item?.product?.name}</h4>
                                            </td>
                                            <td className="w-25">
                                                <span>Buyurtma</span> <br />
                                                <h4 className="mb-0">
                                                    {item?.qty}
                                                </h4>
                                            </td>
                                            <td className="w-25">
                                                <span>Yigildi</span> <br />
                                                <h4 className="mb-0">
                                                    {product_order_item_done?.reduce((a: any, b: any) => a + +b?.qty, 0)}
                                                </h4>
                                            </td>
                                        </tr>
                                    </tbody>

                                </table>
                                {
                                    product_order_item_done?.length > 0 ?
                                        product_order_item_done?.map((res: any) => (
                                            <div className="d-flex align-items-center gap-2 my-1">
                                                <div className="d-flex gap-4 align-items-center">
                                                    <p className="white-space fw-bold mb-0">{dateFormat(res?.created_at)} dan </p>
                                                    <p className="white-space fw-bold mb-0">  {dateFormat(res?.expiration_date)} gacha </p>
                                                </div>
                                                <div className="w-25">
                                                    <NumericFormat
                                                        disabled={true}
                                                        value={res?.qty}
                                                        thousandSeparator


                                                        className='form-control'

                                                    />
                                                </div>
                                            </div>
                                        )) : <p className="white-space fw-bold alert alert-danger">
                                            Malumot yo'q
                                        </p>
                                }
                            </div>
                        )
                    })
                }
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

export default ProductOrderShow