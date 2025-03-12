import React from 'react'
import Loader from '../componets/api/Loader'
import NavbarNew from './NavbarNew'

const Content = ({ loading, children }: { children: any, loading?: boolean }) => {
    return (

        <>
            <div className={`container-fluid mobile_contet size_16`}>
                {/* <Navbar /> */}
                <div className='my-1'>
                    <NavbarNew/>
                    {children}
                </div>
                {/* <Footer /> */}
            </div>
            <Loader loading={loading} />
        </>
    )
}

export default Content