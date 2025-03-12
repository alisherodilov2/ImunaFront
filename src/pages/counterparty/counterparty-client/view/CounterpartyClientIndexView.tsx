import React from 'react'
import CounterpartyClientDesktop from '../CounterpartyClientDesktop'
import CounterpartyClientMobile from '../CounterpartyClientMobile'
import CounterpartyClientMobileView from './CounterpartyClientMobileView'
import Content from '../../../../layout/Content'

const CounterpartyClientIndexView = () => {
  return  window.innerWidth>992 ? <Content>1</Content> : <CounterpartyClientMobileView />
}

export default CounterpartyClientIndexView
