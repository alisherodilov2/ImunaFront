import React from 'react'
import CounterpartyPaymentDesktop from './CounterpartyPaymentDesktop'
import CounterpartyPaymentMobile from './CounterpartyPaymentMobile'

const CounterpartyPayment = () => {
  return  window.innerWidth>992 ? <CounterpartyPaymentDesktop /> : <CounterpartyPaymentMobile />
}

export default CounterpartyPayment
