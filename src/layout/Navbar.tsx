// import { BiSearch, BiMenuAltLeft } from 'react-icons/bi'
// import { IoIosWarning, IoMdNotifications, IoMdUnlock } from 'react-icons/io'
// import { MdDarkMode, MdLightMode, MdOutlineZoomInMap, MdOutlineZoomOutMap } from 'react-icons/md'
// import { AiOutlineLogout } from 'react-icons/ai'
// import { useDispatch, useSelector } from 'react-redux'
// import { AppDispatch } from '../service/store/store'
// import { isDarkModeFunction, isFindFunction, isLoadingFunction, isMenuFunction, isSearchDataFunction, isSearchFunction } from '../service/reducer/MenuReducer'
// import { ReducerType } from '../interface/interface'
// import { isLogoutFunction, isUserCheck } from '../service/reducer/ProfileReducer'
// import { useEffect, useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { useLocation } from 'react-router-dom';
// import Time from '../componets/Time/Time'
// import axios from 'axios'
// import Swal from 'sweetalert2'
// import userImg from './users.svg'
// import Loader from '../componets/api/Loader'
// import Content from './Content'
// import messageImg from './icon/message.svg'
// import searchimg from './icon/search.svg'
// import Button from '../componets/buttons/Button'
// import { isAddAllOrder } from '../service/reducer/OrderReducer'
// import Input from '../componets/inputs/Input'
// import { handleFullScreen } from '../helper/fullScreen'
// import { formatPrice } from '../helper/formatPrice'
// import { isUnityGet } from '../service/reducer/UnityReducer'
// import { isCustomerGet } from '../service/reducer/CustomerReducer'
// import { NumericFormat } from 'react-number-format'
// import { DASHBOARD_SIDEBAR_LINKS } from '../lib/Navigation'
// import { nanoid } from '@reduxjs/toolkit'
// const Navbar = ({
//     url,
//     serachText,
//     setSerachText,
//     serachRole = false
// }: {
//     url?: string,
//     serachText?: string,
//     setSerachText?: any,
//     serachRole?: boolean
// }) => {


//     const Toast = Swal.mixin({
//         toast: true,
//         position: 'top-end',
//         timer: 2000,
//         showConfirmButton: false,
//         timerProgressBar: true
//     })
//     let { pathname } = useLocation();
//     const { user } = useSelector((state: ReducerType) => state.ProfileReducer)
//     const dispatch = useDispatch<AppDispatch>()
//     const path = useNavigate()
//     const { dark, menu, loading } = useSelector((state: ReducerType) => state.MenuReducer)
//     // const { currencyData } = useSelector((state: ReducerType) => state.CurrencyReducer)
//     // const { customerData, isLoading } = useSelector((state: ReducerType) => state.CustomerReducer)
//     // const { payOfficeData } = useSelector((state: ReducerType) => state.PayOfficeReducer)
//     // const [searchOpen, setSearchOpen] = useState(false)
//     // const { productData } = useSelector((state: ReducerType) => state.ProductReducer)
//     const time = new Date();
//     // const { handleClick,
//     //     screen } = handleFullScreen() as any;
//     useEffect(() => {

//     }, [])
//     time.setSeconds(time.getSeconds() + 600);
//     const pathNameCase = (path: string) => {
//         // const find = DASHBOARD_SIDEBAR_LINKS.find((item: any) => item?.route == path && item?.link == true
//         //     && new Set(item?.role ?? [])?.has(user?.role ?? '')
//         // );
//         // if (find) return find?.label
//         if (path.includes('/sell-product/user/') && path.includes('/repot')) {
//             return 'Hisobot'
//         }
//         if (path.includes('/in-payment/edit')) {
//             return 'Kirim & Chiqim tahrirlash'
//         }
//         if (path.includes('repot')) {
//             return 'Hisobot'
//         }
//         switch (path) {
//             case '/product':
//                 {

//                     return "Mahsulotlar"
//                 }
//             case '/customer':
//                 return "Mijozlar"
//             case '/master':
//                 return "Ustalar"
//             case '/order':
//                 return "Buyurtmalar"
//             case '/currency':
//                 return "Valyuta"
//             case '/repot':
//                 return "Hisobot"
//             case '/manager':
//                 return "Menejer"
//             case '/branch':
//                 return "Obyekt"
//             case '/pay-office':
//                 return "Kassa"
//             case '/unity':
//                 return "Birlik"
//             case '/custmer':
//                 return "Mijozlar"
//             case '/in-payment':
//                 return "Kirim & Chiqim"
//             case '/in-payment/create':
//                 return "Kirim & Chiqim kiritsh"
//             case '/user':
//                 return "Foydalnavchilar"
//             case '/category':
//                 return "Kategoriya"
//             case '/report-order':
//                 return "Hisobot"
//             case '/':
//                 return "Guruhlar"
//             case '/notification':
//                 return "Ogohlantirish"
//             case '/report-order/order-statistics':
//                 return "Statistika"
//             case '/profile/change':
//                 return "Profilni tahrirlash"
//             case '/profile/password-change':
//                 return "Parolni tahrirlash"
//             case '/profile':
//                 return "Shaxsiy kabinet"
//             case '/cost':
//                 return "Harajat"
//             case '/brend':
//                 return "Brend"

//             default:
//                 return ''
//         }

//     }

//     const useSerachQuery = (text: string) => {
//         if (text.trim().length > 0) {
//             // dispatch(isSearchDataFunction(productData.filter((item: any) => item?.name.includes(text) || item?.barcode.includes(text))))
//         }
//     }
//     // const { notificationData } = useSelector((state: ReducerType) => state.NotificationReducer)
//     // const { user } = useSelector((state: ReducerType) => state.ProfileReducer)
//     useEffect(() => {
//         document.querySelector('html')?.setAttribute('class', 'light-style layout-menu-fixed')
//         document.querySelector('html')?.setAttribute('data-theme', 'theme-default')
//         document.querySelector('html')?.setAttribute('data-template', 'vertical-menu-template-free')
//         // document.querySelector('html')?.setAttribute('class', 'light-style layout-menu-fixed layout-menu-expanded')
//     }, [])
//     const [nav, setNav] = useState(false)
//     const menuFun = () => {
//         setNav(!nav)
//         if (nav) {
//             document.querySelector('html')?.setAttribute('class', 'light-style layout-menu-fixed layout-menu-expanded')
//         } else {
//             document.querySelector('html')?.setAttribute('class', 'light-style layout-menu-fixed')
//         }
//     }

//     const { handleClick, screen } = handleFullScreen();
//     const [modal, setModal] = useState(false)
//     const [modal1, setModal1] = useState(false)

//     return (
//         <>
//             <nav className="layout-navbar container-fluid navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme sticky" id="layout-navbar">
//                 <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0">
//                     <button className="nav-item nav-link px-0 me-xl-4 btn"
//                         onClick={() => {
//                             dispatch(isMenuFunction())
//                         }}
//                     >
//                         <i className="bx bx-menu bx-sm" />
//                     </button>
//                 </div>
//                 <div className="navbar-nav-right d-flex  align-items-center" id="navbar-collapse">
//                     {/* Search */}
//                     <h4 className="fw-bold  mt-3">
//                         <span className="text-muted fw-light">
//                             {user?.hasOwnProperty('role') ? pathNameCase(pathname) : ''}
//                             {/* Bosh sahifa */}
//                         </span>
//                         {/* Account */}
//                     </h4>
//                     {/* {
//                     pathname.includes('in-payment/create') || pathname.includes('in-payment/edit') ?
//                         <h5 className=' pl-5 m-0 text-center text-danger container-p-y'>
//                             <IoIosWarning />
//                             Chiqishdan oldin saqlash tugmasini bosing!</h5> : ''
//                 } */}
//                     {/* /Search */}
//                     <ul className="navbar-nav flex-row align-items-center ms-auto gap-1">
//                         {/* Place this tag where you want the button to render. */}
//                         {/* <li>
//                         <Button>
//                         <Time expiryTimestamp={new Date()} />
//                         </Button>
//                     </li> */}


//                         {/* 
//                         <li className="nav-item ">
//                             <button className='btn text-danger' onClick={() => {
//                                 dispatch(isUserCheck())
//                                 dispatch(isPayOfficeGet(''))
//                                 dispatch(isBrachGet(''))
//                                 dispatch(isUnityGet())
//                                 dispatch(isCustomerGet(''))
//                                 dispatch(isCurrencyGet())
//                                 dispatch(isCategoryGet())
//                                 dispatch(isProductGet())
//                                 dispatch(isManagerGet())
//                                 dispatch(isInPaymentGet(''))
//                             }}>
//                                 <i className="tf-icons bx bx-reset" />
//                                 <span className="align-middle d-none d-lg-inline">Qayta Yuklash</span>
//                             </button>
//                         </li> */}
//                         {/* <li className="nav-item ">
//                             {
//                                 user?.tg_id > 0 ? `@${user.username}` :
//                                     <button onClick={() => {
//                                         axios.get('/tg-connect/1').then((res: any) => {
//                                             const { result } = res.data
//                                             window.open('https://t.me/kameradokon_bot?start=tg_connect' + result, '_blank');

//                                         })
//                                     }} className="btn btn-primary me-2">Telegram bot ulash</button>
//                             }
//                         </li> */}
//                         <li className="nav-item ">
//                             <button className='btn' onClick={() => {
//                                 handleClick()
//                             }}>
//                                 {
//                                     screen ?
//                                         <i className="bx bx-exit-fullscreen me-2" /> :
//                                         <i className="bx bx-fullscreen me-2" />
//                                 }
//                                 <span className="align-middle d-none d-lg-inline">
//                                     {/* {nanoid()} */}
//                                     Ekran
//                                     </span>
//                             </button>
//                         </li>

//                         {/* <li className="nav-item ">
//                             <a className="github-button" href="https://github.com/themeselection/sneat-html-admin-template-free" data-icon="octicon-star" data-size="large" data-show-count="true" aria-label="Star themeselection/sneat-html-admin-template-free on GitHub">{user?.name || 'Admin'}</a>
//                         </li> */}
//                         {/* User */}
//                         <li className="nav-item ">
//                             <button className="btn"
//                                 onClick={() => {
//                                     Swal.fire({
//                                         title: "Profildan chiqasizmi?",
//                                         showDenyButton: true,
//                                         showCancelButton: false,
//                                         confirmButtonText: 'Ha',
//                                         denyButtonText: `Yo'q`,
//                                     }).then((result) => {
//                                         if (result.isConfirmed) {
//                                             dispatch(isLoadingFunction(true))
//                                             axios.post('/logout')
//                                                 .then((res) => {
//                                                     dispatch(isLogoutFunction())
//                                                     Toast.fire('Profile chiqildi', '', 'success')
//                                                     path('/')
//                                                     dispatch(isLoadingFunction(false))
//                                                 })
//                                                 .catch(() => {
//                                                     dispatch(isLoadingFunction(false))
//                                                 })
//                                         }
//                                     })
//                                 }}
//                             >
//                                 <i className="bx bx-power-off me-2" /><span className="align-middle  d-none d-lg-inline">Chiqish</span>
//                             </button>
//                         </li>

//                         {/* vaqtinchalik */}
//                         <li className="nav-item">
//                             <div className="d-flex align-items-center gap-2" >
//                                 <div className="avatar avatar-online">
//                                     <img src={userImg} className="w-px-40 h-auto rounded-circle" />
//                                 </div>
//                                 <span className='d-none d-lg-block'>
//                                     {user?.name || 'Admin'}
//                                 </span>
//                             </div>
//                         </li>

//                         {/*/ User */}
//                     </ul>
//                 </div>
//                 {/* 
//                 <CurrencyAdd
//                     modal={modal} setModal={setModal} /> */}

//             </nav>
//             {/* <PayOfficeAdd
//                 modal={modal1} setModal={setModal1} /> */}

        
//             <Loader loading={loading} />
//         </>

//     )
// }

// export default Navbar

import React from 'react'

const Navbar = () => {
  return (
    <div>
      
    </div>
  )
}

export default Navbar
