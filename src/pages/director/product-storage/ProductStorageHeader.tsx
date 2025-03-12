import React from 'react'
import { Link, NavLink } from 'react-router-dom'

const ProductStorageHeader = () => {
    return (
        <div className=' btn-group'>
            <NavLink to='/product-storage/product' className={({ isActive }) => isActive ? "btn btn-primary" : "btn btn-secondary"} >Maxsulot</NavLink>
            <NavLink to='/product-storage/category' className={({ isActive }) => isActive ? "btn btn-primary" : "btn btn-secondary"}>Kategoriya</NavLink>
            <NavLink to='/product-storage/reception' className={({ isActive }) => isActive ? "btn btn-primary" : "btn btn-secondary"}>Qabul qilish</NavLink>
            <NavLink to='/product-storage/repot' className={({ isActive }) => isActive ? "btn btn-primary" : "btn btn-secondary"}>Hisobot</NavLink>
            <NavLink to='/product-storage/material-repot' className={({ isActive }) => isActive ? "btn btn-primary" : "btn btn-secondary"}>materilni xarajat</NavLink>
            <NavLink to='/product-storage/order' className={({ isActive }) => isActive ? "btn btn-primary" : "btn btn-secondary"}>Buyurtmalar</NavLink>
            <NavLink to='/product-storage/repot-order' className={({ isActive }) => isActive ? "btn btn-primary" : "btn btn-secondary"}>Buyurtma hisoboti</NavLink>
            {/* <button className='btn btn-primary'>Maxsulot</button>
            <button className='btn btn-primary'>Maxsulot qabul qilish</button>
            <button className='btn btn-primary'>Hisobot</button> */}
        </div>
    )
}

export default ProductStorageHeader
