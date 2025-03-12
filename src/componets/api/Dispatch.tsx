import React from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../service/store/store'

export const dispatch = (props: any) => {
  const dis = useDispatch<AppDispatch>()
  return dis(props)
}

