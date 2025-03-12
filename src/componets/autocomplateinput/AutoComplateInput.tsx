import { FC, forwardRef, useState } from 'react'
import { NewInputProps } from '../../interface/interface'
import { BsCheckLg } from 'react-icons/bs'
import ErrorInput from '../inputs/ErrorInput'
import Table from '../table/Table'
import { FaChevronCircleDown, FaTimesCircle } from 'react-icons/fa'


const AutoComplateInput: FC<NewInputProps> = forwardRef<HTMLInputElement, NewInputProps>(({ complateComponet, required = false, value = '', readOnly, open = false, setOpen = function () { }, setTextComponet, error, name = '', type, className, placeholder, max, ...props }, ref) => {
    const [text, setText] = useState(value)

    return (
        <div className='relative'>
            <input key={name} max={max} required={required} ref={ref} readOnly={readOnly}  {...props} value={value} name={name} type={type} className={` ${error?.length ?? 0 > 0 ? 'border-[red]' : 'border-[--input-border]'} input ${className}`} placeholder={placeholder}
                onChange={(e: any) => {
                    setTextComponet(e.target.value.toString().trim().toLowerCase())
                    setText(e.target.value.toString().trim().toLowerCase())
                }}
                onFocus={() => {
                    setOpen(true)
                }}
            //   onBlur={() => {
            //     setOpen(false)
            //   }} 
            />
            {
                value?.length > 0 ?
                    <button className='absolute top-[50%] translate-y-[-50%] right-[40px] bg-[#ffb8b8] text-white flex justify-center items-center text-[20px]  h-full w-[40px]' type='button' onClick={() => {
                        setTextComponet('')
                    }}
                    >
                        <FaTimesCircle />
                    </button> : ''
            }
            <button className='absolute top-[50%] translate-y-[-50%] right-[0] bg-[#1a75ff] text-white flex justify-center items-center text-[20px] rounded-tr-[8px] rounded-br-[8px] h-full w-[40px]' type='button' onClick={() => {
                setOpen(!open)
            }}
            >
                <FaChevronCircleDown />
            </button>
            <ErrorInput>
                {error}
            </ErrorInput>
            {
                open ?
                    <div className='absolute autocomplate top-[35px] left-0 z-100 w-full bg-white  border '>
                        {
                            complateComponet
                        }
                    </div > : ''
            }
        </div >
    )
})

export default AutoComplateInput;