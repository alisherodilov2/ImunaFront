import React, { useEffect, useState } from 'react'
import { NumericFormat } from 'react-number-format'
import { Modal } from 'reactstrap'
import Table from '../../../componets/table/Table'
import axios from 'axios'
import { dateFormat } from '../../../service/helper/day'
import Swal from 'sweetalert2'
import Loader from '../../../componets/api/Loader'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../service/store/store'
import { isEditReferringDoctorBalance } from '../../../service/reducer/ReferringDoctorReducer'

const CounterpartyPaymentAdd = ({
    data,
    setData,
    modal,
    setModal,
}: {
    modal: boolean,
    setModal: any,
    setData: any,
    data: any
}) => {
    const toggle = () => {
        setModal(!modal)
        setPaydata(() => [])
    }
    const togglepay = () => {
        setPaymodal(!payModal)
    }
    const [payModal, setPaymodal] = useState(false)
    const [payData, setPaydata] = useState([] as any)
    const [item, setItem] = useState({} as any)
    const [load, setLoad] = useState(false)
    const dispatch = useDispatch<AppDispatch>()
    const send = async (e: any) => {
        e.preventDefault();
        try {
            setLoad(() => true)
            let res = await axios.post(`/referring-doctor/item-pay/${data?.id}`, {
                price: item?.price,
                month: data.month,
                year: data.year,

            })
            Swal.fire({
                icon: 'success',
                title: 'Muvaffaqiyatli qo\'shildi',
                showConfirmButton: false,
                timer: 1500
            })
            const { result } = res.data
            // setData(() => result)
            setPaydata(() => result?.referring_doctor_pay)
            dispatch(isEditReferringDoctorBalance({
                id: data?.id,
                referring_doctor_balance: result?.referring_doctor_balance
            }))
            setPaymodal(false)
            setItem({})
        } catch (error) {
            console.log(error)
            setLoad(() => false)
        }
        finally {
            setLoad(() => false)
        }
    }
    useEffect(() => {
        if (modal && data.referring_doctor_pay?.length > 0) {
            setPaydata(() => data?.referring_doctor_pay)
        }
    }, [])
    return (
        <>
            <Modal centered={true} isOpen={modal} toggle={toggle} role='dialog' size='xl' backdrop="static" keyboard={false}>
                <div className="modal-header">
                    <h1 className="modal-title">Tolovlar</h1>
                    <button className='btn btn-primary' onClick={() => {
                        let pay_data = payData?.length > 0 ? payData : data?.referring_doctor_pay
                        let total_pay_summ = pay_data?.reduce((a: any, b: any) => a + +(b?.kounteragent_doctor_contribution_price ?? 0), 0)
                        let total_summ = data?.referring_doctor_balance?.reduce((a: any, b: any) => a + +(b?.total_kounteragent_doctor_contribution_price ?? 0), 0)
                        setItem({
                            price: total_summ - total_pay_summ
                        })
                        togglepay()
                    }}>Tolov qilish</button>
                </div>
                <div className="modal-body">
                    <div className="card" style={{
                        maxHeight: `${window.innerHeight / 1.5}px`,
                        overflow: 'auto'
                    }}>
                        <Table
                            paginationRole={false}
                            isLoading={false}
                            isSuccess={true}
                            extraKeys={[
                                'sana',
                                'price',
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
                                    title: 'Sana',
                                    key: 'sana',
                                    render: (value: any, data: any) => {
                                        return dateFormat(value?.created_at)
                                    }
                                },
                                {
                                    title: "Summa",
                                    key: 'price',
                                    render: (value: any, data: any) => {
                                        return <span className='text-success'>+
                                            <NumericFormat displayType="text"
                                                thousandSeparator
                                                decimalScale={2}
                                                value={value?.kounteragent_doctor_contribution_price} />
                                        </span>
                                    }
                                },
                            ]}
                            dataSource={
                                // []
                                payData?.length > 0 ? payData : data?.referring_doctor_pay
                            }
                        />
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn btn-danger" onClick={toggle}>Ortga</button>
                </div>
            </Modal>
            <Modal centered={true} isOpen={payModal} toggle={togglepay} role='dialog' backdrop="static" keyboard={false} >
                <form onSubmit={send}>

                    <div className="modal-header">
                        <h1 className="modal-title">
                            To'lov
                        </h1>
                    </div>
                    <div className="modal-body">

                        <div className="mb-1">
                            <label className="form-label">Kounterdoktor ulushi</label>
                            <NumericFormat
                                isAllowed={(e: any) => {
                                    const { value } = e
                                    let pay_data = payData?.length > 0 ? payData : data?.referring_doctor_pay
                                    let total_pay_summ = pay_data?.reduce((a: any, b: any) => a + +(b?.kounteragent_doctor_contribution_price ?? 0), 0)
                                    let total_summ = data?.referring_doctor_balance?.reduce((a: any, b: any) => a + +(b?.total_kounteragent_doctor_contribution_price ?? 0), 0)
                                    setItem({
                                        price: total_summ - total_pay_summ
                                    })
                                    return total_summ - total_pay_summ - +value >= 0
                                }}
                                value={item?.price}
                                thousandSeparator
                                onChange={(e: any) => {
                                    let value = +e.target.value.replace(/,/g, '') as any; // Virgullarni olib 
                                    setItem(() => {
                                        return {
                                            ...item,
                                            price: value
                                        }
                                    })
                                }}
                                className='form-control'

                            />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button className='btn btn-primary'>Saqlash</button>
                        <button className='btn btn-danger' onClick={togglepay} type='button'>Ortga</button>
                    </div>
                </form>


            </Modal>
            <Loader loading={load} />
        </>

    )
}

export default CounterpartyPaymentAdd
