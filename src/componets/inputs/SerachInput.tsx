import React, { useState } from 'react'
import { BiSearch } from 'react-icons/bi'
import { FaTimesCircle } from 'react-icons/fa'

const SerachInput = ({ value = '', getValue = function () { }, sendData = function () { }, clearSearch = function () { } }: { value: string, getValue: Function, sendData?: Function, clearSearch?: Function }) => {
    const [searchOpen, setSearchOpen] = useState(false)
    return (
        <div className='rounded-[30px] bg-[--bg-saidbar] p-[10px] '>
            <form className={' relative duration-300'} onSubmit={(e) => {
                e.preventDefault()
                sendData()
            }} >
                <button type='button' onClick={() => setSearchOpen(!searchOpen)} className='absolute top-[12px] duration-300 text-[20px] max-[1100px]:text-[16px]  left-[15px]'>
                    <BiSearch />
                </button>
                <input type="text"
                    onChange={(e) => {
                        getValue(e.target.value.trim().toLowerCase())
                    }}
                    value={value}
                    className={`${searchOpen ? 'max-[660px]:w-[100%]' : 'max-[660px]:w-[30px]'} w-[330px] bg-[--bg] pl-[42px] py-[10px] pr-[10px] max-[1100px]:py-[8px] max-[1100px]:w-[250px] duration-500 outline-none border-transparent rounded-[30px]  max-[660px]:pl-[35px]`} />

                <button type='button' onClick={() => clearSearch()} className={`${value.length>0 ?'scale-1' :'scale-0'} duration-300 absolute top-[12px] duration-300 text-[20px] max-[1100px]:text-[16px]  right-[15px]`}>
                    <FaTimesCircle />
                </button>
            </form>
        </div>
    )
}

export default SerachInput