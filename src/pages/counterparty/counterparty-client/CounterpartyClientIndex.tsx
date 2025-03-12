import React from 'react'
import CounterpartyClientDesktop from './CounterpartyClientDesktop'
import CounterpartyClientMobile from './CounterpartyClientMobile'

const CounterpartyClientIndex = () => {
  return window.innerWidth>992 ? <CounterpartyClientDesktop /> : <CounterpartyClientMobile />
}

export default CounterpartyClientIndex
