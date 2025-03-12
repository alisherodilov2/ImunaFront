import { FC, forwardRef, useState } from 'react'
import { NewDivProps, NewInputProps, NewSelectProps } from '../../interface/interface'
import { BsCheckLg } from 'react-icons/bs'
import ErrorInput from './ErrorInput'
import { useForm } from "react-hook-form";
import { nanoid } from '@reduxjs/toolkit';

const Select: FC<NewSelectProps> = forwardRef<HTMLSelectElement, NewSelectProps>(({ required = false, value, error, name='', className, placeholder, options = [],disabled=false ,...props }, ref: any) => {
    const [open, setOpen] = useState(false)
    // const [value, setValue] = useState({} as any)
    return (
        <>
            {/* <div className='relative'>
                <input type="text" 
                    value={value?.title}
                    onClick={() => setOpen(!open)} />
                <ul className={`min-h-[120px] min-h-[150px] overflow-scroll absolute w-full bg-transparent backdrop-blur-[10px]   transition ease-in-out  border border-[--input-border] rounded ${open ? 'h-auto opacity-100 z-[9999]' : 'h-0 opacity-0 hidden'}`}>
                    {
                        options?.map(((item: any) =>
                            <li className='w-full p-[10px] hover:bg-[#7267f0b3] cursor-pointer rounded' onClick={() => {
                                setValue(item)
                                setOpen(!open)
                            }}>
                                {item?.title}
                            </li>
                        ))
                    }
                </ul>
            </div> */}
            <select  ref={ref}  disabled={disabled}  {...props} name={name} value={value} required={required} className={`${className} select `} >
                <option value='' selected disabled hidden  >
                    <p className='plech'>
                        Choose here
                    </p>
                </option>
                {
                    options?.map(((item: any, index: number) =>
                        <option key={nanoid()} value={item.key}  >
                            <p className='w-full p-[10px]  cursor-pointer rounded'>
                                {item?.title}
                            </p>
                        </option>
                    ))
                }
            </select>
            <ErrorInput>
                {error}
            </ErrorInput>
        </>
    )
})

export default Select;