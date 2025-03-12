import { FC, useEffect, useState } from 'react'
import { NewDivProps, NewInputProps } from '../../interface/interface'
import { BsCheckLg } from 'react-icons/bs'
import { AiOutlineDoubleLeft } from 'react-icons/ai'


const OffCanvas: FC<NewDivProps> = ({ setToggle, toggle, children, className, ...props }) => {
    // const [toggles,setToggle] = useState(toggle)

    return (
        <div {...props} className="relative">
            <div onClick={() => setToggle(!toggle)} className={` transition-all duration-300 ${toggle ? 'opacity-100 z-[999] left-0' : 'opacity-0  z-[0] left-[-100%]'} fixed w-screen h-full  bg-transparent backdrop-blur-[10px]	top-0  `}>
            </div>
            <div className={` fixed w-[600px] h-full bg-[--bg] border   top-0 ${toggle ? 'right-0' : 'right-[-600px]'} duration-300 delay-75 z-[1000] p-5`}>
                <div onClick={() => setToggle(!toggle)} className="header flex text-white gap-5 items-center">
                    <span><AiOutlineDoubleLeft /></span>
                    <span>Ortga</span>
                </div>
                {children}

            </div>
        </div>
    )
}

export default OffCanvas