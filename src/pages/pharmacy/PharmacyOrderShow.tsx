import { useState } from "react"
import { Modal } from "reactstrap"
import Table from "../../componets/table/Table"
import { MdQrCodeScanner } from "react-icons/md"
import { NumericFormat } from "react-number-format"
import { dateFormat } from "../../service/helper/day"
import axios from "axios"
import { useDispatch } from "react-redux"
import { isEditProductOrder } from "../../service/reducer/ProductOrderReducer"
import Loader from "../../componets/api/Loader"
import Swal from "sweetalert2"
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    timer: 2000,
    showConfirmButton: false,
    timerProgressBar: true
})
const PharmacyOrderShow = ({
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
    const [productOrderItemDone, setProductOrderItemDone] = useState<any>([])
    const [sendLoading, setSendLoading] = useState(false)
    const dispatch = useDispatch()

    const sendDeliver = async (productItemDone: any) => {
        try {
            setSendLoading(() => true)
            let formdata = new FormData()
            formdata.append('status', 'shipped')
            formdata.append('product_order_item_done', JSON.stringify(productItemDone))
            const res = await axios.post(`/product-order/send-deliver/${data.id}`, formdata)
            const { result } = res.data
            dispatch(isEditProductOrder(result))
            setProductOrderItemDone(() => [])
            toggle()
            Toast.fire('Jonatildi', '', 'success')
        }
        catch {

        }
        finally {
            setSendLoading(() => false)
        }
    }
    return (
        <>
            <Modal centered={true} isOpen={modal} toggle={toggle} role='dialog' size='xl' backdrop="static" keyboard={false}>
                <div className="modal-header">
                    <div className="d-flex justify-content-between w-100">
                        <h5 className="modal-title">Buyurtma </h5>
                        <button className="btn btn-sm btn-primary" type="button">
                            {/* <MdQrCodeScanner size={24} /> */}
                        </button>
                    </div>
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
                                                            disabled={data?.status == 'processing' ? false : true}
                                                            value={productOrderItemDone?.find((item: any) => item?.id == res?.id) ? productOrderItemDone?.find((item: any) => item?.id == res?.id)?.qty : res?.qty}
                                                            thousandSeparator
                                                            isAllowed={(e: any) => {
                                                                console.log(e);
                                                                const { value } = e
                                                                console.log('res?.qty', res?.qty);
                                                                console.log('value', value);
                                                                return +res?.qty >= +value
                                                            }}
                                                            required
                                                            onChange={(e: any) => {
                                                                if (productOrderItemDone?.find((item: any) => item?.id == res?.id)) {
                                                                    setProductOrderItemDone(() => [...productOrderItemDone.map((item: any) => {
                                                                        if (item?.id == res?.id) {
                                                                            return {
                                                                                ...item,
                                                                                qty: e.target.value
                                                                            }
                                                                        }
                                                                        return item
                                                                    })])
                                                                } else {
                                                                    setProductOrderItemDone(() => [...productOrderItemDone, {
                                                                        ...res,
                                                                        qty: e.target.value
                                                                    }])
                                                                }
                                                            }
                                                            }
                                                            className='form-control'

                                                        />
                                                    </div>
                                                </div>
                                            )) : <p className="white-space fw-bold alert alert-danger">
                                                Omborda qolmagan
                                            </p>
                                    }
                                </div>
                            )
                        })
                    }
                </div>
                <div className="modal-footer">
                    {
                        data?.status == 'processing' ?
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => {
                                    let productItemDone = [] as any;
                                    let toatalqty = data?.product_order_item?.reduce((a: any, b: any) => a + +b?.qty, 0)
                                    productItemDone = data?.product_order_item?.flatMap((res: any) => res.product_order_item_done)
                                    for (let key of productItemDone) {
                                        let find = productOrderItemDone?.find((item: any) => item?.id == key?.id)
                                        if (find) {
                                            productItemDone = productItemDone?.map((item: any) => item?.id == key?.id ? find : item)
                                        }
                                    }
                                    if (toatalqty == productItemDone?.reduce((a: any, b: any) => a + +b?.qty, 0)) {
                                        sendDeliver(productItemDone)
                                    } else {
                                        alert('maxsulotlar toliq yuborilmadi!')
                                    }

                                    // sendDeliver()
                                }}
                            >
                                Yuborish
                            </button> : ''
                    }

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
            <Loader loading={sendLoading} />
        </>
    )
}

export default PharmacyOrderShow