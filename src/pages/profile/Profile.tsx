import { useState } from 'react'
import Content from '../../layout/Content'
import { FaFileUpload } from 'react-icons/fa'
import Button from '../../componets/buttons/Button'
import FileUpload from '../../componets/inputs/FileUpload'
import Navbar from '../../layout/Navbar'
import { useDispatch, useSelector } from 'react-redux'
import { ReducerType } from '../../interface/interface'
import { userRole } from '../../service/helper/UserRole'
import { AiFillEdit } from 'react-icons/ai'
import { MdEmail, MdOutlineDateRange, MdOutlinePassword, MdPhone } from 'react-icons/md'
import ButtonLink from '../../componets/buttons/ButtonLink'
import { isFindFunction } from '../../service/reducer/MenuReducer'
import { AppDispatch } from '../../service/store/store'
import userImg from '../../layout/users.svg'
import Layout from '../../layout/Layout'
import { NavLink } from 'react-router-dom'
import axios from 'axios'
const Profile = () => {
    const [file, setFile] = useState(null)
    const fileTypeRead = (file: any) => {
        switch (file?.type) {
        }
    }
    const dispatch = useDispatch<AppDispatch>()
    const { user } = useSelector((state: ReducerType) => state.ProfileReducer)
    return (
        <Content>
            <Navbar />
            <div className="container-xxl flex-grow-1 container-p-y">
                <div className="card">
                    <h5 className="card-header">Shaxsiy kabinet</h5>
                    {/* Account */}
                    <div className="card-body">
                        <div className="d-flex align-items-start align-items-sm-center gap-4">
                            <img src={userImg} alt="user-avatar" className="d-block rounded" height={100} width={100} id="uploadedAvatar" />
                            <div className="button-wrapper ">

                                <h3 className="text-muted mb-0">Tursunboyev Abdurasul</h3> <br />
                                <div className="d-flex">

                                    {/* <label htmlFor="upload" className="btn btn-primary me-2 mb-4" tabIndex={0}>
                                    <span className="d-none d-sm-block">Rasm qo'yish</span>
                                    <i className="bx bx-upload d-block d-sm-none" />
                                    <input type="file" id="upload" className="account-file-input" hidden accept="image/png, image/jpeg" />
                                </label> */}
                                    {/* <div>
                              <button type="submit" className="btn btn-primary me-2">Profilni o'zgartirish</button>
                              </div> */}
                                    <div>
                                        <NavLink to='/profile/password-change' type="submit" className="btn btn-primary me-2">Parolni o'zgartirish</NavLink>
                                        <button onClick={() => {
                                            axios.get('/tg-connect/1').then((res: any) => {
                                                const { result } = res.data
                                                window.open('https://t.me/kameradokon_bot?start=tg_connect'+result, '_blank');

                                            })
                                        }} className="btn btn-primary me-2">Telegram bot ulash</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </Content>
    )
}

export default Profile