import React from 'react'
import { Link, NavLink } from 'react-router-dom'

const MaterialExpenseHeader = () => {
    return (
        <div className=' btn-group'>
            <NavLink to='/expense' className={({ isActive }) => isActive ? "btn btn-primary" : "btn btn-secondary"} >Xarajatlar</NavLink>
            <NavLink to='/expense-type' className={({ isActive }) => isActive ? "btn btn-primary" : "btn btn-secondary"} >Xarajatlar turlari</NavLink>
            <NavLink to='/material-expense' className={({ isActive }) => isActive ? "btn btn-primary" : "btn btn-secondary"}>Materilani Xrajatlar</NavLink>
        </div>
    )
}

export default MaterialExpenseHeader
