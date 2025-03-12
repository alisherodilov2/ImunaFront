import React from 'react'
import RepotDesktop from './RepotDesktop'
import RepotMobile from './RepotMobile'

const Repot = () => {
  return  window.innerWidth>992 ? <RepotDesktop /> : <RepotMobile />
}

export default Repot
