import React from 'react'
import ClientViewMobile from './ClientViewMobile'
import Content from '../../../layout/Content'

const ClientViewAll = () => {
    return window.innerWidth < 992 ? <ClientViewMobile /> : <Content>1</Content>
}

export default ClientViewAll
