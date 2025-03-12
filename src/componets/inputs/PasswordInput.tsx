import { FC, forwardRef, useState } from 'react'
import { NewDivProps, NewInputProps } from '../../interface/interface'
import { BsCheckLg } from 'react-icons/bs'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import ErrorInput from './ErrorInput'


const PasswordInput: FC<NewDivProps> = forwardRef<HTMLInputElement, NewDivProps>(({ error, className, placeholder, name, ...props }, ref) => {
    const [eye, setEye] = useState(false)
    return (
        <div className="password relative">
            <input ref={ref} type={eye ? 'text' : "password"} className={`py-[17px] bg-transparent outline-none rounded-[16px] px-[24px] border ${error?.length ?? 0 > 0 ? 'border-[red]' : 'border-[--input-border]'} border-[1px] placeholder:text-[--grey-50] white text-[14px] font-[500] block w-full pr-[50px]`} placeholder={placeholder}  {...props} name={name} />
            <button type='button' className='absolute top-[20px] text-[25px] text-[--grey-50]  outline-none cursor-pointer  right-[13px]' onClick={() => setEye(!eye)}>
                {
                    eye ?
                        <AiOutlineEyeInvisible />
                        :
                        <AiOutlineEye />
                }
            </button>
            <ErrorInput>
                {error}
            </ErrorInput>
        </div>
    )
}
)
export default PasswordInput;