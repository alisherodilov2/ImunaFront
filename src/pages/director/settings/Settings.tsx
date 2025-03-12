import React, { useRef } from 'react'
import Content from '../../../layout/Content'
import Navbar from '../../../layout/Navbar'
import { useDispatch, useSelector } from 'react-redux'
import { ReducerType } from '../../../interface/interface'
import axios from 'axios'
import { AppDispatch } from '../../../service/store/store'
import { isSettingUpdate } from '../../../service/reducer/ProfileReducer'
import { FaPrint } from 'react-icons/fa'
import { testGenerateCheck } from '../../../helper/generateCheck'

const Settings = () => {
    const { user } = useSelector((state: ReducerType) => state.ProfileReducer)
    const [loading, setLoading] = React.useState(false)
    const dispatch = useDispatch<AppDispatch>()
    const send = async (e: any) => {
        try {
            setLoading(true)
            let res = await axios.post('/director-setting?' + e)
            const { result } = res.data
            dispatch(isSettingUpdate(result))
        }
        catch (error) {

        }

        finally {
            setLoading(false)

        }
    }
        const iframeRef = useRef<HTMLIFrameElement | null>(null);
    return (
        <Content loading={loading} >
            <Navbar />
            <div className="container-fluid flex-grow-1 container-p-y size_16 ">
                <div className="row">
                    <div className="col-lg-4">
                        <h3 className='text-center'>
                            Qabulxona sozlamalari
                        </h3>
                        <div className="row">
                            <div className="col-6">
                                <div>
                                    <p>Mijoz ro'yxatdan o'tkazish sozlamalari</p>
                                    <div className="demo-inline-spacing mt-3">
                                        <ul className="list-group">
                                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                                Tug'ilgan sanasi
                                                <div className="form-check form-switch cursor-pointer">
                                                    <input className="form-check-input float-end" type="checkbox" role="switch"
                                                        onChange={(e) => {
                                                            send(`is_reg_data_birth=${e.target.checked ? '1' : '0'}`)
                                                        }}
                                                        checked={+user?.setting?.is_reg_data_birth ? true : false}
                                                    />
                                                </div>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                                Fuqoroligi
                                                <div className="form-check form-switch cursor-pointer">
                                                    <input className="form-check-input float-end" type="checkbox" role="switch"
                                                        onChange={(e) => {
                                                            send(`is_reg_citizenship=${e.target.checked ? '1' : '0'}`)
                                                        }}
                                                        checked={+user?.setting?.is_reg_citizenship ? true : false}
                                                    />
                                                </div>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                                Manzili
                                                <div className="form-check form-switch cursor-pointer">
                                                    <input className="form-check-input float-end" type="checkbox" role="switch"
                                                        onChange={(e) => {
                                                            send(`is_reg_address=${e.target.checked ? '1' : '0'}`)
                                                        }}
                                                        checked={+user?.setting?.is_reg_address ? true : false}
                                                    />
                                                </div>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                                Passport
                                                <div className="form-check form-switch cursor-pointer">
                                                    <input className="form-check-input float-end" type="checkbox" role="switch"
                                                        onChange={(e) => {
                                                            send(`is_reg_pass_number=${e.target.checked ? '1' : '0'}`)
                                                        }}
                                                        checked={+user?.setting?.is_reg_pass_number ? true : false}
                                                    />
                                                </div>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                                Telefon raqami
                                                <div className="form-check form-switch cursor-pointer">
                                                    <input className="form-check-input float-end" type="checkbox" role="switch"
                                                        onChange={(e) => {
                                                            send(`is_reg_phone=${e.target.checked ? '1' : '0'}`)
                                                        }}
                                                        checked={+user?.setting?.is_reg_phone ? true : false}
                                                    />
                                                </div>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                                Jinsi
                                                <div className="form-check form-switch cursor-pointer">
                                                    <input className="form-check-input float-end" type="checkbox" role="switch"
                                                        onChange={(e) => {
                                                            send(`is_reg_sex=${e.target.checked ? '1' : '0'}`)
                                                        }}
                                                        checked={+user?.setting?.is_reg_sex ? true : false}
                                                    />
                                                </div>
                                            </li>

                                        </ul>
                                    </div>
                                </div>
                                <div className='my-2'>
                                    <p >Mijoz jadval sozlamalari</p>
                                    <div className="demo-inline-spacing mt-3">
                                        <ul className="list-group">
                                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                                ID
                                                <div className="form-check form-switch cursor-pointer">
                                                    <input className="form-check-input float-end" type="checkbox" role="switch"
                                                        onChange={(e) => {
                                                            send(`is_reg_person_id=${e.target.checked ? '1' : '0'}`)
                                                        }}
                                                        checked={+user?.setting?.is_reg_person_id ? true : false}
                                                    />
                                                </div>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                                Tolo'v
                                                <div className="form-check form-switch cursor-pointer">
                                                    <input className="form-check-input float-end" type="checkbox" role="switch"
                                                        onChange={(e) => {
                                                            send(`is_reg_pay=${e.target.checked ? '1' : '0'}`)
                                                        }}
                                                        checked={+user?.setting?.is_reg_pay ? true : false}
                                                    />
                                                </div>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                                Bo'lim
                                                <div className="form-check form-switch cursor-pointer">
                                                    <input className="form-check-input float-end" type="checkbox" role="switch"
                                                        onChange={(e) => {
                                                            send(`is_reg_department=${e.target.checked ? '1' : '0'}`)
                                                        }}
                                                        checked={+user?.setting?.is_reg_department ? true : false}
                                                    />
                                                </div>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                                Xizmatlar
                                                <div className="form-check form-switch cursor-pointer">
                                                    <input className="form-check-input float-end" type="checkbox" role="switch"
                                                        onChange={(e) => {
                                                            send(`is_reg_service=${e.target.checked ? '1' : '0'}`)
                                                        }}
                                                        checked={+user?.setting?.is_reg_service ? true : false}
                                                    />
                                                </div>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                                Navbat
                                                <div className="form-check form-switch cursor-pointer">
                                                    <input className="form-check-input float-end" type="checkbox" role="switch"
                                                        onChange={(e) => {
                                                            send(`is_reg_queue_number=${e.target.checked ? '1' : '0'}`)
                                                        }}
                                                        checked={+user?.setting?.is_reg_queue_number ? true : false}
                                                    />
                                                </div>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                                Status
                                                <div className="form-check form-switch cursor-pointer">
                                                    <input className="form-check-input float-end" type="checkbox" role="switch"
                                                        onChange={(e) => {
                                                            send(`is_reg_status=${e.target.checked ? '1' : '0'}`)
                                                        }}
                                                        checked={+user?.setting?.is_reg_status ? true : false}
                                                    />
                                                </div>
                                            </li>

                                        </ul>
                                    </div>
                                </div>
                                <div>
                                    <p>Rejim monoblok</p>
                                    <div className="demo-inline-spacing mt-3">
                                        <ul className="list-group">
                                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                                {+user?.setting?.is_reg_monoblok ? "O'chirish" : "Aktivlashtrish"}
                                                <div className="form-check form-switch cursor-pointer">
                                                    <input className="form-check-input float-end" type="checkbox" role="switch"
                                                        onChange={(e) => {
                                                            send(`is_reg_monoblok=${e.target.checked ? '1' : '0'}`)
                                                        }}
                                                        checked={+user?.setting?.is_reg_monoblok ? true : false}
                                                    />
                                                </div>
                                            </li>

                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div>
                                    <p>Mijoz Sahifa sozlamalari</p>
                                    <div className="demo-inline-spacing mt-3">
                                        <ul className="list-group">
                                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                                Statianar
                                                <div className="form-check form-switch cursor-pointer">
                                                    <input className="form-check-input float-end" type="checkbox" role="switch"
                                                        onChange={(e) => {
                                                            send(`is_reg_nav_statsionar=${e.target.checked ? '1' : '0'}`)
                                                        }}
                                                        checked={+user?.setting?.is_reg_nav_statsionar ? true : false}
                                                    />
                                                </div>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                                Grafik
                                                <div className="form-check form-switch cursor-pointer">
                                                    <input className="form-check-input float-end" type="checkbox" role="switch"
                                                        onChange={(e) => {
                                                            send(`is_reg_nav_graph=${e.target.checked ? '1' : '0'}`)
                                                        }}
                                                        checked={+user?.setting?.is_reg_nav_graph ? true : false}
                                                    />
                                                </div>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                                Muolaja
                                                <div className="form-check form-switch cursor-pointer">
                                                    <input className="form-check-input float-end" type="checkbox" role="switch"
                                                        onChange={(e) => {
                                                            send(`is_reg_nav_treatment=${e.target.checked ? '1' : '0'}`)
                                                        }}
                                                        checked={+user?.setting?.is_reg_nav_treatment ? true : false}
                                                    />
                                                </div>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                                Uyda
                                                <div className="form-check form-switch cursor-pointer">
                                                    <input className="form-check-input float-end" type="checkbox" role="switch"
                                                        onChange={(e) => {
                                                            send(`is_reg_nav_at_home=${e.target.checked ? '1' : '0'}`)
                                                        }}
                                                        checked={+user?.setting?.is_reg_nav_at_home ? true : false}
                                                    />
                                                </div>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                                Ombor
                                                <div className="form-check form-switch cursor-pointer">
                                                    <input className="form-check-input float-end" type="checkbox" role="switch"
                                                        onChange={(e) => {
                                                            send(`is_reg_nav_storage=${e.target.checked ? '1' : '0'}`)
                                                        }}
                                                        checked={+user?.setting?.is_reg_nav_storage ? true : false}
                                                    />
                                                </div>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                                Xarajatlar
                                                <div className="form-check form-switch cursor-pointer">
                                                    <input className="form-check-input float-end" type="checkbox" role="switch"
                                                        onChange={(e) => {
                                                            send(`is_reg_nav_expense=${e.target.checked ? '1' : '0'}`)
                                                        }}
                                                        checked={+user?.setting?.is_reg_nav_expense ? true : false}
                                                    />
                                                </div>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                                Xisob bo'limi
                                                <div className="form-check form-switch cursor-pointer">
                                                    <input className="form-check-input float-end" type="checkbox" role="switch"
                                                        onChange={(e) => {
                                                            send(`is_reg_nav_report=${e.target.checked ? '1' : '0'}`)
                                                        }}
                                                        checked={+user?.setting?.is_reg_nav_report ? true : false}
                                                    />
                                                </div>
                                            </li>

                                        </ul>
                                    </div>
                                </div>

                                <br />
                                <div>
                                    <p className='fw-bold'>To'lov turlari</p>
                                    <div className="demo-inline-spacing mt-3">
                                        <ul className="list-group">
                                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                                Plastik
                                                <div className="form-check form-switch cursor-pointer">
                                                    <input className="form-check-input float-end" type="checkbox" role="switch"
                                                        onChange={(e) => {
                                                            send(`is_reg_card_pay=${e.target.checked ? '1' : '0'}`)
                                                        }}
                                                        checked={+user?.setting?.is_reg_card_pay ? true : false}
                                                    />
                                                </div>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                                O'tkazma
                                                <div className="form-check form-switch cursor-pointer">
                                                    <input className="form-check-input float-end" type="checkbox" role="switch"
                                                        onChange={(e) => {
                                                            send(`is_reg_transfer_pay=${e.target.checked ? '1' : '0'}`)
                                                        }}
                                                        checked={+user?.setting?.is_reg_transfer_pay ? true : false}
                                                    />
                                                </div>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                                Aralash
                                                <div className="form-check form-switch cursor-pointer">
                                                    <input className="form-check-input float-end" type="checkbox" role="switch"
                                                        onChange={(e) => {
                                                            send(`is_reg_mix_pay=${e.target.checked ? '1' : '0'}`)
                                                        }}
                                                        checked={+user?.setting?.is_reg_mix_pay ? true : false}
                                                    />
                                                </div>
                                            </li>


                                        </ul>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                    <div className="col-lg-4">
                        <h3 className='text-center'>
                            Ulushlar
                        </h3>
                        <div className="row">
                            <div className="col-6">
                                <div>
                                    <p>Agent ulush sozlamalari</p>
                                    <div className="demo-inline-spacing mt-3">
                                        <ul className="list-group">
                                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                                Kounter agent
                                                <div className="form-check form-switch cursor-pointer">
                                                    <input className="form-check-input float-end" type="checkbox" role="switch"
                                                        onChange={(e) => {
                                                            send(`is_contribution_kounteragent=${e.target.checked ? '1' : '0'}`)
                                                        }}
                                                        checked={+user?.setting?.is_contribution_kounteragent ? true : false}
                                                    />
                                                </div>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                                Kounter shifokor
                                                <div className="form-check form-switch cursor-pointer">
                                                    <input className="form-check-input float-end" type="checkbox" role="switch"
                                                        onChange={(e) => {
                                                            send(`is_contribution_kt_doc=${e.target.checked ? '1' : '0'}`)
                                                        }}
                                                        checked={+user?.setting?.is_contribution_kt_doc ? true : false}
                                                    />
                                                </div>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                                Shifokor
                                                <div className="form-check form-switch cursor-pointer">
                                                    <input className="form-check-input float-end" type="checkbox" role="switch"
                                                        onChange={(e) => {
                                                            send(`is_contribution_doc=${e.target.checked ? '1' : '0'}`)
                                                        }}
                                                        checked={+user?.setting?.is_contribution_doc ? true : false}
                                                    />
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div>
                                    <p>Check sozlamalari</p>
                                    <div className="demo-inline-spacing mt-3">
                                        <ul className="list-group">
                                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                                chek hisoboti
                                                <div className="form-check form-switch cursor-pointer">
                                                    <input className="form-check-input float-end" type="checkbox" role="switch"
                                                        onChange={(e) => {
                                                            send(`is_chek_rectangle=${e.target.checked ? '1' : '0'}`)
                                                        }}
                                                        checked={+user?.setting?.is_chek_rectangle ? true : false}
                                                    />
                                                </div>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                                Umumiy to'lov
                                                <div className="form-check form-switch cursor-pointer">
                                                    <input className="form-check-input float-end" type="checkbox" role="switch"
                                                        onChange={(e) => {
                                                            send(`is_chek_total_price=${e.target.checked ? '1' : '0'}`)
                                                        }}
                                                        checked={+user?.setting?.is_chek_total_price ? true : false}
                                                    />
                                                </div>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                                Qarz modal oyna
                                                <div className="form-check form-switch cursor-pointer">
                                                    <input className="form-check-input float-end" type="checkbox" role="switch"
                                                        onChange={(e) => {
                                                            send(`is_debt_modal=${e.target.checked ? '1' : '0'}`)
                                                        }}
                                                        checked={+user?.setting?.is_debt_modal ? true : false}
                                                    />
                                                </div>
                                            </li>

                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="col-lg-4">
                        <div>
                            <h3 className='text-center'>
                                Chek
                            </h3>
                            <div className="demo-inline-spacing mt-3">
                                <ul className="list-group">
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        Logo
                                        <div className="form-check form-switch cursor-pointer">
                                            <input className="form-check-input float-end" type="checkbox" role="switch"
                                                onChange={(e) => {
                                                    send(`is_logo_chek=${e.target.checked ? '1' : '0'}`)
                                                }}
                                                checked={+user?.setting?.is_logo_chek ? true : false}
                                            />
                                        </div>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        Qr kod
                                        <div className="form-check form-switch cursor-pointer">
                                            <input className="form-check-input float-end" type="checkbox" role="switch"
                                                onChange={(e) => {
                                                    send(`is_qr_chek=${e.target.checked ? '1' : '0'}`)
                                                }}
                                                checked={+user?.setting?.is_qr_chek ? true : false}
                                            />
                                        </div>
                                    </li>
                                    <li className="list-group-item ">
                                        <label htmlFor="">
                                            Natija link
                                        </label>
                                        <div className="input-group">
                                            <input type="text" className='form-control' value={user?.setting?.result_domain}

                                                onChange={(e: any) => {
                                                    dispatch(isSettingUpdate({ ...user?.setting, result_domain: e.target.value }))
                                                }}
                                            />
                                            <button className='btn btn-primary'
                                                type='button'
                                                onClick={() => {
                                                    send(`result_domain=${user?.setting?.result_domain}`)
                                                }}

                                            >Saqlash</button>
                                        </div>
                                    </li>
                                    {/* <li className="list-group-item ">
                                        <label htmlFor="">
                                            Domain
                                        </label>
                                        <div className="input-group">
                                            <input type="text" className='form-control' value={user?.setting?.domain}
                                                onChange={(e: any) => {
                                                    dispatch(isSettingUpdate({ ...user?.setting, domain: e.target.value }))
                                                }}
                                            />
                                            <button className='btn btn-primary'
                                                type='button'
                                                onClick={() => {
                                                    send(`domain=${user?.setting?.domain}`)
                                                }}
                                            >Saqlash</button>
                                        </div>
                                    </li> */}
                                    <li className="list-group-item ">
                                        <label htmlFor="">
                                            logo Olcham
                                        </label>
                                        <div className="input-group">
                                            <input type="text" className='form-control' value={user?.setting?.logo_width}
                                                onChange={(e: any) => {
                                                    dispatch(isSettingUpdate({ ...user?.setting, logo_width: e.target.value }))
                                                }}
                                            />
                                            <span className="input-group-text">
                                                X
                                            </span>
                                            <input type="text" className='form-control' value={user?.setting?.logo_height}
                                                onChange={(e: any) => {
                                                    dispatch(isSettingUpdate({ ...user?.setting, logo_height: e.target.value }))
                                                }}
                                            />

                                            <button className='btn btn-warning'
                                                type='button'
                                                onClick={() => {
                                                    testGenerateCheck({
                                                        user: user,
                                                        iframeRef: iframeRef
                                                    })
                                                }}
                                            ><FaPrint /></button>
                                            <button className='btn btn-primary'
                                                type='button'
                                                onClick={() => {
                                                    send(`logo_height=${user?.setting?.logo_height}&logo_width=${user?.setting?.logo_width}`)
                                                }}
                                            >Saqlash</button>
                                        </div>
                                    </li>


                                </ul>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <iframe ref={iframeRef} style={{ display: 'none' }} title="print-frame" />
        </Content>
    )
}

export default Settings
