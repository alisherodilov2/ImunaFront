import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { ReducerType } from '../../../interface/interface'
import Statistica from '../statistica/Statistica'
import Welcome from './Welcome'

const MainWelcome = () => {
    const { user, home_tab } = useSelector((state: ReducerType) => state.ProfileReducer)
    return <>
        {+user?.is_gijja ? home_tab == 0 ? <Welcome /> : <Statistica /> : <Welcome />}
    </>
}

export default MainWelcome
